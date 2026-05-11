'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MessageCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { PendencyList } from '@/components/pendencies/PendencyList'
import { getPendencies } from '@/app/actions/pendencies'
import type { Pendency } from '@/app/actions/pendencies'
import type { Policy } from '@/types/policy'
import { RAMO_LABELS } from '@/types/policy'

function formatDate(s: string) {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(s + 'T12:00:00'))
}
function formatBRL(n: number) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}
function daysTo(s: string) {
  return Math.ceil((new Date(s).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
}

export default function ApoliceDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [policy, setPolicy] = useState<Policy & { clients?: { name: string; phone?: string | null } | null } | null>(null)
  const [pendencies, setPendencies] = useState<Pendency[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    Promise.all([
      supabase.from('policies').select('*, clients(name, phone)').eq('id', id).single(),
      getPendencies({ policyId: id }),
    ]).then(([{ data: p }, pends]) => {
      setPolicy(p as (Policy & { clients?: { name: string; phone?: string | null } | null }) | null)
      setPendencies(pends)
      setLoading(false)
    })
  }, [id])

  if (loading) {
    return <div className="flex-1 flex items-center justify-center"><p className="text-[13px] text-[#9CA3AF]">Carregando...</p></div>
  }
  if (!policy) {
    return <div className="flex-1 flex items-center justify-center"><p className="text-[13px] text-[#9CA3AF]">Apólice não encontrada.</p></div>
  }

  const days = daysTo(policy.end_date)
  const comm = policy.commission_expected ?? policy.premium_total * (policy.commission_pct / 100)

  return (
    <>
      <div className="sticky top-0 z-10 bg-[#F8F8F8] border-b border-[#E5E5E5] px-8 py-4">
        <Link href="/apolices" className="inline-flex items-center gap-1.5 text-[13px] text-[#6B7280] hover:text-[#0D0D0D] mb-3 transition-colors">
          <ArrowLeft size={13} />
          Voltar para Apólices
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-[4px] bg-[rgba(11,217,4,0.08)] text-[#034001] text-[11px] font-semibold uppercase">
                {RAMO_LABELS[policy.ramo] ?? policy.ramo}
              </span>
              <span className="text-[14px] font-semibold text-[#0D0D0D]">{policy.seguradora}</span>
              {policy.policy_number && (
                <span className="text-[13px] text-[#9CA3AF]">· #{policy.policy_number}</span>
              )}
            </div>
            {policy.clients && (
              <div className="flex items-center gap-3 text-[13px] text-[#6B7280]">
                <span>{policy.clients.name}</span>
                {policy.clients.phone && (
                  <a
                    href={`https://wa.me/55${policy.clients.phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:text-[#0BD904] transition-colors"
                  >
                    <MessageCircle size={12} />
                    WhatsApp
                  </a>
                )}
              </div>
            )}
          </div>
          <div className={`px-3 py-1 rounded-[6px] text-[12px] font-bold ${
            days < 0 ? 'bg-[#FEE2E2] text-[#DC2626]' :
            days <= 30 ? 'bg-[#FEF3C7] text-[#D97706]' :
            'bg-[#DCFCE7] text-[#16A34A]'
          }`}>
            {days < 0 ? 'Vencida' : days <= 30 ? `Vence em ${days}d` : 'Ativa'}
          </div>
        </div>
      </div>

      <div className="flex-1 p-8 space-y-6">
        {/* Summary cards */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Vigência', value: `${formatDate(policy.start_date)} → ${formatDate(policy.end_date)}` },
            { label: 'Prêmio Total', value: formatBRL(policy.premium_total) },
            { label: 'Comissão Esperada', value: formatBRL(comm) },
            { label: 'Freq. Pagamento', value: policy.payment_frequency ?? '—' },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white rounded-[8px] border border-[#E5E5E5] p-4">
              <p className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-2">{label}</p>
              <p className="text-[14px] font-semibold text-[#0D0D0D]">{value}</p>
            </div>
          ))}
        </div>

        {/* Notes */}
        {policy.notes && (
          <div className="bg-white rounded-[8px] border border-[#E5E5E5] p-5">
            <p className="text-[13px] font-semibold text-[#0D0D0D] mb-2">Observações</p>
            <p className="text-[13px] text-[#6B7280] whitespace-pre-wrap">{policy.notes}</p>
          </div>
        )}

        {/* Pendencies */}
        <PendencyList
          initialPendencies={pendencies}
          policyId={id}
        />
      </div>
    </>
  )
}
