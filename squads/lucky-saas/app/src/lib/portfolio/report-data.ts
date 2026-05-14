import { createClient } from '@/lib/supabase/server'
import { RAMO_LABELS } from '@/types/policy'

export interface CarteiraSummary {
  broker: { nome: string; susep: string | null; logoUrl?: string | null }
  totalClients: number
  totalApolices: number
  premioAnualTotal: number
  byRamo: { ramo: string; label: string; count: number; pct: number }[]
  topSeguradoras: { seguradora: string; count: number }[]
  renewalRate?: number
  generatedAt: string
}

export async function getCarteiraSummary(
  brokerId: string,
  brokerData: { nome: string; susep?: string | null; logo_url?: string | null }
): Promise<CarteiraSummary> {
  const supabase = await createClient()
  const sb = supabase as any
  const today = new Date().toISOString().split('T')[0]

  const [clientsResult, activePoliciesResult, renewedResult] = await Promise.all([
    sb.from('clients').select('id', { count: 'exact', head: true }).eq('broker_id', brokerId),
    sb.from('policies')
      .select('ramo, seguradora, premium_total')
      .eq('broker_id', brokerId)
      .eq('status', 'ativa')
      .gte('end_date', today)
      .limit(500),
    sb.from('policies')
      .select('id', { count: 'exact', head: true })
      .eq('broker_id', brokerId)
      .not('renewed_by_apolice_id', 'is', null),
  ])

  const activePolicies: { ramo: string; seguradora: string; premium_total: number }[] =
    activePoliciesResult.data ?? []
  const totalClients: number = clientsResult.count ?? 0
  const totalApolices = activePolicies.length
  const premioAnualTotal = activePolicies.reduce((s, p) => s + (p.premium_total || 0), 0)

  const ramoCount = new Map<string, number>()
  const segCount = new Map<string, number>()
  for (const p of activePolicies) {
    ramoCount.set(p.ramo, (ramoCount.get(p.ramo) || 0) + 1)
    segCount.set(p.seguradora, (segCount.get(p.seguradora) || 0) + 1)
  }

  const byRamo = Array.from(ramoCount.entries())
    .map(([ramo, count]) => ({
      ramo,
      label: RAMO_LABELS[ramo] ?? ramo,
      count,
      pct: totalApolices > 0 ? Math.round((count / totalApolices) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count)

  const topSeguradoras = Array.from(segCount.entries())
    .map(([seguradora, count]) => ({ seguradora, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  const renewedCount: number = renewedResult.count ?? 0
  const renewalRate = totalApolices > 0 ? Math.round((renewedCount / totalApolices) * 100) : undefined

  return {
    broker: { nome: brokerData.nome, susep: brokerData.susep ?? null, logoUrl: brokerData.logo_url ?? null },
    totalClients,
    totalApolices,
    premioAnualTotal,
    byRamo,
    topSeguradoras,
    renewalRate,
    generatedAt: new Date().toISOString(),
  }
}
