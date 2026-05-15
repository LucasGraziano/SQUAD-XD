'use client'

import { useState, useTransition } from 'react'
import { Share2, Copy, Check } from 'lucide-react'
import { getShareableQuote } from '@/app/actions/quotes'

interface Props {
  quoteId: string
}

export function ShareQuoteButton({ quoteId }: Props) {
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleShare() {
    setError(null)
    startTransition(async () => {
      const result = await getShareableQuote(quoteId)
      if (result.error) { setError(result.error); return }
      if (!result.token) return

      const url = `${window.location.origin}/proposta/${result.token}`
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  return (
    <div className="flex flex-col gap-1">
      <button
        onClick={handleShare}
        disabled={isPending}
        className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[6px] border border-[#D1D1D1] text-[12px] font-medium text-[#6B7280] hover:border-[#0BD904] hover:text-[#0D0D0D] disabled:opacity-50 transition-colors"
      >
        {copied ? <Check size={13} className="text-[#0BD904]" /> : <Share2 size={13} />}
        {copied ? 'Link copiado!' : isPending ? 'Gerando…' : 'Compartilhar'}
        {!copied && !isPending && <Copy size={11} className="text-[#9CA3AF]" />}
      </button>
      {error && <p className="text-[11px] text-[#DC2626]">{error}</p>}
    </div>
  )
}
