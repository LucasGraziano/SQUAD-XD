'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getDealByPolicyId } from '@/app/actions/deals'
import { DEAL_STAGE_LABELS } from '@/lib/constants/deal-stages'

interface Props {
  policyId: string
}

export function DealOriginSection({ policyId }: Props) {
  const [deal, setDeal] = useState<{ id: string; stage: string; ramo: string; created_at: string } | null | 'loading'>('loading')

  useEffect(() => {
    getDealByPolicyId(policyId).then(setDeal)
  }, [policyId])

  if (deal === 'loading') return null
  if (!deal) return null

  return (
    <div className="bg-white rounded-[8px] border border-[#E5E5E5] p-4">
      <p className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-2">Negociação de Origem</p>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[13px] font-medium text-[#0D0D0D]">{deal.ramo}</p>
          <p className="text-[12px] text-[#9CA3AF] mt-0.5">
            {DEAL_STAGE_LABELS[deal.stage as keyof typeof DEAL_STAGE_LABELS] ?? deal.stage}
            {' · '}
            {new Date(deal.created_at).toLocaleDateString('pt-BR')}
          </p>
        </div>
        <Link
          href={`/deals/${deal.id}`}
          className="shrink-0 h-8 px-3 rounded-[6px] border border-[#D1D1D1] text-[12px] text-[#374151] hover:bg-[#F8F8F8] transition-colors inline-flex items-center"
        >
          Ver deal →
        </Link>
      </div>
    </div>
  )
}
