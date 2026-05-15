import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { QuoteComparisonDocument } from '@/components/pdf/QuoteComparisonDocument'
import React from 'react'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ quoteId: string }> }
) {
  const { quoteId } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const brokerResult = await supabase
    .from('brokers')
    .select('name, phone, creci, susep, plan')
    .eq('user_id', user.id)
    .single()

  const broker = brokerResult.data as { name: string; phone?: string | null; creci?: string | null; susep?: string | null; plan: string } | null
  if (!broker) return NextResponse.json({ error: 'Corretor não encontrado' }, { status: 404 })

  if (broker.plan === 'starter') {
    return NextResponse.json({ error: 'Funcionalidade disponível no plano Profissional' }, { status: 403 })
  }

  const quoteResult = await supabase
    .from('quote_requests')
    .select('*, clients(id, name, phone), quote_items(*)')
    .eq('id', quoteId)
    .single()

  const quote = quoteResult.data as {
    id: string; ramo: string; object_description?: string | null; notes?: string | null
    clients?: { name: string; phone?: string | null } | null
    quote_items?: import('@/types/quote').QuoteItem[]
  } | null

  if (!quote) return NextResponse.json({ error: 'Cotação não encontrada' }, { status: 404 })

  const client = (quote.clients as { name: string; phone?: string | null } | null) ?? { name: '—' }
  const items = quote.quote_items ?? []

  if (items.length === 0) {
    return NextResponse.json({ error: 'Adicione ao menos uma seguradora antes de gerar o PDF' }, { status: 400 })
  }

  const generatedAt = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date())

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const buffer = await renderToBuffer(
      React.createElement(QuoteComparisonDocument, {
        data: { broker, client, quote, items, generatedAt },
      }) as any
    )

    const clientSlug = client.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').slice(0, 25)
    const today = new Date().toISOString().split('T')[0]
    const filename = `comparativo-${clientSlug}-${today}.pdf`

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store',
      },
    })
  } catch (err) {
    console.error('Quote PDF error:', err)
    return NextResponse.json({ error: 'Erro ao gerar PDF' }, { status: 500 })
  }
}
