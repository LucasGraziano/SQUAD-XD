'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, User, Phone, Mail, AlertCircle, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { Header } from '@/components/layout/header'

const schema = z.object({
  full_name:         z.string().min(3, 'Nome precisa ter pelo menos 3 caracteres'),
  email:             z.string().email('E-mail inválido').optional().or(z.literal('')),
  phone:             z.string().min(10, 'Telefone inválido').optional().or(z.literal('')),
  birth_date:        z.string().optional(),
  source:            z.string().optional(),
  initial_demand:    z.string().optional(),
  session_price:     z.string().min(1, 'Informe o valor'),
  billing_cycle:     z.enum(['per_session', 'weekly', 'monthly']),
  emergency_name:    z.string().optional(),
  emergency_phone:   z.string().optional(),
  lgpd_consent:      z.boolean(),
})

type FormData = z.infer<typeof schema>

const SOURCES = ['Indicação de paciente', 'Redes sociais', 'Site/Google', 'Convênio', 'Outro']

export default function NewPatientPage() {
  const router = useRouter()
  const supabase = createClient()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      billing_cycle: 'per_session',
      lgpd_consent: false,
      session_price: '200',
    },
  })

  const lgpdConsent = watch('lgpd_consent')

  async function onSubmit(data: FormData) {
    setServerError(null)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setServerError('Sessão expirada. Faça login novamente.')
      return
    }

    const { data: psy } = await supabase
      .from('psychologists')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!psy) {
      setServerError('Perfil de psicóloga não encontrado. Tente recarregar a página.')
      return
    }

    const priceCents = Math.round(parseFloat(data.session_price.replace(',', '.')) * 100)

    const { error } = await supabase.from('patients').insert({
      psychologist_id: psy.id,
      full_name: data.full_name,
      email: data.email || null,
      phone: data.phone || null,
      birth_date: data.birth_date || null,
      source: data.source || null,
      notes: data.initial_demand || null,
      status: 'active',
      lgpd_consent: data.lgpd_consent,
      lgpd_consent_date: data.lgpd_consent ? new Date().toISOString() : null,
      session_price_cents: priceCents,
      billing_cycle: data.billing_cycle,
      emergency_contact: data.emergency_name
        ? { name: data.emergency_name, phone: data.emergency_phone }
        : null,
    })

    if (error) {
      setServerError('Erro ao cadastrar paciente. Tente novamente.')
      return
    }

    router.push('/pacientes')
  }

  return (
    <>
      <Header title="Novo Paciente" />
      <main className="flex-1 p-6 max-w-2xl">
        {/* Back */}
        <Link
          href="/pacientes"
          className="inline-flex items-center gap-1.5 text-sm text-neutral-secondary hover:text-brand-teal mb-6 transition-colors"
        >
          <ArrowLeft size={14} />
          Voltar para pacientes
        </Link>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <AnimatePresence>
            {serverError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-start gap-3 bg-semantic-danger-bg border border-semantic-danger/20 text-semantic-danger text-sm px-4 py-3 rounded-input"
              >
                <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                {serverError}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Dados básicos */}
          <section className="card-vinculo p-6 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <User size={16} strokeWidth={1.5} className="text-brand-teal" />
              <h2 className="font-semibold text-neutral-charcoal text-sm">Dados pessoais</h2>
            </div>

            <Field label="Nome completo *" error={errors.full_name?.message}>
              <input {...register('full_name')} placeholder="Ana Paula Santos" className={inputCls(!!errors.full_name)} />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Data de nascimento" error={errors.birth_date?.message}>
                <input {...register('birth_date')} type="date" className={inputCls(false)} />
              </Field>
              <Field label="Como chegou até você?" error={undefined}>
                <select {...register('source')} className={inputCls(false)}>
                  <option value="">Selecione</option>
                  {SOURCES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </Field>
            </div>

            <Field label="Demanda inicial" error={undefined}>
              <textarea
                {...register('initial_demand')}
                rows={3}
                placeholder="Descreva brevemente o motivo da busca por atendimento..."
                className={inputCls(false) + ' resize-none'}
              />
            </Field>
          </section>

          {/* Contato */}
          <section className="card-vinculo p-6 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <Phone size={16} strokeWidth={1.5} className="text-brand-teal" />
              <h2 className="font-semibold text-neutral-charcoal text-sm">Contato</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="WhatsApp / Telefone" error={errors.phone?.message}>
                <input
                  {...register('phone')}
                  type="tel"
                  placeholder="(11) 99999-9999"
                  className={inputCls(!!errors.phone)}
                />
              </Field>
              <Field label="E-mail" error={errors.email?.message}>
                <input
                  {...register('email')}
                  type="email"
                  placeholder="paciente@email.com"
                  className={inputCls(!!errors.email)}
                />
              </Field>
            </div>

            <div className="pt-2 border-t border-neutral-border">
              <p className="text-xs text-neutral-secondary mb-3">Contato de emergência (opcional)</p>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Nome" error={undefined}>
                  <input {...register('emergency_name')} placeholder="Nome do responsável" className={inputCls(false)} />
                </Field>
                <Field label="Telefone" error={undefined}>
                  <input {...register('emergency_phone')} type="tel" placeholder="(11) 99999-9999" className={inputCls(false)} />
                </Field>
              </div>
            </div>
          </section>

          {/* Cobrança */}
          <section className="card-vinculo p-6 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <Mail size={16} strokeWidth={1.5} className="text-brand-teal" />
              <h2 className="font-semibold text-neutral-charcoal text-sm">Cobrança</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Valor por sessão (R$) *" error={errors.session_price?.message}>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-neutral-secondary">R$</span>
                  <input
                    {...register('session_price')}
                    type="number"
                    min="10"
                    step="10"
                    className={`${inputCls(!!errors.session_price)} pl-9`}
                  />
                </div>
              </Field>
              <Field label="Ciclo de cobrança" error={undefined}>
                <select {...register('billing_cycle')} className={inputCls(false)}>
                  <option value="per_session">Por sessão</option>
                  <option value="weekly">Semanal</option>
                  <option value="monthly">Mensal</option>
                </select>
              </Field>
            </div>
          </section>

          {/* LGPD */}
          <section className="card-vinculo p-6">
            <div className="flex items-start gap-3">
              <button
                type="button"
                onClick={() => setValue('lgpd_consent', !lgpdConsent, { shouldValidate: true })}
                className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                  lgpdConsent ? 'bg-brand-teal border-brand-teal' : 'border-neutral-border'
                }`}
              >
                {lgpdConsent && <CheckCircle2 size={12} className="text-white" />}
              </button>
              <input type="checkbox" {...register('lgpd_consent')} className="sr-only" />
              <div>
                <p className="text-sm font-medium text-neutral-charcoal">
                  Consentimento LGPD obtido
                </p>
                <p className="text-xs text-neutral-secondary mt-0.5 leading-relaxed">
                  Confirmo que o paciente foi informado sobre o tratamento de seus dados pessoais
                  e consentiu com o armazenamento para fins de acompanhamento psicológico,
                  conforme a Lei 13.709/2018 (LGPD).
                </p>
              </div>
            </div>
          </section>

          {/* Actions */}
          <div className="flex gap-3 pb-6">
            <Link
              href="/pacientes"
              className="flex-1 text-center border border-neutral-border text-neutral-charcoal text-sm font-medium py-3 rounded-input hover:bg-neutral-mist transition-colors"
            >
              Cancelar
            </Link>
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="flex-1 bg-brand-teal hover:bg-brand-teal-dark disabled:opacity-60 text-white font-semibold py-3 px-8 rounded-input transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <motion.span
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                  />
                  Salvando...
                </>
              ) : (
                'Cadastrar paciente'
              )}
            </motion.button>
          </div>
        </form>
      </main>
    </>
  )
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-neutral-charcoal mb-1.5">{label}</label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="text-xs text-semantic-danger mt-1"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

function inputCls(hasError: boolean) {
  return `w-full px-3.5 py-2.5 rounded-input border bg-white text-neutral-charcoal placeholder:text-neutral-secondary/60 focus:outline-none focus:ring-2 focus:ring-brand-teal focus:ring-offset-1 transition-all text-sm ${
    hasError ? 'border-semantic-danger/60' : 'border-neutral-border'
  }`
}
