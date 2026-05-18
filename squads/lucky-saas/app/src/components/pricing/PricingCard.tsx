import { Check } from 'lucide-react'
import Link from 'next/link'
import { CheckoutButton } from './CheckoutButton'
import type { Plan } from '@/lib/stripe'

interface PricingCardProps {
  plan: Plan
  name: string
  price: string
  description: string
  items: string[]
  highlight?: boolean
  badge?: string | null
  userState: 'guest' | 'trial' | 'active'
  currentPlan?: string | null
  highlighted?: boolean
}

export function PricingCard({
  plan,
  name,
  price,
  description,
  items,
  highlight,
  badge,
  userState,
  currentPlan,
  highlighted,
}: PricingCardProps) {
  const isCurrentPlan = userState === 'active' && currentPlan === plan

  return (
    <div
      id={`plan-${plan}`}
      className={`rounded-[8px] border p-6 flex flex-col transition-all ${
        highlight
          ? 'border-[#0BD904] shadow-[0_0_0_1px_#0BD904]'
          : 'border-[#E5E5E5]'
      } ${highlighted ? 'ring-2 ring-[#0BD904] ring-offset-2 animate-pulse-once' : ''}`}
    >
      {badge ? (
        <div className="mb-4 inline-flex">
          <span className="px-2.5 py-0.5 rounded-[4px] bg-[rgba(11,217,4,0.12)] text-[#034001] text-[11px] font-bold uppercase">
            {badge}
          </span>
        </div>
      ) : (
        <div className="mb-4 h-[22px]" />
      )}

      <p className="text-[14px] font-semibold text-[#6B7280] mb-1">{name}</p>
      <div className="flex items-baseline gap-1 mb-1">
        <span className="text-[36px] font-black text-[#0D0D0D] leading-none">{price}</span>
        <span className="text-[13px] text-[#9CA3AF]">/ mês</span>
      </div>
      <p className="text-[13px] text-[#6B7280] mb-6">{description}</p>

      <ul className="space-y-2.5 mb-8 flex-1">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2.5">
            {item.endsWith(':') ? (
              <span className="text-[12px] font-semibold text-[#9CA3AF] uppercase tracking-wide">{item}</span>
            ) : (
              <>
                <Check size={14} className="text-[#0BD904] mt-0.5 shrink-0" />
                <span className="text-[13px] text-[#374151]">{item}</span>
              </>
            )}
          </li>
        ))}
      </ul>

      {userState === 'guest' && (
        <Link
          href={`/signup?plan=${plan}`}
          className={`h-10 flex items-center justify-center rounded-[6px] text-[14px] font-semibold transition-colors ${
            highlight
              ? 'bg-[#0BD904] text-[#0D0D0D] hover:bg-[#09C003]'
              : 'border border-[#D1D1D1] bg-white text-[#0D0D0D] hover:bg-[#F4F4F4]'
          }`}
        >
          Começar trial grátis de 14 dias
        </Link>
      )}

      {userState === 'trial' && (
        <CheckoutButton
          plan={plan}
          label={`Assinar agora — ${price}/mês`}
          highlight={highlight}
        />
      )}

      {userState === 'active' && isCurrentPlan && (
        <div className="h-10 flex items-center justify-center rounded-[6px] text-[14px] font-semibold bg-[rgba(11,217,4,0.10)] text-[#034001]">
          Seu plano atual
        </div>
      )}

      {userState === 'active' && !isCurrentPlan && (
        <CheckoutButton
          plan={plan}
          label={`Fazer upgrade`}
          highlight={highlight}
        />
      )}
    </div>
  )
}
