'use client'

import { useState } from 'react'
import { Plus, ChevronDown, Trash2, Check, Star, FileDown, Search, Scale } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { QuoteRequestModal } from './QuoteRequestModal'
import { QuoteStatusBadge } from './QuoteStatusBadge'
import { QuoteStatusActions } from './QuoteStatusActions'
import { QuoteStatusFilter } from './QuoteStatusFilter'
import { addQuoteItem, deleteQuoteItem, deleteQuoteRequest, updateQuoteItem } from '@/app/(dashboard)/cotacoes/actions'
import type { QuoteRequest, QuoteItem, QuoteStatus } from '@/types/quote'
import type { DocClient } from '@/types/client'
import { RAMO_LABELS, PAYMENT_LABELS, type PaymentFrequency } from '@/types/policy'
import { EmptyState, FilterEmptyState } from '@/components/ui/EmptyState'

const inputCls = "h-[38px] w-full rounded-[6px] border border-[#D1D1D1] bg-white px-3 text-[13px] text-[#0D0D0D] placeholder:text-[#9CA3AF] outline-none focus:border-[#0BD904] transition-colors"
const selectCls = "h-[38px] w-full rounded-[6px] border border-[#D1D1D1] bg-white px-3 text-[13px] text-[#0D0D0D] outline-none focus:border-[#0BD904] transition-colors"

function formatBRL(n: number) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function parseCurrency(v: string) {
  return parseFloat(v.replace(/\./g, '').replace(',', '.')) || 0
}

function formatCurrencyInput(v: string) {
  const n = v.replace(/\D/g, '')
  if (!n) return ''
  return (parseInt(n, 10) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

interface Props {
  quotes: QuoteRequest[]
  clients: DocClient[]
  plan: string
}

interface NewItemForm {
  seguradora: string
  premiumRaw: string
  payFreq: string
  franchiseRaw: string
  coveragesText: string
  brokerNote: string
  isRecommended: boolean
}

const emptyForm = (): NewItemForm => ({
  seguradora: '', premiumRaw: '', payFreq: 'anual',
  franchiseRaw: '', coveragesText: '', brokerNote: '', isRecommended: false,
})

export function CotacoesClient({ quotes: initialQuotes, clients, plan }: Props) {
  const [quotes, setQuotes] = useState<QuoteRequest[]>(initialQuotes)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<QuoteStatus | 'all'>('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingQuote, setEditingQuote] = useState<QuoteRequest | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [newItemForms, setNewItemForms] = useState<Record<string, NewItemForm>>({})
  const [addingItem, setAddingItem] = useState<string | null>(null)
  const [itemErrors, setItemErrors] = useState<Record<string, string>>({})

  if (plan === 'starter') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-[rgba(11,217,4,0.08)] flex items-center justify-center mb-4">
          <Scale size={26} className="text-[#0BD904]" />
        </div>
        <h2 className="text-[18px] font-semibold text-[#0D0D0D] mb-2">Multicálculo — Plano Profissional</h2>
        <p className="text-[14px] text-[#6B7280] max-w-[380px] mb-6">
          Compare cotações de múltiplas seguradoras e gere um PDF profissional para fechar mais contratos.
        </p>
        <Button size="sm">Fazer upgrade para Pro</Button>
      </div>
    )
  }

  function handleStatusChanged(quoteId: string, newStatus: QuoteStatus) {
    setQuotes(prev => prev.map(q => q.id === quoteId ? { ...q, status: newStatus } : q))
  }

  const filtered = quotes.filter(q => {
    if (statusFilter !== 'all' && q.status !== statusFilter) return false
    if (!search) return true
    const clientName = (q.clients as { name: string } | undefined)?.name ?? ''
    return clientName.toLowerCase().includes(search.toLowerCase()) ||
      RAMO_LABELS[q.ramo]?.toLowerCase().includes(search.toLowerCase()) ||
      (q.object_description ?? '').toLowerCase().includes(search.toLowerCase())
  })

  function handleSaved(q: QuoteRequest) {
    if (editingQuote) {
      setQuotes(prev => prev.map(x => x.id === q.id ? q : x))
    } else {
      setQuotes(prev => [q, ...prev])
    }
    setEditingQuote(null)
  }

  async function handleDeleteQuote(id: string) {
    if (!confirm('Excluir esta cotação e todos os itens?')) return
    const result = await deleteQuoteRequest(id)
    if (!result.error) setQuotes(prev => prev.filter(q => q.id !== id))
  }

  function toggleExpand(id: string) {
    setExpandedId(prev => prev === id ? null : id)
    if (!newItemForms[id]) {
      setNewItemForms(prev => ({ ...prev, [id]: emptyForm() }))
    }
  }

  function updateForm(qid: string, patch: Partial<NewItemForm>) {
    setNewItemForms(prev => ({ ...prev, [qid]: { ...(prev[qid] ?? emptyForm()), ...patch } }))
  }

  async function handleAddItem(qid: string) {
    const form = newItemForms[qid] ?? emptyForm()
    if (!form.seguradora.trim()) return
    const premium = parseCurrency(form.premiumRaw)
    if (premium <= 0) return

    setAddingItem(qid)
    const coverages = form.coveragesText
      .split(/[,\n]/)
      .map(s => s.trim())
      .filter(Boolean)

    const result = await addQuoteItem({
      quote_request_id: qid,
      seguradora: form.seguradora,
      premium_total: premium,
      payment_frequency: form.payFreq,
      franchise_value: form.franchiseRaw ? parseCurrency(form.franchiseRaw) : undefined,
      coverages,
      broker_note: form.brokerNote || undefined,
      is_recommended: form.isRecommended,
    })

    setAddingItem(null)
    if (result.error) {
      setItemErrors(prev => ({ ...prev, [qid]: result.error! }))
      return
    }
    setItemErrors(prev => { const next = { ...prev }; delete next[qid]; return next })

    const newItem = result.data as QuoteItem
    setQuotes(prev => prev.map(q => {
      if (q.id !== qid) return q
      return { ...q, quote_items: [...(q.quote_items ?? []), newItem] }
    }))
    setNewItemForms(prev => ({ ...prev, [qid]: emptyForm() }))
  }

  async function handleDeleteItem(qid: string, itemId: string) {
    const result = await deleteQuoteItem(itemId)
    if (!result.error) {
      setQuotes(prev => prev.map(q => {
        if (q.id !== qid) return q
        return { ...q, quote_items: (q.quote_items ?? []).filter(i => i.id !== itemId) }
      }))
    }
  }

  async function handleToggleRecommended(qid: string, item: QuoteItem) {
    const result = await updateQuoteItem(item.id, { is_recommended: !item.is_recommended })
    if (!result.error) {
      setQuotes(prev => prev.map(q => {
        if (q.id !== qid) return q
        return { ...q, quote_items: (q.quote_items ?? []).map(i => i.id === item.id ? { ...i, is_recommended: !i.is_recommended } : i) }
      }))
    }
  }

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-[320px]">
            <Search size={14} className="absolute left-3 top-[50%] -translate-y-[50%] text-[#9CA3AF]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por cliente ou ramo..."
              className="h-9 w-full rounded-[6px] border border-[#D1D1D1] bg-white pl-8 pr-3 text-[13px] placeholder:text-[#9CA3AF] outline-none focus:border-[#0BD904] transition-colors"
            />
          </div>
          <Button size="sm" onClick={() => { setEditingQuote(null); setModalOpen(true) }}>
            <Plus size={14} />
            Nova Cotação
          </Button>
        </div>
        <QuoteStatusFilter value={statusFilter} onChange={setStatusFilter} />
      </div>

      {/* Empty state */}
      {filtered.length === 0 ? (
        quotes.length === 0 ? (
          <EmptyState
            illustration="quotes"
            title="Crie sua primeira proposta"
            description="Compare seguradoras, envie ao cliente com 1 clique e converta em apólice automaticamente."
            primaryCta={{ label: 'Nova cotação', onClick: () => { setEditingQuote(null); setModalOpen(true) } }}
          />
        ) : (
          <FilterEmptyState term={search} onClear={() => { setSearch(''); setStatusFilter('all') }} />
        )
      ) : (
        <div className="space-y-3">
          {filtered.map(q => {
            const clientName = (q.clients as { name: string } | undefined)?.name ?? '—'
            const items = q.quote_items ?? []
            const isOpen = expandedId === q.id
            const form = newItemForms[q.id] ?? emptyForm()

            return (
              <div key={q.id} className="bg-white rounded-[8px] border border-[#E5E5E5]">
                {/* Quote header row */}
                <div className="flex items-center gap-3 px-5 py-3.5">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="px-2 py-0.5 rounded-[4px] bg-[rgba(11,217,4,0.08)] text-[#034001] text-[11px] font-semibold">
                        {RAMO_LABELS[q.ramo] ?? q.ramo}
                      </span>
                      <QuoteStatusBadge status={q.status} />
                      <span className="text-[11px] text-[#9CA3AF]">{items.length} seguradora{items.length !== 1 ? 's' : ''}</span>
                    </div>
                    <p className="text-[14px] font-medium text-[#0D0D0D]">{clientName}</p>
                    {q.object_description && (
                      <p className="text-[12px] text-[#9CA3AF] truncate">{q.object_description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {q.apolice_id && (
                      <a
                        href={`/apolices/${q.apolice_id}`}
                        className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[6px] border border-[#0BD904] text-[12px] font-medium text-[#034001] hover:bg-[rgba(11,217,4,0.08)] transition-colors"
                      >
                        Ver Apólice
                      </a>
                    )}
                    <QuoteStatusActions
                      quoteId={q.id}
                      currentStatus={q.status}
                      onStatusChanged={handleStatusChanged}
                    />
                    {items.length > 0 && (
                      <a
                        href={`/api/pdf/quote/${q.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[6px] border border-[#D1D1D1] text-[12px] font-medium text-[#6B7280] hover:border-[#0BD904] hover:text-[#0D0D0D] transition-colors"
                      >
                        <FileDown size={13} />
                        PDF
                      </a>
                    )}
                    <button
                      onClick={() => { setEditingQuote(q); setModalOpen(true) }}
                      className="h-8 px-3 rounded-[6px] border border-[#D1D1D1] text-[12px] font-medium text-[#6B7280] hover:border-[#0BD904] hover:text-[#0D0D0D] transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteQuote(q.id)}
                      className="h-8 w-8 flex items-center justify-center rounded-[6px] border border-[#D1D1D1] text-[#9CA3AF] hover:border-[#DC2626] hover:text-[#DC2626] transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                    <button
                      onClick={() => toggleExpand(q.id)}
                      className="h-8 w-8 flex items-center justify-center rounded-[6px] border border-[#D1D1D1] text-[#6B7280] hover:border-[#0BD904] transition-colors"
                    >
                      <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Expanded: items + add form */}
                {isOpen && (
                  <div className="border-t border-[#F3F4F6] px-5 py-4 space-y-3">
                    {/* Existing items */}
                    {items.length > 0 && (
                      <div className="space-y-2">
                        {items.map(item => (
                          <div key={item.id} className={`rounded-[6px] border p-3 ${item.is_recommended ? 'border-[#0BD904] bg-[rgba(11,217,4,0.04)]' : 'border-[#E5E5E5] bg-[#F9FAFB]'}`}>
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-[14px] font-semibold text-[#0D0D0D]">{item.seguradora}</span>
                                  {item.is_recommended && (
                                    <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-[4px] bg-[#0BD904] text-[#0D0D0D] text-[10px] font-bold">
                                      <Star size={8} fill="currentColor" />
                                      RECOMENDADO
                                    </span>
                                  )}
                                </div>
                                <p className="text-[14px] font-bold font-mono text-[#0D0D0D]">
                                  {formatBRL(item.premium_total)}
                                  <span className="text-[11px] font-normal text-[#9CA3AF] ml-1">
                                    {(PAYMENT_LABELS[item.payment_frequency as PaymentFrequency] ?? item.payment_frequency).toLowerCase()}
                                  </span>
                                </p>
                                {item.franchise_value && (
                                  <p className="text-[12px] text-[#6B7280]">Franquia: {formatBRL(item.franchise_value)}</p>
                                )}
                                {item.coverages.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-1.5">
                                    {item.coverages.map((c, i) => (
                                      <span key={i} className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[4px] bg-[rgba(11,217,4,0.08)] text-[#034001] text-[11px]">
                                        <Check size={9} />
                                        {c}
                                      </span>
                                    ))}
                                  </div>
                                )}
                                {item.broker_note && (
                                  <p className="text-[12px] text-[#6B7280] italic mt-1">{item.broker_note}</p>
                                )}
                              </div>
                              <div className="flex gap-1 flex-shrink-0">
                                <button
                                  onClick={() => handleToggleRecommended(q.id, item)}
                                  className={`h-7 w-7 flex items-center justify-center rounded-[6px] border transition-colors ${item.is_recommended ? 'border-[#0BD904] text-[#0BD904] bg-[rgba(11,217,4,0.1)]' : 'border-[#D1D1D1] text-[#9CA3AF] hover:border-[#0BD904]'}`}
                                  title="Marcar como recomendado"
                                >
                                  <Star size={12} fill={item.is_recommended ? 'currentColor' : 'none'} />
                                </button>
                                <button
                                  onClick={() => handleDeleteItem(q.id, item.id)}
                                  className="h-7 w-7 flex items-center justify-center rounded-[6px] border border-[#D1D1D1] text-[#9CA3AF] hover:border-[#DC2626] hover:text-[#DC2626] transition-colors"
                                >
                                  <Trash2 size={11} />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add item form */}
                    <div className="rounded-[6px] border border-dashed border-[#D1D1D1] p-3 space-y-3">
                      <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wide">Adicionar Seguradora</p>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          placeholder="Nome da seguradora"
                          value={form.seguradora}
                          onChange={(e) => updateForm(q.id, { seguradora: e.target.value })}
                          className={inputCls}
                        />
                        <input
                          placeholder="Prêmio total (R$)"
                          value={form.premiumRaw}
                          onChange={(e) => {
                            const raw = e.target.value.replace(/\D/g, '')
                            updateForm(q.id, { premiumRaw: raw ? formatCurrencyInput(raw) : '' })
                          }}
                          className={`${inputCls} font-mono`}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={form.payFreq}
                          onChange={(e) => updateForm(q.id, { payFreq: e.target.value })}
                          className={selectCls}
                        >
                          <option value="anual">Anual</option>
                          <option value="semestral">Semestral</option>
                          <option value="trimestral">Trimestral</option>
                          <option value="mensal">Mensal</option>
                        </select>
                        <input
                          placeholder="Franquia (R$) — opcional"
                          value={form.franchiseRaw}
                          onChange={(e) => {
                            const raw = e.target.value.replace(/\D/g, '')
                            updateForm(q.id, { franchiseRaw: raw ? formatCurrencyInput(raw) : '' })
                          }}
                          className={`${inputCls} font-mono`}
                        />
                      </div>
                      <textarea
                        placeholder="Coberturas (uma por linha ou separadas por vírgula)"
                        value={form.coveragesText}
                        onChange={(e) => updateForm(q.id, { coveragesText: e.target.value })}
                        rows={2}
                        className="w-full rounded-[6px] border border-[#D1D1D1] bg-white px-3 py-2 text-[13px] placeholder:text-[#9CA3AF] outline-none focus:border-[#0BD904] transition-colors resize-none"
                      />
                      <input
                        placeholder="Nota do corretor (opcional)"
                        value={form.brokerNote}
                        onChange={(e) => updateForm(q.id, { brokerNote: e.target.value })}
                        className={inputCls}
                      />
                      {itemErrors[q.id] && (
                        <p className="text-[12px] text-[#DC2626] bg-[#FEF2F2] border border-[#FECACA] rounded-[6px] px-3 py-2">
                          {itemErrors[q.id]}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={form.isRecommended}
                            onChange={(e) => updateForm(q.id, { isRecommended: e.target.checked })}
                            className="w-4 h-4 accent-[#0BD904]"
                          />
                          <span className="text-[13px] text-[#6B7280]">Marcar como recomendado</span>
                        </label>
                        <Button
                          size="sm"
                          onClick={() => handleAddItem(q.id)}
                          loading={addingItem === q.id}
                          disabled={!form.seguradora.trim() || !form.premiumRaw}
                        >
                          <Plus size={13} />
                          Adicionar
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      <QuoteRequestModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSaved={handleSaved}
        clients={clients}
        editing={editingQuote}
      />
    </div>
  )
}
