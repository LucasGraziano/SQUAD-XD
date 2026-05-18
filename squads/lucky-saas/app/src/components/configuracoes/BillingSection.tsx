'use client'

import { useTransition } from 'react'
import { createPortalSession } from '@/app/actions/billing'
import { ExternalLink } from 'lucide-react'

const PLAN_LABELS: Record<string, string> = {
  solo: 'Solo — R$47/mês',
  profissional: 'Profissional — R$97/mês',
  equipe: 'Equipe — R$197/mês',
  enterprise: 'Enterprise',
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  trial:    { label: 'Trial gratuito', color: 'text-[#D97706]' },
  active:   { label: 'Ativa', color: 'text-[#16A34A]' },
  past_due: { label: 'Pagamento pendente', color: 'text-[#DC2626]' },
  canceled: { label: 'Cancelada', color: 'text-[#DC2626]' },
  churned:  { label: 'Encerrada', color: 'text-[#9CA3AF]' },
}

interface BillingSectionProps {
  plan: string
  subscriptionStatus: string | null
  trialEndsAt: string | null
  stripeCustomerId: string | null
}

export function BillingSection({ plan, subscriptionStatus, trialEndsAt, stripeCustomerId }: BillingSectionProps) {
  const [pending, startTransition] = useTransition()
  const status = subscriptionStatus ?? 'trial'
  const statusInfo = STATUS_LABELS[status] ?? STATUS_LABELS['trial']
  const planLabel = PLAN_LABELS[plan] ?? plan

  const trialEndsFormatted = trialEndsAt
    ? new Date(trialEndsAt).toLocaleDateString('pt-BR')
    : null

  return (
    <div className="bg-white rounded-[8px] border border-[#E5E5E5] p-6">
      <p className="text-[14px] font-semibold text-[#0D0D0D] mb-4">Assinatura</p>

      <div className="space-y-3 mb-5">
        <div className="flex items-center justify-between">
          <span className="text-[13px] text-[#6B7280]">Plano atual</span>
          <span className="text-[13px] font-semibold text-[#0D0D0D]">{planLabel}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[13px] text-[#6B7280]">Status</span>
          <span className={`text-[13px] font-semibold ${statusInfo.color}`}>{statusInfo.label}</span>
        </div>
        {status === 'trial' && trialEndsFormatted && (
          <div className="flex items-center justify-between">
            <span className="text-[13px] text-[#6B7280]">Trial encerra em</span>
            <span className="text-[13px] font-semibold text-[#D97706]">{trialEndsFormatted}</span>
          </div>
        )}
      </div>

      <div className="flex gap-3 flex-wrap">
        {stripeCustomerId ? (
          <button
            onClick={() => startTransition(() => createPortalSession())}
            disabled={pending}
            className="h-9 px-4 flex items-center gap-2 rounded-[6px] border border-[#D1D1D1] bg-white text-[#0D0D0D] text-[13px] font-semibold hover:bg-[#F4F4F4] transition-colors disabled:opacity-60"
          >
            <ExternalLink size={14} />
            {pending ? 'Abrindo...' : 'Gerenciar assinatura'}
          </button>
        ) : (
          <a
            href="/pricing"
            className="h-9 px-4 flex items-center rounded-[6px] bg-[#0BD904] text-[#0D0D0D] text-[13px] font-semibold hover:bg-[#09C003] transition-colors"
          >
            Assinar agora
          </a>
        )}
      </div>
    </div>
  )
}
