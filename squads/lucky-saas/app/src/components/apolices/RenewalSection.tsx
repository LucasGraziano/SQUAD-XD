'use client'

import Link from 'next/link'
import { RefreshCw } from 'lucide-react'
import { RenewalButton } from '@/components/alertas/RenewalButton'

interface Props {
  policyId: string
  renewalQuoteId: string | null | undefined
  renewedByApoliceId: string | null | undefined
}

export function RenewalSection({ policyId, renewalQuoteId, renewedByApoliceId }: Props) {
  return (
    <div className="bg-white rounded-[8px] border border-[#E5E5E5] p-5">
      <div className="flex items-center gap-2 mb-3">
        <RefreshCw size={14} className="text-[#6B7280]" />
        <p className="text-[13px] font-semibold text-[#0D0D0D]">Renovação</p>
      </div>

      {renewedByApoliceId ? (
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] bg-[#DCFCE7] text-[#16A34A] text-[11px] font-semibold">
            ✅ Renovada
          </span>
          <Link
            href={`/apolices/${renewedByApoliceId}`}
            className="text-[13px] text-[#2563EB] hover:underline"
          >
            Ver nova apólice →
          </Link>
        </div>
      ) : renewalQuoteId ? (
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] bg-[#EFF6FF] text-[#2563EB] text-[11px] font-semibold">
            <RefreshCw size={10} />
            Em andamento
          </span>
          <Link
            href="/cotacoes"
            className="text-[13px] text-[#2563EB] hover:underline"
          >
            Ver proposta de renovação →
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <p className="text-[13px] text-[#9CA3AF]">Nenhuma renovação iniciada.</p>
          <RenewalButton
            policyId={policyId}
            hasRenewalQuote={false}
            renewalQuoteId={null}
          />
        </div>
      )}
    </div>
  )
}
