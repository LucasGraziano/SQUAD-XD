import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/layout/page-header'
import { ConfiguracoesClient } from '@/components/configuracoes/ConfiguracoesClient'
import { RenewalEmailSection } from '@/components/configuracoes/RenewalEmailSection'
import { PlanGate } from '@/components/shared/PlanGate'
import { PushNotificationsSection } from '@/components/configuracoes/PushNotificationsSection'
import { RelatorioCarteiraButton } from '@/components/configuracoes/RelatorioCarteiraButton'
import { BillingSection } from '@/components/configuracoes/BillingSection'
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
  let debugError: string | null = null

  if (user) {
    const result = await supabase
      .from('brokers')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)

    if (result.error) {
      console.error('[configuracoes] broker query error:', result.error)
      debugError = `${result.error.code}: ${result.error.message}`
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw = (result.data as any)?.[0]
    if (raw) {
      brokerId = raw.id
      broker = {
        id: raw.id,
        name: raw.name ?? '',
        creci: raw.creci ?? null,
        phone: raw.phone ?? null,
        susep: raw.susep ?? null,
        email: raw.email ?? '',
        logo_url: raw.logo_url ?? null,
        plan: raw.plan ?? 'starter',
        subscription_status: raw.subscription_status ?? null,
        trial_ends_at: raw.trial_ends_at ?? null,
        renewal_emails_enabled: raw.renewal_emails_enabled ?? false,
        renewal_email_custom_text: raw.renewal_email_custom_text ?? null,
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
              <PlanGate requiredPlan="pro" feature="email-automatico" currentPlan={broker.plan}>
                <RenewalEmailSection
                  initialEnabled={broker.renewal_emails_enabled ?? false}
                  initialCustomText={broker.renewal_email_custom_text ?? ''}
                />
              </PlanGate>
            </div>
            <div className="mt-6">
              <PushNotificationsSection />
            </div>
            <div className="mt-6">
              <BillingSection
                plan={broker.plan}
                subscriptionStatus={broker.subscription_status}
                trialEndsAt={broker.trial_ends_at}
                stripeCustomerId={(broker as any).stripe_customer_id ?? null}
              />
            </div>
            <div className="mt-6 bg-white rounded-[8px] border border-[#E5E5E5] p-6">
              <p className="text-[14px] font-semibold text-[#0D0D0D] mb-1">Relatório de Carteira</p>
              <p className="text-[13px] text-[#6B7280] mb-4">PDF profissional com resumo executivo da sua carteira para compartilhar com clientes corporativos.</p>
              <RelatorioCarteiraButton currentPlan={broker.plan} />
            </div>
          </>
        ) : (
          <div className="space-y-2">
            <p className="text-[13px] text-[#9CA3AF]">Não foi possível carregar os dados. Recarregue a página.</p>
            {debugError && <p className="text-[12px] text-[#DC2626] font-mono bg-[#FEF2F2] px-3 py-2 rounded">{debugError}</p>}
            {!user && <p className="text-[12px] text-[#DC2626] font-mono bg-[#FEF2F2] px-3 py-2 rounded">user: null</p>}
          </div>
        )}
      </div>
    </>
  )
}
