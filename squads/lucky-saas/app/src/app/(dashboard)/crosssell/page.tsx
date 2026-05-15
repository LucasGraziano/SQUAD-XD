import { PageHeader } from '@/components/layout/page-header'
import { EmptyState } from '@/components/ui/empty-state'
import { Zap } from 'lucide-react'

export default function CrossSellPage() {
  return (
    <>
      <PageHeader title="Cross-sell Inteligente" />
      <div className="flex-1 p-8">
        <EmptyState
          icon={Zap}
          title="Sem oportunidades identificadas"
          description="Adicione mais apólices para o sistema identificar oportunidades de cross-sell na sua carteira."
        />
      </div>
    </>
  )
}
