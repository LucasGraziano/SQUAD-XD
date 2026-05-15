'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { FileText } from 'lucide-react'
import { createQuoteFromLead } from '@/app/actions/quotes'

interface Props {
  leadId: string
  hasClientId: boolean
  size?: 'sm' | 'xs'
}

export function LeadQuoteButton({ leadId, hasClientId, size = 'xs' }: Props) {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  if (!hasClientId) return null

  function handleClick(e: React.MouseEvent) {
    e.stopPropagation()
    setError(null)
    startTransition(async () => {
      const result = await createQuoteFromLead(leadId)
      if (result.error) {
        setError(result.error)
      } else if (result.quoteId) {
        router.push('/cotacoes')
        router.refresh()
      }
    })
  }

  const heightCls = size === 'xs' ? 'h-7 px-2.5 text-[11px]' : 'h-8 px-3 text-[12px]'

  return (
    <div className="flex flex-col gap-1">
      <button
        onClick={handleClick}
        disabled={isPending}
        className={`inline-flex items-center gap-1 rounded-[5px] bg-[#F3F4F6] text-[#6B7280] font-medium hover:bg-[rgba(11,217,4,0.10)] hover:text-[#034001] disabled:opacity-50 transition-colors ${heightCls}`}
      >
        <FileText size={11} />
        {isPending ? 'Criando…' : 'Criar Cotação'}
      </button>
      {error && <p className="text-[11px] text-[#DC2626]">{error}</p>}
    </div>
  )
}
