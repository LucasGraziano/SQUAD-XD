'use server'

import { createClient } from '@/lib/supabase/server'

export type OnboardingStep = 'profile' | 'first_client' | 'first_apolice' | 'viewed_alertas' | 'shared_portal'

async function getBrokerId(): Promise<string | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data } = await (supabase as any).from('brokers').select('id').eq('user_id', user.id).single()
  return (data as { id: string } | null)?.id ?? null
}

export async function updateOnboardingStep(step: OnboardingStep, value: boolean = true) {
  const supabase = await createClient()
  const brokerId = await getBrokerId()
  if (!brokerId) return { error: 'Não autenticado' }

  const sb = supabase as any

  // Fetch current progress
  const { data: broker } = await sb.from('brokers')
    .select('onboarding_progress')
    .eq('id', brokerId)
    .single()

  if (!broker) return { error: 'Broker não encontrado' }

  const progress = { ...(broker.onboarding_progress ?? {}) }
  progress[step] = value

  // Check if all 5 steps are complete
  const allSteps: OnboardingStep[] = ['profile', 'first_client', 'first_apolice', 'viewed_alertas', 'shared_portal']
  const allComplete = allSteps.every(s => progress[s])
  if (allComplete && !progress.completed_at) {
    progress.completed_at = new Date().toISOString()
  }

  const { error } = await sb.from('brokers')
    .update({ onboarding_progress: progress })
    .eq('id', brokerId)

  if (error) return { error: error.message }
  return { data: progress }
}

export async function dismissOnboarding() {
  const supabase = await createClient()
  const brokerId = await getBrokerId()
  if (!brokerId) return { error: 'Não autenticado' }

  const sb = supabase as any
  const { data: broker } = await sb.from('brokers')
    .select('onboarding_progress')
    .eq('id', brokerId)
    .single()

  if (!broker) return { error: 'Broker não encontrado' }

  const progress = { ...(broker.onboarding_progress ?? {}), dismissed: true }

  const { error } = await sb.from('brokers')
    .update({ onboarding_progress: progress })
    .eq('id', brokerId)

  if (error) return { error: error.message }
  return { data: progress }
}
