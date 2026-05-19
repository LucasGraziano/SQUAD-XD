'use client'

import { useState, useTransition, useCallback, useEffect } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { MoreHorizontal, Search, MessageCircle, ChevronLeft, ChevronRight, FileText, RefreshCw, Trash2, ExternalLink, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { Button } from '@/components/ui/button'
import { ApolicaModal } from './ApolicaModal'
import { RenovacaoModal } from './RenovacaoModal'
import { archivePolicy, unarchivePolicy, deletePolicy } from '@/app/(dashboard)/apolices/actions'
import type { Policy, PolicyTab } from '@/types/policy'
import { RAMO_LABELS } from '@/types/policy'
import { cn } from '@/lib/utils/cn'

const TABS: { id: PolicyTab; label: string }[] = [
  { id: 'todas', label: 'Todas' },
  { id: 'ativas', label: 'Ativas' },
  { id: 'vencendo', label: 'Vencendo em 30d' },
  { id: 'vencidas', label: 'Vencidas' },
  { id: 'arquivadas', label: 'Arquivadas' },
]

function formatCurrency(n: number) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatDate(s: string) {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(s + 'T00:00:00'))
}

function daysUntil(dateStr: string) {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
}

function StatusBadge({ policy }: { policy: Policy }) {
  const days = daysUntil(policy.end_date)

  if (policy.status === 'cancelada' || policy.status === 'suspensa') {
    return <span className="px-2 py-0.5 rounded-[4px] bg-[#F3F4F6] text-[#6B7280] text-[11px] font-bold uppercase">Arquivada</span>
  }
  if (days < 0) {
    return <span className="px-2 py-0.5 rounded-[4px] bg-[#FEE2E2] text-[#DC2626] text-[11px] font-bold uppercase">Vencida</span>
  }
  if (days <= 30) {
    return <span className="px-2 py-0.5 rounded-[4px] bg-[#FEF3C7] text-[#D97706] text-[11px] font-bold uppercase">{days}d</span>
  }
  if (days <= 60) {
    return <span className="px-2 py-0.5 rounded-[4px] bg-[#FEF9C3] text-[#CA8A04] text-[11px] font-bold uppercase">{days}d</span>
  }
  return <span className="px-2 py-0.5 rounded-[4px] bg-[#DCFCE7] text-[#16A34A] text-[11px] font-bold uppercase">Ativa</span>
}

interface Props {
  initialPolicies: Policy[]
  totalCount: number
  currentPage: number
  brokerName: string
  sortBy?: string
  sortDir?: 'asc' | 'desc'
}

export function ApolicesTable({ initialPolicies, totalCount, currentPage, brokerName, sortBy = 'end_date', sortDir = 'asc' }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [policies, setPolicies] = useState<Policy[]>(initialPolicies)
  const [pdfPolicy, setPdfPolicy] = useState<Policy | null>(null)
  const [pdfValidity, setPdfValidity] = useState<7 | 15 | 30>(15)

  useEffect(() => { setPolicies(initialPolicies) }, [initialPolicies])
  const [editingPolicy, setEditingPolicy] = useState<Policy | null>(null)
  const [renovacaoPolicy, setRenovacaoPolicy] = useState<Policy | null>(null)
  const [renewingPolicy, setRenewingPolicy] = useState<Policy | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const tab = (searchParams.get('tab') ?? 'todas') as PolicyTab
  const search = searchParams.get('search') ?? ''
  const ramo = searchParams.get('ramo') ?? ''
  const perPage = 25
  const totalPages = Math.ceil(totalCount / perPage)

  const updateParams = useCallback((updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(updates).forEach(([k, v]) => {
      if (v === null || v === '') params.delete(k)
      else params.set(k, v)
    })
    if (updates.tab || updates.search || updates.ramo) params.set('page', '1')
    startTransition(() => router.push(`${pathname}?${params.toString()}`))
  }, [searchParams, pathname, router])

  function handleSort(column: string) {
    if (sortBy === column) {
      updateParams({ sort: column, dir: sortDir === 'asc' ? 'desc' : 'asc', page: '1' })
    } else {
      updateParams({ sort: column, dir: 'asc', page: '1' })
    }
  }

  function SortIcon({ column }: { column: string }) {
    if (sortBy !== column) return <ChevronsUpDown size={12} className="text-[#D1D1D1]" />
    return sortDir === 'asc'
      ? <ChevronUp size={12} className="text-[#0BD904]" />
      : <ChevronDown size={12} className="text-[#0BD904]" />
  }

  async function handleArchive(id: string) {
    await archivePolicy(id)
    setPolicies(prev => prev.filter(p => p.id !== id))
  }

  async function handleUnarchive(id: string) {
    await unarchivePolicy(id)
    setPolicies(prev => prev.filter(p => p.id !== id))
  }

  async function handleDelete(id: string) {
    setDeleting(true)
    await deletePolicy(id)
    setPolicies(prev => prev.filter(p => p.id !== id))
    setDeleteConfirmId(null)
    setDeleting(false)
  }

  return (
    <>
      {/* Tabs */}
      <div className="flex gap-0 border-b border-[#E5E5E5] px-8">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => updateParams({ tab: t.id })}
            className={cn(
              'px-4 py-3 text-[13px] font-medium border-b-2 transition-colors',
              tab === t.id
                ? 'border-[#0BD904] text-[#0D0D0D]'
                : 'border-transparent text-[#6B7280] hover:text-[#0D0D0D]'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 px-8 py-4 border-b border-[#F3F4F6]">
        <div className="relative flex-1 max-w-[300px]">
          <Search size={14} className="absolute left-3 top-[50%] -translate-y-[50%] text-[#9CA3AF]" />
          <input
            type="text"
            defaultValue={search}
            placeholder="Buscar cliente, nº apólice ou objeto segurado..."
            onKeyDown={(e) => { if (e.key === 'Enter') updateParams({ search: (e.target as HTMLInputElement).value }) }}
            onBlur={(e) => updateParams({ search: e.target.value })}
            className="h-9 w-full rounded-[6px] border border-[#D1D1D1] bg-white pl-8 pr-3 text-[13px] text-[#0D0D0D] placeholder:text-[#9CA3AF] outline-none focus:border-[#0BD904] transition-colors"
          />
        </div>
        <select
          value={ramo}
          onChange={(e) => updateParams({ ramo: e.target.value })}
          className="h-9 rounded-[6px] border border-[#D1D1D1] bg-white px-3 text-[13px] text-[#0D0D0D] outline-none focus:border-[#0BD904] transition-colors"
        >
          <option value="">Ramo: Todos</option>
          {Object.entries(RAMO_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <span className="text-[12px] text-[#9CA3AF] ml-auto">
          {totalCount} apólice{totalCount !== 1 ? 's' : ''}
          {isPending && ' · atualizando...'}
        </span>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E5E5E5]">
              <th className="px-4 py-3 text-left">
                <button onClick={() => handleSort('cliente')} className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider hover:text-[#374151] transition-colors">
                  Cliente <SortIcon column="cliente" />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button onClick={() => handleSort('ramo')} className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider hover:text-[#374151] transition-colors">
                  Ramo <SortIcon column="ramo" />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button onClick={() => handleSort('seguradora')} className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider hover:text-[#374151] transition-colors">
                  Seguradora <SortIcon column="seguradora" />
                </button>
              </th>
              <th className="px-4 py-3 text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider text-left">Objeto Segurado</th>
              <th className="px-4 py-3 text-left">
                <button onClick={() => handleSort('end_date')} className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider hover:text-[#374151] transition-colors">
                  Vigência <SortIcon column="end_date" />
                </button>
              </th>
              <th className="px-4 py-3 text-right">
                <button onClick={() => handleSort('premium_total')} className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider hover:text-[#374151] transition-colors ml-auto">
                  Prêmio <SortIcon column="premium_total" />
                </button>
              </th>
              <th className="px-4 py-3 text-right">
                <button onClick={() => handleSort('commission_expected')} className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider hover:text-[#374151] transition-colors ml-auto">
                  Comissão <SortIcon column="commission_expected" />
                </button>
              </th>
              <th className="px-4 py-3 text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider text-left">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {policies.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-12 text-center text-[13px] text-[#9CA3AF]">
                  Nenhuma apólice encontrada.
                </td>
              </tr>
            )}
            {policies.map((policy) => {
              const days = daysUntil(policy.end_date)
              const rowBg = days < 0 ? 'bg-[#FFF5F5]' : days <= 30 ? 'bg-[#FFFBEB]' : ''
              return (
                <tr
                  key={policy.id}
                  onClick={() => router.push(`/apolices/${policy.id}`)}
                  className={cn('border-b border-[#F3F4F6] hover:bg-[#FAFAFA] transition-colors cursor-pointer', rowBg)}
                >
                  <td className="px-4 py-3 text-[13px] font-medium text-[#0D0D0D]">
                    {policy.clients?.name ?? '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-[4px] bg-[rgba(11,217,4,0.08)] text-[#034001] text-[11px] font-medium">
                      {RAMO_LABELS[policy.ramo] ?? policy.ramo}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[#6B7280]">{policy.seguradora}</td>
                  <td className="px-4 py-3 text-[13px] text-[#6B7280] max-w-[160px]">
                    {(policy.metadata as Record<string, string> | null)?.objeto_segurado
                      ? <span className="truncate block" title={(policy.metadata as Record<string, string>).objeto_segurado}>
                          {(policy.metadata as Record<string, string>).objeto_segurado}
                        </span>
                      : <span className="text-[#D1D1D1]">—</span>
                    }
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[#6B7280] whitespace-nowrap">
                    {formatDate(policy.start_date)} → {formatDate(policy.end_date)}
                  </td>
                  <td className="px-4 py-3 text-[13px] font-mono text-right text-[#0D0D0D]">
                    {formatCurrency(policy.premium_total)}
                  </td>
                  <td className="px-4 py-3 text-[13px] font-mono text-right text-[#0D0D0D]">
                    {formatCurrency(policy.commission_expected)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge policy={policy} />
                  </td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-1">
                      {days >= 0 && days <= 30 && (
                        <button
                          onClick={() => setRenovacaoPolicy(policy)}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-[5px] text-[12px] text-[#0BD904] font-medium hover:bg-[rgba(11,217,4,0.08)] transition-colors"
                        >
                          <MessageCircle size={11} />
                          Contatar
                        </button>
                      )}
                      {days < 0 && (
                        <button
                          onClick={() => setRenewingPolicy(policy)}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-[5px] text-[12px] text-[#D97706] font-medium hover:bg-[#FEF3C7] transition-colors"
                        >
                          <RefreshCw size={11} />
                          Renovar
                        </button>
                      )}
                      <DropdownMenu.Root>
                        <DropdownMenu.Trigger asChild>
                          <button className="p-1.5 rounded-[6px] text-[#9CA3AF] hover:bg-[#F3F4F6] hover:text-[#0D0D0D] transition-colors">
                            <MoreHorizontal size={15} />
                          </button>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Portal>
                          <DropdownMenu.Content
                            align="end"
                            className="z-50 min-w-[160px] bg-white border border-[#E5E5E5] rounded-[8px] shadow-lg py-1"
                          >
                            <DropdownMenu.Item
                              onSelect={() => router.push(`/apolices/${policy.id}`)}
                              className="flex items-center gap-2 px-3 py-2 text-[13px] cursor-pointer outline-none text-[#0D0D0D] hover:bg-[#F8F8F8]"
                            >
                              <ExternalLink size={12} className="text-[#6B7280]" />
                              Ver detalhes
                            </DropdownMenu.Item>
                            <DropdownMenu.Separator className="my-1 h-px bg-[#F3F4F6]" />
                            <DropdownMenu.Item
                              onSelect={() => setEditingPolicy(policy)}
                              className="flex items-center px-3 py-2 text-[13px] cursor-pointer outline-none text-[#0D0D0D] hover:bg-[#F8F8F8]"
                            >
                              Editar
                            </DropdownMenu.Item>
                            <DropdownMenu.Item
                              onSelect={() => setRenewingPolicy(policy)}
                              className="flex items-center gap-2 px-3 py-2 text-[13px] cursor-pointer outline-none text-[#0D0D0D] hover:bg-[#F8F8F8]"
                            >
                              <RefreshCw size={12} className="text-[#6B7280]" />
                              Renovar
                            </DropdownMenu.Item>
                            <DropdownMenu.Item
                              onSelect={() => { setPdfPolicy(policy); setPdfValidity(15) }}
                              className="flex items-center gap-2 px-3 py-2 text-[13px] cursor-pointer outline-none text-[#0D0D0D] hover:bg-[#F8F8F8]"
                            >
                              <FileText size={12} className="text-[#6B7280]" />
                              Gerar PDF
                            </DropdownMenu.Item>
                            <DropdownMenu.Separator className="my-1 h-px bg-[#F3F4F6]" />
                            {policy.status === 'cancelada' || policy.status === 'suspensa' ? (
                              <DropdownMenu.Item
                                onSelect={() => handleUnarchive(policy.id)}
                                className="flex items-center px-3 py-2 text-[13px] cursor-pointer outline-none text-[#16A34A] hover:bg-[#F0FDF4]"
                              >
                                Desarquivar
                              </DropdownMenu.Item>
                            ) : (
                              <DropdownMenu.Item
                                onSelect={() => handleArchive(policy.id)}
                                className="flex items-center px-3 py-2 text-[13px] cursor-pointer outline-none text-[#6B7280] hover:bg-[#F8F8F8]"
                              >
                                Arquivar
                              </DropdownMenu.Item>
                            )}
                            <DropdownMenu.Item
                              onSelect={() => setDeleteConfirmId(policy.id)}
                              className="flex items-center gap-2 px-3 py-2 text-[13px] cursor-pointer outline-none text-[#DC2626] hover:bg-[#FEF2F2]"
                            >
                              <Trash2 size={12} />
                              Excluir
                            </DropdownMenu.Item>
                          </DropdownMenu.Content>
                        </DropdownMenu.Portal>
                      </DropdownMenu.Root>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-8 py-4 border-t border-[#E5E5E5]">
          <p className="text-[13px] text-[#6B7280]">
            Mostrando {((currentPage - 1) * perPage) + 1}–{Math.min(currentPage * perPage, totalCount)} de {totalCount}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateParams({ page: String(currentPage - 1) })}
              disabled={currentPage <= 1}
              className="p-1.5 rounded-[6px] border border-[#E5E5E5] text-[#6B7280] hover:bg-[#F4F4F4] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="text-[13px] text-[#0D0D0D] px-2">{currentPage} / {totalPages}</span>
            <button
              onClick={() => updateParams({ page: String(currentPage + 1) })}
              disabled={currentPage >= totalPages}
              className="p-1.5 rounded-[6px] border border-[#E5E5E5] text-[#6B7280] hover:bg-[#F4F4F4] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Modal validade PDF */}
      {pdfPolicy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-[10px] border border-[#E5E5E5] shadow-xl p-6 w-[320px]">
            <p className="text-[14px] font-semibold text-[#0D0D0D] mb-1">Gerar Proposta PDF</p>
            <p className="text-[12px] text-[#6B7280] mb-4">
              {pdfPolicy.clients?.name ?? 'Cliente'} · {RAMO_LABELS[pdfPolicy.ramo] ?? pdfPolicy.ramo}
            </p>
            <label className="block text-[12px] font-medium text-[#6B7280] mb-1.5">Validade da proposta</label>
            <div className="flex gap-2 mb-5">
              {([7, 15, 30] as const).map(d => (
                <button
                  key={d}
                  onClick={() => setPdfValidity(d)}
                  className={`flex-1 h-9 rounded-[6px] text-[13px] font-medium border transition-colors ${
                    pdfValidity === d
                      ? 'border-[#0BD904] bg-[rgba(11,217,4,0.08)] text-[#034001]'
                      : 'border-[#D1D1D1] text-[#6B7280] hover:border-[#9CA3AF]'
                  }`}
                >
                  {d} dias
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPdfPolicy(null)}
                className="flex-1 h-9 rounded-[6px] border border-[#D1D1D1] text-[13px] text-[#6B7280] hover:bg-[#F8F8F8] transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  window.open(`/api/pdf/proposal/${pdfPolicy.id}?validity=${pdfValidity}`, '_blank')
                  setPdfPolicy(null)
                }}
                className="flex-1 h-9 rounded-[6px] bg-[#0BD904] text-[#0D0D0D] text-[13px] font-semibold hover:bg-[#09c203] transition-colors"
              >
                Baixar PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm exclusão */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-[10px] border border-[#E5E5E5] shadow-xl p-6 w-[360px]">
            <p className="text-[15px] font-semibold text-[#0D0D0D] mb-2">Excluir apólice?</p>
            <p className="text-[13px] text-[#6B7280] mb-5">
              Esta ação é permanente e não pode ser desfeita. Os alertas relacionados também serão removidos.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 h-9 rounded-[6px] border border-[#D1D1D1] text-[13px] text-[#6B7280] hover:bg-[#F8F8F8] transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                disabled={deleting}
                className="flex-1 h-9 rounded-[6px] bg-[#DC2626] text-white text-[13px] font-semibold hover:bg-[#B91C1C] disabled:opacity-60 transition-colors"
              >
                {deleting ? 'Excluindo...' : 'Excluir'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ApolicaModal
        open={!!editingPolicy}
        onOpenChange={(v) => { if (!v) setEditingPolicy(null) }}
        editingPolicy={editingPolicy}
        onCreated={() => {}}
        onUpdated={(updated) => setPolicies(prev => prev.map(p => p.id === updated.id ? updated : p))}
      />

      <ApolicaModal
        open={!!renewingPolicy}
        onOpenChange={(v) => { if (!v) setRenewingPolicy(null) }}
        renewingFrom={renewingPolicy}
        onCreated={(p) => { setPolicies(prev => [p, ...prev]); setRenewingPolicy(null) }}
      />

      <RenovacaoModal
        policy={renovacaoPolicy}
        brokerName={brokerName}
        onClose={() => setRenovacaoPolicy(null)}
      />

    </>
  )
}
