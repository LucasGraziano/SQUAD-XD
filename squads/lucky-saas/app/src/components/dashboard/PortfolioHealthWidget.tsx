import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { PortfolioHealthScore } from '@/lib/portfolio/health-score'
import { cn } from '@/lib/utils/cn'

function scoreColor(score: number) {
  if (score >= 75) return 'bg-[#0BD904]'
  if (score >= 50) return 'bg-[#D97706]'
  return 'bg-[#DC2626]'
}

function scoreTextColor(score: number) {
  if (score >= 75) return 'text-[#034001]'
  if (score >= 50) return 'text-[#92400E]'
  return 'text-[#DC2626]'
}

function ScoreBar({ score }: { score: number }) {
  return (
    <div className="relative w-full h-2 rounded-full bg-[#F3F4F6] overflow-hidden">
      <div
        className={cn('h-full rounded-full transition-all duration-700', scoreColor(score))}
        style={{ width: `${score}%` }}
      />
    </div>
  )
}

function ComponentRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[11px] text-[#6B7280] w-[140px] flex-shrink-0">{label}</span>
      <div className="flex-1 h-1.5 rounded-full bg-[#F3F4F6] overflow-hidden">
        <div
          className={cn('h-full rounded-full', scoreColor(value * 4))}
          style={{ width: `${(value / 25) * 100}%` }}
        />
      </div>
      <span className="text-[11px] font-semibold text-[#0D0D0D] w-8 text-right">{value}</span>
    </div>
  )
}

interface Props {
  data: PortfolioHealthScore
}

const COMPONENT_LABELS = {
  alertCoverage: 'Alertas configurados',
  activeApolices: 'Apólices ativas',
  completeClients: 'Clientes completos',
  recentEngagement: 'Engajamento recente',
}

export function PortfolioHealthWidget({ data }: Props) {
  return (
    <div className="bg-white rounded-[8px] border border-[#E5E5E5] p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[14px] font-semibold text-[#0D0D0D]">Saúde da Carteira</p>
          <p className="text-[11px] text-[#9CA3AF]">Atualizado agora</p>
        </div>
        <span className={cn('text-[28px] font-black', scoreTextColor(data.total))}>
          {data.total}%
        </span>
      </div>

      <ScoreBar score={data.total} />

      {/* Component breakdown */}
      <div className="mt-4 space-y-2">
        {(Object.entries(data.components) as [keyof typeof data.components, number][]).map(([key, value]) => (
          <ComponentRow key={key} label={COMPONENT_LABELS[key]} value={value} />
        ))}
      </div>

      {/* Tips */}
      {data.tips.length > 0 && (
        <div className="mt-4 pt-4 border-t border-[#F3F4F6] space-y-2">
          <p className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wide">Melhorar score</p>
          {data.tips.map(tip => (
            <Link
              key={tip.component}
              href={tip.ctaHref}
              className="flex items-center justify-between p-2.5 rounded-[6px] bg-[#FAFAFA] hover:bg-[#F3F4F6] transition-colors group"
            >
              <p className="text-[12px] text-[#0D0D0D] flex-1">{tip.message}</p>
              <span className="flex items-center gap-1 text-[11px] font-medium text-[#0BD904] flex-shrink-0 ml-2 group-hover:underline">
                {tip.ctaLabel} <ArrowRight size={10} />
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
