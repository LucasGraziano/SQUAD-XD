'use client'

import { useState, useRef, useEffect } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createDeal } from '@/app/actions/deals'
import { fetchClients } from '@/app/actions/clients'
import type { DealSummary } from '@/app/actions/deals'
import type { Client } from '@/types/client'

const RAMOS = [
  { value: 'auto',        label: 'Auto' },
  { value: 'vida',        label: 'Vida' },
  { value: 'saude',       label: 'Saúde' },
  { value: 'residencial', label: 'Residencial' },
  { value: 'empresarial', label: 'Empresarial' },
  { value: 'viagem',      label: 'Viagem' },
  { value: 'consorcio',   label: 'Consórcio' },
]

const SOURCES = [
  { value: 'indicacao', label: 'Indicação' },
  { value: 'site',      label: 'Site' },
  { value: 'ligacao',   label: 'Ligação' },
  { value: 'evento',    label: 'Evento' },
  { value: 'manual',    label: 'Manual' },
]

const selectCls = "h-9 w-full rounded-[6px] border border-[#D1D1D1] bg-white px-3 text-[13px] text-[#0D0D0D] outline-none focus:border-[#0BD904] transition-colors"
const labelCls  = "block text-[12px] font-medium text-[#374151] mb-1"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated: (deal: DealSummary) => void
}

export function NewDealModal({ open, onOpenChange, onCreated }: Props) {
  const [clientSearch, setClientSearch] = useState('')
  const [clientOptions, setClientOptions] = useState<Client[]>([])
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const [ramo, setRamo] = useState('auto')
  const [source, setSource] = useState('manual')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!clientSearch.trim() || selectedClient) return
    const timer = setTimeout(async () => {
      const { data } = await fetchClients({ search: clientSearch, perPage: 8 })
      setClientOptions(data)
      setShowDropdown(true)
    }, 250)
    return () => clearTimeout(timer)
  }, [clientSearch, selectedClient])

  function selectClient(c: Client) {
    setSelectedClient(c)
    setClientSearch(c.name)
    setShowDropdown(false)
  }

  function reset() {
    setClientSearch('')
    setClientOptions([])
    setSelectedClient(null)
    setShowDropdown(false)
    setRamo('auto')
    setSource('manual')
    setNotes('')
    setError(null)
    setSubmitting(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedClient) { setError('Selecione um cliente'); return }
    setSubmitting(true)
    setError(null)

    const result = await createDeal({
      clientId: selectedClient.id,
      ramo,
      source,
      notes: notes || undefined,
    })

    setSubmitting(false)
    if (result.error) { setError(result.error); return }

    // Fetch the created deal to pass to parent
    // We pass a minimal stub so the parent can add it optimistically
    const stub: DealSummary = {
      id:               result.dealId!,
      stage:            'prospecting',
      ramo,
      source,
      object_description: null,
      notes:            notes || null,
      share_token:      '',
      view_count:       0,
      last_viewed_at:   null,
      sent_at:          null,
      approved_at:      null,
      submitted_at:     null,
      issued_at:        null,
      contracted_at:    null,
      rejected_at:      null,
      response_deadline: null,
      proposal_number:  null,
      protocol_number:  null,
      rejection_reason: null,
      policy_id:        null,
      apolice_id:       null,
      lead_id:          null,
      original_lead_id: null,
      created_at:       new Date().toISOString(),
      updated_at:       new Date().toISOString(),
      clients: { id: selectedClient.id, name: selectedClient.name, phone: selectedClient.phone ?? null, email: selectedClient.email ?? null },
      deal_items: [],
    }

    onCreated(stub)
    reset()
    onOpenChange(false)
  }

  return (
    <Dialog.Root open={open} onOpenChange={(v) => { if (!v) reset(); onOpenChange(v) }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-[440px] bg-white rounded-[12px] shadow-xl p-6 focus:outline-none">
          <div className="flex items-center justify-between mb-5">
            <Dialog.Title className="text-[16px] font-semibold text-[#0D0D0D]">
              Nova Negociação
            </Dialog.Title>
            <Dialog.Close className="text-[#9CA3AF] hover:text-[#0D0D0D] transition-colors">
              <X size={18} />
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Client autocomplete */}
            <div className="relative">
              <label className={labelCls}>Cliente *</label>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                <input
                  ref={searchRef}
                  type="text"
                  value={clientSearch}
                  onChange={(e) => { setClientSearch(e.target.value); setSelectedClient(null) }}
                  placeholder="Buscar cliente..."
                  className="h-9 w-full rounded-[6px] border border-[#D1D1D1] bg-white pl-8 pr-3 text-[13px] outline-none focus:border-[#0BD904] transition-colors"
                />
              </div>
              {showDropdown && clientOptions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E5E5E5] rounded-[8px] shadow-lg z-10 max-h-[200px] overflow-y-auto">
                  {clientOptions.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => selectClient(c)}
                      className="w-full text-left px-3 py-2 text-[13px] hover:bg-[#F8F8F8] transition-colors"
                    >
                      <p className="font-medium text-[#0D0D0D]">{c.name}</p>
                      {c.phone && <p className="text-[11px] text-[#9CA3AF]">{c.phone}</p>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Ramo */}
            <div>
              <label className={labelCls}>Ramo</label>
              <select value={ramo} onChange={(e) => setRamo(e.target.value)} className={selectCls}>
                {RAMOS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>

            {/* Source */}
            <div>
              <label className={labelCls}>Origem</label>
              <select value={source} onChange={(e) => setSource(e.target.value)} className={selectCls}>
                {SOURCES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>

            {/* Notes */}
            <div>
              <label className={labelCls}>Observações</label>
              <Input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ex: precisa de cobertura ampliada..."
              />
            </div>

            {error && <p className="text-[13px] text-[#DC2626]">{error}</p>}

            <div className="flex gap-2 justify-end pt-1">
              <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Criando...' : 'Criar Negociação'}
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
