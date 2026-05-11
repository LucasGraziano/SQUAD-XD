'use client'

import { useState, useRef, useTransition } from 'react'
import { X, Upload, FileText, Download, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { parseCsvContent } from '@/lib/import/parse-csv'
import { importPolicies } from '@/app/actions/import-policies'
import type { ImportRow, ImportError } from '@/lib/import/parse-csv'
import { cn } from '@/lib/utils/cn'

type Step = 'upload' | 'preview' | 'importing' | 'result'

interface Props {
  open: boolean
  onOpenChange: (v: boolean) => void
  onDone: () => void
}

const MAX_ROWS = 500

export function ImportPoliciesModal({ open, onOpenChange, onDone }: Props) {
  const [step, setStep] = useState<Step>('upload')
  const [rows, setRows] = useState<ImportRow[]>([])
  const [parseErrors, setParseErrors] = useState<ImportError[]>([])
  const [importResult, setImportResult] = useState<{ success: number; errors: ImportError[] } | null>(null)
  const [, startTransition] = useTransition()
  const fileRef = useRef<HTMLInputElement>(null)

  if (!open) return null

  function handleClose() {
    setStep('upload')
    setRows([])
    setParseErrors([])
    setImportResult(null)
    onOpenChange(false)
  }

  function handleFile(file: File) {
    const reader = new FileReader()
    reader.onload = e => {
      const content = e.target?.result as string
      const { rows: parsed, errors } = parseCsvContent(content)
      if (parsed.length > MAX_ROWS) {
        setParseErrors([{ line: 0, message: `Máximo de ${MAX_ROWS} linhas por importação. Arquivo tem ${parsed.length} linhas.`, raw: {} }])
        setRows([])
      } else {
        setRows(parsed)
        setParseErrors(errors)
      }
      setStep('preview')
    }
    reader.readAsText(file, 'UTF-8')
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && (file.name.endsWith('.csv') || file.name.endsWith('.txt'))) handleFile(file)
  }

  function handleImport() {
    if (rows.length === 0) return
    setStep('importing')
    startTransition(async () => {
      const result = await importPolicies(rows)
      setImportResult(result)
      setStep('result')
      if (result.success > 0) onDone()
    })
  }

  const REQUIRED_COLS = ['cliente_nome', 'seguradora', 'ramo', 'inicio_vigencia', 'fim_vigencia', 'premio_total']
  const OPTIONAL_COLS = ['numero_apolice', 'cpf_cliente', 'telefone_cliente', 'email_cliente', 'comissao_pct', 'notas']

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={handleClose} />
      <div className="relative bg-white rounded-[12px] shadow-xl w-full max-w-[600px] mx-4 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E5E5] flex-shrink-0">
          <div>
            <h2 className="text-[15px] font-semibold text-[#0D0D0D]">Importar Apólices em Massa</h2>
            <div className="flex items-center gap-2 mt-1">
              {(['upload', 'preview', 'importing', 'result'] as Step[]).map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <span className={cn(
                    'w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center',
                    step === s ? 'bg-[#0BD904] text-[#0D0D0D]' :
                    (['upload', 'preview', 'importing', 'result'].indexOf(step) > i) ? 'bg-[#DCFCE7] text-[#16A34A]' :
                    'bg-[#F3F4F6] text-[#9CA3AF]'
                  )}>
                    {i + 1}
                  </span>
                  {i < 3 && <span className="w-4 h-px bg-[#E5E5E5]" />}
                </div>
              ))}
            </div>
          </div>
          <button onClick={handleClose} className="p-1 rounded-[5px] text-[#9CA3AF] hover:text-[#0D0D0D]"><X size={16} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {/* Step 1: Upload */}
          {step === 'upload' && (
            <div>
              <div
                onDrop={handleDrop}
                onDragOver={e => e.preventDefault()}
                onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed border-[#D1D1D1] rounded-[8px] p-10 text-center cursor-pointer hover:border-[#0BD904] transition-colors"
              >
                <Upload size={32} className="mx-auto text-[#9CA3AF] mb-3" />
                <p className="text-[14px] font-medium text-[#0D0D0D] mb-1">Arraste o arquivo CSV aqui</p>
                <p className="text-[12px] text-[#9CA3AF]">ou clique para selecionar</p>
                <input ref={fileRef} type="file" accept=".csv,.txt" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wide mb-2">Colunas obrigatórias</p>
                  <div className="space-y-1">
                    {REQUIRED_COLS.map(c => (
                      <div key={c} className="flex items-center gap-1.5 text-[12px] text-[#0D0D0D]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626] flex-shrink-0" />
                        {c}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wide mb-2">Colunas opcionais</p>
                  <div className="space-y-1">
                    {OPTIONAL_COLS.map(c => (
                      <div key={c} className="flex items-center gap-1.5 text-[12px] text-[#9CA3AF]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#9CA3AF] flex-shrink-0" />
                        {c}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-[#F3F4F6]">
                <a
                  href="/templates/importacao-apolices.csv"
                  download
                  className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#0BD904] hover:underline"
                >
                  <Download size={13} />
                  Baixar template de exemplo
                </a>
              </div>
            </div>
          )}

          {/* Step 2: Preview */}
          {step === 'preview' && (
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-[#0BD904]" />
                  <span className="text-[13px] font-semibold text-[#0D0D0D]">{rows.length} linhas válidas</span>
                </div>
                {parseErrors.length > 0 && (
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={14} className="text-[#D97706]" />
                    <span className="text-[12px] text-[#D97706]">{parseErrors.length} erro{parseErrors.length !== 1 ? 's' : ''}</span>
                  </div>
                )}
              </div>

              {/* Preview table */}
              {rows.length > 0 && (
                <div className="border border-[#E5E5E5] rounded-[6px] overflow-x-auto mb-4">
                  <table className="w-full min-w-[500px]">
                    <thead>
                      <tr className="bg-[#F9FAFB] border-b border-[#E5E5E5]">
                        {['Cliente', 'Seguradora', 'Ramo', 'Início', 'Fim', 'Prêmio'].map(h => (
                          <th key={h} className="px-3 py-2 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {rows.slice(0, 5).map((row, i) => (
                        <tr key={i} className="border-b border-[#F3F4F6]">
                          <td className="px-3 py-2 text-[12px] text-[#0D0D0D]">{row.cliente_nome}</td>
                          <td className="px-3 py-2 text-[12px] text-[#6B7280]">{row.seguradora}</td>
                          <td className="px-3 py-2 text-[12px] text-[#6B7280]">{row.ramo}</td>
                          <td className="px-3 py-2 text-[12px] text-[#9CA3AF]">{row.inicio_vigencia}</td>
                          <td className="px-3 py-2 text-[12px] text-[#9CA3AF]">{row.fim_vigencia}</td>
                          <td className="px-3 py-2 text-[12px] font-mono text-[#0D0D0D]">R$ {row.premio_total.toLocaleString('pt-BR')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {rows.length > 5 && (
                    <div className="px-3 py-2 text-center text-[11px] text-[#9CA3AF]">
                      +{rows.length - 5} linhas não exibidas
                    </div>
                  )}
                </div>
              )}

              {/* Errors */}
              {parseErrors.length > 0 && (
                <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-[6px] p-3">
                  <p className="text-[12px] font-semibold text-[#D97706] mb-2">Linhas com erro (não serão importadas):</p>
                  <div className="space-y-1 max-h-[100px] overflow-y-auto">
                    {parseErrors.map((e, i) => (
                      <p key={i} className="text-[11px] text-[#92400E]">Linha {e.line}: {e.message}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Importing */}
          {step === 'importing' && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 size={32} className="animate-spin text-[#0BD904] mb-4" />
              <p className="text-[14px] font-medium text-[#0D0D0D]">Importando {rows.length} apólices...</p>
              <p className="text-[12px] text-[#9CA3AF] mt-1">Criando clientes e vinculando apólices</p>
            </div>
          )}

          {/* Step 4: Result */}
          {step === 'result' && importResult && (
            <div>
              <div className={cn(
                'flex items-center gap-3 p-4 rounded-[8px] mb-4',
                importResult.success > 0 ? 'bg-[#F0FDF4] border border-[rgba(11,217,4,0.3)]' : 'bg-[#FEF2F2] border border-[#FECACA]'
              )}>
                <CheckCircle size={20} className={importResult.success > 0 ? 'text-[#0BD904]' : 'text-[#DC2626]'} />
                <div>
                  <p className="text-[14px] font-semibold text-[#0D0D0D]">
                    {importResult.success} apólice{importResult.success !== 1 ? 's' : ''} importada{importResult.success !== 1 ? 's' : ''}
                  </p>
                  {importResult.errors.length > 0 && (
                    <p className="text-[12px] text-[#D97706]">{importResult.errors.length} erro{importResult.errors.length !== 1 ? 's' : ''} ignorado{importResult.errors.length !== 1 ? 's' : ''}</p>
                  )}
                </div>
              </div>
              {importResult.errors.length > 0 && (
                <div className="bg-[#FEF2F2] border border-[#FECACA] rounded-[6px] p-3 max-h-[120px] overflow-y-auto">
                  {importResult.errors.map((e, i) => (
                    <p key={i} className="text-[11px] text-[#DC2626]">Linha {e.line}: {e.message}</p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-2 px-6 py-4 border-t border-[#E5E5E5] flex-shrink-0">
          {step === 'upload' && (
            <Button type="button" variant="secondary" size="sm" className="flex-1" onClick={handleClose}>Cancelar</Button>
          )}
          {step === 'preview' && (
            <>
              <Button type="button" variant="secondary" size="sm" className="flex-1" onClick={() => setStep('upload')}>Voltar</Button>
              <Button
                type="button" size="sm" className="flex-1"
                disabled={rows.length === 0}
                onClick={handleImport}
              >
                Importar {rows.length} apólice{rows.length !== 1 ? 's' : ''}
              </Button>
            </>
          )}
          {step === 'result' && (
            <Button type="button" size="sm" className="flex-1" onClick={handleClose}>Fechar</Button>
          )}
        </div>
      </div>
    </div>
  )
}
