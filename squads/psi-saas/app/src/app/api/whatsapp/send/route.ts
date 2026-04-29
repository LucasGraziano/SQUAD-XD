import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const { session_id, type } = await req.json()

  const supabase = await createServiceClient()

  const { data: session } = await supabase
    .from('sessions')
    .select('*, patients(full_name, phone), psychologists(full_name)')
    .eq('id', session_id)
    .single()

  if (!session || !session.patients?.phone) {
    return NextResponse.json({ error: 'Sessão ou telefone não encontrado' }, { status: 404 })
  }

  const patientName  = session.patients.full_name.split(' ')[0]
  const psychName    = session.psychologists?.full_name?.split(' ')[0] ?? 'sua psicóloga'
  const sessionTime  = new Date(session.scheduled_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  const sessionDate  = new Date(session.scheduled_at).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })

  const messages: Record<string, string> = {
    confirmation_48h:
      `Olá ${patientName}! 👋\n\nLembrando da sua sessão com ${psychName} *${sessionDate} às ${sessionTime}*.\n\nPor favor, confirme sua presença respondendo:\n✅ *SIM* para confirmar\n❌ *NÃO* para cancelar\n\n_Vínculo — Sua saúde mental em boas mãos_`,
    reminder_2h:
      `Oi ${patientName}! Sua sessão com ${psychName} é *hoje às ${sessionTime}*. Até já! 🌿`,
    payment:
      `Olá ${patientName}! O pagamento da sua sessão está disponível. Qualquer dúvida, fale com ${psychName}. 💚`,
  }

  const messageText = messages[type] ?? messages.confirmation_48h
  const phone = session.patients.phone.replace(/\D/g, '')

  // Z-API send message
  const zapiUrl = `https://api.z-api.io/instances/${process.env.ZAPI_INSTANCE_ID}/token/${process.env.ZAPI_TOKEN}/send-text`

  let whatsappOk = false
  try {
    const res = await fetch(zapiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Client-Token': process.env.ZAPI_CLIENT_TOKEN ?? '',
      },
      body: JSON.stringify({ phone: `55${phone}`, message: messageText }),
    })
    whatsappOk = res.ok
  } catch {
    // WhatsApp indisponível — fallback email
    whatsappOk = false
  }

  if (whatsappOk && type === 'confirmation_48h') {
    await supabase
      .from('sessions')
      .update({ whatsapp_confirmation_sent: true })
      .eq('id', session_id)
  }

  return NextResponse.json({ ok: whatsappOk, fallback: !whatsappOk })
}
