import { createClient } from '@/lib/supabase/server'
import { getPsychologistId } from '@/lib/supabase/server-queries'
import { Header } from '@/components/layout/header'
import { PlanosClient } from './planos-client'
import { getSubscriptionStatus } from '@/lib/subscription'

export default async function PlanosPage() {
  const supabase = await createClient()
  const psyId = await getPsychologistId()

  const status = psyId
    ? await getSubscriptionStatus(supabase, psyId)
    : { active: false, plan: null, trialing: false, daysLeft: null } as const

  return (
    <>
      <Header title="Plano" subtitle="Gerencie sua assinatura" />
      <PlanosClient status={status} />
    </>
  )
}
