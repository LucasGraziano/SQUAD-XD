'use client'

import { useEffect, useState } from 'react'
import { Cake, MessageCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { buildBirthdayWhatsAppMessage } from '@/lib/clients/birthday-crosssell'

type BirthdayAlert = {
  id: string
  title: string
  description: string | null
  metadata: { suggestion?: string; age?: string; whatsapp_phone?: string } | null
  clients: { id: string; name: string; phone: string | null } | null
}

export function BirthdayNotificationCard() {
  const [alerts, setAlerts] = useState<BirthdayAlert[]>([])

  useEffect(() => {
    const supabase = createClient()
    const today = new Date().toISOString().split('T')[0]

    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return
      const brokerResult = await supabase
        .from('brokers')
        .select('id')
        .eq('user_id', user.id)
        .single()
      const broker = brokerResult.data as { id: string } | null
      if (!broker) return

      const { data } = await (supabase as any)
        .from('alerts')
        .select('id, title, description, metadata, clients(id, name, phone)')
        .eq('broker_id', broker.id)
        .eq('type', 'birthday')
        .eq('status', 'pending')
        .eq('scheduled_for', today)
        .limit(5)

      setAlerts(data ?? [])
    })
  }, [])

  if (alerts.length === 0) return null

  return (
    <div className="bg-white rounded-[8px] border border-[#E5E5E5] p-5">
      <div className="flex items-center gap-2 mb-4">
        <Cake size={14} className="text-[#D97706]" />
        <p className="text-[14px] font-semibold text-[#0D0D0D]">Aniversários Hoje</p>
        <span className="ml-auto px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#D97706] text-[11px] font-bold">
          {alerts.length}
        </span>
      </div>

      <div className="space-y-2">
        {alerts.map((alert) => {
          const client = alert.clients
          const meta = alert.metadata
          const suggestion = meta?.suggestion ?? 'uma proposta personalizada'
          const phone = meta?.whatsapp_phone ?? client?.phone ?? ''
          const waMsg = client ? buildBirthdayWhatsAppMessage(client.name, suggestion) : ''
          const waLink = phone
            ? `https://wa.me/55${phone.replace(/\D/g, '')}?text=${encodeURIComponent(waMsg)}`
            : null

          return (
            <div key={alert.id} className="flex items-center gap-3 p-3 rounded-[6px] bg-[#FFFBEB] border border-[#FDE68A]">
              <Cake size={18} className="text-[#D97706] flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-[#0D0D0D]">{client?.name ?? alert.title}</p>
                <p className="text-[11px] text-[#6B7280] mt-0.5">
                  {meta?.age ? `${meta.age} anos` : ''} · Oferecer: {suggestion}
                </p>
              </div>
              {waLink && (
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 h-7 px-2.5 rounded-[5px] bg-[#25D366] text-white text-[11px] font-medium hover:bg-[#1da851] transition-colors flex-shrink-0"
                >
                  <MessageCircle size={11} />
                  Parabéns
                </a>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
