'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  ArrowLeft, Download, FileText, ChevronDown,
  ChevronUp, Clock,
} from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

// Singleton fora do componente — não recria a cada render
const supabase = createClient()
import { decryptNote } from '@/lib/crypto'
import { hasSessionKey, getSessionPassword } from '@/lib/session-key'
import { UnlockModal } from '@/components/prontuario/unlock-modal'
import { NoteEditor } from '@/components/prontuario/note-editor'
import { Header } from '@/components/layout/header'
import { initials } from '@/lib/utils'
import { StaggerGroup, StaggerItem } from '@/components/ui/motion'

const STATUS_COLOR: Record<string, string> = {
  completed:   'bg-semantic-success-bg text-semantic-success border-green-200',
  cancelled:   'bg-semantic-danger-bg text-semantic-danger border-semantic-danger/20',
  no_show:     'bg-orange-50 text-orange-700 border-orange-200',
  scheduled:   'bg-brand-sand text-brand-teal border-brand-sand-dark',
  confirmed:   'bg-semantic-success-bg text-semantic-success border-green-200',
  rescheduled: 'bg-blue-50 text-blue-700 border-blue-200',
}

const STATUS_LABEL: Record<string, string> = {
  completed: 'Realizada', cancelled: 'Cancelada', no_show: 'Falta',
  scheduled: 'Agendada', confirmed: 'Confirmada', rescheduled: 'Reagendada',
}

export default function ProntuarioPage() {
  const { patientId } = useParams<{ patientId: string }>()

  const [unlocked, setUnlocked] = useState(false)
  const [patient, setPatient] = useState<{ full_name: string; birth_date: string | null; notes: string | null } | null>(null)
  const [sessions, setSessions] = useState<Array<{
    id: string
    scheduled_at: string
    status: string
    session_number: number
    duration_minutes: number
    session_notes: Array<{
      id: string
      content_encrypted: string
      content_iv: string
      content_salt: string
      is_immutable: boolean
      decryptedContent?: string
    }>
  }>>([])
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    if (hasSessionKey()) setUnlocked(true)
  }, [])

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setLoadError(false)
      try {
        const [{ data: pat }, { data: sess, error: sessError }] = await Promise.all([
          supabase
            .from('patients')
            .select('full_name, birth_date, notes')
            .eq('id', patientId)
            .single(),
          supabase
            .from('sessions')
            .select('id, scheduled_at, status, session_number, duration_minutes')
            .eq('patient_id', patientId)
            .order('scheduled_at', { ascending: false }),
        ])

        if (cancelled) return

        if (sessError) { setLoadError(true); return }

        setPatient(pat)

        // Fetch session notes separately — avoids embedded join FK dependency
        const sessionIds = (sess ?? []).map(s => s.id)
        const { data: notes } = sessionIds.length > 0
          ? await supabase.from('session_notes').select('*').in('session_id', sessionIds)
          : { data: [] }

        if (cancelled) return

        const notesById = new Map<string, typeof sessions[0]['session_notes']>()
        for (const n of notes ?? []) {
          const arr = notesById.get(n.session_id) ?? []
          arr.push(n)
          notesById.set(n.session_id, arr)
        }

        setSessions(
          (sess ?? []).map(s => ({ ...s, session_notes: notesById.get(s.id) ?? [] })) as typeof sessions
        )
      } catch {
        if (!cancelled) setLoadError(true)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [patientId])

  async function handleExpand(sessionId: string) {
    if (expandedId === sessionId) {
      setExpandedId(null)
      return
    }

    setExpandedId(sessionId)

    const password = getSessionPassword()
    if (!password) return

    const session = sessions.find(s => s.id === sessionId)
    if (!session || !session.session_notes.length) return

    const decryptedNotes = await Promise.all(
      session.session_notes.map(async (n) => {
        if (n.decryptedContent) return n
        try {
          const plain = await decryptNote(n, password)
          return { ...n, decryptedContent: plain }
        } catch {
          return { ...n, decryptedContent: '[Não foi possível descriptografar]' }
        }
      })
    )

    setSessions(prev => prev.map(s =>
      s.id === sessionId ? { ...s, session_notes: decryptedNotes } : s
    ))
  }

  async function saveNote(sessionId: string, data: {
    content_encrypted: string
    content_iv: string
    content_salt: string
    techniques: string[]
    themes: string[]
    tasks: string[]
    next_objectives: string
  }) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: psy } = await supabase
      .from('psychologists')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!psy?.id) return

    await supabase.from('session_notes').upsert({
      session_id: sessionId,
      psychologist_id: psy.id,
      patient_id: patientId,
      content_encrypted: data.content_encrypted,
      content_iv: data.content_iv,
      content_salt: data.content_salt,
      is_immutable: false,
    }, { onConflict: 'session_id' })
  }

  async function exportPDF() {
    const { exportProntuarioPDF } = await import('@/lib/pdf-export')
    await exportProntuarioPDF(patient, sessions, getSessionPassword() ?? '')
  }

  if (!unlocked) {
    return <UnlockModal onUnlocked={() => setUnlocked(true)} />
  }

  return (
    <>
      <Header
        title={patient?.full_name ?? 'Prontuário'}
        subtitle={`${sessions.filter(s => s.status === 'completed').length} sessões realizadas`}
      />

      <main className="flex-1 p-6 max-w-3xl">
        {/* Top actions */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/pacientes"
            className="flex items-center gap-1.5 text-sm text-neutral-secondary hover:text-brand-teal transition-colors"
          >
            <ArrowLeft size={14} />
            Pacientes
          </Link>
          <motion.button
            onClick={exportPDF}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 border border-neutral-border text-neutral-charcoal hover:border-brand-teal/40 hover:text-brand-teal text-sm font-medium px-4 py-2 rounded-input transition-all"
          >
            <Download size={15} strokeWidth={1.5} />
            Exportar PDF
          </motion.button>
        </div>

        {/* Patient summary */}
        {patient && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-vinculo p-5 mb-6 flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-full bg-brand-teal flex items-center justify-center text-white font-semibold flex-shrink-0">
              {initials(patient.full_name)}
            </div>
            <div>
              <p className="font-semibold text-neutral-charcoal">{patient.full_name}</p>
              {patient.birth_date && (
                <p className="text-xs text-neutral-secondary">
                  Nasc. {format(new Date(patient.birth_date), 'dd/MM/yyyy')}
                </p>
              )}
              {patient.notes && (
                <p className="text-xs text-neutral-secondary mt-0.5 italic">"{patient.notes}"</p>
              )}
            </div>
          </motion.div>
        )}

        {/* Timeline */}
        <div className="relative">
          <div className="timeline-line" />
          {loading ? (
            <p className="text-sm text-neutral-secondary pl-10">Carregando sessões...</p>
          ) : loadError ? (
            <div className="text-center py-12 pl-10">
              <p className="text-sm text-semantic-danger mb-2">Erro ao carregar sessões.</p>
              <button
                onClick={() => { setLoadError(false); setLoading(true) }}
                className="text-xs text-brand-teal underline"
              >
                Tentar novamente
              </button>
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-12 pl-10">
              <FileText size={36} strokeWidth={1} className="mx-auto mb-3 text-neutral-border" />
              <p className="text-sm text-neutral-secondary">Nenhuma sessão registrada ainda</p>
            </div>
          ) : (
            <StaggerGroup className="space-y-4" staggerChildren={0.05}>
              {sessions.map((session) => {
                const isExpanded = expandedId === session.id
                const hasNote = session.session_notes.length > 0
                const note = session.session_notes[0]

                return (
                  <StaggerItem key={session.id}>
                    <div className="relative pl-10">
                      {/* Timeline dot */}
                      <motion.div
                        className={`absolute left-2.5 top-5 w-3 h-3 rounded-full border-2 border-white ${
                          session.status === 'completed' ? 'bg-semantic-success' :
                          session.status === 'no_show'  ? 'bg-orange-400' :
                          session.status === 'cancelled'? 'bg-semantic-danger' :
                          'bg-brand-teal'
                        }`}
                      />

                      <div className="card-vinculo overflow-hidden">
                        {/* Session header */}
                        <button
                          onClick={() => handleExpand(session.id)}
                          className="w-full flex items-start justify-between p-4 hover:bg-neutral-mist/40 transition-colors text-left"
                        >
                          <div className="flex items-start gap-3">
                            <div>
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-badge border ${STATUS_COLOR[session.status]}`}>
                                  {STATUS_LABEL[session.status]}
                                </span>
                                <span className="text-xs text-neutral-secondary">
                                  Sessão #{session.session_number}
                                </span>
                              </div>
                              <p className="text-sm font-medium text-neutral-charcoal">
                                {format(parseISO(session.scheduled_at), "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                              </p>
                              <div className="flex items-center gap-1 text-xs text-neutral-secondary mt-0.5">
                                <Clock size={11} />
                                {format(parseISO(session.scheduled_at), 'HH:mm')} · {session.duration_minutes}min
                                {hasNote && (
                                  <span className="ml-2 text-brand-teal">• Nota registrada</span>
                                )}
                              </div>
                            </div>
                          </div>
                          {isExpanded ? (
                            <ChevronUp size={16} className="text-neutral-secondary flex-shrink-0 mt-1" />
                          ) : (
                            <ChevronDown size={16} className="text-neutral-secondary flex-shrink-0 mt-1" />
                          )}
                        </button>

                        {/* Expanded note */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                              className="overflow-hidden"
                            >
                              <div className="p-4 pt-0 border-t border-neutral-border">
                                {session.status === 'completed' ? (
                                  <NoteEditor
                                    sessionId={session.id}
                                    patientName={patient?.full_name ?? ''}
                                    sessionNumber={session.session_number}
                                    existingNote={note}
                                    onSave={(data) => saveNote(session.id, data)}
                                  />
                                ) : (
                                  <p className="text-sm text-neutral-secondary py-3 italic">
                                    Sessão {STATUS_LABEL[session.status].toLowerCase()} — sem nota clínica.
                                  </p>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </StaggerItem>
                )
              })}
            </StaggerGroup>
          )}
        </div>
      </main>
    </>
  )
}
