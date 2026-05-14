'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Bell, Shield, RefreshCw, X, MessageCircle, ChevronRight } from 'lucide-react'
import { dismissAlert } from '@/app/(dashboard)/alertas/actions'
import { cn } from '@/lib/utils/cn'
import { RAMO_LABELS } from '@/types/policy'
import { RenewalButton } from './RenewalButton'
import { EmptyState } from '@/components/ui/EmptyState'

type AlertRow = {
  id: string
  type: string
  title: string
  description: string | null
  scheduled_for: string
  status: string
  created_at: string
  policies: {
    id: string
    ramo: string
    seguradora: string
    end_date: string
    clients: { id: string; name: string; phone: string | null } | null
  } | null
  leads: { id: string; name: string; phone: string | null } | null
}

interface Props {
  pending: AlertRow[]
  dismissed: AlertRow[]
}

function daysFromToday(dateStr: string) {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
}

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(dateStr + 'T12:00:00'))
}

function alertIcon(type: string) {
  if (type.startsWith('renewal')) return Shield
  if (type === 'recovery_reminder') return RefreshCw
  return Bell
}

function alertColor(days: number): { bg: string; badge: string; badgeText: string; icon: string } {
  if (days < 0)  return { bg: 'bg-[#FEF2F2]', badge: 'bg-[#FEE2E2] text-[#DC2626]', badgeText: 'Atrasado', icon: 'text-[#DC2626]' }
  if (days <= 7)  return { bg: 'bg-[#FFFBEB]', badge: 'bg-[#FEF3C7] text-[#D97706]', badgeText: `${days}d`, icon: 'text-[#D97706]' }
  return { bg: 'bg-white', badge: 'bg-[#F3F4F6] text-[#6B7280]', badgeText: `${days}d`, icon: 'text-[#6B7280]' }
}

function AlertCard({ alert, onDismiss }: { alert: AlertRow; onDismiss: (id: string) => void }) {
  const days = daysFromToday(alert.scheduled_for)
  const color = alertColor(days)
  const Icon = alertIcon(alert.type)

  const entityName = alert.policies?.clients?.name ?? alert.leads?.name ?? null
  const entityPhone = alert.policies?.clients?.phone ?? alert.leads?.phone ?? null
  const ramo = alert.policies ? (RAMO_LABELS[alert.policies.ramo] ?? alert.policies.ramo) : null

  return (
    <div className={cn('flex items-start gap-4 rounded-[8px] border border-[#E5E5E5] p-4 transition-colors', color.bg)}>
      {/* Icon */}
      <div className="w-9 h-9 rounded-[8px] bg-white border border-[#E5E5E5] flex items-center justify-center shrink-0">
        <Icon size={16} className={color.icon} strokeWidth={1.5} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[14px] font-semibold text-[#0D0D0D]">{alert.title}</p>
            {entityName && (
              <p className="text-[13px] text-[#6B7280] mt-0.5">
                {entityName}
                {ramo && <span className="ml-1.5 px-1.5 py-0.5 rounded-[3px] bg-[rgba(11,217,4,0.08)] text-[#034001] text-[10px] font-medium">{ramo}</span>}
              </p>
            )}
            {alert.description && !entityName && (
              <p className="text-[13px] text-[#6B7280] mt-0.5">{alert.description}</p>
            )}
          </div>
          <span className={cn('shrink-0 px-2 py-0.5 rounded-[4px] text-[11px] font-bold', color.badge)}>
            {color.badgeText}
          </span>
        </div>

        <div className="flex items-center justify-between mt-2">
          <p className="text-[11px] text-[#9CA3AF]">
            {formatDate(alert.scheduled_for)}
          </p>
          <div className="flex items-center gap-1 flex-wrap">
            {entityPhone && (
              <a
                href={`https://wa.me/55${entityPhone.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2 py-1 rounded-[5px] text-[12px] font-medium text-[#25D366] hover:bg-[rgba(37,211,102,0.08)] transition-colors"
              >
                <MessageCircle size={12} />
                WhatsApp
              </a>
            )}
            {alert.policies && alert.type.startsWith('renewal') && (
              <RenewalButton
                policyId={alert.policies.id}
                hasRenewalQuote={false}
                renewalQuoteId={null}
              />
            )}
            {alert.policies && (
              <Link
                href={`/apolices`}
                className="inline-flex items-center gap-0.5 px-2 py-1 rounded-[5px] text-[12px] font-medium text-[#6B7280] hover:text-[#0D0D0D] hover:bg-[#F3F4F6] transition-colors"
              >
                Ver apólice
                <ChevronRight size={10} />
              </Link>
            )}
            {alert.leads && (
              <Link
                href="/pipeline"
                className="inline-flex items-center gap-0.5 px-2 py-1 rounded-[5px] text-[12px] font-medium text-[#6B7280] hover:text-[#0D0D0D] hover:bg-[#F3F4F6] transition-colors"
              >
                Ver lead
                <ChevronRight size={10} />
              </Link>
            )}
            <button
              onClick={() => onDismiss(alert.id)}
              className="p-1 rounded-[5px] text-[#9CA3AF] hover:text-[#DC2626] hover:bg-[#FEF2F2] transition-colors"
              title="Dispensar alerta"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function AlertasList({ pending: initialPending, dismissed }: Props) {
  const [tab, setTab] = useState<'pending' | 'dismissed'>('pending')
  const [pending, setPending] = useState<AlertRow[]>(initialPending)
  const [, startTransition] = useTransition()

  function handleDismiss(id: string) {
    setPending(prev => prev.filter(a => a.id !== id))
    startTransition(() => {
      dismissAlert(id)
    })
  }

  const overdue = pending.filter(a => daysFromToday(a.scheduled_for) < 0)
  const soon = pending.filter(a => {
    const d = daysFromToday(a.scheduled_for)
    return d >= 0 && d <= 7
  })
  const upcoming = pending.filter(a => daysFromToday(a.scheduled_for) > 7)

  const displayed = tab === 'pending' ? pending : dismissed

  return (
    <div className="flex-1 p-8">
      {/* Tabs */}
      <div className="flex gap-0 border-b border-[#E5E5E5] mb-6">
        {[
          { id: 'pending' as const, label: 'Pendentes', count: pending.length },
          { id: 'dismissed' as const, label: 'Dispensados', count: dismissed.length },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-medium border-b-2 transition-colors',
              tab === t.id
                ? 'border-[#0BD904] text-[#0D0D0D]'
                : 'border-transparent text-[#6B7280] hover:text-[#0D0D0D]'
            )}
          >
            {t.label}
            {t.count > 0 && (
              <span className={cn(
                'px-1.5 py-0.5 rounded-full text-[10px] font-bold',
                tab === t.id ? 'bg-[rgba(11,217,4,0.12)] text-[#034001]' : 'bg-[#F3F4F6] text-[#6B7280]'
              )}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Empty state */}
      {displayed.length === 0 && (
        tab === 'pending' ? (
          <EmptyState
            illustration="alerts"
            title="Nenhum alerta pendente"
            description="O sistema monitora seus vencimentos automaticamente. Adicione apólices para ativar os alertas."
            primaryCta={{ label: 'Ver apólices', href: '/apolices' }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-[14px] text-[#9CA3AF]">Nenhum alerta dispensado.</p>
          </div>
        )
      )}

      {/* Pending — grouped */}
      {tab === 'pending' && pending.length > 0 && (
        <div className="space-y-6 max-w-[760px]">
          {overdue.length > 0 && (
            <div>
              <p className="text-[11px] font-bold text-[#DC2626] uppercase tracking-wider mb-3">Atrasados ({overdue.length})</p>
              <div className="space-y-2">
                {overdue.map(a => <AlertCard key={a.id} alert={a} onDismiss={handleDismiss} />)}
              </div>
            </div>
          )}
          {soon.length > 0 && (
            <div>
              <p className="text-[11px] font-bold text-[#D97706] uppercase tracking-wider mb-3">Próximos 7 dias ({soon.length})</p>
              <div className="space-y-2">
                {soon.map(a => <AlertCard key={a.id} alert={a} onDismiss={handleDismiss} />)}
              </div>
            </div>
          )}
          {upcoming.length > 0 && (
            <div>
              <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-3">Próximos 30 dias ({upcoming.length})</p>
              <div className="space-y-2">
                {upcoming.map(a => <AlertCard key={a.id} alert={a} onDismiss={handleDismiss} />)}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Dismissed list */}
      {tab === 'dismissed' && dismissed.length > 0 && (
        <div className="space-y-2 max-w-[760px]">
          {dismissed.map(a => (
            <div key={a.id} className="flex items-center gap-4 rounded-[8px] border border-[#F0F0F0] p-4 opacity-60">
              <div className="w-8 h-8 rounded-[6px] bg-[#F3F4F6] flex items-center justify-center shrink-0">
                {(() => { const Icon = alertIcon(a.type); return <Icon size={14} className="text-[#9CA3AF]" strokeWidth={1.5} /> })()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-[#6B7280]">{a.title}</p>
                <p className="text-[11px] text-[#9CA3AF]">
                  {a.policies?.clients?.name ?? a.leads?.name ?? ''} · {formatDate(a.scheduled_for)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
