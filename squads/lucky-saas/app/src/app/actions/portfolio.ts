'use server'

import { createClient } from '@/lib/supabase/server'
import { calculateHealthScore } from '@/lib/portfolio/health-score'
import type { PortfolioHealthScore } from '@/lib/portfolio/health-score'

export async function getPortfolioHealthScore(): Promise<PortfolioHealthScore | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: broker } = await (supabase as any)
    .from('brokers')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!broker?.id) return null
  return calculateHealthScore(broker.id)
}
