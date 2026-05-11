'use server'

import { createClient } from '@/lib/supabase/server'

async function getAuth() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { supabase, brokerId: null as string | null }

  const { data: broker } = await supabase
    .from('brokers').select('id').eq('user_id', user.id).single()
  return { supabase, brokerId: (broker as { id: string } | null)?.id ?? null }
}

export type OperationalMetrics = {
  period: '3m' | '6m' | '12m'
  emissionRate: { current: number; previous: number }
  avgClosingDays: { current: number; previous: number }
  renewalRate: { current: number; previous: number }
  avgTicket: { current: number; previous: number }
  monthlyData: Array<{
    month: string
    newPolicies: number
    expiredPolicies: number
    renewedPolicies: number
    avgTicket: number
  }>
}

function subtractMonths(date: Date, months: number): Date {
  const d = new Date(date)
  d.setMonth(d.getMonth() - months)
  return d
}

export async function getOperationalMetrics(period: '3m' | '6m' | '12m'): Promise<OperationalMetrics | null> {
  const { supabase, brokerId } = await getAuth()
  if (!brokerId) return null

  const monthsMap = { '3m': 3, '6m': 6, '12m': 12 }
  const months = monthsMap[period]

  const now = new Date()
  const currentStart = subtractMonths(now, months).toISOString().split('T')[0]
  const previousStart = subtractMonths(now, months * 2).toISOString().split('T')[0]
  const today = now.toISOString().split('T')[0]

  const [currentPolicies, previousPolicies, currentLeads, previousLeads] = await Promise.all([
    supabase
      .from('policies')
      .select('id, ramo, start_date, end_date, premium_total, status, client_id, created_at')
      .eq('broker_id', brokerId)
      .gte('created_at', currentStart)
      .lte('created_at', today),

    supabase
      .from('policies')
      .select('id, ramo, start_date, end_date, premium_total, status, client_id, created_at')
      .eq('broker_id', brokerId)
      .gte('created_at', previousStart)
      .lt('created_at', currentStart),

    supabase
      .from('leads')
      .select('id, created_at, status')
      .eq('broker_id', brokerId)
      .gte('created_at', currentStart),

    supabase
      .from('leads')
      .select('id, created_at, status')
      .eq('broker_id', brokerId)
      .gte('created_at', previousStart)
      .lt('created_at', currentStart),
  ])

  type PolicyData = { id: string; ramo: string; start_date: string; end_date: string; premium_total: number; status: string; client_id: string; created_at: string }
  type LeadData = { id: string; created_at: string; status: string }

  const cp = (currentPolicies.data ?? []) as PolicyData[]
  const pp = (previousPolicies.data ?? []) as PolicyData[]
  const cl = (currentLeads.data ?? []) as LeadData[]
  const pl = (previousLeads.data ?? []) as LeadData[]

  function calcEmissionRate(policies: PolicyData[], leads: LeadData[]) {
    if (leads.length === 0) return 0
    return Math.round((policies.length / leads.length) * 100)
  }

  function calcAvgTicket(policies: PolicyData[]) {
    if (policies.length === 0) return 0
    return policies.reduce((s, p) => s + (p.premium_total ?? 0), 0) / policies.length
  }

  function calcRenewalRate(policies: PolicyData[], allPolicies: PolicyData[]) {
    const expired = allPolicies.filter(p => p.end_date < today)
    if (expired.length === 0) return 0
    const clientsWithExpired = new Set(expired.map(p => p.client_id))
    const renewed = policies.filter(p => clientsWithExpired.has(p.client_id))
    return Math.round((renewed.length / clientsWithExpired.size) * 100)
  }

  const monthlyData: OperationalMetrics['monthlyData'] = []
  for (let i = months - 1; i >= 0; i--) {
    const mStart = subtractMonths(now, i + 1).toISOString().slice(0, 7)
    const mEnd = subtractMonths(now, i).toISOString().slice(0, 7)

    const mPolicies = cp.filter(p => p.created_at >= mStart && p.created_at < mEnd + '-32')
    const mExpired = cp.filter(p => p.end_date >= mStart && p.end_date < mEnd + '-32')

    const clientsExpired = new Set(mExpired.map(p => p.client_id))
    const renewed = mPolicies.filter(p => clientsExpired.has(p.client_id))

    monthlyData.push({
      month: mStart,
      newPolicies: mPolicies.length,
      expiredPolicies: mExpired.length,
      renewedPolicies: renewed.length,
      avgTicket: calcAvgTicket(mPolicies),
    })
  }

  return {
    period,
    emissionRate: {
      current: calcEmissionRate(cp, cl),
      previous: calcEmissionRate(pp, pl),
    },
    avgClosingDays: { current: 0, previous: 0 },
    renewalRate: {
      current: calcRenewalRate(cp, [...cp, ...pp]),
      previous: calcRenewalRate(pp, pp),
    },
    avgTicket: {
      current: calcAvgTicket(cp),
      previous: calcAvgTicket(pp),
    },
    monthlyData,
  }
}
