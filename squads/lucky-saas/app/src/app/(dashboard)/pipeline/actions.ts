'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { CreateLeadInput, LeadActivity, LeadStatus } from '@/types/lead'

// Supabase v2 strict inference resolves Insert/Update types as never — sb cast required for mutations
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnySupabase = any

async function getBrokerId(supabase: Awaited<ReturnType<typeof createClient>>, userId: string) {
  const result = await supabase
    .from('brokers')
    .select('id')
    .eq('user_id', userId)
    .single()
  const broker = result.data as { id: string } | null
  return broker?.id ?? null
}

export async function createLead(input: CreateLeadInput) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autenticado' }

  const brokerId = await getBrokerId(supabase, user.id)
  if (!brokerId) return { error: 'Corretor não encontrado' }

  const sb: AnySupabase = supabase
  const { data: lead, error } = await sb
    .from('leads')
    .insert({
      broker_id: brokerId,
      name: input.name,
      phone: input.phone,
      email: input.email || null,
      ramo: input.ramo || null,
      source: input.source || 'manual',
      notes: input.notes || null,
      status: 'novo',
      last_activity_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) return { error: error.message }

  await sb.from('lead_activities').insert({
    lead_id: lead.id,
    broker_id: brokerId,
    type: 'status_change',
    content: 'Lead criado',
  })

  revalidatePath('/pipeline')
  return { data: lead }
}

export async function moveLead(leadId: string, newStatus: LeadStatus, previousStatus: LeadStatus) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autenticado' }

  const brokerId = await getBrokerId(supabase, user.id)
  if (!brokerId) return { error: 'Corretor não encontrado' }

  const now = new Date().toISOString()
  const sb: AnySupabase = supabase

  const { error } = await sb
    .from('leads')
    .update({
      status: newStatus,
      last_activity_at: now,
      closed_at: newStatus === 'fechado' ? now : null,
    })
    .eq('id', leadId)

  if (error) return { error: error.message }

  await sb.from('lead_activities').insert({
    lead_id: leadId,
    broker_id: brokerId,
    type: 'status_change',
    content: newStatus,
    previous_status: previousStatus,
  })

  revalidatePath('/pipeline')
  return { success: true }
}

export async function addNote(leadId: string, content: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autenticado' }

  const brokerId = await getBrokerId(supabase, user.id)
  if (!brokerId) return { error: 'Corretor não encontrado' }

  const sb: AnySupabase = supabase
  const { data: activity, error } = await sb
    .from('lead_activities')
    .insert({
      lead_id: leadId,
      broker_id: brokerId,
      type: 'note',
      content,
    })
    .select()
    .single()

  if (error) return { error: error.message }

  await sb
    .from('leads')
    .update({ last_activity_at: new Date().toISOString() })
    .eq('id', leadId)

  revalidatePath('/pipeline')
  return { data: activity as LeadActivity }
}

export async function updateRecovery(
  leadId: string,
  input: { expected_renewal_date?: string | null; recovery_notes?: string | null }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autenticado' }

  const brokerId = await getBrokerId(supabase, user.id)
  if (!brokerId) return { error: 'Corretor não encontrado' }

  const sb: AnySupabase = supabase
  const { error } = await sb
    .from('leads')
    .update({
      expected_renewal_date: input.expected_renewal_date || null,
      recovery_notes: input.recovery_notes || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', leadId)
    .eq('broker_id', brokerId)

  if (error) return { error: error.message }

  if (input.expected_renewal_date) {
    await scheduleRecoveryAlerts(leadId, brokerId, input.expected_renewal_date)
  }

  revalidatePath('/pipeline')
  revalidatePath('/pipeline/recuperacoes')
  return { success: true }
}

async function scheduleRecoveryAlerts(leadId: string, brokerId: string, renewalDate: string) {
  const supabase = await createClient()
  const sb: AnySupabase = supabase

  await sb
    .from('alerts')
    .delete()
    .eq('lead_id', leadId)
    .eq('type', 'recovery_reminder')

  const renewal = new Date(renewalDate)

  const alert30 = new Date(renewal)
  alert30.setDate(alert30.getDate() - 30)

  const alert7 = new Date(renewal)
  alert7.setDate(alert7.getDate() - 7)

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const alerts = [
    { days: 30, date: alert30 },
    { days: 7, date: alert7 },
  ]
    .filter(({ date }) => date >= today)
    .map(({ days, date }) => ({
      broker_id: brokerId,
      lead_id: leadId,
      type: 'recovery_reminder',
      title: `Renovação em ${days} dias`,
      description: `Seguro do lead vence em ${days} dias (${new Date(renewalDate).toLocaleDateString('pt-BR')}). Hora de recontatar.`,
      scheduled_for: date.toISOString().split('T')[0],
      status: 'pending',
    }))

  if (alerts.length > 0) {
    await sb.from('alerts').insert(alerts)
  }
}

export async function fetchRecoveryLeads(): Promise<{ data: import('@/types/lead').Lead[] }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: [] }

  const brokerId = await getBrokerId(supabase, user.id)
  if (!brokerId) return { data: [] }

  const { data } = await supabase
    .from('leads')
    .select('*')
    .eq('broker_id', brokerId)
    .eq('status', 'perdido')
    .not('expected_renewal_date', 'is', null)
    .order('expected_renewal_date', { ascending: true })

  return { data: (data as unknown as import('@/types/lead').Lead[]) ?? [] }
}

export async function fetchLeadActivities(leadId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('lead_activities')
    .select('*')
    .eq('lead_id', leadId)
    .order('created_at', { ascending: false })

  if (error) return { error: error.message }
  return { data: data as LeadActivity[] }
}
