'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

async function getAuth() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { supabase, brokerId: null as string | null }
  const { data: broker } = await (supabase as any).from('brokers').select('id').eq('user_id', user.id).single()
  return { supabase, brokerId: (broker as { id: string } | null)?.id ?? null }
}

// ── Story 7.4: Converter Proposta Aprovada → Apólice ────────────────────────

export interface ConvertQuoteData {
  numero_apolice: string
  vigencia_inicio: string  // ISO date YYYY-MM-DD
  vigencia_fim: string     // ISO date YYYY-MM-DD
  comissao_pct?: number
  premio_override?: number
}

export async function convertQuoteToApolice(
  quoteId: string,
  data: ConvertQuoteData
): Promise<{ apoliceId?: string; error?: string }> {
  const { supabase, brokerId } = await getAuth()
  if (!brokerId) return { error: 'Não autenticado' }

  const sb = supabase as any

  // 1. Fetch quote with items
  const { data: quote, error: quoteErr } = await sb.from('quote_requests')
    .select('*, quote_items(*), clients(id)')
    .eq('id', quoteId)
    .eq('broker_id', brokerId)
    .single()

  if (quoteErr || !quote) return { error: 'Cotação não encontrada' }
  if (quote.status !== 'approved') return { error: 'Apenas cotações aprovadas podem ser convertidas' }

  const items: { seguradora: string; premium_total: number; is_recommended: boolean }[] = quote.quote_items ?? []
  const recommended = items.find(i => i.is_recommended) ?? items[0]
  if (!recommended) return { error: 'Adicione pelo menos uma seguradora à cotação antes de converter' }

  const premio = data.premio_override ?? recommended.premium_total
  const comissao = data.comissao_pct ?? 5

  // 2. Insert policy
  const { data: policy, error: policyErr } = await sb.from('policies').insert({
    broker_id: brokerId,
    client_id: quote.client_id,
    policy_number: data.numero_apolice.trim(),
    ramo: quote.ramo,
    seguradora: recommended.seguradora,
    start_date: data.vigencia_inicio,
    end_date: data.vigencia_fim,
    premium_total: premio,
    payment_frequency: 'anual',
    commission_pct: comissao,
    status: 'ativa',
    notes: quote.notes ? `Gerada de cotação: ${quote.notes}` : null,
    metadata: { quote_request_id: quoteId, auto_generated: true },
  }).select('id').single()

  if (policyErr) return { error: policyErr.message }

  // 3. Update quote status to 'contracted' and link apolice
  await sb.from('quote_requests').update({
    status: 'contracted',
    contracted_at: new Date().toISOString(),
    apolice_id: policy.id,
  }).eq('id', quoteId).eq('broker_id', brokerId)

  await sb.from('quote_status_history').insert({
    quote_id: quoteId,
    broker_id: brokerId,
    from_status: 'approved',
    to_status: 'contracted',
  })

  // 4. Generate renewal alerts (60, 30, 15, 7, 1 days before end_date)
  const endDate = new Date(data.vigencia_fim)
  const alertDays = [60, 30, 15, 7, 1]
  const alerts = alertDays.map(days => {
    const scheduledFor = new Date(endDate)
    scheduledFor.setDate(scheduledFor.getDate() - days)
    return {
      broker_id: brokerId,
      policy_id: policy.id,
      days_before: days,
      scheduled_for: scheduledFor.toISOString().split('T')[0],
      status: 'pending',
    }
  }).filter(a => new Date(a.scheduled_for) > new Date())

  if (alerts.length > 0) {
    await sb.from('alerts').insert(alerts)
  }

  revalidatePath('/cotacoes')
  revalidatePath('/apolices')

  return { apoliceId: policy.id }
}

// ── Story 7.5: Criar Proposta de Renovação ───────────────────────────────────

export async function createRenewalQuote(
  policyId: string
): Promise<{ quoteId?: string; error?: string }> {
  const { supabase, brokerId } = await getAuth()
  if (!brokerId) return { error: 'Não autenticado' }

  const sb = supabase as any

  // Check for existing renewal quote
  const { data: policy, error: policyErr } = await sb.from('policies')
    .select('*, clients(id, name)')
    .eq('id', policyId)
    .eq('broker_id', brokerId)
    .single()

  if (policyErr || !policy) return { error: 'Apólice não encontrada' }

  if (policy.renewal_quote_id) {
    return { quoteId: policy.renewal_quote_id }
  }

  const clientName = policy.clients?.name ?? 'Cliente'
  const ramo = policy.ramo

  // Create renewal quote_request
  const { data: quote, error: quoteErr } = await sb.from('quote_requests').insert({
    broker_id: brokerId,
    client_id: policy.client_id,
    ramo,
    object_description: `Renovação — ${policy.policy_number ?? ramo}`,
    notes: `Renovação da Apólice ${policy.policy_number ?? '#sem número'} — Venc. ${policy.end_date}`,
    status: 'draft',
  }).select('id').single()

  if (quoteErr) return { error: quoteErr.message }

  // Pre-create quote item with current seguradora/premio
  await sb.from('quote_items').insert({
    quote_request_id: quote.id,
    broker_id: brokerId,
    seguradora: policy.seguradora,
    premium_total: policy.premium_total,
    payment_frequency: policy.payment_frequency ?? 'anual',
    is_recommended: false,
    broker_note: 'Ponto de partida — edite antes de enviar ao cliente',
  })

  // Link renewal quote to policy
  await sb.from('policies').update({ renewal_quote_id: quote.id }).eq('id', policyId)

  revalidatePath('/apolices')
  revalidatePath('/alertas')

  return { quoteId: quote.id }
}

// ── Story 7.8: Link de Compartilhamento ─────────────────────────────────────

export async function getShareableQuote(
  quoteId: string
): Promise<{ token?: string; error?: string }> {
  const { supabase, brokerId } = await getAuth()
  if (!brokerId) return { error: 'Não autenticado' }

  const sb = supabase as any
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
  const sb = supabase as any

  // Increment view count + update last_viewed_at
  const { data, error } = await sb.from('quote_requests')
    .update({ view_count: sb.rpc('increment', { x: 1 }), last_viewed_at: new Date().toISOString() })
    .eq('share_token', token)
    .select('*, clients(name, email, phone), quote_items(*)')
    .single()

  if (error || !data) {
    // Try fetch without update on error (e.g., RPC not available)
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
  const sb = supabase as any

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

  const sb = supabase as any

  const { data: lead, error: leadErr } = await sb.from('leads')
    .select('id, client_id, ramo, name')
    .eq('id', leadId)
    .eq('broker_id', brokerId)
    .single()

  if (leadErr || !lead) return { error: 'Lead não encontrado' }
  if (!lead.client_id) return { error: 'Vincule um cliente ao lead antes de criar cotação' }

  const { data: quote, error: quoteErr } = await sb.from('quote_requests').insert({
    broker_id: brokerId,
    client_id: lead.client_id,
    ramo: lead.ramo ?? 'auto',
    object_description: null,
    notes: `Originado do lead: ${lead.name}`,
    status: 'draft',
    lead_id: leadId,
  }).select('id').single()

  if (quoteErr) return { error: quoteErr.message }

  revalidatePath('/cotacoes')
  return { quoteId: quote.id }
}
