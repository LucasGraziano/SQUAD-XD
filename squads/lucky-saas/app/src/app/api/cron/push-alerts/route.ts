import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendPushNotification } from '@/lib/push'

export const runtime = 'nodejs'

type Subscription = {
  endpoint: string
  p256dh: string
  auth: string
}

type SubscriptionRow = {
  broker_id: string
  endpoint: string
  p256dh: string
  auth: string
}

type PolicyRow = {
  id: string
  ramo: string
  seguradora: string
  broker_id: string
  // Supabase returns joined table as array
  clients: { name: string }[] | null
}

type PendencyRow = {
  id: string
  title: string
  broker_id: string
}

async function getSubscriptionsByBroker(
  supabase: ReturnType<typeof createAdminClient>,
  brokerIds: string[],
): Promise<Map<string, Subscription[]>> {
  const { data } = await supabase
    .from('push_subscriptions')
    .select('broker_id, endpoint, p256dh, auth')
    .in('broker_id', brokerIds)

  const map = new Map<string, Subscription[]>()
  for (const row of (data ?? []) as SubscriptionRow[]) {
    const list = map.get(row.broker_id) ?? []
    list.push({ endpoint: row.endpoint, p256dh: row.p256dh, auth: row.auth })
    map.set(row.broker_id, list)
  }
  return map
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://premia.app'

  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  const today = new Date().toISOString().split('T')[0]

  // Fetch policies expiring tomorrow
  const { data: expiringPolicies } = await supabase
    .from('policies')
    .select('id, ramo, seguradora, broker_id, clients(name)')
    .eq('status', 'ativa')
    .eq('end_date', tomorrow)

  // Fetch overdue pendencies (due today)
  const { data: overduePendencies } = await supabase
    .from('pendencies')
    .select('id, title, broker_id')
    .eq('status', 'open')
    .lte('due_date', today)
    .not('due_date', 'is', null)

  const allBrokerIds = [
    ...new Set([
      ...((expiringPolicies ?? []) as PolicyRow[]).map(p => p.broker_id),
      ...((overduePendencies ?? []) as PendencyRow[]).map(p => p.broker_id),
    ]),
  ]

  if (allBrokerIds.length === 0) {
    return NextResponse.json({ ok: true, sent: 0 })
  }

  const subscriptionMap = await getSubscriptionsByBroker(supabase, allBrokerIds)

  let sent = 0
  const staleEndpoints: { broker_id: string; endpoint: string }[] = []

  async function pushToSubscriptions(
    brokerId: string,
    payload: { title: string; body: string; url?: string },
  ) {
    const subs = subscriptionMap.get(brokerId) ?? []
    for (const sub of subs) {
      const ok = await sendPushNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        { ...payload, icon: '/icons/icon-192.png' },
      )
      if (ok) {
        sent++
      } else {
        staleEndpoints.push({ broker_id: brokerId, endpoint: sub.endpoint })
      }
    }
  }

  // Push for expiring policies
  for (const policy of (expiringPolicies ?? []) as PolicyRow[]) {
    const clientName = Array.isArray(policy.clients) ? (policy.clients[0]?.name ?? 'Cliente') : 'Cliente'
    await pushToSubscriptions(policy.broker_id, {
      title: `⚡ ${clientName} — apólice vence amanhã`,
      body: `${policy.ramo} · ${policy.seguradora}`,
      url: `${appUrl}/apolices`,
    })
  }

  // Push for overdue pendencies
  for (const pendency of (overduePendencies ?? []) as PendencyRow[]) {
    await pushToSubscriptions(pendency.broker_id, {
      title: `⚠️ Pendência vencida: ${pendency.title}`,
      body: 'Clique para ver os detalhes',
      url: `${appUrl}/pendencias`,
    })
  }

  // Clean up stale subscriptions (HTTP 410 Gone)
  if (staleEndpoints.length > 0) {
    for (const { broker_id, endpoint } of staleEndpoints) {
      await supabase
        .from('push_subscriptions')
        .delete()
        .eq('broker_id', broker_id)
        .eq('endpoint', endpoint)
    }
  }

  return NextResponse.json({ ok: true, sent, stale: staleEndpoints.length })
}
