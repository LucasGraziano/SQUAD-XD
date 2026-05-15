'use client'

import { CheckCircle2, Circle, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export interface Step {
  key: string
  title: string
  description: string
  href: string
  done: boolean
}

interface Props {
  step: Step
  index: number
}

export function OnboardingStep({ step, index }: Props) {
  return (
    <div className={`flex items-start gap-3 p-3 rounded-[8px] transition-colors ${step.done ? 'opacity-60' : 'hover:bg-[#F9FAFB]'}`}>
      <div className="flex-shrink-0 mt-0.5">
        {step.done
          ? <CheckCircle2 size={20} className="text-[#0BD904]" fill="rgba(11,217,4,0.15)" />
          : <Circle size={20} className="text-[#D1D1D1]" />
        }
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-[#9CA3AF]">{index + 1}.</span>
          <span className={`text-[14px] font-semibold ${step.done ? 'line-through text-[#9CA3AF]' : 'text-[#0D0D0D]'}`}>
            {step.title}
          </span>
        </div>
        <p className="text-[12px] text-[#6B7280] mt-0.5">{step.description}</p>
      </div>
      {!step.done && (
        <Link
          href={step.href}
          className="flex-shrink-0 flex items-center gap-1 h-7 px-3 rounded-[6px] bg-[#0D0D0D] text-white text-[12px] font-medium hover:bg-[#1A1A1A] transition-colors"
        >
          Ir
          <ArrowRight size={11} />
        </Link>
      )}
    </div>
  )
}
