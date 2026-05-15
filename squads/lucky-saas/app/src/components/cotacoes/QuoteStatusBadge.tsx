import type { QuoteStatus } from '@/types/quote'
import { QUOTE_STATUS_LABELS, QUOTE_STATUS_COLORS } from '@/lib/constants/quote-status'

interface Props {
  status: QuoteStatus
  className?: string
}

export function QuoteStatusBadge({ status, className = '' }: Props) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-[4px] text-[11px] font-semibold ${QUOTE_STATUS_COLORS[status]} ${className}`}
    >
      {QUOTE_STATUS_LABELS[status]}
    </span>
  )
}
