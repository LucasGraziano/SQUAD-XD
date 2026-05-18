import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { applyReferralCredit } from '@/app/actions/referral'

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createAdminClient() as any
  const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString()

  const { data: pending } = await supabase
    .from('referral_conversions')
    .select('id')
    .not('converted_at', 'is', null)
    .lte('converted_at', thirtyDaysAgo)
    .is('reward_applied_at', null)

  if (!pending?.length) {
    return NextResponse.json({ processed: 0 })
  }

  let processed = 0
  for (const conv of pending) {
    try {
      await applyReferralCredit(conv.id)
      processed++
    } catch (err) {
      console.error(`[referral-rewards] failed conv ${conv.id}:`, err)
    }
  }

  return NextResponse.json({ processed })
}
