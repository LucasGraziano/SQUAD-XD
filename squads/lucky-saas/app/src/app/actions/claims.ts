'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Claim, ClaimStatus, ClaimUpdate, CreateClaimInput } from '@/types/claim'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnySupabase = any

async function getAuth() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { supabase, brokerId: null }

  const result = await supabase.from('brokers').select('id').eq('user_id', user.id)
    .order('created_at', { ascending: false }).limit(1)
  const brokerId = (result.data as { id: string }[] | null)?.[0]?.id ?? null
  return { supabase, brokerId }
}

export async function createClaim(input: CreateClaimInput): Promise<{ data: Claim | null; error: string | null }> {
  const { supabase, brokerId } = await getAuth()
  if (!brokerId) return { data: null, error: 'Não autenticado' }

  const sb: AnySupabase = supabase
  const { data, error } = await sb.from('claims').insert({
    broker_id: brokerId,
    policy_id: input.policy_id,
    client_id: input.client_id,
    occurrence_date: input.occurrence_date,
    claim_type: input.claim_type,
    description: input.description ?? null,
    insurer_process_number: input.insurer_process_number ?? null,
    estimated_value: input.estimated_value ?? null,
    status: 'open',
  }).select('*, policies(policy_number, ramo, seguradora), clients(name, phone)').single()

  if (error) return { data: null, error: error.message }

  // Registro inicial na timeline
  await sb.from('claim_updates').insert({
    claim_id: data.id,
    broker_id: brokerId,
    old_status: null,
    new_status: 'open',
    note: 'Sinistro aberto',
  })

  revalidatePath('/sinistros')
  return { data: data as Claim, error: null }
}

export async function updateClaimStatus(
  claimId: string,
  newStatus: ClaimStatus,
  note?: string
): Promise<{ error: string | null }> {
  const { supabase, brokerId } = await getAuth()
  if (!brokerId) return { error: 'Não autenticado' }

  // Buscar status atual
  const { data: current } = await supabase
    .from('claims')
    .select('status')
    .eq('id', claimId)
    .eq('broker_id', brokerId)
    .single()

  if (!current) return { error: 'Sinistro não encontrado' }

  const sb: AnySupabase = supabase
  const { error: updateError } = await sb.from('claims')
    .update({ status: newStatus })
    .eq('id', claimId)
    .eq('broker_id', brokerId)

  if (updateError) return { error: updateError.message }

  await sb.from('claim_updates').insert({
    claim_id: claimId,
    broker_id: brokerId,
    old_status: (current as { status: string }).status,
    new_status: newStatus,
    note: note ?? null,
  })

  revalidatePath('/sinistros')
  revalidatePath(`/sinistros/${claimId}`)
  return { error: null }
}

export async function addClaimNote(claimId: string, note: string): Promise<{ error: string | null }> {
  const { supabase, brokerId } = await getAuth()
  if (!brokerId) return { error: 'Não autenticado' }

  const { data: current } = await supabase
    .from('claims')
    .select('status')
    .eq('id', claimId)
    .eq('broker_id', brokerId)
    .single()

  if (!current) return { error: 'Sinistro não encontrado' }

  const sb: AnySupabase = supabase
  await sb.from('claim_updates').insert({
    claim_id: claimId,
    broker_id: brokerId,
    old_status: null,
    new_status: (current as { status: string }).status,
    note,
  })

  revalidatePath(`/sinistros/${claimId}`)
  return { error: null }
}

export async function getClaims(): Promise<{ data: Claim[] }> {
  const { supabase, brokerId } = await getAuth()
  if (!brokerId) return { data: [] }

  const { data } = await supabase
    .from('claims')
    .select('*, policies(policy_number, ramo, seguradora), clients(name, phone)')
    .eq('broker_id', brokerId)
    .order('created_at', { ascending: false })

  return { data: (data ?? []) as unknown as Claim[] }
}

export async function getClaimById(id: string): Promise<{ data: Claim | null; updates: ClaimUpdate[] }> {
  const { supabase, brokerId } = await getAuth()
  if (!brokerId) return { data: null, updates: [] }

  const [claimRes, updatesRes] = await Promise.all([
    supabase
      .from('claims')
      .select('*, policies(policy_number, ramo, seguradora), clients(name, phone)')
      .eq('id', id)
      .eq('broker_id', brokerId)
      .single(),
    supabase
      .from('claim_updates')
      .select('*')
      .eq('claim_id', id)
      .order('created_at', { ascending: true }),
  ])

  return {
    data: (claimRes.data ?? null) as unknown as Claim | null,
    updates: (updatesRes.data ?? []) as ClaimUpdate[],
  }
}
