import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'

export type SubscriptionStatus =
  | { active: true;  plan: 'solo' | 'clinico' | 'pro'; trialing: boolean; daysLeft: number | null }
  | { active: false; plan: null; trialing: false; daysLeft: null }

/**
 * Fetch subscription status for the authenticated psychologist.
 * Returns a typed status object — callers don't need to interpret raw DB rows.
 */
export async function getSubscriptionStatus(
  supabase: SupabaseClient<Database>,
  psychologistId: string
): Promise<SubscriptionStatus> {
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('plan, status, trial_ends_at, current_period_end')
    .eq('psychologist_id', psychologistId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (!sub) return { active: false, plan: null, trialing: false, daysLeft: null }

  const now = Date.now()

  if (sub.status === 'trialing') {
    const trialEnd = sub.trial_ends_at ? new Date(sub.trial_ends_at).getTime() : 0
    const daysLeft = trialEnd > now ? Math.ceil((trialEnd - now) / 86_400_000) : 0
    if (daysLeft > 0) return { active: true as const, plan: sub.plan, trialing: true as const, daysLeft }
    return { active: false, plan: null, trialing: false, daysLeft: null }
  }

  if (sub.status === 'active') {
    return { active: true, plan: sub.plan, trialing: false, daysLeft: null }
  }

  // cancelled / past_due
  return { active: false, plan: null, trialing: false, daysLeft: null }
}

/**
 * Creates a 30-day free trial subscription for a new psychologist.
 * Called immediately after the psychologist row is inserted on register.
 */
export async function createTrialSubscription(
  supabase: SupabaseClient<Database>,
  psychologistId: string
) {
  const now = new Date()
  const trialEnd = new Date(now)
  trialEnd.setDate(trialEnd.getDate() + 30)

  await supabase.from('subscriptions').insert({
    psychologist_id: psychologistId,
    plan: 'solo',
    status: 'trialing',
    trial_ends_at: trialEnd.toISOString(),
    current_period_start: now.toISOString(),
    current_period_end: trialEnd.toISOString(),
  })
}
