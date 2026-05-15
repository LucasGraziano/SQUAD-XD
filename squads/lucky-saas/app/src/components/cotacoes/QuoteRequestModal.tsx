'use client'

import { useState, useEffect } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { createQuoteRequest, updateQuoteRequest } from '@/app/(dashboard)/cotacoes/actions'
import type { QuoteRequest } from '@/types/quote'
import type { DocClient } from '@/app/(dashboard)/documentos/page'
import { RAMO_LABELS } from '@/types/policy'

const selectCls = "h-[42px] w-full rounded-[6px] border border-[#D1D1D1] bg-white px-3 text-[14px] text-[#0D0D0D] outline-none focus:border-[#0BD904] focus:shadow-[0_0_0_3px_rgba(11,217,4,0.12)] transition-colors"
const labelCls = "text-[13px] font-medium text-[#0D0D0D] mb-1.5 block"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSaved: (q: QuoteRequest) => void
  clients: DocClient[]
  editing?: QuoteRequest | null
}

export function QuoteRequestModal({ open, onOpenChange, onSaved, clients, editing }: Props) {
  const [clientId, setClientId] = useState('')
  const [ramo, setRamo] = useState('')
  const [object, setObject] = useState('')
  const [notes, setNotes] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const isEditing = !!editing

  useEffect(() => {
    if (open && editing) {
      setClientId(editing.client_id)
      setRamo(editing.ramo)
      setObject(editing.object_description ?? '')
      setNotes(editing.notes ?? '')
      setErrors({}); setServerError(null)
    }
  }, [open, editing])

  useEffect(() => {
    if (!open) {
      setClientId(''); setRamo(''); setObject(''); setNotes('')
      setErrors({}); setServerError(null)
    }
  }, [open])

  function validate() {
    const e: Record<string, string> = {}
    if (!clientId) e.clientId = 'Selecione o cliente'
    if (!ramo) e.ramo = 'Selecione o ramo'
    return e
  }

  async function handleSave() {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }

    setSaving(true); setServerError(null)
    const input = { client_id: clientId, ramo, object_description: object, notes }

    const result = isEditing
      ? await updateQuoteRequest(editing!.id, input)
      : await createQuoteRequest(input)

    setSaving(false)
    if (result.error) { setServerError(result.error); return }
    onSaved(result.data as QuoteRequest)
    onOpenChange(false)
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-[480px] translate-x-[-50%] translate-y-[-50%] bg-white rounded-[12px] border border-[#E5E5E5] shadow-xl focus:outline-none">

          <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E5E5]">
            <Dialog.Title className="text-[18px] font-semibold text-[#0D0D0D]">
              {isEditing ? 'Editar Cotação' : 'Nova Cotação'}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="p-1.5 rounded-[6px] text-[#6B7280] hover:bg-[#F4F4F4] transition-colors">
                <X size={16} />
              </button>
            </Dialog.Close>
          </div>

          <div className="px-6 py-5 space-y-4">
            <div>
              <label className={labelCls}>Cliente <span className="text-[#DC2626]">*</span></label>
              <select value={clientId} onChange={(e) => setClientId(e.target.value)} className={selectCls}>
                <option value="">Selecionar cliente</option>
                {clients.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              {errors.clientId && <span className="text-[12px] text-[#DC2626]">{errors.clientId}</span>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Ramo <span className="text-[#DC2626]">*</span></label>
                <select value={ramo} onChange={(e) => setRamo(e.target.value)} className={selectCls}>
                  <option value="">Selecionar ramo</option>
                  {Object.entries(RAMO_LABELS).map(([v, l]) => (
                    <option key={v} value={v}>{l}</option>
                  ))}
                </select>
                {errors.ramo && <span className="text-[12px] text-[#DC2626]">{errors.ramo}</span>}
              </div>
              <Input
                label="O que será segurado"
                value={object}
                onChange={(e) => setObject(e.target.value)}
                placeholder={ramo === 'auto' ? 'Honda Civic 2022' : ramo === 'residencial' ? 'Ap. 32m², Florianópolis' : 'Descreva o objeto'}
              />
            </div>

            <div>
              <label className={labelCls}>Observações internas</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Ex: Cliente quer mais cobertura de terceiros, orçamento até R$ 200/mês"
                className="w-full rounded-[6px] border border-[#D1D1D1] bg-white px-3 py-2.5 text-[14px] placeholder:text-[#9CA3AF] outline-none focus:border-[#0BD904] transition-colors resize-none"
              />
            </div>

            {serverError && (
              <p className="text-[13px] text-[#DC2626] bg-[#FEF2F2] border border-[#FECACA] rounded-[6px] px-3 py-2">
                {serverError}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2 px-6 py-4 border-t border-[#E5E5E5]">
            <Dialog.Close asChild>
              <Button variant="secondary" size="sm">Cancelar</Button>
            </Dialog.Close>
            <Button size="sm" onClick={handleSave} loading={saving}>
              {isEditing ? 'Salvar' : 'Criar Cotação'}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
