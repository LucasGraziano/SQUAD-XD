import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { ProposalDocument } from '@/components/pdf/ProposalDocument'
import React from 'react'

type BrokerRow = { name: string; phone?: string | null; email?: string | null; creci?: string | null; susep?: string | null; plan: string }
type ClientRow = { name: string; cpf_cnpj?: string | null; email?: string | null; phone?: string | null }
type PolicyRow = {
  id: string; ramo: string; seguradora: string; policy_number?: string | null
  start_date: string; end_date: string; premium_total: number; payment_frequency: string
  commission_pct: number; notes?: string | null; broker_id: string; client_id: string
  metadata?: Record<string, string> | null
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ policyId: string }> }
) {
  const { policyId } = await params
  const validityDays = Math.min(30, Math.max(7, Number(request.nextUrl.searchParams.get('validity') ?? 15)))

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  // Fetch broker
  const brokerResult = await supabase
    .from('brokers')
    .select('id, name, phone, email, creci, susep, plan')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)

  const broker = (brokerResult.data as (BrokerRow & { id: string })[] | null)?.[0] ?? null
  if (!broker) return NextResponse.json({ error: 'Corretor não encontrado' }, { status: 404 })

  if (broker.plan === 'starter') {
    return NextResponse.json({ error: 'Funcionalidade disponível no plano Profissional' }, { status: 403 })
  }

  // Fetch policy — ownership enforced via broker_id filter
  const policyResult = await supabase
    .from('policies')
    .select('id, ramo, seguradora, policy_number, start_date, end_date, premium_total, payment_frequency, commission_pct, notes, broker_id, client_id, metadata')
    .eq('id', policyId)
    .eq('broker_id', broker.id)
    .single()

  const policy = policyResult.data as PolicyRow | null
  if (!policy) return NextResponse.json({ error: 'Apólice não encontrada' }, { status: 404 })

  // Fetch client
  const clientResult = await supabase
    .from('clients')
    .select('name, cpf_cnpj, email, phone')
    .eq('id', policy.client_id)
    .single()

  const client = clientResult.data as ClientRow | null
  if (!client) return NextResponse.json({ error: 'Cliente não encontrado' }, { status: 404 })

  const validUntil = new Date(Date.now() + validityDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  const meta = (policy.metadata ?? {}) as Record<string, string>

  const proposalData = {
    broker,
    client,
    policy: {
      ...policy,
      valor_franquia: meta.franquia ? parseFloat(meta.franquia) : null,
      coberturas: meta.coberturas ?? null,
      sinistro_tel: meta.sinistro_tel ?? null,
      sinistro_zap: meta.sinistro_zap ?? null,
      placa: meta.placa ?? null,
      objeto_segurado: meta.objeto_segurado ?? null,
    },
    validUntil,
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const buffer = await renderToBuffer(
      React.createElement(ProposalDocument, { data: proposalData }) as any
    )

    const clientNameSlug = client.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 30)

    const today = new Date().toISOString().split('T')[0]
    const filename = `proposta-${clientNameSlug}-${today}.pdf`

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store',
      },
    })
  } catch (err) {
    console.error('PDF generation error:', err)
    return NextResponse.json({ error: 'Erro ao gerar PDF' }, { status: 500 })
  }
}
