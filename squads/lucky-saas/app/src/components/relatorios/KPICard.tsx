import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface Props {
  label: string
  value: string
  previous?: string
  currentRaw: number
  previousRaw: number
  unit?: string
  description?: string
}

export function KPICard({ label, value, currentRaw, previousRaw, unit = '', description }: Props) {
  const hasChange = previousRaw > 0
  const pctChange = hasChange ? ((currentRaw - previousRaw) / previousRaw) * 100 : 0
  const isPositive = pctChange > 0
  const isNeutral = Math.abs(pctChange) < 1

  return (
    <div className="bg-white rounded-[8px] border border-[#E5E5E5] p-5">
      <p className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wide mb-2">{label}</p>
      <p className="text-[26px] font-bold text-[#0D0D0D] leading-none font-mono mb-1">
        {value}{unit && <span className="text-[16px] text-[#9CA3AF] font-normal ml-0.5">{unit}</span>}
      </p>
      {hasChange && (
        <div className={cn('flex items-center gap-1 mt-1.5',
          isNeutral ? 'text-[#9CA3AF]' : isPositive ? 'text-[#16A34A]' : 'text-[#DC2626]'
        )}>
          {isNeutral
            ? <Minus size={12} />
            : isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />
          }
          <span className="text-[11px] font-semibold">
            {isNeutral ? 'Estável' : `${isPositive ? '+' : ''}${pctChange.toFixed(1)}%`}
          </span>
          <span className="text-[10px] text-[#9CA3AF]">vs período ant.</span>
        </div>
      )}
      {description && <p className="text-[11px] text-[#9CA3AF] mt-1">{description}</p>}
    </div>
  )
}
