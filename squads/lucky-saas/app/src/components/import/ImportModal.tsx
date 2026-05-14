'use client'

import { useState, useRef, useCallback } from 'react'
import { X, Upload, FileSpreadsheet, Check, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PREMIA_FIELDS, autoMapColumns } from '@/lib/csv-importer/column-aliases'
import { importPolicies } from '@/app/actions/import-policies'
import type { ImportRow } from '@/lib/import/parse-csv'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImported: (count: number) => void
}

type Step = 'upload' | 'mapping' | 'confirm'

interface ParsedData {
  headers: string[]
  rows: Record<string, string>[]
  fileName: string
}

function parseDate(s: string): string | null {
  if (!s) return null
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s
  const parts = s.split('/')
  if (parts.length === 3) {
    const [d, m, y] = parts
    if (y.length === 4) return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`
  }
  return null
}

function applyMapping(rows: Record<string, string>[], mapping: Record<string, string>): { rows: ImportRow[]; errors: { line: number; message: string }[] } {
  const importRows: ImportRow[] = []
  const errors: { line: number; message: string }[] = []

  for (let i = 0; i < rows.length; i++) {
    const raw = rows[i]
    const mapped: Record<string, string> = {}
    for (const [col, field] of Object.entries(mapping)) {
      if (raw[col]) mapped[field] = raw[col]
    }

    const line = i + 2
    const required = ['cliente_nome', 'seguradora', 'ramo', 'inicio_vigencia', 'fim_vigencia', 'premio_total']
    const missing = required.filter(k => !mapped[k]?.trim())
    if (missing.length > 0) { errors.push({ line, message: `Campos obrigatórios ausentes: ${missing.join(', ')}` }); continue }

    const inicio = parseDate(mapped.inicio_vigencia?.trim())
    const fim = parseDate(mapped.fim_vigencia?.trim())
    if (!inicio) { errors.push({ line, message: 'Início de vigência inválido' }); continue }
    if (!fim) { errors.push({ line, message: 'Fim de vigência inválido' }); continue }

    const premio = parseFloat(mapped.premio_total?.replace(/\./g, '').replace(',', '.'))
    if (isNaN(premio) || premio <= 0) { errors.push({ line, message: 'Prêmio inválido' }); continue }

    importRows.push({
      cliente_nome: mapped.cliente_nome.trim(),
      seguradora: mapped.seguradora.trim(),
      ramo: mapped.ramo.trim().toLowerCase().replace(/\s+/g, '_'),
      inicio_vigencia: inicio,
      fim_vigencia: fim,
      premio_total: premio,
      numero_apolice: mapped.numero_apolice?.trim() || undefined,
      cpf_cliente: mapped.cpf_cliente?.trim() || undefined,
      telefone_cliente: mapped.telefone_cliente?.trim() || undefined,
      email_cliente: mapped.email_cliente?.trim() || undefined,
      comissao_pct: mapped.comissao_pct ? parseFloat(mapped.comissao_pct.replace(',', '.')) || undefined : undefined,
      notas: mapped.notas?.trim() || undefined,
    })
  }

  return { rows: importRows, errors }
}

export function ImportModal({ open, onOpenChange, onImported }: Props) {
  const [step, setStep] = useState<Step>('upload')
  const [parsed, setParsed] = useState<ParsedData | null>(null)
  const [mapping, setMapping] = useState<Record<string, string>>({})
  const [importRows, setImportRows] = useState<ImportRow[]>([])
  const [validationErrors, setValidationErrors] = useState<{ line: number; message: string }[]>([])
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState<{ success: number; errors: { line: number; message: string }[] } | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  if (!open) return null

  function close() {
    setStep('upload')
    setParsed(null)
    setMapping({})
    setImportRows([])
    setValidationErrors([])
    setImportResult(null)
    onOpenChange(false)
  }

  async function handleFile(file: File) {
    const ext = file.name.split('.').pop()?.toLowerCase()
    let content = ''
    let headers: string[] = []
    let rows: Record<string, string>[] = []

    if (ext === 'xlsx' || ext === 'xls') {
      const { read, utils } = await import('xlsx')
      const buffer = await file.arrayBuffer()
      const wb = read(buffer)
      const ws = wb.Sheets[wb.SheetNames[0]]
      const data = utils.sheet_to_json<string[]>(ws, { header: 1 }) as unknown as string[][]
      if (data.length > 0) {
        headers = data[0].map(String)
        rows = data.slice(1).filter(r => r.some(c => c)).map(r => {
          const obj: Record<string, string> = {}
          headers.forEach((h, i) => { obj[h] = String(r[i] ?? '') })
          return obj
        })
      }
    } else {
      const Papa = (await import('papaparse')).default
      const result = Papa.parse<Record<string, string>>(await file.text(), {
        header: true,
        skipEmptyLines: true,
      })
      headers = result.meta.fields ?? []
      rows = result.data
    }

    const autoMapping = autoMapColumns(headers)
    setParsed({ headers, rows, fileName: file.name })
    setMapping(autoMapping)
    setStep('mapping')
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  function goToConfirm() {
    if (!parsed) return
    const { rows: valid, errors } = applyMapping(parsed.rows, mapping)
    setImportRows(valid)
    setValidationErrors(errors)
    setStep('confirm')
  }

  async function handleImport() {
    if (importRows.length === 0) return
    setImporting(true)
    const result = await importPolicies(importRows)
    setImporting(false)
    setImportResult({ success: result.success, errors: result.errors })
    if (result.success > 0) onImported(result.success)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={close} />
      <div className="relative z-10 w-full max-w-[640px] bg-white rounded-[12px] shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F3F4F6]">
          <div>
            <h2 className="text-[16px] font-semibold text-[#0D0D0D]">Importar Apólices</h2>
            <p className="text-[12px] text-[#9CA3AF] mt-0.5">
              {step === 'upload' ? 'Passo 1 de 3 — Upload' : step === 'mapping' ? 'Passo 2 de 3 — Mapeamento de colunas' : 'Passo 3 de 3 — Confirmação'}
            </p>
          </div>
          <button onClick={close} className="h-8 w-8 flex items-center justify-center rounded-[6px] text-[#9CA3AF] hover:bg-[#F3F4F6]">
            <X size={16} />
          </button>
        </div>

        <div className="p-6">
          {/* Step 1: Upload */}
          {step === 'upload' && (
            <div
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onClick={() => fileRef.current?.click()}
              className={`flex flex-col items-center justify-center gap-3 h-48 rounded-[8px] border-2 border-dashed cursor-pointer transition-colors ${dragOver ? 'border-[#0BD904] bg-[rgba(11,217,4,0.04)]' : 'border-[#D1D1D1] hover:border-[#0BD904]'}`}
            >
              <FileSpreadsheet size={36} className="text-[#9CA3AF]" />
              <div className="text-center">
                <p className="text-[14px] font-semibold text-[#0D0D0D]">Arraste seu arquivo aqui</p>
                <p className="text-[12px] text-[#9CA3AF] mt-1">ou clique para selecionar — CSV ou XLSX, até 500 linhas</p>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
              />
            </div>
          )}

          {/* Step 2: Column Mapping */}
          {step === 'mapping' && parsed && (
            <div>
              <p className="text-[13px] text-[#6B7280] mb-4">
                Arquivo: <strong>{parsed.fileName}</strong> — {parsed.rows.length} linhas detectadas.
                Associe cada coluna do seu arquivo ao campo correto do Premia.
              </p>
              <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                {parsed.headers.map(h => (
                  <div key={h} className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-mono bg-[#F3F4F6] rounded px-2 py-1 truncate">{h}</p>
                      {parsed.rows[0]?.[h] && (
                        <p className="text-[11px] text-[#9CA3AF] mt-0.5 truncate">ex: {parsed.rows[0][h]}</p>
                      )}
                    </div>
                    <span className="text-[#D1D1D1]">→</span>
                    <select
                      value={mapping[h] ?? ''}
                      onChange={(e) => setMapping(prev => ({ ...prev, [h]: e.target.value }))}
                      className="flex-1 h-9 rounded-[6px] border border-[#D1D1D1] bg-white px-2 text-[13px] outline-none focus:border-[#0BD904] transition-colors"
                    >
                      <option value="">Ignorar coluna</option>
                      {PREMIA_FIELDS.map(f => (
                        <option key={f.key} value={f.key}>
                          {f.label}{f.required ? ' *' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button onClick={() => setStep('upload')} className="h-9 px-4 rounded-[6px] border border-[#D1D1D1] text-[13px] text-[#6B7280] hover:border-[#0D0D0D]">
                  Voltar
                </button>
                <Button size="sm" onClick={goToConfirm}>
                  Verificar dados →
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Confirm */}
          {step === 'confirm' && (
            <div>
              {importResult ? (
                <div className="text-center py-6">
                  {importResult.success > 0 ? (
                    <>
                      <div className="w-14 h-14 rounded-full bg-[rgba(11,217,4,0.1)] flex items-center justify-center mx-auto mb-4">
                        <Check size={28} className="text-[#0BD904]" />
                      </div>
                      <p className="text-[18px] font-bold text-[#0D0D0D]">{importResult.success} apólices importadas</p>
                      <p className="text-[13px] text-[#6B7280] mt-2">Alertas de renovação configurados automaticamente</p>
                      <Button size="sm" className="mt-4" onClick={close}>Fechar</Button>
                    </>
                  ) : (
                    <>
                      <AlertTriangle size={32} className="text-[#DC2626] mx-auto mb-3" />
                      <p className="text-[15px] font-semibold text-[#0D0D0D]">Nenhuma apólice importada</p>
                      <Button size="sm" variant="secondary" className="mt-4" onClick={close}>Fechar</Button>
                    </>
                  )}
                </div>
              ) : (
                <>
                  <div className={`p-4 rounded-[8px] mb-4 ${importRows.length > 0 ? 'bg-[rgba(11,217,4,0.06)] border border-[rgba(11,217,4,0.3)]' : 'bg-[#FEF2F2] border border-[#FECACA]'}`}>
                    <p className="text-[14px] font-semibold text-[#0D0D0D]">
                      {importRows.length} apólices prontas para importar
                      {validationErrors.length > 0 && ` · ${validationErrors.length} com erro`}
                    </p>
                  </div>
                  {validationErrors.length > 0 && (
                    <div className="max-h-[120px] overflow-y-auto space-y-1 mb-4">
                      {validationErrors.map((e, i) => (
                        <p key={i} className="text-[12px] text-[#DC2626]">Linha {e.line}: {e.message}</p>
                      ))}
                    </div>
                  )}
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setStep('mapping')} className="h-9 px-4 rounded-[6px] border border-[#D1D1D1] text-[13px] text-[#6B7280] hover:border-[#0D0D0D]">
                      Voltar
                    </button>
                    <Button
                      size="sm"
                      onClick={handleImport}
                      loading={importing}
                      disabled={importRows.length === 0}
                    >
                      <Upload size={13} />
                      Importar {importRows.length} apólices
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
