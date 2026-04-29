'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Sparkles, RefreshCw, Lock, AlertTriangle, Info } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { decryptNote } from '@/lib/crypto'
import { hasSessionKey, getSessionPassword } from '@/lib/session-key'
import { UnlockModal } from '@/components/prontuario/unlock-modal'
import { Header } from '@/components/layout/header'
import { Reveal, StaggerGroup, StaggerItem } from '@/components/ui/motion'

const APPROACH_COLORS: Record<string, string> = {
  TCC:        'bg-blue-500',
  Psicanálise:'bg-purple-500',
  Humanista:  'bg-green-500',
  Gestalt:    'bg-orange-500',
  Sistêmica:  'bg-pink-500',
  ACT:        'bg-teal-500',
  DBT:        'bg-indigo-500',
  Outras:     'bg-neutral-400',
}

interface Analysis {
  dominant_approach: string
  approach_breakdown: Record<string, number>
  top_techniques: string[]
  top_themes: string[]
  insight: string
  confidence_score: number
  notes_analyzed_count: number
  analyzed_at?: string
}

const supabase = createClient()

export default function LinhagemPage() {

  const [unlocked, setUnlocked] = useState(false)
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notesCount, setNotesCount] = useState(0)

  useEffect(() => {
    if (hasSessionKey()) setUnlocked(true)
  }, [])

  useEffect(() => {
    if (!unlocked) return
    loadLastAnalysis()
    countNotes()
  }, [unlocked])

  async function loadLastAnalysis() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: psy } = await supabase
      .from('psychologists')
      .select('id')
      .eq('user_id', user.id)
      .single()

    const { data } = await supabase
      .from('lineage_analyses')
      .select('*')
      .eq('psychologist_id', psy?.id ?? '')
      .order('analyzed_at', { ascending: false })
      .limit(1)
      .single()

    if (data) setAnalysis(data as Analysis)
  }

  async function countNotes() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: psy } = await supabase
      .from('psychologists')
      .select('id')
      .eq('user_id', user.id)
      .single()

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { count } = await supabase
      .from('session_notes')
      .select('*', { count: 'exact', head: true })
      .eq('psychologist_id', psy?.id ?? '')
      .gte('created_at', thirtyDaysAgo.toISOString())

    setNotesCount(count ?? 0)
  }

  async function runAnalysis() {
    setAnalyzing(true)
    setError(null)

    const password = getSessionPassword()
    if (!password) { setError('Sessão expirou. Recarregue a página.'); setAnalyzing(false); return }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setAnalyzing(false); return }

    const { data: psy } = await supabase
      .from('psychologists')
      .select('id')
      .eq('user_id', user.id)
      .single()
    if (!psy) { setAnalyzing(false); return }

    // Busca notas dos últimos 30 dias
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { data: notes } = await supabase
      .from('session_notes')
      .select('content_encrypted, content_iv, content_salt')
      .eq('psychologist_id', psy?.id ?? '')
      .gte('created_at', thirtyDaysAgo.toISOString())
      .limit(50)

    if (!notes || notes.length < 3) {
      setError('São necessárias pelo menos 3 notas clínicas para análise. Continue registrando sessões!')
      setAnalyzing(false)
      return
    }

    // Descriptografa no cliente
    const decrypted: string[] = []
    for (const note of notes) {
      try {
        const plain = await decryptNote(note, password)
        try {
          const parsed = JSON.parse(plain)
          decrypted.push(parsed.html?.replace(/<[^>]+>/g, ' ') ?? plain)
        } catch {
          decrypted.push(plain)
        }
      } catch {
        // Skip notes that can't be decrypted
      }
    }

    // Envia apenas texto plain para a API
    const res = await fetch('/api/lineage/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes: decrypted, psychologist_id: psy?.id }),
    })

    if (!res.ok) {
      setError('Erro ao analisar. Verifique se a chave Anthropic está configurada.')
      setAnalyzing(false)
      return
    }

    const { analysis: result } = await res.json()
    setAnalysis({ ...result, notes_analyzed_count: decrypted.length, analyzed_at: new Date().toISOString() })
    setAnalyzing(false)
  }

  if (!unlocked) {
    return <UnlockModal onUnlocked={() => setUnlocked(true)} />
  }

  const topApproaches = analysis
    ? Object.entries(analysis.approach_breakdown)
        .filter(([, v]) => v > 0)
        .sort(([, a], [, b]) => b - a)
    : []

  return (
    <>
      <Header title="IA de Linhagem" subtitle="Seu perfil clínico baseado nas suas notas" />

      <main className="flex-1 p-6 max-w-3xl space-y-6">
        {/* Disclaimer */}
        <div className="flex items-start gap-3 bg-neutral-mist border border-neutral-border px-4 py-3 rounded-xl text-xs text-neutral-secondary">
          <Info size={14} className="flex-shrink-0 mt-0.5" />
          Análise baseada em padrões linguísticos das suas notas — não substitui supervisão clínica.
          As notas são descriptografadas localmente e nunca saem do seu dispositivo em texto claro.
        </div>

        {/* Trigger */}
        <Reveal>
          <div className="card-vinculo p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Brain size={20} strokeWidth={1.5} className="text-brand-teal" />
                  <h2 className="font-semibold text-neutral-charcoal">Analisar minha prática</h2>
                </div>
                <p className="text-sm text-neutral-secondary leading-relaxed">
                  O Vínculo analisa suas notas dos últimos 30 dias e identifica sua orientação
                  teórica predominante — psicanálise, TCC, humanista, e mais.
                </p>
                <div className="flex items-center gap-1.5 mt-2 text-xs text-neutral-secondary">
                  <Lock size={11} />
                  {notesCount} nota{notesCount !== 1 ? 's' : ''} disponível{notesCount !== 1 ? 'is' : ''} para análise (últimos 30 dias)
                </div>
              </div>

              <motion.button
                onClick={runAnalysis}
                disabled={analyzing || notesCount < 3}
                whileHover={!analyzing ? { scale: 1.04 } : {}}
                whileTap={!analyzing ? { scale: 0.96 } : {}}
                className="flex items-center gap-2 bg-brand-teal hover:bg-brand-teal-dark disabled:opacity-50 text-white text-sm font-semibold px-5 py-2.5 rounded-input transition-colors flex-shrink-0"
              >
                {analyzing ? (
                  <motion.span
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                  />
                ) : <Sparkles size={16} />}
                {analyzing ? 'Analisando...' : analysis ? 'Reanalisar' : 'Analisar'}
              </motion.button>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 flex items-start gap-2 bg-semantic-warning-bg border border-amber-200 text-semantic-warning text-xs px-3 py-2.5 rounded-lg"
                >
                  <AlertTriangle size={13} className="flex-shrink-0 mt-0.5" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Reveal>

        {/* Results */}
        <AnimatePresence>
          {analysis && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-5"
            >
              {/* Dominant approach */}
              <div className="card-vinculo p-6">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs text-neutral-secondary">Abordagem predominante</p>
                  <span className="text-xs text-neutral-secondary">
                    {Math.round(analysis.confidence_score * 100)}% confiança · {analysis.notes_analyzed_count} sessões
                  </span>
                </div>
                <p className="font-serif text-display-sm text-brand-teal mb-4">
                  {analysis.dominant_approach}
                </p>

                {/* Approach bars */}
                <div className="space-y-3">
                  {topApproaches.map(([approach, pct]) => (
                    <div key={approach}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-neutral-charcoal">{approach}</span>
                        <span className="text-xs text-neutral-secondary tabular-nums">{pct}%</span>
                      </div>
                      <div className="h-2 bg-neutral-mist rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 1, delay: 0.2, ease: [0.2, 0, 0, 1] }}
                          className={`h-full rounded-full ${APPROACH_COLORS[approach] ?? APPROACH_COLORS.Outras}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Techniques + Themes */}
              <div className="grid md:grid-cols-2 gap-5">
                <div className="card-vinculo p-5">
                  <p className="text-xs font-semibold text-neutral-charcoal mb-3">Top técnicas</p>
                  <StaggerGroup className="space-y-2" staggerChildren={0.06}>
                    {analysis.top_techniques.map((t, i) => (
                      <StaggerItem key={t}>
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-brand-teal/10 text-brand-teal text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                            {i + 1}
                          </span>
                          <span className="text-sm text-neutral-charcoal">{t}</span>
                        </div>
                      </StaggerItem>
                    ))}
                  </StaggerGroup>
                </div>

                <div className="card-vinculo p-5">
                  <p className="text-xs font-semibold text-neutral-charcoal mb-3">Temas recorrentes</p>
                  <div className="flex flex-wrap gap-2">
                    {analysis.top_themes.map((theme) => (
                      <span
                        key={theme}
                        className="px-3 py-1.5 rounded-badge bg-brand-sand text-brand-teal text-xs font-medium"
                      >
                        {theme}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Insight */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="card-vinculo p-5 border-l-4 border-brand-teal"
              >
                <div className="flex items-start gap-3">
                  <Sparkles size={16} strokeWidth={1.5} className="text-brand-teal flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-brand-teal mb-1">Insight da IA</p>
                    <p className="text-sm text-neutral-charcoal leading-relaxed">{analysis.insight}</p>
                  </div>
                </div>
              </motion.div>

              {analysis.analyzed_at && (
                <p className="text-xs text-neutral-secondary text-center">
                  Última análise: {new Date(analysis.analyzed_at).toLocaleString('pt-BR')}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {!analysis && !analyzing && (
          <Reveal>
            <div className="text-center py-12">
              <Brain size={48} strokeWidth={0.8} className="mx-auto mb-3 text-neutral-border" />
              <p className="text-sm text-neutral-secondary">
                {notesCount < 3
                  ? `Registre pelo menos 3 notas clínicas para ativar a análise (${notesCount}/3)`
                  : 'Clique em "Analisar" para descobrir seu perfil clínico'}
              </p>
            </div>
          </Reveal>
        )}
      </main>
    </>
  )
}
