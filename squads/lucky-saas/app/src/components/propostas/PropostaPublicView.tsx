'use client'

import { useState, useTransition } from 'react'
import { Shield, CheckCircle, Star } from 'lucide-react'
import { approveQuoteByToken } from '@/app/actions/quotes'
import { RAMO_LABELS } from '@/types/lead'
import type { LeadRamo } from '@/types/lead'

type QuoteItem = {
  id: string
  seguradora: string
  premium_total: number
  payment_frequency: string
  coverages: string[]
  exclusions: string[]
  broker_note: string | null
  is_recommended: boolean
}

type Quote = {
  id: string
  status: string
  ramo: string
  object_description: string | null
  notes: string | null
  clients: { name: string; email: string | null; phone: string } | null
  quote_items: QuoteItem[]
}

interface Props {
  quote: Quote
  token: string
}

function formatCurrency(n: number) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function freqLabel(freq: string) {
  const map: Record<string, string> = {
    mensal: '/mês', trimestral: '/trimestre', semestral: '/semestre',
    anual: '/ano', unico: 'pagamento único',
  }
  return map[freq] ?? `/${freq}`
}

function ItemCard({ item }: { item: QuoteItem }) {
  return (
    <div className={`relative rounded-[10px] border p-5 ${item.is_recommended ? 'border-[#0BD904] shadow-[0_0_0_2px_rgba(11,217,4,0.15)]' : 'border-[#E5E5E5]'}`}>
      {item.is_recommended && (
        <div className="absolute -top-3 left-4 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#0BD904] text-[#0D0D0D] text-[11px] font-bold">
          <Star size={10} fill="currentColor" />
          Recomendado
        </div>
      )}
      <div className="flex items-start justify-between mb-3">
        <p className="text-[16px] font-bold text-[#0D0D0D]">{item.seguradora}</p>
        <div className="text-right">
          <p className="text-[20px] font-black text-[#0D0D0D]">{formatCurrency(item.premium_total)}</p>
          <p className="text-[12px] text-[#9CA3AF]">{freqLabel(item.payment_frequency)}</p>
        </div>
      </div>
      {item.coverages.length > 0 && (
        <div className="mb-2">
          <p className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wide mb-1">Coberturas</p>
          <ul className="space-y-0.5">
            {item.coverages.map((c, i) => (
              <li key={i} className="flex items-center gap-1.5 text-[13px] text-[#0D0D0D]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0BD904] flex-shrink-0" />
                {c}
              </li>
            ))}
          </ul>
        </div>
      )}
      {item.broker_note && (
        <p className="mt-2 text-[12px] text-[#6B7280] italic border-t border-[#F3F4F6] pt-2">{item.broker_note}</p>
      )}
    </div>
  )
}

export function PropostaPublicView({ quote, token }: Props) {
  const [approved, setApproved] = useState(quote.status === 'approved' || quote.status === 'contracted')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const ramo = RAMO_LABELS[quote.ramo as LeadRamo] ?? quote.ramo
  const items = [...(quote.quote_items ?? [])].sort((a, b) => (b.is_recommended ? 1 : 0) - (a.is_recommended ? 1 : 0))

  function handleApprove() {
    setError(null)
    startTransition(async () => {
      const result = await approveQuoteByToken(token)
      if (result.error) {
        setError(result.error)
      } else {
        setApproved(true)
      }
    })
  }

  return (
    <div className="min-h-screen bg-[#F8F8F8] py-10 px-4">
      <div className="max-w-[640px] mx-auto">
        {/* Header */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-[8px] bg-[rgba(11,217,4,0.12)] flex items-center justify-center">
            <Shield size={18} className="text-[#034001]" />
          </div>
          <span className="text-[18px] font-bold text-[#0D0D0D]">Premia</span>
        </div>

        {/* Proposta card */}
        <div className="bg-white rounded-[12px] border border-[#E5E5E5] p-6 mb-6 shadow-sm">
          <p className="text-[13px] font-semibold text-[#6B7280] uppercase tracking-wide mb-1">Proposta de Seguro</p>
          <h1 className="text-[22px] font-black text-[#0D0D0D] mb-1">{ramo}</h1>
          {quote.clients && (
            <p className="text-[14px] text-[#6B7280]">Para: <span className="font-medium text-[#0D0D0D]">{quote.clients.name}</span></p>
          )}
          {quote.object_description && (
            <p className="text-[13px] text-[#6B7280] mt-1">{quote.object_description}</p>
          )}
        </div>

        {/* Items */}
        {items.length > 0 ? (
          <div className="space-y-4 mb-6">
            {items.map(item => <ItemCard key={item.id} item={item} />)}
          </div>
        ) : (
          <div className="bg-white rounded-[10px] border border-[#E5E5E5] p-8 text-center mb-6">
            <p className="text-[14px] text-[#9CA3AF]">Nenhuma opção de seguro disponível ainda.</p>
          </div>
        )}

        {/* Approve CTA */}
        {!approved && quote.status === 'sent' && items.length > 0 && (
          <div className="bg-white rounded-[12px] border border-[#E5E5E5] p-6 text-center">
            <p className="text-[14px] text-[#6B7280] mb-4">Gostou da proposta? Clique para confirmar sua aprovação.</p>
            {error && <p className="text-[12px] text-[#DC2626] mb-3">{error}</p>}
            <button
              onClick={handleApprove}
              disabled={isPending}
              className="inline-flex items-center gap-2 h-11 px-8 rounded-[8px] bg-[#0BD904] text-[#0D0D0D] text-[15px] font-bold hover:bg-[#09C803] disabled:opacity-60 transition-colors"
            >
              <CheckCircle size={18} />
              {isPending ? 'Confirmando…' : 'Aprovar Proposta'}
            </button>
          </div>
        )}

        {approved && (
          <div className="bg-[#F0FDF4] border border-[rgba(11,217,4,0.3)] rounded-[12px] p-6 text-center">
            <CheckCircle size={32} className="text-[#0BD904] mx-auto mb-3" />
            <p className="text-[16px] font-bold text-[#0D0D0D]">Proposta aprovada!</p>
            <p className="text-[13px] text-[#6B7280] mt-1">Seu corretor entrará em contato em breve.</p>
          </div>
        )}

        {quote.notes && (
          <div className="mt-6 text-center">
            <p className="text-[12px] text-[#9CA3AF] italic">{quote.notes}</p>
          </div>
        )}
      </div>
    </div>
  )
}
