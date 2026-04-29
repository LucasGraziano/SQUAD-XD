'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, AlertCircle, Mail } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { loginSchema, type LoginFormData } from '@/lib/validations'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [magicLinkSent, setMagicLinkSent] = useState(false)
  const [magicLinkLoading, setMagicLinkLoading] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) })

  const email = watch('email', '')

  async function onSubmit(data: LoginFormData) {
    setServerError(null)
    const { error } = await supabase.auth.signInWithPassword(data)
    if (error) {
      setServerError('E-mail ou senha incorretos. Verifique e tente novamente.')
      return
    }
    router.push('/dashboard')
    router.refresh()
  }

  async function handleMagicLink() {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setServerError('Preencha o e-mail acima para usar o link mágico.')
      return
    }
    setMagicLinkLoading(true)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/auth/callback` },
    })
    if (!error) setMagicLinkSent(true)
    else setServerError('Não foi possível enviar o link. Tente novamente.')
    setMagicLinkLoading(false)
  }

  if (magicLinkSent) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="w-16 h-16 rounded-full bg-brand-sand flex items-center justify-center mx-auto mb-5">
          <Mail size={28} className="text-brand-teal" />
        </div>
        <h1 className="text-display-sm text-neutral-charcoal mb-2">Link enviado!</h1>
        <p className="text-neutral-secondary text-sm leading-relaxed">
          Verifique sua caixa de entrada em <strong>{email}</strong> e clique no link para entrar.
        </p>
        <button
          onClick={() => setMagicLinkSent(false)}
          className="mt-5 text-sm text-brand-teal hover:text-brand-teal-dark"
        >
          ← Voltar ao login
        </button>
      </motion.div>
    )
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-display-sm text-neutral-charcoal mb-1.5">Bem-vinda de volta</h1>
        <p className="text-neutral-secondary text-sm">Acesse sua conta Vínculo</p>
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

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-neutral-charcoal mb-1.5">
            E-mail profissional
          </label>
          <input
            {...register('email')}
            type="email"
            placeholder="voce@email.com"
            className={`w-full px-3.5 py-2.5 rounded-input border bg-white text-neutral-charcoal placeholder:text-neutral-secondary/60 focus:outline-none focus:ring-2 focus:ring-brand-teal focus:ring-offset-1 transition-all text-sm ${errors.email ? 'border-semantic-danger/60' : 'border-neutral-border'}`}
          />
          {errors.email && (
            <p className="text-xs text-semantic-danger mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Senha */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-medium text-neutral-charcoal">Senha</label>
            <Link href="/forgot-password" className="text-xs text-brand-teal hover:text-brand-teal-dark">
              Esqueci a senha
            </Link>
          </div>
          <div className="relative">
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className={`w-full px-3.5 py-2.5 pr-10 rounded-input border bg-white text-neutral-charcoal placeholder:text-neutral-secondary/60 focus:outline-none focus:ring-2 focus:ring-brand-teal focus:ring-offset-1 transition-all text-sm ${errors.password ? 'border-semantic-danger/60' : 'border-neutral-border'}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-secondary hover:text-neutral-charcoal"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-semantic-danger mt-1">{errors.password.message}</p>
          )}
        </div>

        {/* Submit */}
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
              Entrando...
            </span>
          ) : (
            'Entrar'
          )}
        </motion.button>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-neutral-border" />
          <span className="text-xs text-neutral-secondary">ou</span>
          <div className="flex-1 h-px bg-neutral-border" />
        </div>

        {/* Magic Link */}
        <motion.button
          type="button"
          onClick={handleMagicLink}
          disabled={magicLinkLoading}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-center gap-2 border border-neutral-border hover:border-brand-teal/40 text-neutral-charcoal hover:text-brand-teal text-sm font-medium py-2.5 px-4 rounded-input transition-all duration-fast disabled:opacity-60"
        >
          <Mail size={16} />
          {magicLinkLoading ? 'Enviando...' : 'Entrar com link mágico'}
        </motion.button>
      </form>

      <p className="mt-6 text-center text-sm text-neutral-secondary">
        Ainda não tem conta?{' '}
        <Link href="/register" className="text-brand-teal font-medium hover:text-brand-teal-dark">
          Criar conta grátis
        </Link>
      </p>
    </>
  )
}
