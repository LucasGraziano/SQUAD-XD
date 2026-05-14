'use client'

import { Cake } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface Props {
  active: boolean
  onToggle: () => void
}

export function BirthdayFilterBadge({ active, onToggle }: Props) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        'inline-flex items-center gap-1.5 h-8 px-3 rounded-[6px] text-[12px] font-medium border transition-colors',
        active
          ? 'bg-[#FEF3C7] border-[#FDE68A] text-[#D97706]'
          : 'bg-white border-[#D1D1D1] text-[#6B7280] hover:border-[#0BD904]'
      )}
    >
      <Cake size={13} />
      Aniversariantes do mês
    </button>
  )
}
