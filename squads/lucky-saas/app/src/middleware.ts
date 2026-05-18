import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/signup',
  '/reset-password',
  '/auth/callback',
  '/portal',
  '/pricing',
]

// Rotas permitidas mesmo com trial expirado / assinatura inativa
const BILLING_EXEMPT_ROUTES = [
  '/pricing',
  '/configuracoes',
  '/account',
  '/api',
]

export async function middleware(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    const { pathname } = request.nextUrl
    const isPublicRoute = PUBLIC_ROUTES.some(r => pathname.startsWith(r))
    if (!isPublicRoute) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
    return NextResponse.next({ request })
  }

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl
  const isPublicRoute = PUBLIC_ROUTES.some(r => pathname.startsWith(r))

  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (user && pathname === '/login') {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  // Billing gate: bloqueia acesso ao dashboard se assinatura expirou
  if (user && !isPublicRoute) {
    const isBillingExempt = BILLING_EXEMPT_ROUTES.some(r => pathname.startsWith(r))
    if (!isBillingExempt) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: broker } = await (supabase as any)
        .from('brokers')
        .select('subscription_status, trial_ends_at, current_period_end')
        .eq('user_id', user.id)
        .single()

      if (broker) {
        const now = new Date()
        const isTrialExpired =
          broker.subscription_status === 'trial' &&
          broker.trial_ends_at &&
          new Date(broker.trial_ends_at) < now

        const gracePeriodDays = 30
        const isCanceledExpired =
          broker.subscription_status === 'canceled' &&
          broker.current_period_end &&
          new Date(new Date(broker.current_period_end).getTime() + gracePeriodDays * 86400000) < now

        const pastDueDays = 14
        const isPastDueExpired =
          broker.subscription_status === 'past_due' &&
          broker.current_period_end &&
          new Date(new Date(broker.current_period_end).getTime() + pastDueDays * 86400000) < now

        if (isTrialExpired || isCanceledExpired || isPastDueExpired) {
          const url = request.nextUrl.clone()
          url.pathname = '/pricing'
          return NextResponse.redirect(url)
        }
      }
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
