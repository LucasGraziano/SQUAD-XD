import Link from 'next/link'
import { Check } from 'lucide-react'

const plans = [
  {
    name: 'Solo',
    price: 'R$ 47',
    period: 'por mês',
    description: 'Para o corretor autônomo que quer parar de perder renovações.',
    cta: 'Começar trial grátis',
    href: '/signup?plan=solo',
    highlight: false,
    badge: null,
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
    name: 'Profissional',
    price: 'R$ 97',
    period: 'por mês',
    description: 'Para quem quer fechar mais, reter melhor e parecer maior.',
    cta: 'Começar trial grátis',
    href: '/signup?plan=pro',
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
    name: 'Equipe',
    price: 'R$ 197',
    period: 'por mês',
    description: 'Para corretoras com múltiplos corretores que precisam de controle centralizado.',
    cta: 'Começar trial grátis',
    href: '/signup?plan=equipe',
    highlight: false,
    badge: null,
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

export function Pricing() {
  return (
    <section id="pricing" className="bg-white py-20 px-5 border-t border-[#E5E5E5]">
      <div className="max-w-[1100px] mx-auto">
        <div className="text-center mb-12">
          <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-3">Preços</p>
          <h2 className="text-[30px] md:text-[36px] font-bold text-[#0D0D0D] leading-tight mb-3">
            14 dias grátis, sem cartão de crédito
          </h2>
          <p className="text-[15px] text-[#6B7280]">
            Cancele quando quiser. Sem fidelidade.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-[8px] border p-6 flex flex-col ${
                plan.highlight
                  ? 'border-[#0BD904] shadow-[0_0_0_1px_#0BD904]'
                  : 'border-[#E5E5E5]'
              }`}
            >
              {plan.badge ? (
                <div className="mb-4 inline-flex">
                  <span className="px-2.5 py-0.5 rounded-[4px] bg-[rgba(11,217,4,0.12)] text-[#034001] text-[11px] font-bold uppercase">
                    {plan.badge}
                  </span>
                </div>
              ) : (
                <div className="mb-4 h-[22px]" />
              )}

              <p className="text-[14px] font-semibold text-[#6B7280] mb-1">{plan.name}</p>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-[36px] font-black text-[#0D0D0D] leading-none">{plan.price}</span>
                <span className="text-[13px] text-[#9CA3AF]">/ {plan.period}</span>
              </div>
              <p className="text-[13px] text-[#6B7280] mb-6">{plan.description}</p>

              <ul className="space-y-2.5 mb-8 flex-1">
                {plan.items.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    {item.endsWith(':') ? (
                      <span className="text-[12px] font-semibold text-[#9CA3AF] uppercase tracking-wide">{item}</span>
                    ) : (
                      <>
                        <Check size={14} className="text-[#0BD904] mt-0.5 shrink-0" />
                        <span className="text-[13px] text-[#374151]">{item}</span>
                      </>
                    )}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`h-10 flex items-center justify-center rounded-[6px] text-[14px] font-semibold transition-colors ${
                  plan.highlight
                    ? 'bg-[#0BD904] text-[#0D0D0D] hover:bg-[#09C003]'
                    : 'border border-[#D1D1D1] bg-white text-[#0D0D0D] hover:bg-[#F4F4F4]'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Enterprise */}
        <div className="rounded-[8px] border border-[#E5E5E5] bg-[#F8F8F8] p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
          <div>
            <p className="text-[15px] font-semibold text-[#0D0D0D] mb-1">Enterprise</p>
            <p className="text-[13px] text-[#6B7280]">
              Corretoras com mais de 5 corretores, integrações customizadas, SLA garantido e onboarding dedicado.
              Preço sob consulta.
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
    </section>
  )
}
