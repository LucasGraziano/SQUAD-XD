'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { OnboardingProgress } from './OnboardingProgress'
import { OnboardingStep, type Step } from './OnboardingStep'
import { OnboardingCelebration } from './OnboardingCelebration'
import { dismissOnboarding } from '@/app/actions/onboarding'

interface OnboardingProgressData {
  profile: boolean
  first_client: boolean
  first_apolice: boolean
  viewed_alertas: boolean
  shared_portal: boolean
  dismissed: boolean
  completed_at: string | null
}

interface Props {
  progress: OnboardingProgressData
}

const STEPS: Omit<Step, 'done'>[] = [
  {
    key: 'profile',
    title: 'Complete seu perfil',
    description: 'Adicione SUSEP e dados da corretora',
    href: '/configuracoes',
  },
  {
    key: 'first_client',
    title: 'Cadastre seu primeiro cliente',
    description: 'Adicione um cliente para gerenciar propostas',
    href: '/clientes/novo',
  },
  {
    key: 'first_apolice',
    title: 'Adicione uma apólice',
    description: 'Cadastre manualmente ou importe CSV',
    href: '/apolices',
  },
  {
    key: 'viewed_alertas',
    title: 'Veja seus alertas de renovação',
    description: 'O sistema monitora seus vencimentos',
    href: '/alertas',
  },
  {
    key: 'shared_portal',
    title: 'Compartilhe o portal com um cliente',
    description: 'O cliente acessa apólices e documentos',
    href: '/portal',
  },
]

export function OnboardingChecklist({ progress: initialProgress }: Props) {
  const [progress, setProgress] = useState(initialProgress)
  const [dismissing, setDismissing] = useState(false)

  if (progress.dismissed) return null

  const steps: Step[] = STEPS.map(s => ({
    ...s,
    done: progress[s.key as keyof OnboardingProgressData] as boolean,
  }))

  const completed = steps.filter(s => s.done).length
  const total = steps.length
  const allDone = completed === total

  async function handleDismiss() {
    setDismissing(true)
    await dismissOnboarding()
    setProgress(prev => ({ ...prev, dismissed: true }))
  }

  return (
    <div className="bg-white rounded-[8px] border border-[#E5E5E5] p-4 mb-6">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-[15px] font-semibold text-[#0D0D0D]">Configure o Premia</h3>
          <p className="text-[12px] text-[#6B7280] mt-0.5">Complete os passos abaixo para começar a usar</p>
        </div>
        <button
          onClick={handleDismiss}
          disabled={dismissing}
          className="h-7 w-7 flex items-center justify-center rounded-[6px] text-[#9CA3AF] hover:text-[#6B7280] hover:bg-[#F3F4F6] transition-colors"
          title="Fechar"
        >
          <X size={14} />
        </button>
      </div>

      <OnboardingProgress completed={completed} total={total} />

      <div className="mt-3 space-y-1">
        {steps.map((step, i) => (
          <OnboardingStep key={step.key} step={step} index={i} />
        ))}
      </div>

      <OnboardingCelebration show={allDone} />
    </div>
  )
}
