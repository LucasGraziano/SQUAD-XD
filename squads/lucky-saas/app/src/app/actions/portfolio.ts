'use server'

import { createClient } from '@/lib/supabase/server'
import { calculateHealthScore } from '@/lib/portfolio/health-score'
import type { PortfolioHealthScore } from '@/lib/portfolio/health-score'

export async function getPortfolioHealthScore(): Promise<PortfolioHealthScore | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: brokerRows } = await (supabase as any)
    .from('brokers')
    .select('id')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)

  const brokerId = (brokerRows as { id: string }[] | null)?.[0]?.id
  if (!brokerId) return null
  return calculateHealthScore(brokerId)
}
