import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { PropostaPublicView } from '@/components/propostas/PropostaPublicView'

interface Props {
  params: Promise<{ token: string }>
}

export const dynamic = 'force-dynamic'

export default async function PropostaPage({ params }: Props) {
  const { token } = await params

  let supabase
  try {
    supabase = createAdminClient()
  } catch {
    notFound()
  }

  // Increment view count
  await supabase
    .from('quote_requests')
    .update({ view_count: supabase.rpc('increment_view_count', { quote_token: token }), last_viewed_at: new Date().toISOString() })
    .eq('share_token', token)

  const { data: quote, error } = await supabase
    .from('quote_requests')
    .select('*, clients(name, email, phone), quote_items(*)')
    .eq('share_token', token)
    .single()

  if (error || !quote) notFound()

  const typedQuote = quote as {
    id: string
    status: string
    ramo: string
    object_description: string | null
    notes: string | null
    view_count: number
    clients: { name: string; email: string | null; phone: string } | null
    quote_items: Array<{
      id: string
      seguradora: string
      premium_total: number
      payment_frequency: string
      coverages: string[]
      exclusions: string[]
      broker_note: string | null
      is_recommended: boolean
    }>
  }

  return <PropostaPublicView quote={typedQuote} token={token} />
}
