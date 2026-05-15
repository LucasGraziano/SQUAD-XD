'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { updateOnboardingStep } from '@/app/actions/onboarding'

// ── Story 7.9: First Win ──────────────────────────────────────────────────────

export async function markFirstWinSeen(): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autenticado' }

  const { error } = await (supabase as any)
    .from('brokers')
    .update({ first_win_seen_at: new Date().toISOString() })
    .eq('user_id', user.id)

  if (error) return { error: error.message }
  revalidatePath('/dashboard')
  return {}
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnySupabase = any

export interface UpdateBrokerInput {
  name: string
  creci?: string
  phone?: string
  susep?: string
}

export async function updateBrokerProfile(input: UpdateBrokerInput): Promise<{ error: string | null }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autenticado' }

  const sb: AnySupabase = supabase
  const { error } = await sb
    .from('brokers')
    .update({
      name: input.name.trim(),
      creci: input.creci?.trim() || null,
      phone: input.phone?.trim() || null,
      susep: input.susep?.trim() || null,
    })
    .eq('user_id', user.id)

  if (error) return { error: error.message }

  if (input.susep?.trim()) updateOnboardingStep('profile').catch(() => {})
  revalidatePath('/configuracoes')
  return { error: null }
}
