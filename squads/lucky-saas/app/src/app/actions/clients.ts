'use server'

import { createClient } from '@/lib/supabase/server'
import { getClientApoliceHistory } from '@/lib/clients/renewal-history'
import type { ApoliceHistoryItem } from '@/lib/clients/renewal-history'

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
