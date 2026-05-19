import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

const STALE_DAYS: Partial<Record<string, number>> = {
  prospecting:    7,
  draft:          5,
  sent:           7,
  approved:       3,
  submitted:      14,
  under_analysis: 14,
  issued:         3,
}

export async function POST(req: NextRequest) {
  const cronSecret = req.headers.get('x-cron-secret')
  if (cronSecret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = createAdminClient() as any

  const activeStages = Object.keys(STALE_DAYS)
  const { data: deals, error } = await sb
    .from('quote_requests')
    .select('id, broker_id, status, updated_at, clients(name)')
    .in('status', activeStages)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const now = Date.now()
  const today = new Date().toISOString().slice(0, 10)
  let created = 0

  for (const deal of deals ?? []) {
    const staleDays = STALE_DAYS[deal.status]
    if (!staleDays) continue

    const updatedMs = new Date(deal.updated_at).getTime()
    const daysStale = (now - updatedMs) / 86_400_000

    if (daysStale < staleDays) continue

    // Skip if pending stale alert already exists for this deal
    const { data: existing } = await sb
      .from('alerts')
      .select('id')
      .eq('broker_id', deal.broker_id)
      .eq('type', 'deal_stale')
      .contains('metadata', { deal_id: deal.id })
      .eq('status', 'pending')
      .maybeSingle()

    if (existing) continue

    const clientName = deal.clients?.name ?? 'cliente'
    await sb.from('alerts').insert({
      broker_id:     deal.broker_id,
      type:          'deal_stale',
      title:         `Negociação parada há ${Math.floor(daysStale)} dias`,
      description:   `Deal de ${clientName} está em "${deal.status}" sem atualização.`,
      scheduled_for: today,
      status:        'pending',
      metadata:      { deal_id: deal.id, stage: deal.status },
    })
    created++
  }

  return NextResponse.json({ ok: true, created })
}
