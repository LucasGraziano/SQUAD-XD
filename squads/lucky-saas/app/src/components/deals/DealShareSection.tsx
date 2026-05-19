'use client'

import { useState } from 'react'
import { Copy, Check, MessageCircle, Eye, FileDown } from 'lucide-react'
import type { DealSummary } from '@/app/actions/deals'

function formatRelative(isoDate: string) {
  const mins = Math.floor((Date.now() - new Date(isoDate).getTime()) / 60000)
  if (mins < 1)  return 'agora'
  if (mins < 60) return `há ${mins}min`
  const h = Math.floor(mins / 60)
  if (h < 24)   return `há ${h}h`
  return `há ${Math.floor(h / 24)}d`
}

interface Props {
  deal: DealSummary
}

export function DealShareSection({ deal }: Props) {
  const [copied, setCopied] = useState(false)

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/q/${deal.share_token}`
    : `/q/${deal.share_token}`

  function copyLink() {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function openWhatsApp() {
    const msg = encodeURIComponent(
      `Olá! Preparei uma proposta para você. Acesse aqui: ${shareUrl}`
    )
    window.open(`https://wa.me/?text=${msg}`, '_blank')
  }

  return (
    <section className="bg-white rounded-[10px] border border-[#E5E5E5] p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[13px] font-semibold text-[#374151]">Compartilhar com Cliente</h3>
        <a
          href={`/api/pdf/quote/${deal.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[6px] bg-[#0BD904] text-[#034001] text-[12px] font-semibold hover:bg-[#09C003] transition-colors"
        >
          <FileDown size={13} />
          Gerar PDF Comparativo
        </a>
      </div>

      {/* Link */}
      <div className="flex items-center gap-2 mb-3">
        <input
          readOnly
          value={shareUrl}
          className="flex-1 h-9 rounded-[6px] border border-[#E5E5E5] bg-[#F8F8F8] px-3 text-[12px] text-[#6B7280] outline-none"
        />
        <button
          onClick={copyLink}
          className="h-9 px-3 rounded-[6px] border border-[#D1D1D1] text-[13px] text-[#374151] hover:bg-[#F8F8F8] transition-colors inline-flex items-center gap-1.5"
        >
          {copied ? <Check size={13} className="text-[#0BD904]" /> : <Copy size={13} />}
          {copied ? 'Copiado' : 'Copiar'}
        </button>
        <button
          onClick={openWhatsApp}
          className="h-9 px-3 rounded-[6px] bg-[#25D366] text-white text-[13px] hover:bg-[#20BB5A] transition-colors inline-flex items-center gap-1.5"
        >
          <MessageCircle size={13} />
          WhatsApp
        </button>
      </div>

      {/* View indicator */}
      <div className="flex items-center gap-2 text-[12px]">
        {deal.view_count > 0 ? (
          <>
            <Eye size={13} className="text-[#2563EB]" />
            <span className="text-[#2563EB]">
              Cliente visualizou {deal.view_count}× — última {deal.last_viewed_at ? formatRelative(deal.last_viewed_at) : ''}
            </span>
          </>
        ) : (
          <>
            <Eye size={13} className="text-[#9CA3AF]" />
            <span className="text-[#9CA3AF]">Cliente ainda não visualizou</span>
          </>
        )}

        {deal.stage === 'approved' && (
          <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] bg-[#D1FAE5] text-[#065F46] text-[11px] font-semibold">
            ✓ Aprovada pelo cliente
          </span>
        )}
      </div>
    </section>
  )
}
