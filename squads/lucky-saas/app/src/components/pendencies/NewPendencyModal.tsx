'use client'

import { useState, useTransition } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createPendency } from '@/app/actions/pendencies'
import type { Pendency } from '@/app/actions/pendencies'
import { cn } from '@/lib/utils/cn'

interface Props {
  open: boolean
  onOpenChange: (v: boolean) => void
  policyId?: string
  leadId?: string
  onCreated: (p: Pendency) => void
}

export function NewPendencyModal({ open, onOpenChange, policyId, leadId, onCreated }: Props) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium')
  const [dueDate, setDueDate] = useState('')
  const [error, setError] = useState('')
  const [, startTransition] = useTransition()

  if (!open) return null

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) { setError('Título é obrigatório'); return }

    setError('')
    startTransition(async () => {
      const result = await createPendency({
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        due_date: dueDate || undefined,
        policy_id: policyId,
        lead_id: leadId,
      })
      if (result.error) { setError(result.error); return }
      if (result.data) {
        onCreated(result.data)
        setTitle(''); setDescription(''); setPriority('medium'); setDueDate('')
        onOpenChange(false)
      }
    })
  }

  const PRIORITY_OPTS = [
    { value: 'high', label: 'Alta', color: 'bg-[#FEE2E2] text-[#DC2626]' },
    { value: 'medium', label: 'Média', color: 'bg-[#FEF3C7] text-[#D97706]' },
    { value: 'low', label: 'Baixa', color: 'bg-[#F3F4F6] text-[#6B7280]' },
  ] as const

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={() => onOpenChange(false)} />
      <div className="relative bg-white rounded-[12px] shadow-xl w-full max-w-[440px] mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E5E5]">
          <h2 className="text-[15px] font-semibold text-[#0D0D0D]">Nova Pendência</h2>
          <button onClick={() => onOpenChange(false)} className="p-1 rounded-[5px] text-[#9CA3AF] hover:text-[#0D0D0D] hover:bg-[#F3F4F6]">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-[12px] font-semibold text-[#6B7280] uppercase tracking-wide mb-1.5">Título *</label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Ex: Enviar CNH, Assinar proposta..."
              className="w-full h-9 px-3 rounded-[6px] border border-[#D1D1D1] text-[13px] text-[#0D0D0D] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#0BD904] focus:ring-1 focus:ring-[#0BD904]/20"
            />
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-[#6B7280] uppercase tracking-wide mb-1.5">Descrição</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={2}
              placeholder="Detalhes adicionais..."
              className="w-full px-3 py-2 rounded-[6px] border border-[#D1D1D1] text-[13px] text-[#0D0D0D] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#0BD904] focus:ring-1 focus:ring-[#0BD904]/20 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-semibold text-[#6B7280] uppercase tracking-wide mb-1.5">Prioridade</label>
              <div className="flex gap-1.5">
                {PRIORITY_OPTS.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setPriority(opt.value)}
                    className={cn(
                      'flex-1 py-1.5 rounded-[5px] text-[11px] font-semibold transition-all',
                      priority === opt.value ? opt.color : 'bg-[#F3F4F6] text-[#9CA3AF]'
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[#6B7280] uppercase tracking-wide mb-1.5">Prazo</label>
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="w-full h-9 px-3 rounded-[6px] border border-[#D1D1D1] text-[13px] text-[#0D0D0D] focus:outline-none focus:border-[#0BD904] focus:ring-1 focus:ring-[#0BD904]/20"
              />
            </div>
          </div>

          {error && <p className="text-[12px] text-[#DC2626]">{error}</p>}

          <div className="flex gap-2 pt-2">
            <Button type="button" variant="secondary" size="sm" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" size="sm" className="flex-1">
              Criar Pendência
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
