'use client'

import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { createLead } from '@/app/(dashboard)/pipeline/actions'
import type { Lead } from '@/types/lead'

const schema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100, 'Máximo 100 caracteres'),
  phone: z.string().min(1, 'Telefone é obrigatório'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  ramo: z.enum(['auto', 'vida', 'saude', 'residencial', 'empresarial', 'viagem', 'consorcio']).optional(),
  source: z.enum(['instagram', 'indicacao', 'site', 'manual']).optional(),
  notes: z.string().max(500, 'Máximo 500 caracteres').optional(),
})

type FormData = z.infer<typeof schema>

function formatPhone(v: string) {
  const n = v.replace(/\D/g, '').slice(0, 11)
  if (n.length <= 2) return n.length ? `(${n}` : ''
  if (n.length <= 7) return `(${n.slice(0, 2)}) ${n.slice(2)}`
  return `(${n.slice(0, 2)}) ${n.slice(2, 7)}-${n.slice(7)}`
}

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated: (lead: Lead) => void
}

export function NewLeadModal({ open, onOpenChange, onCreated }: Props) {
  const [serverError, setServerError] = useState<string | null>(null)

  const { register, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const phoneValue = watch('phone') ?? ''

  async function onSubmit(data: FormData) {
    setServerError(null)
    const result = await createLead({
      name: data.name,
      phone: data.phone,
      email: data.email || undefined,
      ramo: data.ramo,
      source: data.source || 'manual',
      notes: data.notes || undefined,
    })

    if (result.error) {
      setServerError(result.error)
      return
    }

    onCreated(result.data as Lead)
    reset()
    onOpenChange(false)
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-[480px] translate-x-[-50%] translate-y-[-50%] bg-white rounded-[12px] border border-[#E5E5E5] shadow-xl p-6 focus:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=open]:slide-in-from-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-top-[48%]">

          <div className="flex items-center justify-between mb-5">
            <Dialog.Title className="text-[18px] font-semibold text-[#0D0D0D]">
              Novo Lead
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="p-1.5 rounded-[6px] text-[#6B7280] hover:bg-[#F4F4F4] transition-colors">
                <X size={16} />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Nome"
              placeholder="Nome completo do lead"
              required
              {...register('name')}
              error={errors.name?.message}
            />

            <Input
              label="Telefone"
              placeholder="(11) 99999-9999"
              required
              value={phoneValue}
              onChange={(e) => setValue('phone', formatPhone(e.target.value), { shouldValidate: true })}
              error={errors.phone?.message}
            />

            <Input
              label="Email"
              type="email"
              placeholder="email@exemplo.com (opcional)"
              {...register('email')}
              error={errors.email?.message}
            />

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-[#0D0D0D]">Ramo</label>
                <select
                  {...register('ramo')}
                  className="h-[42px] w-full rounded-[6px] border border-[#D1D1D1] bg-white px-3 text-[14px] text-[#0D0D0D] outline-none focus:border-[#0BD904] focus:shadow-[0_0_0_3px_rgba(11,217,4,0.12)] transition-colors"
                >
                  <option value="">Selecionar</option>
                  <option value="auto">Auto</option>
                  <option value="vida">Vida</option>
                  <option value="saude">Saúde</option>
                  <option value="residencial">Residencial</option>
                  <option value="empresarial">Empresarial</option>
                  <option value="viagem">Viagem</option>
                  <option value="consorcio">Consórcio</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-[#0D0D0D]">Fonte</label>
                <select
                  {...register('source')}
                  className="h-[42px] w-full rounded-[6px] border border-[#D1D1D1] bg-white px-3 text-[14px] text-[#0D0D0D] outline-none focus:border-[#0BD904] focus:shadow-[0_0_0_3px_rgba(11,217,4,0.12)] transition-colors"
                >
                  <option value="">Selecionar</option>
                  <option value="instagram">Instagram</option>
                  <option value="indicacao">Indicação</option>
                  <option value="site">Site</option>
                  <option value="manual">Manual</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-[#0D0D0D]">Observação inicial</label>
              <textarea
                {...register('notes')}
                placeholder="Detalhe ou próximo passo... (opcional)"
                rows={3}
                className="w-full rounded-[6px] border border-[#D1D1D1] bg-white px-3 py-2.5 text-[14px] text-[#0D0D0D] placeholder:text-[#9CA3AF] outline-none focus:border-[#0BD904] focus:shadow-[0_0_0_3px_rgba(11,217,4,0.12)] transition-colors resize-none"
              />
              {errors.notes && <span className="text-[12px] text-[#DC2626]">{errors.notes.message}</span>}
            </div>

            {serverError && (
              <p className="text-[13px] text-[#DC2626] bg-[#FEF2F2] border border-[#FECACA] rounded-[6px] px-3 py-2">
                {serverError}
              </p>
            )}

            <div className="flex justify-end gap-2 pt-1">
              <Dialog.Close asChild>
                <Button type="button" variant="secondary" size="sm">Cancelar</Button>
              </Dialog.Close>
              <Button type="submit" size="sm" loading={isSubmitting}>
                Adicionar Lead
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
