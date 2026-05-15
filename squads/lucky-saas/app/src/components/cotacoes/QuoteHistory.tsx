'use client'

import { useEffect, useState } from 'react'
import { Clock, ArrowRight } from 'lucide-react'
import { getQuoteHistory } from '@/app/(dashboard)/cotacoes/actions'
import { QUOTE_STATUS_LABELS } from '@/lib/constants/quote-status'
import type { QuoteStatus } from '@/types/quote'

type StatusEntry = {
  id: string
  from_status: string
  to_status: string
  changed_at: string
}

type ItemEntry = {
  id: string
  action: string
  snapshot: Record<string, unknown>
  changed_at: string
}

function formatTs(iso: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
  }).format(new Date(iso))
}

function actionLabel(action: string) {
  return action === 'created' ? 'adicionada' : action === 'updated' ? 'atualizada' : 'removida'
}

interface Props {
  quoteId: string
}

export function QuoteHistory({ quoteId }: Props) {
  const [statusHistory, setStatusHistory] = useState<StatusEntry[]>([])
  const [itemHistory, setItemHistory] = useState<ItemEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getQuoteHistory(quoteId).then(({ statusHistory: sh, itemHistory: ih }) => {
      setStatusHistory(sh as StatusEntry[])
      setItemHistory(ih as ItemEntry[])
      setLoading(false)
    })
  }, [quoteId])

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-[12px] text-[#9CA3AF] py-4">
        <Clock size={13} className="animate-pulse" /> Carregando histórico…
      </div>
    )
  }

  const allEntries = [
    ...statusHistory.map(e => ({ type: 'status' as const, ...e })),
    ...itemHistory.map(e => ({ type: 'item' as const, ...e, from_status: '', to_status: '' })),
  ].sort((a, b) => a.changed_at.localeCompare(b.changed_at))

  if (allEntries.length === 0) {
    return (
      <div className="flex items-center gap-2 text-[12px] text-[#9CA3AF] py-4">
        <Clock size={13} /> Nenhuma alteração registrada.
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {allEntries.map(entry => (
        <div key={entry.id} className="flex items-start gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-[#D1D1D1] mt-1.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            {entry.type === 'status' ? (
              <p className="text-[12px] text-[#0D0D0D]">
                Status alterado:{' '}
                <span className="font-medium">
                  {QUOTE_STATUS_LABELS[entry.from_status as QuoteStatus] ?? entry.from_status}
                </span>{' '}
                <ArrowRight size={11} className="inline text-[#9CA3AF]" />{' '}
                <span className="font-medium">
                  {QUOTE_STATUS_LABELS[entry.to_status as QuoteStatus] ?? entry.to_status}
                </span>
              </p>
            ) : (
              <p className="text-[12px] text-[#0D0D0D]">
                Seguradora{' '}
                <span className="font-medium">
                  {String((entry as ItemEntry).snapshot?.seguradora ?? '—')}
                </span>{' '}
                {actionLabel((entry as ItemEntry).action)}
              </p>
            )}
            <p className="text-[11px] text-[#9CA3AF] mt-0.5">{formatTs(entry.changed_at)}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
