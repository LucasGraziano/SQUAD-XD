import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/layout/page-header'
import { ConfiguracoesClient } from '@/components/configuracoes/ConfiguracoesClient'
import { RenewalEmailSection } from '@/components/configuracoes/RenewalEmailSection'
import { getGoogleCalendarInfo } from '@/lib/google-calendar'

type BrokerData = {
  id: string
  name: string
  creci: string | null
  phone: string | null
  susep: string | null
  email: string
  logo_url: string | null
  plan: string
  subscription_status: string | null
  trial_ends_at: string | null
  renewal_emails_enabled?: boolean
  renewal_email_custom_text?: string | null
}

export default async function ConfiguracoesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let broker: BrokerData | null = null
  let brokerId: string | null = null

  if (user) {
    const result = await supabase
      .from('brokers')
      .select('id, name, creci, phone, susep, email, logo_url, plan, subscription_status, trial_ends_at, renewal_emails_enabled, renewal_email_custom_text')
      .eq('user_id', user.id)
      .single()

    broker = result.data as BrokerData | null
    brokerId = broker?.id ?? null
  }

  const googleCalendar = brokerId
    ? await getGoogleCalendarInfo(brokerId)
    : { connected: false, email: null }

  return (
    <>
      <PageHeader title="Configurações" />
      <div className="flex-1 p-8">
        {broker ? (
          <>
            <ConfiguracoesClient
              broker={broker}
              userEmail={user?.email ?? ''}
              googleCalendar={googleCalendar}
            />
            <div className="mt-6">
              <RenewalEmailSection
                initialEnabled={broker.renewal_emails_enabled ?? false}
                initialCustomText={broker.renewal_email_custom_text ?? ''}
                plan={broker.plan}
              />
            </div>
          </>
        ) : (
          <p className="text-[13px] text-[#9CA3AF]">Carregando...</p>
        )}
      </div>
    </>
  )
}
