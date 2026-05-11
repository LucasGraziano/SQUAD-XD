'use client'

import { useState } from 'react'
import { CheckCircle } from 'lucide-react'
import { MarkReceivedModal } from './MarkReceivedModal'
import type { CommissionEntry } from '@/app/actions/commission'
import { RAMO_LABELS } from '@/types/policy'
import { cn } from '@/lib/utils/cn'

function formatBRL(n: number | null) {
  if (n == null) return '—'
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}
function formatDate(s: string | null) {
  if (!s) return '—'
  return new Intl.DateTimeFormat('pt-BR').format(new Date(s + 'T12:00:00'))
}

const STATUS_CONFIG = {
  prevista:  { label: 'Prevista',  className: 'bg-[#F3F4F6] text-[#6B7280]' },
  recebida:  { label: 'Recebida',  className: 'bg-[#DCFCE7] text-[#16A34A]' },
  vencida:   { label: 'Vencida',   className: 'bg-[#FEE2E2] text-[#DC2626]' },
}

interface Props {
  entry: CommissionEntry
  onMarked: () => void
}

export function CommissionRow({ entry, onMarked }: Props) {
  const [modalOpen, setModalOpen] = useState(false)
  const cfg = STATUS_CONFIG[entry.commission_status ?? 'prevista'] ?? STATUS_CONFIG.prevista

  return (
    <>
      <tr className="border-b border-[#F3F4F6] hover:bg-[#FAFAFA] transition-colors">
        <td className="px-4 py-3 text-[12px] text-[#9CA3AF] whitespace-nowrap">{formatDate(entry.start_date)}</td>
        <td className="px-4 py-3 text-[13px] font-medium text-[#0D0D0D] max-w-[140px] truncate">{entry.clients?.name ?? '—'}</td>
        <td className="px-4 py-3 text-[12px] text-[#6B7280]">{entry.seguradora}</td>
        <td className="px-4 py-3">
          <span className="px-1.5 py-0.5 rounded-[3px] bg-[rgba(11,217,4,0.08)] text-[#034001] text-[10px] font-medium">
            {RAMO_LABELS[entry.ramo] ?? entry.ramo}
          </span>
        </td>
        <td className="px-4 py-3 text-[12px] font-mono text-[#6B7280]">{formatBRL(entry.premium_total)}</td>
        <td className="px-4 py-3 text-[12px] text-[#9CA3AF]">{entry.commission_pct?.toFixed(1)}%</td>
        <td className="px-4 py-3 text-[12px] font-mono font-semibold text-[#0D0D0D]">{formatBRL(entry.commission_expected)}</td>
        <td className="px-4 py-3 text-[12px] font-mono text-[#0BD904]">{formatBRL(entry.commission_received)}</td>
        <td className="px-4 py-3">
          <span className={cn('px-1.5 py-0.5 rounded-[4px] text-[10px] font-semibold', cfg.className)}>
            {cfg.label}
          </span>
        </td>
        <td className="px-4 py-3">
          {entry.commission_status !== 'recebida' && (
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-[5px] text-[11px] font-medium text-[#0BD904] border border-[rgba(11,217,4,0.3)] hover:bg-[rgba(11,217,4,0.08)] transition-colors"
            >
              <CheckCircle size={11} />
              Recebida
            </button>
          )}
          {entry.commission_status === 'recebida' && entry.commission_received_at && (
            <span className="text-[11px] text-[#9CA3AF]">{formatDate(entry.commission_received_at)}</span>
          )}
        </td>
      </tr>

      <MarkReceivedModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        policyId={entry.id}
        expectedAmount={entry.commission_expected ?? 0}
        onMarked={onMarked}
      />
    </>
  )
}
