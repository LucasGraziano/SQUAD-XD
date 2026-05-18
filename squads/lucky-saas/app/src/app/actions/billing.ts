'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { stripe, PRICE_IDS, type Plan } from '@/lib/stripe'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://premia.app'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnySupabase = any

export async function createCheckoutSession(plan: Plan) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const sb: AnySupabase = supabase
  const { data: broker } = await sb
    .from('brokers')
    .select('id, stripe_customer_id, subscription_status')
    .eq('user_id', user.id)
    .single()

  if (!broker) redirect('/login')

  const session = await stripe.checkout.sessions.create({
    customer: broker.stripe_customer_id ?? undefined,
    customer_email: broker.stripe_customer_id ? undefined : user.email,
    line_items: [{ price: PRICE_IDS[plan], quantity: 1 }],
    mode: 'subscription',
    allow_promotion_codes: true,
    billing_address_collection: 'auto',
    locale: 'pt-BR',
    success_url: `${APP_URL}/dashboard?checkout=success&plan=${plan}`,
    cancel_url: `${APP_URL}/pricing?canceled=true`,
    subscription_data: {
      metadata: { broker_id: broker.id, plan },
    },
  })

  redirect(session.url!)
}

export async function createPortalSession() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const sb: AnySupabase = supabase
  const { data: broker } = await sb
    .from('brokers')
    .select('stripe_customer_id')
    .eq('user_id', user.id)
    .single()

  if (!broker?.stripe_customer_id) redirect('/pricing')

  const session = await stripe.billingPortal.sessions.create({
    customer: broker.stripe_customer_id,
    return_url: `${APP_URL}/configuracoes`,
  })

  redirect(session.url)
}
