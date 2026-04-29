'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle2, AlertTriangle, Clock, RefreshCw } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface Session {
  id: string
  scheduled_at: string
  session_number: number
  duration_minutes: number
  patients: { full_name: string } | null
}

interface Props {
  session: Session
  onClose: () => void
}

const OUTCOMES = [
  { value: 'completed',   label: 'Realizada',          icon: CheckCircle2, color: 'text-semantic-success bg-semantic-success-bg border-green-200' },
  { value: 'no_show',     label: 'Falta sem aviso',    icon: AlertTriangle,color: 'text-orange-600 bg-orange-50 border-orange-200' },
  { value: 'cancelled',   label: 'Falta justificada',  icon: Clock,        color: 'text-semantic-warning bg-semantic-warning-bg border-amber-200' },
  { value: 'rescheduled', label: 'Reagendada',         icon: RefreshCw,    color: 'text-semantic-info bg-semantic-info-bg border-blue-200' },
] as const

export function RegisterSessionModal({ session, onClose }: Props) {
  const router = useRouter()
  const supabase = createClient()

  const [selected, setSelected] = useState<string | null>(null)
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)

  async function confirm() {
    if (!selected) return
    setSaving(true)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from('sessions') as any)
      .update({
        status: selected,
        ...(selected === 'completed' ? {} : { cancellation_reason: note || null }),
      })
      .eq('id', session.id)

    // Se realizada e tem nota, abrir prontuário depois
    setDone(true)
    setSaving(false)

    setTimeout(() => {
      onClose()
      router.refresh()
      if (selected === 'completed' && note) {
        router.push(`/prontuario/${session.id}`)
      }
    }, 1200)
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-neutral-charcoal/40 backdrop-blur-sm z-40"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-md z-50 bg-white rounded-card shadow-modal p-6"
      >
        {/* Success state */}
        <AnimatePresence>
          {done && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 bg-white rounded-card flex flex-col items-center justify-center z-10"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
              >
                <CheckCircle2 size={48} className="text-semantic-success mb-3" />
              </motion.div>
              <p className="font-semibold text-neutral-charcoal">Sessão registrada!</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-semibold text-neutral-charcoal">Registrar sessão</h2>
            <p className="text-xs text-neutral-secondary">
              {session.patients?.full_name} · {format(parseISO(session.scheduled_at), "HH:mm 'hs'", { locale: ptBR })}
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-neutral-mist transition-all">
            <X size={16} className="text-neutral-secondary" />
          </button>
        </div>

        {/* Outcome options */}
        <p className="text-xs font-medium text-neutral-secondary mb-2.5">O que aconteceu?</p>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {OUTCOMES.map(({ value, label, icon: Icon, color }) => (
            <motion.button
              key={value}
              onClick={() => setSelected(value)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-medium transition-all ${
                selected === value ? color + ' ring-2 ring-offset-1 ring-brand-teal' : 'border-neutral-border text-neutral-secondary hover:border-neutral-border-dark'
              }`}
            >
              <Icon size={14} strokeWidth={1.5} />
              {label}
            </motion.button>
          ))}
        </div>

        {/* Note */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4"
            >
              <label className="block text-xs font-medium text-neutral-charcoal mb-1.5">
                {selected === 'completed' ? 'Nota rápida (opcional — pode completar depois)' : 'Motivo / Observação'}
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                placeholder={selected === 'completed' ? 'Resumo da sessão...' : 'Ex: Paciente avisou que estava doente...'}
                className="w-full px-3.5 py-2.5 rounded-input border border-neutral-border bg-white text-sm text-neutral-charcoal placeholder:text-neutral-secondary/60 focus:outline-none focus:ring-2 focus:ring-brand-teal focus:ring-offset-1 resize-none transition-all"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border border-neutral-border text-neutral-charcoal text-sm font-medium py-2.5 rounded-input hover:bg-neutral-mist transition-colors"
          >
            Cancelar
          </button>
          <motion.button
            onClick={confirm}
            disabled={!selected || saving}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="flex-1 bg-brand-teal hover:bg-brand-teal-dark disabled:opacity-50 text-white font-semibold py-2.5 rounded-input transition-colors flex items-center justify-center gap-2"
          >
            {saving ? (
              <motion.span
                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
              />
            ) : null}
            Confirmar
          </motion.button>
        </div>
      </motion.div>
    </>
  )
}
