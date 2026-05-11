'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { syncEventToGoogle, updateEventInGoogle, deleteEventFromGoogle, isGoogleConnected } from '@/lib/google-calendar'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnySupabase = any

export type EventType = 'meeting' | 'call' | 'visit' | 'followup'

export interface CalendarEvent {
  id: string
  broker_id: string
  client_id: string | null
  policy_id: string | null
  title: string
  event_type: EventType
  scheduled_at: string
  duration_minutes: number
  notes: string | null
  google_event_id: string | null
  is_done: boolean
  created_at: string
  clients?: { name: string; phone: string | null } | null
}

async function getAuth() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { supabase, user: null, brokerId: null as string | null }
  const { data } = await supabase.from('brokers').select('id').eq('user_id', user.id).single()
  const broker = data as { id: string } | null
  return { supabase, user, brokerId: broker?.id ?? null }
}

export async function getCalendarEvents(params: {
  from?: string
  to?: string
  includeDone?: boolean
} = {}): Promise<CalendarEvent[]> {
  const { supabase, brokerId } = await getAuth()
  if (!brokerId) return []

  let query = supabase
    .from('calendar_events')
    .select('*, clients(name, phone)')
    .eq('broker_id', brokerId)
    .order('scheduled_at', { ascending: true })

  if (params.from) query = query.gte('scheduled_at', params.from)
  if (params.to) query = query.lte('scheduled_at', params.to)
  if (!params.includeDone) query = query.eq('is_done', false)

  const { data } = await query
  return (data as CalendarEvent[]) ?? []
}

export interface CreateEventInput {
  title: string
  event_type: EventType
  scheduled_at: string
  duration_minutes: number
  client_id?: string | null
  policy_id?: string | null
  notes?: string | null
  sync_google?: boolean
}

export async function createCalendarEvent(input: CreateEventInput): Promise<{ data?: CalendarEvent; error?: string }> {
  const { supabase, brokerId } = await getAuth()
  if (!brokerId) return { error: 'Não autenticado' }

  const sb: AnySupabase = supabase
  const { data, error } = await sb
    .from('calendar_events')
    .insert({
      broker_id: brokerId,
      title: input.title,
      event_type: input.event_type,
      scheduled_at: input.scheduled_at,
      duration_minutes: input.duration_minutes,
      client_id: input.client_id || null,
      policy_id: input.policy_id || null,
      notes: input.notes || null,
    })
    .select('*, clients(name, phone)')
    .single()

  if (error) return { error: error.message }

  const event = data as CalendarEvent

  if (input.sync_google && await isGoogleConnected(brokerId)) {
    const googleId = await syncEventToGoogle({
      brokerId,
      eventId: event.id,
      title: event.title,
      scheduledAt: event.scheduled_at,
      durationMinutes: event.duration_minutes,
      notes: event.notes,
      clientName: event.clients?.name ?? null,
      eventType: event.event_type,
    })
    if (googleId) {
      await sb.from('calendar_events').update({ google_event_id: googleId }).eq('id', event.id)
      event.google_event_id = googleId
    }
  }

  revalidatePath('/agenda')
  revalidatePath('/dashboard')
  return { data: event }
}

export async function updateCalendarEvent(
  id: string,
  input: Partial<CreateEventInput>
): Promise<{ error?: string }> {
  const { supabase, brokerId } = await getAuth()
  if (!brokerId) return { error: 'Não autenticado' }

  // Fetch current event to get google_event_id and client name
  const { data: existing } = await supabase
    .from('calendar_events')
    .select('*, clients(name, phone)')
    .eq('id', id)
    .eq('broker_id', brokerId)
    .single()

  const current = existing as CalendarEvent | null

  const sb: AnySupabase = supabase
  const { error } = await sb
    .from('calendar_events')
    .update({
      ...(input.title !== undefined && { title: input.title }),
      ...(input.event_type !== undefined && { event_type: input.event_type }),
      ...(input.scheduled_at !== undefined && { scheduled_at: input.scheduled_at }),
      ...(input.duration_minutes !== undefined && { duration_minutes: input.duration_minutes }),
      client_id: input.client_id ?? current?.client_id ?? null,
      policy_id: input.policy_id ?? current?.policy_id ?? null,
      notes: input.notes !== undefined ? (input.notes || null) : (current?.notes ?? null),
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('broker_id', brokerId)

  if (error) return { error: error.message }

  // Sync update to Google Calendar if event was previously synced
  if (current?.google_event_id) {
    const merged = {
      title: input.title ?? current.title,
      scheduledAt: input.scheduled_at ?? current.scheduled_at,
      durationMinutes: input.duration_minutes ?? current.duration_minutes,
      notes: input.notes !== undefined ? input.notes : current.notes,
      eventType: input.event_type ?? current.event_type,
    }

    // Fetch client name if client changed
    let clientName = current.clients?.name ?? null
    if (input.client_id !== undefined && input.client_id !== current.client_id) {
      if (input.client_id) {
        const { data: client } = await supabase
          .from('clients')
          .select('name')
          .eq('id', input.client_id)
          .single()
        clientName = (client as { name: string } | null)?.name ?? null
      } else {
        clientName = null
      }
    }

    await updateEventInGoogle({
      brokerId,
      googleEventId: current.google_event_id,
      title: merged.title,
      scheduledAt: merged.scheduledAt,
      durationMinutes: merged.durationMinutes,
      notes: merged.notes,
      clientName,
      eventType: merged.eventType,
    })
  }

  revalidatePath('/agenda')
  revalidatePath('/dashboard')
  return {}
}

export async function toggleEventDone(id: string, isDone: boolean): Promise<{ error?: string }> {
  const { supabase, brokerId } = await getAuth()
  if (!brokerId) return { error: 'Não autenticado' }

  const sb: AnySupabase = supabase
  const { error } = await sb
    .from('calendar_events')
    .update({ is_done: isDone, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('broker_id', brokerId)

  if (error) return { error: error.message }
  revalidatePath('/agenda')
  revalidatePath('/dashboard')
  return {}
}

export async function deleteCalendarEvent(id: string): Promise<{ error?: string }> {
  const { supabase, brokerId } = await getAuth()
  if (!brokerId) return { error: 'Não autenticado' }

  const { data: ev } = await supabase
    .from('calendar_events')
    .select('google_event_id')
    .eq('id', id)
    .eq('broker_id', brokerId)
    .single()

  const event = ev as { google_event_id: string | null } | null

  const sb: AnySupabase = supabase
  const { error } = await sb
    .from('calendar_events')
    .delete()
    .eq('id', id)
    .eq('broker_id', brokerId)

  if (error) return { error: error.message }

  if (event?.google_event_id) {
    await deleteEventFromGoogle(brokerId, event.google_event_id)
  }

  revalidatePath('/agenda')
  revalidatePath('/dashboard')
  return {}
}

export async function disconnectGoogleCalendar(): Promise<{ error?: string }> {
  const { supabase, brokerId } = await getAuth()
  if (!brokerId) return { error: 'Não autenticado' }

  const sb: AnySupabase = supabase
  const { error } = await sb.from('google_calendar_tokens').delete().eq('broker_id', brokerId)
  if (error) return { error: error.message }

  revalidatePath('/configuracoes')
  return {}
}
