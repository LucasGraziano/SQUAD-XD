import { createClient } from '@/lib/supabase/server'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnySupabase = any

interface TokenRow {
  broker_id: string
  access_token: string
  refresh_token: string
  expires_at: string | null
  calendar_id: string
}

async function getBrokerId(): Promise<string | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data } = await supabase.from('brokers').select('id').eq('user_id', user.id).single()
  return (data as { id: string } | null)?.id ?? null
}

export async function getGoogleToken(brokerId: string): Promise<string | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('google_calendar_tokens')
    .select('*')
    .eq('broker_id', brokerId)
    .single()

  const row = data as TokenRow | null
  if (!row) return null

  const expiry = row.expires_at ? new Date(row.expires_at).getTime() : 0
  const needsRefresh = expiry > 0 && expiry - Date.now() < 5 * 60 * 1000

  if (!needsRefresh) return row.access_token

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      refresh_token: row.refresh_token,
      grant_type: 'refresh_token',
    }),
  })

  const refreshed = await res.json()
  if (!refreshed.access_token) return null

  const sb: AnySupabase = supabase
  await sb.from('google_calendar_tokens').update({
    access_token: refreshed.access_token,
    expires_at: new Date(Date.now() + refreshed.expires_in * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  }).eq('broker_id', brokerId)

  return refreshed.access_token
}

const EVENT_TYPE_LABELS: Record<string, string> = {
  followup: 'Follow-up',
  call: 'Ligação',
  meeting: 'Reunião',
  visit: 'Visita',
}

function buildDescription(params: {
  notes?: string | null
  clientName?: string | null
  eventType?: string
  durationMinutes: number
}) {
  const lines: string[] = []

  if (params.notes?.trim()) {
    lines.push(params.notes.trim())
    lines.push('')
  }

  if (params.clientName) lines.push(`👤 Cliente: ${params.clientName}`)
  if (params.eventType) lines.push(`📋 Tipo: ${EVENT_TYPE_LABELS[params.eventType] ?? params.eventType}`)
  lines.push(`⏱ Duração: ${params.durationMinutes} min`)
  lines.push('')
  lines.push('— Sincronizado via Premia')

  return lines.join('\n')
}

function buildEventBody(params: {
  title: string
  scheduledAt: string
  durationMinutes: number
  notes?: string | null
  clientName?: string | null
  eventType?: string
}) {
  const start = new Date(params.scheduledAt)
  const end = new Date(start.getTime() + params.durationMinutes * 60 * 1000)

  return {
    summary: params.title,
    description: buildDescription(params),
    colorId: '2', // Sage (green)
    start: { dateTime: start.toISOString(), timeZone: 'America/Sao_Paulo' },
    end: { dateTime: end.toISOString(), timeZone: 'America/Sao_Paulo' },
  }
}

export async function syncEventToGoogle(params: {
  brokerId: string
  eventId: string
  title: string
  scheduledAt: string
  durationMinutes: number
  notes?: string | null
  clientName?: string | null
  eventType?: string
  calendarId?: string
}): Promise<string | null> {
  const token = await getGoogleToken(params.brokerId)
  if (!token) return null

  const calId = params.calendarId ?? 'primary'

  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calId)}/events`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(buildEventBody(params)),
    }
  )

  const data = await res.json()

  if (!res.ok || !data.id) {
    console.error('[Google Calendar] syncEventToGoogle failed:', res.status, JSON.stringify(data))
    return null
  }

  return data.id
}

export async function updateEventInGoogle(params: {
  brokerId: string
  googleEventId: string
  title: string
  scheduledAt: string
  durationMinutes: number
  notes?: string | null
  clientName?: string | null
  eventType?: string
  calendarId?: string
}): Promise<boolean> {
  const token = await getGoogleToken(params.brokerId)
  if (!token) return false

  const calId = params.calendarId ?? 'primary'

  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calId)}/events/${params.googleEventId}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(buildEventBody(params)),
    }
  )

  if (!res.ok) {
    const data = await res.json()
    console.error('[Google Calendar] updateEventInGoogle failed:', res.status, JSON.stringify(data))
    return false
  }

  return true
}

export async function deleteEventFromGoogle(brokerId: string, googleEventId: string, calendarId = 'primary') {
  const token = await getGoogleToken(brokerId)
  if (!token) return

  await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/${googleEventId}`,
    {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    }
  )
}

export async function isGoogleConnected(brokerId: string): Promise<boolean> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('google_calendar_tokens')
    .select('broker_id')
    .eq('broker_id', brokerId)
    .maybeSingle()
  return !!data
}

export async function getGoogleCalendarInfo(brokerId: string): Promise<{ email: string | null; connected: boolean }> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('google_calendar_tokens')
    .select('google_email')
    .eq('broker_id', brokerId)
    .maybeSingle()
  const row = data as { google_email: string | null } | null
  return { email: row?.google_email ?? null, connected: !!row }
}

export { getBrokerId }
