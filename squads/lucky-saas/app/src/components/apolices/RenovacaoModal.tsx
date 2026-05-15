'use client'

import { useState, useEffect } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Policy } from '@/types/policy'
import { RAMO_LABELS } from '@/types/policy'

function daysUntil(dateStr: string) {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
}

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(dateStr))
}

interface Props {
  policy: Policy | null
  brokerName: string
  onClose: () => void
}

export function RenovacaoModal({ policy, brokerName, onClose }: Props) {
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!policy?.clients) return
    const days = daysUntil(policy.end_date)
    const ramo = RAMO_LABELS[policy.ramo] ?? policy.ramo
    setMessage(
      `Oi ${policy.clients.name}! Tudo bem? Seu seguro ${ramo} está vencendo em ${days} dias (${formatDate(policy.end_date)}). Posso te ajudar a renovar? Abraços, ${brokerName}`
    )
  }, [policy, brokerName])

  function openWhatsApp() {
    if (!policy?.clients?.phone) return
    const phone = policy.clients.phone.replace(/\D/g, '')
    window.open(`https://wa.me/55${phone}?text=${encodeURIComponent(message)}`, '_blank')
    onClose()
  }

  return (
    <Dialog.Root open={!!policy} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-[480px] translate-x-[-50%] translate-y-[-50%] bg-white rounded-[12px] border border-[#E5E5E5] shadow-xl p-6 focus:outline-none">
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="text-[17px] font-semibold text-[#0D0D0D]">
              Mensagem de Renovação
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="p-1.5 rounded-[6px] text-[#6B7280] hover:bg-[#F4F4F4] transition-colors">
                <X size={16} />
              </button>
            </Dialog.Close>
          </div>

          {policy && (
            <>
              <div className="mb-3 p-3 rounded-[6px] bg-[#F8F8F8] border border-[#E5E5E5]">
                <p className="text-[12px] text-[#6B7280]">
                  {policy.clients?.name} · {RAMO_LABELS[policy.ramo]} · vence em {daysUntil(policy.end_date)} dias
                </p>
              </div>

              <label className="text-[13px] font-medium text-[#0D0D0D] mb-2 block">
                Mensagem (editável)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                className="w-full rounded-[6px] border border-[#D1D1D1] bg-white px-3 py-2.5 text-[14px] text-[#0D0D0D] outline-none focus:border-[#0BD904] focus:shadow-[0_0_0_3px_rgba(11,217,4,0.12)] transition-colors resize-none"
              />

              <div className="flex justify-end gap-2 mt-4">
                <Dialog.Close asChild>
                  <Button variant="secondary" size="sm">Cancelar</Button>
                </Dialog.Close>
                <Button size="sm" onClick={openWhatsApp} className="gap-2">
                  <MessageCircle size={14} />
                  Abrir WhatsApp
                </Button>
              </div>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
