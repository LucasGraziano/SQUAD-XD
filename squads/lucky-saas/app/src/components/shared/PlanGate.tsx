'use client'

import { useState, useEffect } from 'react'
import { Lock } from 'lucide-react'
import { useBrokerPlan } from '@/contexts/BrokerPlanContext'
import {
  meetsRequirement,
  PLAN_GATE_FEATURES,
  PLAN_DISPLAY,
  type RequiredPlan,
} from '@/lib/constants/plan-gates'
import { PlanGateModal } from './PlanGateModal'
import { capturePlanGateShown } from '@/lib/posthog'

const FEATURE_LABELS: Record<string, string> = {
  'email-automatico': 'E-mail Marketing de Renovações',
  'portal-cliente': 'Portal do Cliente',
  'assinatura-digital': 'Assinatura Digital',
  'relatorios-avancados': 'Relatórios Avançados',
  'whatsapp-api': 'WhatsApp Business API',
  'google-calendar': 'Agenda Google Calendar',
}

interface Props {
  requiredPlan: RequiredPlan
  feature: string
  modal?: 'soft' | 'hard'
  children: React.ReactNode
  currentPlan?: string
}

export function PlanGate({
  requiredPlan,
  feature,
  modal,
  children,
  currentPlan: currentPlanOverride,
}: Props) {
  const contextPlan = useBrokerPlan()
  const currentPlan = currentPlanOverride ?? contextPlan
  const [showModal, setShowModal] = useState(false)

  const gateConfig = PLAN_GATE_FEATURES[feature]
  const modalType = modal ?? gateConfig?.modal ?? 'soft'
  const anchor = gateConfig?.anchor ?? `Incluso no ${PLAN_DISPLAY[requiredPlan]?.name ?? requiredPlan}`
  const upgradeHref = gateConfig?.upgradeHref ?? '/pricing'

  const allowed = meetsRequirement(currentPlan, requiredPlan)

  useEffect(() => {
    if (!allowed) {
      capturePlanGateShown(feature, requiredPlan, currentPlan)
    }
  // run once on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (allowed) return <>{children}</>

  const featureLabel = FEATURE_LABELS[feature] ?? feature
  const planDisplay = PLAN_DISPLAY[requiredPlan]

  return (
    <>
      <div className="bg-white rounded-[8px] border border-[#E5E5E5]">
        <div className="p-8 flex flex-col items-center text-center">
          <div className="w-10 h-10 rounded-full bg-[#F3F4F6] flex items-center justify-center mb-3">
            <Lock size={18} className="text-[#9CA3AF]" />
          </div>
          <p className="text-[14px] font-semibold text-[#0D0D0D] mb-1.5">{featureLabel}</p>
          <p className="text-[13px] text-[#6B7280] mb-5 max-w-[300px]">{anchor}</p>
          <button
            onClick={() => setShowModal(true)}
            className="h-9 px-5 rounded-[6px] bg-[#0BD904] text-[#0D0D0D] text-[13px] font-bold hover:bg-[#09C003] transition-colors"
          >
            Ver planos →
          </button>
          {planDisplay && (
            <p className="text-[11px] text-[#9CA3AF] mt-2.5">
              Disponível no {planDisplay.name} ({planDisplay.price})
            </p>
          )}
        </div>
      </div>

      <PlanGateModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        feature={feature}
        featureLabel={featureLabel}
        requiredPlan={requiredPlan}
        currentPlan={currentPlan}
        anchor={anchor}
        modal={modalType}
        upgradeHref={upgradeHref}
      />
    </>
  )
}
