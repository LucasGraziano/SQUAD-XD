'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnySupabase = any

async function getAuth() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { supabase, brokerId: null as string | null }

  const { data: broker } = await supabase
    .from('brokers').select('id').eq('user_id', user.id).single()
  return { supabase, brokerId: (broker as { id: string } | null)?.id ?? null }
}

export type Pendency = {
  id: string
  broker_id: string
  policy_id: string | null
  lead_id: string | null
  title: string
  description: string | null
  priority: 'high' | 'medium' | 'low'
  due_date: string | null
  status: 'open' | 'resolved'
  resolved_at: string | null
  created_at: string
}

export type CreatePendencyInput = {
  policy_id?: string
  lead_id?: string
  title: string
  description?: string
  priority?: 'high' | 'medium' | 'low'
  due_date?: string
}

export async function getPendencies({ policyId, leadId, status }: {
  policyId?: string
  leadId?: string
  status?: 'open' | 'resolved'
} = {}) {
  const { supabase, brokerId } = await getAuth()
  if (!brokerId) return []

  let query = supabase
    .from('policy_pendencies')
    .select('*')
    .eq('broker_id', brokerId)

  if (policyId) query = query.eq('policy_id', policyId)
  if (leadId) query = query.eq('lead_id', leadId)
  if (status) query = query.eq('status', status)

  const { data } = await query.order('due_date', { ascending: true, nullsFirst: false })
  return (data as Pendency[]) ?? []
}

export async function createPendency(input: CreatePendencyInput) {
  const { supabase, brokerId } = await getAuth()
  if (!brokerId) return { error: 'Não autenticado' }

  const sb: AnySupabase = supabase
  const { data, error } = await sb
    .from('policy_pendencies')
    .insert({
      broker_id: brokerId,
      policy_id: input.policy_id ?? null,
      lead_id: input.lead_id ?? null,
      title: input.title,
      description: input.description ?? null,
      priority: input.priority ?? 'medium',
      due_date: input.due_date ?? null,
      status: 'open',
    })
    .select()
    .single()

  if (error) return { error: error.message }
  revalidatePath('/apolices')
  revalidatePath('/dashboard')
  return { data: data as Pendency }
}

export async function resolvePendency(id: string) {
  const { supabase, brokerId } = await getAuth()
  if (!brokerId) return { error: 'Não autenticado' }

  const sb: AnySupabase = supabase
  const { error } = await sb
    .from('policy_pendencies')
    .update({ status: 'resolved', resolved_at: new Date().toISOString() })
    .eq('id', id)
    .eq('broker_id', brokerId)

  if (error) return { error: error.message }
  revalidatePath('/apolices')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function deletePendency(id: string) {
  const { supabase, brokerId } = await getAuth()
  if (!brokerId) return { error: 'Não autenticado' }

  const sb: AnySupabase = supabase
  const { error } = await sb
    .from('policy_pendencies')
    .delete()
    .eq('id', id)
    .eq('broker_id', brokerId)

  if (error) return { error: error.message }
  revalidatePath('/apolices')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function getOverduePendenciesCount() {
  const { supabase, brokerId } = await getAuth()
  if (!brokerId) return 0

  const today = new Date().toISOString().split('T')[0]
  const { count } = await supabase
    .from('policy_pendencies')
    .select('id', { count: 'exact', head: true })
    .eq('broker_id', brokerId)
    .eq('status', 'open')
    .lt('due_date', today)

  return count ?? 0
}
