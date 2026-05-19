'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { updateDealStage } from '@/app/actions/deals'
import type { DealSummary } from '@/app/actions/deals'
import type { DealStage } from '@/lib/constants/deal-stages'
import { DEAL_STAGE_LABELS, DEAL_STAGE_COLORS, DEAL_TRANSITIONS, PIPELINE_STAGES } from '@/lib/constants/deal-stages'
import { RAMO_LABELS } from '@/types/lead'
import type { LeadRamo } from '@/types/lead'

interface Props {
  deal: DealSummary
  onStageChange: (stage: DealStage) => void
}

export function DealHeader({ deal, onStageChange }: Props) {
  const [open, setOpen] = useState(false)
  const [, startTransition] = useTransition()

  const allowed = DEAL_TRANSITIONS[deal.stage] ?? []
  const stageCls = DEAL_STAGE_COLORS[deal.stage]
  const ramoLabel = RAMO_LABELS[deal.ramo as LeadRamo] ?? deal.ramo

  function changeStage(next: DealStage) {
    setOpen(false)
    startTransition(async () => {
      const result = await updateDealStage(deal.id, next)
      if (!result.error) onStageChange(next)
    })
  }

  return (
    <div className="px-8 py-4 border-b border-[#E5E5E5] bg-white">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-[12px] text-[#9CA3AF] mb-3">
        <Link href="/pipeline" className="hover:text-[#0D0D0D] transition-colors">Pipeline</Link>
        <ChevronRight size={12} />
        <Link href="/clientes" className="hover:text-[#0D0D0D] transition-colors">{deal.clients?.name ?? '—'}</Link>
        <ChevronRight size={12} />
        <span className="text-[#374151]">{ramoLabel}</span>
      </nav>

      {/* Title row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-[20px] font-semibold text-[#0D0D0D]">
            {deal.clients?.name ?? '—'}
          </h1>
          <span className="text-[13px] text-[#6B7280]">{ramoLabel}</span>
        </div>

        {/* Stage badge — clickable dropdown */}
        <div className="relative">
          <button
            onClick={() => setOpen((v) => !v)}
            disabled={allowed.length === 0}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-[12px] font-semibold transition-colors ${stageCls} ${allowed.length > 0 ? 'cursor-pointer hover:opacity-80' : 'cursor-default'}`}
          >
            {DEAL_STAGE_LABELS[deal.stage]}
            {allowed.length > 0 && <ChevronDown size={12} />}
          </button>

          {open && allowed.length > 0 && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
              <div className="absolute right-0 top-full mt-1 z-20 bg-white border border-[#E5E5E5] rounded-[8px] shadow-lg min-w-[180px] py-1">
                {allowed.map((s) => (
                  <button
                    key={s}
                    onClick={() => changeStage(s)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-[#0D0D0D] hover:bg-[#F8F8F8] transition-colors"
                  >
                    <span className={`inline-block w-2 h-2 rounded-full ${DEAL_STAGE_COLORS[s].split(' ')[0].replace('text-', 'bg-').replace('[', '[').replace(']', ']')}`} />
                    {DEAL_STAGE_LABELS[s]}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
