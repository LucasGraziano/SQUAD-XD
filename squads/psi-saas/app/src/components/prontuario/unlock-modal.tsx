'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { deriveAndStore } from '@/lib/session-key'

interface Props {
  onUnlocked: () => void
}

export function UnlockModal({ onUnlocked }: Props) {
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  async function handleUnlock(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(false)

    // Deriva a chave — se falhar (senha errada) as notas não vão descriptografar
    const ok = await deriveAndStore(password)

    if (ok) {
      onUnlocked()
    } else {
      setError(true)
    }

    setLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-neutral-charcoal/60 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="bg-white rounded-card shadow-modal p-8 w-full max-w-sm text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.15, type: 'spring', stiffness: 260 }}
          className="w-14 h-14 rounded-full bg-brand-teal/10 flex items-center justify-center mx-auto mb-5"
        >
          <Lock size={24} strokeWidth={1.5} className="text-brand-teal" />
        </motion.div>

        <h2 className="font-serif text-display-sm text-neutral-charcoal mb-2">
          Notas criptografadas
        </h2>
        <p className="text-sm text-neutral-secondary mb-6 leading-relaxed">
          Confirme sua senha para descriptografar as notas desta sessão.
          A chave fica apenas na memória do seu dispositivo.
        </p>

        <form onSubmit={handleUnlock} className="space-y-4">
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2 bg-semantic-danger-bg text-semantic-danger text-sm px-3 py-2 rounded-input border border-semantic-danger/20"
              >
                <AlertCircle size={14} />
                Senha incorreta. Tente novamente.
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative">
            <input
              type={show ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Sua senha de acesso"
              autoFocus
              required
              className="w-full px-3.5 py-3 pr-10 rounded-input border border-neutral-border bg-white text-neutral-charcoal placeholder:text-neutral-secondary/60 focus:outline-none focus:ring-2 focus:ring-brand-teal focus:ring-offset-1 text-sm"
            />
            <button
              type="button"
              onClick={() => setShow(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-secondary hover:text-neutral-charcoal"
            >
              {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <motion.button
            type="submit"
            disabled={!password || loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="w-full bg-brand-teal hover:bg-brand-teal-dark disabled:opacity-60 text-white font-semibold py-3 rounded-input transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <motion.span
                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
              />
            ) : <Lock size={16} />}
            {loading ? 'Verificando...' : 'Desbloquear prontuário'}
          </motion.button>
        </form>

        <p className="text-xs text-neutral-secondary/60 mt-4">
          🔒 A chave nunca sai do seu dispositivo
        </p>
      </motion.div>
    </div>
  )
}
