'use client'

import Link from 'next/link'
import { FileText } from 'lucide-react'

interface Props {
  quoteId: string
}

export function LeadQuoteBadge({ quoteId }: Props) {
  return (
    <Link
      href="/cotacoes"
      onClick={e => e.stopPropagation()}
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] text-[10px] font-semibold hover:bg-[#DBEAFE] transition-colors"
      title={`Cotação vinculada: ${quoteId}`}
    >
      <FileText size={9} />
      Cotação vinculada
    </Link>
  )
}
