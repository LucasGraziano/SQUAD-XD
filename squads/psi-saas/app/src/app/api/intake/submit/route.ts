import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// POST /api/intake/submit
// Body: { token, full_name, email?, phone?, birth_date?, notes? }
export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  if (!body?.token || !body?.full_name) {
    return NextResponse.json({ error: 'token and full_name are required' }, { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  // Validate token
  const { data: intakeToken, error: tokenError } = await supabase
    .from('intake_tokens')
    .select('id, psychologist_id, used, expires_at')
    .eq('token', body.token)
    .single()

  if (tokenError || !intakeToken) {
    return NextResponse.json({ error: 'Link inválido ou expirado.' }, { status: 404 })
  }

  if (intakeToken.used) {
    return NextResponse.json({ error: 'Este link já foi utilizado.' }, { status: 409 })
  }

  if (new Date(intakeToken.expires_at) < new Date()) {
    return NextResponse.json({ error: 'Este link expirou.' }, { status: 410 })
  }

  // Create patient
  const { error: patientError } = await supabase.from('patients').insert({
    psychologist_id: intakeToken.psychologist_id,
    full_name: body.full_name.trim(),
    email: body.email?.trim() || null,
    phone: body.phone?.trim() || null,
    birth_date: body.birth_date || null,
    notes: body.notes?.trim() || null,
    status: 'active',
    source: 'intake_form',
  })

  if (patientError) {
    return NextResponse.json({ error: patientError.message }, { status: 500 })
  }

  // Mark token as used
  await supabase
    .from('intake_tokens')
    .update({ used: true, used_at: new Date().toISOString() })
    .eq('id', intakeToken.id)

  return NextResponse.json({ ok: true })
}
