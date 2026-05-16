import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/layout/page-header'
import { AgendaClient } from '@/components/agenda/AgendaClient'
import { getCalendarEvents } from '@/app/actions/calendar'
import { getGoogleCalendarInfo } from '@/lib/google-calendar'
import { PlanGate } from '@/components/shared/PlanGate'
import { meetsRequirement } from '@/lib/constants/plan-gates'

export default async function AgendaPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let brokerId: string | null = null
  let brokerPlan = 'starter'
  if (user) {
    const { data } = await supabase.from('brokers').select('id, plan').eq('user_id', user.id)
      .order('created_at', { ascending: false }).limit(1)
    const broker = (data as { id: string; plan: string }[] | null)?.[0] ?? null
    brokerId = broker?.id ?? null
    brokerPlan = broker?.plan ?? 'starter'
  }

  const canUseAgenda = meetsRequirement(brokerPlan, 'broker')

  if (!canUseAgenda) {
    return (
      <>
        <PageHeader title="Agenda" />
        <div className="flex-1 p-8 max-w-[720px]">
          <PlanGate requiredPlan="broker" feature="google-calendar" currentPlan={brokerPlan}>
            <></>
          </PlanGate>
        </div>
      </>
    )
  }

  const [events, googleInfo] = await Promise.all([
    getCalendarEvents({ includeDone: true }),
    brokerId ? getGoogleCalendarInfo(brokerId) : Promise.resolve({ connected: false, email: null }),
  ])

  return (
    <>
      <PageHeader title="Agenda" />
      <div className="flex-1 p-8 max-w-[720px]">
        <AgendaClient
          initialEvents={events}
          googleConnected={googleInfo.connected}
          googleEmail={googleInfo.email}
        />
      </div>
    </>
  )
}
