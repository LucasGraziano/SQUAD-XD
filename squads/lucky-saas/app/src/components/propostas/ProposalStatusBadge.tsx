import { cn } from '@/lib/utils/cn'
import type { ProposalStatus } from '@/app/actions/proposals'

const STATUS_CONFIG: Record<ProposalStatus, { label: string; className: string }> = {
  rascunho:   { label: 'Rascunho',   className: 'bg-[#F3F4F6] text-[#6B7280]' },
  enviada:    { label: 'Enviada',    className: 'bg-[#EFF6FF] text-[#2563EB]' },
  em_analise: { label: 'Em Análise', className: 'bg-[#FEF3C7] text-[#D97706]' },
  emitida:    { label: 'Emitida',    className: 'bg-[#DCFCE7] text-[#16A34A]' },
  recusada:   { label: 'Recusada',   className: 'bg-[#FEE2E2] text-[#DC2626]' },
  cancelada:  { label: 'Cancelada',  className: 'bg-[#F3F4F6] text-[#9CA3AF]' },
}

export function ProposalStatusBadge({ status }: { status: ProposalStatus }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.rascunho
  return (
    <span className={cn('px-2 py-0.5 rounded-[4px] text-[11px] font-semibold uppercase', cfg.className)}>
      {cfg.label}
    </span>
  )
}
