'use client'

import { useState, useTransition } from 'react'
import { Save } from 'lucide-react'
import { updateDealInsurer } from '@/app/actions/deals'
import type { DealSummary } from '@/app/actions/deals'
import type { DealStage } from '@/lib/constants/deal-stages'

const INSURER_STAGES: DealStage[] = ['submitted', 'under_analysis', 'issued', 'contracted']

const inputCls = 'h-9 w-full rounded-[6px] border border-[#D1D1D1] bg-white px-3 text-[13px] text-[#0D0D0D] outline-none focus:border-[#0BD904] transition-colors'
const labelCls = 'block text-[12px] font-medium text-[#374151] mb-1'

interface Props {
  deal: DealSummary
}

export function DealInsurerSection({ deal }: Props) {
  const [proposalNumber, setProposalNumber]  = useState(deal.proposal_number  ?? '')
  const [protocolNumber, setProtocolNumber]  = useState(deal.protocol_number  ?? '')
  const [responseDeadline, setResponseDeadline] = useState(deal.response_deadline ?? '')
  const [saved, setSaved] = useState(false)
  const [, startTransition] = useTransition()

  if (!INSURER_STAGES.includes(deal.stage)) return null

  const isOverdue = responseDeadline && new Date(responseDeadline + 'T00:00:00') < new Date()

  function save() {
    startTransition(async () => {
      await updateDealInsurer({
        dealId:           deal.id,
        proposalNumber:   proposalNumber || undefined,
        protocolNumber:   protocolNumber || undefined,
        responseDeadline: responseDeadline || undefined,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    })
  }

  return (
    <section className="bg-white rounded-[10px] border border-[#E5E5E5] p-4">
      <h3 className="text-[13px] font-semibold text-[#374151] mb-3">Dados da Seguradora</h3>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className={labelCls}>Nº da Proposta</label>
          <input className={inputCls} value={proposalNumber} onChange={(e) => setProposalNumber(e.target.value)} placeholder="Ex: PROP-001" />
        </div>
        <div>
          <label className={labelCls}>Nº de Protocolo</label>
          <input className={inputCls} value={protocolNumber} onChange={(e) => setProtocolNumber(e.target.value)} placeholder="Ex: 987654" />
        </div>
        <div>
          <label className={labelCls}>Prazo de Resposta</label>
          <input
            type="date"
            className={`${inputCls} ${isOverdue ? 'border-[#DC2626] text-[#DC2626]' : ''}`}
            value={responseDeadline}
            onChange={(e) => setResponseDeadline(e.target.value)}
          />
          {isOverdue && (
            <p className="mt-1 text-[11px] text-[#DC2626]">Prazo vencido</p>
          )}
        </div>
      </div>

      <button
        onClick={save}
        className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[6px] border border-[#D1D1D1] text-[12px] text-[#374151] hover:bg-[#F8F8F8] transition-colors"
      >
        <Save size={12} />
        {saved ? 'Salvo!' : 'Salvar'}
      </button>
    </section>
  )
}
