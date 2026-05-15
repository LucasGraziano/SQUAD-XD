'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { RefreshCw } from 'lucide-react'
import { createRenewalQuote } from '@/app/actions/quotes'

interface Props {
  policyId: string
  hasRenewalQuote?: boolean
  renewalQuoteId?: string | null
}

export function RenewalButton({ policyId, hasRenewalQuote, renewalQuoteId }: Props) {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  if (hasRenewalQuote && renewalQuoteId) {
    return (
      <a
        href={`/cotacoes`}
        className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[6px] bg-[#EFF6FF] border border-[#BFDBFE] text-[12px] font-semibold text-[#2563EB] hover:bg-[#DBEAFE] transition-colors"
      >
        <RefreshCw size={13} />
        Ver Cotação de Renovação
      </a>
    )
  }

  function handleClick() {
    setError(null)
    startTransition(async () => {
      const result = await createRenewalQuote(policyId)
      if (result.error) {
        setError(result.error)
      } else if (result.quoteId) {
        router.push(`/cotacoes`)
        router.refresh()
      }
    })
  }

  return (
    <div className="flex flex-col gap-1">
      <button
        onClick={handleClick}
        disabled={isPending}
        className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[6px] bg-[rgba(11,217,4,0.10)] border border-[rgba(11,217,4,0.3)] text-[12px] font-semibold text-[#034001] hover:bg-[rgba(11,217,4,0.18)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <RefreshCw size={13} className={isPending ? 'animate-spin' : ''} />
        {isPending ? 'Criando…' : 'Gerar Cotação de Renovação'}
      </button>
      {error && <p className="text-[11px] text-[#DC2626]">{error}</p>}
    </div>
  )
}
