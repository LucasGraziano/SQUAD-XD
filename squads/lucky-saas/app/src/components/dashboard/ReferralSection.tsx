'use client'

import { useState } from 'react'
import { Copy, Check, MessageCircle, Gift } from 'lucide-react'

interface ReferralSectionProps {
  referralLink: string
  total: number
  converted: number
  credits: number
}

export function ReferralSection({ referralLink, total, converted, credits }: ReferralSectionProps) {
  const [copied, setCopied] = useState(false)

  function copyLink() {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const whatsappText = encodeURIComponent(
    `Uso o Premia para gerenciar minha carteira de seguros. Experimente grátis por 21 dias: ${referralLink}`
  )

  return (
    <div className="bg-white rounded-[8px] border border-[#E5E5E5] p-5">
      <div className="flex items-center gap-2 mb-4">
        <Gift size={16} className="text-[#0BD904]" />
        <p className="text-[14px] font-semibold text-[#0D0D0D]">Indique e Ganhe</p>
      </div>

      <p className="text-[13px] text-[#6B7280] mb-4">
        Indique um colega corretor e ganhe <strong>1 mês grátis</strong> quando ele assinar. Seu indicado recebe 21 dias de trial (vs. 14 dias padrão).
      </p>

      {/* Link */}
      <div className="flex gap-2 mb-4">
        <div className="flex-1 h-9 px-3 rounded-[6px] border border-[#D1D1D1] bg-[#F9FAFB] flex items-center overflow-hidden">
          <span className="text-[12px] text-[#6B7280] truncate">{referralLink}</span>
        </div>
        <button
          onClick={copyLink}
          className="h-9 px-3 flex items-center gap-1.5 rounded-[6px] border border-[#D1D1D1] bg-white text-[#0D0D0D] text-[12px] font-semibold hover:bg-[#F4F4F4] transition-colors shrink-0"
        >
          {copied ? <Check size={13} className="text-[#0BD904]" /> : <Copy size={13} />}
          {copied ? 'Copiado!' : 'Copiar'}
        </button>
        <a
          href={`https://wa.me/?text=${whatsappText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="h-9 px-3 flex items-center gap-1.5 rounded-[6px] bg-[#25D366] text-white text-[12px] font-semibold hover:bg-[#1ebe5d] transition-colors shrink-0"
        >
          <MessageCircle size={13} />
          WhatsApp
        </a>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#F3F4F6]">
        <div className="text-center">
          <p className="text-[22px] font-bold text-[#0D0D0D]">{total}</p>
          <p className="text-[11px] text-[#9CA3AF] mt-0.5">Indicações</p>
        </div>
        <div className="text-center">
          <p className="text-[22px] font-bold text-[#0BD904]">{converted}</p>
          <p className="text-[11px] text-[#9CA3AF] mt-0.5">Convertidas</p>
        </div>
        <div className="text-center">
          <p className="text-[22px] font-bold text-[#6366F1]">{credits}</p>
          <p className="text-[11px] text-[#9CA3AF] mt-0.5">Meses ganhos</p>
        </div>
      </div>
    </div>
  )
}
