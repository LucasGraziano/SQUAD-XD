'use client'

import { useState } from 'react'
import { FileText, Link2, Copy, Trash2, Check, Search, ExternalLink, FileDown, FilePlus } from 'lucide-react'
import { generateClientToken, revokeClientToken } from '@/app/actions/portal'
import { RAMO_LABELS } from '@/types/policy'
import { cn } from '@/lib/utils/cn'
import type { DocPolicy, DocClient, DocToken, DocDeal } from '@/types/client'

const PLAN_GATE = (plan: string) => plan === 'starter'

function formatDate(s: string) {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(s + 'T00:00:00'))
}

function formatDatetime(s: string) {
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' }).format(new Date(s))
}

function formatBRL(n: number) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

interface Props {
  policies: DocPolicy[]
  clients: DocClient[]
  tokens: DocToken[]
  deals: DocDeal[]
  plan: string
}

type Tab = 'apolices' | 'cotacoes' | 'portais'

export function DocumentosClient({ policies, clients, tokens: initialTokens, deals, plan }: Props) {
  const [tab, setTab] = useState<Tab>('apolices')
  const [search, setSearch] = useState('')
  const [localTokens, setLocalTokens] = useState<DocToken[]>(initialTokens)
  const [loadingTokenId, setLoadingTokenId] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [confirmRevokeId, setConfirmRevokeId] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const isGated = PLAN_GATE(plan)
  const portalOrigin = typeof window !== 'undefined' ? window.location.origin : ''

  const tokenByClient = localTokens.reduce<Record<string, DocToken>>((acc, t) => {
    if (!acc[t.client_id]) acc[t.client_id] = t
    return acc
  }, {})

  // Apólices com PDF anexado
  const policiesWithPdf = policies.filter(p => (p.metadata as Record<string, string> | null)?.pdf_url)

  // Cotações com ao menos 1 item
  const dealsWithItems = deals.filter(d => d.quote_items && d.quote_items.length > 0)

  const filteredPolicies = policiesWithPdf.filter(p =>
    !search ||
    (p.clients?.name ?? '').toLowerCase().includes(search.toLowerCase()) ||
    (p.seguradora ?? '').toLowerCase().includes(search.toLowerCase())
  )

  const filteredDeals = dealsWithItems.filter(d =>
    !search ||
    (d.clients?.name ?? '').toLowerCase().includes(search.toLowerCase()) ||
    (RAMO_LABELS[d.ramo] ?? d.ramo).toLowerCase().includes(search.toLowerCase())
  )

  const filteredClients = clients.filter(c =>
    !search ||
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.phone ?? '').includes(search)
  )

  async function handleGenerateToken(clientId: string) {
    setLoadingTokenId(clientId)
    setActionError(null)
    const { token, error } = await generateClientToken(clientId)
    setLoadingTokenId(null)
    if (error || !token) {
      setActionError('Erro ao gerar link do portal. Tente novamente.')
      return
    }
    const newToken: DocToken = {
      id: crypto.randomUUID(),
      client_id: clientId,
      token,
      expires_at: null,
      created_at: new Date().toISOString(),
    }
    setLocalTokens(prev => [newToken, ...prev.filter(t => t.client_id !== clientId)])
  }

  async function handleRevokeToken(tokenId: string, clientId: string) {
    setLoadingTokenId(clientId)
    setConfirmRevokeId(null)
    setActionError(null)
    const result = await revokeClientToken(tokenId, clientId)
    setLoadingTokenId(null)
    if (result?.error) {
      setActionError('Erro ao revogar acesso. Tente novamente.')
      return
    }
    setLocalTokens(prev => prev.filter(t => t.id !== tokenId))
  }

  function copyToClipboard(token: string, id: string) {
    navigator.clipboard.writeText(`${portalOrigin}/portal/${token}`)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const tabDefs: { id: Tab; label: string }[] = [
    { id: 'apolices',  label: `Apólices (${policiesWithPdf.length})` },
    { id: 'cotacoes',  label: `Cotações (${dealsWithItems.length})` },
    { id: 'portais',   label: `Portais (${localTokens.length} de ${clients.length})` },
  ]

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {actionError && (
        <div className="mx-8 mt-4 px-4 py-2 rounded-[6px] bg-[#FEF2F2] border border-[#FECACA] text-[12px] text-[#DC2626]">
          {actionError}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-0 border-b border-[#E5E5E5] px-8">
        {tabDefs.map(t => (
          <button
            key={t.id}
            onClick={() => { setTab(t.id); setSearch('') }}
            className={cn(
              'px-4 py-3 text-[13px] font-medium border-b-2 transition-colors',
              tab === t.id
                ? 'border-[#0BD904] text-[#0D0D0D]'
                : 'border-transparent text-[#6B7280] hover:text-[#0D0D0D]'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="px-8 py-4 border-b border-[#F3F4F6]">
        <div className="relative max-w-[300px]">
          <Search size={14} className="absolute left-3 top-[50%] -translate-y-[50%] text-[#9CA3AF]" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={
              tab === 'apolices' ? 'Buscar por cliente ou seguradora...' :
              tab === 'cotacoes' ? 'Buscar por cliente ou ramo...' :
              'Buscar cliente...'
            }
            className="h-9 w-full rounded-[6px] border border-[#D1D1D1] bg-white pl-8 pr-3 text-[13px] placeholder:text-[#9CA3AF] outline-none focus:border-[#0BD904] transition-colors"
          />
        </div>
      </div>

      {/* Upgrade wall */}
      {isGated && (
        <div className="mx-8 mt-6 rounded-[8px] border border-[#E5E5E5] bg-white p-8 text-center">
          <FileText size={32} className="mx-auto text-[#D1D1D1] mb-3" strokeWidth={1.5} />
          <p className="text-[15px] font-semibold text-[#0D0D0D] mb-1">Disponível no plano Profissional</p>
          <p className="text-[13px] text-[#6B7280] mb-4">Acesse documentos de apólices, cotações e portais de clientes.</p>
          <a
            href="mailto:contato@premia.app?subject=Upgrade Premia"
            className="inline-flex items-center justify-center h-9 px-5 rounded-[6px] bg-[#0BD904] text-[#0D0D0D] text-[13px] font-bold hover:bg-[#09c203] transition-colors"
          >
            Fazer upgrade →
          </a>
        </div>
      )}

      {/* ── Tab: Apólices ─────────────────────────────────────────────────── */}
      {!isGated && tab === 'apolices' && (
        <div className="flex-1 overflow-auto">
          {filteredPolicies.length === 0 ? (
            <div className="py-16 text-center">
              <FilePlus size={36} className="mx-auto text-[#D1D1D1] mb-3" strokeWidth={1.5} />
              <p className="text-[14px] font-semibold text-[#0D0D0D]">
                {search ? `Nenhum resultado para "${search}"` : 'Nenhum documento anexado'}
              </p>
              <p className="text-[13px] text-[#6B7280] mt-1 max-w-[280px] mx-auto">
                {search
                  ? 'Tente outro termo.'
                  : 'Acesse uma apólice e faça upload do PDF para ele aparecer aqui.'}
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E5E5E5]">
                  {['Cliente', 'Ramo', 'Seguradora', 'Nº Apólice', 'Vigência', ''].map(h => (
                    <th key={h} className="px-6 py-3 text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredPolicies.map(p => {
                  const meta = (p.metadata ?? {}) as Record<string, string>
                  const pdfUrl = meta.pdf_url
                  const pdfName = meta.pdf_name ?? 'Apólice.pdf'
                  return (
                    <tr key={p.id} className="border-b border-[#F3F4F6] hover:bg-[#FAFAFA] transition-colors">
                      <td className="px-6 py-3 text-[13px] font-medium text-[#0D0D0D]">
                        {p.clients?.name ?? '—'}
                      </td>
                      <td className="px-6 py-3">
                        <span className="px-2 py-0.5 rounded-[4px] bg-[rgba(11,217,4,0.08)] text-[#034001] text-[11px] font-medium">
                          {RAMO_LABELS[p.ramo] ?? p.ramo}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-[13px] text-[#6B7280]">{p.seguradora}</td>
                      <td className="px-6 py-3 text-[13px] font-mono text-[#6B7280]">
                        {p.policy_number ? `#${p.policy_number}` : <span className="text-[#D1D1D1]">—</span>}
                      </td>
                      <td className="px-6 py-3 text-[13px] text-[#6B7280] whitespace-nowrap">
                        {formatDate(p.start_date)} → {formatDate(p.end_date)}
                      </td>
                      <td className="px-6 py-3">
                        <a
                          href={pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[6px] bg-[rgba(11,217,4,0.06)] border border-[rgba(11,217,4,0.3)] text-[12px] font-medium text-[#034001] hover:bg-[rgba(11,217,4,0.12)] transition-colors"
                          title={pdfName}
                        >
                          <FileText size={12} />
                          Abrir PDF
                          <ExternalLink size={10} className="ml-0.5 opacity-60" />
                        </a>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ── Tab: Cotações ─────────────────────────────────────────────────── */}
      {!isGated && tab === 'cotacoes' && (
        <div className="flex-1 overflow-auto">
          {filteredDeals.length === 0 ? (
            <div className="py-16 text-center">
              <FileDown size={36} className="mx-auto text-[#D1D1D1] mb-3" strokeWidth={1.5} />
              <p className="text-[14px] font-semibold text-[#0D0D0D]">
                {search ? `Nenhum resultado para "${search}"` : 'Nenhuma cotação encontrada'}
              </p>
              <p className="text-[13px] text-[#6B7280] mt-1 max-w-[280px] mx-auto">
                {search
                  ? 'Tente outro termo.'
                  : 'Crie cotações no Pipeline para comparar propostas e gerar PDFs.'}
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E5E5E5]">
                  {['Cliente', 'Ramo', 'Seguradoras', 'Data', ''].map(h => (
                    <th key={h} className="px-6 py-3 text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredDeals.map(d => {
                  const seguradoras = [...new Set(d.quote_items.map(i => i.seguradora))].join(', ')
                  return (
                    <tr key={d.id} className="border-b border-[#F3F4F6] hover:bg-[#FAFAFA] transition-colors">
                      <td className="px-6 py-3 text-[13px] font-medium text-[#0D0D0D]">
                        {d.clients?.name ?? '—'}
                      </td>
                      <td className="px-6 py-3">
                        <span className="px-2 py-0.5 rounded-[4px] bg-[rgba(11,217,4,0.08)] text-[#034001] text-[11px] font-medium">
                          {RAMO_LABELS[d.ramo] ?? d.ramo}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-[13px] text-[#6B7280] max-w-[200px] truncate" title={seguradoras}>
                        {seguradoras || '—'}
                      </td>
                      <td className="px-6 py-3 text-[13px] text-[#6B7280] whitespace-nowrap">
                        {formatDatetime(d.created_at)}
                      </td>
                      <td className="px-6 py-3">
                        <a
                          href={`/api/pdf/quote/${d.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[6px] bg-[#0BD904] text-[#034001] text-[12px] font-semibold hover:bg-[#09C003] transition-colors"
                        >
                          <FileDown size={12} />
                          Gerar PDF
                        </a>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ── Tab: Portais ──────────────────────────────────────────────────── */}
      {!isGated && tab === 'portais' && (
        <div className="flex-1 overflow-auto">
          {filteredClients.length === 0 ? (
            <div className="py-16 text-center">
              <Link2 size={36} className="mx-auto text-[#D1D1D1] mb-3" strokeWidth={1.5} />
              <p className="text-[14px] font-semibold text-[#0D0D0D]">
                {search ? `Nenhum resultado para "${search}"` : 'Nenhum cliente cadastrado'}
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E5E5E5]">
                  {['Cliente', 'Telefone', 'Portal', 'Link', ''].map(h => (
                    <th key={h} className="px-6 py-3 text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredClients.map(c => {
                  const tok = tokenByClient[c.id]
                  const isLoading = loadingTokenId === c.id
                  const isCopied = copiedId === tok?.id
                  return (
                    <tr key={c.id} className="border-b border-[#F3F4F6] hover:bg-[#FAFAFA] transition-colors">
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-[rgba(11,217,4,0.1)] flex items-center justify-center flex-shrink-0">
                            <span className="text-[11px] font-bold text-[#034001]">{c.name.charAt(0)}</span>
                          </div>
                          <span className="text-[13px] font-medium text-[#0D0D0D]">{c.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-[13px] text-[#6B7280]">{c.phone ?? '—'}</td>
                      <td className="px-6 py-3">
                        {tok ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] bg-[rgba(11,217,4,0.1)] text-[#034001] text-[11px] font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#0BD904]" />
                            Ativo
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] bg-[#F3F4F6] text-[#9CA3AF] text-[11px] font-medium">
                            Sem link
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-3">
                        {tok && (
                          <div className="flex items-center gap-1">
                            <code className="text-[11px] text-[#6B7280] font-mono truncate max-w-[160px]">
                              /portal/{tok.token.slice(0, 8)}…
                            </code>
                            <button
                              onClick={() => copyToClipboard(tok.token, tok.id)}
                              className="p-1 rounded-[4px] text-[#9CA3AF] hover:text-[#0D0D0D] hover:bg-[#F3F4F6] transition-colors"
                              title="Copiar link"
                            >
                              {isCopied ? <Check size={13} className="text-[#0BD904]" /> : <Copy size={13} />}
                            </button>
                            <a
                              href={`/portal/${tok.token}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 rounded-[4px] text-[#9CA3AF] hover:text-[#0D0D0D] hover:bg-[#F3F4F6] transition-colors"
                              title="Abrir portal"
                            >
                              <ExternalLink size={13} />
                            </a>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-1.5 justify-end">
                          {tok ? (
                            <>
                              <button
                                onClick={() => handleGenerateToken(c.id)}
                                disabled={isLoading}
                                className="px-2.5 py-1 rounded-[5px] text-[12px] text-[#6B7280] border border-[#D1D1D1] hover:border-[#9CA3AF] transition-colors disabled:opacity-50"
                              >
                                {isLoading ? '...' : 'Novo link'}
                              </button>
                              {confirmRevokeId === c.id ? (
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => handleRevokeToken(tok.id, c.id)}
                                    className="px-2.5 py-1 rounded-[5px] text-[12px] text-white bg-[#DC2626] hover:bg-[#B91C1C] transition-colors"
                                  >
                                    Confirmar
                                  </button>
                                  <button
                                    onClick={() => setConfirmRevokeId(null)}
                                    className="px-2.5 py-1 rounded-[5px] text-[12px] text-[#6B7280] border border-[#D1D1D1]"
                                  >
                                    Cancelar
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setConfirmRevokeId(c.id)}
                                  disabled={isLoading}
                                  className="p-1.5 rounded-[5px] text-[#9CA3AF] hover:text-[#DC2626] hover:bg-[#FEF2F2] transition-colors disabled:opacity-50"
                                  title="Revogar acesso"
                                >
                                  <Trash2 size={13} />
                                </button>
                              )}
                            </>
                          ) : (
                            <button
                              onClick={() => handleGenerateToken(c.id)}
                              disabled={isLoading}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] border border-[#D1D1D1] text-[12px] text-[#0D0D0D] font-medium hover:border-[#0BD904] hover:text-[#034001] transition-colors disabled:opacity-50"
                            >
                              <Link2 size={12} />
                              {isLoading ? 'Gerando...' : 'Gerar link'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
}
