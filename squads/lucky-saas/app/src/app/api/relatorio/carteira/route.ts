import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { CarteiraReport } from '@/components/relatorio/CarteiraReport'
import { getCarteiraSummary } from '@/lib/portfolio/report-data'
import { meetsRequirement } from '@/lib/constants/plan-gates'
import React from 'react'

export async function GET(_req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  const brokerResult = await (supabase as any)
    .from('brokers')
    .select('id, name, susep, logo_url, plan')
    .eq('user_id', user.id)
    .single()

  const broker = brokerResult.data as { id: string; name: string; susep: string | null; logo_url: string | null; plan: string } | null
  if (!broker) {
    return NextResponse.json({ error: 'Corretor não encontrado' }, { status: 404 })
  }

  if (!meetsRequirement(broker.plan, 'pro')) {
    return NextResponse.json({ error: 'Disponível no plano Profissional ou superior' }, { status: 403 })
  }

  const data = await getCarteiraSummary(broker.id, {
    nome: broker.name,
    susep: broker.susep,
    logo_url: broker.logo_url,
  })

  try {
    const buffer = await renderToBuffer(
      React.createElement(CarteiraReport, { data }) as any
    )

    const today = new Date().toISOString().split('T')[0]
    const slug = broker.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').slice(0, 30)
    const filename = `relatorio-carteira-${slug}-${today}.pdf`

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
