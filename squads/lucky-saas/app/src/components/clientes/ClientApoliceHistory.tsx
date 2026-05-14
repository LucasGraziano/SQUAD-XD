'use client'

import { useEffect, useState } from 'react'
import { getClientHistory } from '@/app/actions/clients'
import type { ApoliceHistoryItem } from '@/lib/clients/renewal-history'
import { ApoliceHistoryItemRow } from './ApoliceHistoryItemRow'

function formatCurrency(n: number) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

interface Props {
  clientId: string
}

export function ClientApoliceHistory({ clientId }: Props) {
  const [history, setHistory] = useState<ApoliceHistoryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getClientHistory(clientId).then((data) => {
      setHistory(data)
      setLoading(false)
    })
  }, [clientId])

  if (loading) {
    return (
      <div className="py-10 text-center">
        <p className="text-[13px] text-[#9CA3AF]">Carregando histórico...</p>
      </div>
    )
  }

  if (history.length === 0) {
    return (
      <div className="py-10 text-center">
        <p className="text-[13px] text-[#9CA3AF]">Nenhuma apólice encontrada no histórico.</p>
      </div>
    )
  }

  const active = history.filter((p) => p.status === 'ativa')
  const totalPremio = active.reduce((s, p) => s + p.premio, 0)

  // Build a map of id → numero_apolice for renewal chain links
  const idToNumber = new Map<string, string>(history.map((p) => [p.id, p.numero_apolice]))

  return (
    <div className="space-y-4">
      {/* Totals */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total de apólices', value: String(history.length) },
          { label: 'Apólices ativas', value: String(active.length) },
          { label: 'Prêmio total ativo', value: formatCurrency(totalPremio) },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-[8px] border border-[#E5E5E5] p-4">
            <p className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-2">{label}</p>
            <p className="text-[20px] font-bold text-[#0D0D0D] font-mono">{value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-[8px] border border-[#E5E5E5] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#F3F4F6]">
              {['Número', 'Ramo', 'Seguradora', 'Vigência', 'Prêmio', 'Status', ''].map((h) => (
                <th key={h} className="px-5 py-2.5 text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider text-left">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {history.map((item) => (
              <ApoliceHistoryItemRow
                key={item.id}
                item={item}
                renewedByNumber={item.renewed_by_apolice_id ? (idToNumber.get(item.renewed_by_apolice_id) ?? null) : null}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
