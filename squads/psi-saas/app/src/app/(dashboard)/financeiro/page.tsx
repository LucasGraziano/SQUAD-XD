'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  TrendingUp, Clock, AlertCircle, CheckCircle2,
  Plus, X, ChevronDown, Receipt, DollarSign,
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import { format, startOfMonth, subMonths, parseISO, isAfter } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { createClient } from '@/lib/supabase/client'
import { Header } from '@/components/layout/header'
import { AnimatedCounter, Reveal, StaggerGroup, StaggerItem } from '@/components/ui/motion'

type Payment = {
  id: string
  patient_id: string
  session_id: string | null
  amount_cents: number
  status: string
  billing_cycle: string
  due_date: string
  paid_at: string | null
  notes: string | null
  created_at: string
  patients: { full_name: string } | null
}

type Patient = { id: string; full_name: string }

const STATUS_LABEL: Record<string, string> = {
  pending:   'Pendente',
  paid:      'Pago',
  overdue:   'Atrasado',
  cancelled: 'Cancelado',
  refunded:  'Estornado',
}
const STATUS_COLOR: Record<string, string> = {
  pending:   'bg-amber-50 text-amber-700 border-amber-200',
  paid:      'bg-green-50 text-green-700 border-green-200',
  overdue:   'bg-red-50 text-red-700 border-red-200',
  cancelled: 'bg-neutral-100 text-neutral-500 border-neutral-200',
  refunded:  'bg-blue-50 text-blue-700 border-blue-200',
}
const BILLING_LABEL: Record<string, string> = {
  per_session: 'Por sessão',
  weekly:      'Semanal',
  monthly:     'Mensal',
}
const PIE_COLORS = ['#F59E0B', '#10B981', '#EF4444', '#9CA3AF']

function formatCents(cents: number) {
  return (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

const supabase = createClient()

export default function FinanceiroPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'paid' | 'overdue'>('all')
  const [showModal, setShowModal] = useState(false)

  // Modal form state
  const [form, setForm] = useState({
    patient_id: '',
    amount: '',
    due_date: format(new Date(), 'yyyy-MM-dd'),
    billing_cycle: 'per_session',
    notes: '',
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: psy } = await supabase
        .from('psychologists')
        .select('id, session_price_cents')
        .eq('user_id', user.id)
        .single()
      if (!psy) return

      const [{ data: pays }, { data: pats }] = await Promise.all([
        supabase
          .from('payments')
          .select('*, patients(full_name)')
          .eq('psychologist_id', psy.id)
          .order('due_date', { ascending: false }),
        supabase
          .from('patients')
          .select('id, full_name')
          .eq('psychologist_id', psy.id)
          .eq('status', 'active')
          .order('full_name'),
      ])

      const now = new Date()
      const overdueBatch: string[] = []
      const updated = (pays ?? []).map(p => {
        if (p.status === 'pending' && isAfter(now, new Date(p.due_date + 'T23:59:59'))) {
          overdueBatch.push(p.id)
          return { ...p, status: 'overdue' }
        }
        return p
      })
      setPayments(updated as Payment[])

      if (overdueBatch.length > 0) {
        supabase.from('payments').update({ status: 'overdue' }).in('id', overdueBatch)
      }
      setPatients(pats ?? [])
      setForm(prev => ({ ...prev, amount: String((psy.session_price_cents ?? 20000) / 100) }))
    } finally {
      setLoading(false)
    }
  }

  // ── Stats ─────────────────────────────────────────────
  const stats = useMemo(() => {
    const now = new Date()
    const monthStart = startOfMonth(now)

    const thisMonth = payments.filter(p =>
      new Date(p.due_date) >= monthStart && p.status === 'paid'
    )
    const received = thisMonth.reduce((s, p) => s + p.amount_cents, 0)
    const pending  = payments.filter(p => p.status === 'pending').reduce((s, p) => s + p.amount_cents, 0)
    const overdue  = payments.filter(p => p.status === 'overdue').reduce((s, p) => s + p.amount_cents, 0)
    const total    = payments.filter(p => ['paid','pending','overdue'].includes(p.status))
    const adimplency = total.length === 0 ? 100 : Math.round(
      (payments.filter(p => p.status === 'paid').length / total.length) * 100
    )
    return { received, pending, overdue, adimplency }
  }, [payments])

  // ── Monthly chart ──────────────────────────────────────
  const monthlyData = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => {
      const month = subMonths(new Date(), 5 - i)
      const key = format(month, 'yyyy-MM')
      const total = payments
        .filter(p => p.status === 'paid' && p.paid_at?.startsWith(key))
        .reduce((s, p) => s + p.amount_cents, 0)
      return {
        month: format(month, 'MMM', { locale: ptBR }),
        valor: total / 100,
      }
    })
  }, [payments])

  // ── Pie chart ──────────────────────────────────────────
  const pieData = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const p of payments) {
      counts[p.status] = (counts[p.status] ?? 0) + 1
    }
    return Object.entries(counts).map(([status, count]) => ({
      name: STATUS_LABEL[status] ?? status,
      value: count,
    }))
  }, [payments])

  // ── Filtered list ──────────────────────────────────────
  const filtered = useMemo(() =>
    filter === 'all' ? payments : payments.filter(p => p.status === filter),
  [payments, filter])

  // ── Actions ────────────────────────────────────────────
  async function createPayment() {
    setSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: psy } = await supabase
        .from('psychologists')
        .select('id')
        .eq('user_id', user.id)
        .single()
      if (!psy) return

      const { error } = await supabase.from('payments').insert({
        psychologist_id: psy.id,
        patient_id: form.patient_id,
        amount_cents: Math.round(parseFloat(form.amount) * 100),
        due_date: form.due_date,
        billing_cycle: form.billing_cycle as 'per_session' | 'weekly' | 'monthly',
        notes: form.notes || null,
        status: 'pending' as const,
      })
      if (!error) setShowModal(false)
    } finally {
      setSaving(false)
      await load()
    }
  }

  async function markPaid(paymentId: string) {
    await supabase
      .from('payments')
      .update({ status: 'paid', paid_at: new Date().toISOString() })
      .eq('id', paymentId)
    await load()
  }

  async function cancelPayment(paymentId: string) {
    await supabase
      .from('payments')
      .update({ status: 'cancelled' })
      .eq('id', paymentId)
    await load()
  }

  // ── Receipt PDF ────────────────────────────────────────
  async function downloadReceipt(payment: Payment) {
    const { jsPDF } = await import('jspdf')
    const doc = new jsPDF({ unit: 'mm', format: 'a4' })
    const W = 210

    const { data: { user } } = await supabase.auth.getUser()
    const { data: psy } = await supabase
      .from('psychologists')
      .select('full_name, crp, email, phone')
      .eq('user_id', user!.id)
      .single()

    doc.setFillColor(26, 74, 90)
    doc.rect(0, 0, W, 16, 'F')
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(255, 255, 255)
    doc.text('Vínculo — Recibo de Serviços Psicológicos', 20, 10)

    let y = 30
    doc.setTextColor(31, 41, 55)
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text('RECIBO', 20, y)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(107, 114, 128)
    doc.text(`Emitido em ${format(new Date(), "dd/MM/yyyy 'às' HH:mm")}`, W - 20, y, { align: 'right' })
    y += 10

    doc.setDrawColor(226, 226, 222)
    doc.line(20, y, W - 20, y)
    y += 8

    doc.setFontSize(10)
    doc.setTextColor(31, 41, 55)
    doc.setFont('helvetica', 'bold')
    doc.text('Prestador de Serviços', 20, y)
    y += 6
    doc.setFont('helvetica', 'normal')
    doc.text(`${psy?.full_name}`, 20, y); y += 5
    doc.text(`CRP: ${psy?.crp}`, 20, y); y += 5
    if (psy?.email) { doc.text(`E-mail: ${psy.email}`, 20, y); y += 5 }
    y += 5

    doc.setFont('helvetica', 'bold')
    doc.text('Paciente', 20, y)
    y += 6
    doc.setFont('helvetica', 'normal')
    doc.text(`${payment.patients?.full_name ?? '—'}`, 20, y)
    y += 12

    doc.setFillColor(245, 249, 250)
    doc.rect(20, y - 4, W - 40, 24, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.text('Serviços de Psicoterapia', 25, y + 4)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(107, 114, 128)
    doc.text(`Ciclo: ${BILLING_LABEL[payment.billing_cycle]} · Vencimento: ${format(new Date(payment.due_date), 'dd/MM/yyyy')}`, 25, y + 11)
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(26, 74, 90)
    doc.text(formatCents(payment.amount_cents), W - 25, y + 7, { align: 'right' })
    y += 28

    if (payment.notes) {
      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(107, 114, 128)
      doc.text(`Obs.: ${payment.notes}`, 20, y)
      y += 8
    }

    doc.setFontSize(7)
    doc.setTextColor(180, 180, 180)
    doc.text(
      'Este recibo foi gerado pelo Vínculo — plataforma de gestão para psicólogos.',
      W / 2, 285, { align: 'center' }
    )

    doc.save(`recibo-${payment.patients?.full_name?.toLowerCase().replace(/\s+/g, '-')}-${payment.due_date}.pdf`)
  }

  return (
    <>
      <Header title="Financeiro" subtitle="Cobranças, receitas e adimplência" />

      <main className="flex-1 p-6 max-w-5xl space-y-6">

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: 'Receita do mês',
              value: stats.received / 100,
              prefix: 'R$',
              icon: TrendingUp,
              color: 'text-semantic-success',
              bg: 'bg-semantic-success-bg',
            },
            {
              label: 'A receber',
              value: stats.pending / 100,
              prefix: 'R$',
              icon: Clock,
              color: 'text-amber-600',
              bg: 'bg-amber-50',
            },
            {
              label: 'Inadimplente',
              value: stats.overdue / 100,
              prefix: 'R$',
              icon: AlertCircle,
              color: 'text-semantic-danger',
              bg: 'bg-semantic-danger-bg',
            },
            {
              label: 'Adimplência',
              value: stats.adimplency,
              suffix: '%',
              icon: CheckCircle2,
              color: 'text-brand-teal',
              bg: 'bg-brand-teal/8',
            },
          ].map(({ label, value, prefix, suffix, icon: Icon, color, bg }, i) => (
            <Reveal key={label} delay={i * 0.08}>
              <div className="card-vinculo p-5">
                <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                  <Icon size={18} strokeWidth={1.5} className={color} />
                </div>
                <p className="text-xs text-neutral-secondary mb-1">{label}</p>
                <p className={`text-xl font-bold ${color}`}>
                  {prefix && <span className="text-base font-medium">{prefix} </span>}
                  <AnimatedCounter to={value} decimals={prefix ? 2 : 0} />
                  {suffix && <span className="text-base font-medium">{suffix}</span>}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-5 gap-5">
          <Reveal className="md:col-span-3">
            <div className="card-vinculo p-5">
              <p className="text-xs font-semibold text-neutral-charcoal mb-4">Receita mensal (últimos 6 meses)</p>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={monthlyData} barSize={28}>
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false}
                    tickFormatter={v => `R$${v}`} />
                  <Tooltip
                    formatter={(v: number) => [formatCents(v * 100), 'Receita']}
                    contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E2E2DE' }}
                  />
                  <Bar dataKey="valor" fill="#1A4A5A" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="md:col-span-2">
            <div className="card-vinculo p-5">
              <p className="text-xs font-semibold text-neutral-charcoal mb-4">Status das cobranças</p>
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={72}
                      dataKey="value" paddingAngle={3}>
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E2E2DE' }} />
                    <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[180px] flex items-center justify-center">
                  <p className="text-sm text-neutral-secondary">Sem cobranças</p>
                </div>
              )}
            </div>
          </Reveal>
        </div>

        {/* Payment list */}
        <Reveal>
          <div className="card-vinculo overflow-hidden">
            {/* Toolbar */}
            <div className="flex items-center justify-between p-5 border-b border-neutral-border">
              <div className="flex items-center gap-1">
                {(['all', 'pending', 'paid', 'overdue'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1.5 rounded-badge text-xs font-medium transition-all ${
                      filter === f
                        ? 'bg-brand-teal text-white'
                        : 'text-neutral-secondary hover:text-neutral-charcoal hover:bg-neutral-mist'
                    }`}
                  >
                    {f === 'all' ? 'Todos' : STATUS_LABEL[f]}
                  </button>
                ))}
              </div>

              <motion.button
                onClick={() => setShowModal(true)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-1.5 bg-brand-teal text-white text-xs font-semibold px-4 py-2 rounded-input hover:bg-brand-teal-dark transition-colors"
              >
                <Plus size={14} />
                Registrar cobrança
              </motion.button>
            </div>

            {/* Table */}
            {loading ? (
              <p className="text-sm text-neutral-secondary p-6">Carregando...</p>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12">
                <DollarSign size={36} strokeWidth={1} className="mx-auto mb-3 text-neutral-border" />
                <p className="text-sm text-neutral-secondary">Nenhuma cobrança encontrada</p>
              </div>
            ) : (
              <StaggerGroup className="divide-y divide-neutral-border" staggerChildren={0.04}>
                {filtered.map((payment) => (
                  <StaggerItem key={payment.id}>
                    <div className="flex items-center gap-4 px-5 py-3.5 hover:bg-neutral-mist/30 transition-colors">
                      {/* Patient */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-charcoal truncate">
                          {payment.patients?.full_name ?? '—'}
                        </p>
                        <p className="text-xs text-neutral-secondary mt-0.5">
                          {BILLING_LABEL[payment.billing_cycle]} · Venc. {format(new Date(payment.due_date), 'dd/MM/yyyy')}
                          {payment.notes && <span className="ml-2 italic">"{payment.notes}"</span>}
                        </p>
                      </div>

                      {/* Amount */}
                      <p className="text-sm font-semibold text-neutral-charcoal tabular-nums">
                        {formatCents(payment.amount_cents)}
                      </p>

                      {/* Status badge */}
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-badge border ${STATUS_COLOR[payment.status]}`}>
                        {STATUS_LABEL[payment.status]}
                      </span>

                      {/* Actions */}
                      <div className="flex items-center gap-1.5">
                        {payment.status === 'paid' && (
                          <button
                            onClick={() => downloadReceipt(payment)}
                            title="Baixar recibo"
                            className="p-1.5 rounded-lg hover:bg-neutral-mist text-neutral-secondary hover:text-brand-teal transition-all"
                          >
                            <Receipt size={14} />
                          </button>
                        )}
                        {(payment.status === 'pending' || payment.status === 'overdue') && (
                          <>
                            <button
                              onClick={() => markPaid(payment.id)}
                              className="text-xs font-medium text-semantic-success hover:text-green-800 transition-colors px-2 py-1 rounded-lg hover:bg-green-50"
                            >
                              Marcar pago
                            </button>
                            <button
                              onClick={() => cancelPayment(payment.id)}
                              className="p-1.5 rounded-lg hover:bg-neutral-mist text-neutral-secondary hover:text-semantic-danger transition-all"
                            >
                              <X size={13} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerGroup>
            )}
          </div>
        </Reveal>
      </main>

      {/* Create Payment Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-charcoal/40 backdrop-blur-sm p-4"
            onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold text-neutral-charcoal">Registrar cobrança</h2>
                <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-neutral-mist">
                  <X size={16} className="text-neutral-secondary" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Patient */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-charcoal mb-1.5">Paciente *</label>
                  <div className="relative">
                    <select
                      value={form.patient_id}
                      onChange={e => setForm(prev => ({ ...prev, patient_id: e.target.value }))}
                      className="w-full appearance-none px-3.5 py-2.5 rounded-input border border-neutral-border bg-white text-sm focus:outline-none focus:ring-1 focus:ring-brand-teal pr-8"
                    >
                      <option value="">Selecionar paciente</option>
                      {patients.map(p => (
                        <option key={p.id} value={p.id}>{p.full_name}</option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-secondary pointer-events-none" />
                  </div>
                </div>

                {/* Amount + Due Date */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-charcoal mb-1.5">Valor (R$) *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={form.amount}
                      onChange={e => setForm(prev => ({ ...prev, amount: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-input border border-neutral-border bg-white text-sm focus:outline-none focus:ring-1 focus:ring-brand-teal"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-charcoal mb-1.5">Vencimento *</label>
                    <input
                      type="date"
                      value={form.due_date}
                      onChange={e => setForm(prev => ({ ...prev, due_date: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-input border border-neutral-border bg-white text-sm focus:outline-none focus:ring-1 focus:ring-brand-teal"
                    />
                  </div>
                </div>

                {/* Billing cycle */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-charcoal mb-1.5">Ciclo</label>
                  <div className="flex gap-2">
                    {(['per_session', 'weekly', 'monthly'] as const).map(c => (
                      <button
                        key={c}
                        onClick={() => setForm(prev => ({ ...prev, billing_cycle: c }))}
                        className={`flex-1 py-2 rounded-input text-xs font-medium border transition-all ${
                          form.billing_cycle === c
                            ? 'bg-brand-teal text-white border-brand-teal'
                            : 'border-neutral-border text-neutral-secondary hover:border-brand-teal/40'
                        }`}
                      >
                        {BILLING_LABEL[c]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-charcoal mb-1.5">Observação (opcional)</label>
                  <input
                    type="text"
                    value={form.notes}
                    onChange={e => setForm(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Ex.: Sessão de 30/01, desconto..."
                    className="w-full px-3.5 py-2.5 rounded-input border border-neutral-border bg-white text-sm focus:outline-none focus:ring-1 focus:ring-brand-teal"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 rounded-input border border-neutral-border text-sm font-medium text-neutral-secondary hover:bg-neutral-mist transition-colors"
                >
                  Cancelar
                </button>
                <motion.button
                  onClick={createPayment}
                  disabled={saving || !form.patient_id || !form.amount || !form.due_date}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-2.5 rounded-input bg-brand-teal text-white text-sm font-semibold hover:bg-brand-teal-dark disabled:opacity-50 transition-colors"
                >
                  {saving ? 'Salvando...' : 'Registrar'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
