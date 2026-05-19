'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MessageCircle, Pencil, Phone, FileText, ExternalLink, FileUp, Loader2, Archive, ArchiveRestore } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { PendencyList } from '@/components/pendencies/PendencyList'
import { ApolicaModal } from '@/components/apolices/ApolicaModal'
import { DealOriginSection } from '@/components/apolices/DealOriginSection'
import { PolicyDetailsSection } from '@/components/apolices/PolicyDetailsSection'
import { uploadPolicyDocument, archivePolicy, unarchivePolicy } from '@/app/(dashboard)/apolices/actions'
import { getPendencies } from '@/app/actions/pendencies'
import type { Pendency } from '@/app/actions/pendencies'
import type { Policy } from '@/types/policy'
import { RAMO_LABELS, PAYMENT_LABELS, type PaymentFrequency } from '@/types/policy'

function formatDate(s: string) {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(s + 'T12:00:00'))
}
function formatBRL(n: number) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}
function daysTo(s: string) {
  return Math.ceil((new Date(s).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
}
function parseCoverages(raw: string): string[] {
  return raw.split(/[\n,]+/).map(s => s.trim()).filter(Boolean)
}

type PolicyWithClient = Policy & {
  clients?: { name: string; phone?: string | null; id?: string } | null
}

export default function ApoliceDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [policy, setPolicy] = useState<PolicyWithClient | null>(null)
  const [pendencies, setPendencies] = useState<Pendency[]>([])
  const [loading, setLoading] = useState(true)
  const [editOpen, setEditOpen] = useState(false)
  const [editDetailsOpen, setEditDetailsOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [archiving, setArchiving] = useState(false)
  const [confirmArchive, setConfirmArchive] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const supabase = createClient()
    Promise.all([
      supabase.from('policies').select('*, clients(id, name, phone)').eq('id', id).maybeSingle(),
      getPendencies({ policyId: id }),
    ]).then(([{ data: p }, pends]) => {
      setPolicy(p as PolicyWithClient | null)
      setPendencies(pends)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [id])

  async function handleArchiveToggle() {
    setArchiving(true)
    const isArchived = policy!.status === 'cancelada' || policy!.status === 'suspensa'
    if (isArchived) {
      await unarchivePolicy(id)
      setPolicy(prev => prev ? { ...prev, status: 'ativa' } : prev)
    } else {
      await archivePolicy(id)
      router.push('/apolices')
    }
    setArchiving(false)
    setConfirmArchive(false)
  }

  async function handlePdfUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    setUploading(true)
    setUploadError(null)
    const fd = new FormData()
    fd.append('file', file)
    const result = await uploadPolicyDocument(id, fd)
    setUploading(false)
    if (result.error) { setUploadError(result.error); return }
    if (result.url) {
      setPolicy(prev => prev ? {
        ...prev,
        metadata: { ...((prev.metadata as Record<string, string>) ?? {}), pdf_url: result.url!, pdf_name: file.name }
      } : prev)
    }
  }

  if (loading) {
    return <div className="flex-1 flex items-center justify-center"><p className="text-[13px] text-[#9CA3AF]">Carregando...</p></div>
  }
  if (!policy) {
    return <div className="flex-1 flex items-center justify-center"><p className="text-[13px] text-[#9CA3AF]">Apólice não encontrada.</p></div>
  }

  const days = daysTo(policy.end_date)
  const comm = policy.commission_expected ?? policy.premium_total * (policy.commission_pct / 100)
  const meta = (policy.metadata as Record<string, string>) ?? {}

  const coverageTags = meta.coberturas ? parseCoverages(meta.coberturas) : []
  const hasSinistro  = !!(meta.sinistro_tel || meta.sinistro_zap)
  const pdfUrl       = meta.pdf_url
  const pdfName      = meta.pdf_name ?? 'Apólice.pdf'

  return (
    <>
      {/* ── Sticky header ─────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-10 bg-[#F8F8F8] border-b border-[#E5E5E5] px-8 py-4">
        <Link href="/apolices" className="inline-flex items-center gap-1.5 text-[13px] text-[#6B7280] hover:text-[#0D0D0D] mb-3 transition-colors">
          <ArrowLeft size={13} />
          Voltar para Apólices
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-[4px] bg-[rgba(11,217,4,0.08)] text-[#034001] text-[11px] font-semibold uppercase">
                {RAMO_LABELS[policy.ramo] ?? policy.ramo}
              </span>
              <span className="text-[14px] font-semibold text-[#0D0D0D]">{policy.seguradora}</span>
              {policy.policy_number && (
                <span className="text-[13px] text-[#9CA3AF]">· #{policy.policy_number}</span>
              )}
            </div>
            {policy.clients && (
              <div className="flex items-center gap-3 text-[13px] text-[#6B7280]">
                {policy.clients.id ? (
                  <Link href={`/clientes/${policy.clients.id}`} className="hover:text-[#0BD904] transition-colors">
                    {policy.clients.name}
                  </Link>
                ) : (
                  <span>{policy.clients.name}</span>
                )}
                {policy.clients.phone && (
                  <a
                    href={`https://wa.me/55${policy.clients.phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:text-[#0BD904] transition-colors"
                  >
                    <MessageCircle size={12} />
                    WhatsApp
                  </a>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {policy.status !== 'cancelada' && policy.status !== 'suspensa' && (
              <div className={`px-3 py-1 rounded-[6px] text-[12px] font-bold ${
                days < 0 ? 'bg-[#FEE2E2] text-[#DC2626]' :
                days <= 30 ? 'bg-[#FEF3C7] text-[#D97706]' :
                'bg-[#DCFCE7] text-[#16A34A]'
              }`}>
                {days < 0 ? 'Vencida' : days <= 30 ? `Vence em ${days}d` : 'Ativa'}
              </div>
            )}
            {(policy.status === 'cancelada' || policy.status === 'suspensa') && (
              <span className="px-3 py-1 rounded-[6px] text-[12px] font-bold bg-[#F3F4F6] text-[#6B7280]">Arquivada</span>
            )}
            {confirmArchive ? (
              <div className="flex items-center gap-1.5">
                <span className="text-[12px] text-[#6B7280]">
                  {policy.status === 'cancelada' || policy.status === 'suspensa' ? 'Desarquivar?' : 'Arquivar?'}
                </span>
                <button
                  onClick={handleArchiveToggle}
                  disabled={archiving}
                  className="h-8 px-3 rounded-[6px] bg-[#374151] text-white text-[12px] font-semibold hover:bg-[#1F2937] disabled:opacity-50 transition-colors"
                >
                  {archiving ? <Loader2 size={12} className="animate-spin" /> : 'Confirmar'}
                </button>
                <button
                  onClick={() => setConfirmArchive(false)}
                  className="h-8 px-3 rounded-[6px] border border-[#D1D1D1] text-[12px] text-[#6B7280] hover:bg-[#F8F8F8] transition-colors"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <Button variant="secondary" size="sm" onClick={() => setConfirmArchive(true)}>
                {policy.status === 'cancelada' || policy.status === 'suspensa'
                  ? <><ArchiveRestore size={14} />Desarquivar</>
                  : <><Archive size={14} />Arquivar</>
                }
              </Button>
            )}
            <Button variant="secondary" size="sm" onClick={() => setEditOpen(true)}>
              <Pencil size={14} />
              Editar
            </Button>
          </div>
        </div>
      </div>

      {/* ── Body ──────────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1100px] mx-auto px-8 py-6 grid grid-cols-3 gap-6 items-start">

          {/* ── Coluna principal (2/3) ─────────────────────────────────────── */}
          <div className="col-span-2 space-y-5">

            {/* Dados da apólice — at a glance */}
            <div className="bg-white rounded-[10px] border border-[#E5E5E5] p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[13px] font-semibold text-[#0D0D0D]">Dados da Apólice</p>
                <button
                  onClick={() => setEditDetailsOpen(true)}
                  className="inline-flex items-center gap-1 text-[11px] text-[#9CA3AF] hover:text-[#374151] transition-colors"
                >
                  <Pencil size={11} />
                  Editar campos extras
                </button>
              </div>

              <dl className="grid grid-cols-2 gap-x-8 gap-y-4">
                {/* Número da apólice */}
                <div>
                  <dt className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-0.5">Nº Apólice</dt>
                  <dd className="text-[14px] font-semibold text-[#0D0D0D]">
                    {policy.policy_number ? `#${policy.policy_number}` : <span className="text-[#9CA3AF] font-normal text-[13px]">Não informado</span>}
                  </dd>
                </div>

                {/* Seguradora */}
                <div>
                  <dt className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-0.5">Seguradora</dt>
                  <dd className="text-[14px] font-semibold text-[#0D0D0D]">{policy.seguradora}</dd>
                </div>

                {/* Vigência */}
                <div>
                  <dt className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-0.5">Vigência</dt>
                  <dd className="text-[13px] text-[#0D0D0D]">
                    {formatDate(policy.start_date)} → {formatDate(policy.end_date)}
                    <span className={`ml-2 text-[11px] font-medium ${days < 0 ? 'text-[#DC2626]' : days <= 30 ? 'text-[#D97706]' : 'text-[#16A34A]'}`}>
                      {days < 0 ? `(venceu há ${Math.abs(days)}d)` : `(${days}d restantes)`}
                    </span>
                  </dd>
                </div>

                {/* Prêmio */}
                <div>
                  <dt className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-0.5">Prêmio</dt>
                  <dd className="text-[14px] font-semibold text-[#0D0D0D]">
                    {formatBRL(policy.premium_total)}
                    <span className="text-[12px] text-[#9CA3AF] font-normal ml-1">
                      {PAYMENT_LABELS[policy.payment_frequency as PaymentFrequency] ?? policy.payment_frequency}
                    </span>
                  </dd>
                </div>

                {/* Objeto segurado */}
                {meta.objeto_segurado && (
                  <div>
                    <dt className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-0.5">Objeto Segurado</dt>
                    <dd className="text-[13px] text-[#0D0D0D]">{meta.objeto_segurado}</dd>
                  </div>
                )}

                {/* Placa */}
                {meta.placa && (
                  <div>
                    <dt className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-0.5">Placa</dt>
                    <dd className="text-[13px] font-mono font-semibold text-[#0D0D0D] uppercase">{meta.placa}</dd>
                  </div>
                )}

                {/* Franquia */}
                {(meta.franquia || (policy.franquia && policy.franquia > 0)) && (
                  <div>
                    <dt className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-0.5">Franquia</dt>
                    <dd className="text-[13px] text-[#0D0D0D]">
                      {meta.franquia || (policy.franquia ? formatBRL(policy.franquia) : '—')}
                    </dd>
                  </div>
                )}

                {/* Comissão */}
                <div>
                  <dt className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-0.5">Comissão</dt>
                  <dd className="text-[13px] text-[#0D0D0D]">
                    {formatBRL(comm)}
                    <span className="text-[11px] text-[#9CA3AF] ml-1">({policy.commission_pct}%)</span>
                  </dd>
                </div>
              </dl>
            </div>

            {/* Coberturas — destaque verde */}
            {coverageTags.length > 0 && (
              <div className="bg-white rounded-[10px] border border-[#E5E5E5] p-5">
                <p className="text-[13px] font-semibold text-[#0D0D0D] mb-3">Coberturas Incluídas</p>
                <div className="flex flex-wrap gap-2">
                  {coverageTags.map((c) => (
                    <span
                      key={c}
                      className="text-[12px] px-3 py-1 rounded-[20px] bg-[rgba(11,217,4,0.1)] text-[#034001] font-medium border border-[rgba(11,217,4,0.3)]"
                    >
                      ✓ {c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Sinistro */}
            {hasSinistro && (
              <div className="bg-white rounded-[10px] border border-[#E5E5E5] p-5">
                <p className="text-[13px] font-semibold text-[#0D0D0D] mb-3">Contatos para Sinistro</p>
                <div className="flex flex-wrap gap-4">
                  {meta.sinistro_tel && (
                    <a
                      href={`tel:${meta.sinistro_tel.replace(/\D/g, '')}`}
                      className="inline-flex items-center gap-2 text-[13px] text-[#374151] hover:text-[#0D0D0D] transition-colors"
                    >
                      <Phone size={14} className="text-[#6B7280]" />
                      {meta.sinistro_tel}
                    </a>
                  )}
                  {meta.sinistro_zap && (
                    <a
                      href={`https://wa.me/55${meta.sinistro_zap.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-[13px] text-[#25D366] hover:opacity-80 transition-opacity"
                    >
                      <MessageCircle size={14} />
                      {meta.sinistro_zap}
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Observações */}
            {policy.notes && (
              <div className="bg-[#FAFAFA] rounded-[10px] border border-[#E5E5E5] p-5">
                <p className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-2">Observações</p>
                <p className="text-[13px] text-[#374151] whitespace-pre-wrap leading-relaxed">{policy.notes}</p>
              </div>
            )}

            {/* Campos extras (edit mode) */}
            {editDetailsOpen && (
              <PolicyDetailsSection
                policyId={id}
                initialMetadata={meta}
                notes={policy.notes}
                defaultEditing
                onMetadataChange={(updated) => {
                  setPolicy((prev) => prev ? { ...prev, metadata: updated } : prev)
                  setEditDetailsOpen(false)
                }}
                onClose={() => setEditDetailsOpen(false)}
              />
            )}

            {/* Pendências */}
            <PendencyList
              initialPendencies={pendencies}
              policyId={id}
            />
          </div>

          {/* ── Sidebar (1/3) ──────────────────────────────────────────────── */}
          <div className="space-y-4">

            {/* PDF da apólice */}
            <div className="bg-white rounded-[10px] border border-[#E5E5E5] p-4">
              <p className="text-[12px] font-semibold text-[#374151] mb-3">Documento da Apólice</p>
              {pdfUrl ? (
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 h-9 px-3 w-full rounded-[6px] bg-[rgba(11,217,4,0.06)] border border-[rgba(11,217,4,0.3)] text-[12px] font-medium text-[#034001] hover:bg-[rgba(11,217,4,0.12)] transition-colors"
                >
                  <FileText size={13} />
                  <span className="truncate flex-1">{pdfName}</span>
                  <ExternalLink size={11} className="shrink-0" />
                </a>
              ) : (
                <p className="text-[12px] text-[#9CA3AF]">Nenhum documento anexado.</p>
              )}
              {uploadError && (
                <p className="mt-1.5 text-[11px] text-[#DC2626]">{uploadError}</p>
              )}
              <label className={`mt-2 inline-flex items-center gap-1.5 text-[11px] transition-colors cursor-pointer ${uploading ? 'text-[#9CA3AF] pointer-events-none' : 'text-[#6B7280] hover:text-[#0D0D0D]'}`}>
                {uploading ? <Loader2 size={11} className="animate-spin" /> : <FileUp size={11} />}
                {uploading ? 'Enviando...' : pdfUrl ? 'Substituir PDF' : 'Anexar PDF'}
                <input
                  ref={fileRef}
                  type="file"
                  accept=".pdf,image/*"
                  className="hidden"
                  onChange={handlePdfUpload}
                  disabled={uploading}
                />
              </label>
            </div>

            {/* Negociação de Origem */}
            <DealOriginSection policyId={id} />

          </div>
        </div>
      </div>

      {/* Modais */}
      <ApolicaModal
        open={editOpen}
        onOpenChange={setEditOpen}
        editingPolicy={policy}
        onCreated={() => {}}
        onUpdated={(updated) => setPolicy((prev) => prev ? { ...prev, ...updated } : prev)}
      />
    </>
  )
}
