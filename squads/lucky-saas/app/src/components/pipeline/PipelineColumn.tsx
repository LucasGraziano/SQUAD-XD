'use client'

import { useState } from 'react'
import { useDroppable } from '@dnd-kit/core'
import type { DealSummary } from '@/app/actions/deals'
import type { DealStage } from '@/lib/constants/deal-stages'
import { DEAL_STAGE_LABELS } from '@/lib/constants/deal-stages'
import { DealCard } from './DealCard'
import { DealCardActions } from './DealCardActions'

const VISIBLE_LIMIT = 5

interface Props {
  stage: DealStage
  deals: DealSummary[]
  onOpenDeal: (deal: DealSummary) => void
  onStageChange: (dealId: string, stage: DealStage) => void
  onDeleteDeal?: (dealId: string) => void
}

function formatCurrency(value: number): string {
  if (value >= 1000) return 'R$' + Math.round(value / 1000) + 'k'
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(value)
}

export function PipelineColumn({ stage, deals, onOpenDeal, onStageChange, onDeleteDeal }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: stage })
  const [showAll, setShowAll] = useState(false)

  const totalValue = deals.reduce((sum, d) => {
    const rec = d.deal_items.find(i => i.is_recommended) ?? d.deal_items[0]
    return sum + (rec?.premium_total ?? 0)
  }, 0)

  const visible = showAll ? deals : deals.slice(0, VISIBLE_LIMIT)
  const hiddenCount = deals.length - VISIBLE_LIMIT

  return (
    <div className="flex flex-col w-[220px] shrink-0">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[12px] font-semibold text-[#374151] uppercase tracking-wide">
          {DEAL_STAGE_LABELS[stage]}
        </span>
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-[#9CA3AF]">{deals.length}</span>
          {totalValue > 0 && (
            <span className="text-[11px] text-[#6B7280]">· {formatCurrency(totalValue)}</span>
          )}
        </div>
      </div>

      {/* Drop zone */}
      <div
        ref={setNodeRef}
        className={`
          flex-1 flex flex-col gap-2 rounded-[8px] p-2 min-h-[120px] transition-colors
          ${isOver ? 'bg-[rgba(11,217,4,0.05)] border border-dashed border-[#0BD904]' : 'bg-[#F8F8F8]'}
        `}
      >
        {visible.map((deal) => (
          <div key={deal.id} className="flex flex-col gap-1">
            <DealCard deal={deal} onOpen={onOpenDeal} />
            <DealCardActions deal={deal} onStageChange={onStageChange} onDelete={onDeleteDeal} />
          </div>
        ))}

        {/* Ver mais / Ver menos */}
        {!showAll && hiddenCount > 0 && (
          <button
            onClick={() => setShowAll(true)}
            className="mt-1 text-[11px] text-[#6B7280] hover:text-[#0D0D0D] font-medium py-1.5 px-2 rounded-[6px] hover:bg-[#EFEFEF] transition-colors text-center border border-dashed border-[#D1D1D1]"
          >
            Ver mais {hiddenCount} negociação{hiddenCount !== 1 ? 'ões' : ''}
          </button>
        )}
        {showAll && deals.length > VISIBLE_LIMIT && (
          <button
            onClick={() => setShowAll(false)}
            className="mt-1 text-[11px] text-[#9CA3AF] hover:text-[#6B7280] py-1 text-center transition-colors"
          >
            Ver menos
          </button>
        )}

        {deals.length === 0 && (
          <div className="flex-1 flex items-center justify-center py-4">
            <span className="text-[11px] text-[#9CA3AF]">Arraste um deal aqui</span>
          </div>
        )}
      </div>
    </div>
  )
}
