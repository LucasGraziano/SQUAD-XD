import { createClient } from '@/lib/supabase/server'

export interface ApoliceHistoryItem {
  id: string
  numero_apolice: string
  seguradora: string
  ramo: string
  premio: number
  vigencia_inicio: string
  vigencia_fim: string
  status: 'ativa' | 'expirada' | 'cancelada' | 'renovada'
  renewed_by_apolice_id: string | null
  renewal_quote_id: string | null
}

export async function getClientApoliceHistory(
  clientId: string,
  brokerId: string
): Promise<ApoliceHistoryItem[]> {
  const supabase = await createClient()
  const today = new Date().toISOString().split('T')[0]

  const { data, error } = await (supabase as any)
    .from('policies')
    .select('id, policy_number, seguradora, ramo, premium_total, start_date, end_date, status, renewed_by_apolice_id, renewal_quote_id')
    .eq('client_id', clientId)
    .eq('broker_id', brokerId)
    .order('end_date', { ascending: false })

  if (error || !data) return []

  return (data as any[]).map((p) => {
    let derivedStatus: ApoliceHistoryItem['status']
    if (p.renewed_by_apolice_id) {
      derivedStatus = 'renovada'
    } else if (p.end_date >= today && p.status !== 'cancelada') {
      derivedStatus = 'ativa'
    } else if (p.status === 'cancelada') {
      derivedStatus = 'cancelada'
    } else {
      derivedStatus = 'expirada'
    }

    return {
      id: p.id,
      numero_apolice: p.policy_number ?? '—',
      seguradora: p.seguradora,
      ramo: p.ramo,
      premio: p.premium_total,
      vigencia_inicio: p.start_date,
      vigencia_fim: p.end_date,
      status: derivedStatus,
      renewed_by_apolice_id: p.renewed_by_apolice_id ?? null,
      renewal_quote_id: p.renewal_quote_id ?? null,
    }
  })
}
