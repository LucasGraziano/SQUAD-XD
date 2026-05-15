'use client'

import { useState } from 'react'
import { Check, Eye, EyeOff, Calendar, Unlink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PlanGateModal } from '@/components/shared/PlanGateModal'
import { updateBrokerProfile } from '@/app/actions/broker'
import { disconnectGoogleCalendar } from '@/app/actions/calendar'
import { createClient as createBrowserClient } from '@/lib/supabase/client'
import { meetsRequirement } from '@/lib/constants/plan-gates'

const PLAN_LABELS: Record<string, { name: string; price: string; color: string }> = {
  starter: { name: 'Solo', price: 'R$47/mês', color: '#6B7280' },
  pro:     { name: 'Profissional', price: 'R$97/mês', color: '#0BD904' },
  broker:  { name: 'Equipe', price: 'R$197/mês', color: '#6366F1' },
}

interface BrokerData {
  id: string
  name: string
  creci: string | null
  phone: string | null
  susep: string | null
  email: string
  logo_url: string | null
  plan: string
  subscription_status: string | null
  trial_ends_at: string | null
}

interface GoogleCalendarState {
  connected: boolean
  email: string | null
}

interface Props {
  broker: BrokerData
  userEmail: string
  googleCalendar?: GoogleCalendarState
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-[8px] border border-[#E5E5E5] overflow-hidden">
      <div className="px-6 py-4 border-b border-[#E5E5E5]">
        <p className="text-[14px] font-semibold text-[#0D0D0D]">{title}</p>
      </div>
      <div className="p-6">{children}</div>
    </div>
  )
}

function PasswordSection() {
  const [newPwd, setNewPwd] = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')
  const [show, setShow] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleChange() {
    if (newPwd.length < 8) { setError('A senha deve ter pelo menos 8 caracteres'); return }
    if (newPwd !== confirmPwd) { setError('As senhas não coincidem'); return }
    setSaving(true); setError(null)
    const supabase = createBrowserClient()
    const { error: err } = await supabase.auth.updateUser({ password: newPwd })
    setSaving(false)
    if (err) { setError(err.message); return }
    setSaved(true); setNewPwd(''); setConfirmPwd('')
    setTimeout(() => setSaved(false), 3000)
  }

  const inputCls = "h-[42px] w-full rounded-[6px] border border-[#D1D1D1] bg-white px-3 pr-10 text-[14px] outline-none focus:border-[#0BD904] focus:shadow-[0_0_0_3px_rgba(11,217,4,0.12)] transition-colors"

  return (
    <SectionCard title="Segurança">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-[13px] font-medium text-[#0D0D0D] mb-1.5 block">Nova senha</label>
          <div className="relative">
            <input type={show ? 'text' : 'password'} value={newPwd} onChange={e => setNewPwd(e.target.value)} className={inputCls} placeholder="Mínimo 8 caracteres" />
            <button type="button" onClick={() => setShow(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280]">
              {show ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>
        <div>
          <label className="text-[13px] font-medium text-[#0D0D0D] mb-1.5 block">Confirmar senha</label>
          <div className="relative">
            <input type={show ? 'text' : 'password'} value={confirmPwd} onChange={e => setConfirmPwd(e.target.value)} className={inputCls} placeholder="Repita a nova senha" />
          </div>
        </div>
      </div>
      {error && <p className="mt-3 text-[12px] text-[#EF4444] bg-[#FEF2F2] rounded-[6px] px-3 py-2">{error}</p>}
      <div className="mt-4 flex items-center gap-3">
        <Button onClick={handleChange} disabled={saving || !newPwd || !confirmPwd}>
          {saving ? 'Salvando...' : 'Alterar senha'}
        </Button>
        {saved && (
          <span className="inline-flex items-center gap-1.5 text-[13px] text-[#059669]">
            <Check size={14} />
            Senha alterada
          </span>
        )}
      </div>
    </SectionCard>
  )
}

export function ConfiguracoesClient({ broker, userEmail, googleCalendar }: Props) {
  const [name, setName] = useState(broker.name)
  const [creci, setCreci] = useState(broker.creci ?? '')
  const [phone, setPhone] = useState(broker.phone ?? '')
  const [susep, setSusep] = useState(broker.susep ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [googleState, setGoogleState] = useState<GoogleCalendarState>(
    googleCalendar ?? { connected: false, email: null }
  )
  const [disconnecting, setDisconnecting] = useState(false)
  const [showCalendarGate, setShowCalendarGate] = useState(false)

  const canUseCalendar = meetsRequirement(broker.plan, 'broker')

  const planInfo = PLAN_LABELS[broker.plan] ?? { name: broker.plan, price: '—', color: '#6B7280' }

  const isTrial = broker.subscription_status === 'trialing'
  const trialEnd = broker.trial_ends_at
    ? new Intl.DateTimeFormat('pt-BR').format(new Date(broker.trial_ends_at))
    : null

  async function handleSave() {
    if (!name.trim()) { setError('Nome é obrigatório'); return }
    setSaving(true)
    setError(null)
    const { error: err } = await updateBrokerProfile({ name, creci, phone, susep })
    setSaving(false)
    if (err) { setError(err); return }
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const inputCls = "w-full h-10 rounded-[6px] border border-[#D1D1D1] bg-white px-3 text-[14px] text-[#0D0D0D] outline-none focus:border-[#0BD904] transition-colors"
  const labelCls = "block text-[12px] font-medium text-[#6B7280] mb-1.5"

  return (
    <div className="max-w-[600px] space-y-5">
      {/* Minha Conta */}
      <SectionCard title="Minha Conta">
        <div className="space-y-4">
          <div>
            <label className={labelCls}>E-mail (não editável)</label>
            <input
              type="email"
              value={userEmail || broker.email}
              disabled
              className={`${inputCls} bg-[#F9FAFB] text-[#9CA3AF] cursor-not-allowed`}
            />
          </div>
        </div>
      </SectionCard>

      {/* Perfil da Corretora */}
      <SectionCard title="Perfil do Corretor">
        <div className="space-y-4">
          <div>
            <label className={labelCls}>Nome / Razão Social *</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Seu nome ou nome da corretora"
              className={inputCls}
            />
            <p className="text-[11px] text-[#9CA3AF] mt-1">Aparece nas propostas em PDF e no portal do cliente.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>CRECI</label>
              <input
                type="text"
                value={creci}
                onChange={e => setCreci(e.target.value)}
                placeholder="Ex: 12345-F"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>SUSEP</label>
              <input
                type="text"
                value={susep}
                onChange={e => setSusep(e.target.value)}
                placeholder="Ex: 10234567"
                className={inputCls}
              />
              <p className="text-[11px] text-[#9CA3AF] mt-1">Aparece no cabeçalho do PDF de proposta.</p>
            </div>
          </div>
          <div>
            <label className={labelCls}>Telefone / WhatsApp</label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="(11) 99999-9999"
              className={inputCls}
            />
            <p className="text-[11px] text-[#9CA3AF] mt-1">Usado no botão "Falar com corretor" do portal.</p>
          </div>
        </div>

        {error && (
          <p className="mt-3 text-[12px] text-[#EF4444] bg-[#FEF2F2] rounded-[6px] px-3 py-2">{error}</p>
        )}

        <div className="mt-5 flex items-center gap-3">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Salvando...' : 'Salvar alterações'}
          </Button>
          {saved && (
            <span className="inline-flex items-center gap-1.5 text-[13px] text-[#059669]">
              <Check size={14} />
              Salvo com sucesso
            </span>
          )}
        </div>
      </SectionCard>

      {/* Plano */}
      <SectionCard title="Plano e Billing">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="inline-flex items-center px-2.5 py-1 rounded-[6px] text-[13px] font-bold"
                style={{ backgroundColor: planInfo.color + '1A', color: planInfo.color }}
              >
                {planInfo.name}
              </span>
              <span className="text-[13px] text-[#6B7280]">{planInfo.price}</span>
            </div>
            {isTrial && trialEnd && (
              <p className="text-[12px] text-[#D97706] mt-1">
                Trial ativo — expira em {trialEnd}
              </p>
            )}
            {!isTrial && broker.subscription_status === 'active' && (
              <p className="text-[12px] text-[#059669] mt-1">Assinatura ativa</p>
            )}
          </div>
          {broker.plan === 'starter' && (
            <a
              href="mailto:contato@premia.app?subject=Upgrade Premia"
              className="inline-flex items-center justify-center h-9 px-4 rounded-[6px] bg-[#0BD904] text-[#0D0D0D] text-[13px] font-bold hover:bg-[#09c203] transition-colors shrink-0"
            >
              Fazer upgrade
            </a>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-[#F3F4F6]">
          <p className="text-[12px] text-[#9CA3AF] mb-3">Funcionalidades do seu plano:</p>
          <div className="space-y-1.5">
            {[
              { label: 'Pipeline de Leads', included: true },
              { label: 'Gestão de Apólices', included: true },
              { label: 'Central de Alertas', included: true },
              { label: 'Módulo Financeiro', included: true },
              { label: 'Portal do Cliente', included: broker.plan !== 'starter' },
              { label: 'Proposta em PDF', included: broker.plan !== 'starter' },
              { label: 'Sinistro Tracking', included: broker.plan !== 'starter' },
              { label: 'Relatórios + Forecast', included: broker.plan !== 'starter' },
              { label: 'Agenda Google Calendar', included: broker.plan === 'broker' },
              { label: 'WhatsApp Business API', included: broker.plan === 'broker' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-2">
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0 ${
                  item.included ? 'bg-[rgba(11,217,4,0.15)] text-[#0BD904]' : 'bg-[#F3F4F6] text-[#D1D5DB]'
                }`}>
                  {item.included ? '✓' : '—'}
                </span>
                <span className={`text-[13px] ${item.included ? 'text-[#0D0D0D]' : 'text-[#9CA3AF]'}`}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </SectionCard>

      {/* Segurança */}
      <PasswordSection />

      {/* Integrações */}
      <SectionCard title="Integrações">
        <div className="space-y-3">
          {/* Stripe */}
          <div className="flex items-center justify-between py-3 border-b border-[#F3F4F6]">
            <div>
              <p className="text-[13px] font-medium text-[#0D0D0D]">Stripe Billing</p>
              <p className="text-[12px] text-[#9CA3AF]">Pagamentos e gestão de assinatura</p>
            </div>
            <span className="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[11px] font-medium bg-[#F3F4F6] text-[#9CA3AF]">
              Em breve
            </span>
          </div>

          {/* Resend */}
          <div className="flex items-center justify-between py-3 border-b border-[#F3F4F6]">
            <div>
              <p className="text-[13px] font-medium text-[#0D0D0D]">Resend (E-mails)</p>
              <p className="text-[12px] text-[#9CA3AF]">Envio de e-mails automáticos para clientes</p>
            </div>
            <span className="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[11px] font-medium bg-[#F3F4F6] text-[#9CA3AF]">
              Em breve
            </span>
          </div>

          {/* Google Calendar */}
          <div className="flex items-start justify-between py-3">
            <div className="flex items-start gap-2.5">
              <Calendar size={16} className="text-[#6B7280] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-[13px] font-medium text-[#0D0D0D]">Google Calendar</p>
                <p className="text-[12px] text-[#9CA3AF]">Sincronize atividades da agenda com seu Google Calendar</p>
                {googleState.connected && googleState.email && (
                  <p className="text-[12px] text-[#059669] mt-1 flex items-center gap-1">
                    <Check size={11} />
                    Conectado como {googleState.email}
                  </p>
                )}
              </div>
            </div>

            {!canUseCalendar ? (
              <button
                onClick={() => setShowCalendarGate(true)}
                className="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[11px] font-semibold bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E5E7EB] hover:text-[#374151] transition-colors shrink-0 cursor-pointer"
              >
                Plano Equipe →
              </button>
            ) : googleState.connected ? (
              <Button
                variant="ghost"
                size="sm"
                disabled={disconnecting}
                onClick={async () => {
                  setDisconnecting(true)
                  await disconnectGoogleCalendar()
                  setGoogleState({ connected: false, email: null })
                  setDisconnecting(false)
                }}
                className="text-[#EF4444] hover:text-[#EF4444] hover:bg-[#FEF2F2] shrink-0"
              >
                <Unlink size={13} className="mr-1.5" />
                {disconnecting ? 'Desconectando...' : 'Desconectar'}
              </Button>
            ) : (
              <a
                href="/api/google/calendar/auth"
                className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[6px] bg-[#0BD904] text-[#0D0D0D] text-[12px] font-semibold hover:bg-[#09c203] transition-colors shrink-0"
              >
                <Calendar size={13} />
                Conectar
              </a>
            )}
          </div>
        </div>
      </SectionCard>

      <PlanGateModal
        isOpen={showCalendarGate}
        onClose={() => setShowCalendarGate(false)}
        feature="google-calendar"
        featureLabel="Agenda Google Calendar"
        requiredPlan="broker"
        currentPlan={broker.plan}
        anchor="Exclusivo do plano Equipe (R$197/mês)"
        modal="soft"
        upgradeHref="/pricing?highlight=equipe"
      />
    </div>
  )
}
