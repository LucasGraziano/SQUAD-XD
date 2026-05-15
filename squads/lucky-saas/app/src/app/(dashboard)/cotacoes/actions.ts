'use server'

import { createClient } from '@/lib/supabase/server'
import type { CreateQuoteRequestInput, CreateQuoteItemInput, QuoteStatus } from '@/types/quote'
import { ALLOWED_TRANSITIONS } from '@/lib/constants/quote-status'

async function getBrokerId(): Promise<string | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const result = await supabase.from('brokers').select('id').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1)
  return (result.data as { id: string }[] | null)?.[0]?.id ?? null
}

export async function createQuoteRequest(input: CreateQuoteRequestInput) {
  const supabase = await createClient()
  const brokerId = await getBrokerId()
  if (!brokerId) return { error: 'Não autenticado' }

  const sb: any = supabase
  const { data, error } = await sb.from('quote_requests').insert({
    broker_id: brokerId,
    client_id: input.client_id,
    ramo: input.ramo,
    object_description: input.object_description?.trim() || null,
    notes: input.notes?.trim() || null,
  }).select('*, clients(id, name, phone, email)').single()

  if (error) return { error: error.message }
  return { data }
}

export async function updateQuoteRequest(id: string, input: Partial<CreateQuoteRequestInput>) {
  const supabase = await createClient()
  const brokerId = await getBrokerId()
  if (!brokerId) return { error: 'Não autenticado' }

  const sb: any = supabase
  const { data, error } = await sb.from('quote_requests')
    .update({
      ...(input.client_id && { client_id: input.client_id }),
      ...(input.ramo && { ramo: input.ramo }),
      object_description: input.object_description?.trim() ?? null,
      notes: input.notes?.trim() ?? null,
    })
    .eq('id', id)
    .eq('broker_id', brokerId)
    .select('*, clients(id, name, phone, email)')
    .single()

  if (error) return { error: error.message }
  return { data }
}

export async function deleteQuoteRequest(id: string) {
  const supabase = await createClient()
  const brokerId = await getBrokerId()
  if (!brokerId) return { error: 'Não autenticado' }

  const sb: any = supabase
  const { error } = await sb.from('quote_requests')
    .delete()
    .eq('id', id)
    .eq('broker_id', brokerId)

  if (error) return { error: error.message }
  return { data: { id } }
}

export async function addQuoteItem(input: CreateQuoteItemInput) {
  const supabase = await createClient()
  const brokerId = await getBrokerId()
  if (!brokerId) return { error: 'Não autenticado' }

  // Verify ownership of the quote_request before inserting (IDOR prevention)
  const { data: qr } = await supabase
    .from('quote_requests')
    .select('id')
    .eq('id', input.quote_request_id)
    .eq('broker_id', brokerId)
    .maybeSingle()
  if (!qr) return { error: 'Cotação não encontrada' }

  const sb: any = supabase
  const { data, error } = await sb.from('quote_items').insert({
    quote_request_id: input.quote_request_id,
    broker_id: brokerId,
    seguradora: input.seguradora.trim(),
    premium_total: input.premium_total,
    payment_frequency: input.payment_frequency || 'anual',
    franchise_value: input.franchise_value ?? null,
    coverages: input.coverages ?? [],
    exclusions: input.exclusions ?? [],
    broker_note: input.broker_note?.trim() || null,
    is_recommended: input.is_recommended ?? false,
  }).select().single()

  if (error) return { error: error.message }

  // Record history
  await sb.from('quote_item_history').insert({
    quote_request_id: input.quote_request_id,
    quote_item_id:    data.id,
    broker_id:        brokerId,
    action:           'created',
    snapshot:         data,
  })

  return { data }
}

export async function updateQuoteItem(id: string, input: Partial<CreateQuoteItemInput>) {
  const supabase = await createClient()
  const brokerId = await getBrokerId()
  if (!brokerId) return { error: 'Não autenticado' }

  const sb: any = supabase
  const updateData: Record<string, unknown> = {}
  if (input.seguradora !== undefined) updateData.seguradora = input.seguradora.trim()
  if (input.premium_total !== undefined) updateData.premium_total = input.premium_total
  if (input.payment_frequency !== undefined) updateData.payment_frequency = input.payment_frequency
  if (input.franchise_value !== undefined) updateData.franchise_value = input.franchise_value
  if (input.coverages !== undefined) updateData.coverages = input.coverages
  if (input.exclusions !== undefined) updateData.exclusions = input.exclusions
  if (input.broker_note !== undefined) updateData.broker_note = input.broker_note?.trim() || null
  if (input.is_recommended !== undefined) updateData.is_recommended = input.is_recommended

  const { data, error } = await sb.from('quote_items')
    .update(updateData)
    .eq('id', id)
    .eq('broker_id', brokerId)
    .select()
    .single()

  if (error) return { error: error.message }

  // Record history (best-effort — quote_request_id may not be in partial input)
  if (data?.quote_request_id) {
    await sb.from('quote_item_history').insert({
      quote_request_id: data.quote_request_id,
      quote_item_id:    id,
      broker_id:        brokerId,
      action:           'updated',
      snapshot:         data,
    })
  }

  return { data }
}

export async function deleteQuoteItem(id: string) {
  const supabase = await createClient()
  const brokerId = await getBrokerId()
  if (!brokerId) return { error: 'Não autenticado' }

  const sb: any = supabase
  const { error } = await sb.from('quote_items')
    .delete()
    .eq('id', id)
    .eq('broker_id', brokerId)

  if (error) return { error: error.message }
  return { data: { id } }
}

// ── Story 7.7: Histórico de Cotação ──────────────────────────────────────────

export async function getQuoteHistory(quoteId: string) {
  const supabase = await createClient()
  const brokerId = await getBrokerId()
  if (!brokerId) return { statusHistory: [], itemHistory: [] }

  const sb: any = supabase

  const [statusRes, itemRes] = await Promise.all([
    sb.from('quote_status_history')
      .select('*')
      .eq('quote_id', quoteId)
      .eq('broker_id', brokerId)
      .order('changed_at', { ascending: true }),

    sb.from('quote_item_history')
      .select('*')
      .eq('quote_request_id', quoteId)
      .eq('broker_id', brokerId)
      .order('changed_at', { ascending: true }),
  ])

  return {
    statusHistory: statusRes.data ?? [],
    itemHistory:   itemRes.data ?? [],
  }
}

// ── Story 7.3: Status Flow ────────────────────────────────────────────────────

export async function updateQuoteStatus(quoteId: string, newStatus: QuoteStatus) {
  const supabase = await createClient()
  const brokerId = await getBrokerId()
  if (!brokerId) return { error: 'Não autenticado' }

  const sb: any = supabase

  // Fetch current status
  const { data: current, error: fetchErr } = await sb.from('quote_requests')
    .select('status')
    .eq('id', quoteId)
    .eq('broker_id', brokerId)
    .single()

  if (fetchErr || !current) return { error: 'Cotação não encontrada' }

  const currentStatus = current.status as QuoteStatus
  if (!ALLOWED_TRANSITIONS[currentStatus]?.includes(newStatus)) {
    return { error: `Transição inválida: ${currentStatus} → ${newStatus}` }
  }

  const timestampField: Partial<Record<QuoteStatus, string>> = {
    sent:       'sent_at',
    approved:   'approved_at',
    rejected:   'rejected_at',
    contracted: 'contracted_at',
  }

  const updatePayload: Record<string, unknown> = { status: newStatus }
  if (timestampField[newStatus]) {
    updatePayload[timestampField[newStatus]!] = new Date().toISOString()
  }

  const { data, error } = await sb.from('quote_requests')
    .update(updatePayload)
    .eq('id', quoteId)
    .eq('broker_id', brokerId)
    .select('*, clients(id, name, phone, email), quote_items(*)')
    .single()

  if (error) return { error: error.message }

  // Record history
  await sb.from('quote_status_history').insert({
    quote_id:    quoteId,
    broker_id:   brokerId,
    from_status: currentStatus,
    to_status:   newStatus,
  })

  return { data }
}

export async function getPendingQuotesCount() {
  const supabase = await createClient()
  const brokerId = await getBrokerId()
  if (!brokerId) return { count: 0 }

  const sb: any = supabase
  const { count } = await sb.from('quote_requests')
    .select('id', { count: 'exact', head: true })
    .eq('broker_id', brokerId)
    .eq('status', 'sent')

  return { count: count ?? 0 }
}
