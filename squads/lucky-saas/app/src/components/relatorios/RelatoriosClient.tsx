'use client'

import { useState, useMemo } from 'react'
import { Download } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { RAMO_LABELS } from '@/types/policy'
import type { PolicyRow } from '@/types/policy'
import { exportToCsv } from '@/lib/export-csv'
import { DesempenhoTab } from './DesempenhoTab'

type Tab = 'carteira' | 'comissoes' | 'retencao' | 'seguradora' | 'desempenho'
type Period = '3m' | '6m' | '12m'

function formatBRL(n: number) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatMonth(ym: string) {
  const [year, month] = ym.split('-')
  const date = new Date(Number(year), Number(month) - 1, 1)
  return date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' })
}

function BarRow({ label, value, max, secondary }: { label: string; value: number; max: number; secondary?: string }) {
  const pct = max > 0 ? Math.max(4, (value / max) * 100) : 0
  return (
    <div className="flex items-center gap-3">
      <div className="w-[120px] shrink-0 text-[13px] font-medium text-[#0D0D0D] truncate">{label}</div>
      <div className="flex-1 h-5 bg-[#F3F4F6] rounded-[3px] overflow-hidden">
        <div className="h-full bg-[#0BD904] rounded-[3px] transition-all" style={{ width: `${pct}%` }} />
      </div>
      <div className="w-[90px] text-right">
        <span className="text-[13px] font-semibold font-mono text-[#0D0D0D]">{formatBRL(value)}</span>
        {secondary && <span className="block text-[11px] text-[#9CA3AF]">{secondary}</span>}
      </div>
    </div>
  )
}

function SummaryCard({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: boolean }) {
  return (
    <div className="bg-white rounded-[8px] border border-[#E5E5E5] p-5">
      <p className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wide mb-2">{label}</p>
      <p className={cn('text-[22px] font-bold leading-none font-mono', accent ? 'text-[#0BD904]' : 'text-[#0D0D0D]')}>
        {value}
      </p>
      {sub && <p className="text-[12px] text-[#9CA3AF] mt-1.5">{sub}</p>}
    </div>
  )
}

interface Props {
  policies: PolicyRow[]
}

export function RelatoriosClient({ policies }: Props) {
  const [tab, setTab] = useState<Tab>('carteira')
  const [period, setPeriod] = useState<Period>('12m')

  const cutoff = useMemo(() => {
    const d = new Date()
    if (period === '3m') d.setMonth(d.getMonth() - 3)
    else if (period === '6m') d.setMonth(d.getMonth() - 6)
    else d.setFullYear(d.getFullYear() - 1)
    return d.toISOString().split('T')[0]
  }, [period])

  const filtered = useMemo(
    () => policies.filter(p => p.start_date >= cutoff),
    [policies, cutoff]
  )

  // ── Carteira ─────────────────────────────────────────────────────────────
  const byStatus = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const p of policies) counts[p.status] = (counts[p.status] ?? 0) + 1
    return counts
  }, [policies])

  const byRamo = useMemo(() => {
    const agg: Record<string, { count: number; premium: number }> = {}
    for (const p of filtered) {
      if (!agg[p.ramo]) agg[p.ramo] = { count: 0, premium: 0 }
      agg[p.ramo].count++
      agg[p.ramo].premium += p.premium_total ?? 0
    }
    return Object.entries(agg).sort((a, b) => b[1].count - a[1].count)
  }, [filtered])

  const monthlyEvolution = useMemo(() => {
    const months: Record<string, { count: number; premium: number }> = {}
    for (const p of filtered) {
      const m = p.start_date.slice(0, 7)
      if (!months[m]) months[m] = { count: 0, premium: 0 }
      months[m].count++
      months[m].premium += p.premium_total ?? 0
    }
    return Object.entries(months).sort(([a], [b]) => a.localeCompare(b)).slice(-12)
  }, [filtered])

  // ── Comissões ─────────────────────────────────────────────────────────────
  const monthlyComm = useMemo(() => {
    const months: Record<string, number> = {}
    for (const p of filtered) {
      const m = p.start_date.slice(0, 7)
      months[m] = (months[m] ?? 0) + (p.commission_expected ?? 0)
    }
    return Object.entries(months).sort(([a], [b]) => a.localeCompare(b)).slice(-12)
  }, [filtered])

  const forecast = useMemo(() => {
    const now = new Date().toISOString().split('T')[0]
    const in90 = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    const months: Record<string, number> = {}
    for (const p of policies) {
      if (p.status === 'ativa' && p.end_date >= now && p.end_date <= in90) {
        const m = p.end_date.slice(0, 7)
        months[m] = (months[m] ?? 0) + (p.commission_expected ?? 0)
      }
    }
    return Object.entries(months).sort(([a], [b]) => a.localeCompare(b))
  }, [policies])

  const currentMonth = new Date().toISOString().slice(0, 7)
  const nextMonth = (() => {
    const d = new Date(); d.setMonth(d.getMonth() + 1)
    return d.toISOString().slice(0, 7)
  })()

  const revenueMTD = monthlyComm.find(([m]) => m === currentMonth)?.[1] ?? 0
  const forecastNextMonth = forecast.find(([m]) => m === nextMonth)?.[1] ?? 0
  const totalCommYear = monthlyComm.reduce((s, [, v]) => s + v, 0)
  const totalForecastYear = forecast.reduce((s, [, v]) => s + v, 0)

  // ── Retenção ──────────────────────────────────────────────────────────────
  const retencaoByRamo = useMemo(() => {
    const agg: Record<string, { active: number; total: number }> = {}
    for (const p of filtered) {
      if (!agg[p.ramo]) agg[p.ramo] = { active: 0, total: 0 }
      agg[p.ramo].total++
      if (p.status === 'ativa') agg[p.ramo].active++
    }
    return Object.entries(agg)
      .map(([ramo, d]) => ({ ramo, rate: d.total > 0 ? (d.active / d.total) * 100 : 0, ...d }))
      .sort((a, b) => b.rate - a.rate)
  }, [filtered])

  const overallRetention = useMemo(() => {
    const total = policies.length
    const active = policies.filter(p => p.status === 'ativa').length
    return total > 0 ? (active / total) * 100 : 0
  }, [policies])

  const bestRamo = useMemo(() => {
    const agg: Record<string, number> = {}
    for (const p of policies) if (p.status === 'ativa') agg[p.ramo] = (agg[p.ramo] ?? 0) + 1
    const top = Object.entries(agg).sort((a, b) => b[1] - a[1])[0]
    return top ? RAMO_LABELS[top[0]] ?? top[0] : '—'
  }, [policies])

  // ── Seguradora ────────────────────────────────────────────────────────────
  const seguradoras = useMemo(() => {
    const agg: Record<string, { count: number; premium: number; commission: number }> = {}
    for (const p of filtered) {
      if (!agg[p.seguradora]) agg[p.seguradora] = { count: 0, premium: 0, commission: 0 }
      agg[p.seguradora].count++
      agg[p.seguradora].premium += p.premium_total ?? 0
      agg[p.seguradora].commission += p.commission_expected ?? 0
    }
    return Object.entries(agg).sort((a, b) => b[1].commission - a[1].commission)
  }, [filtered])

  const maxCommSeg = seguradoras[0]?.[1].commission ?? 0

  // ── CSV handlers ─────────────────────────────────────────────────────────
  function handleExport() {
    if (tab === 'carteira') {
      exportToCsv(`carteira-${period}.csv`, byRamo.map(([ramo, d]) => ({
        Ramo: RAMO_LABELS[ramo] ?? ramo,
        Apólices: d.count,
        'Prêmio Total': d.premium.toFixed(2),
      })))
    } else if (tab === 'comissoes') {
      exportToCsv(`comissoes-${period}.csv`, [
        ...monthlyComm.map(([m, v]) => ({ Mês: m, Tipo: 'Realizado', 'Comissão': v.toFixed(2) })),
        ...forecast.map(([m, v]) => ({ Mês: m, Tipo: 'Forecast', 'Comissão': v.toFixed(2) })),
      ])
    } else if (tab === 'retencao') {
      exportToCsv(`retencao-${period}.csv`, retencaoByRamo.map(d => ({
        Ramo: RAMO_LABELS[d.ramo] ?? d.ramo,
        Ativas: d.active,
        Total: d.total,
        'Taxa %': d.rate.toFixed(1),
      })))
    } else {
      exportToCsv(`seguradoras-${period}.csv`, seguradoras.map(([seg, d]) => ({
        Seguradora: seg,
        Apólices: d.count,
        'Prêmio Total': d.premium.toFixed(2),
        Comissão: d.commission.toFixed(2),
      })))
    }
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'carteira', label: 'Carteira' },
    { id: 'comissoes', label: 'Comissões' },
    { id: 'retencao', label: 'Retenção' },
    { id: 'seguradora', label: 'Seguradora' },
    { id: 'desempenho', label: 'Desempenho' },
  ]

  const periods: { id: Period; label: string }[] = [
    { id: '3m', label: 'Últimos 3m' },
    { id: '6m', label: 'Últimos 6m' },
    { id: '12m', label: 'Últimos 12m' },
  ]

  return (
    <div>
      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <SummaryCard
          label="Receita Realizada MTD"
          value={formatBRL(revenueMTD)}
          sub="comissões este mês"
          accent
        />
        <SummaryCard
          label="Forecast Próximo Mês"
          value={formatBRL(forecastNextMonth)}
          sub="renovações esperadas"
        />
        <SummaryCard
          label="Melhor Ramo"
          value={bestRamo}
          sub="maior carteira ativa"
        />
        <SummaryCard
          label="Taxa de Retenção"
          value={`${overallRetention.toFixed(0)}%`}
          sub={`${policies.filter(p => p.status === 'ativa').length} de ${policies.length} ativas`}
        />
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1 bg-white rounded-[6px] border border-[#E5E5E5] p-1">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                'px-4 py-1.5 rounded-[4px] text-[13px] font-medium transition-colors',
                tab === t.id
                  ? 'bg-[#0BD904] text-[#0D0D0D]'
                  : 'text-[#6B7280] hover:text-[#0D0D0D]'
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-white rounded-[6px] border border-[#E5E5E5] p-1">
            {periods.map(p => (
              <button
                key={p.id}
                onClick={() => setPeriod(p.id)}
                className={cn(
                  'px-3 py-1.5 rounded-[4px] text-[12px] font-medium transition-colors',
                  period === p.id
                    ? 'bg-[#0D0D0D] text-white'
                    : 'text-[#6B7280] hover:text-[#0D0D0D]'
                )}
              >
                {p.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-[6px] border border-[#D1D1D1] bg-white text-[13px] font-medium text-[#6B7280] hover:text-[#0D0D0D] hover:border-[#0D0D0D] transition-colors"
          >
            <Download size={14} />
            CSV
          </button>
        </div>
      </div>

      {/* Tab panels */}
      {tab === 'carteira' && (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-[8px] border border-[#E5E5E5] p-5">
            <p className="text-[14px] font-semibold text-[#0D0D0D] mb-1">Status da Carteira</p>
            <p className="text-[12px] text-[#9CA3AF] mb-4">Total: todos os períodos</p>
            <div className="space-y-2">
              {[
                { key: 'ativa', label: 'Ativas', color: '#0BD904' },
                { key: 'vencida', label: 'Vencidas', color: '#D97706' },
                { key: 'cancelada', label: 'Canceladas', color: '#EF4444' },
                { key: 'renovada', label: 'Renovadas', color: '#6B7280' },
                { key: 'suspensa', label: 'Suspensas', color: '#9CA3AF' },
              ].map(({ key, label, color }) => {
                const count = byStatus[key] ?? 0
                const total = policies.length
                const pct = total > 0 ? (count / total) * 100 : 0
                return (
                  <div key={key} className="flex items-center gap-3">
                    <span className="w-[90px] text-[13px] text-[#6B7280] shrink-0">{label}</span>
                    <div className="flex-1 h-4 bg-[#F3F4F6] rounded-[3px] overflow-hidden">
                      <div className="h-full rounded-[3px]" style={{ width: `${pct}%`, backgroundColor: color }} />
                    </div>
                    <span className="w-8 text-right text-[13px] font-semibold text-[#0D0D0D] font-mono">{count}</span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="bg-white rounded-[8px] border border-[#E5E5E5] p-5">
            <p className="text-[14px] font-semibold text-[#0D0D0D] mb-1">Apólices por Ramo</p>
            <p className="text-[12px] text-[#9CA3AF] mb-4">Período: {period}</p>
            {byRamo.length === 0 ? (
              <p className="text-[13px] text-[#9CA3AF] py-8 text-center">Nenhum dado no período.</p>
            ) : (
              <div className="space-y-3">
                {byRamo.map(([ramo, d]) => {
                  const max = byRamo[0][1].count
                  const pct = max > 0 ? Math.max(4, (d.count / max) * 100) : 0
                  return (
                    <div key={ramo} className="flex items-center gap-3">
                      <span className="w-[90px] text-[13px] font-medium text-[#0D0D0D] truncate shrink-0">
                        {RAMO_LABELS[ramo] ?? ramo}
                      </span>
                      <div className="flex-1 h-4 bg-[#F3F4F6] rounded-[3px] overflow-hidden">
                        <div className="h-full bg-[#0BD904] rounded-[3px]" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="w-8 text-right text-[13px] font-semibold text-[#0D0D0D] font-mono">{d.count}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <div className="col-span-2 bg-white rounded-[8px] border border-[#E5E5E5] p-5">
            <p className="text-[14px] font-semibold text-[#0D0D0D] mb-4">Evolução Mensal (novas apólices)</p>
            {monthlyEvolution.length === 0 ? (
              <p className="text-[13px] text-[#9CA3AF] py-4 text-center">Nenhum dado no período.</p>
            ) : (
              <div className="flex items-end gap-2 h-[120px]">
                {monthlyEvolution.map(([m, d]) => {
                  const maxCount = Math.max(...monthlyEvolution.map(([, x]) => x.count), 1)
                  const h = Math.max(8, (d.count / maxCount) * 100)
                  return (
                    <div key={m} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-[11px] font-semibold text-[#0D0D0D]">{d.count}</span>
                      <div className="w-full bg-[#0BD904] rounded-t-[3px]" style={{ height: `${h}px` }} />
                      <span className="text-[10px] text-[#9CA3AF]">{formatMonth(m)}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'comissoes' && (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-[8px] border border-[#E5E5E5] p-5">
            <p className="text-[14px] font-semibold text-[#0D0D0D] mb-1">Comissões Realizadas</p>
            <p className="text-[12px] text-[#9CA3AF] mb-2">Por mês de emissão — período: {period}</p>
            <p className="text-[24px] font-bold text-[#0BD904] font-mono mb-4">{formatBRL(totalCommYear)}</p>
            {monthlyComm.length === 0 ? (
              <p className="text-[13px] text-[#9CA3AF] py-4 text-center">Nenhum dado no período.</p>
            ) : (
              <div className="space-y-2">
                {monthlyComm.map(([m, v]) => (
                  <BarRow
                    key={m}
                    label={formatMonth(m)}
                    value={v}
                    max={Math.max(...monthlyComm.map(([, x]) => x), 1)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-[8px] border border-[#E5E5E5] p-5">
            <p className="text-[14px] font-semibold text-[#0D0D0D] mb-1">Forecast — Próximos 3 Meses</p>
            <p className="text-[12px] text-[#9CA3AF] mb-2">Renovações esperadas × comissão</p>
            <p className="text-[24px] font-bold text-[#0D0D0D] font-mono mb-4">{formatBRL(totalForecastYear)}</p>
            {forecast.length === 0 ? (
              <p className="text-[13px] text-[#9CA3AF] py-8 text-center">
                Nenhuma renovação esperada nos próximos 90 dias.
              </p>
            ) : (
              <div className="space-y-4">
                {forecast.map(([m, v]) => (
                  <div key={m} className="flex items-center justify-between p-3 rounded-[6px] bg-[#F9FFF9] border border-[rgba(11,217,4,0.2)]">
                    <div>
                      <p className="text-[13px] font-semibold text-[#0D0D0D]">{formatMonth(m)}</p>
                      <p className="text-[11px] text-[#9CA3AF]">
                        {policies.filter(p => p.status === 'ativa' && p.end_date.slice(0, 7) === m).length} renovações
                      </p>
                    </div>
                    <p className="text-[18px] font-bold text-[#0BD904] font-mono">{formatBRL(v)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'retencao' && (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-[8px] border border-[#E5E5E5] p-5">
            <p className="text-[14px] font-semibold text-[#0D0D0D] mb-4">Retenção por Ramo</p>
            {retencaoByRamo.length === 0 ? (
              <p className="text-[13px] text-[#9CA3AF] py-8 text-center">Nenhum dado no período.</p>
            ) : (
              <div className="space-y-4">
                {retencaoByRamo.map(d => (
                  <div key={d.ramo}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[13px] font-medium text-[#0D0D0D]">
                        {RAMO_LABELS[d.ramo] ?? d.ramo}
                      </span>
                      <span className={cn(
                        'text-[13px] font-bold font-mono',
                        d.rate >= 70 ? 'text-[#0BD904]' : d.rate >= 40 ? 'text-[#D97706]' : 'text-[#EF4444]'
                      )}>
                        {d.rate.toFixed(0)}%
                      </span>
                    </div>
                    <div className="h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
                      <div
                        className={cn('h-full rounded-full', d.rate >= 70 ? 'bg-[#0BD904]' : d.rate >= 40 ? 'bg-[#D97706]' : 'bg-[#EF4444]')}
                        style={{ width: `${d.rate}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-[#9CA3AF] mt-1">{d.active} ativas / {d.total} total</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-[8px] border border-[#E5E5E5] p-5 flex flex-col items-center justify-center">
            <p className="text-[13px] font-semibold text-[#6B7280] uppercase tracking-wide mb-4">Retenção Geral</p>
            <div className="relative w-[140px] h-[140px] mb-4">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#F3F4F6" strokeWidth="12" />
                <circle
                  cx="50" cy="50" r="40" fill="none"
                  stroke="#0BD904" strokeWidth="12"
                  strokeDasharray={`${overallRetention * 2.51} 251`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-[26px] font-bold text-[#0D0D0D]">{overallRetention.toFixed(0)}%</p>
              </div>
            </div>
            <p className="text-[13px] text-[#6B7280]">
              {policies.filter(p => p.status === 'ativa').length} ativas de {policies.length} total
            </p>
          </div>
        </div>
      )}

      {tab === 'seguradora' && (
        <div className="bg-white rounded-[8px] border border-[#E5E5E5] p-5">
          <p className="text-[14px] font-semibold text-[#0D0D0D] mb-4">Ranking por Seguradora</p>
          {seguradoras.length === 0 ? (
            <p className="text-[13px] text-[#9CA3AF] py-8 text-center">Nenhum dado no período.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#E5E5E5]">
                    {['#', 'Seguradora', 'Apólices', 'Prêmio Total', 'Comissão Gerada'].map(h => (
                      <th key={h} className="px-4 py-2.5 text-left text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                    <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider w-[120px]">
                      Participação
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {seguradoras.map(([seg, d], i) => {
                    const pct = maxCommSeg > 0 ? (d.commission / maxCommSeg) * 100 : 0
                    return (
                      <tr key={seg} className="border-b border-[#F3F4F6] hover:bg-[#FAFAFA] transition-colors">
                        <td className="px-4 py-3 text-[13px] text-[#9CA3AF] font-mono">{i + 1}</td>
                        <td className="px-4 py-3 text-[13px] font-medium text-[#0D0D0D]">{seg}</td>
                        <td className="px-4 py-3 text-[13px] text-[#6B7280]">{d.count}</td>
                        <td className="px-4 py-3 text-[13px] font-mono text-[#0D0D0D]">{formatBRL(d.premium)}</td>
                        <td className="px-4 py-3 text-[13px] font-mono font-semibold text-[#0BD904]">{formatBRL(d.commission)}</td>
                        <td className="px-4 py-3">
                          <div className="h-2 bg-[#F3F4F6] rounded-full overflow-hidden w-full">
                            <div className="h-full bg-[#0BD904] rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {tab === 'desempenho' && <DesempenhoTab />}
    </div>
  )
}
