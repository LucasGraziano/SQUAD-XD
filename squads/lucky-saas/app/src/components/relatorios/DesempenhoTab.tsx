'use client'

import { useState, useEffect } from 'react'
import { KPICard } from './KPICard'
import { getOperationalMetrics } from '@/app/actions/relatorios'
import type { OperationalMetrics } from '@/app/actions/relatorios'
import { cn } from '@/lib/utils/cn'

type Period = '3m' | '6m' | '12m'

function formatBRL(n: number) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatMonth(ym: string) {
  const [year, month] = ym.split('-')
  return new Date(Number(year), Number(month) - 1, 1).toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' })
}

export function DesempenhoTab() {
  const [period, setPeriod] = useState<Period>('12m')
  const [metrics, setMetrics] = useState<OperationalMetrics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getOperationalMetrics(period).then(m => {
      setMetrics(m)
      setLoading(false)
    })
  }, [period])

  const periods: { id: Period; label: string }[] = [
    { id: '3m', label: 'Últimos 3m' },
    { id: '6m', label: 'Últimos 6m' },
    { id: '12m', label: 'Últimos 12m' },
  ]

  return (
    <div>
      {/* Period selector */}
      <div className="flex justify-end mb-6">
        <div className="flex items-center gap-1 bg-white border border-[#E5E5E5] rounded-[6px] p-0.5">
          {periods.map(p => (
            <button
              key={p.id}
              onClick={() => setPeriod(p.id)}
              className={cn(
                'px-3 py-1.5 rounded-[4px] text-[12px] font-medium transition-colors',
                period === p.id ? 'bg-[#0D0D0D] text-white' : 'text-[#6B7280] hover:text-[#0D0D0D]'
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {loading || !metrics ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-[13px] text-[#9CA3AF]">Calculando métricas...</p>
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <KPICard
              label="Taxa de Emissão"
              value={`${metrics.emissionRate.current}`}
              unit="%"
              currentRaw={metrics.emissionRate.current}
              previousRaw={metrics.emissionRate.previous}
              description="propostas → apólices"
            />
            <KPICard
              label="Renovação"
              value={`${metrics.renewalRate.current}`}
              unit="%"
              currentRaw={metrics.renewalRate.current}
              previousRaw={metrics.renewalRate.previous}
              description="apólices vencidas renovadas"
            />
            <KPICard
              label="Ticket Médio"
              value={formatBRL(metrics.avgTicket.current)}
              currentRaw={metrics.avgTicket.current}
              previousRaw={metrics.avgTicket.previous}
              description="prêmio médio por apólice"
            />
            <KPICard
              label="Novas Apólices"
              value={String(metrics.monthlyData.reduce((s, m) => s + m.newPolicies, 0))}
              currentRaw={metrics.monthlyData.reduce((s, m) => s + m.newPolicies, 0)}
              previousRaw={0}
              description={`no período de ${period}`}
            />
          </div>

          {/* Monthly evolution chart */}
          {metrics.monthlyData.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-[8px] border border-[#E5E5E5] p-5">
                <p className="text-[13px] font-semibold text-[#0D0D0D] mb-4">Novas Apólices por Mês</p>
                <div className="flex items-end gap-2 h-[100px]">
                  {metrics.monthlyData.map(m => {
                    const maxVal = Math.max(...metrics.monthlyData.map(d => d.newPolicies), 1)
                    const h = Math.max(4, (m.newPolicies / maxVal) * 92)
                    return (
                      <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                        <span className="text-[10px] font-semibold text-[#0D0D0D]">{m.newPolicies}</span>
                        <div className="w-full bg-[#0BD904] rounded-t-[2px]" style={{ height: `${h}px` }} />
                        <span className="text-[9px] text-[#9CA3AF]">{formatMonth(m.month)}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="bg-white rounded-[8px] border border-[#E5E5E5] p-5">
                <p className="text-[13px] font-semibold text-[#0D0D0D] mb-4">Ticket Médio Mensal</p>
                <div className="flex items-end gap-2 h-[100px]">
                  {metrics.monthlyData.map(m => {
                    const maxVal = Math.max(...metrics.monthlyData.map(d => d.avgTicket), 1)
                    const h = Math.max(4, (m.avgTicket / maxVal) * 92)
                    return (
                      <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full bg-[#D97706] rounded-t-[2px]" style={{ height: `${h}px` }} />
                        <span className="text-[9px] text-[#9CA3AF]">{formatMonth(m.month)}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
