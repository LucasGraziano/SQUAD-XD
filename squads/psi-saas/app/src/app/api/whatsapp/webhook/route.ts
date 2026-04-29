import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

// Z-API webhook — recebe respostas dos pacientes
export async function POST(req: NextRequest) {
  const body = await req.json()
  const supabase = await createServiceClient()

  const phone   = body?.phone?.replace(/\D/g, '')
  const message = (body?.text?.message ?? '').trim().toLowerCase()

  if (!phone || !message) {
    return NextResponse.json({ ok: true })
  }

  // Busca sessão pendente de confirmação para este telefone
  const { data: sessions } = await supabase
    .from('sessions')
    .select('id, status, patients!inner(phone)')
    .eq('status', 'scheduled')
    .eq('whatsapp_confirmation_sent', true)
    .gte('scheduled_at', new Date().toISOString())
    .order('scheduled_at', { ascending: true })
    .limit(1)

  const session = sessions?.find((s) => {
    const p = s.patients as unknown as { phone: string }
    return p?.phone?.replace(/\D/g, '').endsWith(phone.slice(-8))
  })

  if (!session) return NextResponse.json({ ok: true })

  const confirmed = ['s', 'sim', 'yes', '1', 'confirmo', 'confirmar'].includes(message)
  const cancelled = ['n', 'nao', 'não', 'no', 'cancelar', 'cancelo', '2'].includes(message)

  if (confirmed) {
    await supabase
      .from('sessions')
      .update({ status: 'confirmed', confirmed_at: new Date().toISOString() })
      .eq('id', session.id)
  } else if (cancelled) {
    await supabase
      .from('sessions')
      .update({ status: 'cancelled', cancelled_at: new Date().toISOString(), cancellation_reason: 'Paciente cancelou via WhatsApp' })
      .eq('id', session.id)

    // TODO: notificar psicólogo via email (Resend)
  }

  return NextResponse.json({ ok: true })
}
