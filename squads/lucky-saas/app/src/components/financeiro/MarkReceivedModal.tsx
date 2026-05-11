'use client'

import { useState, useTransition } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { markCommissionReceived } from '@/app/actions/commission'

interface Props {
  open: boolean
  onOpenChange: (v: boolean) => void
  policyId: string
  expectedAmount: number
  onMarked: () => void
}

export function MarkReceivedModal({ open, onOpenChange, policyId, expectedAmount, onMarked }: Props) {
  const [amount, setAmount] = useState(expectedAmount.toFixed(2))
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [error, setError] = useState('')
  const [, startTransition] = useTransition()

  if (!open) return null

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const parsed = parseFloat(amount)
    if (isNaN(parsed) || parsed <= 0) { setError('Valor inválido'); return }
    if (!date) { setError('Data é obrigatória'); return }

    setError('')
    startTransition(async () => {
      const result = await markCommissionReceived(policyId, { amount: parsed, date })
      if (result.error) { setError(result.error); return }
      onMarked()
      onOpenChange(false)
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={() => onOpenChange(false)} />
      <div className="relative bg-white rounded-[12px] shadow-xl w-full max-w-[380px] mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E5E5]">
          <h2 className="text-[15px] font-semibold text-[#0D0D0D]">Marcar Comissão Recebida</h2>
          <button onClick={() => onOpenChange(false)} className="p-1 rounded-[5px] text-[#9CA3AF] hover:text-[#0D0D0D]">
            <X size={16} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-[12px] font-semibold text-[#6B7280] uppercase tracking-wide mb-1.5">Valor Recebido (R$)</label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="w-full h-9 px-3 rounded-[6px] border border-[#D1D1D1] text-[13px] focus:outline-none focus:border-[#0BD904]"
            />
            <p className="text-[11px] text-[#9CA3AF] mt-1">
              Esperado: R$ {expectedAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-[#6B7280] uppercase tracking-wide mb-1.5">Data de Recebimento</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full h-9 px-3 rounded-[6px] border border-[#D1D1D1] text-[13px] focus:outline-none focus:border-[#0BD904]"
            />
          </div>
          {error && <p className="text-[12px] text-[#DC2626]">{error}</p>}
          <div className="flex gap-2 pt-2">
            <Button type="button" variant="secondary" size="sm" className="flex-1" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" size="sm" className="flex-1">Confirmar</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
