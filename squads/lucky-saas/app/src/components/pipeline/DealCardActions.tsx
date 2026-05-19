'use client'

import { useRouter } from 'next/navigation'
import { useTransition, useState } from 'react'
import { updateDealStage, deleteDeal } from '@/app/actions/deals'
import type { DealSummary } from '@/app/actions/deals'
import type { DealStage } from '@/lib/constants/deal-stages'

interface Props {
  deal: DealSummary
  onStageChange?: (dealId: string, stage: DealStage) => void
  onDelete?: (dealId: string) => void
}

export function DealCardActions({ deal, onStageChange, onDelete }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [confirmDelete, setConfirmDelete] = useState(false)

  function openWorkspace() {
    router.push(`/deals/${deal.id}`)
  }

  async function changeStage(next: DealStage) {
    startTransition(async () => {
      const result = await updateDealStage(deal.id, next)
      if (!result.error) onStageChange?.(deal.id, next)
    })
  }

  async function handleDelete(e: React.MouseEvent) {
    e.stopPropagation()
    startTransition(async () => {
      const result = await deleteDeal(deal.id)
      if (!result.error) onDelete?.(deal.id)
      else setConfirmDelete(false)
    })
  }

  const btnCls = "text-[11px] font-medium px-2 py-1 rounded-[4px] transition-colors disabled:opacity-50"

  if (confirmDelete) {
    return (
      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
        <span className="text-[11px] text-[#DC2626] font-medium">Excluir?</span>
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="text-[11px] text-white bg-[#DC2626] px-2 py-1 rounded-[4px] hover:bg-[#B91C1C] disabled:opacity-50"
        >
          Sim
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); setConfirmDelete(false) }}
          className="text-[11px] text-[#6B7280] border border-[#D1D1D1] px-2 py-1 rounded-[4px] hover:bg-[#F8F8F8]"
        >
          Não
        </button>
      </div>
    )
  }

  if (deal.stage === 'prospecting') {
    return (
      <div className="flex items-center gap-1">
        <button
          onClick={(e) => { e.stopPropagation(); changeStage('draft') }}
          disabled={isPending}
          className={`${btnCls} bg-[#0BD904] text-[#034001] hover:bg-[#0acd03]`}
        >
          Iniciar Cotação
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); setConfirmDelete(true) }}
          className="text-[11px] text-[#9CA3AF] hover:text-[#DC2626] px-1.5 py-1 rounded-[4px] transition-colors"
          title="Excluir negociação"
        >
          ×
        </button>
      </div>
    )
  }

  if (deal.stage === 'issued') {
    return (
      <div className="flex items-center gap-1">
        <button
          onClick={(e) => { e.stopPropagation(); openWorkspace() }}
          className={`${btnCls} bg-[#034001] text-white hover:bg-[#022c00]`}
        >
          Registrar Apólice
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); setConfirmDelete(true) }}
          className="text-[11px] text-[#9CA3AF] hover:text-[#DC2626] px-1.5 py-1 rounded-[4px] transition-colors"
          title="Excluir negociação"
        >
          ×
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={(e) => { e.stopPropagation(); openWorkspace() }}
        className={`${btnCls} text-[#6B7280] hover:text-[#0D0D0D] border border-[#E5E5E5] hover:border-[#D1D1D1]`}
      >
        Abrir
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); setConfirmDelete(true) }}
        className="text-[11px] text-[#9CA3AF] hover:text-[#DC2626] px-1.5 py-1 rounded-[4px] transition-colors"
        title="Excluir negociação"
      >
        ×
      </button>
    </div>
  )
}
