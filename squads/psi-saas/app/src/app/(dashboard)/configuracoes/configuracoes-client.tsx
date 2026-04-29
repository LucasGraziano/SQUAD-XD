'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Shield, CreditCard, Save, Check, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Reveal } from '@/components/ui/motion'

type Psy = {
  id: string
  full_name: string
  crp: string
  email: string
  phone: string | null
  bio: string | null
  theoretical_orientation: string | null
  session_duration_minutes: number
  session_price_cents: number
  billing_cycle: string
  timezone: string
}

interface Props { psy: Psy | null }

const BILLING_OPTIONS = [
  { value: 'per_session', label: 'Por sessão' },
  { value: 'weekly',      label: 'Semanal' },
  { value: 'monthly',     label: 'Mensal' },
]

const supabase = createClient()

export function ConfiguracoesClient({ psy }: Props) {
  const [form, setForm] = useState({
    full_name: psy?.full_name ?? '',
    crp: psy?.crp ?? '',
    phone: psy?.phone ?? '',
    bio: psy?.bio ?? '',
    theoretical_orientation: psy?.theoretical_orientation ?? '',
    session_duration_minutes: psy?.session_duration_minutes ?? 50,
    session_price_cents: psy?.session_price_cents ?? 20000,
    billing_cycle: psy?.billing_cycle ?? 'per_session',
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const field = (key: keyof typeof form) => ({
    value: String(form[key] ?? ''),
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(prev => ({ ...prev, [key]: e.target.value })),
  })

  async function save() {
    if (!psy) {
      setSaveError('Perfil não encontrado. Recarregue a página ou entre em contato com o suporte.')
      return
    }
    setSaving(true)
    setSaveError(null)
    try {
      const { error } = await supabase
        .from('psychologists')
        .update({
          full_name: form.full_name,
          crp: form.crp,
          phone: form.phone || null,
          bio: form.bio || null,
          theoretical_orientation: form.theoretical_orientation || null,
          session_duration_minutes: form.session_duration_minutes,
          session_price_cents: form.session_price_cents,
          billing_cycle: form.billing_cycle as 'per_session' | 'weekly' | 'monthly',
        })
        .eq('id', psy.id)

      if (error) {
        setSaveError(`Erro ao salvar: ${error.message}`)
        return
      }
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (e) {
      setSaveError('Erro de conexão. Tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  if (!psy) {
    return (
      <main className="flex-1 p-6 max-w-2xl">
        <div className="card-vinculo p-6 border-semantic-danger/20 bg-semantic-danger-bg">
          <p className="text-sm font-semibold text-semantic-danger mb-1">Perfil não encontrado</p>
          <p className="text-xs text-semantic-danger/80">
            Seu registro de psicóloga não foi localizado. Isso pode indicar que o cadastro está incompleto.
            Entre em contato com o suporte ou tente fazer logout e login novamente.
          </p>
          <p className="text-xs text-neutral-secondary mt-3">
            <span className="font-mono">DEBUG: getPsychologist() retornou null</span>
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="flex-1 p-6 max-w-2xl space-y-6">

      {/* Profile */}
      <Reveal>
        <div className="card-vinculo p-6 space-y-5">
          <div className="flex items-center gap-2 mb-1">
            <User size={16} strokeWidth={1.5} className="text-brand-teal" />
            <h2 className="text-sm font-semibold text-neutral-charcoal">Perfil profissional</h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 md:col-span-1">
              <label className="block text-xs font-semibold text-neutral-charcoal mb-1.5">Nome completo</label>
              <input {...field('full_name')}
                className="w-full px-3.5 py-2.5 rounded-input border border-neutral-border bg-white text-sm focus:outline-none focus:ring-1 focus:ring-brand-teal" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-charcoal mb-1.5">CRP</label>
              <input {...field('crp')} placeholder="06/00000"
                className="w-full px-3.5 py-2.5 rounded-input border border-neutral-border bg-white text-sm focus:outline-none focus:ring-1 focus:ring-brand-teal" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-charcoal mb-1.5">E-mail</label>
              <input value={psy.email} readOnly
                className="w-full px-3.5 py-2.5 rounded-input border border-neutral-border bg-neutral-mist text-sm text-neutral-secondary cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-charcoal mb-1.5">Telefone</label>
              <input {...field('phone')} placeholder="(11) 99999-9999"
                className="w-full px-3.5 py-2.5 rounded-input border border-neutral-border bg-white text-sm focus:outline-none focus:ring-1 focus:ring-brand-teal" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-neutral-charcoal mb-1.5">Orientação teórica</label>
              <input {...field('theoretical_orientation')} placeholder="Ex.: TCC, Psicanálise, Humanista..."
                className="w-full px-3.5 py-2.5 rounded-input border border-neutral-border bg-white text-sm focus:outline-none focus:ring-1 focus:ring-brand-teal" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-neutral-charcoal mb-1.5">Bio (opcional)</label>
              <textarea {...field('bio')} rows={3} placeholder="Apresentação breve..."
                className="w-full px-3.5 py-2.5 rounded-input border border-neutral-border bg-white text-sm focus:outline-none focus:ring-1 focus:ring-brand-teal resize-none" />
            </div>
          </div>
        </div>
      </Reveal>

      {/* Session defaults */}
      <Reveal delay={0.08}>
        <div className="card-vinculo p-6 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <CreditCard size={16} strokeWidth={1.5} className="text-brand-teal" />
            <h2 className="text-sm font-semibold text-neutral-charcoal">Sessões e cobrança</h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-charcoal mb-1.5">Duração padrão (min)</label>
              <input
                type="number"
                value={form.session_duration_minutes}
                onChange={e => setForm(prev => ({ ...prev, session_duration_minutes: Number(e.target.value) }))}
                min={30} max={120} step={10}
                className="w-full px-3.5 py-2.5 rounded-input border border-neutral-border bg-white text-sm focus:outline-none focus:ring-1 focus:ring-brand-teal"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-charcoal mb-1.5">Valor padrão (R$)</label>
              <input
                type="number"
                value={form.session_price_cents / 100}
                onChange={e => setForm(prev => ({ ...prev, session_price_cents: Math.round(Number(e.target.value) * 100) }))}
                min={0} step={10}
                className="w-full px-3.5 py-2.5 rounded-input border border-neutral-border bg-white text-sm focus:outline-none focus:ring-1 focus:ring-brand-teal"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-neutral-charcoal mb-2">Ciclo de cobrança</label>
              <div className="flex gap-2">
                {BILLING_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setForm(prev => ({ ...prev, billing_cycle: opt.value }))}
                    className={`flex-1 py-2 rounded-input text-xs font-medium border transition-all ${
                      form.billing_cycle === opt.value
                        ? 'bg-brand-teal text-white border-brand-teal'
                        : 'border-neutral-border text-neutral-secondary hover:border-brand-teal/40'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Privacy */}
      <Reveal delay={0.12}>
        <div className="card-vinculo p-5">
          <div className="flex items-center gap-2 mb-3">
            <Shield size={16} strokeWidth={1.5} className="text-brand-teal" />
            <h2 className="text-sm font-semibold text-neutral-charcoal">Privacidade e segurança</h2>
          </div>
          <div className="space-y-3 text-xs text-neutral-secondary leading-relaxed">
            <p>
              <span className="font-semibold text-neutral-charcoal">Criptografia de notas:</span>{' '}
              Todas as notas clínicas são criptografadas com AES-256-GCM antes de sair do seu dispositivo.
              O Vínculo nunca tem acesso ao conteúdo das suas anotações.
            </p>
            <p>
              <span className="font-semibold text-neutral-charcoal">Retenção de dados:</span>{' '}
              Em conformidade com CFP Res. 001/2009, dados clínicos são retidos por 20 anos.
              A exclusão de conta remove apenas dados pessoais — dados clínicos são anonimizados.
            </p>
            <p>
              <span className="font-semibold text-neutral-charcoal">LGPD:</span>{' '}
              Você pode solicitar exportação ou exclusão dos seus dados em qualquer momento pelo suporte.
            </p>
          </div>
        </div>
      </Reveal>

      {/* Save button */}
      <div className="flex flex-col items-end gap-2">
        {saveError && (
          <p className="flex items-center gap-1.5 text-xs text-semantic-danger">
            <AlertCircle size={13} />
            {saveError}
          </p>
        )}
        <motion.button
          onClick={save}
          disabled={saving}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-input text-sm font-semibold transition-all ${
            saved
              ? 'bg-semantic-success text-white'
              : 'bg-brand-teal text-white hover:bg-brand-teal-dark'
          } disabled:opacity-50`}
        >
          {saved ? <Check size={15} /> : <Save size={15} />}
          {saving ? 'Salvando...' : saved ? 'Salvo!' : 'Salvar alterações'}
        </motion.button>
      </div>

    </main>
  )
}
