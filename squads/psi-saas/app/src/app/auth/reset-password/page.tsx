'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const router = useRouter()
  const supabase = createClient()

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const [hasSession, setHasSession] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setHasSession(!!data.session)
    })
  }, [])

  const strength = (() => {
    if (!password) return 0
    let s = 0
    if (password.length >= 8) s++
    if (/[A-Z]/.test(password)) s++
    if (/[0-9]/.test(password)) s++
    if (/[^A-Za-z0-9]/.test(password)) s++
    return s
  })()
  const strengthLabel = ['', 'Fraca', 'Média', 'Boa', 'Forte'][strength]
  const strengthColor = ['', 'bg-semantic-danger', 'bg-semantic-warning', 'bg-brand-gold', 'bg-semantic-success'][strength]

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password.length < 8) { setError('A senha precisa ter pelo menos 8 caracteres.'); return }
    if (password !== confirm) { setError('As senhas não coincidem.'); return }

    setLoading(true)
    const { error: err } = await supabase.auth.updateUser({ password })
    setLoading(false)

    if (err) {
      setError('Não foi possível redefinir a senha. O link pode ter expirado.')
      return
    }

    setDone(true)
    setTimeout(() => router.push('/dashboard'), 2500)
  }

  if (done) {
    return (
      <div className="min-h-screen bg-neutral-off-white flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm text-center"
        >
          <div className="w-16 h-16 rounded-full bg-semantic-success-bg flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 size={28} className="text-semantic-success" />
          </div>
          <h1 className="font-serif text-xl text-neutral-charcoal mb-2">Senha redefinida</h1>
          <p className="text-sm text-neutral-secondary">Redirecionando para o painel...</p>
        </motion.div>
      </div>
    )
  }

  if (!hasSession) {
    return (
      <div className="min-h-screen bg-neutral-off-white flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm text-center"
        >
          <div className="w-14 h-14 rounded-full bg-semantic-danger-bg flex items-center justify-center mx-auto mb-5">
            <AlertCircle size={24} className="text-semantic-danger" />
          </div>
          <h1 className="font-serif text-xl text-neutral-charcoal mb-2">Link inválido ou expirado</h1>
          <p className="text-sm text-neutral-secondary mb-6">
            Este link de recuperação não é mais válido. Solicite um novo.
          </p>
          <a
            href="/forgot-password"
            className="inline-block bg-brand-teal hover:bg-brand-teal-dark text-white text-sm font-semibold px-5 py-2.5 rounded-input transition-colors"
          >
            Solicitar novo link
          </a>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-off-white flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="lg:hidden text-center mb-8">
          <span className="font-serif text-2xl text-brand-teal">Vínculo</span>
        </div>

        <div className="mb-8">
          <h1 className="font-serif text-2xl text-neutral-charcoal mb-1.5">Nova senha</h1>
          <p className="text-neutral-secondary text-sm">Escolha uma senha segura para sua conta.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-start gap-3 bg-semantic-danger-bg border border-semantic-danger/20 text-semantic-danger text-sm px-4 py-3 rounded-input"
              >
                <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Nova senha */}
          <div>
            <label className="block text-sm font-medium text-neutral-charcoal mb-1.5">Nova senha</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mín. 8 caracteres"
                autoFocus
                className="w-full px-3.5 py-2.5 pr-10 rounded-input border border-neutral-border bg-white text-neutral-charcoal placeholder:text-neutral-secondary/60 focus:outline-none focus:ring-2 focus:ring-brand-teal focus:ring-offset-1 transition-all text-sm"
              />
              <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-secondary hover:text-neutral-charcoal">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {password && (
              <div className="mt-2">
                <div className="flex gap-1 mb-1">
                  {[1,2,3,4].map(i => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= strength ? strengthColor : 'bg-neutral-border'}`} />
                  ))}
                </div>
                <p className="text-[11px] text-neutral-secondary">{strengthLabel}</p>
              </div>
            )}
          </div>

          {/* Confirmar */}
          <div>
            <label className="block text-sm font-medium text-neutral-charcoal mb-1.5">Confirmar senha</label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 pr-10 rounded-input border border-neutral-border bg-white text-neutral-charcoal placeholder:text-neutral-secondary/60 focus:outline-none focus:ring-2 focus:ring-brand-teal focus:ring-offset-1 transition-all text-sm"
              />
              <button type="button" onClick={() => setShowConfirm(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-secondary hover:text-neutral-charcoal">
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="w-full bg-brand-teal hover:bg-brand-teal-dark disabled:opacity-60 text-white font-semibold py-3 px-4 rounded-input transition-colors"
          >
            {loading ? 'Salvando...' : 'Redefinir senha'}
          </motion.button>
        </form>
      </div>
    </div>
  )
}
