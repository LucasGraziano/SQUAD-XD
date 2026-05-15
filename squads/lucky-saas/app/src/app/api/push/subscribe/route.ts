import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnySupabase = any

async function getBroker(supabase: AnySupabase, userId: string) {
  const result = await supabase
    .from('brokers')
    .select('id')
    .eq('user_id', userId)
    .single()
  return result.data as { id: string } | null
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const broker = await getBroker(supabase, user.id)
  if (!broker) return NextResponse.json({ error: 'Broker not found' }, { status: 404 })

  const body = await req.json()
  const { endpoint, keys } = body as {
    endpoint: string
    keys: { p256dh: string; auth: string }
  }

  if (!endpoint || !keys?.p256dh || !keys?.auth) {
    return NextResponse.json({ error: 'Invalid subscription' }, { status: 400 })
  }

  const sb: AnySupabase = supabase
  await sb.from('push_subscriptions').upsert(
    { broker_id: broker.id, endpoint, p256dh: keys.p256dh, auth: keys.auth },
    { onConflict: 'broker_id,endpoint' },
  )

  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const broker = await getBroker(supabase, user.id)
  if (!broker) return NextResponse.json({ error: 'Broker not found' }, { status: 404 })

  const body = await req.json()
  const { endpoint } = body as { endpoint: string }

  const sb: AnySupabase = supabase
  if (endpoint) {
    await sb.from('push_subscriptions').delete()
      .eq('broker_id', broker.id).eq('endpoint', endpoint)
  } else {
    await sb.from('push_subscriptions').delete().eq('broker_id', broker.id)
  }

  return NextResponse.json({ ok: true })
}
