'use client'

import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { useRouter } from 'next/navigation'
import type { DealSummary } from '@/app/actions/deals'
import { RAMO_LABELS } from '@/types/lead'
import type { LeadRamo } from '@/types/lead'

const RAMO_COLORS: Record<string, string> = {
  auto:        'text-[#2563EB] bg-[#EFF6FF]',
  vida:        'text-[#065F46] bg-[#D1FAE5]',
  saude:       'text-[#7C3AED] bg-[#EDE9FE]',
  residencial: 'text-[#B45309] bg-[#FEF3C7]',
  empresarial: 'text-[#374151] bg-[#F3F4F6]',
  viagem:      'text-[#0369A1] bg-[#E0F2FE]',
  consorcio:   'text-[#166534] bg-[#DCFCE7]',
}

function daysAgo(isoDate: string): number {
  return Math.floor((Date.now() - new Date(isoDate).getTime()) / 86400000)
}

function formatRelative(isoDate: string): string {
  const mins = Math.floor((Date.now() - new Date(isoDate).getTime()) / 60000)
  if (mins < 1)   return 'agora'
  if (mins < 60)  return `${mins}min atrás`
  const h = Math.floor(mins / 60)
  if (h < 24) return `${h}h atrás`
  return `${Math.floor(h / 24)}d atrás`
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(value)
}

interface Props {
  deal: DealSummary
  onOpen?: (deal: DealSummary) => void
}

export function DealCard({ deal, onOpen }: Props) {
  const router = useRouter()
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: deal.id,
    data: { deal },
  })

  const style = transform ? { transform: CSS.Translate.toString(transform) } : undefined

  const recommended = deal.deal_items.find(i => i.is_recommended) ?? deal.deal_items[0]
  const estimatedValue = recommended?.premium_total ?? null

  const daysInStage = daysAgo(deal.updated_at)

  const ramoLabel = RAMO_LABELS[deal.ramo as LeadRamo] ?? deal.ramo
  const ramoCls   = RAMO_COLORS[deal.ramo] ?? 'text-[#6B7280] bg-[#F3F4F6]'

  const isOverdue = deal.response_deadline
    ? new Date(deal.response_deadline) < new Date()
    : false

  function handleClick() {
    if (onOpen) onOpen(deal)
    else router.push(`/deals/${deal.id}`)
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={handleClick}
      className={`
        bg-white rounded-[8px] border border-[#E5E5E5] p-3 cursor-pointer
        hover:border-[#0BD904] hover:shadow-sm transition-all select-none
        ${isDragging ? 'opacity-50 shadow-lg' : ''}
      `}
    >
      {/* Client name */}
      <p className="text-[13px] font-medium text-[#0D0D0D] truncate">
        {deal.clients?.name ?? '—'}
      </p>

      {/* Ramo badge */}
      <span className={`mt-1 inline-block text-[11px] font-medium px-1.5 py-0.5 rounded-[4px] ${ramoCls}`}>
        {ramoLabel}
      </span>

      {/* Estimated value */}
      {estimatedValue !== null && (
        <p className="mt-2 text-[13px] font-semibold text-[#374151]">
          {formatCurrency(estimatedValue)}
        </p>
      )}

      {/* Response deadline (for submitted/under_analysis) */}
      {deal.response_deadline && (
        <p className={`mt-1 text-[11px] ${isOverdue ? 'text-[#DC2626] font-medium' : 'text-[#6B7280]'}`}>
          Prazo: {new Date(deal.response_deadline + 'T00:00:00').toLocaleDateString('pt-BR')}
          {isOverdue && ' ⚠'}
        </p>
      )}

      {/* Footer: days in stage + viewed indicator */}
      <div className="mt-2 flex items-center justify-between">
        <span className="text-[11px] text-[#9CA3AF]">
          {daysInStage === 0 ? 'hoje' : `${daysInStage}d`}
        </span>
        {deal.view_count > 0 && deal.last_viewed_at && (
          <span className="text-[11px] text-[#2563EB]">
            Visto {formatRelative(deal.last_viewed_at)}
          </span>
        )}
      </div>
    </div>
  )
}
