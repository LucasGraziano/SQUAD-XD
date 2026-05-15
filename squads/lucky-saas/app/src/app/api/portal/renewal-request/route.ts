import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  let body: { token?: string; policyId?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }

  const { token, policyId } = body
  if (!token || !policyId) {
    return NextResponse.json({ error: 'token e policyId são obrigatórios' }, { status: 400 })
  }

  let supabase
  try {
    supabase = createAdminClient()
  } catch {
    return NextResponse.json({ error: 'Serviço indisponível' }, { status: 503 })
  }

  // Validate token
  const { data: tokenRecord } = await supabase
    .from('client_portal_tokens')
    .select('client_id, broker_id, expires_at')
    .eq('token', token)
    .is('revoked_at', null)
    .maybeSingle()

  if (!tokenRecord) return NextResponse.json({ error: 'Token inválido' }, { status: 401 })

  const td = tokenRecord as { client_id: string; broker_id: string; expires_at: string | null }
  if (td.expires_at && new Date(td.expires_at) < new Date()) {
    return NextResponse.json({ error: 'Token expirado' }, { status: 401 })
  }

  // Verify policy belongs to this client+broker
  const { data: policy } = await supabase
    .from('policies')
    .select('id, ramo, seguradora')
    .eq('id', policyId)
    .eq('client_id', td.client_id)
    .eq('broker_id', td.broker_id)
    .maybeSingle()

  if (!policy) return NextResponse.json({ error: 'Apólice não encontrada' }, { status: 404 })

  const p = policy as { id: string; ramo: string; seguradora: string }

  // Fetch client name
  const { data: client } = await supabase
    .from('clients')
    .select('name')
    .eq('id', td.client_id)
    .single()

  const clientName = (client as { name: string } | null)?.name ?? 'Cliente'

  // Idempotency: skip if pending renewal_request already exists for this policy
  const { data: existing } = await supabase
    .from('alerts')
    .select('id')
    .eq('policy_id', p.id)
    .eq('type', 'renewal_request')
    .eq('status', 'pending')
    .maybeSingle()

  if (existing) return NextResponse.json({ success: true })

  // Create alert for broker
  const sb: any = supabase
  const { error: insertError } = await sb.from('alerts').insert({
    broker_id: td.broker_id,
    policy_id: p.id,
    client_id: td.client_id,
    type: 'renewal_request',
    title: `${clientName} solicitou renovação`,
    description: `${p.seguradora} — ${p.ramo}`,
    scheduled_for: new Date().toISOString().split('T')[0],
    status: 'pending',
  })

  if (insertError) {
    console.error('Failed to create renewal alert:', insertError.message)
    return NextResponse.json({ error: 'Erro ao registrar solicitação' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
