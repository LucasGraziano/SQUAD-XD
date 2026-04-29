'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Edit2, Save, X, Phone, Mail, Calendar,
  FileText, DollarSign, AlertTriangle, CheckCircle2,
  Clock, User, AlertCircle,
} from 'lucide-react'
import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { createClient } from '@/lib/supabase/client'
import { initials, formatDate } from '@/lib/utils'
import type { Patient } from '@/types/database.types'

interface Props {
  patient: Patient
  psyDefaults: {
    session_price_cents: number
    billing_cycle: 'per_session' | 'weekly' | 'monthly'
  }
  stats: {
    completedSessions: number
    nextSession: { id: string; scheduled_at: string; status: string } | null
    pendingPayments: number
  }
}

const STATUS_OPTIONS = [
  { value: 'active',   label: 'Ativo',    cls: 'bg-semantic-success-bg text-semantic-success border-green-200' },
  { value: 'paused',   label: 'Pausado',  cls: 'bg-semantic-warning-bg text-semantic-warning border-amber-200' },
  { value: 'inactive', label: 'Inativo',  cls: 'bg-neutral-mist text-neutral-secondary border-neutral-border' },
] as const

const BILLING_LABELS: Record<string, string> = {
  per_session: 'Por sessão',
  weekly: 'Semanal',
  monthly: 'Mensal',
}

const SOURCES = ['Indicação de paciente', 'Redes sociais', 'Site/Google', 'Convênio', 'Outro']

const supabase = createClient()

export function PatientProfileClient({ patient, psyDefaults, stats }: Props) {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()

  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    full_name:          patient.full_name,
    email:              patient.email ?? '',
    phone:              patient.phone ?? '',
    birth_date:         patient.birth_date ?? '',
    source:             patient.source ?? '',
    notes:              patient.notes ?? '',
    status:             patient.status,
    session_price:      String(Math.round((patient.session_price_cents ?? psyDefaults.session_price_cents) / 100)),
    billing_cycle:      (patient.billing_cycle ?? psyDefaults.billing_cycle) as 'per_session' | 'weekly' | 'monthly',
    emergency_name:     (patient.emergency_contact as { name?: string } | null)?.name ?? '',
    emergency_phone:    (patient.emergency_contact as { phone?: string } | null)?.phone ?? '',
  })

  async function handleSave() {
    setSaving(true)
    setError(null)
    try {
      const { error: err } = await supabase
        .from('patients')
        .update({
          full_name:          form.full_name,
          email:              form.email || null,
          phone:              form.phone || null,
          birth_date:         form.birth_date || null,
          source:             form.source || null,
          notes:              form.notes || null,
          status:             form.status,
          session_price_cents: Math.round(parseFloat(form.session_price) * 100),
          billing_cycle:      form.billing_cycle,
          emergency_contact:  form.emergency_name
            ? { name: form.emergency_name, phone: form.emergency_phone }
            : null,
        })
        .eq('id', id)

      if (err) {
        setError('Erro ao salvar. Tente novamente.')
        return
      }

      setEditing(false)
      router.refresh()
    } finally {
      setSaving(false)
    }
  }

  function cancelEdit() {
    setForm({
      full_name:          patient.full_name,
      email:              patient.email ?? '',
      phone:              patient.phone ?? '',
      birth_date:         patient.birth_date ?? '',
      source:             patient.source ?? '',
      notes:              patient.notes ?? '',
      status:             patient.status,
      session_price:      String(Math.round((patient.session_price_cents ?? psyDefaults.session_price_cents) / 100)),
      billing_cycle:      (patient.billing_cycle ?? psyDefaults.billing_cycle) as 'per_session' | 'weekly' | 'monthly',
      emergency_name:     (patient.emergency_contact as { name?: string } | null)?.name ?? '',
      emergency_phone:    (patient.emergency_contact as { phone?: string } | null)?.phone ?? '',
    })
    setEditing(false)
    setError(null)
  }

  const currentStatus = STATUS_OPTIONS.find(s => s.value === (editing ? form.status : patient.status))!
  const priceDisplay = Math.round((patient.session_price_cents ?? psyDefaults.session_price_cents) / 100)
  const billingDisplay = BILLING_LABELS[patient.billing_cycle ?? psyDefaults.billing_cycle]

  return (
    <main className="flex-1 p-6 max-w-3xl">
      {/* Back + Actions */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/pacientes"
          className="inline-flex items-center gap-1.5 text-sm text-neutral-secondary hover:text-brand-teal transition-colors"
        >
          <ArrowLeft size={14} />
          Voltar para pacientes
        </Link>

        <div className="flex gap-2">
          {!editing ? (
            <motion.button
              onClick={() => setEditing(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-input border border-neutral-border text-sm font-medium text-neutral-charcoal hover:border-brand-teal/40 hover:text-brand-teal transition-all"
            >
              <Edit2 size={14} />
              Editar
            </motion.button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={cancelEdit}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-input border border-neutral-border text-sm font-medium text-neutral-secondary hover:bg-neutral-mist transition-all"
              >
                <X size={14} />
                Cancelar
              </button>
              <motion.button
                onClick={handleSave}
                disabled={saving}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-input bg-brand-teal hover:bg-brand-teal-dark disabled:opacity-60 text-white text-sm font-semibold transition-all"
              >
                {saving ? (
                  <motion.span
                    className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                  />
                ) : <Save size={14} />}
                Salvar
              </motion.button>
            </div>
          )}
        </div>
      </div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 bg-semantic-danger-bg border border-semantic-danger/20 text-semantic-danger text-sm px-4 py-3 rounded-input mb-4"
          >
            <AlertCircle size={14} />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header card */}
      <div className="card-vinculo p-6 mb-5">
        <div className="flex items-start gap-5">
          <div className="w-16 h-16 rounded-full bg-brand-teal flex items-center justify-center text-white text-xl font-semibold flex-shrink-0">
            {initials(patient.full_name)}
          </div>

          <div className="flex-1 min-w-0">
            {editing ? (
              <input
                value={form.full_name}
                onChange={(e) => setForm(f => ({ ...f, full_name: e.target.value }))}
                className="text-xl font-semibold text-neutral-charcoal bg-white border border-neutral-border rounded-input px-3 py-1.5 w-full focus:outline-none focus:ring-2 focus:ring-brand-teal mb-2"
              />
            ) : (
              <h1 className="text-xl font-semibold text-neutral-charcoal mb-1">{patient.full_name}</h1>
            )}

            {/* Status badge */}
            {editing ? (
              <div className="flex gap-2 mb-1">
                {STATUS_OPTIONS.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => setForm(f => ({ ...f, status: s.value }))}
                    className={`px-2.5 py-1 rounded-badge text-xs font-medium border transition-all ${
                      form.status === s.value ? s.cls + ' ring-2 ring-offset-1 ring-brand-teal' : 'bg-neutral-mist text-neutral-secondary border-neutral-border'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            ) : (
              <span className={`inline-block px-2.5 py-1 rounded-badge text-xs font-medium border ${currentStatus.cls}`}>
                {currentStatus.label}
              </span>
            )}
          </div>

          {/* LGPD warning */}
          {!patient.lgpd_consent && (
            <div className="flex items-center gap-1.5 text-xs text-semantic-warning bg-semantic-warning-bg border border-amber-200 px-2.5 py-1.5 rounded-lg">
              <AlertTriangle size={12} />
              Termo LGPD pendente
            </div>
          )}
          {patient.lgpd_consent && (
            <div className="flex items-center gap-1.5 text-xs text-semantic-success bg-semantic-success-bg border border-green-200 px-2.5 py-1.5 rounded-lg">
              <CheckCircle2 size={12} />
              LGPD OK
            </div>
          )}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mt-5 pt-4 border-t border-neutral-border">
          <div className="text-center">
            <p className="text-2xl font-bold text-neutral-charcoal">{stats.completedSessions}</p>
            <p className="text-xs text-neutral-secondary">sessões realizadas</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-neutral-charcoal">
              {stats.nextSession
                ? format(parseISO(stats.nextSession.scheduled_at), "dd/MM 'às' HH:mm", { locale: ptBR })
                : '—'}
            </p>
            <p className="text-xs text-neutral-secondary">próxima sessão</p>
          </div>
          <div className="text-center">
            <p className={`text-2xl font-bold ${stats.pendingPayments > 0 ? 'text-semantic-warning' : 'text-neutral-charcoal'}`}>
              {stats.pendingPayments}
            </p>
            <p className="text-xs text-neutral-secondary">cobranças pendentes</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <Link
          href={`/prontuario/${id}`}
          className="card-vinculo p-4 flex items-center gap-3 hover:border-brand-teal/40 transition-all group"
        >
          <div className="w-9 h-9 rounded-xl bg-brand-sand flex items-center justify-center">
            <FileText size={16} className="text-brand-teal" />
          </div>
          <div>
            <p className="text-sm font-semibold text-neutral-charcoal group-hover:text-brand-teal transition-colors">Prontuário</p>
            <p className="text-xs text-neutral-secondary">Notas e evolução</p>
          </div>
        </Link>

        <Link
          href={`/financeiro?patient=${id}`}
          className="card-vinculo p-4 flex items-center gap-3 hover:border-brand-teal/40 transition-all group"
        >
          <div className="w-9 h-9 rounded-xl bg-semantic-success-bg flex items-center justify-center">
            <DollarSign size={16} className="text-semantic-success" />
          </div>
          <div>
            <p className="text-sm font-semibold text-neutral-charcoal group-hover:text-brand-teal transition-colors">Financeiro</p>
            <p className="text-xs text-neutral-secondary">
              {stats.pendingPayments > 0
                ? `${stats.pendingPayments} pendente${stats.pendingPayments > 1 ? 's' : ''}`
                : 'Em dia'}
            </p>
          </div>
        </Link>
      </div>

      {/* Contact */}
      <div className="card-vinculo p-6 space-y-4 mb-5">
        <div className="flex items-center gap-2 mb-1">
          <Phone size={14} strokeWidth={1.5} className="text-brand-teal" />
          <h2 className="font-semibold text-neutral-charcoal text-sm">Contato</h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <InfoField
            label="WhatsApp / Telefone"
            icon={<Phone size={12} />}
            value={editing ? (
              <input
                value={form.phone}
                onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))}
                type="tel"
                placeholder="(11) 99999-9999"
                className={inputCls}
              />
            ) : patient.phone || '—'}
          />
          <InfoField
            label="E-mail"
            icon={<Mail size={12} />}
            value={editing ? (
              <input
                value={form.email}
                onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                type="email"
                placeholder="paciente@email.com"
                className={inputCls}
              />
            ) : patient.email || '—'}
          />
        </div>

        {(patient.emergency_contact || editing) && (
          <div className="pt-3 border-t border-neutral-border">
            <p className="text-xs text-neutral-secondary mb-3">Contato de emergência</p>
            <div className="grid grid-cols-2 gap-4">
              <InfoField
                label="Nome"
                value={editing ? (
                  <input
                    value={form.emergency_name}
                    onChange={(e) => setForm(f => ({ ...f, emergency_name: e.target.value }))}
                    placeholder="Nome"
                    className={inputCls}
                  />
                ) : (patient.emergency_contact as { name?: string } | null)?.name || '—'}
              />
              <InfoField
                label="Telefone"
                value={editing ? (
                  <input
                    value={form.emergency_phone}
                    onChange={(e) => setForm(f => ({ ...f, emergency_phone: e.target.value }))}
                    type="tel"
                    placeholder="(11) 99999-9999"
                    className={inputCls}
                  />
                ) : (patient.emergency_contact as { phone?: string } | null)?.phone || '—'}
              />
            </div>
          </div>
        )}
      </div>

      {/* Personal data */}
      <div className="card-vinculo p-6 space-y-4 mb-5">
        <div className="flex items-center gap-2 mb-1">
          <User size={14} strokeWidth={1.5} className="text-brand-teal" />
          <h2 className="font-semibold text-neutral-charcoal text-sm">Dados pessoais</h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <InfoField
            label="Data de nascimento"
            icon={<Calendar size={12} />}
            value={editing ? (
              <input
                value={form.birth_date}
                onChange={(e) => setForm(f => ({ ...f, birth_date: e.target.value }))}
                type="date"
                className={inputCls}
              />
            ) : patient.birth_date
              ? formatDate(patient.birth_date, { day: '2-digit', month: '2-digit', year: 'numeric' })
              : '—'
            }
          />
          <InfoField
            label="Como chegou"
            value={editing ? (
              <select
                value={form.source}
                onChange={(e) => setForm(f => ({ ...f, source: e.target.value }))}
                className={inputCls}
              >
                <option value="">Selecione</option>
                {SOURCES.map((s) => <option key={s}>{s}</option>)}
              </select>
            ) : patient.source || '—'}
          />
        </div>

        <InfoField
          label="Demanda inicial / Observações"
          value={editing ? (
            <textarea
              value={form.notes}
              onChange={(e) => setForm(f => ({ ...f, notes: e.target.value }))}
              rows={3}
              className={`${inputCls} resize-none`}
            />
          ) : patient.notes || '—'}
        />
      </div>

      {/* Billing */}
      <div className="card-vinculo p-6 mb-5">
        <div className="flex items-center gap-2 mb-4">
          <Clock size={14} strokeWidth={1.5} className="text-brand-teal" />
          <h2 className="font-semibold text-neutral-charcoal text-sm">Cobrança</h2>
        </div>

        {editing ? (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-secondary mb-1.5">Valor por sessão (R$)</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-neutral-secondary">R$</span>
                <input
                  value={form.session_price}
                  onChange={(e) => setForm(f => ({ ...f, session_price: e.target.value }))}
                  type="number"
                  min="10"
                  step="10"
                  className={`${inputCls} pl-9`}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-secondary mb-1.5">Ciclo de cobrança</label>
              <select
                value={form.billing_cycle}
                onChange={(e) => setForm(f => ({ ...f, billing_cycle: e.target.value as 'per_session' | 'weekly' | 'monthly' }))}
                className={inputCls}
              >
                <option value="per_session">Por sessão</option>
                <option value="weekly">Semanal</option>
                <option value="monthly">Mensal</option>
              </select>
            </div>
          </div>
        ) : (
          <div className="flex gap-8">
            <div>
              <p className="text-xs text-neutral-secondary mb-0.5">Valor por sessão</p>
              <p className="text-lg font-bold text-neutral-charcoal">
                {patient.session_price_cents
                  ? `R$ ${priceDisplay}`
                  : <span className="text-sm font-normal text-neutral-secondary">Padrão (R$ {priceDisplay})</span>
                }
              </p>
            </div>
            <div>
              <p className="text-xs text-neutral-secondary mb-0.5">Ciclo</p>
              <p className="text-sm font-medium text-neutral-charcoal">
                {patient.billing_cycle
                  ? billingDisplay
                  : <span className="text-neutral-secondary">Padrão ({billingDisplay})</span>
                }
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

function InfoField({
  label,
  value,
  icon,
}: {
  label: string
  value: React.ReactNode
  icon?: React.ReactNode
}) {
  return (
    <div>
      <label className="flex items-center gap-1 text-xs font-medium text-neutral-secondary mb-1.5">
        {icon}
        {label}
      </label>
      {typeof value === 'string' ? (
        <p className="text-sm text-neutral-charcoal">{value}</p>
      ) : value}
    </div>
  )
}

const inputCls = 'w-full px-3.5 py-2 rounded-input border border-neutral-border bg-white text-sm text-neutral-charcoal placeholder:text-neutral-secondary/60 focus:outline-none focus:ring-2 focus:ring-brand-teal focus:ring-offset-1 transition-all'
