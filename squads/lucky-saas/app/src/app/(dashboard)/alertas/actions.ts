'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

async function getBrokerId() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { supabase, brokerId: null as string | null }

  const result = await supabase
    .from('brokers')
    .select('id')
    .eq('user_id', user.id)
    .single()

  const broker = result.data as { id: string } | null
  return { supabase, brokerId: broker?.id ?? null }
}

export async function dismissAlert(alertId: string) {
  const { supabase, brokerId } = await getBrokerId()
  if (!brokerId) return { error: 'Não autenticado' }

  // Supabase v2 strict inference resolves alerts Update type as never — cast required
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any
  const { error } = await sb
    .from('alerts')
    .update({ status: 'dismissed' })
    .eq('id', alertId)
    .eq('broker_id', brokerId)

  if (error) return { error: error.message }

  revalidatePath('/alertas')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function fetchAlerts(status: 'pending' | 'dismissed' | 'all' = 'pending') {
  const { supabase, brokerId } = await getBrokerId()
  if (!brokerId) return { data: [], count: 0 }

  let query = supabase
    .from('alerts')
    .select(`
      id, type, title, description, scheduled_for, status, created_at,
      policies ( id, ramo, seguradora, end_date, clients ( id, name, phone ) ),
      leads ( id, name, phone )
    `, { count: 'exact' })
    .eq('broker_id', brokerId)

  if (status === 'pending') {
    query = query.eq('status', 'pending')
  } else if (status === 'dismissed') {
    query = query.eq('status', 'dismissed')
  }

  const { data, count, error } = await query
    .order('scheduled_for', { ascending: true })
    .limit(50)

  if (error) return { data: [], count: 0 }
  return { data: data ?? [], count: count ?? 0 }
}
