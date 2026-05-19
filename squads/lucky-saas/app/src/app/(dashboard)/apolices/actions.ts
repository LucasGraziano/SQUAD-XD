'use server'

import { createClient as createSupabase } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Client, CreateClientInput } from '@/types/client'
import type { CreatePolicyInput, Policy } from '@/types/policy'
import { updateOnboardingStep } from '@/app/actions/onboarding'

// Supabase v2 strict mode resolves Insert/Update types as never for several tables.
// We cast the client to any for mutation operations only — reads use the typed client.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnySupabase = any

async function getAuth() {
  const supabase = await createSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { supabase, user: null, brokerId: null as string | null }

  const result = await supabase
    .from('brokers')
    .select('id')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)

  const broker = (result.data as { id: string }[] | null)?.[0] ?? null
  return { supabase, user, brokerId: broker?.id ?? null }
}

// ── Clients ──────────────────────────────────────────────────────────────────

export async function findClientByCpf(cpf: string): Promise<Client | null> {
  const { supabase, brokerId } = await getAuth()
  if (!brokerId) return null

  const normalized = cpf.replace(/\D/g, '')
  const { data } = await supabase
    .from('clients')
    .select('*')
    .eq('broker_id', brokerId)
    .eq('cpf_cnpj', normalized)
    .maybeSingle()

  return (data as Client | null)
}

export async function searchClients(query: string): Promise<Client[]> {
  const { supabase, brokerId } = await getAuth()
  if (!brokerId) return []

  const { data } = await supabase
    .from('clients')
    .select('*')
    .eq('broker_id', brokerId)
    .or(`name.ilike.%${query}%,phone.ilike.%${query}%,email.ilike.%${query}%`)
    .order('name')
    .limit(8)

  return (data as Client[]) ?? []
}

export async function createClientAction(input: CreateClientInput) {
  const { supabase, brokerId } = await getAuth()
  if (!brokerId) return { error: 'Não autenticado' }

  const sb: AnySupabase = supabase
  const { data, error } = await sb
    .from('clients')
    .insert({
      broker_id: brokerId,
      name: input.name,
      phone: input.phone,
      email: input.email || null,
      cpf_cnpj: input.cpf_cnpj ? input.cpf_cnpj.replace(/\D/g, '') : null,
      birth_date: input.birth_date || null,
      cep: input.cep ? input.cep.replace(/\D/g, '') : null,
      tipo_pessoa: input.tipo_pessoa || 'pf',
      notes: input.notes || null,
    })
    .select()
    .single()

  if (error) return { error: error.message }
  updateOnboardingStep('first_client').catch(() => {})
  revalidatePath('/clientes')
  return { data: data as Client }
}

export async function updateClientAction(id: string, input: Partial<CreateClientInput>) {
  const { supabase, brokerId } = await getAuth()
  if (!brokerId) return { error: 'Não autenticado' }

  const sb: AnySupabase = supabase
  const { data, error } = await sb
    .from('clients')
    .update({
      name: input.name,
      phone: input.phone,
      email: input.email ?? null,
      cpf_cnpj: input.cpf_cnpj ? input.cpf_cnpj.replace(/\D/g, '') : null,
      birth_date: input.birth_date ?? null,
      cep: input.cep ? input.cep.replace(/\D/g, '') : null,
      tipo_pessoa: input.tipo_pessoa ?? 'pf',
      notes: input.notes ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('broker_id', brokerId)
    .select()
    .single()

  if (error) return { error: error.message }
  revalidatePath('/clientes')
  revalidatePath(`/clientes/${id}`)
  return { data: data as Client }
}

// ── Policies ─────────────────────────────────────────────────────────────────

export async function createPolicy(input: CreatePolicyInput) {
  const { supabase, brokerId } = await getAuth()
  if (!brokerId) return { error: 'Não autenticado' }

  const sb: AnySupabase = supabase
  const { data: policy, error } = await sb
    .from('policies')
    .insert({
      broker_id: brokerId,
      client_id: input.client_id,
      policy_number: input.policy_number || null,
      ramo: input.ramo,
      seguradora: input.seguradora,
      start_date: input.start_date,
      end_date: input.end_date,
      premium_total: input.premium_total,
      payment_frequency: input.payment_frequency,
      commission_pct: input.commission_pct,
      notes: input.notes || null,
      metadata: input.metadata ?? {},
      status: 'ativa',
    })
    .select('*, clients(*)')
    .single()

  if (error) return { error: error.message }

  await scheduleRenewalAlerts(supabase, brokerId, policy.id, input.end_date)
  updateOnboardingStep('first_apolice').catch(() => {})

  revalidatePath('/apolices')
  return { data: policy as Policy }
}

export async function updatePolicy(id: string, input: Partial<CreatePolicyInput>) {
  const { supabase, brokerId } = await getAuth()
  if (!brokerId) return { error: 'Não autenticado' }

  const sb: AnySupabase = supabase
  const { data: policy, error } = await sb
    .from('policies')
    .update({
      ...input,
      policy_number: input.policy_number || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select('*, clients(*)')
    .single()

  if (error) return { error: error.message }

  if (input.end_date) {
    await sb.from('alerts').delete().eq('policy_id', id).in('type', ['renewal_90d', 'renewal_60d', 'renewal_30d'])
    await scheduleRenewalAlerts(supabase, brokerId, id, input.end_date)
  }

  revalidatePath('/apolices')
  return { data: policy as Policy }
}

export async function archivePolicy(id: string) {
  const { supabase, brokerId } = await getAuth()
  if (!brokerId) return { error: 'Não autenticado' }

  const sb: AnySupabase = supabase
  const { error } = await sb
    .from('policies')
    .update({ status: 'cancelada', updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('broker_id', brokerId)

  if (error) return { error: error.message }
  revalidatePath('/apolices')
  return { success: true }
}

export async function unarchivePolicy(id: string) {
  const { supabase, brokerId } = await getAuth()
  if (!brokerId) return { error: 'Não autenticado' }

  const sb: AnySupabase = supabase
  const { error } = await sb
    .from('policies')
    .update({ status: 'ativa', updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('broker_id', brokerId)

  if (error) return { error: error.message }
  revalidatePath('/apolices')
  return { success: true }
}

export async function deletePolicy(id: string) {
  const { supabase, brokerId } = await getAuth()
  if (!brokerId) return { error: 'Não autenticado' }

  const sb: AnySupabase = supabase
  await sb.from('alerts').delete().eq('policy_id', id).eq('broker_id', brokerId)
  const { error } = await sb.from('policies').delete().eq('id', id).eq('broker_id', brokerId)

  if (error) return { error: error.message }
  revalidatePath('/apolices')
  revalidatePath('/clientes')
  return { success: true }
}

export async function deleteClient(id: string) {
  const { supabase, brokerId } = await getAuth()
  if (!brokerId) return { error: 'Não autenticado' }

  const sb: AnySupabase = supabase
  const { error } = await sb.from('clients').delete().eq('id', id).eq('broker_id', brokerId)

  if (error) return { error: error.message }
  revalidatePath('/clientes')
  return { success: true }
}

export async function bulkImportClients(rows: {
  name: string; phone: string; email?: string; cpf_cnpj?: string
  birth_date?: string; cep?: string; tipo_pessoa?: string; notes?: string
}[]) {
  const { supabase, brokerId } = await getAuth()
  if (!brokerId) return { error: 'Não autenticado', imported: 0, skipped: 0 }

  const sb: AnySupabase = supabase
  let imported = 0
  let skipped = 0

  for (const row of rows) {
    if (!row.name?.trim()) { skipped++; continue }
    const cpf = row.cpf_cnpj?.replace(/\D/g, '') || null
    const { error } = await sb.from('clients').insert({
      broker_id: brokerId,
      name: row.name.trim(),
      phone: row.phone?.replace(/\D/g, '') || null,
      email: row.email?.trim() || null,
      cpf_cnpj: cpf,
      birth_date: row.birth_date || null,
      cep: row.cep?.replace(/\D/g, '') || null,
      tipo_pessoa: row.tipo_pessoa?.toLowerCase() === 'pj' ? 'pj' : 'pf',
      notes: row.notes?.trim() || null,
    })
    if (error) skipped++
    else imported++
  }

  revalidatePath('/clientes')
  return { imported, skipped }
}

export async function bulkImportPolicies(rows: {
  client_name: string; client_phone?: string; client_cpf?: string
  ramo: string; seguradora: string; policy_number?: string
  start_date: string; end_date: string; premium_total: number
  commission_pct: number; payment_frequency: string
  franquia?: number; status?: string; notes?: string
}[]) {
  const { supabase, brokerId } = await getAuth()
  if (!brokerId) return { error: 'Não autenticado', imported: 0, skipped: 0 }

  const sb: AnySupabase = supabase
  let imported = 0
  let skipped = 0

  const VALID_STATUSES = ['ativa', 'cancelada', 'suspensa', 'nao_cliente', 'inativa', 'arquivada']

  for (const row of rows) {
    if (!row.ramo || !row.seguradora || !row.start_date || !row.end_date) { skipped++; continue }

    let clientId: string | null = null
    const cpfNorm = row.client_cpf?.replace(/\D/g, '') || null

    if (cpfNorm) {
      // Prefer CPF/CNPJ lookup (precise)
      const { data: byCpf } = await supabase
        .from('clients')
        .select('id')
        .eq('broker_id', brokerId)
        .eq('cpf_cnpj', cpfNorm)
        .maybeSingle()
      if (byCpf) clientId = (byCpf as { id: string }).id
    }

    if (!clientId && row.client_name?.trim()) {
      // Fallback: name lookup
      const { data: byName } = await supabase
        .from('clients')
        .select('id')
        .eq('broker_id', brokerId)
        .ilike('name', row.client_name.trim())
        .maybeSingle()
      if (byName) clientId = (byName as { id: string }).id
    }

    if (!clientId && row.client_name?.trim()) {
      // Create new client
      const { data: newClient } = await sb.from('clients').insert({
        broker_id: brokerId,
        name: row.client_name.trim(),
        phone: row.client_phone?.replace(/\D/g, '') || null,
        cpf_cnpj: cpfNorm,
        tipo_pessoa: 'pf',
      }).select('id').single()
      clientId = newClient?.id ?? null
    }

    if (!clientId) { skipped++; continue }

    const policyStatus = row.status && VALID_STATUSES.includes(row.status.toLowerCase())
      ? row.status.toLowerCase()
      : 'ativa'

    const { error } = await sb.from('policies').insert({
      broker_id: brokerId,
      client_id: clientId,
      ramo: row.ramo,
      seguradora: row.seguradora,
      policy_number: row.policy_number || null,
      start_date: row.start_date,
      end_date: row.end_date,
      premium_total: row.premium_total,
      payment_frequency: row.payment_frequency || 'anual',
      commission_pct: row.commission_pct || 0,
      franquia: row.franquia ?? null,
      status: policyStatus,
      notes: row.notes?.trim() || null,
      metadata: {},
    })
    if (error) skipped++
    else imported++
  }

  revalidatePath('/apolices')
  revalidatePath('/clientes')
  return { imported, skipped }
}

// ── Alerts ───────────────────────────────────────────────────────────────────

async function scheduleRenewalAlerts(
  supabase: Awaited<ReturnType<typeof createSupabase>>,
  brokerId: string,
  policyId: string,
  endDate: string
) {
  const end = new Date(endDate)
  const alertDefs = [
    { type: 'renewal_90d', days: 90, title: 'Renovação em 90 dias' },
    { type: 'renewal_60d', days: 60, title: 'Renovação em 60 dias' },
    { type: 'renewal_30d', days: 30, title: 'Renovação em 30 dias' },
  ]

  const alerts = alertDefs.map(({ type, days, title }) => {
    const scheduled = new Date(end)
    scheduled.setDate(scheduled.getDate() - days)
    return {
      broker_id: brokerId,
      policy_id: policyId,
      type,
      title,
      scheduled_for: scheduled.toISOString().split('T')[0],
      status: 'pending',
    }
  })

  const sb: AnySupabase = supabase
  const { error: insertError } = await sb.from('alerts').insert(alerts)

  // Story 7.9: First Win — set first_alert_fired_at if this is the broker's first alert
  if (!insertError) {
    const { data: broker } = await sb
      .from('brokers')
      .select('first_alert_fired_at')
      .eq('id', brokerId)
      .single()

    if (broker && !broker.first_alert_fired_at) {
      await sb
        .from('brokers')
        .update({ first_alert_fired_at: new Date().toISOString() })
        .eq('id', brokerId)
    }
  }
}

export async function fetchPolicies({
  tab = 'todas',
  search = '',
  ramo = '',
  page = 1,
  perPage = 25,
  sortBy = 'end_date',
  sortDir = 'asc',
}: {
  tab?: string
  search?: string
  ramo?: string
  page?: number
  perPage?: number
  sortBy?: string
  sortDir?: 'asc' | 'desc'
}) {
  const { supabase, brokerId } = await getAuth()
  if (!brokerId) return { data: [], count: 0 }

  const today = new Date().toISOString().split('T')[0]
  const in30Days = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  let query = supabase
    .from('policies')
    .select('*, clients(id, name, phone, email)', { count: 'exact' })
    .eq('broker_id', brokerId)

  // Tab filters
  if (tab === 'ativas') {
    query = query.eq('status', 'ativa').gte('end_date', today)
  } else if (tab === 'vencendo') {
    query = query.eq('status', 'ativa').gte('end_date', today).lte('end_date', in30Days)
  } else if (tab === 'vencidas') {
    query = query.lt('end_date', today).not('status', 'in', '(cancelada,suspensa)')
  } else if (tab === 'arquivadas') {
    query = query.in('status', ['cancelada', 'suspensa'])
  } else {
    // "todas": exclui arquivadas
    query = query.not('status', 'in', '(cancelada,suspensa)')
  }

  // Search — two-step to avoid unreliable embedded-resource or() in PostgREST
  if (search) {
    const term = `%${search}%`
    const { data: clientMatches } = await supabase
      .from('clients')
      .select('id')
      .eq('broker_id', brokerId)
      .ilike('name', term)
    const clientIds = (clientMatches as { id: string }[] | null)?.map(c => c.id) ?? []

    if (clientIds.length > 0) {
      query = query.or(`policy_number.ilike.${term},client_id.in.(${clientIds.join(',')})`)
    } else {
      query = query.ilike('policy_number', term)
    }
  }

  // Ramo filter
  if (ramo) query = query.eq('ramo', ramo)

  const SORTABLE = ['end_date', 'premium_total', 'commission_expected', 'created_at']
  const column = SORTABLE.includes(sortBy) ? sortBy : 'end_date'
  const ascending = sortDir !== 'desc'

  const from = (page - 1) * perPage
  const { data, count, error } = await query
    .order(column, { ascending })
    .range(from, from + perPage - 1)

  if (error) return { data: [], count: 0 }
  return { data: (data as Policy[]) ?? [], count: count ?? 0 }
}

// ── updatePolicyMetadata ─────────────────────────────────────────────────────

export async function updatePolicyMetadata(
  policyId: string,
  metadata: Record<string, string>
): Promise<{ error?: string }> {
  const { supabase, brokerId } = await getAuth()
  if (!brokerId) return { error: 'Não autenticado' }

  const sb: AnySupabase = supabase
  const { error } = await sb
    .from('policies')
    .update({ metadata, updated_at: new Date().toISOString() })
    .eq('id', policyId)
    .eq('broker_id', brokerId)

  if (error) return { error: error.message }
  revalidatePath(`/apolices/${policyId}`)
  return {}
}

// ── uploadPolicyDocument ─────────────────────────────────────────────────────

export async function uploadPolicyDocument(
  policyId: string,
  formData: FormData
): Promise<{ url?: string; error?: string }> {
  const { supabase, brokerId } = await getAuth()
  if (!brokerId) return { error: 'Não autenticado' }

  const file = formData.get('file') as File | null
  if (!file) return { error: 'Nenhum arquivo enviado' }
  if (file.size > 10 * 1024 * 1024) return { error: 'Arquivo muito grande (máx. 10 MB)' }

  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'pdf'
  const path = `${brokerId}/${policyId}/apolice-${Date.now()}.${ext}`

  const arrayBuffer = await file.arrayBuffer()
  const buffer = new Uint8Array(arrayBuffer)

  const { error: uploadErr } = await supabase.storage
    .from('policy-documents')
    .upload(path, buffer, { contentType: file.type, upsert: true })

  if (uploadErr) return { error: uploadErr.message }

  const { data: urlData } = supabase.storage
    .from('policy-documents')
    .getPublicUrl(path)

  const url = urlData.publicUrl

  // Persist URL in metadata
  const sb: AnySupabase = supabase
  const { data: current } = await sb
    .from('policies')
    .select('metadata')
    .eq('id', policyId)
    .eq('broker_id', brokerId)
    .single()

  const merged = { ...(current?.metadata ?? {}), pdf_url: url, pdf_name: file.name }
  await sb.from('policies')
    .update({ metadata: merged, updated_at: new Date().toISOString() })
    .eq('id', policyId)
    .eq('broker_id', brokerId)

  revalidatePath(`/apolices/${policyId}`)
  return { url }
}
