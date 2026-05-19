'use client'

import { useState, useTransition } from 'react'
import { updateDealStage } from '@/app/actions/deals'
import type { DealSummary } from '@/app/actions/deals'
import type { DealStage } from '@/lib/constants/deal-stages'
import { ConvertToApoliceModal } from './ConvertToApoliceModal'
import { useRouter } from 'next/navigation'

interface Props {
  deal: DealSummary
  onStageChange: (stage: DealStage) => void
  onConverted: (apoliceId: string) => void
}

const ACTION_MAP: Partial<Record<DealStage, { label: string; next?: DealStage; special?: string }>> = {
  prospecting:    { label: 'Iniciar Cotação',      next: 'draft' },
  draft:          { label: 'Enviar para Cliente',  next: 'sent' },
  sent:           { label: 'Marcar como Aprovada', next: 'approved' },
  approved:       { label: 'Enviar à Seguradora',  next: 'submitted' },
  submitted:      { label: 'Marcar Em Análise',    next: 'under_analysis' },
  under_analysis: { label: 'Seguradora Emitiu',    next: 'issued' },
  issued:         { label: 'Registrar Apólice',    special: 'convert' },
}

export function DealActionButton({ deal, onStageChange, onConverted }: Props) {
  const router = useRouter()
  const [convertOpen, setConvertOpen] = useState(false)
  const [archiveOpen, setArchiveOpen] = useState(false)
  const [archiveReason, setArchiveReason] = useState('')
  const [, startTransition] = useTransition()

  const action = ACTION_MAP[deal.stage]

  if (deal.stage === 'contracted' || deal.stage === 'rejected') {
    return null
  }

  async function handlePrimary() {
    if (!action) return
    if (action.special === 'convert') { setConvertOpen(true); return }
    if (!action.next) return

    startTransition(async () => {
      const result = await updateDealStage(deal.id, action.next!)
      if (!result.error) {
        onStageChange(action.next!)
        if (action.next === 'draft') router.push(`/deals/${deal.id}`)
      }
    })
  }

  async function handleArchive() {
    startTransition(async () => {
      const result = await updateDealStage(deal.id, 'rejected', archiveReason || 'arquivado')
      if (!result.error) { onStageChange('rejected'); setArchiveOpen(false) }
    })
  }

  return (
    <>
      <div className="flex items-center gap-2">
        {action && (
          <button
            onClick={handlePrimary}
            className="h-9 px-4 rounded-[6px] bg-[#0BD904] text-[#034001] text-[13px] font-semibold hover:bg-[#09C003] transition-colors"
          >
            {action.label}
          </button>
        )}

        <button
          onClick={() => setArchiveOpen(true)}
          className="h-9 px-3 rounded-[6px] border border-[#FECACA] text-[#DC2626] text-[13px] hover:bg-[#FEF2F2] transition-colors"
        >
          Recusar
        </button>
      </div>

      <ConvertToApoliceModal
        dealId={deal.id}
        open={convertOpen}
        onClose={() => setConvertOpen(false)}
        onConverted={(id) => { setConvertOpen(false); onConverted(id) }}
      />

      {/* Archive confirmation modal */}
      {archiveOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setArchiveOpen(false)} />
          <div className="relative bg-white rounded-[12px] shadow-xl w-full max-w-[380px] p-6">
            <h3 className="text-[16px] font-semibold text-[#0D0D0D] mb-2">Recusar / Arquivar Deal</h3>
            <p className="text-[13px] text-[#6B7280] mb-4">O deal será removido do pipeline. Esta ação pode ser desfeita reabrindo como rascunho.</p>
            <textarea
              value={archiveReason}
              onChange={(e) => setArchiveReason(e.target.value)}
              placeholder="Motivo (opcional)..."
              className="w-full h-20 rounded-[6px] border border-[#D1D1D1] px-3 py-2 text-[13px] outline-none focus:border-[#0BD904] resize-none mb-4"
            />
            <div className="flex gap-2 justify-end">
              <button onClick={() => setArchiveOpen(false)} className="h-9 px-3 rounded-[6px] border border-[#D1D1D1] text-[13px] hover:bg-[#F8F8F8]">Cancelar</button>
              <button onClick={handleArchive} className="h-9 px-3 rounded-[6px] bg-[#DC2626] text-white text-[13px] hover:bg-[#B91C1C]">Confirmar</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
