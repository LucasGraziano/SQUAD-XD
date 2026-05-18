import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import {
  syncSubscription,
  handleCancellation,
  handlePaymentFailed,
  sendTrialEndingEmail,
} from '@/lib/utils/billing'
import { registerReferralConversion } from '@/app/actions/referral'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Invalid signature'
    return NextResponse.json({ error: message }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await syncSubscription(event.data.object as Stripe.Subscription)
        break
      case 'customer.subscription.deleted':
        await handleCancellation(event.data.object as Stripe.Subscription)
        break
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice)
        break
      case 'customer.subscription.trial_will_end':
        await sendTrialEndingEmail(event.data.object as Stripe.Subscription)
        break
      case 'invoice.payment_succeeded': {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const invoice = event.data.object as any
        const subId = typeof invoice.subscription === 'string'
          ? invoice.subscription
          : invoice.subscription?.id ?? invoice.parent?.subscription_details?.subscription
        if (subId) {
          const sub = await stripe.subscriptions.retrieve(subId)
          await syncSubscription(sub)
        }
        break
      }
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const customerId = typeof session.customer === 'string'
          ? session.customer
          : session.customer?.id
        if (customerId) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const supabase = createAdminClient() as any
          const { data: broker } = await supabase
            .from('brokers')
            .select('id, referral_code_id')
            .eq('stripe_customer_id', customerId)
            .single()
          if (broker?.referral_code_id) {
            await registerReferralConversion(broker.id)
          }
        }
        break
      }
    }
  } catch (err) {
    console.error(`Webhook handler error [${event.type}]:`, err)
    return NextResponse.json({ error: 'Handler failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
