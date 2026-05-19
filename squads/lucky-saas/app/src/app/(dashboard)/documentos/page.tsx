import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/layout/page-header'
import { DocumentosClient } from '@/components/documentos/DocumentosClient'
import type { DocPolicy, DocClient, DocToken, DocDeal } from '@/types/client'

export type { DocPolicy, DocClient, DocToken, DocDeal }

export default async function DocumentosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let policies: DocPolicy[] = []
  let clients: DocClient[] = []
  let tokens: DocToken[] = []
  let deals: DocDeal[] = []
  let plan = 'starter'

  if (user) {
    const brokerResult = await supabase
      .from('brokers')
      .select('id, plan')
      .eq('user_id', user.id)
      .single()
    const broker = brokerResult.data as { id: string; plan: string } | null

    if (broker) {
      plan = broker.plan

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sb = supabase as any

      const [policiesRes, clientsRes, tokensRes, dealsRes] = await Promise.all([
        supabase
          .from('policies')
          .select('id, ramo, seguradora, policy_number, start_date, end_date, premium_total, status, metadata, clients(name)')
          .eq('broker_id', broker.id)
          .in('status', ['ativa', 'vencida'])
          .order('end_date', { ascending: false }),
        supabase
          .from('clients')
          .select('id, name, phone, email')
          .eq('broker_id', broker.id)
          .order('name'),
        supabase
          .from('client_portal_tokens')
          .select('id, client_id, token, expires_at, created_at')
          .eq('broker_id', broker.id)
          .is('revoked_at', null)
          .order('created_at', { ascending: false }),
        sb
          .from('quote_requests')
          .select('id, ramo, created_at, clients(name), quote_items(seguradora, premium_total, is_recommended)')
          .eq('broker_id', broker.id)
          .order('created_at', { ascending: false })
          .limit(200),
      ])

      policies = (policiesRes.data ?? []) as DocPolicy[]
      clients = (clientsRes.data ?? []) as DocClient[]
      tokens = (tokensRes.data ?? []) as DocToken[]
      deals = (dealsRes.data ?? []) as DocDeal[]
    }
  }

  return (
    <>
      <PageHeader title="Documentos" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DocumentosClient
          policies={policies}
          clients={clients}
          tokens={tokens}
          deals={deals}
          plan={plan}
        />
      </div>
    </>
  )
}
