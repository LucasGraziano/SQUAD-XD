'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { Search, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/layout/page-header'
import { EmptyState } from '@/components/ui/EmptyState'
import { PipelineColumn } from './PipelineColumn'
import { DealCard } from './DealCard'
import { DealCardActions } from './DealCardActions'
import { NewDealModal } from './NewDealModal'
import { updateDealStage } from '@/app/actions/deals'
import { createClient as createBrowserClient } from '@/lib/supabase/client'
import type { DealSummary } from '@/app/actions/deals'
import type { DealStage } from '@/lib/constants/deal-stages'
import { PIPELINE_STAGES, DEAL_STAGE_LABELS } from '@/lib/constants/deal-stages'
import { RAMO_LABELS } from '@/types/lead'
import type { LeadRamo } from '@/types/lead'

interface Props {
  initialDeals: DealSummary[]
}

const SOURCE_LABELS: Record<string, string> = {
  indicacao: 'Indicação',
  site:      'Site',
  ligacao:   'Ligação',
  evento:    'Evento',
  manual:    'Manual',
  lead_migrado:    'Lead',
  renovacao: 'Renovação',
}

const selectCls = "h-9 rounded-[6px] border border-[#D1D1D1] bg-white px-3 text-[13px] text-[#0D0D0D] outline-none focus:border-[#0BD904] transition-colors"

export function PipelineBoard({ initialDeals }: Props) {
  const router = useRouter()
  const [deals, setDeals] = useState<DealSummary[]>(initialDeals)
  const [search, setSearch] = useState('')
  const [filterRamo, setFilterRamo] = useState('')
  const [filterSource, setFilterSource] = useState('')
  const [dragging, setDragging] = useState<DealSummary | null>(null)
  const [newDealOpen, setNewDealOpen] = useState(false)
  const [errorToast, setErrorToast] = useState<string | null>(null)
  const [showRejected, setShowRejected] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  // Supabase Realtime
  useEffect(() => {
    const supabase = createBrowserClient()
    const channel = supabase
      .channel('pipeline-deals')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'quote_requests',
      }, (payload) => {
        const updated = payload.new as Record<string, unknown>
        setDeals((prev) => prev.map((d) =>
          d.id === updated.id
            ? { ...d, stage: updated.status as DealStage, updated_at: updated.updated_at as string }
            : d
        ))
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  const filtered = deals.filter((d) => {
    if (search && !d.clients?.name.toLowerCase().includes(search.toLowerCase())) return false
    if (filterRamo && d.ramo !== filterRamo) return false
    if (filterSource && d.source !== filterSource) return false
    return true
  })

  const byStage = useCallback(
    (stage: DealStage) => filtered.filter((d) => d.stage === stage),
    [filtered]
  )

  const rejectedDeals = filtered.filter((d) => d.stage === 'rejected')

  function handleDragStart(e: DragStartEvent) {
    const deal = (e.active.data.current as { deal: DealSummary } | undefined)?.deal ?? null
    setDragging(deal)
  }

  async function handleDragEnd(e: DragEndEvent) {
    setDragging(null)
    const { active, over } = e
    if (!over) return

    const dealId   = active.id as string
    const newStage = over.id   as DealStage
    const deal = deals.find((d) => d.id === dealId)
    if (!deal || deal.stage === newStage) return

    setDeals((prev) => prev.map((d) => d.id === dealId ? { ...d, stage: newStage } : d))

    const result = await updateDealStage(dealId, newStage)

    if (result.error) {
      setDeals((prev) => prev.map((d) => d.id === dealId ? { ...d, stage: deal.stage } : d))
      setErrorToast(result.error)
      setTimeout(() => setErrorToast(null), 4000)
    }
  }

  function handleStageChange(dealId: string, stage: DealStage) {
    setDeals((prev) => prev.map((d) => d.id === dealId ? { ...d, stage } : d))
    if (stage === 'draft') {
      router.push(`/deals/${dealId}`)
    }
  }

  function handleDealDeleted(dealId: string) {
    setDeals((prev) => prev.filter((d) => d.id !== dealId))
  }

  function handleDealCreated(deal: DealSummary) {
    setDeals((prev) => [deal, ...prev])
  }

  return (
    <>
      <PageHeader
        title="Pipeline"
        actions={<Button onClick={() => setNewDealOpen(true)}>Nova Negociação</Button>}
      />

      {/* Toolbar */}
      <div className="flex items-center gap-2 px-8 py-4 border-b border-[#E5E5E5]">
        <div className="relative flex-1 max-w-[280px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
          <input
            type="text"
            placeholder="Buscar cliente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-full rounded-[6px] border border-[#D1D1D1] bg-white pl-8 pr-3 text-[13px] outline-none focus:border-[#0BD904] transition-colors"
          />
        </div>

        <select value={filterRamo} onChange={(e) => setFilterRamo(e.target.value)} className={selectCls}>
          <option value="">Ramo: Todos</option>
          {(Object.entries(RAMO_LABELS) as [LeadRamo, string][]).map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>

        <select value={filterSource} onChange={(e) => setFilterSource(e.target.value)} className={selectCls}>
          <option value="">Origem: Todas</option>
          {Object.entries(SOURCE_LABELS).map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
      </div>

      {errorToast && (
        <div className="mx-8 mt-3 px-4 py-2 bg-[#FEE2E2] border border-[#DC2626] rounded-[8px] text-[13px] text-[#DC2626]">
          {errorToast}
        </div>
      )}

      {deals.length === 0 && (
        <div className="flex-1 flex items-center justify-center">
          <EmptyState
            illustration="pipeline"
            title="Seu pipeline começa aqui"
            description="Crie deals e acompanhe cada negociação da prospecção à apólice."
            primaryCta={{ label: 'Nova Negociação', onClick: () => setNewDealOpen(true) }}
          />
        </div>
      )}

      {/* Board */}
      {deals.length > 0 && (
        <div className="flex-1 overflow-x-auto">
          <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="flex gap-4 p-8 min-w-max h-full items-start">
              {PIPELINE_STAGES.map((stage) => (
                <PipelineColumn
                  key={stage}
                  stage={stage}
                  deals={byStage(stage)}
                  onOpenDeal={(deal) => router.push(`/deals/${deal.id}`)}
                  onStageChange={handleStageChange}
                  onDeleteDeal={handleDealDeleted}
                />
              ))}
            </div>

            <DragOverlay dropAnimation={null}>
              {dragging ? <DealCard deal={dragging} /> : null}
            </DragOverlay>
          </DndContext>
        </div>
      )}

      {/* Recusadas & Perdidas */}
      {deals.length > 0 && (
        <div className="border-t border-[#E5E5E5] px-8 py-3">
          <button
            onClick={() => setShowRejected((v) => !v)}
            className="inline-flex items-center gap-2 text-[12px] font-medium text-[#6B7280] hover:text-[#0D0D0D] transition-colors"
          >
            {showRejected ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {DEAL_STAGE_LABELS['rejected']}
            {rejectedDeals.length > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#FEE2E2] text-[#DC2626] text-[10px] font-bold">
                {rejectedDeals.length}
              </span>
            )}
            {rejectedDeals.length === 0 && (
              <span className="text-[#9CA3AF] text-[11px]">nenhuma</span>
            )}
          </button>

          {showRejected && rejectedDeals.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-3">
              {rejectedDeals.map((deal) => (
                <div key={deal.id} className="w-[220px] opacity-75">
                  <DealCard deal={deal} onOpen={(d) => router.push(`/deals/${d.id}`)} />
                  <div className="flex items-center gap-1 mt-1">
                    <DealCardActions
                      deal={deal}
                      onStageChange={handleStageChange}
                      onDelete={handleDealDeleted}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <NewDealModal
        open={newDealOpen}
        onOpenChange={setNewDealOpen}
        onCreated={handleDealCreated}
      />
    </>
  )
}
