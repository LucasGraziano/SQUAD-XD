'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { DEAL_TRANSITIONS } from '@/lib/constants/deal-stages'
import type { DealStage } from '@/lib/constants/deal-stages'

export type { DealStage }

export interface DealItem {
  id: string
  seguradora: string
  premium_total: number
  payment_frequency: string
  franchise_value: number | null
  coverages: string[]
  broker_note: string | null
  is_recommended: boolean
  sort_order: number
}

export interface DealStageHistoryEntry {
  id: string
  deal_id: string
  from_stage: string
  to_stage: string
  note: string | null
  changed_at: string
}

export interface DealSummary {
  id: string
  stage: DealStage
  ramo: string
  source: string | null
  object_description: string | null
  notes: string | null
  share_token: string
  view_count: number
  last_viewed_at: string | null
  sent_at: string | null
  approved_at: string | null
  submitted_at: string | null
  issued_at: string | null
  contracted_at: string | null
  rejected_at: string | null
  response_deadline: string | null
  proposal_number: string | null
  protocol_number: string | null
  rejection_reason: string | null
  policy_id: string | null
  apolice_id: string | null
  lead_id: string | null
  original_lead_id: string | null
  created_at: string
  updated_at: string
  clients: { id: string; name: string; phone: string | null; email: string | null } | null
  deal_items: DealItem[]
  deal_stage_history?: DealStageHistoryEntry[]
}

export interface ConvertDealData {
  numero_apolice: string
  vigencia_inicio: string
  vigencia_fim: string
  comissao_pct?: number
  premio_override?: number
}

async function getAuth() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { supabase, brokerId: null as string | null }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: rows } = await (supabase as any)
    .from('brokers').select('id').eq('user_id', user.id)
    .order('created_at', { ascending: false }).limit(1)
  return { supabase, brokerId: (rows as { id: string }[] | null)?.[0]?.id ?? null }
}

function revalidateDealPaths() {
  revalidatePath('/pipeline')
  revalidatePath('/deals')
  revalidatePath('/cotacoes')
  revalidatePath('/apolices')
}

const STAGE_TIMESTAMP: Partial<Record<DealStage, string>> = {
  sent:           'sent_at',
  approved:       'approved_at',
  submitted:      'submitted_at',
  issued:         'issued_at',
  contracted:     'contracted_at',
  rejected:       'rejected_at',
}

// ── getDeals ─────────────────────────────────────────────────────────────────

export async function getDeals(filters: {
  stage?: DealStage
  stages?: DealStage[]
  clientId?: string
  search?: string
  limit?: number
} = {}): Promise<DealSummary[]> {
  const { supabase, brokerId } = await getAuth()
  if (!brokerId) return []

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any
  let query = sb
    .from('quote_requests')
    .select('*, clients(id, name, phone, email), quote_items(*)')
    .eq('broker_id', brokerId)

  if (filters.stage)  query = query.eq('status', filters.stage)
  if (filters.stages?.length) query = query.in('status', filters.stages)
  if (filters.clientId) query = query.eq('client_id', filters.clientId)
  if (filters.search) {
    query = query.ilike('clients.name', `%${filters.search}%`)
  }

  query = query.order('updated_at', { ascending: false })
  if (filters.limit) query = query.limit(filters.limit)

  const { data } = await query
  return (data ?? []).map(rowToSummary)
}

// ── getDeal ───────────────────────────────────────────────────────────────────

export async function getDeal(id: string): Promise<DealSummary | null> {
  const { supabase, brokerId } = await getAuth()
  if (!brokerId) return null

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any
  const { data, error } = await sb
    .from('quote_requests')
    .select('*, clients(id, name, phone, email), quote_items(*)')
    .eq('id', id)
    .eq('broker_id', brokerId)
    .single()

  if (error || !data) return null
  return rowToSummary(data)
}

// ── createDeal ────────────────────────────────────────────────────────────────

export async function createDeal(input: {
  clientId: string
  ramo: string
  objectDescription?: string
  source?: string
  notes?: string
}): Promise<{ dealId?: string; error?: string }> {
  const { supabase, brokerId } = await getAuth()
  if (!brokerId) return { error: 'Não autenticado' }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any
  const { data, error } = await sb
    .from('quote_requests')
    .insert({
      broker_id: brokerId,
      client_id: input.clientId,
      ramo:      input.ramo,
      notes:     [input.objectDescription, input.source, input.notes].filter(Boolean).join(' · ') || null,
      status:    'prospecting',
    })
    .select('id')
    .single()

  if (error) return { error: error.message }
  revalidateDealPaths()
  return { dealId: data.id }
}

// ── updateDealStage ───────────────────────────────────────────────────────────

export async function updateDealStage(
  dealId: string,
  newStage: DealStage,
  note?: string
): Promise<{ error?: string }> {
  const { supabase, brokerId } = await getAuth()
  if (!brokerId) return { error: 'Não autenticado' }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any

  const { data: deal, error: fetchErr } = await sb
    .from('quote_requests')
    .select('id, status')
    .eq('id', dealId)
    .eq('broker_id', brokerId)
    .single()

  if (fetchErr || !deal) return { error: 'Deal não encontrado' }

  const currentStage = deal.status as DealStage
  const allowed = DEAL_TRANSITIONS[currentStage] ?? []
  if (!allowed.includes(newStage)) {
    return { error: `Transição não permitida: ${currentStage} → ${newStage}` }
  }

  const tsField = STAGE_TIMESTAMP[newStage]
  const fullUpdates: Record<string, unknown> = {
    status:     newStage,
    updated_at: new Date().toISOString(),
    ...(tsField ? { [tsField]: new Date().toISOString() } : {}),
  }

  let { error: updateErr } = await sb
    .from('quote_requests')
    .update(fullUpdates)
    .eq('id', dealId)
    .eq('broker_id', brokerId)

  // Se falhou por coluna inexistente (migration pendente), retry sem timestamp
  if (updateErr?.message?.includes('column')) {
    const { error: retryErr } = await sb
      .from('quote_requests')
      .update({ status: newStage, updated_at: new Date().toISOString() })
      .eq('id', dealId)
      .eq('broker_id', brokerId)
    updateErr = retryErr ?? null
  }

  if (updateErr) return { error: updateErr.message }

  // deal_stage_history — silencia erro se tabela ainda não existe
  await sb.from('deal_stage_history').insert({
    deal_id:    dealId,
    broker_id:  brokerId,
    from_stage: currentStage,
    to_stage:   newStage,
    note:       note ?? null,
  }).then(() => null, () => null)

  // Backward compat — silencia erro se tabela não existe
  await sb.from('quote_status_history').insert({
    quote_id:    dealId,
    broker_id:   brokerId,
    from_status: currentStage,
    to_status:   newStage,
  }).then(() => null, () => null)

  // Auto-triggers por estágio
  const today = new Date().toISOString().slice(0, 10)
  if (newStage === 'sent') {
    await sb.from('alerts').insert({
      broker_id:     brokerId,
      type:          'deal_sent',
      title:         'Proposta enviada ao cliente',
      description:   'Aguardando aprovação do cliente.',
      scheduled_for: today,
      status:        'pending',
      metadata:      { deal_id: dealId },
    })
  } else if (newStage === 'submitted') {
    await sb.from('alerts').insert({
      broker_id:     brokerId,
      type:          'deal_submitted',
      title:         'Cotação enviada à seguradora',
      description:   'Acompanhe o prazo de resposta da seguradora.',
      scheduled_for: today,
      status:        'pending',
      metadata:      { deal_id: dealId },
    })
  } else if (newStage === 'contracted' || newStage === 'rejected') {
    // Cancelar alertas pendentes ligados a este deal
    await sb.from('alerts')
      .update({ status: 'dismissed' })
      .eq('broker_id', brokerId)
      .in('type', ['deal_sent', 'deal_submitted', 'deal_stale'])
      .contains('metadata', { deal_id: dealId })
      .eq('status', 'pending')
  }

  revalidateDealPaths()
  return {}
}

// ── updateDealInsurer ─────────────────────────────────────────────────────────

export async function updateDealInsurer(input: {
  dealId: string
  proposalNumber?: string
  protocolNumber?: string
  responseDeadline?: string
}): Promise<{ error?: string }> {
  const { supabase, brokerId } = await getAuth()
  if (!brokerId) return { error: 'Não autenticado' }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any
  // Tenta atualizar com colunas novas; se não existirem (migration pendente), apenas atualiza updated_at
  const { error } = await sb
    .from('quote_requests')
    .update({
      proposal_number:   input.proposalNumber  ?? null,
      protocol_number:   input.protocolNumber  ?? null,
      response_deadline: input.responseDeadline ?? null,
      updated_at:        new Date().toISOString(),
    })
    .eq('id', input.dealId)
    .eq('broker_id', brokerId)

  if (error?.message?.includes('column')) {
    // Migration pendente — salva no campo notes como fallback
    const note = [
      input.proposalNumber  ? `Proposta: ${input.proposalNumber}`  : null,
      input.protocolNumber  ? `Protocolo: ${input.protocolNumber}` : null,
      input.responseDeadline ? `Prazo: ${input.responseDeadline}` : null,
    ].filter(Boolean).join(' | ')
    if (note) await sb.from('quote_requests').update({ notes: note, updated_at: new Date().toISOString() })
      .eq('id', input.dealId).eq('broker_id', brokerId)
  } else if (error) {
    return { error: error.message }
  }

  revalidateDealPaths()
  return {}
}

// ── convertDealToPolicy ───────────────────────────────────────────────────────

export async function convertDealToPolicy(
  dealId: string,
  data: ConvertDealData
): Promise<{ apoliceId?: string; error?: string }> {
  const { supabase, brokerId } = await getAuth()
  if (!brokerId) return { error: 'Não autenticado' }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any

  const { data: deal, error: dealErr } = await sb
    .from('quote_requests')
    .select('*, quote_items(*)')
    .eq('id', dealId)
    .eq('broker_id', brokerId)
    .single()

  if (dealErr || !deal) return { error: 'Deal não encontrado' }
  if (deal.status !== 'approved') return { error: 'Apenas deals aprovados podem ser convertidos em apólice' }

  const items: { seguradora: string; premium_total: number; is_recommended: boolean }[] =
    deal.quote_items ?? []
  const recommended = items.find(i => i.is_recommended) ?? items[0]
  if (!recommended) return { error: 'Adicione pelo menos uma seguradora antes de converter' }

  const premio   = data.premio_override ?? recommended.premium_total
  const comissao = data.comissao_pct ?? 5

  const { data: policy, error: policyErr } = await sb.from('policies').insert({
    broker_id:         brokerId,
    client_id:         deal.client_id,
    policy_number:     data.numero_apolice.trim(),
    ramo:              deal.ramo,
    seguradora:        recommended.seguradora,
    start_date:        data.vigencia_inicio,
    end_date:          data.vigencia_fim,
    premium_total:     premio,
    payment_frequency: 'anual',
    commission_pct:    comissao,
    status:            'ativa',
    notes:             deal.notes ? `Gerada do deal: ${deal.notes}` : null,
    metadata:          { quote_request_id: dealId, auto_generated: true },
  }).select('id').single()

  if (policyErr) return { error: policyErr.message }

  await sb.from('quote_requests').update({
    status:        'contracted',
    contracted_at: new Date().toISOString(),
    apolice_id:    policy.id,
    updated_at:    new Date().toISOString(),
  }).eq('id', dealId).eq('broker_id', brokerId)

  await sb.from('deal_stage_history').insert({
    deal_id:    dealId,
    broker_id:  brokerId,
    from_stage: 'approved',
    to_stage:   'contracted',
    note:       `Apólice ${data.numero_apolice} criada`,
  })

  await sb.from('quote_status_history').insert({
    quote_id:    dealId,
    broker_id:   brokerId,
    from_status: 'approved',
    to_status:   'contracted',
  })

  // Gerar alertas de renovação (60, 30, 15, 7, 1 dias antes do vencimento)
  const endDate   = new Date(data.vigencia_fim)
  const alertDays = [60, 30, 15, 7, 1]
  const alerts = alertDays
    .map(days => {
      const scheduledFor = new Date(endDate)
      scheduledFor.setDate(scheduledFor.getDate() - days)
      return {
        broker_id:     brokerId,
        policy_id:     policy.id,
        days_before:   days,
        scheduled_for: scheduledFor.toISOString().split('T')[0],
        status:        'pending',
      }
    })
    .filter(a => new Date(a.scheduled_for) > new Date())

  if (alerts.length > 0) await sb.from('alerts').insert(alerts)

  revalidateDealPaths()
  return { apoliceId: policy.id }
}

// ── createRenewalDeal ─────────────────────────────────────────────────────────

export async function createRenewalDeal(
  policyId: string
): Promise<{ dealId?: string; error?: string }> {
  const { supabase, brokerId } = await getAuth()
  if (!brokerId) return { error: 'Não autenticado' }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any

  const { data: policy, error: policyErr } = await sb
    .from('policies')
    .select('*, clients(id, name)')
    .eq('id', policyId)
    .eq('broker_id', brokerId)
    .single()

  if (policyErr || !policy) return { error: 'Apólice não encontrada' }

  if (policy.renewal_quote_id) return { dealId: policy.renewal_quote_id }

  const { data: deal, error: dealErr } = await sb
    .from('quote_requests')
    .insert({
      broker_id:          brokerId,
      client_id:          policy.client_id,
      ramo:               policy.ramo,
      object_description: `Renovação — ${policy.policy_number ?? policy.ramo}`,
      notes:              `Renovação da Apólice ${policy.policy_number ?? '#sem número'} — Venc. ${policy.end_date}`,
      status:             'draft',
      source:             'renovacao',
    })
    .select('id')
    .single()

  if (dealErr) return { error: dealErr.message }

  await sb.from('quote_items').insert({
    quote_request_id: deal.id,
    broker_id:        brokerId,
    seguradora:       policy.seguradora,
    premium_total:    policy.premium_total,
    payment_frequency: policy.payment_frequency ?? 'anual',
    is_recommended:   false,
    broker_note:      'Ponto de partida — edite antes de enviar ao cliente',
  })

  await sb.from('policies')
    .update({ renewal_quote_id: deal.id })
    .eq('id', policyId)

  revalidateDealPaths()
  revalidatePath('/alertas')
  return { dealId: deal.id }
}

// ── getDealTimeline ───────────────────────────────────────────────────────────

export async function getDealTimeline(
  dealId: string
): Promise<DealStageHistoryEntry[]> {
  const { supabase, brokerId } = await getAuth()
  if (!brokerId) return []

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any
  const { data } = await sb
    .from('deal_stage_history')
    .select('*')
    .eq('deal_id', dealId)
    .eq('broker_id', brokerId)
    .order('changed_at', { ascending: true })

  return (data as DealStageHistoryEntry[]) ?? []
}

// ── archiveDeal ───────────────────────────────────────────────────────────────

export async function archiveDeal(
  dealId: string
): Promise<{ error?: string }> {
  const { supabase, brokerId } = await getAuth()
  if (!brokerId) return { error: 'Não autenticado' }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any

  const { data: deal, error: fetchErr } = await sb
    .from('quote_requests')
    .select('id, status')
    .eq('id', dealId)
    .eq('broker_id', brokerId)
    .single()

  if (fetchErr || !deal) return { error: 'Deal não encontrado' }

  await sb.from('quote_requests').update({
    status:           'rejected',
    rejection_reason: 'arquivado',
    rejected_at:      new Date().toISOString(),
    updated_at:       new Date().toISOString(),
  }).eq('id', dealId).eq('broker_id', brokerId)

  await sb.from('deal_stage_history').insert({
    deal_id:    dealId,
    broker_id:  brokerId,
    from_stage: deal.status,
    to_stage:   'rejected',
    note:       'Arquivado manualmente',
  })

  revalidateDealPaths()
  return {}
}

// ── deleteDeal ───────────────────────────────────────────────────────────────

export async function deleteDeal(dealId: string): Promise<{ error?: string }> {
  const { supabase, brokerId } = await getAuth()
  if (!brokerId) return { error: 'Não autenticado' }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any

  const { data: deal } = await sb
    .from('quote_requests')
    .select('id')
    .eq('id', dealId)
    .eq('broker_id', brokerId)
    .maybeSingle()

  if (!deal) return { error: 'Negociação não encontrada' }

  await sb.from('quote_items').delete().eq('quote_request_id', dealId)
  await sb.from('alerts').delete().eq('deal_id', dealId).eq('broker_id', brokerId).then(() => null, () => null)
  const { error } = await sb
    .from('quote_requests')
    .delete()
    .eq('id', dealId)
    .eq('broker_id', brokerId)

  if (error) return { error: error.message }
  revalidateDealPaths()
  return {}
}

// ── getDealByPolicyId ─────────────────────────────────────────────────────────

export async function getDealByPolicyId(
  policyId: string
): Promise<{ id: string; stage: DealStage; ramo: string; created_at: string } | null> {
  const { supabase, brokerId } = await getAuth()
  if (!brokerId) return null

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any
  const { data } = await sb
    .from('quote_requests')
    .select('id, status, ramo, created_at')
    .eq('broker_id', brokerId)
    .eq('apolice_id', policyId)
    .maybeSingle()

  if (!data) return null
  return { id: data.id, stage: data.status as DealStage, ramo: data.ramo, created_at: data.created_at }
}

// ── helpers ───────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToSummary(row: any): DealSummary {
  const { quote_items, deal_stage_history, ...rest } = row
  return {
    ...rest,
    stage:             rest.status as DealStage,
    deal_items:        (quote_items ?? []) as DealItem[],
    deal_stage_history: (deal_stage_history ?? []) as DealStageHistoryEntry[],
  }
}
