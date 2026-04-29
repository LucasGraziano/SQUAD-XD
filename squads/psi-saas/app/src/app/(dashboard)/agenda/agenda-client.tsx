'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  format, addWeeks, subWeeks, startOfWeek, addDays,
  isSameDay, parseISO, isToday,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, Plus, Clock, X, Check, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { initials } from '@/lib/utils'
import { HoverCard } from '@/components/ui/motion'

interface Session {
  id: string
  patient_id: string
  scheduled_at: string
  duration_minutes: number
  status: string
  session_number: number
  price_cents: number
  billing_cycle: string
  patients: { id: string; full_name: string; phone: string | null } | null
}

interface Patient {
  id: string
  full_name: string
  phone: string | null
  session_price_cents: number | null
  billing_cycle: 'per_session' | 'weekly' | 'monthly' | null
}

interface Props {
  sessions: Session[]
  patients: Patient[]
  psychologistId: string
  defaultDuration: number
  defaultPrice: number
  defaultBillingCycle: 'per_session' | 'weekly' | 'monthly'
}

const STATUS_COLORS: Record<string, string> = {
  scheduled:  'bg-brand-sand border-brand-sand-dark text-brand-teal',
  confirmed:  'bg-semantic-success-bg border-green-200 text-semantic-success',
  completed:  'bg-neutral-mist border-neutral-border text-neutral-secondary',
  cancelled:  'bg-semantic-danger-bg border-semantic-danger/20 text-semantic-danger',
  no_show:    'bg-orange-50 border-orange-200 text-orange-700',
  rescheduled:'bg-semantic-info-bg border-blue-200 text-semantic-info',
}

const STATUS_LABEL: Record<string, string> = {
  scheduled:  'Agendada',
  confirmed:  'Confirmada',
  completed:  'Realizada',
  cancelled:  'Cancelada',
  no_show:    'Falta',
  rescheduled:'Reagendada',
}

const RECURRENCE_OPTIONS = [
  { value: 'once',      label: 'Uma vez' },
  { value: 'weekly',    label: 'Toda semana' },
  { value: 'biweekly',  label: 'A cada 2 semanas' },
  { value: 'monthly',   label: 'Todo mês' },
]

export function AgendaClient({ sessions, patients, psychologistId, defaultDuration, defaultPrice, defaultBillingCycle }: Props) {
  const router = useRouter()
  const supabase = createClient()

  const [currentWeek, setCurrentWeek] = useState(new Date())
  const [showNewSession, setShowNewSession] = useState(false)
  const [selectedSession, setSelectedSession] = useState<Session | null>(null)
  const [saving, setSaving] = useState(false)
  const [conflictError, setConflictError] = useState<string | null>(null)

  // New session form
  const [form, setForm] = useState({
    patient_id: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '09:00',
    duration: String(defaultDuration),
    modality: 'presential',
    recurrence: 'weekly',
  })

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 })
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  function sessionsForDay(day: Date) {
    return sessions.filter((s) => isSameDay(parseISO(s.scheduled_at), day))
  }

  async function createSession() {
    if (!form.patient_id) return
    setSaving(true)
    setConflictError(null)

    const scheduledAt = new Date(`${form.date}T${form.time}:00`)
    const durationMin = parseInt(form.duration)
    const scheduledEnd = new Date(scheduledAt.getTime() + durationMin * 60_000)
    const patient = patients.find((p) => p.id === form.patient_id)

    // Conflict validation: check for overlapping sessions that day
    const dayStart = new Date(scheduledAt); dayStart.setHours(0, 0, 0, 0)
    const dayEnd   = new Date(scheduledAt); dayEnd.setHours(23, 59, 59, 999)
    const { data: existing } = await supabase
      .from('sessions')
      .select('id, scheduled_at, duration_minutes, patients(full_name)')
      .eq('psychologist_id', psychologistId)
      .in('status', ['scheduled', 'confirmed'])
      .gte('scheduled_at', dayStart.toISOString())
      .lte('scheduled_at', dayEnd.toISOString())

    const conflict = (existing ?? []).find(s => {
      const start = new Date(s.scheduled_at)
      const end   = new Date(start.getTime() + s.duration_minutes * 60_000)
      return scheduledAt < end && scheduledEnd > start
    })

    if (conflict) {
      const conflictName = (conflict.patients as { full_name: string } | null)?.full_name ?? 'outro paciente'
      const conflictTime = format(parseISO(conflict.scheduled_at), 'HH:mm', { locale: ptBR })
      setConflictError(`Conflito com sessão de ${conflictName} às ${conflictTime}`)
      setSaving(false)
      return
    }

    // Count existing sessions for this patient to get session_number
    const { count } = await supabase
      .from('sessions')
      .select('*', { count: 'exact', head: true })
      .eq('patient_id', form.patient_id)

    const baseSession = {
      psychologist_id: psychologistId,
      patient_id: form.patient_id,
      duration_minutes: durationMin,
      status: 'scheduled' as const,
      modality: form.modality as 'presential' | 'online',
      price_cents: patient?.session_price_cents ?? defaultPrice,
      billing_cycle: (patient?.billing_cycle ?? defaultBillingCycle) as 'per_session' | 'weekly' | 'monthly',
      whatsapp_confirmation_sent: false,
    }

    if (form.recurrence === 'once') {
      await supabase.from('sessions').insert({
        ...baseSession,
        scheduled_at: scheduledAt.toISOString(),
        session_number: (count ?? 0) + 1,
      })
    } else {
      const weeks = form.recurrence === 'weekly' ? 12 : form.recurrence === 'biweekly' ? 6 : 3
      const interval = form.recurrence === 'weekly' ? 1 : form.recurrence === 'biweekly' ? 2 : 4

      const sessionsToCreate = Array.from({ length: weeks }, (_, i) => {
        const dt = new Date(scheduledAt)
        dt.setDate(dt.getDate() + i * interval * 7)
        return {
          ...baseSession,
          scheduled_at: dt.toISOString(),
          session_number: (count ?? 0) + i + 1,
        }
      })

      await supabase.from('sessions').insert(sessionsToCreate)
    }

    setSaving(false)
    setShowNewSession(false)
    router.refresh()
  }

  async function updateSessionStatus(sessionId: string, status: string) {
    await supabase
      .from('sessions')
      .update({ status: status as 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show' | 'rescheduled' })
      .eq('id', sessionId)

    // Auto-create payment when session is completed (billing_cycle: per_session)
    if (status === 'completed' && selectedSession && selectedSession.billing_cycle === 'per_session') {
      const today = new Date().toISOString().split('T')[0]
      await supabase.from('payments').insert({
        psychologist_id: psychologistId,
        patient_id: selectedSession.patient_id,
        session_id: sessionId,
        amount_cents: selectedSession.price_cents,
        billing_cycle: 'per_session' as const,
        due_date: today,
      })

      // Notify patient via WhatsApp (best-effort, don't block UI)
      if (selectedSession.patients?.phone) {
        fetch('/api/whatsapp/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session_id: sessionId, type: 'payment' }),
        }).catch(() => undefined)
      }
    }

    setSelectedSession(null)
    router.refresh()
  }

  return (
    <main className="flex-1 p-6 flex flex-col">
      {/* Week Navigation */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentWeek((w) => subWeeks(w, 1))}
            className="p-2 rounded-lg border border-neutral-border hover:bg-neutral-mist transition-all"
          >
            <ChevronLeft size={16} />
          </button>
          <h2 className="font-semibold text-neutral-charcoal text-sm">
            {format(weekStart, "d 'de' MMMM", { locale: ptBR })} –{' '}
            {format(addDays(weekStart, 6), "d 'de' MMMM", { locale: ptBR })}
          </h2>
          <button
            onClick={() => setCurrentWeek((w) => addWeeks(w, 1))}
            className="p-2 rounded-lg border border-neutral-border hover:bg-neutral-mist transition-all"
          >
            <ChevronRight size={16} />
          </button>
          <button
            onClick={() => setCurrentWeek(new Date())}
            className="px-3 py-1.5 text-xs font-medium text-brand-teal border border-brand-teal/30 rounded-lg hover:bg-brand-teal/5 transition-all"
          >
            Hoje
          </button>
        </div>

        <motion.button
          onClick={() => setShowNewSession(true)}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 bg-brand-teal hover:bg-brand-teal-dark text-white text-sm font-semibold px-4 py-2.5 rounded-input transition-colors"
        >
          <Plus size={16} />
          Nova sessão
        </motion.button>
      </div>

      {/* Weekly Grid */}
      <div className="flex-1 grid grid-cols-7 gap-2 overflow-auto">
        {weekDays.map((day) => {
          const daySessions = sessionsForDay(day)
          const today = isToday(day)

          return (
            <div key={day.toISOString()} className="min-h-0">
              {/* Day header */}
              <div className={`text-center py-2 rounded-lg mb-2 ${today ? 'bg-brand-teal' : ''}`}>
                <p className={`text-[10px] font-medium uppercase tracking-wide ${today ? 'text-brand-sand' : 'text-neutral-secondary'}`}>
                  {format(day, 'EEE', { locale: ptBR })}
                </p>
                <p className={`text-lg font-semibold tabular-nums ${today ? 'text-white' : 'text-neutral-charcoal'}`}>
                  {format(day, 'd')}
                </p>
              </div>

              {/* Sessions */}
              <div className="space-y-1.5">
                <AnimatePresence>
                  {daySessions.map((session) => (
                    <motion.button
                      key={session.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      onClick={() => setSelectedSession(session)}
                      className={`w-full text-left p-2 rounded-lg border text-xs transition-all hover:shadow-sm ${STATUS_COLORS[session.status] ?? STATUS_COLORS.scheduled}`}
                    >
                      <p className="font-semibold truncate text-[11px] leading-tight mb-0.5">
                        {session.patients?.full_name.split(' ')[0]}
                      </p>
                      <div className="flex items-center gap-1 opacity-70">
                        <Clock size={9} strokeWidth={2} />
                        <span className="tabular-nums">{format(parseISO(session.scheduled_at), 'HH:mm')}</span>
                      </div>
                    </motion.button>
                  ))}
                </AnimatePresence>

                {daySessions.length === 0 && (
                  <button
                    onClick={() => {
                      setForm((f) => ({ ...f, date: format(day, 'yyyy-MM-dd') }))
                      setShowNewSession(true)
                    }}
                    className="w-full h-10 rounded-lg border-2 border-dashed border-neutral-border/50 text-neutral-secondary/40 hover:border-brand-teal/30 hover:text-brand-teal/40 transition-all flex items-center justify-center"
                  >
                    <Plus size={14} />
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* New Session Modal */}
      <AnimatePresence>
        {showNewSession && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNewSession(false)}
              className="fixed inset-0 bg-neutral-charcoal/40 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, x: '-50%', y: 'calc(-50% + 16px)' }}
              animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
              exit={{ opacity: 0, scale: 0.95, x: '-50%', y: 'calc(-50% + 8px)' }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              style={{ top: '50%', left: '50%' }}
              className="fixed w-[calc(100%-2rem)] max-w-md z-50 bg-white rounded-card shadow-modal p-6"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold text-neutral-charcoal">Nova sessão</h2>
                <button onClick={() => setShowNewSession(false)} className="p-1.5 rounded-lg hover:bg-neutral-mist transition-all">
                  <X size={16} className="text-neutral-secondary" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Conflict error */}
                <AnimatePresence>
                  {conflictError && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-2 bg-semantic-danger-bg border border-semantic-danger/20 text-semantic-danger text-xs px-3 py-2.5 rounded-input"
                    >
                      <AlertCircle size={13} />
                      {conflictError}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Patient */}
                <div>
                  <label className="block text-sm font-medium text-neutral-charcoal mb-1.5">Paciente *</label>
                  <select
                    value={form.patient_id}
                    onChange={(e) => { setConflictError(null); setForm((f) => ({ ...f, patient_id: e.target.value })) }}
                    className="w-full px-3.5 py-2.5 rounded-input border border-neutral-border bg-white text-sm text-neutral-charcoal focus:outline-none focus:ring-2 focus:ring-brand-teal focus:ring-offset-1"
                  >
                    <option value="">Selecione o paciente</option>
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>{p.full_name}</option>
                    ))}
                  </select>
                </div>

                {/* Date + Time */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-neutral-charcoal mb-1.5">Data *</label>
                    <input
                      type="date"
                      value={form.date}
                      onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-input border border-neutral-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal focus:ring-offset-1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-charcoal mb-1.5">Horário *</label>
                    <input
                      type="time"
                      value={form.time}
                      onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-input border border-neutral-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal focus:ring-offset-1"
                    />
                  </div>
                </div>

                {/* Duration + Modality */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-neutral-charcoal mb-1.5">Duração</label>
                    <select
                      value={form.duration}
                      onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-input border border-neutral-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal focus:ring-offset-1"
                    >
                      {[40, 50, 60, 80, 90].map((d) => (
                        <option key={d} value={d}>{d} min</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-charcoal mb-1.5">Modalidade</label>
                    <select
                      value={form.modality}
                      onChange={(e) => setForm((f) => ({ ...f, modality: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-input border border-neutral-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal focus:ring-offset-1"
                    >
                      <option value="presential">Presencial</option>
                      <option value="online">Online</option>
                    </select>
                  </div>
                </div>

                {/* Recurrence */}
                <div>
                  <label className="block text-sm font-medium text-neutral-charcoal mb-1.5">Recorrência</label>
                  <div className="grid grid-cols-2 gap-2">
                    {RECURRENCE_OPTIONS.map(({ value, label }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, recurrence: value }))}
                        className={`py-2 px-3 rounded-lg border text-xs font-medium transition-all ${
                          form.recurrence === value
                            ? 'bg-brand-teal text-white border-brand-teal'
                            : 'border-neutral-border text-neutral-secondary hover:border-brand-teal/30'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  {form.recurrence !== 'once' && (
                    <p className="text-xs text-neutral-secondary mt-1.5">
                      {form.recurrence === 'weekly' ? '12 sessões' : form.recurrence === 'biweekly' ? '6 sessões' : '3 sessões'} serão criadas automaticamente
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setShowNewSession(false)}
                    className="flex-1 border border-neutral-border text-neutral-charcoal text-sm font-medium py-2.5 rounded-input hover:bg-neutral-mist transition-colors"
                  >
                    Cancelar
                  </button>
                  <motion.button
                    onClick={createSession}
                    disabled={!form.patient_id || saving}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex-1 bg-brand-teal hover:bg-brand-teal-dark disabled:opacity-60 text-white font-semibold py-2.5 rounded-input transition-colors flex items-center justify-center gap-2"
                  >
                    {saving ? (
                      <motion.span
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                      />
                    ) : <Check size={15} />}
                    Agendar
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Session Detail Modal */}
      <AnimatePresence>
        {selectedSession && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSession(null)}
              className="fixed inset-0 bg-neutral-charcoal/40 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ opacity: 0, y: 20, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: 10, x: '-50%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              style={{ bottom: '1.5rem', left: '50%' }}
              className="fixed w-[calc(100%-2rem)] max-w-sm z-50 bg-white rounded-card shadow-modal p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-brand-teal flex items-center justify-center text-white text-xs font-semibold">
                    {initials(selectedSession.patients?.full_name ?? '?')}
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-charcoal text-sm">
                      {selectedSession.patients?.full_name}
                    </p>
                    <p className="text-xs text-neutral-secondary">
                      {format(parseISO(selectedSession.scheduled_at), "HH:mm 'hs' · dd/MM/yyyy")} · {selectedSession.duration_minutes}min
                    </p>
                  </div>
                </div>
                <button onClick={() => setSelectedSession(null)} className="p-1.5 rounded-lg hover:bg-neutral-mist">
                  <X size={15} className="text-neutral-secondary" />
                </button>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-badge border ${STATUS_COLORS[selectedSession.status]}`}>
                  {STATUS_LABEL[selectedSession.status]}
                </span>
                <span className="text-xs text-neutral-secondary">Sessão #{selectedSession.session_number}</span>
              </div>

              <p className="text-xs text-neutral-secondary mb-3">Atualizar status:</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { status: 'confirmed', label: 'Confirmar' },
                  { status: 'completed', label: 'Realizada' },
                  { status: 'no_show',  label: 'Falta' },
                  { status: 'cancelled',label: 'Cancelar' },
                ].map(({ status, label }) => (
                  <button
                    key={status}
                    onClick={() => updateSessionStatus(selectedSession.id, status)}
                    disabled={selectedSession.status === status}
                    className={`py-2 px-3 rounded-lg border text-xs font-medium transition-all disabled:opacity-40 ${STATUS_COLORS[status]}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  )
}
