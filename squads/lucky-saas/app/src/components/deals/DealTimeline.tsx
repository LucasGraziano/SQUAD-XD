'use client'

import { useEffect, useState } from 'react'
import { getDealTimeline } from '@/app/actions/deals'
import type { DealSummary, DealStageHistoryEntry } from '@/app/actions/deals'
import type { DealStage } from '@/lib/constants/deal-stages'
import { DEAL_STAGE_LABELS, DEAL_STAGE_COLORS } from '@/lib/constants/deal-stages'
import { ChevronDown } from 'lucide-react'

interface TimelineEntry {
  id: string
  type: 'created' | 'stage_change' | 'viewed'
  stage?: DealStage
  label: string
  timestamp: string
  note?: string
  isCurrent?: boolean
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function buildEntries(deal: DealSummary, history: DealStageHistoryEntry[]): TimelineEntry[] {
  const entries: TimelineEntry[] = [
    {
      id:        'created',
      type:      'created',
      label:     'Negociação criada',
      timestamp: deal.created_at,
    },
    ...history.map((h) => ({
      id:        h.id,
      type:      'stage_change' as const,
      stage:     h.to_stage as DealStage,
      label:     DEAL_STAGE_LABELS[h.to_stage as DealStage] ?? h.to_stage,
      timestamp: h.changed_at,
      note:      h.note ?? undefined,
    })),
  ]

  if (deal.view_count > 0 && deal.last_viewed_at) {
    entries.push({
      id:        'viewed',
      type:      'viewed',
      label:     'Cliente visualizou pela primeira vez',
      timestamp: deal.last_viewed_at,
    })
  }

  // Sort by timestamp
  entries.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

  // Mark last stage_change as current
  const lastStageIdx = [...entries].reverse().findIndex(e => e.type === 'stage_change')
  if (lastStageIdx !== -1) {
    entries[entries.length - 1 - lastStageIdx].isCurrent = true
  }

  return entries
}

interface Props {
  deal: DealSummary
}

export function DealTimeline({ deal }: Props) {
  const [history, setHistory] = useState<DealStageHistoryEntry[]>(deal.deal_stage_history ?? [])
  const [expanded, setExpanded] = useState(true)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!deal.deal_stage_history?.length) {
      setLoading(true)
      getDealTimeline(deal.id).then((data) => {
        setHistory(data)
        setLoading(false)
      })
    }
  }, [deal.id, deal.deal_stage_history])

  const entries = buildEntries(deal, history)

  return (
    <section className="bg-white rounded-[10px] border border-[#E5E5E5] p-4">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between mb-3 text-left"
      >
        <h3 className="text-[13px] font-semibold text-[#374151]">
          Histórico ({entries.length})
        </h3>
        <ChevronDown
          size={14}
          className={`text-[#9CA3AF] transition-transform ${expanded ? 'rotate-180' : ''}`}
        />
      </button>

      {expanded && (
        <div className="relative flex flex-col gap-0">
          {/* Vertical line */}
          <div className="absolute left-[7px] top-3 bottom-3 w-px bg-[#E5E5E5]" />

          {loading && <p className="text-[12px] text-[#9CA3AF] pl-6">Carregando...</p>}

          {entries.map((entry, i) => {
            const isLast = i === entries.length - 1
            const dotColor = entry.type === 'created'
              ? '#9CA3AF'
              : entry.type === 'viewed'
              ? '#3B82F6'
              : entry.stage
              ? DEAL_STAGE_COLORS[entry.stage]?.match(/text-\[([^\]]+)\]/)?.[1] ?? '#9CA3AF'
              : '#9CA3AF'

            return (
              <div key={entry.id} className="relative flex gap-3 pb-4 last:pb-0">
                {/* Dot */}
                <div className="relative z-10 mt-0.5 flex-shrink-0">
                  {entry.isCurrent ? (
                    <span className="flex h-[15px] w-[15px] items-center justify-center">
                      <span
                        className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-50"
                        style={{ backgroundColor: dotColor }}
                      />
                      <span
                        className="relative inline-flex rounded-full h-[9px] w-[9px]"
                        style={{ backgroundColor: dotColor }}
                      />
                    </span>
                  ) : (
                    <div
                      className="h-[9px] w-[9px] rounded-full border-2 border-white"
                      style={{ backgroundColor: dotColor, outline: `1px solid ${dotColor}`, outlineOffset: '0px' }}
                    />
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-col gap-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`text-[12px] font-medium ${entry.isCurrent ? 'text-[#0D0D0D]' : 'text-[#374151]'}`}>
                      {entry.label}
                    </p>
                    {entry.isCurrent && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-[3px] bg-[rgba(11,217,4,0.1)] text-[#034001] font-semibold">
                        Agora
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#9CA3AF]">{formatDate(entry.timestamp)}</p>
                  {entry.note && (
                    <p className="text-[11px] text-[#6B7280] italic">{entry.note}</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
