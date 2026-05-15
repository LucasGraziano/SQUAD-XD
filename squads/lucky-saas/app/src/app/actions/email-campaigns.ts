'use server'

import { createClient } from '@/lib/supabase/server'
import { Resend } from 'resend'
import { revalidatePath } from 'next/cache'
import { buildRenewalEmailHtml } from '@/lib/email/templates'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnySupabase = any

async function getAuth() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { supabase, brokerId: null as string | null, broker: null as null }

  const { data: broker } = await supabase
    .from('brokers')
    .select('id, name, plan, renewal_emails_enabled, renewal_email_custom_text')
    .eq('user_id', user.id)
    .single()

  return {
    supabase,
    brokerId: (broker as { id: string } | null)?.id ?? null,
    broker: broker as { id: string; name: string; plan: string; renewal_emails_enabled: boolean; renewal_email_custom_text: string | null } | null,
  }
}

export async function toggleRenewalEmails(enabled: boolean) {
  const { supabase, brokerId, broker } = await getAuth()
  if (!brokerId || !broker) return { error: 'Não autenticado' }

  if (broker.plan === 'starter') return { error: 'Funcionalidade exclusiva do plano Profissional+' }

  const sb: AnySupabase = supabase
  const { error } = await sb
    .from('brokers')
    .update({ renewal_emails_enabled: enabled })
    .eq('id', brokerId)

  if (error) return { error: error.message }
  revalidatePath('/configuracoes')
  return { success: true }
}

export async function updateRenewalEmailText(text: string) {
  const { supabase, brokerId } = await getAuth()
  if (!brokerId) return { error: 'Não autenticado' }

  const sb: AnySupabase = supabase
  const { error } = await sb
    .from('brokers')
    .update({ renewal_email_custom_text: text || null })
    .eq('id', brokerId)

  if (error) return { error: error.message }
  revalidatePath('/configuracoes')
  return { success: true }
}

export async function getEmailCampaignLogs(limit = 50) {
  const { supabase, brokerId } = await getAuth()
  if (!brokerId) return []

  const { data } = await supabase
    .from('email_campaign_logs')
    .select('*, policies(ramo, seguradora), clients(name, email)')
    .eq('broker_id', brokerId)
    .order('sent_at', { ascending: false })
    .limit(limit)

  return (data ?? []) as Array<{
    id: string
    campaign_type: string
    sent_at: string
    status: string
    error_message: string | null
    policies: { ramo: string; seguradora: string } | null
    clients: { name: string; email: string | null } | null
  }>
}

export async function sendTestRenewalEmail(policyId: string) {
  const { supabase, brokerId, broker } = await getAuth()
  if (!brokerId || !broker) return { error: 'Não autenticado' }

  const { data: policy } = await supabase
    .from('policies')
    .select('*, clients(name, email)')
    .eq('id', policyId)
    .eq('broker_id', brokerId)
    .single()

  if (!policy) return { error: 'Apólice não encontrada' }

  const p = policy as {
    ramo: string; seguradora: string; end_date: string;
    clients: { name: string; email: string | null } | null
  }
  if (!p.clients?.email) return { error: 'Cliente sem e-mail cadastrado' }

  const resend = new Resend(process.env.RESEND_API_KEY)
  const { data: emailData, error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? 'noreply@premia.app',
    to: p.clients.email,
    subject: `[TESTE] Lembrete de Renovação — ${p.seguradora}`,
    html: buildRenewalEmailHtml({
      clientName: p.clients.name,
      seguradora: p.seguradora,
      ramo: p.ramo,
      endDate: p.end_date,
      brokerName: broker.name,
      customText: broker.renewal_email_custom_text,
      daysBeforeExpiry: 30,
      optOutToken: 'test',
    }),
  })

  if (error) return { error: (error as { message: string }).message }
  return { success: true, emailId: emailData?.id }
}

