import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

/**
 * Cron job — runs every 30 minutes via Vercel Cron.
 * Finds sessions in the 48h and 2h reminder windows and fires WhatsApp messages.
 * Protected by CRON_SECRET to prevent unauthorized triggers.
 */
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = await createServiceClient()
  const now = new Date()

  // 48h window: sessions scheduled between now+47h and now+49h, not yet sent
  const window48hStart = new Date(now.getTime() + 47 * 3_600_000).toISOString()
  const window48hEnd   = new Date(now.getTime() + 49 * 3_600_000).toISOString()

  // 2h window: sessions scheduled between now+1h45m and now+2h15m
  const window2hStart  = new Date(now.getTime() + 105 * 60_000).toISOString()
  const window2hEnd    = new Date(now.getTime() + 135 * 60_000).toISOString()

  const [{ data: sessions48h }, { data: sessions2h }] = await Promise.all([
    supabase
      .from('sessions')
      .select('id')
      .eq('status', 'scheduled')
      .eq('whatsapp_confirmation_sent', false)
      .gte('scheduled_at', window48hStart)
      .lte('scheduled_at', window48hEnd),

    supabase
      .from('sessions')
      .select('id')
      .in('status', ['scheduled', 'confirmed'])
      .gte('scheduled_at', window2hStart)
      .lte('scheduled_at', window2hEnd),
  ])

  const base = req.nextUrl.origin

  const send = async (session_id: string, type: string) => {
    try {
      await fetch(`${base}/api/whatsapp/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id, type }),
      })
    } catch {
      // best-effort — failures logged by Z-API webhook
    }
  }

  const results = await Promise.allSettled([
    ...(sessions48h ?? []).map(s => send(s.id, 'confirmation_48h')),
    ...(sessions2h  ?? []).map(s => send(s.id, 'reminder_2h')),
  ])

  const sent     = results.filter(r => r.status === 'fulfilled').length
  const failed   = results.filter(r => r.status === 'rejected').length

  return NextResponse.json({
    ok: true,
    sent_48h: sessions48h?.length ?? 0,
    sent_2h:  sessions2h?.length  ?? 0,
    fulfilled: sent,
    failed,
  })
}
