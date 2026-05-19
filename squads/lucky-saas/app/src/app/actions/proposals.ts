'use server'

// @deprecated — Epic 8 Deal Room: esta tabela foi substituída por quote_requests (deals).
// Use src/app/actions/deals.ts para toda lógica de negociações.
// Mantido apenas para rollback safety durante a transição. Remover após Epic 8 estabilizar.

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnySupabase = any

async function getAuth() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { supabase, brokerId: null as string | null }

  const { data: brokerRows } = await supabase
    .from('brokers').select('id').eq('user_id', user.id)
    .order('created_at', { ascending: false }).limit(1)
  return { supabase, brokerId: (brokerRows as { id: string }[] | null)?.[0]?.id ?? null }
}

export type ProposalStatus = 'rascunho' | 'enviada' | 'em_analise' | 'emitida' | 'recusada' | 'cancelada'

export type Proposal = {
  id: string
  broker_id: string
  lead_id: string | null
  client_id: string | null
  proposal_number: string | null
  protocol_number: string | null
  seguradora: string
  ramo: string
  premium_estimate: number | null
  commission_pct: number | null
  status: ProposalStatus
  sent_at: string | null
  response_at: string | null
  notes: string | null
  policy_id: string | null
  created_at: string
  updated_at: string
  clients?: { name: string } | null
  leads?: { name: string } | null
}

export type CreateProposalInput = {
  lead_id?: string
  client_id?: string
  proposal_number?: string
  protocol_number?: string
  seguradora: string
  ramo: string
  premium_estimate?: number
  commission_pct?: number
  notes?: string
}

export async function getProposals({ status, clientId, seguradora }: {
  status?: ProposalStatus
  clientId?: string
  seguradora?: string
} = {}) {
  const { supabase, brokerId } = await getAuth()
  if (!brokerId) return []

  let query = supabase
    .from('proposals')
    .select('*, clients(name), leads(name)')
    .eq('broker_id', brokerId)

  if (status) query = query.eq('status', status)
  if (clientId) query = query.eq('client_id', clientId)
  if (seguradora) query = query.eq('seguradora', seguradora)

  const { data } = await query.order('created_at', { ascending: false })
  return (data as Proposal[]) ?? []
}

export async function getProposalsInAnalysisCount() {
  const { supabase, brokerId } = await getAuth()
  if (!brokerId) return 0

  const { count } = await supabase
    .from('proposals')
    .select('id', { count: 'exact', head: true })
    .eq('broker_id', brokerId)
    .in('status', ['enviada', 'em_analise'])

  return count ?? 0
}

export async function createProposal(input: CreateProposalInput) {
  const { supabase, brokerId } = await getAuth()
  if (!brokerId) return { error: 'Não autenticado' }

  const sb: AnySupabase = supabase
  const { data, error } = await sb
    .from('proposals')
    .insert({
      broker_id: brokerId,
      lead_id: input.lead_id ?? null,
      client_id: input.client_id ?? null,
      proposal_number: input.proposal_number ?? null,
      protocol_number: input.protocol_number ?? null,
      seguradora: input.seguradora,
      ramo: input.ramo,
      premium_estimate: input.premium_estimate ?? null,
      commission_pct: input.commission_pct ?? null,
      notes: input.notes ?? null,
    })
    .select('*, clients(name), leads(name)')
    .single()

  if (error) return { error: error.message }
  revalidatePath('/propostas')
  revalidatePath('/dashboard')
  return { data: data as Proposal }
}

export async function updateProposalStatus(id: string, status: ProposalStatus) {
  const { supabase, brokerId } = await getAuth()
  if (!brokerId) return { error: 'Não autenticado' }

  const sb: AnySupabase = supabase
  const updates: Record<string, unknown> = { status, updated_at: new Date().toISOString() }

  if (status === 'enviada') updates.sent_at = new Date().toISOString()
  if (['emitida', 'recusada', 'cancelada'].includes(status)) {
    updates.response_at = new Date().toISOString()
  }

  const { data, error } = await sb
    .from('proposals')
    .update(updates)
    .eq('id', id)
    .eq('broker_id', brokerId)
    .select('*, clients(name), leads(name)')
    .single()

  if (error) return { error: error.message }
  revalidatePath('/propostas')
  return { data: data as Proposal }
}

export async function convertProposalToPolicy(proposalId: string) {
  const { supabase, brokerId } = await getAuth()
  if (!brokerId) return { error: 'Não autenticado' }

  const { data: proposal } = await supabase
    .from('proposals')
    .select('*')
    .eq('id', proposalId)
    .eq('broker_id', brokerId)
    .single()

  if (!proposal) return { error: 'Proposta não encontrada' }

  const p = proposal as Proposal
  if (!p.client_id) return { error: 'Proposta precisa ter um cliente para emitir apólice' }

  const sb: AnySupabase = supabase
  const today = new Date().toISOString().split('T')[0]
  const nextYear = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  const { data: policy, error } = await sb
    .from('policies')
    .insert({
      broker_id: brokerId,
      client_id: p.client_id,
      policy_number: p.proposal_number ?? null,
      ramo: p.ramo,
      seguradora: p.seguradora,
      start_date: today,
      end_date: nextYear,
      premium_total: p.premium_estimate ?? 0,
      payment_frequency: 'anual',
      commission_pct: p.commission_pct ?? 0,
      status: 'ativa',
      metadata: { converted_from_proposal: proposalId },
    })
    .select()
    .single()

  if (error) return { error: error.message }

  await sb
    .from('proposals')
    .update({ status: 'emitida', policy_id: policy.id, response_at: new Date().toISOString() })
    .eq('id', proposalId)

  revalidatePath('/propostas')
  revalidatePath('/apolices')
  return { data: policy, proposalId }
}

export async function deleteProposal(id: string) {
  const { supabase, brokerId } = await getAuth()
  if (!brokerId) return { error: 'Não autenticado' }

  const sb: AnySupabase = supabase
  const { error } = await sb
    .from('proposals')
    .delete()
    .eq('id', id)
    .eq('broker_id', brokerId)

  if (error) return { error: error.message }
  revalidatePath('/propostas')
  return { success: true }
}
