'use client'

import { useState, useTransition } from 'react'
import { Plus, Check, Trash2, AlertCircle, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { NewPendencyModal } from './NewPendencyModal'
import { resolvePendency, deletePendency } from '@/app/actions/pendencies'
import type { Pendency } from '@/app/actions/pendencies'
import { cn } from '@/lib/utils/cn'

interface Props {
  initialPendencies: Pendency[]
  policyId?: string
  leadId?: string
}

function formatDate(s: string) {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(s + 'T12:00:00'))
}

function isOverdue(dueDate: string | null) {
  if (!dueDate) return false
  return new Date(dueDate) < new Date()
}

const PRIORITY_CONFIG = {
  high: { label: 'Alta', className: 'bg-[#FEE2E2] text-[#DC2626]' },
  medium: { label: 'Média', className: 'bg-[#FEF3C7] text-[#D97706]' },
  low: { label: 'Baixa', className: 'bg-[#F3F4F6] text-[#6B7280]' },
}

export function PendencyList({ initialPendencies, policyId, leadId }: Props) {
  const [pendencies, setPendencies] = useState<Pendency[]>(initialPendencies)
  const [showResolved, setShowResolved] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [, startTransition] = useTransition()

  const open = pendencies.filter(p => p.status === 'open')
  const resolved = pendencies.filter(p => p.status === 'resolved')

  function handleResolve(id: string) {
    setPendencies(prev => prev.map(p => p.id === id
      ? { ...p, status: 'resolved', resolved_at: new Date().toISOString() }
      : p
    ))
    startTransition(() => { resolvePendency(id) })
  }

  function handleDelete(id: string) {
    setPendencies(prev => prev.filter(p => p.id !== id))
    startTransition(() => { deletePendency(id) })
  }

  return (
    <div className="bg-white rounded-[8px] border border-[#E5E5E5] overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-[#E5E5E5]">
        <div className="flex items-center gap-2">
          <p className="text-[13px] font-semibold text-[#0D0D0D]">Pendências</p>
          {open.length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FEE2E2] text-[#DC2626]">
              {open.length}
            </span>
          )}
        </div>
        <Button size="sm" variant="secondary" onClick={() => setModalOpen(true)}>
          <Plus size={13} />
          Nova
        </Button>
      </div>

      {open.length === 0 && (
        <div className="py-8 text-center">
          <Check size={20} className="mx-auto text-[#0BD904] mb-2" />
          <p className="text-[13px] text-[#9CA3AF]">Nenhuma pendência em aberto.</p>
        </div>
      )}

      {open.length > 0 && (
        <div className="divide-y divide-[#F3F4F6]">
          {open.map(p => {
            const overdue = isOverdue(p.due_date)
            const cfg = PRIORITY_CONFIG[p.priority]
            return (
              <div key={p.id} className={cn('flex items-start gap-3 px-5 py-3', overdue && 'bg-[#FEF2F2]')}>
                <button
                  onClick={() => handleResolve(p.id)}
                  className="mt-0.5 w-5 h-5 rounded border-2 border-[#D1D1D1] hover:border-[#0BD904] hover:bg-[rgba(11,217,4,0.08)] transition-colors flex-shrink-0"
                  title="Marcar como resolvida"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-[13px] font-medium text-[#0D0D0D]">{p.title}</p>
                    <span className={cn('px-1.5 py-0.5 rounded-[3px] text-[10px] font-semibold', cfg.className)}>
                      {cfg.label}
                    </span>
                  </div>
                  {p.description && (
                    <p className="text-[12px] text-[#9CA3AF] mt-0.5">{p.description}</p>
                  )}
                  {p.due_date && (
                    <div className={cn('flex items-center gap-1 mt-1', overdue ? 'text-[#DC2626]' : 'text-[#9CA3AF]')}>
                      {overdue ? <AlertCircle size={11} /> : <Clock size={11} />}
                      <span className="text-[11px] font-medium">
                        {overdue ? 'Vencida em ' : 'Prazo: '}
                        {formatDate(p.due_date)}
                      </span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="p-1 rounded-[4px] text-[#9CA3AF] hover:text-[#DC2626] hover:bg-[#FEF2F2] transition-colors flex-shrink-0"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            )
          })}
        </div>
      )}

      {resolved.length > 0 && (
        <div className="border-t border-[#F3F4F6]">
          <button
            onClick={() => setShowResolved(v => !v)}
            className="w-full px-5 py-2.5 text-left text-[12px] text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
          >
            {showResolved ? '▲' : '▼'} {resolved.length} resolvida{resolved.length !== 1 ? 's' : ''}
          </button>
          {showResolved && (
            <div className="divide-y divide-[#F3F4F6]">
              {resolved.map(p => (
                <div key={p.id} className="flex items-center gap-3 px-5 py-2.5 opacity-50">
                  <Check size={14} className="text-[#0BD904] flex-shrink-0" />
                  <p className="text-[12px] text-[#6B7280] line-through flex-1">{p.title}</p>
                  <button onClick={() => handleDelete(p.id)} className="p-1 text-[#9CA3AF] hover:text-[#DC2626]">
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <NewPendencyModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        policyId={policyId}
        leadId={leadId}
        onCreated={p => setPendencies(prev => [p, ...prev])}
      />
    </div>
  )
}
