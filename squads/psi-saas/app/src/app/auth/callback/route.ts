import { createClient } from '@/lib/supabase/server'
import { sendWelcomeEmail } from '@/lib/email'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { data: sessionData, error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error && sessionData.user) {
      // Send welcome email only on first login (no psychologist record yet)
      const { count } = await supabase
        .from('psychologists')
        .select('id', { count: 'exact', head: true })
        .eq('id', sessionData.user.id)

      if (count === 0) {
        const name = sessionData.user.user_metadata?.full_name ?? sessionData.user.email ?? ''
        sendWelcomeEmail(sessionData.user.email!, name).catch(() => undefined)
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
}
