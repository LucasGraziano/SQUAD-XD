'use client'

import { useState } from 'react'
import { FileDown, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PlanGate } from '@/components/shared/PlanGate'

function DownloadButton() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleDownload() {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/relatorio/carteira')
      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        setError(json.error ?? 'Erro ao gerar relatório')
        return
      }

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const cd = res.headers.get('Content-Disposition') ?? ''
      const match = cd.match(/filename="([^"]+)"/)
      const filename = match?.[1] ?? 'relatorio-carteira.pdf'

      const a = document.createElement('a')
      a.href = url
      a.download = filename
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      setError('Erro de conexão ao gerar relatório.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <Button
        onClick={handleDownload}
        disabled={loading}
        variant="secondary"
        size="sm"
        className="gap-2"
      >
        {loading ? <Loader2 size={14} className="animate-spin" /> : <FileDown size={14} />}
        {loading ? 'Gerando PDF...' : 'Gerar Relatório de Carteira'}
      </Button>
      {error && <p className="text-[12px] text-red-500">{error}</p>}
    </div>
  )
}

export function RelatorioCarteiraButton({ currentPlan }: { currentPlan?: string }) {
  return (
    <PlanGate requiredPlan="pro" feature="relatorio-carteira" currentPlan={currentPlan}>
      <DownloadButton />
    </PlanGate>
  )
}
