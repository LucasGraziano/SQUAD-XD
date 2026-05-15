'use client'

import { X, ArrowRight, Zap } from 'lucide-react'
import { RoiCalculator } from './RoiCalculator'
import { captureUpgradeClicked } from '@/lib/posthog'
import { PLAN_DISPLAY, type RequiredPlan } from '@/lib/constants/plan-gates'

interface Props {
  isOpen: boolean
  onClose: () => void
  feature: string
  featureLabel: string
  requiredPlan: RequiredPlan
  currentPlan: string
  anchor: string
  modal: 'soft' | 'hard'
  upgradeHref: string
}

const FEATURE_BENEFITS: Record<string, string[]> = {
  'email-automatico': [
    'Envios automáticos 60, 30 e 15 dias antes do vencimento',
    'Texto personalizável com a sua voz',
    'Aumenta taxa de renovação em até 40%',
  ],
  'portal-cliente': [
    'Link personalizado para cada cliente acessar suas apólices',
    'Solicitar documentos sem precisar de WhatsApp',
    'Parece maior, feche mais',
  ],
  'assinatura-digital': [
    'Assina propostas e documentos sem imprimir',
    'Integrado ao ZapSign — validade jurídica garantida',
    'Fechamento em horas, não dias',
  ],
  'relatorios-avancados': [
    'Forecast de comissões dos próximos 90 dias',
    'Análise por ramo, seguradora e período',
    'Exportação em PDF para apresentações',
  ],
  'whatsapp-api': [
    'Taxa de abertura de 98% vs 22% do e-mail',
    'Templates pré-aprovados pela Meta — envio direto do Premia',
    'Registro de entrega e leitura por apólice',
  ],
  'google-calendar': [
    'Vencimentos sincronizados automaticamente na sua agenda',
    'Zero duplicação de informações entre Premia e Google',
    'Lembrete inteligente 7 dias antes do vencimento',
  ],
}

export function PlanGateModal({
  isOpen,
  onClose,
  feature,
  featureLabel,
  requiredPlan,
  currentPlan,
  anchor,
  modal,
  upgradeHref,
}: Props) {
  if (!isOpen) return null

  const planDisplay = PLAN_DISPLAY[requiredPlan]
  const benefits = FEATURE_BENEFITS[feature] ?? []
  const showRoi = modal === 'soft' && requiredPlan === 'pro'

  function handleOverlayClick(e: React.MouseEvent) {
    if (e.target === e.currentTarget) onClose()
  }

  function handleUpgrade() {
    captureUpgradeClicked(feature, requiredPlan, currentPlan)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={handleOverlayClick}
    >
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative bg-white rounded-[12px] shadow-xl w-full max-w-[520px] mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[6px] bg-[rgba(11,217,4,0.1)] flex items-center justify-center flex-shrink-0">
              <Zap size={16} className="text-[#0BD904]" />
            </div>
            <div>
              <p className="text-[15px] font-bold text-[#0D0D0D]">{featureLabel}</p>
              <p className="text-[12px] text-[#9CA3AF]">{anchor}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center text-[#9CA3AF] hover:text-[#0D0D0D] hover:bg-[#F3F4F6] transition-colors flex-shrink-0 ml-2"
          >
            <X size={15} />
          </button>
        </div>

        <div className="px-6 pb-6">
          {/* Benefits list */}
          {benefits.length > 0 && (
            <ul className="space-y-2 mb-5">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-2.5">
                  <span className="w-4 h-4 rounded-full bg-[rgba(11,217,4,0.15)] text-[#0BD904] text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">
                    ✓
                  </span>
                  <span className="text-[13px] text-[#374151]">{benefit}</span>
                </li>
              ))}
            </ul>
          )}

          {/* ROI Calculator — only for soft-modal Pro gates */}
          {showRoi && (
            <div className="mb-5 p-4 rounded-[8px] border border-[#E5E5E5]">
              <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-4">
                Calcule seu retorno
              </p>
              <RoiCalculator context="modal" />
            </div>
          )}

          {/* CTA */}
          <a
            href={upgradeHref}
            onClick={handleUpgrade}
            className="flex items-center justify-center gap-2 w-full h-11 rounded-[6px] bg-[#0BD904] text-[#0D0D0D] text-[14px] font-bold hover:bg-[#09C003] transition-colors"
          >
            Fazer upgrade para {planDisplay.name}
            <ArrowRight size={15} />
          </a>
          <p className="text-center text-[11px] text-[#9CA3AF] mt-2.5">
            {planDisplay.price} · 14 dias grátis · Cancele quando quiser
          </p>
        </div>
      </div>
    </div>
  )
}
