import { createClient } from '@/lib/supabase/server'
import { getPsychologist } from '@/lib/supabase/server-queries'
import { Header } from '@/components/layout/header'
import { AgendaClient } from './agenda-client'
import { startOfWeek, endOfWeek, addWeeks } from 'date-fns'

export default async function AgendaPage() {
  const psy = await getPsychologist()
  const supabase = await createClient()

  const today = new Date()
  const weekStart = startOfWeek(today, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(addWeeks(today, 1), { weekStartsOn: 1 })

  const [{ data: sessions }, { data: patients }] = await Promise.all([
    supabase
      .from('sessions')
      .select('*, patients(id, full_name, phone)')
      .eq('psychologist_id', psy?.id ?? '')
      .gte('scheduled_at', weekStart.toISOString())
      .lte('scheduled_at', weekEnd.toISOString())
      .order('scheduled_at', { ascending: true }),

    supabase
      .from('patients')
      .select('id, full_name, phone, session_price_cents, billing_cycle')
      .eq('psychologist_id', psy?.id ?? '')
      .eq('status', 'active')
      .order('full_name'),
  ])

  return (
    <>
      <Header title="Agenda" subtitle="Visão semanal" />
      <AgendaClient
        sessions={sessions ?? []}
        patients={patients ?? []}
        psychologistId={psy?.id ?? ''}
        defaultDuration={psy?.session_duration_minutes ?? 50}
        defaultPrice={psy?.session_price_cents ?? 20000}
        defaultBillingCycle={(psy?.billing_cycle ?? 'per_session') as 'per_session' | 'weekly' | 'monthly'}
      />
    </>
  )
}
