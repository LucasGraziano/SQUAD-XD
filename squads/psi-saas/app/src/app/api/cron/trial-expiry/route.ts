import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendTrialExpiringEmail } from '@/lib/email'

export const runtime = 'nodejs'

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  const now = new Date()

  // Find subscriptions expiring in exactly 3 days (± 12h window)
  const in3daysStart = new Date(now)
  in3daysStart.setDate(in3daysStart.getDate() + 2)
  in3daysStart.setHours(12, 0, 0, 0)

  const in3daysEnd = new Date(now)
  in3daysEnd.setDate(in3daysEnd.getDate() + 3)
  in3daysEnd.setHours(12, 0, 0, 0)

  const { data: subs, error } = await supabase
    .from('subscriptions')
    .select('psychologist_id, trial_ends_at, psychologists(email, full_name)')
    .eq('status', 'trial')
    .gte('trial_ends_at', in3daysStart.toISOString())
    .lt('trial_ends_at', in3daysEnd.toISOString())

  if (error) {
    console.error('[trial-expiry cron] query error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  let sent = 0

  for (const sub of subs ?? []) {
    const psy = sub.psychologists as { email: string; full_name: string } | null
    if (!psy?.email) continue

    const trialEnd = new Date(sub.trial_ends_at)
    const msLeft = trialEnd.getTime() - now.getTime()
    const daysLeft = Math.ceil(msLeft / (1000 * 60 * 60 * 24))

    try {
      await sendTrialExpiringEmail(psy.email, psy.full_name, daysLeft)
      sent++
    } catch (e) {
      console.error(`[trial-expiry cron] failed for ${psy.email}:`, e)
    }
  }

  return NextResponse.json({ sent, total: subs?.length ?? 0 })
}
