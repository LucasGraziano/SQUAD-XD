'use client'

import { useState, useEffect } from 'react'
import { Copy, Check, RefreshCw, X, ExternalLink } from 'lucide-react'
import { generateClientToken, revokeClientToken, getClientToken } from '@/app/actions/portal'

interface Props {
  clientId: string
  plan: string
}

type TokenData = { id: string; token: string; expires_at: string | null } | null

export function ClientPortalSection({ clientId, plan }: Props) {
  const [tokenData, setTokenData] = useState<TokenData>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const portalUrl = tokenData
    ? `${window.location.origin}/portal/${tokenData.token}`
    : null

  useEffect(() => {
    getClientToken(clientId).then(t => {
      setTokenData(t)
      setLoading(false)
    })
  }, [clientId])

  async function handleGenerate() {
    setGenerating(true)
    setError(null)
    const { token, error: err } = await generateClientToken(clientId)
    setGenerating(false)
    if (err) { setError(err); return }
    if (token) setTokenData({ id: '', token, expires_at: null })
    // Re-fetch to get the full token record
    const updated = await getClientToken(clientId)
    setTokenData(updated)
  }

  async function handleRevoke() {
    if (!tokenData) return
    setGenerating(true)
    const { error: err } = await revokeClientToken(tokenData.id, clientId)
    setGenerating(false)
    if (err) { setError(err); return }
    setTokenData(null)
  }

  async function handleCopy() {
    if (!portalUrl) return
    await navigator.clipboard.writeText(portalUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleWhatsApp() {
    if (!portalUrl) return
    const text = encodeURIComponent(`Olá! Acesse seu portal de apólices aqui: ${portalUrl}`)
    window.open(`https://wa.me/?text=${text}`, '_blank')
  }

  if (plan === 'starter') {
    return (
      <div className="bg-white rounded-[8px] border border-[#E5E5E5] p-5">
        <p className="text-[13px] font-semibold text-[#0D0D0D] mb-2">Portal do Cliente</p>
        <p className="text-[12px] text-[#9CA3AF] mb-3">
          Gere um link personalizado para o cliente visualizar suas apólices. Disponível no plano Profissional.
        </p>
        <a
          href="/configuracoes?tab=plano"
          className="inline-flex items-center gap-1.5 text-[12px] text-[#0BD904] font-medium hover:underline"
        >
          Fazer upgrade →
        </a>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="bg-white rounded-[8px] border border-[#E5E5E5] p-5">
        <p className="text-[13px] font-semibold text-[#0D0D0D] mb-2">Portal do Cliente</p>
        <p className="text-[12px] text-[#9CA3AF]">Carregando...</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-[8px] border border-[#E5E5E5] p-5">
      <p className="text-[13px] font-semibold text-[#0D0D0D] mb-1">Portal do Cliente</p>
      <p className="text-[12px] text-[#9CA3AF] mb-4">
        Link exclusivo para o cliente visualizar suas apólices.
      </p>

      {tokenData ? (
        <div className="space-y-3">
          {/* URL display */}
          <div className="flex items-center gap-2 bg-[#F9FAFB] rounded-[6px] border border-[#E5E5E5] px-3 py-2">
            <span className="flex-1 text-[12px] font-mono text-[#6B7280] truncate">{portalUrl}</span>
            <a
              href={portalUrl!}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#9CA3AF] hover:text-[#0D0D0D] transition-colors shrink-0"
            >
              <ExternalLink size={12} />
            </a>
          </div>

          {tokenData.expires_at && (
            <p className="text-[11px] text-[#9CA3AF]">
              Expira em {new Intl.DateTimeFormat('pt-BR').format(new Date(tokenData.expires_at))}
            </p>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex-1 inline-flex items-center justify-center gap-1.5 h-8 rounded-[6px] border border-[#E5E5E5] text-[12px] font-medium text-[#6B7280] hover:border-[#0D0D0D] hover:text-[#0D0D0D] transition-colors"
            >
              {copied ? <Check size={12} className="text-[#0BD904]" /> : <Copy size={12} />}
              {copied ? 'Copiado!' : 'Copiar link'}
            </button>
            <button
              onClick={handleWhatsApp}
              className="flex-1 inline-flex items-center justify-center gap-1.5 h-8 rounded-[6px] bg-[#0BD904] text-[#0D0D0D] text-[12px] font-semibold hover:bg-[#09c203] transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp
            </button>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="flex items-center gap-1 text-[11px] text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
            >
              <RefreshCw size={10} />
              Gerar novo link
            </button>
            <span className="text-[#E5E5E5]">·</span>
            <button
              onClick={handleRevoke}
              disabled={generating}
              className="flex items-center gap-1 text-[11px] text-[#EF4444] hover:text-[#DC2626] transition-colors"
            >
              <X size={10} />
              Revogar acesso
            </button>
          </div>
        </div>
      ) : (
        <div>
          <p className="text-[12px] text-[#9CA3AF] mb-3">Nenhum link ativo.</p>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="inline-flex items-center gap-1.5 h-9 px-4 rounded-[6px] bg-[#0D0D0D] text-white text-[13px] font-medium hover:bg-[#1A1A1A] transition-colors disabled:opacity-50"
          >
            {generating ? 'Gerando...' : 'Gerar link do portal'}
          </button>
        </div>
      )}

      {error && <p className="mt-2 text-[12px] text-[#EF4444]">{error}</p>}
    </div>
  )
}
