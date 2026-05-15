import { createClient } from '@/lib/supabase/server'

export interface HealthTip {
  component: 'alertCoverage' | 'activeApolices' | 'completeClients' | 'recentEngagement'
  message: string
  ctaLabel: string
  ctaHref: string
  score: number
}

export interface PortfolioHealthScore {
  total: number
  components: {
    alertCoverage: number
    activeApolices: number
    completeClients: number
    recentEngagement: number
  }
  tips: HealthTip[]
  calculatedAt: string
}

export async function calculateHealthScore(brokerId: string): Promise<PortfolioHealthScore> {
  const supabase = await createClient()
  const sb = supabase as any
  const today = new Date().toISOString().split('T')[0]
  const in14Days = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()

  const [policiesRes, alertsRes, clientsRes, brokerRes] = await Promise.all([
    sb.from('policies').select('id, end_date').eq('broker_id', brokerId).neq('status', 'cancelada'),
    sb.from('alerts').select('policy_id').eq('broker_id', brokerId).eq('status', 'pending'),
    sb.from('clients').select('id, email, phone').eq('broker_id', brokerId),
    sb.from('brokers').select('updated_at, created_at').eq('id', brokerId).single(),
  ])

  const policies: { id: string; end_date: string }[] = policiesRes.data ?? []
  const alertedPolicyIds = new Set((alertsRes.data ?? []).map((a: { policy_id: string }) => a.policy_id))
  const clients: { id: string; email: string | null; phone: string | null }[] = clientsRes.data ?? []

  // Component 1: Alert coverage — % of policies with at least one pending alert
  const totalPolicies = policies.length
  const coveredCount = policies.filter(p => alertedPolicyIds.has(p.id)).length
  const alertCoverage = totalPolicies === 0 ? 25 : Math.round((coveredCount / totalPolicies) * 25)

  // Component 2: Active apolices — % not expired
  const activeCount = policies.filter(p => p.end_date >= today).length
  const activeApolices = totalPolicies === 0 ? 25 : Math.round((activeCount / totalPolicies) * 25)

  // Component 3: Complete clients — % with both email AND phone
  const totalClients = clients.length
  const completeCount = clients.filter(c => c.email && c.phone).length
  const completeClients = totalClients === 0 ? 25 : Math.round((completeCount / totalClients) * 25)

  // Component 4: Recent engagement — broker updated_at within last 14 days
  const brokerData = brokerRes.data as { updated_at: string; created_at: string } | null
  const lastSeen = brokerData?.updated_at ?? brokerData?.created_at
  const recentEngagement = lastSeen && new Date(lastSeen).getTime() > new Date(in14Days).getTime() ? 25 : 0

  const components = { alertCoverage, activeApolices, completeClients, recentEngagement }
  const total = alertCoverage + activeApolices + completeClients + recentEngagement

  // Generate tips sorted by worst component
  const tipDefs: Record<string, HealthTip> = {
    alertCoverage: {
      component: 'alertCoverage',
      message: `${totalPolicies - coveredCount} apólice${totalPolicies - coveredCount !== 1 ? 's' : ''} sem alerta de renovação`,
      ctaLabel: 'Ver apólices',
      ctaHref: '/apolices',
      score: alertCoverage,
    },
    activeApolices: {
      component: 'activeApolices',
      message: `${totalPolicies - activeCount} apólice${totalPolicies - activeCount !== 1 ? 's' : ''} vencida${totalPolicies - activeCount !== 1 ? 's' : ''}`,
      ctaLabel: 'Ver apólices vencidas',
      ctaHref: '/apolices?tab=vencidas',
      score: activeApolices,
    },
    completeClients: {
      component: 'completeClients',
      message: `${totalClients - completeCount} cliente${totalClients - completeCount !== 1 ? 's' : ''} com dados incompletos`,
      ctaLabel: 'Ver clientes',
      ctaHref: '/clientes',
      score: completeClients,
    },
    recentEngagement: {
      component: 'recentEngagement',
      message: 'Acesse o Premia regularmente para manter o engajamento',
      ctaLabel: 'Ver dashboard',
      ctaHref: '/dashboard',
      score: recentEngagement,
    },
  }

  const tips = Object.values(tipDefs)
    .filter(t => t.score < 25)
    .sort((a, b) => a.score - b.score)
    .slice(0, 3)

  return {
    total,
    components,
    tips,
    calculatedAt: new Date().toISOString(),
  }
}
