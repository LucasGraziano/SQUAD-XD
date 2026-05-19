'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { DealSummary } from '@/app/actions/deals'
import type { DealStage } from '@/lib/constants/deal-stages'
import { DealHeader } from './DealHeader'
import { DealMulticalculo } from './DealMulticalculo'
import { DealShareSection } from './DealShareSection'
import { DealInsurerSection } from './DealInsurerSection'
import { DealActionButton } from './DealActionButton'
import { DealTimeline } from './DealTimeline'

interface Props {
  initialDeal: DealSummary
}

export function DealWorkspace({ initialDeal }: Props) {
  const router = useRouter()
  const [deal, setDeal] = useState<DealSummary>(initialDeal)

  function handleStageChange(stage: DealStage) {
    setDeal((d) => ({ ...d, stage }))
  }

  function handleConverted(apoliceId: string) {
    setDeal((d) => ({ ...d, stage: 'contracted', apolice_id: apoliceId, policy_id: apoliceId }))
    router.push(`/apolices/${apoliceId}`)
  }

  const isContractedOrRejected = deal.stage === 'contracted' || deal.stage === 'rejected'

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <DealHeader deal={deal} onStageChange={handleStageChange} />

      {/* Action bar */}
      {!isContractedOrRejected && (
        <div className="flex items-center gap-2 px-8 py-3 border-b border-[#E5E5E5] bg-[#FAFAFA]">
          <DealActionButton deal={deal} onStageChange={handleStageChange} onConverted={handleConverted} />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1100px] mx-auto px-8 py-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main column */}
          <div className="md:col-span-2 flex flex-col gap-5">
            <DealMulticalculo deal={deal} />
            <DealShareSection deal={deal} />
            <DealInsurerSection deal={deal} />

            {/* Linked policy */}
            {(deal.apolice_id || deal.policy_id) && (
              <section className="bg-white rounded-[10px] border border-[#0BD904] p-4">
                <h3 className="text-[13px] font-semibold text-[#374151] mb-2">Apólice Vinculada</h3>
                <a
                  href={`/apolices/${deal.apolice_id ?? deal.policy_id}`}
                  className="text-[13px] text-[#0BD904] hover:underline font-medium"
                >
                  Ver apólice →
                </a>
              </section>
            )}

            {deal.stage === 'rejected' && (
              <section className="bg-[#FEF2F2] rounded-[10px] border border-[#FECACA] p-4">
                <p className="text-[13px] font-semibold text-[#DC2626] mb-1">Negociação recusada / arquivada</p>
                {deal.rejection_reason && (
                  <p className="text-[12px] text-[#6B7280]">Motivo: {deal.rejection_reason}</p>
                )}
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-4">
            <DealTimeline deal={deal} />

            {/* Client info */}
            {deal.clients && (
              <section className="bg-white rounded-[10px] border border-[#E5E5E5] p-4">
                <h3 className="text-[13px] font-semibold text-[#374151] mb-2">Cliente</h3>
                <p className="text-[13px] text-[#0D0D0D] font-medium">{deal.clients.name}</p>
                {deal.clients.phone && <p className="text-[12px] text-[#6B7280] mt-0.5">{deal.clients.phone}</p>}
                {deal.clients.email && <p className="text-[12px] text-[#6B7280]">{deal.clients.email}</p>}
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
