'use client'

import type { QuoteStatus } from '@/types/quote'
import { QUOTE_STATUS_LABELS } from '@/lib/constants/quote-status'

const ALL_STATUSES: (QuoteStatus | 'all')[] = ['all', 'draft', 'sent', 'approved', 'rejected', 'contracted']

const FILTER_LABELS: Record<QuoteStatus | 'all', string> = {
  all:        'Todas',
  draft:      'Rascunho',
  sent:       'Enviadas',
  approved:   'Aprovadas',
  rejected:   'Recusadas',
  contracted: 'Contratadas',
}

interface Props {
  value: QuoteStatus | 'all'
  onChange: (value: QuoteStatus | 'all') => void
}

export function QuoteStatusFilter({ value, onChange }: Props) {
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {ALL_STATUSES.map(s => (
        <button
          key={s}
          onClick={() => onChange(s)}
          className={`h-7 px-3 rounded-[6px] text-[12px] font-medium transition-colors ${
            value === s
              ? 'bg-[#0BD904] text-[#0D0D0D]'
              : 'bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E5E7EB]'
          }`}
        >
          {FILTER_LABELS[s]}
        </button>
      ))}
    </div>
  )
}
