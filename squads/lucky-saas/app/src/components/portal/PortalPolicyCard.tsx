'use client'

import { useState } from 'react'
import { ChevronDown, Phone, MessageCircle, RefreshCw, Check, AlertCircle } from 'lucide-react'
import { RAMO_LABELS, PAYMENT_LABELS, type PaymentFrequency } from '@/types/policy'

interface PortalPolicy {
  id: string
  ramo: string
  seguradora: string
  policy_number?: string | null
  start_date: string
  end_date: string
  premium_total: number
  payment_frequency: string
  status: string
  valor_franquia?: number | null
  metadata?: Record<string, string> | null
}

interface Props {
  policy: PortalPolicy
  isExpiring: boolean
  daysLeft: number
  token: string
  brokerWhatsappUrl: string | null
}

function formatDate(d: string) {
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(d + 'T12:00:00'))
}

function formatBRL(n: number) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function PortalPolicyCard({ policy, isExpiring, daysLeft, token, brokerWhatsappUrl }: Props) {
  const [expanded, setExpanded] = useState(false)
  const [renewalState, setRenewalState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  const meta = policy.metadata ?? {}
  const coberturas = meta.coberturas
    ? meta.coberturas.split(',').map(s => s.trim()).filter(Boolean)
    : []
  const sinistroTel = meta.sinistro_tel?.trim()
  const sinistroZap = meta.sinistro_zap?.trim()

  // Descrição do objeto segurado de acordo com o ramo
  let objetoDescricao: string | null = null
  if (policy.ramo === 'auto' && meta.modelo) {
    objetoDescricao = meta.placa ? `${meta.modelo} — ${meta.placa}` : meta.modelo
  } else if (policy.ramo === 'residencial' && meta.endereco) {
    objetoDescricao = meta.endereco
  } else if (policy.ramo === 'vida' && meta.capital_segurado) {
    objetoDescricao = `Capital: R$ ${meta.capital_segurado}`
  } else if (policy.ramo === 'empresarial' && meta.atividade) {
    objetoDescricao = meta.atividade
  }

  async function handleRenewalRequest() {
    if (renewalState !== 'idle') return
    setRenewalState('loading')
    try {
      const res = await fetch('/api/portal/renewal-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, policyId: policy.id }),
      })
      setRenewalState(res.ok ? 'done' : 'error')
    } catch {
      setRenewalState('error')
    }
  }

  return (
    <div className={`bg-white rounded-[8px] border p-4 ${isExpiring ? 'border-[#FDE68A]' : 'border-[#E5E5E5]'}`}>
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-[4px] bg-[rgba(11,217,4,0.08)] text-[#034001] text-[11px] font-semibold">
              {RAMO_LABELS[policy.ramo] ?? policy.ramo}
            </span>
            {isExpiring && (
              <span className="px-2 py-0.5 rounded-[4px] bg-[#FEF3C7] text-[#D97706] text-[11px] font-bold">
                Vence em {daysLeft}d
              </span>
            )}
          </div>
          <p className="text-[14px] font-medium text-[#0D0D0D]">{policy.seguradora}</p>
          {policy.policy_number && (
            <p className="text-[12px] text-[#9CA3AF] font-mono">#{policy.policy_number}</p>
          )}
        </div>
        <div className="text-right shrink-0">
          <p className="text-[14px] font-bold text-[#0D0D0D] font-mono">{formatBRL(policy.premium_total)}</p>
          <p className="text-[11px] text-[#9CA3AF]">
            prêmio {(PAYMENT_LABELS[policy.payment_frequency as PaymentFrequency] ?? policy.payment_frequency).toLowerCase()}
          </p>
        </div>
      </div>

      {/* Dates */}
      <div className="mt-2 pt-2 border-t border-[#F3F4F6] flex flex-col gap-0.5 text-[12px] text-[#6B7280]">
        <span>Início: {formatDate(policy.start_date)}</span>
        <span>Vencimento: {formatDate(policy.end_date)}</span>
      </div>

      {/* Toggle */}
      <button
        onClick={() => setExpanded(v => !v)}
        className="mt-2 flex items-center gap-1 text-[12px] text-[#0BD904] font-medium hover:underline"
      >
        <ChevronDown size={13} className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
        {expanded ? 'Ocultar detalhes' : 'Ver detalhes'}
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="mt-3 pt-3 border-t border-[#F3F4F6] space-y-4">

          {/* Objeto + franquia */}
          {(objetoDescricao || policy.valor_franquia) && (
            <div className="space-y-1.5">
              {objetoDescricao && (
                <div className="flex justify-between text-[13px]">
                  <span className="text-[#9CA3AF]">O que está segurado</span>
                  <span className="text-[#0D0D0D] font-medium text-right max-w-[55%]">{objetoDescricao}</span>
                </div>
              )}
              {policy.ramo === 'auto' && meta.placa && !meta.modelo && (
                <div className="flex justify-between text-[13px]">
                  <span className="text-[#9CA3AF]">Placa</span>
                  <span className="text-[#0D0D0D] font-mono font-medium">{meta.placa}</span>
                </div>
              )}
              {policy.valor_franquia && (
                <div className="flex justify-between text-[13px]">
                  <span className="text-[#9CA3AF]">Franquia</span>
                  <span className="text-[#0D0D0D] font-mono font-medium">{formatBRL(policy.valor_franquia)}</span>
                </div>
              )}
            </div>
          )}

          {/* Coberturas */}
          {coberturas.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wide mb-2">Coberturas incluídas</p>
              <div className="flex flex-wrap gap-1.5">
                {coberturas.map((c, i) => (
                  <span key={i} className="inline-flex items-center gap-1 px-2 py-1 rounded-[4px] bg-[rgba(11,217,4,0.08)] text-[#034001] text-[11px] font-medium">
                    <Check size={10} strokeWidth={2.5} />
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Sinistro */}
          <div>
            <p className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wide mb-2">Em caso de sinistro</p>
            {sinistroTel || sinistroZap ? (
              <div className="flex flex-col gap-2">
                {sinistroTel && (
                  <a
                    href={`tel:${sinistroTel.replace(/\D/g, '')}`}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-[6px] border border-[#E5E5E5] bg-[#F9FAFB] text-[13px] text-[#0D0D0D] font-medium hover:border-[#0BD904] transition-colors"
                  >
                    <Phone size={14} className="text-[#0BD904]" />
                    {sinistroTel}
                  </a>
                )}
                {sinistroZap && (
                  <a
                    href={`https://wa.me/55${sinistroZap.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-[6px] border border-[#E5E5E5] bg-[#F9FAFB] text-[13px] text-[#0D0D0D] font-medium hover:border-[#0BD904] transition-colors"
                  >
                    <MessageCircle size={14} className="text-[#25D366]" />
                    WhatsApp {sinistroZap}
                  </a>
                )}
              </div>
            ) : brokerWhatsappUrl ? (
              <a
                href={brokerWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-[6px] border border-[#E5E5E5] bg-[#F9FAFB] text-[13px] text-[#0D0D0D] font-medium hover:border-[#0BD904] transition-colors"
              >
                <MessageCircle size={14} className="text-[#25D366]" />
                Falar com meu corretor
              </a>
            ) : (
              <p className="text-[13px] text-[#6B7280]">Contate seu corretor para acionar o sinistro.</p>
            )}
          </div>

          {/* Renovação */}
          {isExpiring && (
            <div>
              <button
                onClick={handleRenewalRequest}
                disabled={renewalState === 'loading' || renewalState === 'done'}
                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-[6px] text-[13px] font-semibold transition-all ${
                  renewalState === 'done'
                    ? 'bg-[rgba(11,217,4,0.1)] text-[#034001] border border-[rgba(11,217,4,0.3)] cursor-default'
                    : renewalState === 'error'
                    ? 'bg-[#FEE2E2] text-[#DC2626] border border-[#FECACA]'
                    : 'bg-[#0BD904] text-[#0D0D0D] hover:bg-[#09c203] active:scale-[0.98]'
                } disabled:opacity-70`}
              >
                {renewalState === 'loading' && <RefreshCw size={14} className="animate-spin" />}
                {renewalState === 'done' && <Check size={14} />}
                {renewalState === 'error' && <AlertCircle size={14} />}
                {renewalState === 'idle' && 'Solicitar Renovação'}
                {renewalState === 'loading' && 'Enviando...'}
                {renewalState === 'done' && 'Solicitação enviada ao corretor'}
                {renewalState === 'error' && 'Erro — tente novamente'}
              </button>
              {renewalState === 'error' && (
                <button onClick={() => setRenewalState('idle')} className="w-full text-center text-[11px] text-[#DC2626] mt-1 hover:underline">
                  Tentar novamente
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
