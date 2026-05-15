'use client'

import { useState, useEffect } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClientAction, updateClientAction } from '@/app/(dashboard)/apolices/actions'
import type { Client, TipoPessoa } from '@/types/client'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  client?: Client
  onCreated?: (client: Client) => void
  onUpdated?: (client: Client) => void
}

const INPUT_CLASS =
  'h-9 w-full rounded-[6px] border border-[#D1D1D1] bg-white px-3 text-[13px] placeholder:text-[#9CA3AF] outline-none focus:border-[#0BD904] transition-colors'

const LABEL_CLASS = 'block text-[11px] font-semibold text-[#6B7280] uppercase tracking-wide mb-1'

export function NovoClienteModal({ open, onOpenChange, client, onCreated, onUpdated }: Props) {
  const isEditing = !!client
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tipoPessoa, setTipoPessoa] = useState<TipoPessoa>('pf')

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    cpf_cnpj: '',
    birth_date: '',
    cep: '',
    notes: '',
  })

  useEffect(() => {
    if (client) {
      setForm({
        name: client.name ?? '',
        phone: client.phone ?? '',
        email: client.email ?? '',
        cpf_cnpj: client.cpf_cnpj ?? '',
        birth_date: client.birth_date ?? '',
        cep: client.cep ?? '',
        notes: client.notes ?? '',
      })
      setTipoPessoa(client.tipo_pessoa ?? 'pf')
    } else {
      reset()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, open])

  function set(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function reset() {
    setForm({ name: '', phone: '', email: '', cpf_cnpj: '', birth_date: '', cep: '', notes: '' })
    setTipoPessoa('pf')
    setError(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim() || !form.phone.trim()) {
      setError('Nome e telefone são obrigatórios.')
      return
    }
    setLoading(true)
    setError(null)

    const input = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email || undefined,
      cpf_cnpj: form.cpf_cnpj || undefined,
      birth_date: form.birth_date || undefined,
      cep: form.cep || undefined,
      tipo_pessoa: tipoPessoa,
      notes: form.notes || undefined,
    }

    const result = isEditing
      ? await updateClientAction(client.id, input)
      : await createClientAction(input)

    setLoading(false)

    if (result.error) {
      setError(result.error)
      return
    }

    if (isEditing) {
      onUpdated?.(result.data as Client)
    } else {
      onCreated?.(result.data as Client)
      reset()
    }
    onOpenChange(false)
  }

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(v) => {
        if (!v) reset()
        onOpenChange(v)
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-50" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-[520px] max-h-[90vh] overflow-y-auto -translate-x-[50%] -translate-y-[50%] rounded-[12px] bg-white shadow-xl focus:outline-none">
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-[#E5E5E5]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[rgba(11,217,4,0.1)] flex items-center justify-center">
                <User size={15} className="text-[#034001]" />
              </div>
              <Dialog.Title className="text-[15px] font-semibold text-[#0D0D0D]">
                {isEditing ? 'Editar Cliente' : 'Novo Cliente'}
              </Dialog.Title>
            </div>
            <Dialog.Close asChild>
              <button className="p-1.5 rounded-[6px] text-[#9CA3AF] hover:text-[#0D0D0D] hover:bg-[#F3F4F6] transition-colors">
                <X size={16} />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
            {/* Tipo Pessoa toggle */}
            <div>
              <span className={LABEL_CLASS}>Tipo</span>
              <div className="flex gap-2">
                {(['pf', 'pj'] as TipoPessoa[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTipoPessoa(t)}
                    className={`flex-1 h-9 rounded-[6px] text-[13px] font-medium border transition-colors ${
                      tipoPessoa === t
                        ? 'bg-[#0BD904] border-[#0BD904] text-white'
                        : 'border-[#D1D1D1] text-[#6B7280] hover:border-[#0BD904]'
                    }`}
                  >
                    {t === 'pf' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                  </button>
                ))}
              </div>
            </div>

            {/* Nome + Telefone */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={LABEL_CLASS}>Nome *</label>
                <input
                  className={INPUT_CLASS}
                  placeholder={tipoPessoa === 'pj' ? 'Razão Social' : 'Nome completo'}
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                />
              </div>
              <div>
                <label className={LABEL_CLASS}>Telefone *</label>
                <input
                  className={INPUT_CLASS}
                  placeholder="(11) 99999-9999"
                  value={form.phone}
                  onChange={(e) => set('phone', e.target.value)}
                />
              </div>
            </div>

            {/* Email + CPF/CNPJ */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={LABEL_CLASS}>Email</label>
                <input
                  type="email"
                  className={INPUT_CLASS}
                  placeholder="email@exemplo.com"
                  value={form.email}
                  onChange={(e) => set('email', e.target.value)}
                />
              </div>
              <div>
                <label className={LABEL_CLASS}>{tipoPessoa === 'pj' ? 'CNPJ' : 'CPF'}</label>
                <input
                  className={INPUT_CLASS}
                  placeholder={tipoPessoa === 'pj' ? '00.000.000/0001-00' : '000.000.000-00'}
                  value={form.cpf_cnpj}
                  onChange={(e) => set('cpf_cnpj', e.target.value)}
                />
              </div>
            </div>

            {/* Data nascimento + CEP */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={LABEL_CLASS}>
                  {tipoPessoa === 'pj' ? 'Data de Abertura' : 'Data de Nascimento'}
                </label>
                <input
                  type="date"
                  className={INPUT_CLASS}
                  value={form.birth_date}
                  onChange={(e) => set('birth_date', e.target.value)}
                />
              </div>
              <div>
                <label className={LABEL_CLASS}>CEP</label>
                <input
                  className={INPUT_CLASS}
                  placeholder="00000-000"
                  value={form.cep}
                  onChange={(e) => set('cep', e.target.value)}
                />
              </div>
            </div>

            {/* Observações */}
            <div>
              <label className={LABEL_CLASS}>Observações</label>
              <textarea
                className="w-full rounded-[6px] border border-[#D1D1D1] bg-white px-3 py-2 text-[13px] placeholder:text-[#9CA3AF] outline-none focus:border-[#0BD904] transition-colors resize-none"
                rows={3}
                placeholder="Anotações sobre o cliente..."
                value={form.notes}
                onChange={(e) => set('notes', e.target.value)}
              />
            </div>

            {error && (
              <p className="text-[12px] text-red-500 bg-red-50 rounded-[6px] px-3 py-2">{error}</p>
            )}

            <div className="flex justify-end gap-2 pt-1">
              <Dialog.Close asChild>
                <Button type="button" variant="secondary" size="sm">
                  Cancelar
                </Button>
              </Dialog.Close>
              <Button type="submit" size="sm" disabled={loading}>
                {loading ? 'Salvando...' : isEditing ? 'Salvar Alterações' : 'Criar Cliente'}
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
