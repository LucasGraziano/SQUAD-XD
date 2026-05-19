'use server'

import { createClient } from '@/lib/supabase/server'
import { getClientApoliceHistory } from '@/lib/clients/renewal-history'
import type { ApoliceHistoryItem } from '@/lib/clients/renewal-history'
import type { Client } from '@/types/client'

async function getAuthBrokerId(): Promise<{ supabase: Awaited<ReturnType<typeof createClient>>; brokerId: string | null }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { supabase, brokerId: null }
  const { data: brokerRows } = await (supabase as any)
    .from('brokers').select('id').eq('user_id', user.id)
    .order('created_at', { ascending: false }).limit(1)
  return { supabase, brokerId: (brokerRows as { id: string }[] | null)?.[0]?.id ?? null }
}

export async function fetchClients({
  search = '',
  page = 1,
  perPage = 30,
}: {
  search?: string
  page?: number
  perPage?: number
} = {}): Promise<{ data: Client[]; count: number }> {
  const { supabase, brokerId } = await getAuthBrokerId()
  if (!brokerId) return { data: [], count: 0 }

  let query = (supabase as any)
    .from('clients')
    .select('*', { count: 'exact' })
    .eq('broker_id', brokerId)
    .order('name')

  if (search) {
    const term = `%${search}%`
    const digits = search.replace(/\D/g, '')
    if (digits.length >= 3) {
      query = query.or(`name.ilike.${term},email.ilike.${term},phone.ilike.%${digits}%,cpf_cnpj.ilike.%${digits}%`)
    } else {
      query = query.or(`name.ilike.${term},email.ilike.${term}`)
    }
  }

  const from = (page - 1) * perPage
  const { data, count, error } = await query.range(from, from + perPage - 1)
  if (error) return { data: [], count: 0 }
  return { data: (data as Client[]) ?? [], count: count ?? 0 }
}

export async function getClientHistory(clientId: string): Promise<ApoliceHistoryItem[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data: brokerRows } = await (supabase as any)
    .from('brokers')
    .select('id')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)

  const brokerId = (brokerRows as { id: string }[] | null)?.[0]?.id
  if (!brokerId) return []
  return getClientApoliceHistory(clientId, brokerId)
}
