'use client'

import { useState, useTransition } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createProposal } from '@/app/actions/proposals'
import type { Proposal } from '@/app/actions/proposals'
import { RAMO_LABELS } from '@/types/policy'

const SEGURADORAS = ['Porto Seguro', 'Bradesco Seguros', 'SulAmérica', 'Allianz', 'Tokio Marine', 'HDI Seguros', 'Liberty', 'Mapfre', 'AXA', 'Zurich']
const RAMOS = Object.entries(RAMO_LABELS)

interface Props {
  open: boolean
  onOpenChange: (v: boolean) => void
  onCreated: (p: Proposal) => void
}

export function NewProposalModal({ open, onOpenChange, onCreated }: Props) {
  const [seguradora, setSeguradora] = useState('')
  const [ramo, setRamo] = useState('')
  const [proposalNumber, setProposalNumber] = useState('')
  const [protocolNumber, setProtocolNumber] = useState('')
  const [premiumEstimate, setPremiumEstimate] = useState('')
  const [commissionPct, setCommissionPct] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')
  const [, startTransition] = useTransition()

  if (!open) return null

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!seguradora.trim()) { setError('Seguradora é obrigatória'); return }
    if (!ramo) { setError('Ramo é obrigatório'); return }

    setError('')
    startTransition(async () => {
      const result = await createProposal({
        seguradora: seguradora.trim(),
        ramo,
        proposal_number: proposalNumber.trim() || undefined,
        protocol_number: protocolNumber.trim() || undefined,
        premium_estimate: premiumEstimate ? parseFloat(premiumEstimate) : undefined,
        commission_pct: commissionPct ? parseFloat(commissionPct) : undefined,
        notes: notes.trim() || undefined,
      })
      if (result.error) { setError(result.error); return }
      if (result.data) {
        onCreated(result.data)
        onOpenChange(false)
        setSeguradora(''); setRamo(''); setProposalNumber(''); setProtocolNumber('')
        setPremiumEstimate(''); setCommissionPct(''); setNotes('')
      }
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={() => onOpenChange(false)} />
      <div className="relative bg-white rounded-[12px] shadow-xl w-full max-w-[480px] mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E5E5] sticky top-0 bg-white">
          <h2 className="text-[15px] font-semibold text-[#0D0D0D]">Nova Proposta</h2>
          <button onClick={() => onOpenChange(false)} className="p-1 rounded-[5px] text-[#9CA3AF] hover:text-[#0D0D0D] hover:bg-[#F3F4F6]">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-semibold text-[#6B7280] uppercase tracking-wide mb-1.5">Seguradora *</label>
              <input
                list="seguradoras-list"
                value={seguradora}
                onChange={e => setSeguradora(e.target.value)}
                placeholder="Ex: Porto Seguro"
                className="w-full h-9 px-3 rounded-[6px] border border-[#D1D1D1] text-[13px] focus:outline-none focus:border-[#0BD904] focus:ring-1 focus:ring-[#0BD904]/20"
              />
              <datalist id="seguradoras-list">
                {SEGURADORAS.map(s => <option key={s} value={s} />)}
              </datalist>
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-[#6B7280] uppercase tracking-wide mb-1.5">Ramo *</label>
              <select
                value={ramo}
                onChange={e => setRamo(e.target.value)}
                className="w-full h-9 px-3 rounded-[6px] border border-[#D1D1D1] text-[13px] focus:outline-none focus:border-[#0BD904] bg-white"
              >
                <option value="">Selecione...</option>
                {RAMOS.map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-semibold text-[#6B7280] uppercase tracking-wide mb-1.5">Nº Proposta</label>
              <input
                value={proposalNumber}
                onChange={e => setProposalNumber(e.target.value)}
                placeholder="Número da seguradora"
                className="w-full h-9 px-3 rounded-[6px] border border-[#D1D1D1] text-[13px] focus:outline-none focus:border-[#0BD904]"
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-[#6B7280] uppercase tracking-wide mb-1.5">Protocolo</label>
              <input
                value={protocolNumber}
                onChange={e => setProtocolNumber(e.target.value)}
                placeholder="Protocolo interno"
                className="w-full h-9 px-3 rounded-[6px] border border-[#D1D1D1] text-[13px] focus:outline-none focus:border-[#0BD904]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-semibold text-[#6B7280] uppercase tracking-wide mb-1.5">Prêmio Estimado (R$)</label>
              <input
                type="number"
                step="0.01"
                value={premiumEstimate}
                onChange={e => setPremiumEstimate(e.target.value)}
                placeholder="0,00"
                className="w-full h-9 px-3 rounded-[6px] border border-[#D1D1D1] text-[13px] focus:outline-none focus:border-[#0BD904]"
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-[#6B7280] uppercase tracking-wide mb-1.5">Comissão (%)</label>
              <input
                type="number"
                step="0.1"
                value={commissionPct}
                onChange={e => setCommissionPct(e.target.value)}
                placeholder="0.0"
                className="w-full h-9 px-3 rounded-[6px] border border-[#D1D1D1] text-[13px] focus:outline-none focus:border-[#0BD904]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-[#6B7280] uppercase tracking-wide mb-1.5">Observações</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 rounded-[6px] border border-[#D1D1D1] text-[13px] focus:outline-none focus:border-[#0BD904] resize-none"
            />
          </div>

          {error && <p className="text-[12px] text-[#DC2626]">{error}</p>}

          <div className="flex gap-2 pt-2">
            <Button type="button" variant="secondary" size="sm" className="flex-1" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" size="sm" className="flex-1">Criar Proposta</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
