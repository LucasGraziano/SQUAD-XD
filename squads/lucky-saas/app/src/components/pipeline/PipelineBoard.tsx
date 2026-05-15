'use client'

import { useState, useCallback } from 'react'
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/layout/page-header'
import { PipelineColumn } from './PipelineColumn'
import { LeadCard } from './LeadCard'
import { LeadDrawer } from './LeadDrawer'
import { NewLeadModal } from './NewLeadModal'
import { moveLead } from '@/app/(dashboard)/pipeline/actions'
import type { Lead, LeadRamo, LeadSource, LeadStatus } from '@/types/lead'
import { PIPELINE_COLUMNS, RAMO_LABELS, SOURCE_LABELS } from '@/types/lead'
import { EmptyState } from '@/components/ui/EmptyState'

interface Props {
  initialLeads: Lead[]
}

export function PipelineBoard({ initialLeads }: Props) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads)
  const [search, setSearch] = useState('')
  const [filterRamo, setFilterRamo] = useState<LeadRamo | ''>('')
  const [filterSource, setFilterSource] = useState<LeadSource | ''>('')
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [draggingLead, setDraggingLead] = useState<Lead | null>(null)
  const [newLeadOpen, setNewLeadOpen] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  const filteredLeads = leads.filter((lead) => {
    if (search && !lead.name.toLowerCase().includes(search.toLowerCase())) return false
    if (filterRamo && lead.ramo !== filterRamo) return false
    if (filterSource && lead.source !== filterSource) return false
    return true
  })

  const columnLeads = useCallback(
    (status: LeadStatus) => filteredLeads.filter((l) => l.status === status),
    [filteredLeads]
  )

  function handleDragStart(event: DragStartEvent) {
    const lead = (event.active.data.current as { lead: Lead } | undefined)?.lead ?? null
    setDraggingLead(lead)
  }

  async function handleDragEnd(event: DragEndEvent) {
    setDraggingLead(null)
    const { active, over } = event
    if (!over) return

    const leadId = active.id as string
    const newStatus = over.id as LeadStatus
    const lead = leads.find((l) => l.id === leadId)
    if (!lead || lead.status === newStatus) return

    // Optimistic update
    setLeads((prev) =>
      prev.map((l) => l.id === leadId ? { ...l, status: newStatus, last_activity_at: new Date().toISOString() } : l)
    )

    const result = await moveLead(leadId, newStatus, lead.status)

    if (result.error) {
      // Revert on error
      setLeads((prev) => prev.map((l) => l.id === leadId ? { ...l, status: lead.status } : l))
    }
  }

  function handleStatusChange(leadId: string, newStatus: LeadStatus) {
    setLeads((prev) =>
      prev.map((l) => l.id === leadId ? { ...l, status: newStatus, last_activity_at: new Date().toISOString() } : l)
    )
    if (selectedLead?.id === leadId) {
      setSelectedLead((prev) => prev ? { ...prev, status: newStatus } : null)
    }
  }

  function handleLeadCreated(lead: Lead) {
    setLeads((prev) => [lead, ...prev])
  }

  const selectCls = "h-9 rounded-[6px] border border-[#D1D1D1] bg-white px-3 text-[13px] text-[#0D0D0D] outline-none focus:border-[#0BD904] transition-colors"

  return (
    <>
      <PageHeader
        title="Pipeline de Leads"
        actions={<Button onClick={() => setNewLeadOpen(true)}>Novo Lead</Button>}
      />

      {/* Toolbar */}
      <div className="flex items-center gap-2 px-8 py-4 border-b border-[#E5E5E5]">
        <div className="relative flex-1 max-w-[280px]">
          <Search size={14} className="absolute left-3 top-[50%] -translate-y-[50%] text-[#9CA3AF]" />
          <input
            type="text"
            placeholder="Buscar leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-full rounded-[6px] border border-[#D1D1D1] bg-white pl-8 pr-3 text-[13px] text-[#0D0D0D] placeholder:text-[#9CA3AF] outline-none focus:border-[#0BD904] transition-colors"
          />
        </div>

        <select
          value={filterRamo}
          onChange={(e) => setFilterRamo(e.target.value as LeadRamo | '')}
          className={selectCls}
        >
          <option value="">Ramo: Todos</option>
          {(Object.entries(RAMO_LABELS) as [LeadRamo, string][]).map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>

        <select
          value={filterSource}
          onChange={(e) => setFilterSource(e.target.value as LeadSource | '')}
          className={selectCls}
        >
          <option value="">Fonte: Todas</option>
          {(Object.entries(SOURCE_LABELS) as [LeadSource, string][]).map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>

        <a
          href="/pipeline/recuperacoes"
          className="inline-flex items-center gap-1.5 h-9 px-3 rounded-[6px] border border-[#D97706] text-[#D97706] bg-[#FFFBEB] text-[13px] font-medium hover:bg-[#FEF3C7] transition-colors"
        >
          Recuperações
        </a>
      </div>

      {/* Empty state — no leads at all */}
      {leads.length === 0 && (
        <div className="flex-1 flex items-center justify-center">
          <EmptyState
            illustration="pipeline"
            title="Seu pipeline de vendas começa aqui"
            description="Adicione leads e acompanhe cada negociação do primeiro contato ao fechamento."
            primaryCta={{ label: 'Novo lead', onClick: () => setNewLeadOpen(true) }}
          />
        </div>
      )}

      {/* Board */}
      {leads.length > 0 && (
      <div className="flex-1 overflow-x-auto">
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="flex gap-4 p-8 min-w-max h-full">
            {PIPELINE_COLUMNS.map((col) => (
              <PipelineColumn
                key={col.status}
                status={col.status}
                label={col.label}
                leads={columnLeads(col.status)}
                onOpenLead={setSelectedLead}
              />
            ))}
          </div>

          <DragOverlay dropAnimation={null}>
            {draggingLead ? (
              <LeadCard lead={draggingLead} onOpen={() => {}} />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      )}

      <LeadDrawer
        lead={selectedLead}
        onClose={() => setSelectedLead(null)}
        onStatusChange={handleStatusChange}
      />

      <NewLeadModal
        open={newLeadOpen}
        onOpenChange={setNewLeadOpen}
        onCreated={handleLeadCreated}
      />

    </>
  )
}
