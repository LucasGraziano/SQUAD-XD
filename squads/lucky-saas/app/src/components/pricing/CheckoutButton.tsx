'use client'

import { useTransition } from 'react'
import { createCheckoutSession } from '@/app/actions/billing'
import type { Plan } from '@/lib/stripe'

interface CheckoutButtonProps {
  plan: Plan
  label: string
  highlight?: boolean
}

export function CheckoutButton({ plan, label, highlight }: CheckoutButtonProps) {
  const [pending, startTransition] = useTransition()

  return (
    <button
      onClick={() => startTransition(() => createCheckoutSession(plan))}
      disabled={pending}
      className={`h-10 w-full flex items-center justify-center rounded-[6px] text-[14px] font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
        highlight
          ? 'bg-[#0BD904] text-[#0D0D0D] hover:bg-[#09C003]'
          : 'border border-[#D1D1D1] bg-white text-[#0D0D0D] hover:bg-[#F4F4F4]'
      }`}
    >
      {pending ? 'Redirecionando...' : label}
    </button>
  )
}
