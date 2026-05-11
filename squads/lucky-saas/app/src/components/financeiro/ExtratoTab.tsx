'use client'

import { useState, useEffect, useCallback } from 'react'
import { Download } from 'lucide-react'
import { CommissionRow } from './CommissionRow'
import { getCommissionStatement, getCommissionSummary, getMonthlyCommissionChart } from '@/app/actions/commission'
import type { CommissionEntry } from '@/app/actions/commission'
import { exportToCsv } from '@/lib/export-csv'
import { cn } from '@/lib/utils/cn'

function formatBRL(n: number) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function MonthlyChart({ data }: { data: { month: string; expected: number; received: number }[] }) {
  const maxVal = Math.max(...data.map(d => Math.max(d.expected, d.received)), 1)
  return (
    <div className="flex items-end gap-2 h-[80px] mt-3">
      {data.map(d => {
        const hExp = Math.max(4, (d.expected / maxVal) * 76)
        const hRec = Math.max(0, (d.received / maxVal) * 76)
        return (
          <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full flex items-end gap-0.5 justify-center" style={{ height: '76px' }}>
              <div title={`Esperado: ${formatBRL(d.expected)}`} className="flex-1 bg-[#E5E5E5] rounded-t-[2px]" style={{ height: `${hExp}px` }} />
              <div title={`Recebido: ${formatBRL(d.received)}`} className="flex-1 bg-[#0BD904] rounded-t-[2px]" style={{ height: `${hRec}px` }} />
            </div>
            <span className="text-[9px] text-[#9CA3AF]">{d.month.slice(5)}</span>
          </div>
        )
      })}
    </div>
  )
}

export function ExtratoTab() {
  const now = new Date()
  const defaultFrom = new Date(now.getFullYear(), now.getMonth() - 2, 1).toISOString().split('T')[0]
  const defaultTo = now.toISOString().split('T')[0]

  const [from, setFrom] = useState(defaultFrom)
  const [to, setTo] = useState(defaultTo)
  const [statusFilter, setStatusFilter] = useState('')
  const [entries, setEntries] = useState<CommissionEntry[]>([])
  const [summary, setSummary] = useState({ totalExpected: 0, totalReceived: 0, difference: 0, count: 0 })
  const [chartData, setChartData] = useState<{ month: string; expected: number; received: number }[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    const [stmt, summ, chart] = await Promise.all([
      getCommissionStatement({ from, to, commissionStatus: statusFilter || undefined }),
      getCommissionSummary({ from, to }),
      getMonthlyCommissionChart({ months: 6 }),
    ])
    setEntries(stmt)
    setSummary(summ)
    setChartData(chart)
    setLoading(false)
  }, [from, to, statusFilter])

  useEffect(() => { load() }, [load])

  function handleExport() {
    exportToCsv('extrato-comissoes.csv', entries.map(e => ({
      'Data Emissão': e.start_date,
      'Cliente': e.clients?.name ?? '',
      'Seguradora': e.seguradora,
      'Ramo': e.ramo,
      'Prêmio Total': e.premium_total,
      '% Comissão': e.commission_pct,
      'Valor Esperado': e.commission_expected,
      'Valor Recebido': e.commission_received ?? '',
      'Status': e.commission_status,
    })))
  }

  const STATUS_OPTS = [
    { value: '', label: 'Todos' },
    { value: 'prevista', label: 'Previstas' },
    { value: 'recebida', label: 'Recebidas' },
    { value: 'vencida', label: 'Vencidas' },
  ]

  return (
    <div>
      {/* Summary bar */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Esperado', value: formatBRL(summary.totalExpected), accent: false },
          { label: 'Total Recebido', value: formatBRL(summary.totalReceived), accent: true },
          { label: 'Diferença', value: formatBRL(summary.difference), accent: false, warn: summary.difference > 0 },
        ].map(({ label, value, accent, warn }) => (
          <div key={label} className="bg-white rounded-[8px] border border-[#E5E5E5] p-4">
            <p className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wide mb-2">{label}</p>
            <p className={cn('text-[20px] font-bold font-mono', accent ? 'text-[#0BD904]' : warn ? 'text-[#D97706]' : 'text-[#0D0D0D]')}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="bg-white rounded-[8px] border border-[#E5E5E5] p-5 mb-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[13px] font-semibold text-[#0D0D0D]">Esperado vs Recebido (6 meses)</p>
            <div className="flex items-center gap-3 text-[11px] text-[#9CA3AF]">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-[2px] bg-[#E5E5E5] inline-block" />Esperado</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-[2px] bg-[#0BD904] inline-block" />Recebido</span>
            </div>
          </div>
          <MonthlyChart data={chartData} />
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="flex items-center gap-2">
          <label className="text-[12px] text-[#6B7280] font-medium">De</label>
          <input type="date" value={from} onChange={e => setFrom(e.target.value)}
            className="h-8 px-2 rounded-[5px] border border-[#D1D1D1] text-[12px] focus:outline-none focus:border-[#0BD904]" />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-[12px] text-[#6B7280] font-medium">Até</label>
          <input type="date" value={to} onChange={e => setTo(e.target.value)}
            className="h-8 px-2 rounded-[5px] border border-[#D1D1D1] text-[12px] focus:outline-none focus:border-[#0BD904]" />
        </div>
        <div className="flex gap-1 bg-white border border-[#E5E5E5] rounded-[5px] p-0.5">
          {STATUS_OPTS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setStatusFilter(opt.value)}
              className={cn(
                'px-3 py-1 rounded-[3px] text-[12px] font-medium transition-colors',
                statusFilter === opt.value ? 'bg-[#0D0D0D] text-white' : 'text-[#6B7280] hover:text-[#0D0D0D]'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <button
          onClick={handleExport}
          className="ml-auto inline-flex items-center gap-1.5 h-8 px-3 rounded-[5px] border border-[#D1D1D1] text-[12px] font-medium text-[#6B7280] hover:border-[#0D0D0D] hover:text-[#0D0D0D] transition-colors"
        >
          <Download size={13} />
          CSV
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[8px] border border-[#E5E5E5] overflow-x-auto">
        {loading ? (
          <div className="py-12 text-center"><p className="text-[13px] text-[#9CA3AF]">Carregando...</p></div>
        ) : entries.length === 0 ? (
          <div className="py-12 text-center"><p className="text-[13px] text-[#9CA3AF]">Nenhuma comissão no período.</p></div>
        ) : (
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-[#E5E5E5]">
                {['Data', 'Cliente', 'Seguradora', 'Ramo', 'Prêmio', '%', 'Esperado', 'Recebido', 'Status', 'Ação'].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {entries.map(e => (
                <CommissionRow key={e.id} entry={e} onMarked={load} />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
