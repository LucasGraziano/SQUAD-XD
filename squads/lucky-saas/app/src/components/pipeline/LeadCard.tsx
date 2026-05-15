'use client'

import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, MessageCircle, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import type { Lead } from '@/types/lead'
import { RAMO_LABELS, SOURCE_LABELS } from '@/types/lead'
import { LeadQuoteButton } from './LeadQuoteButton'

function renewalUrgency(dateStr: string | null | undefined): 'overdue' | 'soon' | 'ok' | null {
  if (!dateStr) return null
  const days = Math.floor((new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  if (days < 0) return 'overdue'
  if (days <= 30) return 'soon'
  return 'ok'
}

function isStuck(lead: Lead) {
  if (lead.status === 'fechado' || lead.status === 'perdido') return false
  const ref = lead.last_activity_at ?? lead.created_at
  return (Date.now() - new Date(ref).getTime()) > 48 * 60 * 60 * 1000
}

function daysInStage(lead: Lead) {
  const ref = lead.last_activity_at ?? lead.created_at
  return Math.floor((Date.now() - new Date(ref).getTime()) / (1000 * 60 * 60 * 24))
}

interface Props {
  lead: Lead
  onOpen: (lead: Lead) => void
}

export function LeadCard({ lead, onOpen }: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: lead.id,
    data: { lead },
  })

  const stuck = isStuck(lead)
  const days = daysInStage(lead)
  const urgency = lead.status === 'perdido' ? renewalUrgency(lead.expected_renewal_date) : null

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform) }}
      className={cn(
        'group relative bg-white rounded-[8px] border border-[#E5E5E5] p-4',
        'transition-shadow',
        isDragging ? 'shadow-xl opacity-90 z-50 rotate-[1deg]' : 'hover:shadow-sm',
      )}
    >
      {/* Drag handle */}
      <button
        {...listeners}
        {...attributes}
        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing touch-none"
        tabIndex={-1}
      >
        <GripVertical size={14} className="text-[#D1D1D1]" />
      </button>

      {/* PARADO badge */}
      {stuck && (
        <span className="inline-flex items-center gap-1 mb-2 px-2 py-0.5 rounded-[4px] bg-[#FEE2E2] text-[#DC2626] text-[11px] font-bold uppercase">
          ⚠ Parado
        </span>
      )}

      {/* Renewal badge for perdido leads */}
      {urgency === 'overdue' && (
        <span className="inline-flex items-center gap-1 mb-2 px-2 py-0.5 rounded-[4px] bg-[#FEE2E2] text-[#DC2626] text-[11px] font-bold uppercase">
          Renovação vencida
        </span>
      )}
      {urgency === 'soon' && (
        <span className="inline-flex items-center gap-1 mb-2 px-2 py-0.5 rounded-[4px] bg-[#FEF3C7] text-[#D97706] text-[11px] font-bold uppercase">
          Renovação em breve
        </span>
      )}

      {/* Name */}
      <p className="text-[14px] font-semibold text-[#0D0D0D] pr-5 leading-tight">{lead.name}</p>

      {/* Badges */}
      <div className="flex flex-wrap gap-1.5 mt-2">
        {lead.ramo && (
          <span className="px-2 py-0.5 rounded-[4px] bg-[rgba(11,217,4,0.10)] text-[#034001] text-[11px] font-medium">
            {RAMO_LABELS[lead.ramo]}
          </span>
        )}
        {lead.source && lead.source !== 'manual' && (
          <span className="px-2 py-0.5 rounded-[4px] bg-[#F3F4F6] text-[#6B7280] text-[11px] font-medium">
            {SOURCE_LABELS[lead.source]}
          </span>
        )}
      </div>

      {/* Phone */}
      <p className="text-[12px] text-[#6B7280] mt-2">{lead.phone}</p>

      {/* Days in stage */}
      <p className="text-[11px] text-[#9CA3AF] mt-1">
        {days === 0 ? 'Hoje' : days === 1 ? '1 dia no estágio' : `${days} dias no estágio`}
      </p>

      {/* Actions */}
      <div className="flex items-center gap-2 mt-3">
        <a
          href={`https://wa.me/55${lead.phone.replace(/\D/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[5px] bg-[#F3F4F6] text-[#6B7280] text-[12px] font-medium hover:bg-[#E5E7EB] transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <MessageCircle size={11} />
          WhatsApp
        </a>
        <button
          onClick={() => onOpen(lead)}
          className="inline-flex items-center gap-0.5 px-2.5 py-1 rounded-[5px] text-[#0D0D0D] text-[12px] font-medium hover:bg-[#F3F4F6] transition-colors"
        >
          Ver detalhes
          <ChevronRight size={11} />
        </button>
        <LeadQuoteButton leadId={lead.id} hasClientId={!!lead.client_id} />
      </div>
    </div>
  )
}
