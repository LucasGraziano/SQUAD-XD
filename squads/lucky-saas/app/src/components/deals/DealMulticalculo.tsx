'use client'

import { useState, useTransition } from 'react'
import { Plus, Trash2, Star } from 'lucide-react'
import type { DealSummary, DealItem } from '@/app/actions/deals'
import { addQuoteItem, updateQuoteItem, deleteQuoteItem } from '@/app/(dashboard)/cotacoes/actions'

const inputCls = 'h-9 w-full rounded-[6px] border border-[#D1D1D1] bg-white px-3 text-[13px] text-[#0D0D0D] placeholder:text-[#9CA3AF] outline-none focus:border-[#0BD904] transition-colors'
const selectCls = 'h-9 w-full rounded-[6px] border border-[#D1D1D1] bg-white px-3 text-[13px] text-[#0D0D0D] outline-none focus:border-[#0BD904] transition-colors'

function formatBRL(n: number) { return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }
function parseCurrency(v: string) { return parseFloat(v.replace(/\./g, '').replace(',', '.')) || 0 }
function formatCurrencyInput(v: string) {
  const n = v.replace(/\D/g, '')
  if (!n) return ''
  return (parseInt(n, 10) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

interface NewItemForm {
  seguradora: string; premiumRaw: string; payFreq: string
  franchiseRaw: string; coveragesText: string; brokerNote: string; isRecommended: boolean
}
const emptyForm = (): NewItemForm => ({
  seguradora: '', premiumRaw: '', payFreq: 'anual',
  franchiseRaw: '', coveragesText: '', brokerNote: '', isRecommended: false,
})

interface Props {
  deal: DealSummary
}

export function DealMulticalculo({ deal }: Props) {
  const [items, setItems] = useState<DealItem[]>(deal.deal_items)
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState<NewItemForm>(emptyForm())
  const [formError, setFormError] = useState<string | null>(null)
  const [, startTransition] = useTransition()

  function f(field: keyof NewItemForm) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const value = field === 'isRecommended'
        ? (e.target as HTMLInputElement).checked
        : e.target.value
      setForm((p) => ({ ...p, [field]: value }))
    }
  }

  async function addItem() {
    if (!form.seguradora.trim()) { setFormError('Informe a seguradora'); return }
    const premium = parseCurrency(form.premiumRaw)
    if (!premium) { setFormError('Informe o prêmio'); return }
    setFormError(null)

    startTransition(async () => {
      const result = await addQuoteItem({
        quote_request_id: deal.id,
        seguradora:       form.seguradora.trim(),
        premium_total:    premium,
        payment_frequency: form.payFreq,
        franchise_value:  form.franchiseRaw ? parseCurrency(form.franchiseRaw) : undefined,
        coverages:        form.coveragesText ? form.coveragesText.split('\n').map(s => s.trim()).filter(Boolean) : [],
        broker_note:      form.brokerNote || undefined,
        is_recommended:   form.isRecommended,
      })
      if (result.error) { setFormError(result.error); return }
      setItems((p) => [...p, result.data as DealItem])
      setForm(emptyForm())
      setAdding(false)
    })
  }

  async function removeItem(id: string) {
    startTransition(async () => {
      await deleteQuoteItem(id)
      setItems((p) => p.filter(i => i.id !== id))
    })
  }

  async function toggleRecommended(item: DealItem) {
    startTransition(async () => {
      // Unmark all, then mark this one
      await Promise.all(items.map(i => updateQuoteItem(i.id, { is_recommended: i.id === item.id })))
      setItems((p) => p.map(i => ({ ...i, is_recommended: i.id === item.id })))
    })
  }

  return (
    <section className="bg-white rounded-[10px] border border-[#E5E5E5] p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[13px] font-semibold text-[#374151]">Multicálculo ({items.length} seguradora{items.length !== 1 ? 's' : ''})</h3>
        <button
          onClick={() => setAdding((v) => !v)}
          className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[6px] border border-[#D1D1D1] text-[12px] text-[#374151] hover:bg-[#F8F8F8] transition-colors"
        >
          <Plus size={12} />
          Adicionar
        </button>
      </div>

      {/* Items list */}
      <div className="flex flex-col gap-2 mb-3">
        {items.map((item) => (
          <div
            key={item.id}
            className={`flex items-center justify-between p-3 rounded-[8px] border transition-colors ${item.is_recommended ? 'border-[#0BD904] bg-[rgba(11,217,4,0.04)]' : 'border-[#E5E5E5]'}`}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-[13px] font-semibold text-[#0D0D0D]">{item.seguradora}</p>
                {item.is_recommended && (
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-[4px] bg-[#0BD904] text-[#034001]">Recomendada</span>
                )}
              </div>
              <p className="text-[13px] text-[#374151] font-medium mt-0.5">{formatBRL(item.premium_total)}</p>
              {item.coverages && item.coverages.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {item.coverages.map((c) => (
                    <span key={c} className="text-[10px] px-1.5 py-0.5 rounded-[4px] bg-[rgba(11,217,4,0.1)] text-[#034001] font-medium border border-[rgba(11,217,4,0.25)]">
                      {c}
                    </span>
                  ))}
                </div>
              )}
              {item.broker_note && <p className="text-[11px] text-[#9CA3AF] mt-1">{item.broker_note}</p>}
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => toggleRecommended(item)}
                title="Marcar como recomendada"
                className={`h-7 w-7 rounded-[4px] flex items-center justify-center transition-colors ${item.is_recommended ? 'text-[#0BD904]' : 'text-[#9CA3AF] hover:text-[#374151]'}`}
              >
                <Star size={14} fill={item.is_recommended ? 'currentColor' : 'none'} />
              </button>
              <button
                onClick={() => removeItem(item.id)}
                className="h-7 w-7 rounded-[4px] text-[#9CA3AF] hover:text-[#DC2626] flex items-center justify-center transition-colors"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-[13px] text-[#9CA3AF] py-2">Nenhuma seguradora adicionada ainda.</p>
        )}
      </div>

      {/* Add form */}
      {adding && (
        <div className="border border-[#E5E5E5] rounded-[8px] p-3 flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-medium text-[#6B7280] mb-1">Seguradora *</label>
              <input className={inputCls} value={form.seguradora} onChange={f('seguradora')} placeholder="Ex: Porto Seguro" />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-[#6B7280] mb-1">Prêmio *</label>
              <input
                className={inputCls}
                value={form.premiumRaw}
                onChange={(e) => setForm((p) => ({ ...p, premiumRaw: formatCurrencyInput(e.target.value) }))}
                placeholder="0,00"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-[#6B7280] mb-1">Frequência</label>
              <select className={selectCls} value={form.payFreq} onChange={f('payFreq')}>
                <option value="anual">Anual</option>
                <option value="semestral">Semestral</option>
                <option value="trimestral">Trimestral</option>
                <option value="mensal">Mensal</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-medium text-[#6B7280] mb-1">Franquia</label>
              <input
                className={inputCls}
                value={form.franchiseRaw}
                onChange={(e) => setForm((p) => ({ ...p, franchiseRaw: formatCurrencyInput(e.target.value) }))}
                placeholder="0,00"
              />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-medium text-[#6B7280] mb-1">
              Coberturas <span className="text-[#9CA3AF] font-normal">(uma por linha)</span>
            </label>
            <textarea
              rows={4}
              value={form.coveragesText}
              onChange={f('coveragesText')}
              placeholder={"Roubo e Furto\nColisão\nIncêndio\nDanos a Terceiros"}
              className="w-full rounded-[6px] border border-[#D1D1D1] bg-white px-3 py-2 text-[13px] text-[#0D0D0D] placeholder:text-[#9CA3AF] outline-none focus:border-[#0BD904] transition-colors resize-none"
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-[#6B7280] mb-1">Nota do corretor</label>
            <input className={inputCls} value={form.brokerNote} onChange={f('brokerNote')} placeholder="Observação sobre esta opção..." />
          </div>
          <label className="flex items-center gap-2 text-[12px] text-[#374151] cursor-pointer">
            <input type="checkbox" checked={form.isRecommended} onChange={f('isRecommended')} className="accent-[#0BD904]" />
            Marcar como recomendada
          </label>
          {formError && <p className="text-[12px] text-[#DC2626]">{formError}</p>}
          <div className="flex gap-2">
            <button onClick={addItem} className="h-8 px-3 rounded-[6px] bg-[#0BD904] text-[#034001] text-[12px] font-semibold hover:bg-[#09C003]">Adicionar</button>
            <button onClick={() => { setAdding(false); setForm(emptyForm()); setFormError(null) }} className="h-8 px-3 rounded-[6px] border border-[#D1D1D1] text-[12px] hover:bg-[#F8F8F8]">Cancelar</button>
          </div>
        </div>
      )}
    </section>
  )
}
