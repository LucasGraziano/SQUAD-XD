import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/layout/page-header'
import { RelatoriosClient } from '@/components/relatorios/RelatoriosClient'
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
        {plan === 'starter' ? (
          <div className="flex items-center justify-center h-[400px]">
            <div className="text-center max-w-[360px]">
              <div className="w-12 h-12 rounded-full bg-[rgba(11,217,4,0.08)] flex items-center justify-center mx-auto mb-4">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 2C8 2 6.5 3.5 6.5 5.5C6.5 7.5 8 9 10 9C12 9 13.5 7.5 13.5 5.5C13.5 3.5 12 2 10 2Z" fill="#0BD904" />
                  <path d="M4 7C2 7 0.5 8.5 0.5 10.5C0.5 12.5 2 14 4 14C6 14 7.5 12.5 7.5 10.5C7.5 8.5 6 7 4 7Z" fill="#0BD904" opacity="0.7" />
                  <path d="M16 7C14 7 12.5 8.5 12.5 10.5C12.5 12.5 14 14 16 14C18 14 19.5 12.5 19.5 10.5C19.5 8.5 18 7 16 7Z" fill="#0BD904" opacity="0.7" />
                </svg>
              </div>
              <h3 className="text-[17px] font-bold text-[#0D0D0D] mb-2">
                Relatórios Avançados
              </h3>
              <p className="text-[14px] text-[#6B7280] mb-6 leading-relaxed">
                Acesse relatórios de carteira, forecast de comissões, taxa de retenção e análise por seguradora. Disponível no plano Profissional.
              </p>
              <a
                href="/configuracoes?tab=plano"
                className="inline-flex items-center justify-center h-10 px-6 rounded-[6px] bg-[#0BD904] text-[#0D0D0D] text-[14px] font-bold hover:bg-[#09c203] transition-colors"
              >
                Fazer upgrade — R$97/mês
              </a>
            </div>
          </div>
        ) : (
          <RelatoriosClient policies={policies} />
        )}
      </div>
    </>
  )
}
