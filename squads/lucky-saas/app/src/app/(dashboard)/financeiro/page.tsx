'use client'

import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/layout/page-header'
import { TrendingUp, DollarSign, Calendar, Shield } from 'lucide-react'
import { RAMO_LABELS } from '@/types/policy'
import { ExtratoTab } from '@/components/financeiro/ExtratoTab'
import { cn } from '@/lib/utils/cn'
import { createClient } from '@/lib/supabase/client'

function formatBRL(n: number) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(dateStr + 'T12:00:00'))
}

function daysTo(dateStr: string) {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
}

type PolicyRow = {
  id: string
  ramo: string
  seguradora: string
  end_date: string
  premium_total: number
  commission_pct: number
  commission_expected: number
  status: string
  clients: { name: string } | null
}

type Tab = 'previsao' | 'extrato'

export default function FinanceiroPage() {
  const [policies, setPolicies] = useState<PolicyRow[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<Tab>('previsao')

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { setLoading(false); return }
      const { data: broker } = await supabase.from('brokers').select('id').eq('user_id', user.id).single()
      if (!broker) { setLoading(false); return }
      const today = new Date().toISOString().split('T')[0]
      const { data } = await supabase
        .from('policies')
        .select('id, ramo, seguradora, end_date, premium_total, commission_pct, commission_expected, status, clients(name)')
        .eq('broker_id', (broker as { id: string }).id)
        .gte('end_date', today)
        .eq('status', 'ativa')
        .order('end_date', { ascending: true })
      setPolicies((data ?? []) as PolicyRow[])
      setLoading(false)
    })
  }, [])

  const totalPremium = policies.reduce((s, p) => s + (p.premium_total ?? 0), 0)
  const totalCommission = policies.reduce((s, p) => s + (p.commission_expected ?? p.premium_total * p.commission_pct / 100), 0)

  const in30Days = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  const in90Days = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  const next30 = policies.filter(p => p.end_date <= in30Days)
  const next90 = policies.filter(p => p.end_date <= in90Days)
  const commNext30 = next30.reduce((s, p) => s + (p.commission_expected ?? p.premium_total * p.commission_pct / 100), 0)

  const byRamo = policies.reduce<Record<string, { count: number; premium: number; commission: number }>>((acc, p) => {
    if (!acc[p.ramo]) acc[p.ramo] = { count: 0, premium: 0, commission: 0 }
    acc[p.ramo].count++
    acc[p.ramo].premium += p.premium_total ?? 0
    acc[p.ramo].commission += p.commission_expected ?? p.premium_total * p.commission_pct / 100
    return acc
  }, {})
  const ramoRows = Object.entries(byRamo).sort((a, b) => b[1].commission - a[1].commission)

  const TABS: { id: Tab; label: string }[] = [
    { id: 'previsao', label: 'Previsão' },
    { id: 'extrato', label: 'Extrato de Comissões' },
  ]

  return (
    <>
      <PageHeader
        title="Financeiro"
        subtitle={!loading ? `${policies.length} apólice${policies.length !== 1 ? 's' : ''} ativa${policies.length !== 1 ? 's' : ''} · ${formatBRL(totalCommission)} em comissões` : undefined}
      />
      <div className="flex-1 p-8">

        {/* Metric cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-[8px] border border-[#E5E5E5] p-5">
            <div className="flex items-center gap-2 mb-3">
              <Shield size={14} className="text-[#6B7280]" />
              <p className="text-[12px] font-semibold text-[#6B7280] uppercase tracking-wide">Carteira Ativa</p>
            </div>
            <p className="text-[28px] font-bold text-[#0D0D0D] leading-none font-mono">{policies.length}</p>
            <p className="text-[12px] text-[#9CA3AF] mt-2">apólices vigentes</p>
          </div>
          <div className="bg-white rounded-[8px] border border-[#E5E5E5] p-5">
            <div className="flex items-center gap-2 mb-3">
              <DollarSign size={14} className="text-[#0BD904]" />
              <p className="text-[12px] font-semibold text-[#6B7280] uppercase tracking-wide">Prêmios Ativos</p>
            </div>
            <p className="text-[22px] font-bold text-[#0D0D0D] leading-none font-mono">{formatBRL(totalPremium)}</p>
            <p className="text-[12px] text-[#9CA3AF] mt-2">em carteira ativa</p>
          </div>
          <div className="bg-white rounded-[8px] border border-[#E5E5E5] p-5">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={14} className="text-[#0BD904]" />
              <p className="text-[12px] font-semibold text-[#6B7280] uppercase tracking-wide">Comissões</p>
            </div>
            <p className="text-[22px] font-bold text-[#0BD904] leading-none font-mono">{formatBRL(totalCommission)}</p>
            <p className="text-[12px] text-[#9CA3AF] mt-2">esperadas (carteira ativa)</p>
          </div>
          <div className="bg-white rounded-[8px] border border-[#E5E5E5] p-5">
            <div className="flex items-center gap-2 mb-3">
              <Calendar size={14} className="text-[#D97706]" />
              <p className="text-[12px] font-semibold text-[#6B7280] uppercase tracking-wide">Próximos 30d</p>
            </div>
            <p className="text-[22px] font-bold text-[#D97706] leading-none font-mono">{formatBRL(commNext30)}</p>
            <p className="text-[12px] text-[#9CA3AF] mt-2">{next30.length} renovações</p>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex gap-0 border-b border-[#E5E5E5] mb-6">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'px-5 py-2.5 text-[13px] font-medium border-b-2 transition-colors',
                activeTab === tab.id
                  ? 'border-[#0BD904] text-[#0D0D0D]'
                  : 'border-transparent text-[#6B7280] hover:text-[#0D0D0D]'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Previsão tab */}
        {activeTab === 'previsao' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Breakdown por ramo */}
              <div className="bg-white rounded-[8px] border border-[#E5E5E5] p-5">
                <p className="text-[14px] font-semibold text-[#0D0D0D] mb-4">Comissões por Ramo</p>
                {ramoRows.length === 0 ? (
                  <p className="text-[13px] text-[#9CA3AF] py-8 text-center">Nenhuma apólice ativa cadastrada.</p>
                ) : (
                  <div className="space-y-3">
                    {ramoRows.map(([ramo, data]) => {
                      const pct = totalCommission > 0 ? (data.commission / totalCommission) * 100 : 0
                      return (
                        <div key={ramo}>
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[13px] font-medium text-[#0D0D0D]">{RAMO_LABELS[ramo] ?? ramo}</span>
                              <span className="text-[11px] text-[#9CA3AF]">{data.count} apólice{data.count !== 1 ? 's' : ''}</span>
                            </div>
                            <span className="text-[13px] font-semibold text-[#0D0D0D] font-mono">{formatBRL(data.commission)}</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-[#F3F4F6]">
                            <div className="h-full rounded-full bg-[#0BD904]" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Próximas renovações */}
              <div className="bg-white rounded-[8px] border border-[#E5E5E5] p-5">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[14px] font-semibold text-[#0D0D0D]">Renovações nos Próx. 90d</p>
                  <span className="text-[12px] text-[#6B7280]">{next90.length} apólices</span>
                </div>
                {next90.length === 0 ? (
                  <p className="text-[13px] text-[#9CA3AF] py-8 text-center">Nenhuma renovação nos próximos 90 dias.</p>
                ) : (
                  <div className="space-y-2">
                    {next90.slice(0, 8).map(p => {
                      const days = daysTo(p.end_date)
                      const comm = p.commission_expected ?? p.premium_total * p.commission_pct / 100
                      return (
                        <div key={p.id} className="flex items-center justify-between py-2 border-b border-[#F3F4F6] last:border-0">
                          <div className="min-w-0 flex-1">
                            <p className="text-[13px] font-medium text-[#0D0D0D] truncate">{p.clients?.name ?? '—'}</p>
                            <p className="text-[11px] text-[#9CA3AF]">{RAMO_LABELS[p.ramo] ?? p.ramo} · {p.seguradora} · {formatDate(p.end_date)}</p>
                          </div>
                          <div className="flex items-center gap-3 ml-3 shrink-0">
                            <span className="font-mono text-[12px] font-semibold text-[#0BD904]">{formatBRL(comm)}</span>
                            <span className={`px-2 py-0.5 rounded-[4px] text-[11px] font-bold ${days <= 7 ? 'bg-[#FEE2E2] text-[#DC2626]' : days <= 30 ? 'bg-[#FEF3C7] text-[#D97706]' : 'bg-[#F3F4F6] text-[#6B7280]'}`}>{days}d</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Tabela por seguradora */}
            {ramoRows.length > 0 && (
              <div className="bg-white rounded-[8px] border border-[#E5E5E5] p-5">
                <p className="text-[14px] font-semibold text-[#0D0D0D] mb-4">Resumo por Seguradora</p>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#E5E5E5]">
                        {['Seguradora', 'Ramo', 'Apólices', 'Prêmio Total', 'Comissão Esp.', '% Méd.'].map(h => (
                          <th key={h} className="px-4 py-2.5 text-left text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(
                        policies.reduce<Record<string, { ramos: Set<string>; count: number; premium: number; commission: number; pctSum: number }>>((acc, p) => {
                          const key = p.seguradora
                          if (!acc[key]) acc[key] = { ramos: new Set(), count: 0, premium: 0, commission: 0, pctSum: 0 }
                          acc[key].ramos.add(p.ramo)
                          acc[key].count++
                          acc[key].premium += p.premium_total ?? 0
                          acc[key].commission += p.commission_expected ?? p.premium_total * p.commission_pct / 100
                          acc[key].pctSum += p.commission_pct ?? 0
                          return acc
                        }, {})
                      ).sort((a, b) => b[1].commission - a[1].commission).map(([seg, data]) => (
                        <tr key={seg} className="border-b border-[#F3F4F6] hover:bg-[#FAFAFA]">
                          <td className="px-4 py-3 text-[13px] font-medium text-[#0D0D0D]">{seg}</td>
                          <td className="px-4 py-3"><div className="flex flex-wrap gap-1">{Array.from(data.ramos).map(r => (<span key={r} className="px-1.5 py-0.5 rounded-[3px] bg-[rgba(11,217,4,0.08)] text-[#034001] text-[10px] font-medium">{RAMO_LABELS[r] ?? r}</span>))}</div></td>
                          <td className="px-4 py-3 text-[13px] text-[#6B7280]">{data.count}</td>
                          <td className="px-4 py-3 text-[13px] font-mono text-[#0D0D0D]">{formatBRL(data.premium)}</td>
                          <td className="px-4 py-3 text-[13px] font-mono font-semibold text-[#0BD904]">{formatBRL(data.commission)}</td>
                          <td className="px-4 py-3 text-[13px] text-[#6B7280]">{(data.pctSum / data.count).toFixed(1)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Extrato tab */}
        {activeTab === 'extrato' && <ExtratoTab />}

      </div>
    </>
  )
}
