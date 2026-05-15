import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { Resend } from 'resend'
import { buildRenewalEmailHtml } from '@/lib/email/templates'
import { SignJWT } from 'jose'

const TARGETS = [60, 30, 15] as const

async function generateOptOutToken(clientId: string) {
  const secretValue = process.env.NEXTAUTH_SECRET
  if (!secretValue) throw new Error('NEXTAUTH_SECRET is not configured')
  const secret = new TextEncoder().encode(secretValue)
  return new SignJWT({ clientId })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('1y')
    .sign(secret)
}

export async function POST(req: NextRequest) {
  const cronSecret = req.headers.get('x-cron-secret')
  if (cronSecret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = await createClient()
  const resend = new Resend(process.env.RESEND_API_KEY)

  const today = new Date()
  let sent = 0
  let errors = 0

  for (const days of TARGETS) {
    const target = new Date(today)
    target.setDate(target.getDate() + days)
    const targetDate = target.toISOString().split('T')[0]

    const { data: policies } = await supabase
      .from('policies')
      .select(`
        id, ramo, seguradora, end_date,
        broker_id,
        clients(id, name, email, email_opt_out),
        brokers(id, name, renewal_emails_enabled, renewal_email_custom_text, plan)
      `)
      .eq('status', 'ativa')
      .eq('end_date', targetDate)

    if (!policies) continue

    for (const policy of policies as Array<{
      id: string; ramo: string; seguradora: string; end_date: string; broker_id: string;
      clients: { id: string; name: string; email: string | null; email_opt_out: boolean } | null;
      brokers: { id: string; name: string; renewal_emails_enabled: boolean; renewal_email_custom_text: string | null; plan: string } | null;
    }>) {
      if (!policy.brokers?.renewal_emails_enabled) continue
      if (policy.brokers.plan === 'starter') continue
      if (!policy.clients?.email) continue
      if (policy.clients.email_opt_out) continue

      const campaignType = `renewal_${days}d`

      const { count: alreadySent } = await supabase
        .from('email_campaign_logs')
        .select('id', { count: 'exact', head: true })
        .eq('policy_id', policy.id)
        .eq('campaign_type', campaignType)

      if ((alreadySent ?? 0) > 0) continue

      const optOutToken = await generateOptOutToken(policy.clients.id)

      const { data: emailData, error: emailError } = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL ?? 'noreply@premia.app',
        to: policy.clients.email,
        subject: `Lembrete de Renovação — ${policy.seguradora} vence em ${days} dias`,
        html: buildRenewalEmailHtml({
          clientName: policy.clients.name,
          seguradora: policy.seguradora,
          ramo: policy.ramo,
          endDate: policy.end_date,
          brokerName: policy.brokers.name,
          customText: policy.brokers.renewal_email_custom_text,
          daysBeforeExpiry: days,
          optOutToken,
        }),
      })

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sb = supabase as any
      await sb.from('email_campaign_logs').insert({
        broker_id: policy.broker_id,
        policy_id: policy.id,
        client_id: policy.clients.id,
        campaign_type: campaignType,
        resend_id: emailData?.id ?? null,
        status: emailError ? 'failed' : 'sent',
        error_message: emailError ? (emailError as { message: string }).message : null,
      })

      if (emailError) errors++
      else sent++
    }
  }

  return NextResponse.json({ sent, errors })
}
