'use client'

import { useEffect } from 'react'
import { Trophy } from 'lucide-react'

interface Props {
  show: boolean
}

export function OnboardingCelebration({ show }: Props) {
  useEffect(() => {
    if (!show) return
    // Dynamic import to avoid SSR issues
    import('canvas-confetti').then(({ default: confetti }) => {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0BD904', '#0D0D0D', '#FFFFFF'],
      })
    }).catch(() => {
      // canvas-confetti optional — silently skip if not available
    })
  }, [show])

  if (!show) return null

  return (
    <div className="flex items-center gap-3 mt-3 p-3 rounded-[8px] bg-[rgba(11,217,4,0.08)] border border-[rgba(11,217,4,0.3)]">
      <Trophy size={20} className="text-[#0BD904] flex-shrink-0" />
      <div>
        <p className="text-[13px] font-semibold text-[#034001]">Setup completo! 🎉</p>
        <p className="text-[12px] text-[#6B7280]">O Premia está configurado e pronto para trabalhar por você.</p>
      </div>
    </div>
  )
}
