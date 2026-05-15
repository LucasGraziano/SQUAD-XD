import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/layout/page-header'
import { ConfiguracoesClient } from '@/components/configuracoes/ConfiguracoesClient'
import { RenewalEmailSection } from '@/components/configuracoes/RenewalEmailSection'
import { PlanGate } from '@/components/shared/PlanGate'
import { PushNotificationsSection } from '@/components/configuracoes/PushNotificationsSection'
import { RelatorioCarteiraButton } from '@/components/configuracoes/RelatorioCarteiraButton'
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
      .select('id, name, creci, phone, susep, email, logo_url, plan, subscription_status, trial_ends_at')
      .eq('user_id', user.id)
      .single()

    const coreData = result.data as Omit<BrokerData, 'renewal_emails_enabled' | 'renewal_email_custom_text'> | null
    if (coreData) {
      brokerId = coreData.id
      // Fetch optional columns separately — they may not exist in all envs
      const ext = await supabase
        .from('brokers')
        .select('renewal_emails_enabled, renewal_email_custom_text')
        .eq('id', brokerId)
        .single()
      broker = {
        ...coreData,
        renewal_emails_enabled: (ext.data as { renewal_emails_enabled?: boolean } | null)?.renewal_emails_enabled ?? false,
        renewal_email_custom_text: (ext.data as { renewal_email_custom_text?: string | null } | null)?.renewal_email_custom_text ?? null,
      }
    }
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
              <PlanGate requiredPlan="pro" feature="email-automatico">
                <RenewalEmailSection
                  initialEnabled={broker.renewal_emails_enabled ?? false}
                  initialCustomText={broker.renewal_email_custom_text ?? ''}
                />
              </PlanGate>
            </div>
            <div className="mt-6">
              <PushNotificationsSection />
            </div>
            <div className="mt-6 bg-white rounded-[8px] border border-[#E5E5E5] p-6">
              <p className="text-[14px] font-semibold text-[#0D0D0D] mb-1">Relatório de Carteira</p>
              <p className="text-[13px] text-[#6B7280] mb-4">PDF profissional com resumo executivo da sua carteira para compartilhar com clientes corporativos.</p>
              <RelatorioCarteiraButton />
            </div>
          </>
        ) : (
          <p className="text-[13px] text-[#9CA3AF]">Não foi possível carregar os dados. Recarregue a página.</p>
        )}
      </div>
    </>
  )
}
