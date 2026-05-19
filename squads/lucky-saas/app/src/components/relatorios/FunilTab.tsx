'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { DEAL_STAGE_LABELS, PIPELINE_STAGES } from '@/lib/constants/deal-stages'
import type { DealStage } from '@/lib/constants/deal-stages'

interface StageStat {
  stage: DealStage
  count: number
  totalValue: number
}

function formatBRL(n: number) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

const ORDERED: DealStage[] = [...PIPELINE_STAGES, 'contracted', 'rejected']

export function FunilTab() {
  const [stats, setStats] = useState<StageStat[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) { setLoading(false); return }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sb = supabase as any
      const { data: broker } = await sb.from('brokers').select('id').eq('user_id', user.user.id).single()
      if (!broker) { setLoading(false); return }

      const { data: deals } = await sb
        .from('quote_requests')
        .select('status, quote_items(premium_total, is_recommended)')
        .eq('broker_id', broker.id)

      const agg: Record<string, { count: number; totalValue: number }> = {}
      for (const deal of deals ?? []) {
        const s = deal.status as string
        if (!agg[s]) agg[s] = { count: 0, totalValue: 0 }
        agg[s].count++
        const recommended = (deal.quote_items ?? []).find((i: { is_recommended: boolean }) => i.is_recommended)
          ?? (deal.quote_items ?? [])[0]
        agg[s].totalValue += recommended?.premium_total ?? 0
      }

      const result: StageStat[] = ORDERED
        .filter(s => agg[s])
        .map(s => ({ stage: s, count: agg[s].count, totalValue: agg[s].totalValue }))

      setStats(result)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return <div className="py-12 text-center text-[13px] text-[#9CA3AF]">Carregando...</div>
  }

  const pipelineStats = stats.filter(s => PIPELINE_STAGES.includes(s.stage))
  const contracted = stats.find(s => s.stage === 'contracted')
  const rejected = stats.find(s => s.stage === 'rejected')
  const totalActive = pipelineStats.reduce((sum, s) => sum + s.count, 0)
  const totalValue = pipelineStats.reduce((sum, s) => sum + s.totalValue, 0)
  const conversionRate = totalActive > 0 && contracted
    ? ((contracted.count / (totalActive + (contracted?.count ?? 0) + (rejected?.count ?? 0))) * 100).toFixed(1)
    : '0'

  const maxCount = Math.max(...pipelineStats.map(s => s.count), 1)

  return (
    <div className="space-y-4">
      {/* KPIs */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Negociações Ativas', value: String(totalActive) },
          { label: 'Valor em Pipeline', value: formatBRL(totalValue) },
          { label: 'Taxa de Conversão', value: `${conversionRate}%` },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-[8px] border border-[#E5E5E5] p-4">
            <p className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wide mb-2">{label}</p>
            <p className="text-[20px] font-bold text-[#0D0D0D] font-mono">{value}</p>
          </div>
        ))}
      </div>

      {/* Funil */}
      <div className="bg-white rounded-[8px] border border-[#E5E5E5] p-5">
        <p className="text-[14px] font-semibold text-[#0D0D0D] mb-4">Funil de Negociações</p>
        {pipelineStats.length === 0 ? (
          <p className="text-[13px] text-[#9CA3AF] py-4">Nenhum dado disponível.</p>
        ) : (
          <div className="space-y-3">
            {pipelineStats.map((s) => {
              const pct = Math.max(8, (s.count / maxCount) * 100)
              return (
                <div key={s.stage} className="flex items-center gap-3">
                  <div className="w-[130px] shrink-0 text-[12px] font-medium text-[#374151]">
                    {DEAL_STAGE_LABELS[s.stage]}
                  </div>
                  <div className="flex-1 h-6 bg-[#F3F4F6] rounded-[4px] overflow-hidden">
                    <div
                      className="h-full bg-[#0BD904] rounded-[4px] transition-all flex items-center px-2"
                      style={{ width: `${pct}%` }}
                    >
                      <span className="text-[10px] font-bold text-[#034001]">{s.count}</span>
                    </div>
                  </div>
                  <div className="w-[110px] text-right">
                    <span className="text-[12px] font-medium text-[#374151] font-mono">{formatBRL(s.totalValue)}</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Contracted & Rejected */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-[8px] border border-[#DCFCE7] p-4">
          <p className="text-[11px] font-semibold text-[#065F46] uppercase tracking-wide mb-2">Contratados</p>
          <p className="text-[22px] font-bold text-[#065F46] font-mono">{contracted?.count ?? 0}</p>
          <p className="text-[12px] text-[#9CA3AF] mt-1">{formatBRL(contracted?.totalValue ?? 0)} em prêmio</p>
        </div>
        <div className="bg-white rounded-[8px] border border-[#FEE2E2] p-4">
          <p className="text-[11px] font-semibold text-[#991B1B] uppercase tracking-wide mb-2">Recusados / Arquivados</p>
          <p className="text-[22px] font-bold text-[#DC2626] font-mono">{rejected?.count ?? 0}</p>
          <p className="text-[12px] text-[#9CA3AF] mt-1">leads não convertidos</p>
        </div>
      </div>
    </div>
  )
}
