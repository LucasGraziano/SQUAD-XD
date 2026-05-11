import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/layout/sidebar'
import { getOverduePendenciesCount } from '@/app/actions/pendencies'

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

  if (user) {
    const brokerResult = await supabase
      .from('brokers')
      .select('id, name, plan')
      .eq('user_id', user.id)
      .single()
    const broker = brokerResult.data as { id: string; name: string; plan: string } | null
    if (broker) {
      brokerName = broker.name
      brokerPlan = broker.plan

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
        {children}
      </main>
    </div>
  )
}
