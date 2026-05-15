import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/layout/page-header'
import { SinistrosClient } from '@/components/sinistros/SinistrosClient'
import type { Claim } from '@/types/claim'

export default async function SinistrosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let claims: Claim[] = []
  let plan = 'starter'
  let activePolicies: { id: string; policy_number?: string | null; ramo: string; seguradora: string; client_id: string; clients?: { name: string } | null }[] = []

  if (user) {
    const brokerResult = await supabase
      .from('brokers')
      .select('id, plan')
      .eq('user_id', user.id)
      .single()

    const broker = brokerResult.data as { id: string; plan: string } | null

    if (broker) {
      plan = broker.plan
      if (plan !== 'starter') {
        const [claimsRes, policiesRes] = await Promise.all([
          supabase
            .from('claims')
            .select('*, policies(policy_number, ramo, seguradora), clients(name, phone)')
            .eq('broker_id', broker.id)
            .order('created_at', { ascending: false }),
          supabase
            .from('policies')
            .select('id, policy_number, ramo, seguradora, client_id, clients(name)')
            .eq('broker_id', broker.id)
            .eq('status', 'ativa')
            .order('seguradora', { ascending: true }),
        ])

        claims = (claimsRes.data ?? []) as unknown as Claim[]
        activePolicies = (policiesRes.data ?? []) as typeof activePolicies
      }
    }
  }

  const openCount = claims.filter(c => c.status === 'open' || c.status === 'analyzing' || c.status === 'awaiting_docs').length

  return (
    <>
      <PageHeader
        title="Sinistros"
        subtitle={openCount > 0
          ? `${openCount} em aberto`
          : claims.length > 0 ? `${claims.length} sinistro${claims.length !== 1 ? 's' : ''}` : undefined
        }
      />
      <div className="flex-1 p-8">
        {plan === 'starter' ? (
          <div className="flex items-center justify-center h-[400px]">
            <div className="text-center max-w-[360px]">
              <div className="w-12 h-12 rounded-full bg-[rgba(11,217,4,0.08)] flex items-center justify-center mx-auto mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0BD904" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <h3 className="text-[17px] font-bold text-[#0D0D0D] mb-2">Tracking de Sinistros</h3>
              <p className="text-[14px] text-[#6B7280] mb-6 leading-relaxed">
                Registre e acompanhe sinistros com histórico completo de atualizações. Disponível no plano Profissional.
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
          <SinistrosClient claims={claims} activePolicies={activePolicies} />
        )}
      </div>
    </>
  )
}
