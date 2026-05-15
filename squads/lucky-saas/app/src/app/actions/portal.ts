'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnySupabase = any

async function getAuth() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { supabase, brokerId: null }
  const result = await supabase.from('brokers').select('id').eq('user_id', user.id)
    .order('created_at', { ascending: false }).limit(1)
  const brokerId = (result.data as { id: string }[] | null)?.[0]?.id ?? null
  return { supabase, brokerId }
}

export async function generateClientToken(
  clientId: string,
  expiresInDays?: number
): Promise<{ token: string | null; error: string | null }> {
  const { supabase, brokerId } = await getAuth()
  if (!brokerId) return { token: null, error: 'Não autenticado' }

  // Revoga tokens ativos existentes para este cliente
  const sb: AnySupabase = supabase
  await sb
    .from('client_portal_tokens')
    .update({ revoked_at: new Date().toISOString() })
    .eq('broker_id', brokerId)
    .eq('client_id', clientId)
    .is('revoked_at', null)

  const expiresAt = expiresInDays
    ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000).toISOString()
    : null

  const { data, error } = await sb
    .from('client_portal_tokens')
    .insert({
      broker_id: brokerId,
      client_id: clientId,
      expires_at: expiresAt,
    })
    .select('token')
    .single()

  if (error) return { token: null, error: error.message }

  revalidatePath(`/clientes/${clientId}`)
  return { token: (data as { token: string }).token, error: null }
}

export async function revokeClientToken(
  tokenId: string,
  clientId: string
): Promise<{ error: string | null }> {
  const { supabase, brokerId } = await getAuth()
  if (!brokerId) return { error: 'Não autenticado' }

  const sb: AnySupabase = supabase
  const { error } = await sb
    .from('client_portal_tokens')
    .update({ revoked_at: new Date().toISOString() })
    .eq('id', tokenId)
    .eq('broker_id', brokerId)

  if (error) return { error: error.message }

  revalidatePath(`/clientes/${clientId}`)
  return { error: null }
}

export async function getClientToken(
  clientId: string
): Promise<{ id: string; token: string; expires_at: string | null } | null> {
  const { supabase, brokerId } = await getAuth()
  if (!brokerId) return null

  const { data } = await supabase
    .from('client_portal_tokens')
    .select('id, token, expires_at')
    .eq('broker_id', brokerId)
    .eq('client_id', clientId)
    .is('revoked_at', null)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  return data as { id: string; token: string; expires_at: string | null } | null
}
