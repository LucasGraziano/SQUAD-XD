'use client'

import { motion } from 'framer-motion'
import { Check, Gem, AlertCircle, MessageCircle } from 'lucide-react'
import type { SubscriptionStatus } from '@/lib/subscription'
import { fadeUp } from '@/lib/animations'

const PLANS = [
  {
    id: 'solo',
    name: 'Solo',
    price: 'R$ 79',
    period: '/mês',
    description: 'Para profissionais autônomos',
    highlight: false,
    features: [
      'Até 30 pacientes ativos',
      'Agenda e sessões ilimitadas',
      'Prontuários com criptografia',
      'Lembretes WhatsApp automáticos',
      'Controle financeiro básico',
      'Score de risco de abandono',
    ],
  },
  {
    id: 'clinico',
    name: 'Clínico',
    price: 'R$ 149',
    period: '/mês',
    description: 'Para clínicas e consultórios',
    highlight: true,
    features: [
      'Pacientes ilimitados',
      'Tudo do plano Solo',
      'IA Linhagem Teórica',
      'Relatórios avançados',
      'Múltiplos profissionais (em breve)',
      'Suporte prioritário',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 'R$ 249',
    period: '/mês',
    description: 'Para grupos e redes de clínicas',
    highlight: false,
    features: [
      'Tudo do plano Clínico',
      'API de integração',
      'White-label (em breve)',
      'SLA de uptime garantido',
      'Onboarding dedicado',
      'Gestor de conta exclusivo',
    ],
  },
]

const PLAN_LABEL: Record<string, string> = {
  solo: 'Solo',
  clinico: 'Clínico',
  pro: 'Pro',
}

interface Props {
  status: SubscriptionStatus
}

export function PlanosClient({ status }: Props) {
  const whatsappLink = 'https://wa.me/5511999999999?text=Olá!%20Quero%20assinar%20o%20Vínculo.'

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-8">

      {/* Status banner */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible">
        {status.active && status.trialing && (
          <TrialBanner daysLeft={status.daysLeft ?? 0} plan={status.plan ?? 'solo'} />
        )}
        {status.active && !status.trialing && (
          <ActiveBanner plan={status.plan ?? 'solo'} />
        )}
        {!status.active && (
          <ExpiredBanner />
        )}
      </motion.div>

      {/* Plan cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {PLANS.map((plan, i) => {
          const isCurrent = status.active && status.plan === plan.id

          return (
            <motion.div
              key={plan.id}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.1 + i * 0.08 }}
              className={`relative rounded-2xl border p-6 flex flex-col gap-5 ${
                plan.highlight
                  ? 'border-brand-teal bg-brand-teal/5 shadow-md'
                  : 'border-neutral-border bg-white'
              }`}
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-teal text-white text-[11px] font-semibold px-3 py-0.5 rounded-full">
                  Mais popular
                </span>
              )}

              {isCurrent && (
                <span className="absolute top-4 right-4 bg-semantic-success/10 text-semantic-success text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-semantic-success/20">
                  Plano atual
                </span>
              )}

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Gem size={16} className={plan.highlight ? 'text-brand-teal' : 'text-neutral-secondary'} strokeWidth={1.5} />
                  <h3 className="font-semibold text-neutral-charcoal">{plan.name}</h3>
                </div>
                <p className="text-xs text-neutral-secondary mb-3">{plan.description}</p>
                <div className="flex items-baseline gap-0.5">
                  <span className="text-2xl font-bold text-neutral-charcoal">{plan.price}</span>
                  <span className="text-sm text-neutral-secondary">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-2.5 flex-1">
                {plan.features.map((feat) => (
                  <li key={feat} className="flex items-start gap-2 text-sm text-neutral-charcoal">
                    <Check size={14} className="text-semantic-success mt-0.5 flex-shrink-0" strokeWidth={2.5} />
                    {feat}
                  </li>
                ))}
              </ul>

              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-input text-sm font-semibold transition-colors duration-fast ${
                  isCurrent
                    ? 'bg-neutral-border/50 text-neutral-secondary cursor-default pointer-events-none'
                    : plan.highlight
                    ? 'bg-brand-teal hover:bg-brand-teal-dark text-white'
                    : 'bg-white border border-neutral-border hover:border-brand-teal hover:text-brand-teal text-neutral-charcoal'
                }`}
              >
                {isCurrent ? (
                  'Plano ativo'
                ) : (
                  <>
                    <MessageCircle size={15} />
                    Falar com a equipe
                  </>
                )}
              </a>
            </motion.div>
          )
        })}
      </div>

      {/* Fine print */}
      <p className="text-center text-xs text-neutral-secondary/60 pb-4">
        Pagamento via Pix ou cartão. Cancele a qualquer momento sem multa.
        Os planos serão ativados automaticamente ao final do período de trial.
      </p>
    </div>
  )
}

function TrialBanner({ daysLeft, plan }: { daysLeft: number; plan: string }) {
  const urgent = daysLeft <= 7
  return (
    <div className={`flex items-start gap-3 rounded-2xl border px-5 py-4 ${
      urgent
        ? 'bg-semantic-warning-bg border-semantic-warning/30 text-semantic-warning'
        : 'bg-brand-teal/5 border-brand-teal/20 text-brand-teal'
    }`}>
      <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
      <div>
        <p className="font-semibold text-sm">
          {urgent
            ? `Atenção: seu trial expira em ${daysLeft} dia${daysLeft !== 1 ? 's' : ''}`
            : `Trial gratuito ativo — ${daysLeft} dias restantes`}
        </p>
        <p className="text-sm opacity-80 mt-0.5">
          Você está no plano <strong>{PLAN_LABEL[plan] ?? plan}</strong> em período de avaliação.
          {urgent ? ' Assine agora para não perder o acesso.' : ' Aproveite todos os recursos sem limitações.'}
        </p>
      </div>
    </div>
  )
}

function ActiveBanner({ plan }: { plan: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border bg-semantic-success-bg border-semantic-success/20 px-5 py-4 text-semantic-success">
      <Gem size={20} className="flex-shrink-0 mt-0.5" strokeWidth={1.5} />
      <div>
        <p className="font-semibold text-sm">Assinatura ativa</p>
        <p className="text-sm opacity-80 mt-0.5">
          Você está no plano <strong>{PLAN_LABEL[plan] ?? plan}</strong>. Obrigado por usar o Vínculo!
        </p>
      </div>
    </div>
  )
}

function ExpiredBanner() {
  return (
    <div className="flex items-start gap-3 rounded-2xl border bg-semantic-danger-bg border-semantic-danger/20 px-5 py-4 text-semantic-danger">
      <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
      <div>
        <p className="font-semibold text-sm">Assinatura inativa</p>
        <p className="text-sm opacity-80 mt-0.5">
          Seu acesso está limitado. Assine um plano abaixo para continuar usando todos os recursos.
        </p>
      </div>
    </div>
  )
}
