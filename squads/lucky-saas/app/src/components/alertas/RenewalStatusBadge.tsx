'use client'

import { RefreshCw } from 'lucide-react'

interface Props {
  status: 'in_progress' | 'renewed'
}

export function RenewalStatusBadge({ status }: Props) {
  if (status === 'renewed') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] bg-[#DCFCE7] text-[#16A34A] text-[11px] font-semibold">
        <RefreshCw size={10} />
        Renovado
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] bg-[#EFF6FF] text-[#2563EB] text-[11px] font-semibold">
      <RefreshCw size={10} className="animate-spin" style={{ animationDuration: '3s' }} />
      Renovação em andamento
    </span>
  )
}
