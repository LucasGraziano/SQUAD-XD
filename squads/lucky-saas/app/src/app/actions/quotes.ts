'use server'

// Backward compat re-exports — Epic 8 Deal Room
// Código novo deve importar de './deals' diretamente.
export {
  convertDealToPolicy as convertQuoteToApolice,
  type ConvertDealData as ConvertQuoteData,
} from './deals'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { createRenewalDeal } from './deals'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SB = any

async function getAuth() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { supabase, brokerId: null as string | null }
  const { data: rows } = await (supabase as SB)
    .from('brokers').select('id').eq('user_id', user.id)
    .order('created_at', { ascending: false }).limit(1)
  return { supabase, brokerId: (rows as { id: string }[] | null)?.[0]?.id ?? null }
}

// ── Story 7.5: Wrapper backward-compat (retorna quoteId em vez de dealId) ────

export async function createRenewalQuote(
  policyId: string
): Promise<{ quoteId?: string; error?: string }> {
  const result = await createRenewalDeal(policyId)
  return { quoteId: result.dealId, error: result.error }
}

// ── Story 7.8: Link de Compartilhamento ─────────────────────────────────────

export async function getShareableQuote(
  quoteId: string
): Promise<{ token?: string; error?: string }> {
  const { supabase, brokerId } = await getAuth()
  if (!brokerId) return { error: 'Não autenticado' }

  const sb = supabase as SB
  const { data, error } = await sb.from('quote_requests')
    .select('share_token')
    .eq('id', quoteId)
    .eq('broker_id', brokerId)
    .single()

  if (error || !data) return { error: 'Cotação não encontrada' }
  return { token: data.share_token }
}

export async function getQuoteByToken(
  token: string
): Promise<{ quote?: Record<string, unknown>; error?: string }> {
  const supabase = await createClient()
  const sb = supabase as SB

  const { data, error } = await sb.from('quote_requests')
    .update({ view_count: sb.rpc('increment', { x: 1 }), last_viewed_at: new Date().toISOString() })
    .eq('share_token', token)
    .select('*, clients(name, email, phone), quote_items(*)')
    .single()

  if (error || !data) {
    const { data: fallback, error: fe } = await sb.from('quote_requests')
      .select('*, clients(name, email, phone), quote_items(*)')
      .eq('share_token', token)
      .single()
    if (fe || !fallback) return { error: 'Proposta não encontrada' }
    return { quote: fallback }
  }
  return { quote: data }
}

export async function approveQuoteByToken(
  token: string
): Promise<{ success?: boolean; error?: string }> {
  const supabase = await createClient()
  const sb = supabase as SB

  const { data: current, error: fetchErr } = await sb.from('quote_requests')
    .select('id, status')
    .eq('share_token', token)
    .single()

  if (fetchErr || !current) return { error: 'Proposta não encontrada' }
  if (current.status !== 'sent') return { error: 'Proposta não está disponível para aprovação' }

  const { error } = await sb.from('quote_requests')
    .update({ status: 'approved', approved_at: new Date().toISOString() })
    .eq('share_token', token)

  if (error) return { error: error.message }
  return { success: true }
}

// ── Story 7.6: Criar Cotação a partir de Lead ────────────────────────────────

export async function createQuoteFromLead(
  leadId: string
): Promise<{ quoteId?: string; error?: string }> {
  const { supabase, brokerId } = await getAuth()
  if (!brokerId) return { error: 'Não autenticado' }

  const sb = supabase as SB

  const { data: lead, error: leadErr } = await sb.from('leads')
    .select('id, client_id, ramo, name')
    .eq('id', leadId)
    .eq('broker_id', brokerId)
    .single()

  if (leadErr || !lead) return { error: 'Lead não encontrado' }
  if (!lead.client_id) return { error: 'Vincule um cliente ao lead antes de criar cotação' }

  const { data: quote, error: quoteErr } = await sb.from('quote_requests').insert({
    broker_id:   brokerId,
    client_id:   lead.client_id,
    ramo:        lead.ramo ?? 'auto',
    notes:       `Originado do lead: ${lead.name}`,
    status:      'draft',
    lead_id:     leadId,
  }).select('id').single()

  if (quoteErr) return { error: quoteErr.message }

  revalidatePath('/cotacoes')
  revalidatePath('/deals')
  return { quoteId: quote.id }
}
