'use client'

import { useState, useRef } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X, Upload, CheckCircle, AlertTriangle, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { bulkImportClients, bulkImportPolicies } from '@/app/(dashboard)/apolices/actions'
import { RAMO_LABELS } from '@/types/policy'
import * as XLSX from 'xlsx'

type Mode = 'clientes' | 'apolices'

interface Props {
  open: boolean
  onOpenChange: (v: boolean) => void
  mode: Mode
  onDone?: () => void
}

function sheetToRows(sheet: XLSX.WorkSheet): { headers: string[]; rows: Record<string, string>[] } {
  const data = XLSX.utils.sheet_to_json<string[]>(sheet, { header: 1, defval: '' })
  if (data.length < 2) return { headers: [], rows: [] }
  const headers = (data[0] as string[]).map(h => String(h).toLowerCase().trim())
  const rows = (data.slice(1) as string[][])
    .map(vals => {
      const row: Record<string, string> = {}
      headers.forEach((h, i) => { row[h] = String(vals[i] ?? '').trim() })
      return row
    })
    .filter(row => Object.values(row).some(v => v))
  return { headers, rows }
}

function parseDate(s: string): string {
  if (!s) return ''
  // DD/MM/YYYY → YYYY-MM-DD
  const dmY = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (dmY) return `${dmY[3]}-${dmY[2].padStart(2, '0')}-${dmY[1].padStart(2, '0')}`
  // Already YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s
  return s
}

const CLIENT_TEMPLATE = `nome,cpf_cnpj,email,telefone,cep,data_nascimento,tipo_pessoa,observacoes
João da Silva,123.456.789-00,joao@email.com,11999887766,01310-100,15/03/1985,PF,Cliente antigo
Maria Souza LTDA,12.345.678/0001-90,maria@empresa.com,21988776655,20040-020,,PJ,`

const POLICY_TEMPLATE = `seguradora,ramo,cpf_cliente,nome_cliente,telefone_cliente,numero_apolice,inicio_vigencia,fim_vigencia,status,premio_total,valor_franquia,comissao_pct,periodicidade,observacoes
Porto Seguro,auto,123.456.789-00,João da Silva,11999887766,123456,01/01/2025,01/01/2026,ativa,2500.00,1000.00,15,anual,
Bradesco,vida,,Maria Souza,,789012,01/03/2025,01/03/2026,ativa,1800.00,,20,mensal,`

const RAMO_ALIASES: Record<string, string> = {
  'automóvel': 'auto', 'automovel': 'auto', 'carro': 'auto', 'veículo': 'auto', 'veiculo': 'auto',
  'residência': 'residencial', 'residencia': 'residencial', 'casa': 'residencial', 'imóvel': 'residencial', 'imovel': 'residencial',
  'empresa': 'empresarial', 'empresarial': 'empresarial', 'comercial': 'empresarial',
  'saúde': 'saude', 'plano de saúde': 'saude', 'plano de saude': 'saude',
  'viagem': 'viagem', 'travel': 'viagem',
  'rural': 'rural', 'agrícola': 'rural', 'agricola': 'rural',
  'vida': 'vida',
  'outros': 'outros',
}

export function CsvImportModal({ open, onOpenChange, mode, onDone }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<{ headers: string[]; rows: Record<string, string>[]; raw: string } | null>(null)
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState<{ imported: number; skipped: number } | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)

  function reset() {
    setPreview(null); setResult(null); setFileError(null)
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    const isXlsx = /\.(xlsx|xls)$/i.test(file.name)
    const isCsv = /\.csv$/i.test(file.name)
    if (!isXlsx && !isCsv) { setFileError('Selecione um arquivo .xlsx, .xls ou .csv'); return }
    setFileError(null)
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const data = ev.target?.result
        const wb = XLSX.read(data, { type: isCsv ? 'string' : 'array', raw: false, dateNF: 'dd/mm/yyyy' })
        const sheet = wb.Sheets[wb.SheetNames[0]]
        const parsed = sheetToRows(sheet)
        if (!parsed.rows.length) { setFileError('Arquivo vazio ou sem dados válidos'); return }
        setPreview({ ...parsed, raw: '' })
      } catch {
        setFileError('Erro ao ler o arquivo. Verifique se não está corrompido.')
      }
    }
    if (isCsv) reader.readAsText(file, 'UTF-8')
    else reader.readAsArrayBuffer(file)
  }

  async function handleImport() {
    if (!preview) return
    setImporting(true)

    let res: { imported: number; skipped: number; error?: string }

    if (mode === 'clientes') {
      const rows = preview.rows.map(r => ({
        name: r['nome'] || r['name'] || r['cliente'] || '',
        phone: r['telefone'] || r['phone'] || r['celular'] || r['fone'] || '',
        email: r['email'] || r['e-mail'] || '',
        cpf_cnpj: r['cpf_cnpj'] || r['cpf'] || r['cnpj'] || '',
        birth_date: parseDate(r['data_nascimento'] || r['nascimento'] || r['birth_date'] || ''),
        cep: r['cep'] || r['zip'] || '',
        tipo_pessoa: r['tipo_pessoa'] || r['tipo'] || 'PF',
        notes: r['observacoes'] || r['obs'] || r['notes'] || r['observações'] || '',
      }))
      res = await bulkImportClients(rows)
    } else {
      const rows = preview.rows.map(r => {
        const ramoRaw = (r['ramo'] || '').toLowerCase().trim()
        const ramo = RAMO_ALIASES[ramoRaw] || (Object.keys(RAMO_LABELS).includes(ramoRaw) ? ramoRaw : 'outros')
        const franquiaRaw = r['valor_franquia'] || r['franquia'] || r['deductible'] || ''
        const franquia = franquiaRaw ? parseFloat(franquiaRaw.replace(/\./g, '').replace(',', '.')) : undefined
        return {
          client_cpf: r['cpf_cliente'] || r['cpf'] || r['cnpj'] || r['cpf_cnpj'] || '',
          client_name: r['nome_cliente'] || r['cliente'] || r['nome'] || '',
          client_phone: r['telefone_cliente'] || r['telefone'] || r['phone'] || '',
          ramo,
          seguradora: r['seguradora'] || r['seguro'] || r['insuradora'] || '',
          policy_number: r['numero_apolice'] || r['numero'] || r['n_apolice'] || r['apolice'] || '',
          start_date: parseDate(r['inicio_vigencia'] || r['inicio'] || r['start_date'] || r['data_inicio'] || ''),
          end_date: parseDate(r['fim_vigencia'] || r['fim'] || r['end_date'] || r['data_fim'] || r['vencimento'] || ''),
          status: r['status'] || '',
          premium_total: parseFloat((r['premio_total'] || r['premio'] || r['premium'] || '0').replace(/\./g, '').replace(',', '.')),
          franquia: isNaN(franquia as number) ? undefined : franquia,
          commission_pct: parseFloat((r['comissao_pct'] || r['comissao'] || r['commission_pct'] || '0').replace(',', '.')),
          payment_frequency: r['periodicidade'] || r['payment_frequency'] || r['frequencia'] || 'anual',
          notes: r['observacoes'] || r['obs'] || r['notes'] || r['observações'] || '',
        }
      })
      res = await bulkImportPolicies(rows)
    }

    setImporting(false)
    if (res.error) { setFileError(res.error); return }
    setResult({ imported: res.imported, skipped: res.skipped })
  }

  const label = mode === 'clientes' ? 'Clientes' : 'Apólices'
  const template = mode === 'clientes' ? CLIENT_TEMPLATE : POLICY_TEMPLATE
  const templateName = mode === 'clientes' ? 'modelo-clientes.csv' : 'modelo-apolices.csv'

  function downloadTemplate() {
    const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = templateName; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Dialog.Root open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) reset() }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-[560px] max-h-[85vh] translate-x-[-50%] translate-y-[-50%] bg-white rounded-[12px] border border-[#E5E5E5] shadow-xl flex flex-col focus:outline-none">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E5E5] flex-shrink-0">
            <Dialog.Title className="text-[17px] font-semibold text-[#0D0D0D]">Importar {label}</Dialog.Title>
            <Dialog.Close asChild>
              <button className="p-1.5 rounded-[6px] text-[#6B7280] hover:bg-[#F4F4F4] transition-colors"><X size={16} /></button>
            </Dialog.Close>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
            {!result ? (
              <>
                {/* Download template */}
                <div className="flex items-center justify-between p-3 rounded-[8px] bg-[#F9FFF9] border border-[rgba(11,217,4,0.2)]">
                  <div>
                    <p className="text-[13px] font-medium text-[#0D0D0D]">Baixar modelo CSV</p>
                    <p className="text-[12px] text-[#6B7280]">Também aceita .xlsx e .xls</p>
                  </div>
                  <button
                    onClick={downloadTemplate}
                    className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[6px] border border-[#0BD904] text-[12px] font-medium text-[#034001] hover:bg-[rgba(11,217,4,0.08)] transition-colors"
                  >
                    <Download size={13} />
                    Baixar modelo
                  </button>
                </div>

                {/* Upload area */}
                <div>
                  <input ref={fileRef} type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={handleFile} />
                  <button
                    onClick={() => { reset(); fileRef.current?.click() }}
                    className="w-full border-2 border-dashed border-[#D1D1D1] rounded-[8px] py-8 flex flex-col items-center gap-2 hover:border-[#0BD904] hover:bg-[#F9FFF9] transition-colors group"
                  >
                    <Upload size={24} className="text-[#9CA3AF] group-hover:text-[#0BD904] transition-colors" />
                    <p className="text-[13px] font-medium text-[#6B7280] group-hover:text-[#0D0D0D]">Clique para selecionar o arquivo <span className="font-semibold">.xlsx</span> ou <span className="font-semibold">.csv</span></p>
                  </button>
                  {fileError && <p className="mt-2 text-[12px] text-[#DC2626]">{fileError}</p>}
                </div>

                {/* Preview */}
                {preview && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[13px] font-semibold text-[#0D0D0D]">{preview.rows.length} linha{preview.rows.length !== 1 ? 's' : ''} encontrada{preview.rows.length !== 1 ? 's' : ''}</p>
                      <p className="text-[12px] text-[#9CA3AF]">Colunas: {preview.headers.join(', ')}</p>
                    </div>
                    <div className="border border-[#E5E5E5] rounded-[6px] overflow-hidden">
                      <div className="overflow-x-auto max-h-[160px]">
                        <table className="w-full text-[12px]">
                          <thead className="bg-[#F9FAFB] border-b border-[#E5E5E5]">
                            <tr>
                              {preview.headers.slice(0, 5).map(h => (
                                <th key={h} className="px-3 py-2 text-left font-semibold text-[#6B7280] whitespace-nowrap">{h}</th>
                              ))}
                              {preview.headers.length > 5 && <th className="px-3 py-2 text-left text-[#9CA3AF]">+{preview.headers.length - 5}</th>}
                            </tr>
                          </thead>
                          <tbody>
                            {preview.rows.slice(0, 4).map((row, i) => (
                              <tr key={i} className="border-b border-[#F3F4F6]">
                                {preview.headers.slice(0, 5).map(h => (
                                  <td key={h} className="px-3 py-2 text-[#0D0D0D] truncate max-w-[100px]">{row[h] || '—'}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    {preview.rows.length > 4 && (
                      <p className="text-[11px] text-[#9CA3AF] mt-1">+{preview.rows.length - 4} linhas adicionais</p>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center py-8 text-center">
                <div className="w-14 h-14 rounded-full bg-[rgba(11,217,4,0.1)] flex items-center justify-center mb-4">
                  <CheckCircle size={28} className="text-[#0BD904]" />
                </div>
                <p className="text-[17px] font-bold text-[#0D0D0D] mb-1">Importação concluída</p>
                <p className="text-[14px] text-[#6B7280]">
                  <span className="font-semibold text-[#0BD904]">{result.imported} {label.toLowerCase()}</span> importado{result.imported !== 1 ? 's' : ''} com sucesso.
                </p>
                {result.skipped > 0 && (
                  <div className="flex items-center gap-2 mt-3 px-3 py-2 rounded-[6px] bg-[#FEF3C7]">
                    <AlertTriangle size={14} className="text-[#D97706] shrink-0" />
                    <p className="text-[12px] text-[#92400E]">{result.skipped} linha{result.skipped !== 1 ? 's' : ''} ignorada{result.skipped !== 1 ? 's' : ''} (dados incompletos ou inválidos)</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="px-6 py-4 border-t border-[#E5E5E5] flex justify-end gap-2 flex-shrink-0">
            {!result ? (
              <>
                <Dialog.Close asChild>
                  <Button variant="secondary" size="sm">Cancelar</Button>
                </Dialog.Close>
                <Button
                  size="sm"
                  onClick={handleImport}
                  disabled={!preview || importing}
                >
                  {importing ? 'Importando...' : `Importar ${preview?.rows.length ?? 0} linha${(preview?.rows.length ?? 0) !== 1 ? 's' : ''}`}
                </Button>
              </>
            ) : (
              <Button size="sm" onClick={() => { onOpenChange(false); onDone?.() }}>
                Concluir
              </Button>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
