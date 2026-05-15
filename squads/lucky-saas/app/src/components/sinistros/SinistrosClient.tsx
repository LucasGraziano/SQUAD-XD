'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, X, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ClaimStatusBadge } from './ClaimStatusBadge'
import { createClaim } from '@/app/actions/claims'
import type { Claim, ClaimStatus, ClaimType } from '@/types/claim'
import { CLAIM_TYPE_LABELS } from '@/types/claim'
import { RAMO_LABELS } from '@/types/policy'

type PolicyOption = {
  id: string
  policy_number?: string | null
  ramo: string
  seguradora: string
  client_id: string
  clients?: { name: string } | null
}

interface Props {
  claims: Claim[]
  activePolicies: PolicyOption[]
}

const STATUS_FILTERS: { value: ClaimStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'open', label: 'Abertos' },
  { value: 'analyzing', label: 'Em Análise' },
  { value: 'awaiting_docs', label: 'Aguard. Docs' },
  { value: 'approved', label: 'Aprovados' },
  { value: 'paid', label: 'Pagos' },
  { value: 'closed', label: 'Encerrados' },
  { value: 'denied', label: 'Negados' },
]

function formatDate(d: string) {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(d + 'T12:00:00'))
}

export function SinistrosClient({ claims: initialClaims, activePolicies }: Props) {
  const [claims, setClaims] = useState(initialClaims)
  const [filterStatus, setFilterStatus] = useState<ClaimStatus | 'all'>('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    policy_id: '',
    occurrence_date: new Date().toISOString().split('T')[0],
    claim_type: 'colisao' as ClaimType,
    description: '',
    insurer_process_number: '',
    estimated_value: '',
  })

  const selectedPolicy = activePolicies.find(p => p.id === form.policy_id)

  const filtered = filterStatus === 'all'
    ? claims
    : claims.filter(c => c.status === filterStatus)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.policy_id) { setError('Selecione uma apólice'); return }
    if (!selectedPolicy) return

    setSubmitting(true)
    setError(null)

    const result = await createClaim({
      policy_id: form.policy_id,
      client_id: selectedPolicy.client_id,
      occurrence_date: form.occurrence_date,
      claim_type: form.claim_type,
      description: form.description || undefined,
      insurer_process_number: form.insurer_process_number || undefined,
      estimated_value: form.estimated_value ? parseFloat(form.estimated_value) : undefined,
    })

    setSubmitting(false)

    if (result.error) { setError(result.error); return }
    if (result.data) {
      setClaims(prev => [result.data!, ...prev])
    }
    setModalOpen(false)
    setForm({ policy_id: '', occurrence_date: new Date().toISOString().split('T')[0], claim_type: 'colisao', description: '', insurer_process_number: '', estimated_value: '' })
  }

  const inputCls = "w-full h-9 rounded-[6px] border border-[#D1D1D1] bg-white px-3 text-[13px] text-[#0D0D0D] outline-none focus:border-[#0BD904] transition-colors"
  const labelCls = "block text-[12px] font-medium text-[#6B7280] mb-1"

  return (
    <>
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1 flex-wrap">
          {STATUS_FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => setFilterStatus(f.value)}
              className={`px-3 py-1.5 rounded-[6px] text-[12px] font-medium transition-colors ${
                filterStatus === f.value
                  ? 'bg-[#0D0D0D] text-white'
                  : 'bg-white border border-[#E5E5E5] text-[#6B7280] hover:text-[#0D0D0D]'
              }`}
            >
              {f.label}
              {f.value !== 'all' && (
                <span className="ml-1 text-[11px]">
                  ({claims.filter(c => c.status === f.value).length})
                </span>
              )}
            </button>
          ))}
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus size={14} className="mr-1.5" />
          Novo Sinistro
        </Button>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="flex items-center justify-center h-[300px] bg-white rounded-[8px] border border-[#E5E5E5]">
          <div className="text-center">
            <p className="text-[14px] font-medium text-[#0D0D0D] mb-1">Nenhum sinistro</p>
            <p className="text-[13px] text-[#9CA3AF]">
              {filterStatus === 'all' ? 'Clique em "Novo Sinistro" para registrar.' : 'Nenhum sinistro com este status.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-[8px] border border-[#E5E5E5] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E5E5E5]">
                {['Cliente', 'Apólice', 'Tipo', 'Ocorrência', 'Status', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(claim => (
                <tr key={claim.id} className="border-b border-[#F3F4F6] hover:bg-[#FAFAFA] transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-[13px] font-medium text-[#0D0D0D]">{claim.clients?.name ?? '—'}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-[12px] text-[#6B7280]">
                      {claim.policies?.seguradora ?? '—'} · {claim.policies ? RAMO_LABELS[claim.policies.ramo] ?? claim.policies.ramo : '—'}
                    </p>
                    {claim.policies?.policy_number && (
                      <p className="text-[11px] text-[#9CA3AF]">#{claim.policies.policy_number}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[12px] text-[#6B7280]">
                      {CLAIM_TYPE_LABELS[claim.claim_type] ?? claim.claim_type}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[12px] text-[#6B7280]">{formatDate(claim.occurrence_date)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <ClaimStatusBadge status={claim.status} />
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/sinistros/${claim.id}`}
                      className="inline-flex items-center gap-1 text-[12px] text-[#6B7280] hover:text-[#0D0D0D] transition-colors"
                    >
                      Ver <ChevronRight size={12} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal novo sinistro */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-[12px] border border-[#E5E5E5] w-full max-w-[520px] shadow-xl mx-4">
            <div className="flex items-center justify-between p-5 border-b border-[#E5E5E5]">
              <h2 className="text-[16px] font-semibold text-[#0D0D0D]">Novo Sinistro</h2>
              <button onClick={() => setModalOpen(false)} className="p-1 rounded-[4px] hover:bg-[#F3F4F6] transition-colors">
                <X size={16} className="text-[#6B7280]" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className={labelCls}>Apólice *</label>
                <select
                  value={form.policy_id}
                  onChange={e => setForm(f => ({ ...f, policy_id: e.target.value }))}
                  className={inputCls}
                  required
                >
                  <option value="">Selecione a apólice...</option>
                  {activePolicies.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.clients?.name ?? '—'} · {p.seguradora} · {RAMO_LABELS[p.ramo] ?? p.ramo}
                      {p.policy_number ? ` · #${p.policy_number}` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Data da Ocorrência *</label>
                  <input
                    type="date"
                    value={form.occurrence_date}
                    onChange={e => setForm(f => ({ ...f, occurrence_date: e.target.value }))}
                    className={inputCls}
                    required
                  />
                </div>
                <div>
                  <label className={labelCls}>Tipo *</label>
                  <select
                    value={form.claim_type}
                    onChange={e => setForm(f => ({ ...f, claim_type: e.target.value as ClaimType }))}
                    className={inputCls}
                  >
                    {Object.entries(CLAIM_TYPE_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className={labelCls}>Descrição</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Descreva o sinistro..."
                  rows={3}
                  className="w-full rounded-[6px] border border-[#D1D1D1] bg-white px-3 py-2 text-[13px] text-[#0D0D0D] outline-none focus:border-[#0BD904] transition-colors resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Nº Processo Seguradora</label>
                  <input
                    type="text"
                    value={form.insurer_process_number}
                    onChange={e => setForm(f => ({ ...f, insurer_process_number: e.target.value }))}
                    placeholder="Opcional"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Valor Estimado (R$)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.estimated_value}
                    onChange={e => setForm(f => ({ ...f, estimated_value: e.target.value }))}
                    placeholder="0,00"
                    className={inputCls}
                  />
                </div>
              </div>

              {error && (
                <p className="text-[12px] text-[#EF4444] bg-[#FEF2F2] rounded-[6px] px-3 py-2">{error}</p>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="h-9 px-4 rounded-[6px] text-[13px] font-medium text-[#6B7280] hover:text-[#0D0D0D] transition-colors"
                >
                  Cancelar
                </button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Salvando...' : 'Abrir Sinistro'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
