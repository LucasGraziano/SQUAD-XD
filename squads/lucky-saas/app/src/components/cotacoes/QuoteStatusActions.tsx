'use client'

import { useState } from 'react'
import { ChevronDown, FileCheck } from 'lucide-react'
import type { QuoteStatus } from '@/types/quote'
import { QUOTE_STATUS_ACTIONS } from '@/lib/constants/quote-status'
import { updateQuoteStatus } from '@/app/(dashboard)/cotacoes/actions'
import { ConvertToApoliceModal } from './ConvertToApoliceModal'

interface Props {
  quoteId: string
  currentStatus: QuoteStatus
  onStatusChanged: (quoteId: string, newStatus: QuoteStatus) => void
  onConverted?: (quoteId: string, apoliceId: string) => void
}

export function QuoteStatusActions({ quoteId, currentStatus, onStatusChanged, onConverted }: Props) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [convertOpen, setConvertOpen] = useState(false)

  const actions = QUOTE_STATUS_ACTIONS[currentStatus]
  const canConvert = currentStatus === 'approved'
  if ((!actions || actions.length === 0) && !canConvert) return null

  async function handleAction(next: QuoteStatus) {
    setOpen(false)
    setLoading(true)
    const result = await updateQuoteStatus(quoteId, next)
    setLoading(false)
    if (!result.error) {
      onStatusChanged(quoteId, next)
    }
  }

  function handleConverted(apoliceId: string) {
    onStatusChanged(quoteId, 'contracted')
    onConverted?.(quoteId, apoliceId)
  }

  return (
    <>
      {/* Botão "Converter em Apólice" inline para status approved */}
      {canConvert && (
        <button
          onClick={() => setConvertOpen(true)}
          className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[6px] bg-[rgba(11,217,4,0.10)] border border-[rgba(11,217,4,0.3)] text-[12px] font-semibold text-[#034001] hover:bg-[rgba(11,217,4,0.18)] transition-colors"
        >
          <FileCheck size={13} />
          Converter em Apólice
        </button>
      )}

      {/* Dropdown de ações secundárias */}
      {actions && actions.length > 0 && (
        <div className="relative">
          <button
            onClick={() => setOpen(v => !v)}
            disabled={loading}
            className="inline-flex items-center gap-1 h-8 px-3 rounded-[6px] border border-[#D1D1D1] text-[12px] font-medium text-[#6B7280] hover:border-[#0BD904] hover:text-[#0D0D0D] transition-colors disabled:opacity-50"
          >
            {loading ? 'Atualizando…' : 'Ações'}
            <ChevronDown size={12} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>

          {open && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
              <div className="absolute right-0 top-full mt-1 z-20 min-w-[180px] bg-white rounded-[8px] border border-[#E5E5E5] shadow-lg py-1">
                {actions.map(action => (
                  <button
                    key={action.next}
                    onClick={() => handleAction(action.next)}
                    className="w-full text-left px-4 py-2 text-[13px] text-[#0D0D0D] hover:bg-[#F9FAFB] transition-colors"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <ConvertToApoliceModal
        quoteId={quoteId}
        open={convertOpen}
        onClose={() => setConvertOpen(false)}
        onConverted={handleConverted}
      />
    </>
  )
}
