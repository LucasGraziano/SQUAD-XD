'use client'

import { useState, useTransition } from 'react'
import { X, FileCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { convertQuoteToApolice } from '@/app/actions/quotes'
import { cn } from '@/lib/utils/cn'

interface Props {
  quoteId: string
  open: boolean
  onClose: () => void
  onConverted: (apoliceId: string) => void
}

const inputCls = 'h-10 w-full rounded-[6px] border border-[#D1D1D1] bg-white px-3 text-[13px] text-[#0D0D0D] placeholder-[#9CA3AF] outline-none focus:border-[#0BD904] transition-colors'

function today() {
  return new Date().toISOString().split('T')[0]
}
function oneYearFromNow() {
  const d = new Date()
  d.setFullYear(d.getFullYear() + 1)
  return d.toISOString().split('T')[0]
}

export function ConvertToApoliceModal({ quoteId, open, onClose, onConverted }: Props) {
  const [numeroApolice, setNumeroApolice] = useState('')
  const [vigenciaInicio, setVigenciaInicio] = useState(today())
  const [vigenciaFim, setVigenciaFim] = useState(oneYearFromNow())
  const [comissao, setComissao] = useState('5')
  const [error, setError] = useState<string | null>(null)
  const [, startTransition] = useTransition()

  if (!open) return null

  function handleClose() {
    setError(null)
    onClose()
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!numeroApolice.trim()) { setError('Número da apólice é obrigatório'); return }
    if (!vigenciaInicio || !vigenciaFim) { setError('Datas de vigência são obrigatórias'); return }
    if (vigenciaFim <= vigenciaInicio) { setError('Fim de vigência deve ser após o início'); return }

    startTransition(async () => {
      const result = await convertQuoteToApolice(quoteId, {
        numero_apolice: numeroApolice.trim(),
        vigencia_inicio: vigenciaInicio,
        vigencia_fim: vigenciaFim,
        comissao_pct: comissao ? parseFloat(comissao) : undefined,
      })

      if (result.error) {
        setError(result.error)
      } else if (result.apoliceId) {
        onConverted(result.apoliceId)
        handleClose()
      }
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={handleClose} />
      <div className="relative z-10 w-full max-w-[480px] bg-white rounded-[12px] shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E5E5]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-[6px] bg-[rgba(11,217,4,0.10)] flex items-center justify-center">
              <FileCheck size={16} className="text-[#0BD904]" />
            </div>
            <div>
              <h2 className="text-[15px] font-semibold text-[#0D0D0D]">Converter em Apólice</h2>
              <p className="text-[11px] text-[#9CA3AF]">A cotação aprovada será vinculada à nova apólice</p>
            </div>
          </div>
          <button onClick={handleClose} className="p-1 rounded-[5px] text-[#9CA3AF] hover:text-[#0D0D0D]">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Número da apólice */}
          <div>
            <label className="block text-[12px] font-medium text-[#0D0D0D] mb-1.5">
              Número da Apólice <span className="text-[#DC2626]">*</span>
            </label>
            <input
              type="text"
              className={inputCls}
              placeholder="Ex: AP-2026-001234"
              value={numeroApolice}
              onChange={e => setNumeroApolice(e.target.value)}
              autoFocus
            />
          </div>

          {/* Vigência */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-medium text-[#0D0D0D] mb-1.5">
                Início da Vigência <span className="text-[#DC2626]">*</span>
              </label>
              <input
                type="date"
                className={inputCls}
                value={vigenciaInicio}
                onChange={e => setVigenciaInicio(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-[#0D0D0D] mb-1.5">
                Fim da Vigência <span className="text-[#DC2626]">*</span>
              </label>
              <input
                type="date"
                className={inputCls}
                value={vigenciaFim}
                onChange={e => setVigenciaFim(e.target.value)}
              />
            </div>
          </div>

          {/* Comissão */}
          <div>
            <label className="block text-[12px] font-medium text-[#0D0D0D] mb-1.5">
              Comissão (%)
            </label>
            <input
              type="number"
              className={cn(inputCls, 'w-32')}
              placeholder="5"
              min="0"
              max="100"
              step="0.1"
              value={comissao}
              onChange={e => setComissao(e.target.value)}
            />
            <p className="text-[11px] text-[#9CA3AF] mt-1">Padrão: 5% se deixado em branco</p>
          </div>

          {error && (
            <div className="rounded-[6px] bg-[#FEF2F2] border border-[#FECACA] px-3 py-2">
              <p className="text-[12px] text-[#DC2626]">{error}</p>
            </div>
          )}

          {/* Footer */}
          <div className="flex gap-2 pt-2">
            <Button type="button" variant="secondary" size="sm" className="flex-1" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" size="sm" className="flex-1">
              Gerar Apólice
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
