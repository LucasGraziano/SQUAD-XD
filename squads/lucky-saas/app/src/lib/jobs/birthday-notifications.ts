import { Resend } from 'resend'
import { getAgeFromBirthDate, getCrossSellSuggestionByAge } from '@/lib/clients/birthday-crosssell'
import { buildBirthdayEmailHtml } from '@/lib/email/templates'

type SupabaseClient = Awaited<ReturnType<typeof import('@/lib/supabase/server').createClient>>

interface BirthdayClient {
  id: string
  name: string
  phone: string | null
  email: string | null
  birth_date: string
  broker_id: string
}

export async function runBirthdayNotificationsJob(supabase: SupabaseClient): Promise<{ sent: number; errors: number }> {
  const sb = supabase as any
  const today = new Date()
  const month = today.getMonth() + 1
  const day = today.getDate()
  const year = today.getFullYear()
  const todayStr = today.toISOString().split('T')[0]

  // Find clients with birthday today
  const { data: clients, error } = await sb
    .from('clients')
    .select('id, name, phone, email, birth_date, broker_id')
    .not('birth_date', 'is', null)
    .filter('birth_date', 'not.is', null)

  if (error || !clients) return { sent: 0, errors: 1 }

  // Filter by month/day in memory (simpler than PostgreSQL function syntax)
  const birthdayClients: BirthdayClient[] = (clients as any[]).filter((c) => {
    if (!c.birth_date) return false
    const d = new Date(c.birth_date + 'T00:00:00')
    return d.getMonth() + 1 === month && d.getDate() === day
  })

  let sent = 0
  let errors = 0

  // Fetch unique brokers for birthday clients (to get broker name/phone)
  const brokerIds = [...new Set(birthdayClients.map((c) => c.broker_id))]
  const { data: brokersData } = await sb
    .from('brokers')
    .select('id, name, phone')
    .in('id', brokerIds)
  const brokersMap: Record<string, { name: string; phone: string | null }> = {}
  for (const b of (brokersData ?? []) as { id: string; name: string; phone: string | null }[]) {
    brokersMap[b.id] = b
  }

  const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

  for (const client of birthdayClients) {
    // Check if already notified this year
    const { data: existing } = await sb
      .from('birthday_notifications_log')
      .select('id')
      .eq('client_id', client.id)
      .eq('year', year)
      .maybeSingle()

    if (existing) continue

    const age = getAgeFromBirthDate(client.birth_date)
    const suggestion = getCrossSellSuggestionByAge(age)

    // Create in-app alert
    const { error: alertError } = await sb.from('alerts').insert({
      broker_id: client.broker_id,
      client_id: client.id,
      type: 'birthday',
      title: `Aniversário de ${client.name} 🎂`,
      description: `${client.name} faz ${age} anos hoje. Sugestão de cross-sell: ${suggestion}.`,
      scheduled_for: todayStr,
      status: 'pending',
      metadata: { suggestion, age: String(age), whatsapp_phone: client.phone ?? '' },
    })

    if (alertError) {
      errors++
      continue
    }

    // Send birthday email if client has email and Resend is configured
    if (resend && client.email) {
      const broker = brokersMap[client.broker_id]
      const html = buildBirthdayEmailHtml({
        clientName: client.name,
        age,
        brokerName: broker?.name ?? 'Seu corretor',
        brokerPhone: broker?.phone ?? undefined,
        suggestion,
      })
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL ?? 'noreply@premia.app',
        to: client.email,
        subject: `🎂 Feliz Aniversário, ${client.name}!`,
        html,
      }).catch(() => { /* silently ignore email errors — alert was already created */ })
    }

    // Mark as notified this year
    await sb.from('birthday_notifications_log').insert({
      client_id: client.id,
      broker_id: client.broker_id,
      year,
    })

    sent++
  }

  return { sent, errors }
}
