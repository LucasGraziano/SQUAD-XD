import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// ── Score algorithm ────────────────────────────────────────────
// Factors (weighted):
//   40% — Absence rate (no_shows / total_sessions, last 90 days)
//   30% — Days since last completed session (capped at 60 days → 30 pts)
//   20% — Reschedule pattern (rescheduled / total_sessions)
//   10% — Consecutive missed sessions streak

function computeScore(sessions: Array<{ status: string; scheduled_at: string }>): {
  score: number
  level: 'low' | 'medium' | 'high' | 'critical'
  absence_rate: number
  days_since_last: number
  reschedule_pattern: number
} {
  const total = sessions.length
  if (total === 0) return { score: 0, level: 'low' as const, absence_rate: 0, days_since_last: 0, reschedule_pattern: 0 }

  const noShows     = sessions.filter(s => s.status === 'no_show').length
  const completed   = sessions.filter(s => s.status === 'completed')
  const rescheduled = sessions.filter(s => s.status === 'rescheduled').length

  const absence_rate        = (noShows / total) * 100
  const reschedule_pattern  = (rescheduled / total) * 100

  // Days since last completed session
  const lastCompleted = completed.sort((a, b) =>
    new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime()
  )[0]
  const days_since_last = lastCompleted
    ? Math.floor((Date.now() - new Date(lastCompleted.scheduled_at).getTime()) / 86_400_000)
    : 90 // never had a completed session → max

  // Consecutive no-show streak (most recent sessions first)
  const sorted = [...sessions].sort((a, b) =>
    new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime()
  )
  let streak = 0
  for (const s of sorted) {
    if (s.status === 'no_show' || s.status === 'cancelled') streak++
    else break
  }

  // Raw score (0-100)
  const raw =
    (absence_rate * 0.40) +
    (Math.min(days_since_last, 60) / 60 * 100 * 0.30) +
    (reschedule_pattern * 0.20) +
    (Math.min(streak, 5) / 5 * 100 * 0.10)

  const score = Math.min(Math.round(raw), 100)

  const level =
    score >= 75 ? 'critical' :
    score >= 50 ? 'high'     :
    score >= 25 ? 'medium'   : 'low'

  return {
    score,
    level: level as 'low' | 'medium' | 'high' | 'critical',
    absence_rate: Math.round(absence_rate * 100) / 100,
    days_since_last,
    reschedule_pattern: Math.round(reschedule_pattern * 100) / 100,
  }
}

export async function POST(_req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const { data: psy } = await supabase
    .from('psychologists')
    .select('id')
    .eq('user_id', user.id)
    .single()
  if (!psy) return NextResponse.json({ error: 'Psicólogo não encontrado' }, { status: 404 })

  // Active patients
  const { data: patients } = await supabase
    .from('patients')
    .select('id')
    .eq('psychologist_id', psy.id)
    .eq('status', 'active')

  if (!patients?.length) return NextResponse.json({ updated: 0 })

  // Sessions from last 90 days
  const since = new Date(Date.now() - 90 * 86_400_000).toISOString()
  const { data: sessions } = await supabase
    .from('sessions')
    .select('patient_id, status, scheduled_at')
    .eq('psychologist_id', psy.id)
    .gte('scheduled_at', since)

  const sessionsByPatient = new Map<string, Array<{ status: string; scheduled_at: string }>>()
  for (const s of sessions ?? []) {
    if (!sessionsByPatient.has(s.patient_id)) sessionsByPatient.set(s.patient_id, [])
    sessionsByPatient.get(s.patient_id)!.push(s)
  }

  const today = new Date().toISOString().slice(0, 10)

  // Delete today's existing scores to allow fresh recalculation
  // (unique constraint uses ::DATE cast — not supported by Supabase upsert directly)
  await supabase
    .from('abandonment_scores')
    .delete()
    .eq('psychologist_id', psy.id)
    .gte('calculated_at', today + 'T00:00:00Z')
    .lt('calculated_at', today + 'T23:59:59Z')

  const upserts = patients.map(p => {
    const slist = sessionsByPatient.get(p.id) ?? []
    const { score, level, absence_rate, days_since_last, reschedule_pattern } = computeScore(slist)
    return {
      psychologist_id: psy.id,
      patient_id: p.id,
      score,
      level,
      absence_rate,
      days_since_last_session: days_since_last,
      confirmation_response_rate: 100, // placeholder — would need WhatsApp data
      reschedule_pattern,
      alert_sent: false,
      dismissed: false,
      calculated_at: new Date().toISOString(),
    }
  })

  await supabase.from('abandonment_scores').insert(upserts)

  return NextResponse.json({ updated: upserts.length })
}
