'use client'

import { useState, useTransition } from 'react'
import { ChevronDown, FileText, CheckCircle, XCircle, Trash2, ArrowRight } from 'lucide-react'
import { ProposalStatusBadge } from './ProposalStatusBadge'
import { updateProposalStatus, deleteProposal, convertProposalToPolicy } from '@/app/actions/proposals'
import type { Proposal, ProposalStatus } from '@/app/actions/proposals'
import { RAMO_LABELS } from '@/types/policy'
import { cn } from '@/lib/utils/cn'

interface Props {
  initialProposals: Proposal[]
}

const STATUS_FLOW: Partial<Record<ProposalStatus, ProposalStatus[]>> = {
  rascunho: ['enviada'],
  enviada: ['em_analise', 'cancelada'],
  em_analise: ['emitida', 'recusada', 'cancelada'],
}

function formatDate(s: string) {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(s))
}
function formatBRL(n: number | null) {
  if (!n) return '—'
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function ProposalList({ initialProposals }: Props) {
  const [proposals, setProposals] = useState<Proposal[]>(initialProposals)
  const [, startTransition] = useTransition()
  const [converting, setConverting] = useState<string | null>(null)

  function handleStatusChange(id: string, status: ProposalStatus) {
    setProposals(prev => prev.map(p => p.id === id ? { ...p, status } : p))
    startTransition(() => { updateProposalStatus(id, status) })
  }

  function handleDelete(id: string) {
    setProposals(prev => prev.filter(p => p.id !== id))
    startTransition(() => { deleteProposal(id) })
  }

  async function handleConvert(id: string) {
    setConverting(id)
    const result = await convertProposalToPolicy(id)
    setConverting(null)
    if (result.error) { alert(result.error); return }
    setProposals(prev => prev.map(p => p.id === id ? { ...p, status: 'emitida' } : p))
  }

  if (proposals.length === 0) {
    return (
      <div className="py-20 text-center">
        <FileText size={32} className="mx-auto text-[#9CA3AF] mb-3" />
        <p className="text-[14px] font-medium text-[#6B7280]">Nenhuma proposta cadastrada.</p>
        <p className="text-[13px] text-[#9CA3AF]">Crie sua primeira proposta para acompanhar o ciclo.</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {proposals.map(p => {
        const nextStatuses = STATUS_FLOW[p.status] ?? []
        return (
          <div key={p.id} className="bg-white rounded-[8px] border border-[#E5E5E5] p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <ProposalStatusBadge status={p.status} />
                  <span className="text-[13px] font-semibold text-[#0D0D0D]">{p.seguradora}</span>
                  <span className="px-1.5 py-0.5 rounded-[3px] bg-[rgba(11,217,4,0.08)] text-[#034001] text-[10px] font-medium">
                    {RAMO_LABELS[p.ramo] ?? p.ramo}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-[12px] text-[#9CA3AF]">
                  {p.clients?.name && <span>{p.clients.name}</span>}
                  {p.proposal_number && <span>Nº {p.proposal_number}</span>}
                  {p.protocol_number && <span>Prot. {p.protocol_number}</span>}
                  {p.premium_estimate && <span>{formatBRL(p.premium_estimate)}</span>}
                  <span>Criada {formatDate(p.created_at)}</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0">
                {/* Convert to policy button */}
                {p.status === 'em_analise' && p.client_id && (
                  <button
                    onClick={() => handleConvert(p.id)}
                    disabled={converting === p.id}
                    className={cn(
                      'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-[12px] font-semibold transition-colors',
                      'bg-[#0BD904] text-[#0D0D0D] hover:bg-[#09c003]',
                      converting === p.id && 'opacity-50 cursor-wait'
                    )}
                  >
                    <ArrowRight size={12} />
                    Emitir
                  </button>
                )}

                {/* Status actions */}
                {nextStatuses.length > 0 && (
                  <div className="relative group">
                    <button className="inline-flex items-center gap-1 px-2 py-1.5 rounded-[6px] border border-[#D1D1D1] text-[12px] text-[#6B7280] hover:border-[#0D0D0D] hover:text-[#0D0D0D] transition-colors">
                      Avançar <ChevronDown size={11} />
                    </button>
                    <div className="absolute right-0 top-full mt-1 bg-white border border-[#E5E5E5] rounded-[8px] shadow-lg min-w-[160px] py-1 z-20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                      {nextStatuses.map(ns => (
                        <button
                          key={ns}
                          onClick={() => handleStatusChange(p.id, ns)}
                          className="w-full text-left px-3 py-2 text-[13px] hover:bg-[#F3F4F6] transition-colors flex items-center gap-2"
                        >
                          {ns === 'emitida' && <CheckCircle size={13} className="text-[#16A34A]" />}
                          {ns === 'recusada' && <XCircle size={13} className="text-[#DC2626]" />}
                          {ns === 'cancelada' && <XCircle size={13} className="text-[#9CA3AF]" />}
                          {ns === 'enviada' && <ArrowRight size={13} className="text-[#2563EB]" />}
                          {ns === 'em_analise' && <ArrowRight size={13} className="text-[#D97706]" />}
                          <span className="capitalize">{ns.replace('_', ' ')}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => handleDelete(p.id)}
                  className="p-1.5 rounded-[6px] text-[#9CA3AF] hover:text-[#DC2626] hover:bg-[#FEF2F2] transition-colors"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>

            {p.notes && (
              <p className="mt-2 text-[12px] text-[#9CA3AF] border-t border-[#F3F4F6] pt-2">{p.notes}</p>
            )}
          </div>
        )
      })}
    </div>
  )
}
