'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { ImportRow, ImportError } from '@/lib/import/parse-csv'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnySupabase = any

async function getAuth() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { supabase, brokerId: null as string | null }

  const { data: brokerRows } = await supabase
    .from('brokers').select('id').eq('user_id', user.id)
    .order('created_at', { ascending: false }).limit(1)
  return { supabase, brokerId: (brokerRows as { id: string }[] | null)?.[0]?.id ?? null }
}

export type ImportResult = {
  success: number
  errors: ImportError[]
}

export async function importPolicies(rows: ImportRow[]): Promise<ImportResult> {
  const { supabase, brokerId } = await getAuth()
  if (!brokerId) return { success: 0, errors: [{ line: 0, message: 'Não autenticado', raw: {} }] }

  const sb: AnySupabase = supabase
  let success = 0
  const errors: ImportError[] = []

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    const line = i + 2

    try {
      // Find or create client
      let clientId: string | null = null

      // Try CPF first
      if (row.cpf_cliente) {
        const cpf = row.cpf_cliente.replace(/\D/g, '')
        const { data: existing } = await supabase
          .from('clients').select('id').eq('broker_id', brokerId).eq('cpf_cnpj', cpf).maybeSingle()
        if (existing) clientId = (existing as { id: string }).id
      }

      // Try email
      if (!clientId && row.email_cliente) {
        const { data: existing } = await supabase
          .from('clients').select('id').eq('broker_id', brokerId).eq('email', row.email_cliente).maybeSingle()
        if (existing) clientId = (existing as { id: string }).id
      }

      // Try name match
      if (!clientId) {
        const { data: existing } = await supabase
          .from('clients').select('id').eq('broker_id', brokerId).ilike('name', row.cliente_nome).maybeSingle()
        if (existing) clientId = (existing as { id: string }).id
      }

      // Create new client
      if (!clientId) {
        const { data: newClient, error: clientError } = await sb.from('clients').insert({
          broker_id: brokerId,
          name: row.cliente_nome,
          phone: row.telefone_cliente?.replace(/\D/g, '') || '00000000000',
          email: row.email_cliente || null,
          cpf_cnpj: row.cpf_cliente?.replace(/\D/g, '') || null,
          tipo_pessoa: 'pf',
        }).select('id').single()

        if (clientError) { errors.push({ line, message: `Erro ao criar cliente: ${clientError.message}`, raw: {} }); continue }
        clientId = newClient.id
      }

      // Insert policy
      const { error: policyError } = await sb.from('policies').insert({
        broker_id: brokerId,
        client_id: clientId,
        policy_number: row.numero_apolice || null,
        ramo: row.ramo,
        seguradora: row.seguradora,
        start_date: row.inicio_vigencia,
        end_date: row.fim_vigencia,
        premium_total: row.premio_total,
        payment_frequency: 'anual',
        commission_pct: row.comissao_pct ?? 0,
        notes: row.notas || null,
        status: 'ativa',
        metadata: { imported: true },
      })

      if (policyError) { errors.push({ line, message: policyError.message, raw: {} }); continue }
      success++
    } catch (err) {
      errors.push({ line, message: String(err), raw: {} })
    }
  }

  if (success > 0) {
    revalidatePath('/apolices')
    revalidatePath('/clientes')
  }

  return { success, errors }
}
