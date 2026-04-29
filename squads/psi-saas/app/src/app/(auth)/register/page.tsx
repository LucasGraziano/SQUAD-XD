'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { registerSchema, type RegisterFormData } from '@/lib/validations'
import { fadeUp } from '@/lib/animations'
import { createTrialSubscription } from '@/lib/subscription'

const specializations = [
  'Psicanálise', 'Terapia Cognitivo-Comportamental (TCC)', 'Humanista / Centrada na Pessoa',
  'Gestalt', 'Sistêmica / Família', 'EMDR', 'DBT', 'Psicologia Analítica (Jung)',
  'Comportamental', 'Outra',
]

export default function RegisterPage() {
  const router = useRouter()
  const supabase = createClient()

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const password = watch('password', '')

  const passwordStrength = (() => {
    if (!password) return 0
    let score = 0
    if (password.length >= 8) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++
    return score
  })()

  const strengthLabel = ['', 'Fraca', 'Média', 'Boa', 'Forte'][passwordStrength]
  const strengthColor = ['', 'bg-semantic-danger', 'bg-semantic-warning', 'bg-brand-gold', 'bg-semantic-success'][passwordStrength]

  async function onSubmit(data: RegisterFormData) {
    setServerError(null)

    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { full_name: data.full_name, crp: data.crp },
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    })

    if (signUpError) {
      if (signUpError.message.includes('already registered')) {
        setServerError('Este e-mail já tem uma conta. Faça login ou recupere sua senha.')
      } else {
        setServerError(signUpError.message)
      }
      return
    }

    if (authData.user) {
      const { data: psy } = await supabase.from('psychologists').insert({
        user_id: authData.user.id,
        full_name: data.full_name,
        crp: data.crp,
        email: data.email,
        theoretical_orientation: data.specialization ?? null,
        session_duration_minutes: 50,
        session_price_cents: 20000,
        billing_cycle: 'per_session',
        timezone: 'America/Sao_Paulo',
        onboarding_completed: false,
        onboarding_step: 0,
      }).select('id').single()

      // Criar trial de 30 dias automaticamente
      if (psy?.id) {
        await createTrialSubscription(supabase, psy.id)
      }

      // Se auto-confirmação (dev), vai direto pro onboarding
      if (authData.session) {
        router.push('/onboarding')
      } else {
        setSuccess(true)
      }
    }
  }

  if (success) {
    return (
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="text-center">
        <div className="w-16 h-16 rounded-full bg-semantic-success-bg flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 size={32} className="text-semantic-success" />
        </div>
        <h1 className="text-display-sm text-neutral-charcoal mb-2">Verifique seu e-mail</h1>
        <p className="text-neutral-secondary text-sm leading-relaxed">
          Enviamos um link de confirmação para <strong>{watch('email')}</strong>.
          Clique nele para ativar sua conta.
        </p>
        <p className="text-xs text-neutral-secondary/70 mt-4">
          Não recebeu? Verifique a pasta de spam.
        </p>
      </motion.div>
    )
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-display-sm text-neutral-charcoal mb-1.5">Criar conta grátis</h1>
        <p className="text-neutral-secondary text-sm">14 dias de teste, sem cartão de crédito</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <AnimatePresence>
          {serverError && (
            <motion.div
              initial={{ opacity: 0, y: -8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -8, height: 0 }}
              className="flex items-start gap-3 bg-semantic-danger-bg border border-semantic-danger/20 text-semantic-danger text-sm px-4 py-3 rounded-input"
            >
              <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
              {serverError}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Nome completo */}
        <Field label="Nome completo" error={errors.full_name?.message}>
          <input
            {...register('full_name')}
            placeholder="Dra. Maria Silva"
            className={inputCls(!!errors.full_name)}
          />
        </Field>

        {/* CRP */}
        <Field label="CRP" error={errors.crp?.message} hint="Formato: 06/123456">
          <input
            {...register('crp')}
            placeholder="06/123456"
            className={inputCls(!!errors.crp)}
          />
        </Field>

        {/* Cidade */}
        <Field label="Cidade" error={errors.city?.message}>
          <input
            {...register('city')}
            placeholder="São Paulo"
            className={inputCls(!!errors.city)}
          />
        </Field>

        {/* Abordagem */}
        <Field label="Abordagem terapêutica" error={errors.specialization?.message} optional>
          <select {...register('specialization')} className={inputCls(false) + ' text-neutral-charcoal'}>
            <option value="">Selecione (opcional)</option>
            {specializations.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </Field>

        {/* Email */}
        <Field label="E-mail profissional" error={errors.email?.message}>
          <input
            {...register('email')}
            type="email"
            placeholder="voce@email.com"
            className={inputCls(!!errors.email)}
          />
        </Field>

        {/* Senha */}
        <Field label="Senha" error={errors.password?.message}>
          <div className="relative">
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="Mín. 8 caracteres"
              className={inputCls(!!errors.password) + ' pr-10'}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-secondary hover:text-neutral-charcoal"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {/* Força da senha */}
          {password && (
            <div className="mt-2">
              <div className="flex gap-1 mb-1">
                {[1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-colors duration-300 ${i <= passwordStrength ? strengthColor : 'bg-neutral-border'}`}
                  />
                ))}
              </div>
              <p className="text-[11px] text-neutral-secondary">{strengthLabel}</p>
            </div>
          )}
        </Field>

        {/* Confirmar senha */}
        <Field label="Confirmar senha" error={errors.confirmPassword?.message}>
          <div className="relative">
            <input
              {...register('confirmPassword')}
              type={showConfirm ? 'text' : 'password'}
              placeholder="••••••••"
              className={inputCls(!!errors.confirmPassword) + ' pr-10'}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-secondary hover:text-neutral-charcoal"
            >
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </Field>

        {/* Terms checkbox */}
        <div>
          <label className="flex items-start gap-3 cursor-pointer group">
            <TermsCheckbox register={register} hasError={!!errors.termsAccepted} />
            <span className="text-xs text-neutral-secondary leading-relaxed">
              Li e concordo com os{' '}
              <Link href="/termos" target="_blank" className="text-brand-teal hover:underline">Termos de Uso</Link>
              {' '}e a{' '}
              <Link href="/privacidade" target="_blank" className="text-brand-teal hover:underline">Política de Privacidade</Link>,
              incluindo o tratamento dos dados dos meus pacientes como operador conforme a LGPD.
            </span>
          </label>
          <AnimatePresence>
            {errors.termsAccepted && (
              <motion.p
                initial={{ opacity: 0, y: -4, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -4, height: 0 }}
                className="text-xs text-semantic-danger mt-1.5"
              >
                {errors.termsAccepted.message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="w-full bg-brand-teal hover:bg-brand-teal-dark disabled:opacity-60 text-white font-semibold py-3 px-4 rounded-input transition-colors duration-fast"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <motion.span
                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
              />
              Criando conta...
            </span>
          ) : (
            'Criar conta grátis'
          )}
        </motion.button>
      </form>

      <p className="mt-5 text-center text-sm text-neutral-secondary">
        Já tem conta?{' '}
        <Link href="/login" className="text-brand-teal font-medium hover:text-brand-teal-dark">
          Entrar
        </Link>
      </p>
    </>
  )
}

function Field({
  label, error, hint, optional, children,
}: {
  label: string
  error?: string
  hint?: string
  optional?: boolean
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="flex items-center justify-between text-sm font-medium text-neutral-charcoal mb-1.5">
        <span>{label}</span>
        {optional && <span className="text-xs text-neutral-secondary font-normal">Opcional</span>}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            className="text-xs text-semantic-danger mt-1"
          >
            {error}
          </motion.p>
        )}
        {hint && !error && (
          <p className="text-xs text-neutral-secondary mt-1">{hint}</p>
        )}
      </AnimatePresence>
    </div>
  )
}

function inputCls(hasError: boolean) {
  return `w-full px-3.5 py-2.5 rounded-input border bg-white text-neutral-charcoal placeholder:text-neutral-secondary/60 focus:outline-none focus:ring-2 focus:ring-brand-teal focus:ring-offset-1 transition-all text-sm ${
    hasError ? 'border-semantic-danger/60 focus:ring-semantic-danger/40' : 'border-neutral-border'
  }`
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function TermsCheckbox({ register, hasError }: { register: any; hasError: boolean }) {
  const [checked, setChecked] = useState(false)
  const { onChange, ...rest } = register('termsAccepted')

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => {
        setChecked(v => !v)
        onChange({ target: { value: !checked, type: 'checkbox' } })
      }}
      className="flex-shrink-0 mt-0.5"
    >
      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
        checked ? 'bg-brand-teal border-brand-teal' : hasError ? 'border-semantic-danger' : 'border-neutral-border hover:border-brand-teal/60'
      }`}>
        {checked && (
          <svg viewBox="0 0 12 12" fill="none" className="w-2.5 h-2.5">
            <path d="M2 6l2.5 2.5L10 3.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <input type="checkbox" {...rest} checked={checked} readOnly className="sr-only" />
    </button>
  )
}
