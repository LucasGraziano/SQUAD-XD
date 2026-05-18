'use server'

import { randomBytes } from 'crypto'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { Resend } from 'resend'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnySupabase = any

function generateCode(): string {
  return randomBytes(4).toString('hex') // 8-char hex, e.g. "a3f7c2d9"
}

export async function createBrokerAndReferral(opts: {
  name: string
  susep: string | null
  email: string
  userId: string
  ramos: string[]
  cartSize: string
  referralCode?: string | null
}) {
  const supabase = createAdminClient() as AnySupabase

  // Resolve referral code before upserting broker
  let referralCodeId: string | null = null
  let trialDays = 14

  if (opts.referralCode) {
    const { data: refCode } = await supabase
      .from('referral_codes')
      .select('id')
      .eq('code', opts.referralCode)
      .single()
    if (refCode) {
      referralCodeId = refCode.id
      trialDays = 21
    }
  }

  const trialEndsAt = new Date(Date.now() + trialDays * 86400000).toISOString()

  const { data: broker, error } = await supabase
    .from('brokers')
    .upsert({
      user_id: opts.userId,
      name: opts.name,
      susep: opts.susep,
      email: opts.email,
      settings: { ramos: opts.ramos, cart_size: opts.cartSize },
      referral_code_id: referralCodeId,
      trial_ends_at: trialEndsAt,
    })
    .select('id')
    .single()

  if (error || !broker) return { error: error?.message ?? 'Erro ao criar conta' }

  // Generate referral code for this new broker
  let code = generateCode()
  let attempts = 0
  while (attempts < 5) {
    const { error: codeErr } = await supabase
      .from('referral_codes')
      .insert({ broker_id: broker.id, code })
    if (!codeErr) break
    code = generateCode()
    attempts++
  }

  // Register conversion if referred
  if (referralCodeId) {
    await supabase.from('referral_conversions').insert({
      referral_code_id: referralCodeId,
      referred_broker_id: broker.id,
    })
  }

  return { error: null }
}

export async function getReferralStats() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const admin = createAdminClient() as AnySupabase

  const { data: broker } = await admin
    .from('brokers')
    .select('id')
    .eq('user_id', user.id)
    .single()
  if (!broker) return null

  const { data: refCode } = await admin
    .from('referral_codes')
    .select('id, code')
    .eq('broker_id', broker.id)
    .single()

  if (!refCode) return null

  const { data: conversions } = await admin
    .from('referral_conversions')
    .select('id, converted_at, reward_applied_at')
    .eq('referral_code_id', refCode.id)

  const total = conversions?.length ?? 0
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const converted = conversions?.filter((c: any) => c.converted_at).length ?? 0
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const credits = conversions?.filter((c: any) => c.reward_applied_at).length ?? 0

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://premia.app'
  const referralLink = `${appUrl}/ref/${refCode.code}`

  return { referralLink, total, converted, credits }
}

export async function registerReferralConversion(brokerId: string) {
  const admin = createAdminClient() as AnySupabase

  const { data: conv } = await admin
    .from('referral_conversions')
    .select('id, referral_code_id, converted_at')
    .eq('referred_broker_id', brokerId)
    .single()

  if (!conv || conv.converted_at) return

  await admin
    .from('referral_conversions')
    .update({ converted_at: new Date().toISOString() })
    .eq('id', conv.id)

  // Send email notification to referrer
  if (process.env.RESEND_API_KEY) {
    const { data: refCode } = await admin
      .from('referral_codes')
      .select('broker_id')
      .eq('id', conv.referral_code_id)
      .single()

    if (refCode?.broker_id) {
      const { data: referrer } = await admin
        .from('brokers')
        .select('name, email')
        .eq('id', refCode.broker_id)
        .single()

      const { data: referred } = await admin
        .from('brokers')
        .select('name')
        .eq('id', brokerId)
        .single()

      if (referrer?.email) {
        const resend = new Resend(process.env.RESEND_API_KEY)
        const referredName = referred?.name ?? 'Seu indicado'
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev',
          to: referrer.email,
          subject: `🎉 ${referredName} assinou o Premia! Seu crédito de 1 mês foi aplicado.`,
          html: `<p>Olá ${referrer.name ?? ''},</p>
<p>🎉 <strong>${referredName}</strong> assinou o Premia através da sua indicação!</p>
<p>Seu crédito de 1 mês foi aplicado e será descontado na sua próxima fatura.</p>
<p><a href="${process.env.NEXT_PUBLIC_APP_URL ?? 'https://premia.app'}/dashboard">Ver no dashboard</a></p>`,
        })
      }
    }
  }
}

export async function applyReferralCredit(conversionId: string) {
  const admin = createAdminClient() as AnySupabase
  const { stripe } = await import('@/lib/stripe')

  const { data: conv } = await admin
    .from('referral_conversions')
    .select('referral_code_id')
    .eq('id', conversionId)
    .single()
  if (!conv) return

  const { data: refCode } = await admin
    .from('referral_codes')
    .select('broker_id')
    .eq('id', conv.referral_code_id)
    .single()
  if (!refCode) return

  const { data: referrer } = await admin
    .from('brokers')
    .select('stripe_customer_id, plan')
    .eq('id', refCode.broker_id)
    .single()

  if (!referrer?.stripe_customer_id) return

  // Credit value = 1 month of current plan price in cents
  const PLAN_PRICES: Record<string, number> = {
    solo: 4700, profissional: 9700, equipe: 19700,
    starter: 4700, pro: 9700, broker: 19700,
  }
  const creditAmount = PLAN_PRICES[referrer.plan] ?? 9700

  await stripe.customers.createBalanceTransaction(referrer.stripe_customer_id, {
    amount: -creditAmount,
    currency: 'brl',
    description: 'Crédito referral — 1 mês grátis por indicação convertida',
  })

  await admin
    .from('referral_conversions')
    .update({ reward_applied_at: new Date().toISOString() })
    .eq('id', conversionId)
}
