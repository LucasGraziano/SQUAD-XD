'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnySupabase = any

async function getAuth() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { supabase, brokerId: null as string | null }

  const { data: brokerRows } = await supabase
    .from('brokers').select('id').eq('user_id', user.id)
    .order('created_at', { ascending: false }).limit(1)
  return { supabase, brokerId: (brokerRows as { id: string }[] | null)?.[0]?.id ?? null }
}

export type CommissionEntry = {
  id: string
  ramo: string
  seguradora: string
  start_date: string
  end_date: string
  premium_total: number
  commission_pct: number
  commission_expected: number
  commission_received: number | null
  commission_received_at: string | null
  commission_status: 'prevista' | 'recebida' | 'vencida'
  status: string
  created_at: string
  clients: { name: string } | null
}

export async function getCommissionStatement({ from, to, seguradora, ramo, commissionStatus }: {
  from: string
  to: string
  seguradora?: string
  ramo?: string
  commissionStatus?: string
}) {
  const { supabase, brokerId } = await getAuth()
  if (!brokerId) return []

  let query = supabase
    .from('policies')
    .select('id, ramo, seguradora, start_date, end_date, premium_total, commission_pct, commission_expected, commission_received, commission_received_at, commission_status, status, created_at, clients(name)')
    .eq('broker_id', brokerId)
    .gte('start_date', from)
    .lte('start_date', to)

  if (seguradora) query = query.eq('seguradora', seguradora)
  if (ramo) query = query.eq('ramo', ramo)
  if (commissionStatus) query = query.eq('commission_status', commissionStatus)

  const { data } = await query.order('start_date', { ascending: false })
  return (data as CommissionEntry[]) ?? []
}

export async function getCommissionSummary({ from, to }: { from: string; to: string }) {
  const entries = await getCommissionStatement({ from, to })
  const totalExpected = entries.reduce((s, e) => s + (e.commission_expected ?? 0), 0)
  const totalReceived = entries.reduce((s, e) => s + (e.commission_received ?? 0), 0)
  return {
    totalExpected,
    totalReceived,
    difference: totalExpected - totalReceived,
    count: entries.length,
  }
}

export async function markCommissionReceived(policyId: string, { amount, date }: { amount: number; date: string }) {
  const { supabase, brokerId } = await getAuth()
  if (!brokerId) return { error: 'Não autenticado' }

  const sb: AnySupabase = supabase
  const { error } = await sb
    .from('policies')
    .update({
      commission_received: amount,
      commission_received_at: date,
      commission_status: 'recebida',
    })
    .eq('id', policyId)
    .eq('broker_id', brokerId)

  if (error) return { error: error.message }
  revalidatePath('/financeiro')
  return { success: true }
}

export async function getMonthlyCommissionChart({ months = 12 }: { months?: number } = {}) {
  const { supabase, brokerId } = await getAuth()
  if (!brokerId) return []

  const from = new Date()
  from.setMonth(from.getMonth() - months)
  const fromStr = from.toISOString().split('T')[0]

  const { data } = await supabase
    .from('policies')
    .select('start_date, commission_expected, commission_received, commission_status')
    .eq('broker_id', brokerId)
    .gte('start_date', fromStr)

  if (!data) return []

  const byMonth: Record<string, { expected: number; received: number }> = {}
  for (const row of data as { start_date: string; commission_expected: number; commission_received: number | null; commission_status: string }[]) {
    const m = row.start_date.slice(0, 7)
    if (!byMonth[m]) byMonth[m] = { expected: 0, received: 0 }
    byMonth[m].expected += row.commission_expected ?? 0
    byMonth[m].received += row.commission_received ?? 0
  }

  return Object.entries(byMonth)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, values]) => ({ month, ...values }))
}
