import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/layout/sidebar'
import { BrokerPlanProvider } from '@/contexts/BrokerPlanContext'
import { ServiceWorkerRegistrar } from '@/components/notifications/PushPermissionPrompt'
import { getOverduePendenciesCount } from '@/app/actions/pendencies'
import { FirstWinBanner } from '@/components/dashboard/FirstWinBanner'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let brokerName = ''
  let brokerPlan = ''
  let pendingAlertsCount = 0
  let expiringPoliciesCount = 0
  let overduePendenciesCount = 0
  let showFirstWin = false

  if (user) {
    const brokerResult = await supabase
      .from('brokers')
      .select('id, name, plan, first_alert_fired_at, first_win_seen_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const broker = (brokerResult.data as any)?.[0] as { id: string; name: string; plan: string; first_alert_fired_at: string | null; first_win_seen_at: string | null } | null
    if (broker) {
      brokerName = broker.name
      brokerPlan = broker.plan
      showFirstWin = !!(broker.first_alert_fired_at && !broker.first_win_seen_at)

      const in30Days = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      const today = new Date().toISOString().split('T')[0]

      const [alertsResult, expiringResult] = await Promise.all([
        supabase
          .from('alerts')
          .select('id', { count: 'exact', head: true })
          .eq('broker_id', broker.id)
          .eq('status', 'pending'),
        supabase
          .from('policies')
          .select('id', { count: 'exact', head: true })
          .eq('broker_id', broker.id)
          .eq('status', 'ativa')
          .lte('end_date', in30Days)
          .gte('end_date', today),
      ])

      pendingAlertsCount = alertsResult.count ?? 0
      expiringPoliciesCount = expiringResult.count ?? 0
      overduePendenciesCount = await getOverduePendenciesCount()
    }
  }

  return (
    <div className="flex min-h-screen bg-[#F8F8F8]">
      <Sidebar brokerName={brokerName} brokerPlan={brokerPlan} pendingAlertsCount={pendingAlertsCount} expiringPoliciesCount={expiringPoliciesCount} overduePendenciesCount={overduePendenciesCount} />
      <main className="flex-1 ml-[240px] flex flex-col min-h-screen">
        <BrokerPlanProvider plan={brokerPlan}>
          <ServiceWorkerRegistrar />
          <FirstWinBanner visible={showFirstWin} />
          {children}
        </BrokerPlanProvider>
      </main>
    </div>
  )
}
