'use client'

import { useState, useEffect, useRef } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X, FileUp, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ClienteAutocomplete } from './ClienteAutocomplete'
import type { ClientePrefill } from './ClienteAutocomplete'
import { createPolicy, updatePolicy, findClientByCpf } from '@/app/(dashboard)/apolices/actions'
import { extractPolicyFromPDF } from '@/app/(dashboard)/apolices/pdf-extract'
import type { Client } from '@/types/client'
import type { Policy, PaymentFrequency } from '@/types/policy'
import { RAMO_LABELS, PAYMENT_LABELS } from '@/types/policy'
// PAYMENT_LABELS keys used for AI periodicidade mapping

const selectCls = "h-[42px] w-full rounded-[6px] border border-[#D1D1D1] bg-white px-3 text-[14px] text-[#0D0D0D] outline-none focus:border-[#0BD904] focus:shadow-[0_0_0_3px_rgba(11,217,4,0.12)] transition-colors"
const labelCls = "text-[13px] font-medium text-[#0D0D0D] mb-1.5 block"
const sectionCls = "border-t border-[#F3F4F6] pt-4 mt-4"

function formatCurrency(v: string) {
  const n = v.replace(/\D/g, '')
  if (!n) return ''
  return (parseInt(n, 10) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function parseCurrency(v: string) {
  return parseFloat(v.replace(/\./g, '').replace(',', '.')) || 0
}

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated: (policy: Policy) => void
  onUpdated?: (policy: Policy) => void
  preselectedClient?: Client | null
  editingPolicy?: Policy | null
  renewingFrom?: Policy | null
}

export function ApolicaModal({ open, onOpenChange, onCreated, onUpdated, preselectedClient, editingPolicy, renewingFrom }: Props) {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [ramo, setRamo] = useState('')
  const [seguradora, setSeguradora] = useState('')
  const [policyNumber, setPolicyNumber] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [premiumRaw, setPremiumRaw] = useState('')
  const [payFreq, setPayFreq] = useState<PaymentFrequency>('anual')
  const [commPct, setCommPct] = useState('')
  const [metadata, setMetadata] = useState<Record<string, string>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [pdfLoading, setPdfLoading] = useState(false)
  const [pdfError, setPdfError] = useState<string | null>(null)
  const [aiFields, setAiFields] = useState<Set<string>>(new Set())
  const [clientPrefill, setClientPrefill] = useState<ClientePrefill | undefined>(undefined)
  const fileRef = useRef<HTMLInputElement>(null)

  const premium = parseCurrency(premiumRaw)
  const commValue = premium > 0 && commPct ? (premium * parseFloat(commPct) / 100) : 0

  const isEditing = !!editingPolicy
  const isRenewing = !!renewingFrom

  useEffect(() => {
    if (preselectedClient && !editingPolicy && !renewingFrom) setSelectedClient(preselectedClient)
  }, [preselectedClient, editingPolicy, renewingFrom])

  // Pré-preenche o formulário quando abre em modo de edição
  useEffect(() => {
    if (open && editingPolicy) {
      setSelectedClient((editingPolicy.clients as Client) ?? null)
      setRamo(editingPolicy.ramo)
      setSeguradora(editingPolicy.seguradora)
      setPolicyNumber(editingPolicy.policy_number ?? '')
      setStartDate(editingPolicy.start_date)
      setEndDate(editingPolicy.end_date)
      setPremiumRaw(editingPolicy.premium_total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
      setPayFreq(editingPolicy.payment_frequency)
      setCommPct(String(editingPolicy.commission_pct))
      setMetadata((editingPolicy.metadata as Record<string, string>) ?? {})
      setErrors({}); setServerError(null)
    }
  }, [open, editingPolicy])

  // Pré-preenche para renovação (mesmos dados, datas +1 ano, sem número de apólice)
  useEffect(() => {
    if (open && renewingFrom) {
      setSelectedClient((renewingFrom.clients as Client) ?? null)
      setRamo(renewingFrom.ramo)
      setSeguradora(renewingFrom.seguradora)
      setPolicyNumber('')
      const newStart = new Date(renewingFrom.end_date + 'T00:00:00')
      newStart.setDate(newStart.getDate() + 1)
      const newEnd = new Date(newStart)
      newEnd.setFullYear(newEnd.getFullYear() + 1)
      setStartDate(newStart.toISOString().split('T')[0])
      setEndDate(newEnd.toISOString().split('T')[0])
      setPremiumRaw(renewingFrom.premium_total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
      setPayFreq(renewingFrom.payment_frequency)
      setCommPct(String(renewingFrom.commission_pct))
      setMetadata((renewingFrom.metadata as Record<string, string>) ?? {})
      setErrors({}); setServerError(null)
    }
  }, [open, renewingFrom])

  useEffect(() => {
    if (!open) {
      setSelectedClient(preselectedClient ?? null)
      setRamo(''); setSeguradora(''); setPolicyNumber('')
      setStartDate(''); setEndDate(''); setPremiumRaw('')
      setPayFreq('anual'); setCommPct(''); setMetadata({})
      setErrors({}); setServerError(null)
      setPdfLoading(false); setPdfError(null)
      setAiFields(new Set()); setClientPrefill(undefined)
    }
  }, [open, preselectedClient])

  async function handlePdfFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''

    setPdfLoading(true)
    setPdfError(null)
    setAiFields(new Set())
    setClientPrefill(undefined)

    const fd = new FormData()
    fd.append('pdf', file)
    const result = await extractPolicyFromPDF(fd)

    setPdfLoading(false)

    if ('error' in result) { setPdfError(result.error); return }

    const d = result.data
    const filled = new Set<string>()

    if (d.seguradora) { setSeguradora(d.seguradora); filled.add('seguradora') }
    if (d.ramo && Object.keys(RAMO_LABELS).includes(d.ramo)) { setRamo(d.ramo); filled.add('ramo') }
    if (d.numero_apolice) { setPolicyNumber(d.numero_apolice); filled.add('policyNumber') }
    if (d.start_date) { setStartDate(d.start_date); filled.add('startDate') }
    if (d.end_date) { setEndDate(d.end_date); filled.add('endDate') }
    if (d.premium_total && d.premium_total > 0) {
      setPremiumRaw(d.premium_total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
      filled.add('premium')
    }
    if (d.commission_pct && d.commission_pct > 0) { setCommPct(String(d.commission_pct)); filled.add('commPct') }
    if (d.periodicidade && Object.keys(PAYMENT_LABELS).includes(d.periodicidade)) {
      setPayFreq(d.periodicidade as PaymentFrequency); filled.add('payFreq')
    }

    // Preenche metadata com campos extras
    const newMeta: Record<string, string> = {}
    if (d.valor_franquia && d.valor_franquia > 0) { newMeta.franquia = String(d.valor_franquia); filled.add('franquia') }
    if (d.coberturas) { newMeta.coberturas = d.coberturas; filled.add('coberturas') }
    if (d.sinistro_tel) { newMeta.sinistro_tel = d.sinistro_tel; filled.add('sinistro_tel') }
    if (d.sinistro_zap) { newMeta.sinistro_zap = d.sinistro_zap; filled.add('sinistro_zap') }
    if (d.placa) { newMeta.placa = d.placa; filled.add('placa') }
    if (d.objeto_segurado) { newMeta.objeto_segurado = d.objeto_segurado; filled.add('objeto_segurado') }
    if (Object.keys(newMeta).length > 0) setMetadata(prev => ({ ...prev, ...newMeta }))

    // Tenta auto-selecionar cliente por CPF; se não achar, pré-preenche o formulário de criação
    if (d.cpf_cnpj) {
      const found = await findClientByCpf(d.cpf_cnpj)
      if (found) {
        setSelectedClient(found)
      } else {
        setClientPrefill({
          name: d.nome_cliente ?? undefined,
          cpf_cnpj: d.cpf_cnpj,
        })
      }
    } else if (d.nome_cliente) {
      setClientPrefill({ name: d.nome_cliente })
    }

    setAiFields(filled)
  }

  function aiLabel(field: string) {
    return aiFields.has(field) ? (
      <span className="ml-1 text-[10px] font-medium text-blue-500 bg-blue-50 px-1 py-0.5 rounded">✦ IA</span>
    ) : null
  }

  function validate() {
    const e: Record<string, string> = {}
    if (!selectedClient) e.client = 'Selecione ou crie um cliente'
    if (!ramo) e.ramo = 'Selecione o ramo'
    if (!seguradora.trim()) e.seguradora = 'Seguradora é obrigatória'
    if (!startDate) e.startDate = 'Data de início é obrigatória'
    if (!endDate) e.endDate = 'Data de fim é obrigatória'
    if (startDate && endDate && endDate <= startDate) e.endDate = 'Fim deve ser após o início'
    if (!premiumRaw || premium <= 0) e.premium = 'Prêmio é obrigatório'
    if (!commPct || parseFloat(commPct) < 0 || parseFloat(commPct) > 100) e.commPct = 'Comissão deve ser entre 0 e 100'
    return e
  }

  async function handleSave() {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }

    setSaving(true)
    setServerError(null)

    const input = {
      client_id: selectedClient!.id,
      ramo,
      seguradora,
      policy_number: policyNumber || undefined,
      start_date: startDate,
      end_date: endDate,
      premium_total: premium,
      payment_frequency: payFreq,
      commission_pct: parseFloat(commPct),
      metadata,
    }

    const result = isEditing
      ? await updatePolicy(editingPolicy!.id, input)
      : await createPolicy(input)

    setSaving(false)

    if (result.error) { setServerError(result.error); return }

    if (isEditing) {
      onUpdated?.(result.data as Policy)
    } else {
      onCreated(result.data as Policy)
    }
    onOpenChange(false)
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-[600px] max-h-[90vh] translate-x-[-50%] translate-y-[-50%] bg-white rounded-[12px] border border-[#E5E5E5] shadow-xl flex flex-col focus:outline-none">

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E5E5] flex-shrink-0">
            <Dialog.Title className="text-[18px] font-semibold text-[#0D0D0D]">
              {isEditing ? 'Editar Apólice' : isRenewing ? 'Renovar Apólice' : 'Nova Apólice'}
            </Dialog.Title>
            <div className="flex items-center gap-2">
              <input
                ref={fileRef}
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={handlePdfFile}
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={pdfLoading}
                className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[6px] border border-[#D1D1D1] bg-white text-[12px] font-medium text-[#6B7280] hover:border-[#0BD904] hover:text-[#0D0D0D] transition-colors disabled:opacity-50"
              >
                {pdfLoading ? <Loader2 size={13} className="animate-spin" /> : <FileUp size={13} />}
                {pdfLoading ? 'Lendo...' : 'Importar PDF'}
              </button>
              <Dialog.Close asChild>
                <button className="p-1.5 rounded-[6px] text-[#6B7280] hover:bg-[#F4F4F4] transition-colors">
                  <X size={16} />
                </button>
              </Dialog.Close>
            </div>
          </div>

          {/* PDF feedback banners */}
          {pdfError && (
            <div className="mx-6 mt-3 text-[12px] text-red-600 bg-red-50 border border-red-200 rounded-[6px] px-3 py-2">
              {pdfError}
            </div>
          )}
          {aiFields.size > 0 && !pdfError && (
            <div className="mx-6 mt-3 text-[12px] text-blue-700 bg-blue-50 border border-blue-200 rounded-[6px] px-3 py-2">
              ✦ {aiFields.size} campos preenchidos pela IA — revise antes de salvar.
            </div>
          )}

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">

            {/* Seção 1 — Apólice */}
            <div>
              <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-3">1 — Apólice</p>

              <div className="space-y-4">
                <div>
                  <label className={labelCls}>Cliente <span className="text-[#DC2626]">*</span></label>
                  <ClienteAutocomplete
                    value={selectedClient}
                    onChange={setSelectedClient}
                    error={errors.client}
                    prefill={clientPrefill}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Ramo <span className="text-[#DC2626]">*</span>{aiLabel('ramo')}</label>
                    <select value={ramo} onChange={(e) => { setRamo(e.target.value); setMetadata({}) }} className={selectCls}>
                      <option value="">Selecionar ramo</option>
                      {Object.entries(RAMO_LABELS).map(([v, l]) => (
                        <option key={v} value={v}>{l}</option>
                      ))}
                    </select>
                    {errors.ramo && <span className="text-[12px] text-[#DC2626]">{errors.ramo}</span>}
                  </div>

                  <Input
                    label={<>Seguradora{aiLabel('seguradora')}</>}
                    value={seguradora}
                    onChange={(e) => setSeguradora(e.target.value)}
                    placeholder="Ex: Porto Seguro"
                    required
                    error={errors.seguradora}
                  />
                </div>

                <Input
                  label={<>Número da apólice (opcional){aiLabel('policyNumber')}</>}
                  value={policyNumber}
                  onChange={(e) => setPolicyNumber(e.target.value)}
                  placeholder="Ex: 0001234-5"
                />
              </div>
            </div>

            {/* Seção 2 — Vigência e Financeiro */}
            <div className={sectionCls}>
              <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-3">2 — Vigência e Financeiro</p>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Input label={<>Início da vigência{aiLabel('startDate')}</>} type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required error={errors.startDate} />
                  <Input label={<>Fim da vigência{aiLabel('endDate')}</>} type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required error={errors.endDate} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Prêmio total (R$) <span className="text-[#DC2626]">*</span>{aiLabel('premium')}</label>
                    <input
                      type="text"
                      value={premiumRaw}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/\D/g, '')
                        setPremiumRaw(raw ? formatCurrency(raw) : '')
                      }}
                      placeholder="0,00"
                      className={`h-[42px] w-full rounded-[6px] border ${errors.premium ? 'border-[#DC2626]' : 'border-[#D1D1D1]'} bg-white px-3 text-[14px] text-[#0D0D0D] placeholder:text-[#9CA3AF] outline-none focus:border-[#0BD904] transition-colors font-mono`}
                    />
                    {errors.premium && <span className="text-[12px] text-[#DC2626]">{errors.premium}</span>}
                  </div>

                  <div>
                    <label className={labelCls}>Forma de pagamento</label>
                    <select value={payFreq} onChange={(e) => setPayFreq(e.target.value as PaymentFrequency)} className={selectCls}>
                      {Object.entries(PAYMENT_LABELS).map(([v, l]) => (
                        <option key={v} value={v}>{l}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>% Comissão <span className="text-[#DC2626]">*</span></label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={commPct}
                      onChange={(e) => setCommPct(e.target.value)}
                      placeholder="Ex: 20"
                      className={`h-[42px] w-full rounded-[6px] border ${errors.commPct ? 'border-[#DC2626]' : 'border-[#D1D1D1]'} bg-white px-3 text-[14px] text-[#0D0D0D] outline-none focus:border-[#0BD904] transition-colors`}
                    />
                    {errors.commPct && <span className="text-[12px] text-[#DC2626]">{errors.commPct}</span>}
                  </div>

                  <div>
                    <label className={labelCls}>Comissão calculada</label>
                    <input
                      type="text"
                      readOnly
                      value={commValue > 0
                        ? commValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                        : '—'
                      }
                      className="h-[42px] w-full rounded-[6px] border border-[#E5E5E5] bg-[#F8F8F8] px-3 text-[14px] font-mono text-[#0D0D0D] outline-none cursor-default"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Seção 3 — Dados do Ramo + Sinistro */}
            {ramo && (
              <div className={sectionCls}>
                <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-3">
                  3 — Dados {RAMO_LABELS[ramo] ?? ramo}
                </p>
                <div className="space-y-3">
                  {ramo === 'auto' && (
                    <div className="grid grid-cols-2 gap-3">
                      <Input label="Placa" value={metadata.placa ?? ''} onChange={(e) => setMetadata(m => ({ ...m, placa: e.target.value }))} placeholder="ABC-1234" />
                      <Input label="Modelo / Ano" value={metadata.modelo ?? ''} onChange={(e) => setMetadata(m => ({ ...m, modelo: e.target.value }))} placeholder="Honda Civic 2022" />
                    </div>
                  )}
                  {ramo === 'vida' && (
                    <div className="grid grid-cols-2 gap-3">
                      <Input label="CPF do segurado" value={metadata.cpf_segurado ?? ''} onChange={(e) => setMetadata(m => ({ ...m, cpf_segurado: e.target.value }))} placeholder="000.000.000-00" />
                      <Input label="Capital segurado (R$)" value={metadata.capital_segurado ?? ''} onChange={(e) => setMetadata(m => ({ ...m, capital_segurado: e.target.value }))} placeholder="100.000,00" />
                    </div>
                  )}
                  {ramo === 'residencial' && (
                    <div>
                      <label className={labelCls}>Endereço do imóvel</label>
                      <textarea value={metadata.endereco ?? ''} onChange={(e) => setMetadata(m => ({ ...m, endereco: e.target.value }))} rows={2} placeholder="Rua, número, bairro, cidade — SP" className="w-full rounded-[6px] border border-[#D1D1D1] bg-white px-3 py-2.5 text-[14px] placeholder:text-[#9CA3AF] outline-none focus:border-[#0BD904] transition-colors resize-none" />
                    </div>
                  )}
                  {ramo === 'empresarial' && (
                    <div className="grid grid-cols-2 gap-3">
                      <Input label="CNPJ" value={metadata.cnpj ?? ''} onChange={(e) => setMetadata(m => ({ ...m, cnpj: e.target.value }))} placeholder="00.000.000/0001-00" />
                      <Input label="Ramo de atividade" value={metadata.atividade ?? ''} onChange={(e) => setMetadata(m => ({ ...m, atividade: e.target.value }))} placeholder="Ex: Comércio" />
                    </div>
                  )}

                  {/* Coberturas — todos os ramos */}
                  <div>
                    <label className={labelCls}>Coberturas incluídas <span className="text-[10px] font-normal text-[#9CA3AF]">(separadas por vírgula)</span></label>
                    <textarea
                      value={metadata.coberturas ?? ''}
                      onChange={(e) => setMetadata(m => ({ ...m, coberturas: e.target.value }))}
                      rows={2}
                      placeholder={ramo === 'auto' ? 'Colisão, Roubo/Furto, Terceiros, Assistência 24h' : ramo === 'vida' ? 'Morte, Invalidez Permanente, Doenças Graves' : ramo === 'residencial' ? 'Incêndio, Roubo, Responsabilidade Civil, Danos Elétricos' : 'Ex: Cobertura A, Cobertura B'}
                      className="w-full rounded-[6px] border border-[#D1D1D1] bg-white px-3 py-2.5 text-[14px] placeholder:text-[#9CA3AF] outline-none focus:border-[#0BD904] transition-colors resize-none"
                    />
                    <p className="text-[11px] text-[#9CA3AF] mt-1">Aparece no portal do cliente como lista de coberturas.</p>
                  </div>

                  {/* Contatos de sinistro — todos os ramos */}
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label="Tel 24h sinistro (seguradora)"
                      value={metadata.sinistro_tel ?? ''}
                      onChange={(e) => setMetadata(m => ({ ...m, sinistro_tel: e.target.value }))}
                      placeholder="0800 727 4636"
                    />
                    <Input
                      label="WhatsApp sinistro (seguradora)"
                      value={metadata.sinistro_zap ?? ''}
                      onChange={(e) => setMetadata(m => ({ ...m, sinistro_zap: e.target.value }))}
                      placeholder="11 91234-5678"
                    />
                  </div>
                  <p className="text-[11px] text-[#9CA3AF] -mt-1">Exibidos no portal do cliente para acionamento direto.</p>
                </div>
              </div>
            )}

            {serverError && (
              <p className="text-[13px] text-[#DC2626] bg-[#FEF2F2] border border-[#FECACA] rounded-[6px] px-3 py-2">
                {serverError}
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 px-6 py-4 border-t border-[#E5E5E5] flex-shrink-0">
            <Dialog.Close asChild>
              <Button variant="secondary" size="sm">Cancelar</Button>
            </Dialog.Close>
            <Button size="sm" onClick={handleSave} loading={saving}>
              {isEditing ? 'Salvar alterações' : 'Salvar Apólice'}
            </Button>
          </div>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
