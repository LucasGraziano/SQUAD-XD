import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/layout/page-header'
import { RelatoriosClient } from '@/components/relatorios/RelatoriosClient'
import { PlanGate } from '@/components/shared/PlanGate'
import type { PolicyRow } from '@/types/policy'

export type { PolicyRow }

export default async function RelatoriosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let policies: PolicyRow[] = []
  let plan: string = 'starter'

  if (user) {
    const brokerResult = await supabase
      .from('brokers')
      .select('id, plan')
      .eq('user_id', user.id)
      .single()

    const broker = brokerResult.data as { id: string; plan: string } | null

    if (broker) {
      plan = broker.plan
      const { data } = await supabase
        .from('policies')
        .select('id, ramo, seguradora, start_date, end_date, premium_total, commission_pct, commission_expected, status, created_at')
        .eq('broker_id', broker.id)
        .order('start_date', { ascending: false })

      policies = (data ?? []) as PolicyRow[]
    }
  }

  const totalPolicies = policies.length
  const activePolicies = policies.filter(p => p.status === 'ativa').length

  const subtitle = totalPolicies > 0
    ? `${totalPolicies} apólice${totalPolicies !== 1 ? 's' : ''} · ${activePolicies} ativa${activePolicies !== 1 ? 's' : ''}`
    : undefined

  return (
    <>
      <PageHeader title="Relatórios" subtitle={subtitle} />
      <div className="flex-1 p-8">
        <PlanGate requiredPlan="pro" feature="relatorios-avancados" currentPlan={plan}>
          <RelatoriosClient policies={policies} />
        </PlanGate>
      </div>
    </>
  )
}
