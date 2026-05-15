import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/layout/page-header'
import { AgendaClient } from '@/components/agenda/AgendaClient'
import { getCalendarEvents } from '@/app/actions/calendar'
import { getGoogleCalendarInfo } from '@/lib/google-calendar'

export default async function AgendaPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let brokerId: string | null = null
  if (user) {
    const { data } = await supabase.from('brokers').select('id').eq('user_id', user.id)
      .order('created_at', { ascending: false }).limit(1)
    brokerId = (data as { id: string }[] | null)?.[0]?.id ?? null
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
