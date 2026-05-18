import { createAdminClient } from '@/lib/supabase/admin'
import { Resend } from 'resend'
import Stripe from 'stripe'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnySupabase = any

export async function getBrokerPlan(userId: string) {
  const supabase = createAdminClient() as AnySupabase
  const { data } = await supabase
    .from('brokers')
    .select('plan, subscription_status, trial_ends_at, current_period_end, stripe_customer_id, id')
    .eq('user_id', userId)
    .single()
  return data as {
    plan: string
    subscription_status: string
    trial_ends_at: string | null
    current_period_end: string | null
    stripe_customer_id: string | null
    id: string
  } | null
}

export async function syncSubscription(subscription: Stripe.Subscription) {
  const supabase = createAdminClient() as AnySupabase
  const brokerId = subscription.metadata?.broker_id
  if (!brokerId) return

  const plan = subscription.metadata?.plan ?? 'profissional'
  const status = subscription.status === 'active' ? 'active'
    : subscription.status === 'past_due' ? 'past_due'
    : subscription.status === 'canceled' ? 'canceled'
    : 'trial'

  await supabase
    .from('brokers')
    .update({
      subscription_id: subscription.id,
      subscription_status: status,
      plan,
      stripe_customer_id: typeof subscription.customer === 'string'
        ? subscription.customer
        : subscription.customer?.id,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      current_period_end: (subscription as any).current_period_end
        ? new Date((subscription as any).current_period_end * 1000).toISOString()
        : null,
      cancel_at_period_end: subscription.cancel_at_period_end ?? false,
    })
    .eq('id', brokerId)
}

export async function handleCancellation(subscription: Stripe.Subscription) {
  const supabase = createAdminClient() as AnySupabase
  const brokerId = subscription.metadata?.broker_id
  if (!brokerId) return

  await supabase
    .from('brokers')
    .update({ subscription_status: 'canceled' })
    .eq('id', brokerId)
}

export async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const supabase = createAdminClient() as AnySupabase
  const customerId = typeof invoice.customer === 'string' ? invoice.customer : invoice.customer?.id
  if (!customerId) return

  const { data: broker } = await supabase
    .from('brokers')
    .select('id, subscription_status')
    .eq('stripe_customer_id', customerId)
    .single()

  if (!broker) return

  await supabase
    .from('brokers')
    .update({ subscription_status: 'past_due' })
    .eq('id', broker.id)

  if (process.env.RESEND_API_KEY) {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const { data: brokerFull } = await supabase
      .from('brokers')
      .select('name, email')
      .eq('id', broker.id)
      .single()

    if (brokerFull?.email) {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev',
        to: brokerFull.email,
        subject: 'Seu pagamento falhou — atualize seu cartão',
        html: `<p>Olá ${brokerFull.name ?? ''},</p>
<p>Não conseguimos processar seu pagamento. Acesse o painel para atualizar seu cartão e manter o acesso ao Premia.</p>
<p><a href="${process.env.NEXT_PUBLIC_APP_URL ?? 'https://premia.app'}/configuracoes">Gerenciar assinatura</a></p>`,
      })
    }
  }
}

export async function sendTrialEndingEmail(subscription: Stripe.Subscription) {
  if (!process.env.RESEND_API_KEY) return
  const supabase = createAdminClient() as AnySupabase
  const brokerId = subscription.metadata?.broker_id
  if (!brokerId) return

  const { data: broker } = await supabase
    .from('brokers')
    .select('name, email, trial_ends_at')
    .eq('id', brokerId)
    .single()

  if (!broker?.email) return

  const trialEnd = subscription.trial_end
    ? new Date(subscription.trial_end * 1000).toLocaleDateString('pt-BR')
    : 'em breve'

  const resend = new Resend(process.env.RESEND_API_KEY)
  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev',
    to: broker.email,
    subject: `Seu trial encerra ${trialEnd} — assine para não perder seus dados`,
    html: `<p>Olá ${broker.name ?? ''},</p>
<p>Seu período de teste gratuito encerra em ${trialEnd}.</p>
<p>Assine agora para continuar usando o Premia e não perder sua carteira de clientes.</p>
<p><a href="${process.env.NEXT_PUBLIC_APP_URL ?? 'https://premia.app'}/pricing">Ver planos</a></p>`,
  })
}
