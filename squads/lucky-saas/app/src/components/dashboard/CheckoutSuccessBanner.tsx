'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { X } from 'lucide-react'

const PLAN_LABELS: Record<string, string> = {
  solo: 'Solo',
  profissional: 'Profissional',
  equipe: 'Equipe',
}

export function CheckoutSuccessBanner() {
  const params = useSearchParams()
  const router = useRouter()
  const isSuccess = params.get('checkout') === 'success'
  const plan = params.get('plan')

  if (!isSuccess) return null

  const planLabel = plan ? PLAN_LABELS[plan] ?? plan : null

  function dismiss() {
    const url = new URL(window.location.href)
    url.searchParams.delete('checkout')
    url.searchParams.delete('plan')
    router.replace(url.pathname + (url.search || ''))
  }

  return (
    <div className="mb-6 flex items-center justify-between gap-4 rounded-[8px] border border-[#0BD904] bg-[rgba(11,217,4,0.08)] px-5 py-3.5">
      <p className="text-[14px] font-semibold text-[#034001]">
        {planLabel
          ? `Bem-vindo ao plano ${planLabel}! Suas features estão ativas.`
          : 'Assinatura confirmada! Suas features estão ativas.'}
      </p>
      <button onClick={dismiss} className="shrink-0 text-[#034001] hover:opacity-70">
        <X size={16} />
      </button>
    </div>
  )
}
