import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { runBirthdayNotificationsJob } from '@/lib/jobs/birthday-notifications'

export async function POST(req: NextRequest) {
  const cronSecret = req.headers.get('x-cron-secret')
  if (cronSecret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = await createClient()
  const result = await runBirthdayNotificationsJob(supabase)

  return NextResponse.json({ ok: true, ...result })
}
