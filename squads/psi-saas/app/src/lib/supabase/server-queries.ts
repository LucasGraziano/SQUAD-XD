/**
 * Cached server-side queries using React.cache()
 * Deduplicates DB calls within the same request across layout + page components.
 * Without this, every page does getUser() + getPsychologist() independently → 2x sequential calls.
 */

import { cache } from 'react'
import { createClient } from './server'

export const getAuthUser = cache(async () => {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
})

export const getPsychologist = cache(async () => {
  const supabase = await createClient()
  const user = await getAuthUser()
  if (!user) return null

  const { data } = await supabase
    .from('psychologists')
    .select('*')
    .eq('user_id', user.id)
    .single()

  return data
})

export const getPsychologistId = cache(async () => {
  const psy = await getPsychologist()
  return psy?.id ?? null
})
