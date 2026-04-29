'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  AlertTriangle, RefreshCw, User, Clock,
  CalendarOff, RotateCcw, X, PhoneCall, Eye,
} from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Header } from '@/components/layout/header'
import { Reveal, StaggerGroup, StaggerItem } from '@/components/ui/motion'

type Score = {
  id: string
  patient_id: string
  score: number
  level: 'low' | 'medium' | 'high' | 'critical'
  absence_rate: number
  days_since_last_session: number
  reschedule_pattern: number
  dismissed: boolean
  calculated_at: string
  patients: { id: string; full_name: string; phone: string | null } | null
}

const LEVEL_CONFIG = {
  critical: {
    label: 'Crítico',
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-semantic-danger',
    bar: 'bg-semantic-danger',
    badge: 'bg-red-100 text-semantic-danger',
  },
  high: {
    label: 'Alto',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    text: 'text-orange-700',
    bar: 'bg-orange-500',
    badge: 'bg-orange-100 text-orange-700',
  },
  medium: {
    label: 'Médio',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-700',
    bar: 'bg-amber-500',
    badge: 'bg-amber-100 text-amber-700',
  },
  low: {
    label: 'Baixo',
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-700',
    bar: 'bg-green-500',
    badge: 'bg-green-100 text-green-700',
  },
}

const supabase = createClient()

export default function AlertasPage() {
  const [scores, setScores] = useState<Score[]>([])
  const [loading, setLoading] = useState(true)
  const [recalculating, setRecalculating] = useState(false)
  const [filter, setFilter] = useState<'all' | 'critical' | 'high' | 'medium'>('all')

  useEffect(() => { loadScores() }, [])

  async function loadScores() {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: psy } = await supabase
        .from('psychologists')
        .select('id')
        .eq('user_id', user.id)
        .single()
      if (!psy) return

      const { data } = await supabase
        .from('abandonment_scores')
        .select('*, patients(id, full_name, phone)')
        .eq('psychologist_id', psy.id)
        .eq('dismissed', false)
        .in('level', ['medium', 'high', 'critical'])
        .order('score', { ascending: false })

      const seen = new Set<string>()
      const deduped = (data ?? []).filter(s => {
        if (seen.has(s.patient_id)) return false
        seen.add(s.patient_id)
        return true
      })

      setScores(deduped as Score[])
    } finally {
      setLoading(false)
    }
  }

  async function recalculate() {
    setRecalculating(true)
    await fetch('/api/alertas/recalculate', { method: 'POST' })
    await loadScores()
    setRecalculating(false)
  }

  async function dismiss(scoreId: string) {
    await supabase
      .from('abandonment_scores')
      .update({ dismissed: true, dismissed_at: new Date().toISOString() })
      .eq('id', scoreId)
    setScores(prev => prev.filter(s => s.id !== scoreId))
  }

  function whatsappMessage(patient: Score['patients'], score: Score) {
    if (!patient?.phone) return
    const name = patient.full_name.split(' ')[0]
    const msg = encodeURIComponent(
      `Olá, ${name}! Tudo bem? Percebi que faz um tempo que não nos vemos em sessão. Gostaria de verificar como você está e, se possível, retomar nossos encontros. Quando tiver um momento, me avise! 😊`
    )
    const phone = patient.phone.replace(/\D/g, '')
    window.open(`https://wa.me/55${phone}?text=${msg}`, '_blank')
  }

  const filtered = filter === 'all' ? scores : scores.filter(s => s.level === filter)
  const criticalCount = scores.filter(s => s.level === 'critical').length
  const highCount     = scores.filter(s => s.level === 'high').length
  const mediumCount   = scores.filter(s => s.level === 'medium').length

  return (
    <>
      <Header
        title="Alertas de Abandono"
        subtitle={`${scores.length} paciente${scores.length !== 1 ? 's' : ''} em atenção`}
      />

      <main className="flex-1 p-6 max-w-3xl space-y-6">

        {/* Info banner */}
        <Reveal>
          <div className="flex items-start gap-3 bg-neutral-mist border border-neutral-border px-4 py-3 rounded-xl text-xs text-neutral-secondary">
            <AlertTriangle size={14} className="flex-shrink-0 mt-0.5 text-amber-500" />
            O Vínculo analisa frequência, faltas e padrão de remarcação para identificar pacientes
            com risco de abandono. O score é calculado com base nos últimos 90 dias.
          </div>
        </Reveal>

        {/* Summary + Recalculate */}
        <Reveal>
          <div className="card-vinculo p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {[
                  { level: 'critical', count: criticalCount, label: 'Críticos' },
                  { level: 'high',     count: highCount,     label: 'Altos' },
                  { level: 'medium',   count: mediumCount,   label: 'Médios' },
                ].map(({ level, count, label }) => {
                  const cfg = LEVEL_CONFIG[level as keyof typeof LEVEL_CONFIG]
                  return (
                    <div key={level} className="text-center">
                      <p className={`text-2xl font-bold ${cfg.text}`}>{count}</p>
                      <p className="text-xs text-neutral-secondary">{label}</p>
                    </div>
                  )
                })}
              </div>

              <motion.button
                onClick={recalculate}
                disabled={recalculating}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 border border-neutral-border text-sm font-medium text-neutral-charcoal hover:border-brand-teal/40 hover:text-brand-teal px-4 py-2 rounded-input transition-all disabled:opacity-50"
              >
                <motion.span
                  animate={recalculating ? { rotate: 360 } : {}}
                  transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                >
                  <RefreshCw size={14} />
                </motion.span>
                {recalculating ? 'Calculando...' : 'Recalcular'}
              </motion.button>
            </div>
          </div>
        </Reveal>

        {/* Filter tabs */}
        <div className="flex items-center gap-1">
          {(['all', 'critical', 'high', 'medium'] as const).map(f => {
            const cfg = f !== 'all' ? LEVEL_CONFIG[f] : null
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-badge text-xs font-medium transition-all ${
                  filter === f
                    ? 'bg-brand-teal text-white'
                    : 'text-neutral-secondary hover:text-neutral-charcoal hover:bg-neutral-mist'
                }`}
              >
                {f === 'all' ? `Todos (${scores.length})` : `${cfg?.label} (${f === 'critical' ? criticalCount : f === 'high' ? highCount : mediumCount})`}
              </button>
            )
          })}
        </div>

        {/* Alert cards */}
        {loading ? (
          <p className="text-sm text-neutral-secondary">Carregando...</p>
        ) : filtered.length === 0 ? (
          <Reveal>
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={28} strokeWidth={1} className="text-green-500" />
              </div>
              <p className="text-sm font-medium text-neutral-charcoal mb-1">
                {scores.length === 0 ? 'Nenhum alerta ativo' : 'Nenhum alerta nesse nível'}
              </p>
              <p className="text-xs text-neutral-secondary">
                {scores.length === 0
                  ? 'Clique em "Recalcular" para analisar seus pacientes'
                  : 'Todos os pacientes deste nível estão dispensados'}
              </p>
            </div>
          </Reveal>
        ) : (
          <StaggerGroup className="space-y-4" staggerChildren={0.06}>
            {filtered.map((score) => {
              const cfg = LEVEL_CONFIG[score.level]
              return (
                <StaggerItem key={score.id}>
                  <motion.div
                    layout
                    className={`card-vinculo border ${cfg.border} overflow-hidden`}
                  >
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        {/* Patient info */}
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className={`w-10 h-10 rounded-full ${cfg.bg} flex items-center justify-center flex-shrink-0`}>
                            <User size={18} strokeWidth={1.5} className={cfg.text} />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-semibold text-neutral-charcoal text-sm">
                                {score.patients?.full_name ?? '—'}
                              </p>
                              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-badge ${cfg.badge}`}>
                                {cfg.label}
                              </span>
                            </div>
                            <p className="text-xs text-neutral-secondary mt-0.5">
                              Score de risco: <span className={`font-semibold ${cfg.text}`}>{score.score}/100</span>
                            </p>
                          </div>
                        </div>

                        {/* Dismiss */}
                        <button
                          onClick={() => dismiss(score.id)}
                          title="Dispensar alerta"
                          className="p-1.5 rounded-lg hover:bg-neutral-mist text-neutral-secondary transition-all flex-shrink-0"
                        >
                          <X size={14} />
                        </button>
                      </div>

                      {/* Score bar */}
                      <div className="mt-4 mb-3">
                        <div className="h-2 bg-neutral-mist rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${score.score}%` }}
                            transition={{ duration: 1, ease: [0.2, 0, 0, 1] }}
                            className={`h-full rounded-full ${cfg.bar}`}
                          />
                        </div>
                      </div>

                      {/* Indicators */}
                      <div className="grid grid-cols-3 gap-3 mt-3">
                        <div className="flex items-start gap-2">
                          <CalendarOff size={13} className="text-neutral-secondary mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-[10px] text-neutral-secondary">Taxa de faltas</p>
                            <p className="text-xs font-semibold text-neutral-charcoal">
                              {score.absence_rate.toFixed(0)}%
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Clock size={13} className="text-neutral-secondary mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-[10px] text-neutral-secondary">Última sessão</p>
                            <p className="text-xs font-semibold text-neutral-charcoal">
                              {score.days_since_last_session}d atrás
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <RotateCcw size={13} className="text-neutral-secondary mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-[10px] text-neutral-secondary">Remarcações</p>
                            <p className="text-xs font-semibold text-neutral-charcoal">
                              {score.reschedule_pattern.toFixed(0)}%
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-neutral-border">
                        {score.patients?.phone && (
                          <motion.button
                            onClick={() => whatsappMessage(score.patients, score)}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="flex items-center gap-1.5 bg-brand-teal text-white text-xs font-semibold px-3 py-1.5 rounded-input hover:bg-brand-teal-dark transition-colors"
                          >
                            <PhoneCall size={12} />
                            Contatar via WhatsApp
                          </motion.button>
                        )}
                        <Link
                          href={`/prontuario/${score.patient_id}`}
                          className="flex items-center gap-1.5 border border-neutral-border text-xs font-medium text-neutral-charcoal hover:border-brand-teal/40 hover:text-brand-teal px-3 py-1.5 rounded-input transition-all"
                        >
                          <Eye size={12} />
                          Ver prontuário
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                </StaggerItem>
              )
            })}
          </StaggerGroup>
        )}
      </main>
    </>
  )
}
