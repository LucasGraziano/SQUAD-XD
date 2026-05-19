'use client'

import { useState, useTransition } from 'react'
import { X, FileCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { convertDealToPolicy } from '@/app/actions/deals'

interface Props {
  dealId: string
  open: boolean
  onClose: () => void
  onConverted: (apoliceId: string) => void
}

const inputCls = 'h-10 w-full rounded-[6px] border border-[#D1D1D1] bg-white px-3 text-[13px] text-[#0D0D0D] placeholder-[#9CA3AF] outline-none focus:border-[#0BD904] transition-colors'

function today() { return new Date().toISOString().split('T')[0] }
function oneYearFromNow() {
  const d = new Date(); d.setFullYear(d.getFullYear() + 1); return d.toISOString().split('T')[0]
}

export function ConvertToApoliceModal({ dealId, open, onClose, onConverted }: Props) {
  const [numeroApolice, setNumeroApolice] = useState('')
  const [vigenciaInicio, setVigenciaInicio] = useState(today())
  const [vigenciaFim, setVigenciaFim] = useState(oneYearFromNow())
  const [comissao, setComissao] = useState('5')
  const [error, setError] = useState<string | null>(null)
  const [, startTransition] = useTransition()

  if (!open) return null

  function handleClose() { setError(null); onClose() }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!numeroApolice.trim()) { setError('Número da apólice é obrigatório'); return }
    if (!vigenciaInicio || !vigenciaFim) { setError('Datas de vigência são obrigatórias'); return }
    if (vigenciaFim <= vigenciaInicio) { setError('Fim de vigência deve ser após o início'); return }

    startTransition(async () => {
      const result = await convertDealToPolicy(dealId, {
        numero_apolice:  numeroApolice.trim(),
        vigencia_inicio: vigenciaInicio,
        vigencia_fim:    vigenciaFim,
        comissao_pct:    comissao ? parseFloat(comissao) : undefined,
      })
      if (result.error) { setError(result.error) }
      else if (result.apoliceId) { onConverted(result.apoliceId); handleClose() }
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={handleClose} />
      <div className="relative bg-white rounded-[12px] shadow-xl w-full max-w-[420px] p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <FileCheck size={18} className="text-[#0BD904]" />
            <h2 className="text-[16px] font-semibold text-[#0D0D0D]">Registrar Apólice</h2>
          </div>
          <button onClick={handleClose} className="text-[#9CA3AF] hover:text-[#0D0D0D]"><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-[12px] font-medium text-[#374151] mb-1">Número da Apólice *</label>
            <input className={inputCls} value={numeroApolice} onChange={(e) => setNumeroApolice(e.target.value)} placeholder="Ex: 123456789" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-medium text-[#374151] mb-1">Início</label>
              <input type="date" className={inputCls} value={vigenciaInicio} onChange={(e) => setVigenciaInicio(e.target.value)} />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-[#374151] mb-1">Fim</label>
              <input type="date" className={inputCls} value={vigenciaFim} onChange={(e) => setVigenciaFim(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="block text-[12px] font-medium text-[#374151] mb-1">Comissão (%)</label>
            <input type="number" className={inputCls} value={comissao} onChange={(e) => setComissao(e.target.value)} step="0.1" min="0" max="100" />
          </div>
          {error && <p className="text-[13px] text-[#DC2626]">{error}</p>}
          <div className="flex gap-2 justify-end pt-1">
            <Button type="button" variant="secondary" onClick={handleClose}>Cancelar</Button>
            <Button type="submit">Confirmar</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
