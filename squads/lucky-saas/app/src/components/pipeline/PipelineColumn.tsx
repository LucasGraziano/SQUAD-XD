'use client'

import { useDroppable } from '@dnd-kit/core'
import { cn } from '@/lib/utils/cn'
import { LeadCard } from './LeadCard'
import type { Lead, LeadStatus } from '@/types/lead'

interface Props {
  status: LeadStatus
  label: string
  leads: Lead[]
  onOpenLead: (lead: Lead) => void
}

export function PipelineColumn({ status, label, leads, onOpenLead }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: status })

  return (
    <div className="flex-shrink-0 w-[272px] flex flex-col">
      {/* Column header */}
      <div className="mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">
            {label}
          </span>
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#F3F4F6] text-[11px] font-semibold text-[#6B7280]">
            {leads.length}
          </span>
        </div>
      </div>

      {/* Drop zone */}
      <div
        ref={setNodeRef}
        className={cn(
          'flex-1 flex flex-col gap-2.5 rounded-[8px] p-2 min-h-[120px] transition-colors',
          isOver ? 'bg-[rgba(11,217,4,0.06)] border border-dashed border-[#0BD904]' : 'bg-[#F4F4F4]'
        )}
      >
        {leads.map((lead) => (
          <LeadCard key={lead.id} lead={lead} onOpen={onOpenLead} />
        ))}
        {leads.length === 0 && (
          <div className="flex items-center justify-center h-16">
            <p className="text-[12px] text-[#D1D1D1]">Arraste um lead aqui</p>
          </div>
        )}
      </div>
    </div>
  )
}
