'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { forgotPasswordSchema } from '@/lib/validations'
import { z } from 'zod'

type FormData = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordPage() {
  const supabase = createClient()
  const [sent, setSent] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(forgotPasswordSchema) })

  const email = watch('email', '')

  async function onSubmit(data: FormData) {
    setServerError(null)
    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${location.origin}/auth/reset-password`,
    })
    if (error) {
      setServerError('Não foi possível enviar o e-mail. Tente novamente.')
      return
    }
    setSent(true)
  }

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="w-16 h-16 rounded-full bg-semantic-success-bg flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 size={28} className="text-semantic-success" />
        </div>
        <h1 className="text-display-sm text-neutral-charcoal mb-2">E-mail enviado</h1>
        <p className="text-neutral-secondary text-sm leading-relaxed max-w-xs mx-auto">
          Se <strong>{email}</strong> estiver cadastrado, você receberá um link para redefinir sua senha.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 mt-6 text-sm text-brand-teal hover:text-brand-teal-dark"
        >
          <ArrowLeft size={14} />
          Voltar ao login
        </Link>
      </motion.div>
    )
  }

  return (
    <>
      <div className="mb-8">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-sm text-neutral-secondary hover:text-brand-teal mb-6 transition-colors"
        >
          <ArrowLeft size={14} />
          Voltar
        </Link>
        <h1 className="text-display-sm text-neutral-charcoal mb-1.5">Recuperar senha</h1>
        <p className="text-neutral-secondary text-sm">
          Informe seu e-mail e enviaremos um link para redefinir sua senha.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

        <div>
          <label className="block text-sm font-medium text-neutral-charcoal mb-1.5">
            E-mail profissional
          </label>
          <input
            {...register('email')}
            type="email"
            placeholder="voce@email.com"
            autoFocus
            className={`w-full px-3.5 py-2.5 rounded-input border bg-white text-neutral-charcoal placeholder:text-neutral-secondary/60 focus:outline-none focus:ring-2 focus:ring-brand-teal focus:ring-offset-1 transition-all text-sm ${errors.email ? 'border-semantic-danger/60' : 'border-neutral-border'}`}
          />
          {errors.email && (
            <p className="text-xs text-semantic-danger mt-1">{errors.email.message}</p>
          )}
        </div>

        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="w-full bg-brand-teal hover:bg-brand-teal-dark disabled:opacity-60 text-white font-semibold py-3 px-4 rounded-input transition-colors duration-fast"
        >
          {isSubmitting ? 'Enviando...' : 'Enviar link de recuperação'}
        </motion.button>
      </form>
    </>
  )
}
