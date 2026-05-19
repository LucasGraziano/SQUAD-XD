'use client'

import { useRef, useState } from 'react'
import { FileUp, ExternalLink, Loader2, Pencil, Save, X } from 'lucide-react'
import { uploadPolicyDocument, updatePolicyMetadata } from '@/app/(dashboard)/apolices/actions'

const META_LABELS: Record<string, string> = {
  objeto_segurado:  'Objeto Segurado',
  placa:            'Placa do Veículo',
  coberturas:       'Coberturas',
  franquia:         'Franquia',
  sinistro_tel:     'Tel. Sinistro',
  sinistro_zap:     'WhatsApp Sinistro',
}

const META_ORDER = Object.keys(META_LABELS)

interface Props {
  policyId: string
  initialMetadata: Record<string, string>
  notes?: string | null
  defaultEditing?: boolean
  onMetadataChange?: (meta: Record<string, string>) => void
  onClose?: () => void
}

export function PolicyDetailsSection({ policyId, initialMetadata, notes, defaultEditing, onMetadataChange, onClose }: Props) {
  const [meta, setMeta] = useState<Record<string, string>>(initialMetadata ?? {})
  const [editing, setEditing] = useState(defaultEditing ?? false)
  const [draft, setDraft] = useState<Record<string, string>>({})
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const pdfUrl  = meta.pdf_url
  const pdfName = meta.pdf_name ?? 'Apólice.pdf'

  const visibleMeta = META_ORDER.filter(k => meta[k])
  const hasDetails = visibleMeta.length > 0 || notes || pdfUrl

  function startEdit() {
    const d: Record<string, string> = {}
    META_ORDER.forEach(k => { d[k] = meta[k] ?? '' })
    setDraft(d)
    setEditing(true)
  }

  async function saveEdit() {
    setSaving(true)
    const cleaned = Object.fromEntries(
      Object.entries({ ...meta, ...draft }).filter(([, v]) => v.trim())
    )
    const result = await updatePolicyMetadata(policyId, cleaned)
    setSaving(false)
    if (result.error) return
    setMeta(cleaned)
    onMetadataChange?.(cleaned)
    setEditing(false)
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    setUploading(true)
    setUploadError(null)

    const fd = new FormData()
    fd.append('file', file)
    const result = await uploadPolicyDocument(policyId, fd)

    setUploading(false)
    if (result.error) { setUploadError(result.error); return }
    if (result.url) {
      const updated = { ...meta, pdf_url: result.url!, pdf_name: file.name }
      setMeta(updated)
      onMetadataChange?.(updated)
    }
  }

  return (
    <div className="bg-white rounded-[8px] border border-[#E5E5E5] p-5 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-semibold text-[#0D0D0D]">Detalhes da Apólice</p>
        <div className="flex items-center gap-2">
          {!editing && (
            <button
              onClick={startEdit}
              className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-[5px] border border-[#D1D1D1] text-[11px] text-[#374151] hover:bg-[#F8F8F8] transition-colors"
            >
              <Pencil size={11} />
              Editar
            </button>
          )}
          <label className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-[5px] border border-[#D1D1D1] text-[11px] text-[#374151] hover:bg-[#F8F8F8] transition-colors cursor-pointer">
            {uploading ? <Loader2 size={11} className="animate-spin" /> : <FileUp size={11} />}
            {uploading ? 'Enviando...' : 'Anexar PDF'}
            <input ref={fileRef} type="file" accept=".pdf,image/*" className="hidden" onChange={handleFileChange} disabled={uploading} />
          </label>
        </div>
      </div>

      {uploadError && (
        <p className="text-[12px] text-[#DC2626] bg-[#FEF2F2] rounded-[6px] px-3 py-2">{uploadError}</p>
      )}

      {/* PDF link */}
      {pdfUrl && (
        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 h-9 px-3 rounded-[6px] bg-[rgba(11,217,4,0.06)] border border-[rgba(11,217,4,0.3)] text-[12px] font-medium text-[#034001] hover:bg-[rgba(11,217,4,0.12)] transition-colors"
        >
          <ExternalLink size={13} />
          {pdfName}
        </a>
      )}

      {/* Notes */}
      {notes && !editing && (
        <div>
          <p className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wide mb-1">Observações</p>
          <p className="text-[13px] text-[#6B7280] whitespace-pre-wrap">{notes}</p>
        </div>
      )}

      {!editing ? (
        <>
          {visibleMeta.length > 0 && (
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
              {visibleMeta.map(k => (
                <div key={k}>
                  <dt className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wide">{META_LABELS[k]}</dt>
                  <dd className="text-[13px] text-[#0D0D0D] mt-0.5 whitespace-pre-wrap">{meta[k]}</dd>
                </div>
              ))}
            </dl>
          )}

          {!hasDetails && (
            <p className="text-[13px] text-[#9CA3AF] py-2">
              Nenhum detalhe adicional. Clique em &ldquo;Editar&rdquo; para adicionar informações ou &ldquo;Anexar PDF&rdquo; para fazer upload da apólice.
            </p>
          )}
        </>
      ) : (
        <div className="space-y-3">
          {META_ORDER.map(k => (
            <div key={k}>
              <label className="block text-[11px] font-semibold text-[#6B7280] mb-1">{META_LABELS[k]}</label>
              {k === 'coberturas' ? (
                <textarea
                  rows={3}
                  value={draft[k] ?? ''}
                  onChange={e => setDraft(p => ({ ...p, [k]: e.target.value }))}
                  className="w-full rounded-[6px] border border-[#D1D1D1] px-3 py-2 text-[13px] outline-none focus:border-[#0BD904] resize-none"
                  placeholder="Ex: Colisão, Incêndio, Roubo, Terceiros..."
                />
              ) : (
                <input
                  type="text"
                  value={draft[k] ?? ''}
                  onChange={e => setDraft(p => ({ ...p, [k]: e.target.value }))}
                  className="h-9 w-full rounded-[6px] border border-[#D1D1D1] px-3 text-[13px] outline-none focus:border-[#0BD904]"
                />
              )}
            </div>
          ))}

          <div className="flex gap-2 pt-1">
            <button
              onClick={saveEdit}
              disabled={saving}
              className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[6px] bg-[#0BD904] text-[#034001] text-[12px] font-semibold hover:bg-[#09C003] disabled:opacity-50"
            >
              {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
            <button
              onClick={() => { setEditing(false); onClose?.() }}
              className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[6px] border border-[#D1D1D1] text-[12px] hover:bg-[#F8F8F8]"
            >
              <X size={12} />
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
