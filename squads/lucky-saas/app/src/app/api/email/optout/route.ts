import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { jwtVerify } from 'jose'

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  if (!token || token === 'test') {
    return new NextResponse('Link de teste — opt-out não processado.', { status: 200 })
  }

  try {
    const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET ?? 'secret')
    const { payload } = await jwtVerify(token, secret)
    const clientId = payload.clientId as string

    const supabase = await createClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sb = supabase as any
    await sb.from('clients').update({ email_opt_out: true }).eq('id', clientId)

    return new NextResponse(
      `<!DOCTYPE html><html><body style="font-family:sans-serif;text-align:center;padding:60px 20px;">
        <h2 style="color:#0D0D0D">Descadastrado com sucesso</h2>
        <p style="color:#6B7280">Você não receberá mais e-mails de lembrete de renovação.</p>
      </body></html>`,
      { status: 200, headers: { 'Content-Type': 'text/html' } }
    )
  } catch {
    return new NextResponse('Link inválido ou expirado.', { status: 400 })
  }
}
