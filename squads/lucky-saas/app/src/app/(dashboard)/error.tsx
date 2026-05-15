'use client'

import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[DashboardError]', error)
  }, [error])

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <div className="w-12 h-12 rounded-full bg-[#FEE2E2] flex items-center justify-center mb-4">
        <AlertTriangle size={20} className="text-[#DC2626]" />
      </div>
      <h2 className="text-[16px] font-semibold text-[#0D0D0D] mb-1">Algo deu errado</h2>
      <p className="text-[13px] text-[#6B7280] mb-4 max-w-[320px]">
        Ocorreu um erro inesperado. Tente novamente ou recarregue a página.
      </p>
      <Button size="sm" onClick={reset}>
        Tentar novamente
      </Button>
    </div>
  )
}
