import { createClient } from '@/lib/supabase/server'

export interface CrossSellOpportunity {
  id: string
  title: string
  description: string
  clientCount: number
  suggestedRamo: string
  sourceRamo: string
  clientIds: string[]
  whatsappTemplate: string
}

type PolicyRow = { client_id: string; ramo: string }

const RAMO_NAMES: Record<string, string> = {
  auto: 'Auto', vida: 'Vida', saude: 'Saúde', residencial: 'Residencial',
  empresarial: 'Empresarial', viagem: 'Viagem', consorcio: 'Consórcio',
}

const CROSS_SELL_RULES: { source: string; target: string }[] = [
  { source: 'vida',       target: 'auto'        },
  { source: 'auto',       target: 'vida'        },
  { source: 'auto',       target: 'residencial' },
  { source: 'vida',       target: 'residencial' },
  { source: 'saude',      target: 'vida'        },
]

export async function detectCrossSellOpportunities(
  brokerId: string
): Promise<CrossSellOpportunity[]> {
  const supabase = await createClient()
  const sb = supabase as any
  const today = new Date().toISOString().split('T')[0]

  const { data: policies } = await sb
    .from('policies')
    .select('client_id, ramo')
    .eq('broker_id', brokerId)
    .eq('status', 'ativa')
    .gte('end_date', today)

  if (!policies || policies.length === 0) return []

  // Build maps: client → set of ramos
  const clientRamos = new Map<string, Set<string>>()
  for (const p of policies as PolicyRow[]) {
    if (!clientRamos.has(p.client_id)) clientRamos.set(p.client_id, new Set())
    clientRamos.get(p.client_id)!.add(p.ramo)
  }

  const opportunities: CrossSellOpportunity[] = []

  for (const rule of CROSS_SELL_RULES) {
    const affected: string[] = []
    for (const [clientId, ramos] of clientRamos) {
      if (ramos.has(rule.source) && !ramos.has(rule.target)) {
        affected.push(clientId)
      }
    }
    if (affected.length === 0) continue

    const sourceLabel = RAMO_NAMES[rule.source] ?? rule.source
    const targetLabel = RAMO_NAMES[rule.target] ?? rule.target

    opportunities.push({
      id: `${rule.source}->${rule.target}`,
      title: `Clientes sem seguro ${targetLabel}`,
      description: `${affected.length} cliente${affected.length !== 1 ? 's' : ''} com ${sourceLabel} mas sem ${targetLabel}`,
      clientCount: affected.length,
      suggestedRamo: rule.target,
      sourceRamo: rule.source,
      clientIds: affected,
      whatsappTemplate: `Olá! Tenho uma proposta de seguro ${targetLabel} que pode te interessar. Posso apresentar?`,
    })
  }

  return opportunities
    .sort((a, b) => b.clientCount - a.clientCount)
    .slice(0, 5)
}
