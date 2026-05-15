import { CLAIM_STATUS_COLORS, CLAIM_STATUS_LABELS } from '@/types/claim'
import type { ClaimStatus } from '@/types/claim'

interface Props {
  status: ClaimStatus
  size?: 'sm' | 'md'
}

export function ClaimStatusBadge({ status, size = 'md' }: Props) {
  const color = CLAIM_STATUS_COLORS[status] ?? '#9CA3AF'
  const label = CLAIM_STATUS_LABELS[status] ?? status

  const bg = color + '1A'
  const padCls = size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2.5 py-1 text-[11px]'

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-[4px] font-semibold ${padCls}`}
      style={{ backgroundColor: bg, color }}
    >
      <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: color }} />
      {label}
    </span>
  )
}
