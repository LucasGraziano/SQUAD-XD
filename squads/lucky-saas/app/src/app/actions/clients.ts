'use server'

import { createClient } from '@/lib/supabase/server'
import { getClientApoliceHistory } from '@/lib/clients/renewal-history'
import type { ApoliceHistoryItem } from '@/lib/clients/renewal-history'

export async function getClientHistory(clientId: string): Promise<ApoliceHistoryItem[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data: broker } = await (supabase as any)
    .from('brokers')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!broker?.id) return []
  return getClientApoliceHistory(clientId, broker.id)
}
