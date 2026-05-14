import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { ApoliceHistoryItem } from '@/lib/clients/renewal-history'
import { ApoliceStatusBadge } from './ApoliceStatusBadge'
import { RAMO_LABELS } from '@/types/policy'

function formatDate(s: string) {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(s + 'T00:00:00'))
}

function formatCurrency(n: number) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

interface Props {
  item: ApoliceHistoryItem
  renewedByNumber: string | null
}

export function ApoliceHistoryItemRow({ item, renewedByNumber }: Props) {
  return (
    <tr className="border-b border-[#F3F4F6] hover:bg-[#FAFAFA] transition-colors">
      <td className="px-5 py-3">
        <div className="flex flex-col gap-0.5">
          <span className="text-[13px] font-mono text-[#0D0D0D]">{item.numero_apolice}</span>
          {item.status === 'renovada' && renewedByNumber && (
            <Link
              href={`/apolices/${item.renewed_by_apolice_id}`}
              className="inline-flex items-center gap-1 text-[11px] text-[#1D4ED8] hover:underline"
            >
              Renovada por <ArrowRight size={10} /> #{renewedByNumber}
            </Link>
          )}
        </div>
      </td>
      <td className="px-5 py-3">
        <span className="px-2 py-0.5 rounded-[4px] bg-[rgba(11,217,4,0.08)] text-[#034001] text-[11px] font-medium">
          {RAMO_LABELS[item.ramo] ?? item.ramo}
        </span>
      </td>
      <td className="px-5 py-3 text-[13px] text-[#6B7280]">{item.seguradora}</td>
      <td className="px-5 py-3 text-[13px] text-[#6B7280] whitespace-nowrap">
        {formatDate(item.vigencia_inicio)} → {formatDate(item.vigencia_fim)}
      </td>
      <td className="px-5 py-3 text-[13px] font-mono text-[#0D0D0D]">
        {formatCurrency(item.premio)}
      </td>
      <td className="px-5 py-3">
        <ApoliceStatusBadge status={item.status} />
      </td>
      <td className="px-5 py-3">
        <Link
          href={`/apolices/${item.id}`}
          className="text-[12px] text-[#6B7280] hover:text-[#0BD904] transition-colors"
        >
          Ver detalhes
        </Link>
      </td>
    </tr>
  )
}
