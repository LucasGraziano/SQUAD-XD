import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const runtime = 'nodejs'

const RAMO_LABELS: Record<string, string> = {
  auto: 'Auto',
  vida: 'Vida',
  saude: 'Saúde',
  residencial: 'Residencial',
  empresarial: 'Empresarial',
  viagem: 'Viagem',
  responsabilidade_civil: 'RC',
  outros: 'Outros',
}

async function getAccessToken(refreshToken: string): Promise<string | null> {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  })
  const data = await res.json()
  return data.access_token ?? null
}

async function createCalendarEvent(token: string, calendarId: string, event: object): Promise<string | null> {
  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    }
  )
  const data = await res.json()
  return res.ok ? (data.id as string) : null
}

async function deleteCalendarEvent(token: string, calendarId: string, eventId: string): Promise<void> {
  await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/${eventId}`,
    { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }
  )
}

export async function POST(req: NextRequest) {
  const cronSecret = req.headers.get('x-cron-secret')
  if (cronSecret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()
  let created = 0
  let deleted = 0
  let errors = 0

  // Get all brokers on Equipe plan with Google Calendar connected
  const { data: tokens } = await supabase
    .from('google_calendar_tokens')
    .select('broker_id, refresh_token, calendar_id')
    .returns<{ broker_id: string; refresh_token: string; calendar_id: string }[]>()

  if (!tokens?.length) return NextResponse.json({ created: 0, deleted: 0 })

  // Filter to Equipe brokers only
  const brokerIds = tokens.map(t => t.broker_id)
  const { data: equipeBrokers } = await supabase
    .from('brokers')
    .select('id')
    .in('id', brokerIds)
    .eq('plan', 'broker')

  const equipeIds = new Set((equipeBrokers ?? []).map(b => b.id))
  const eligibleTokens = tokens.filter(t => equipeIds.has(t.broker_id))

  const today = new Date()
  const in90Days = new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000)

  for (const tokenRow of eligibleTokens) {
    const { broker_id, refresh_token, calendar_id } = tokenRow

    const accessToken = await getAccessToken(refresh_token)
    if (!accessToken) { errors++; continue }

    // 1. Create events for active policies expiring in next 90 days without a calendar event
    const { data: newPolicies } = await supabase
      .from('policies')
      .select('id, ramo, seguradora, end_date, policy_number, clients(name)')
      .eq('broker_id', broker_id)
      .eq('status', 'ativa')
      .gte('end_date', today.toISOString().split('T')[0])
      .lte('end_date', in90Days.toISOString().split('T')[0])
      .is('renewal_calendar_event_id', null)

    for (const policy of (newPolicies ?? []) as any[]) {
      try {
        const clientName = Array.isArray(policy.clients) ? policy.clients[0]?.name : policy.clients?.name
        const endDate = new Date(policy.end_date + 'T12:00:00')
        const eventDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000) // 7 days before
        const ramoLabel = RAMO_LABELS[policy.ramo] ?? policy.ramo

        const eventBody = {
          summary: `${ramoLabel} — ${clientName ?? 'Cliente'} vence`,
          description: [
            `Seguradora: ${policy.seguradora}`,
            policy.policy_number ? `Apólice: ${policy.policy_number}` : null,
            `Vencimento: ${new Intl.DateTimeFormat('pt-BR').format(endDate)}`,
            '',
            '— Sincronizado via Premia',
          ].filter(Boolean).join('\n'),
          colorId: '11', // Tomato (red) — urgency
          start: { date: eventDate.toISOString().split('T')[0] },
          end: { date: eventDate.toISOString().split('T')[0] },
          reminders: { useDefault: false, overrides: [{ method: 'email', minutes: 0 }, { method: 'popup', minutes: 480 }] },
        }

        const gcalEventId = await createCalendarEvent(accessToken, calendar_id, eventBody)
        if (gcalEventId) {
          await supabase.from('policies').update({ renewal_calendar_event_id: gcalEventId }).eq('id', policy.id)
          created++
        }
      } catch {
        errors++
      }
    }

    // 2. Remove calendar events for cancelled/inactive policies
    const { data: cancelledPolicies } = await supabase
      .from('policies')
      .select('id, renewal_calendar_event_id')
      .eq('broker_id', broker_id)
      .neq('status', 'ativa')
      .not('renewal_calendar_event_id', 'is', null)

    for (const policy of (cancelledPolicies ?? []) as any[]) {
      try {
        await deleteCalendarEvent(accessToken, calendar_id, policy.renewal_calendar_event_id)
        await supabase.from('policies').update({ renewal_calendar_event_id: null }).eq('id', policy.id)
        deleted++
      } catch {
        errors++
      }
    }
  }

  console.log(`[calendar-sync] created=${created} deleted=${deleted} errors=${errors}`)
  return NextResponse.json({ created, deleted, errors })
}
