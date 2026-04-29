import { createClient } from '@/lib/supabase/server'
import { getPsychologist } from '@/lib/supabase/server-queries'
import { Header } from '@/components/layout/header'
import { format, startOfWeek, endOfWeek } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { DashboardClient } from './dashboard-client'

export default async function DashboardPage() {
  // getPsychologist is React.cache() — layout already called getUser, this reuses it
  const psy = await getPsychologist()
  const supabase = await createClient()

  const today = new Date()
  const weekStart = startOfWeek(today, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 })

  const [
    { count: totalPatients },
    { count: sessionsThisWeek },
    { count: criticalAlerts },
    { data: upcomingSessions },
    { data: recentPayments },
  ] = await Promise.all([
    supabase
      .from('patients')
      .select('*', { count: 'exact', head: true })
      .eq('psychologist_id', psy?.id ?? '')
      .eq('status', 'active'),

    supabase
      .from('sessions')
      .select('*', { count: 'exact', head: true })
      .eq('psychologist_id', psy?.id ?? '')
      .gte('scheduled_at', weekStart.toISOString())
      .lte('scheduled_at', weekEnd.toISOString()),

    supabase
      .from('abandonment_scores')
      .select('*', { count: 'exact', head: true })
      .eq('psychologist_id', psy?.id ?? '')
      .in('level', ['high', 'critical'])
      .eq('dismissed', false),

    supabase
      .from('sessions')
      .select('*, patients(full_name)')
      .eq('psychologist_id', psy?.id ?? '')
      .gte('scheduled_at', today.toISOString())
      .in('status', ['scheduled', 'confirmed'])
      .order('scheduled_at', { ascending: true })
      .limit(5),

    supabase
      .from('payments')
      .select('*, patients(full_name)')
      .eq('psychologist_id', psy?.id ?? '')
      .order('created_at', { ascending: false })
      .limit(4),
  ])

  const greeting = getGreeting()
  const firstName = psy?.full_name?.split(' ')[0] ?? 'Psicóloga'
  const dateFormatted = format(today, "EEEE, d 'de' MMMM", { locale: ptBR })

  return (
    <>
      <Header title={`${greeting}, ${firstName}`} subtitle={dateFormatted} />
      <DashboardClient
        stats={{
          totalPatients: totalPatients ?? 0,
          sessionsThisWeek: sessionsThisWeek ?? 0,
          criticalAlerts: criticalAlerts ?? 0,
          revenue: 0,
        }}
        upcomingSessions={upcomingSessions ?? []}
        recentPayments={recentPayments ?? []}
      />
    </>
  )
}

function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Bom dia'
  if (h < 18) return 'Boa tarde'
  return 'Boa noite'
}
