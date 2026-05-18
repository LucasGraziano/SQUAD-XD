import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  const response = NextResponse.redirect(`${appUrl}/signup?referred=1`)

  // Cookie dura 30 dias, SameSite=Lax (não bloqueia navegação cross-site)
  response.cookies.set('premia_referral', code, {
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  })

  return response
}
