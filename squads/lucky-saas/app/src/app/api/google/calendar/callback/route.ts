import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnySupabase = any

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  if (error || !code) {
    return NextResponse.redirect(new URL('/configuracoes?google=denied', request.url))
  }

  const clientId = process.env.GOOGLE_CLIENT_ID!
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET!
  const redirectUri = process.env.GOOGLE_REDIRECT_URI ?? `${request.nextUrl.origin}/api/google/calendar/callback`

  // Exchange code for tokens
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  })

  const tokens = await tokenRes.json()

  if (!tokens.access_token) {
    return NextResponse.redirect(new URL('/configuracoes?google=error', request.url))
  }

  // Fetch google email
  const profileRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  })
  const profile = await profileRes.json()
  const googleEmail = profile.email ?? null

  // Get broker_id
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.redirect(new URL('/login', request.url))

  const { data: broker } = await supabase.from('brokers').select('id').eq('user_id', user.id).single()
  const brokerId = (broker as { id: string } | null)?.id
  if (!brokerId) return NextResponse.redirect(new URL('/configuracoes?google=error', request.url))

  // Upsert tokens
  const sb: AnySupabase = supabase
  await sb.from('google_calendar_tokens').upsert({
    broker_id: brokerId,
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    expires_at: tokens.expires_in
      ? new Date(Date.now() + tokens.expires_in * 1000).toISOString()
      : null,
    google_email: googleEmail,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'broker_id' })

  return NextResponse.redirect(new URL('/configuracoes?google=connected', request.url))
}
