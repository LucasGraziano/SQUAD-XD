import { createClient } from '@/lib/supabase/server'
import { PricingCard } from '@/components/pricing/PricingCard'
import { PricingHighlight } from '@/components/pricing/PricingHighlight'
import type { Plan } from '@/lib/stripe'

export const metadata = {
  title: 'Planos — Premia',
  description: 'Escolha o plano ideal para sua corretora. 14 dias grátis, sem cartão.',
}

const PLANS: {
  plan: Plan
  name: string
  price: string
  description: string
  highlight?: boolean
  badge?: string
  items: string[]
}[] = [
  {
    plan: 'solo',
    name: 'Solo',
    price: 'R$ 47',
    description: 'Para o corretor autônomo que quer parar de perder renovações.',
    items: [
      'Clientes e apólices ilimitados',
      'Pipeline de leads',
      'Alertas de renovação automáticos',
      'Controle de comissões',
      'Importação de apólice por PDF (IA)',
      'Suporte por email',
    ],
  },
  {
    plan: 'profissional',
    name: 'Profissional',
    price: 'R$ 97',
    description: 'Para quem quer fechar mais, reter melhor e parecer maior.',
    highlight: true,
    badge: 'Mais popular',
    items: [
      'Tudo do Solo, mais:',
      'Portal do Cliente (link personalizado)',
      'Proposta Comercial em PDF',
      'E-mails automáticos (aniversário + renovação)',
      'Sinistro Tracking',
      'Relatórios avançados + Forecast',
      'Suporte prioritário',
    ],
  },
  {
    plan: 'equipe',
    name: 'Equipe',
    price: 'R$ 197',
    description: 'Para corretoras com múltiplos corretores que precisam de controle centralizado.',
    items: [
      'Tudo do Profissional, mais:',
      'Até 5 usuários',
      'Agenda integrada (Google Calendar)',
      'WhatsApp Business API',
      'Dashboard de equipe',
      'Onboarding dedicado',
    ],
  },
]

interface PageProps {
  searchParams: Promise<{ highlight?: string; canceled?: string }>
}

export default async function PricingPage({ searchParams }: PageProps) {
  const params = await searchParams
  const highlightPlan = params.highlight as Plan | undefined
  const canceled = params.canceled === 'true'

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type AnySupabase = any
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let userState: 'guest' | 'trial' | 'active' = 'guest'
  let currentPlan: string | null = null

  if (user) {
    const sb: AnySupabase = supabase
    const { data: broker } = await sb
      .from('brokers')
      .select('subscription_status, plan')
      .eq('user_id', user.id)
      .single()

    if (broker) {
      currentPlan = broker.plan
      userState = broker.subscription_status === 'active' ? 'active' : 'trial'
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F8F8]">
      {canceled && (
        <div className="bg-[#FEE2E2] border-b border-[#DC2626]/20 px-5 py-3 text-center">
          <p className="text-[14px] text-[#DC2626]">
            Pagamento cancelado. Seus dados continuam seguros.
          </p>
        </div>
      )}

      <div className="max-w-[1100px] mx-auto px-5 py-16">
        <div className="text-center mb-12">
          <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-3">Preços</p>
          <h1 className="text-[30px] md:text-[36px] font-bold text-[#0D0D0D] leading-tight mb-3">
            14 dias grátis, sem cartão de crédito
          </h1>
          <p className="text-[15px] text-[#6B7280]">
            Cancele quando quiser. Sem fidelidade.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
          {PLANS.map((p) => (
            <PricingCard
              key={p.plan}
              {...p}
              userState={userState}
              currentPlan={currentPlan}
              highlighted={highlightPlan === p.plan}
            />
          ))}
        </div>

        {/* Enterprise */}
        <div className="rounded-[8px] border border-[#E5E5E5] bg-white p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
          <div>
            <p className="text-[15px] font-semibold text-[#0D0D0D] mb-1">Enterprise</p>
            <p className="text-[13px] text-[#6B7280]">
              Corretoras com mais de 5 corretores, integrações customizadas, SLA garantido e onboarding dedicado.
            </p>
          </div>
          <a
            href="https://wa.me/5511999999999?text=Quero+saber+mais+sobre+o+plano+Enterprise+do+Premia"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 h-10 px-6 flex items-center justify-center rounded-[6px] text-[14px] font-semibold border border-[#0D0D0D] bg-white text-[#0D0D0D] hover:bg-[#F4F4F4] transition-colors whitespace-nowrap"
          >
            Fale conosco
          </a>
        </div>
      </div>

      {highlightPlan && <PricingHighlight plan={highlightPlan} />}
    </div>
  )
}
