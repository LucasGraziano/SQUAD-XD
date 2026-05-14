import { getAgeFromBirthDate, getCrossSellSuggestionByAge } from '@/lib/clients/birthday-crosssell'

type SupabaseClient = Awaited<ReturnType<typeof import('@/lib/supabase/server').createClient>>

interface BirthdayClient {
  id: string
  name: string
  phone: string | null
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
    .select('id, name, phone, birth_date, broker_id')
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
