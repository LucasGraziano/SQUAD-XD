import { MessageCircle, TrendingUp } from 'lucide-react'
import type { CrossSellOpportunity } from '@/lib/portfolio/cross-sell'
import { cn } from '@/lib/utils/cn'

const RAMO_ICONS: Record<string, string> = {
  auto: '🚗', vida: '❤️', saude: '🏥', residencial: '🏠',
  empresarial: '🏢', viagem: '✈️', consorcio: '🤝',
}

interface Props {
  opportunities: CrossSellOpportunity[]
}

function OpportunityCard({ op }: { op: CrossSellOpportunity }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-[6px] bg-[#FFFBEB] border border-[#FDE68A]">
      <span className="text-[20px] flex-shrink-0">{RAMO_ICONS[op.suggestedRamo] ?? '📋'}</span>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-[#0D0D0D]">{op.title}</p>
        <p className="text-[11px] text-[#6B7280] mt-0.5">{op.description}</p>
      </div>
      <a
        href={`https://wa.me/?text=${encodeURIComponent(op.whatsappTemplate)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 h-7 px-2.5 rounded-[5px] bg-[#25D366] text-white text-[11px] font-medium hover:bg-[#1da851] transition-colors flex-shrink-0"
      >
        <MessageCircle size={11} />
        Contatar
      </a>
    </div>
  )
}

export function CrossSellWidget({ opportunities }: Props) {
  if (opportunities.length === 0) return null

  return (
    <div className="bg-white rounded-[8px] border border-[#E5E5E5] p-5">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp size={14} className="text-[#D97706]" />
        <p className="text-[14px] font-semibold text-[#0D0D0D]">Oportunidades de Cross-sell</p>
        <span className="ml-auto px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#D97706] text-[11px] font-bold">
          {opportunities.length}
        </span>
      </div>
      <div className="space-y-2">
        {opportunities.map(op => (
          <OpportunityCard key={op.id} op={op} />
        ))}
      </div>
    </div>
  )
}
