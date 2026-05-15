import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/layout/page-header'
import { CotacoesClient } from '@/components/cotacoes/CotacoesClient'
import type { QuoteRequest } from '@/types/quote'
import type { DocClient } from '@/app/(dashboard)/documentos/page'

export default async function CotacoesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let quotes: QuoteRequest[] = []
  let clients: DocClient[] = []
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
      if (plan !== 'starter') {
        const [quotesRes, clientsRes] = await Promise.all([
          supabase
            .from('quote_requests')
            .select('*, clients(id, name, phone, email), quote_items(*)')
            .eq('broker_id', broker.id)
            .order('created_at', { ascending: false }),
          supabase
            .from('clients')
            .select('id, name, phone, email')
            .eq('broker_id', broker.id)
            .order('name'),
        ])
        quotes = (quotesRes.data ?? []) as QuoteRequest[]
        clients = (clientsRes.data ?? []) as DocClient[]
      }
    }
  }

  return (
    <>
      <PageHeader title="Multicálculo" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <CotacoesClient quotes={quotes} clients={clients} plan={plan} />
      </div>
    </>
  )
}
