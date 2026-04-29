'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle2, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export function WelcomeModal() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (searchParams.get('welcome') === '1') {
      setOpen(true)
    }
  }, [searchParams])

  function dismiss() {
    setOpen(false)
    router.replace('/dashboard', { scroll: false })
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={dismiss}
            className="fixed inset-0 bg-neutral-charcoal/40 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-md z-50 bg-white rounded-card shadow-modal p-8"
          >
            <button
              onClick={dismiss}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-neutral-secondary hover:text-neutral-charcoal hover:bg-neutral-mist transition-all"
            >
              <X size={18} />
            </button>

            {/* Confetti-like decoration */}
            <div className="text-center mb-6">
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 260 }}
                className="w-16 h-16 rounded-full bg-semantic-success-bg flex items-center justify-center mx-auto mb-4"
              >
                <CheckCircle2 size={32} className="text-semantic-success" />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="font-serif text-display-sm text-neutral-charcoal mb-2"
              >
                Bem-vinda ao Vínculo!
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-neutral-secondary text-sm leading-relaxed"
              >
                Sua plataforma está pronta. Vamos começar cadastrando seus primeiros pacientes?
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-2.5"
            >
              {nextSteps.map(({ label, href, icon }, i) => (
                <motion.div
                  key={href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.55 + i * 0.07 }}
                >
                  <Link
                    href={href as string}
                    onClick={dismiss}
                    className="flex items-center gap-3 p-3.5 rounded-xl border border-neutral-border hover:border-brand-teal/40 hover:bg-brand-sand/20 transition-all group"
                  >
                    <span className="text-lg">{icon}</span>
                    <span className="text-sm font-medium text-neutral-charcoal group-hover:text-brand-teal transition-colors flex-1">
                      {label}
                    </span>
                    <ArrowRight size={14} className="text-neutral-secondary group-hover:text-brand-teal group-hover:translate-x-0.5 transition-all" />
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              onClick={dismiss}
              className="w-full mt-4 text-xs text-neutral-secondary hover:text-neutral-charcoal transition-colors"
            >
              Explorar por conta própria →
            </motion.button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

const nextSteps = [
  { label: 'Cadastrar primeiro paciente', href: '/pacientes/novo', icon: '👤' },
  { label: 'Agendar uma sessão', href: '/agenda/novo', icon: '📅' },
  { label: 'Configurar WhatsApp', href: '/configuracoes', icon: '💬' },
]
