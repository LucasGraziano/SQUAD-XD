'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Trophy, X } from 'lucide-react'
import { markFirstWinSeen } from '@/app/actions/broker'

interface Props {
  visible: boolean
}

export function FirstWinBanner({ visible }: Props) {
  const [dismissed, setDismissed] = useState(false)
  const [, startTransition] = useTransition()

  if (!visible || dismissed) return null

  function handleDismiss() {
    setDismissed(true)
    startTransition(() => { markFirstWinSeen() })
  }

  return (
    <div className="mx-8 mt-6 rounded-[10px] bg-gradient-to-r from-[rgba(11,217,4,0.12)] to-[rgba(11,217,4,0.06)] border border-[rgba(11,217,4,0.35)] px-5 py-4 flex items-center gap-4">
      <div className="w-10 h-10 rounded-full bg-[rgba(11,217,4,0.15)] flex items-center justify-center flex-shrink-0">
        <Trophy size={20} className="text-[#034001]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-bold text-[#0D0D0D]">Seu primeiro alerta foi disparado!</p>
        <p className="text-[12px] text-[#6B7280] mt-0.5">
          O sistema está trabalhando por você 24h. Seus clientes estão sendo monitorados automaticamente.
        </p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <Link
          href="/alertas"
          onClick={handleDismiss}
          className="h-8 px-4 rounded-[6px] bg-[#0BD904] text-[#0D0D0D] text-[12px] font-semibold hover:bg-[#09C803] transition-colors flex items-center"
        >
          Ver alertas
        </Link>
        <button
          onClick={handleDismiss}
          className="p-1 rounded-[5px] text-[#9CA3AF] hover:text-[#0D0D0D] transition-colors"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  )
}
