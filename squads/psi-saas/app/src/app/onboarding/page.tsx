'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, CheckCircle2, ChevronRight, Clock, DollarSign, MessageCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const DURATIONS = [40, 50, 60, 80, 90]

// Design tokens para Framer Motion (não aceita classes Tailwind)
const STEP_COLORS = {
  done:    '#2D7D4F',
  active:  '#1A4A5A',
  pending: '#E2E2DE',
  lineDone:'#2D7D4F',
  linePend:'#E2E2DE',
} as const

type Step = 1 | 2 | 3

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()

  const [step, setStep] = useState<Step>(1)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  // Step 1
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5])
  const [startTime, setStartTime] = useState('08:00')
  const [endTime, setEndTime] = useState('18:00')

  // Step 2
  const [priceInput, setPriceInput] = useState('200')
  const [billingCycle, setBillingCycle] = useState<'per_session' | 'weekly' | 'monthly'>('per_session')
  const [duration, setDuration] = useState(50)

  function toggleDay(d: number) {
    setSelectedDays((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
    )
  }

  async function saveStep1() {
    setSaveError(null)
    setSaving(true)
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      setSaveError('Sessão expirada. Faça login novamente.')
      setSaving(false)
      return
    }

    const { data: psy, error: psyError } = await supabase
      .from('psychologists')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (psyError || !psy) {
      setSaveError('Não foi possível carregar seu perfil. Tente novamente.')
      setSaving(false)
      return
    }

    const slots = selectedDays.map((day) => ({
      psychologist_id: psy.id,
      day_of_week: day,
      start_time: startTime,
      end_time: endTime,
      is_recurring: true,
    }))

    const { error: slotsError } = await supabase
      .from('availability_slots')
      .upsert(slots, { onConflict: 'psychologist_id,day_of_week' })

    if (slotsError) {
      setSaveError('Erro ao salvar horários. Verifique os dados e tente novamente.')
      setSaving(false)
      return
    }

    await supabase.from('psychologists').update({ onboarding_step: 1 }).eq('id', psy.id)
    setSaving(false)
    setStep(2)
  }

  async function saveStep2() {
    setSaveError(null)
    setSaving(true)
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      setSaveError('Sessão expirada. Faça login novamente.')
      setSaving(false)
      return
    }

    const price = parseFloat(priceInput.replace(',', '.'))
    if (isNaN(price) || price < 10) {
      setSaveError('Valor de sessão inválido. Mínimo R$ 10.')
      setSaving(false)
      return
    }

    const { error } = await supabase
      .from('psychologists')
      .update({
        session_price_cents: Math.round(price * 100),
        billing_cycle: billingCycle,
        session_duration_minutes: duration,
        onboarding_step: 2,
      })
      .eq('user_id', user.id)

    if (error) {
      setSaveError('Erro ao salvar valores. Tente novamente.')
      setSaving(false)
      return
    }

    setSaving(false)
    setStep(3)
  }

  async function finishOnboarding() {
    setSaveError(null)
    setSaving(true)
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      setSaveError('Sessão expirada. Faça login novamente.')
      setSaving(false)
      return
    }

    const { error } = await supabase
      .from('psychologists')
      .update({ onboarding_completed: true, onboarding_step: 3 })
      .eq('user_id', user.id)

    if (error) {
      setSaveError('Algo não funcionou. Tente novamente.')
      setSaving(false)
      return
    }

    setSaving(false)
    router.push('/dashboard?welcome=1')
  }

  return (
    <div className="min-h-screen bg-neutral-off-white flex flex-col items-center justify-center px-4 py-12">
      {/* Logo */}
      <div className="mb-8">
        <span className="font-serif text-2xl text-brand-teal">Vínculo</span>
      </div>

      {/* Progress */}
      <div className="w-full max-w-md mb-8">
        <div className="flex items-center gap-2 mb-3">
          {([1, 2, 3] as Step[]).map((s) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <motion.div
                animate={{
                  backgroundColor: s < step ? STEP_COLORS.done : s === step ? STEP_COLORS.active : STEP_COLORS.pending,
                  scale: s === step ? 1.1 : 1,
                }}
                transition={{ duration: 0.3 }}
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
              >
                {s < step ? <CheckCircle2 size={16} /> : s}
              </motion.div>
              {s < 3 && (
                <motion.div
                  className="flex-1 h-0.5 rounded-full"
                  animate={{ backgroundColor: s < step ? STEP_COLORS.lineDone : STEP_COLORS.linePend }}
                  transition={{ duration: 0.4 }}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-neutral-secondary px-0.5">
          <span>Horários</span>
          <span>Valores</span>
          <span>WhatsApp</span>
        </div>
      </div>

      {/* Error global */}
      <AnimatePresence>
        {saveError && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full max-w-md mb-3 flex items-start gap-3 bg-semantic-danger-bg border border-semantic-danger/20 text-semantic-danger text-sm px-4 py-3 rounded-input"
          >
            <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
            {saveError}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card */}
      <div className="w-full max-w-md">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="card-vinculo p-7"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-brand-teal/10 flex items-center justify-center">
                  <Clock size={20} strokeWidth={1.5} className="text-brand-teal" />
                </div>
                <div>
                  <h2 className="font-semibold text-neutral-charcoal">Horários de atendimento</h2>
                  <p className="text-xs text-neutral-secondary">Passo 1 de 3</p>
                </div>
              </div>

              {/* Days */}
              <div className="mb-5">
                <p className="text-sm font-medium text-neutral-charcoal mb-2.5">Dias da semana</p>
                <div className="flex gap-2 flex-wrap">
                  {DAYS.map((day, i) => (
                    <motion.button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(i)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-11 h-11 rounded-xl text-xs font-semibold transition-all ${
                        selectedDays.includes(i)
                          ? 'bg-brand-teal text-white shadow-sm'
                          : 'bg-neutral-mist text-neutral-secondary hover:bg-neutral-border/40'
                      }`}
                    >
                      {day}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Times */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-charcoal mb-1.5">Início</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-input border border-neutral-border bg-white text-neutral-charcoal focus:outline-none focus:ring-2 focus:ring-brand-teal focus:ring-offset-1 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-charcoal mb-1.5">Fim</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-input border border-neutral-border bg-white text-neutral-charcoal focus:outline-none focus:ring-2 focus:ring-brand-teal focus:ring-offset-1 text-sm"
                  />
                </div>
              </div>

              <motion.button
                onClick={saveStep1}
                disabled={saving || selectedDays.length === 0}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="w-full bg-brand-teal hover:bg-brand-teal-dark disabled:opacity-60 text-white font-semibold py-3 rounded-input transition-colors flex items-center justify-center gap-2"
              >
                {saving ? 'Salvando...' : <>Próximo <ChevronRight size={16} /></>}
              </motion.button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="card-vinculo p-7"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-brand-teal/10 flex items-center justify-center">
                  <DollarSign size={20} strokeWidth={1.5} className="text-brand-teal" />
                </div>
                <div>
                  <h2 className="font-semibold text-neutral-charcoal">Valores e cobrança</h2>
                  <p className="text-xs text-neutral-secondary">Passo 2 de 3</p>
                </div>
              </div>

              {/* Price */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-neutral-charcoal mb-1.5">
                  Valor padrão por sessão (R$)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-neutral-secondary">R$</span>
                  <input
                    type="number"
                    min="10"
                    step="10"
                    value={priceInput}
                    onChange={(e) => setPriceInput(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-input border border-neutral-border bg-white text-neutral-charcoal focus:outline-none focus:ring-2 focus:ring-brand-teal focus:ring-offset-1 text-sm tabular-nums"
                  />
                </div>
              </div>

              {/* Duration */}
              <div className="mb-5">
                <p className="text-sm font-medium text-neutral-charcoal mb-2.5">Duração da sessão</p>
                <div className="flex gap-2 flex-wrap">
                  {DURATIONS.map((d) => (
                    <motion.button
                      key={d}
                      type="button"
                      onClick={() => setDuration(d)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        duration === d
                          ? 'bg-brand-teal text-white'
                          : 'bg-neutral-mist text-neutral-secondary hover:bg-neutral-border/40'
                      }`}
                    >
                      {d}min
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Billing cycle */}
              <div className="mb-6">
                <p className="text-sm font-medium text-neutral-charcoal mb-2.5">Ciclo de cobrança padrão</p>
                <div className="space-y-2">
                  {[
                    { value: 'per_session', label: 'Por sessão', desc: 'PIX após cada atendimento' },
                    { value: 'weekly', label: 'Semanal', desc: 'Cobrança toda semana automaticamente' },
                    { value: 'monthly', label: 'Mensal', desc: 'Cobrança todo mês por pacote' },
                  ].map(({ value, label, desc }) => (
                    <motion.button
                      key={value}
                      type="button"
                      onClick={() => setBillingCycle(value as typeof billingCycle)}
                      whileTap={{ scale: 0.99 }}
                      className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                        billingCycle === value
                          ? 'border-brand-teal bg-brand-teal/5'
                          : 'border-neutral-border hover:border-neutral-border-dark'
                      }`}
                    >
                      <div>
                        <p className={`text-sm font-medium ${billingCycle === value ? 'text-brand-teal' : 'text-neutral-charcoal'}`}>
                          {label}
                        </p>
                        <p className="text-xs text-neutral-secondary">{desc}</p>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        billingCycle === value ? 'border-brand-teal' : 'border-neutral-border'
                      }`}>
                        {billingCycle === value && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-2 h-2 rounded-full bg-brand-teal"
                          />
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 border border-neutral-border text-neutral-charcoal text-sm font-medium py-3 rounded-input hover:bg-neutral-mist transition-colors"
                >
                  Voltar
                </button>
                <motion.button
                  onClick={saveStep2}
                  disabled={saving}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex-1 bg-brand-teal hover:bg-brand-teal-dark disabled:opacity-60 text-white font-semibold py-3 px-6 rounded-input transition-colors flex items-center justify-center gap-2"
                >
                  {saving ? 'Salvando...' : <>Próximo <ChevronRight size={16} /></>}
                </motion.button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="card-vinculo p-7"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-teal/10 flex items-center justify-center">
                    <MessageCircle size={20} strokeWidth={1.5} className="text-brand-teal" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-neutral-charcoal">WhatsApp Business</h2>
                    <p className="text-xs text-neutral-secondary">Passo 3 de 3 — Opcional</p>
                  </div>
                </div>
                <span className="text-xs bg-neutral-mist text-neutral-secondary px-2.5 py-1 rounded-badge">
                  Opcional
                </span>
              </div>

              <div className="bg-brand-sand/40 border border-brand-sand rounded-xl p-4 mb-5">
                <p className="text-sm font-medium text-neutral-charcoal mb-1.5">
                  Por que conectar o WhatsApp?
                </p>
                <ul className="space-y-1.5 text-sm text-neutral-secondary">
                  {[
                    'Confirmação automática 48h antes de cada sessão',
                    'Envio do link de pagamento PIX pelo WhatsApp',
                    'Notificações de sessão sem trabalho manual',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-brand-teal flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="text-center py-4 mb-5">
                <div className="w-32 h-32 mx-auto bg-neutral-mist rounded-xl flex items-center justify-center text-neutral-secondary text-xs border-2 border-dashed border-neutral-border">
                  QR Code Z-API<br />(configure nas<br />Configurações)
                </div>
                <p className="text-xs text-neutral-secondary mt-3">
                  A integração completa é configurada em Configurações → WhatsApp
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="border border-neutral-border text-neutral-charcoal text-sm font-medium py-3 px-4 rounded-input hover:bg-neutral-mist transition-colors"
                >
                  Voltar
                </button>
                <motion.button
                  onClick={finishOnboarding}
                  disabled={saving}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex-1 bg-brand-teal hover:bg-brand-teal-dark disabled:opacity-60 text-white font-semibold py-3 rounded-input transition-colors flex items-center justify-center gap-2"
                >
                  {saving ? 'Finalizando...' : (
                    <>
                      <CheckCircle2 size={16} />
                      Entrar no Vínculo
                    </>
                  )}
                </motion.button>
              </div>

              <button
                onClick={finishOnboarding}
                className="w-full mt-3 text-xs text-neutral-secondary hover:text-neutral-charcoal transition-colors"
              >
                Pular e configurar depois →
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
