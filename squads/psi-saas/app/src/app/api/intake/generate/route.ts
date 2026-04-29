import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import crypto from 'crypto'

// POST /api/intake/generate
// Body: { psychologist_id: string, patient_name?: string }
// Returns: { token, url }
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: psy } = await supabase
    .from('psychologists')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!psy) return NextResponse.json({ error: 'Psychologist not found' }, { status: 404 })

  const body = await request.json().catch(() => ({}))
  const token = crypto.randomBytes(24).toString('hex')
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

  const { error } = await supabase.from('intake_tokens').insert({
    token,
    psychologist_id: psy.id,
    patient_name_hint: body.patient_name ?? null,
    expires_at: expiresAt.toISOString(),
    used: false,
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://vinculo.app'
  return NextResponse.json({ token, url: `${appUrl}/intake/${token}` })
}
