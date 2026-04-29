'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[Dashboard Error]', error)
  }, [error])

  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-sm"
      >
        <div className="w-14 h-14 rounded-2xl bg-semantic-danger-bg flex items-center justify-center mx-auto mb-5">
          <AlertTriangle size={24} className="text-semantic-danger" strokeWidth={1.5} />
        </div>
        <h2 className="font-semibold text-neutral-charcoal mb-2">Algo deu errado</h2>
        <p className="text-sm text-neutral-secondary mb-6 leading-relaxed">
          Ocorreu um erro inesperado ao carregar esta página.
          Tente novamente ou recarregue o navegador.
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 bg-brand-teal hover:bg-brand-teal-dark text-white text-sm font-medium px-5 py-2.5 rounded-input transition-colors"
        >
          <RefreshCw size={14} />
          Tentar novamente
        </button>
      </motion.div>
    </div>
  )
}
