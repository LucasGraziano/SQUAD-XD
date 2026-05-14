import type { ApoliceHistoryItem } from '@/lib/clients/renewal-history'

const STATUS_STYLES: Record<ApoliceHistoryItem['status'], string> = {
  ativa: 'bg-[#DCFCE7] text-[#16A34A]',
  expirada: 'bg-[#F3F4F6] text-[#6B7280]',
  cancelada: 'bg-[#FEE2E2] text-[#DC2626]',
  renovada: 'bg-[#DBEAFE] text-[#1D4ED8]',
}

const STATUS_LABELS: Record<ApoliceHistoryItem['status'], string> = {
  ativa: 'Ativa',
  expirada: 'Expirada',
  cancelada: 'Cancelada',
  renovada: 'Renovada',
}

export function ApoliceStatusBadge({ status }: { status: ApoliceHistoryItem['status'] }) {
  return (
    <span className={`px-2 py-0.5 rounded-[4px] text-[11px] font-bold uppercase ${STATUS_STYLES[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  )
}
