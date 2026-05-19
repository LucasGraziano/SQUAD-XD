'use client'

import { useState } from 'react'
import { Mail, Send, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toggleRenewalEmails, updateRenewalEmailText, getEmailCampaignLogs } from '@/app/actions/email-campaigns'
import { cn } from '@/lib/utils/cn'

type LogEntry = {
  id: string
  campaign_type: string
  sent_at: string
  status: string
  error_message: string | null
  policies: { ramo: string; seguradora: string } | null
  clients: { name: string; email: string | null } | null
}

const CAMPAIGN_LABELS: Record<string, string> = {
  renewal_60d: '60 dias antes',
  renewal_30d: '30 dias antes',
  renewal_15d: '15 dias antes',
}

interface Props {
  initialEnabled: boolean
  initialCustomText: string
}

export function RenewalEmailSection({ initialEnabled, initialCustomText }: Props) {
  const [enabled, setEnabled] = useState(initialEnabled)
  const [customText, setCustomText] = useState(initialCustomText)
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [showLogs, setShowLogs] = useState(false)
  const [logsLoading, setLogsLoading] = useState(false)
  const [savedText, setSavedText] = useState(false)
  const [toggleSaving, setToggleSaving] = useState(false)
  const [toggleError, setToggleError] = useState<string | null>(null)

  async function handleToggle() {
    const next = !enabled
    setEnabled(next)
    setToggleSaving(true)
    setToggleError(null)
    const result = await toggleRenewalEmails(next)
    setToggleSaving(false)
    if (result?.error) {
      setEnabled(!next) // revert optimistic update
      setToggleError(result.error)
      setTimeout(() => setToggleError(null), 4000)
    }
  }

  async function handleSaveText() {
    setSavedText(false)
    await updateRenewalEmailText(customText)
    setSavedText(true)
    setTimeout(() => setSavedText(false), 2000)
  }

  async function handleShowLogs() {
    if (!showLogs) {
      setLogsLoading(true)
      const data = await getEmailCampaignLogs()
      setLogs(data)
      setLogsLoading(false)
    }
    setShowLogs(v => !v)
  }

  function formatDate(s: string) {
    return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(s))
  }

  return (
    <div className="bg-white rounded-[8px] border border-[#E5E5E5] p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-[6px] bg-[rgba(11,217,4,0.08)] flex items-center justify-center">
            <Mail size={16} className="text-[#0BD904]" />
          </div>
          <div>
            <p className="text-[14px] font-semibold text-[#0D0D0D]">Email Marketing de Renovações</p>
            <p className="text-[12px] text-[#9CA3AF]">Envios automáticos 60, 30 e 15 dias antes do vencimento</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleToggle}
            disabled={toggleSaving}
            className={cn(
              'relative overflow-hidden rounded-full transition-colors flex-shrink-0 disabled:opacity-60',
              enabled ? 'bg-[#0BD904]' : 'bg-[#D1D1D1]'
            )}
            style={{ height: '22px', width: '40px' }}
          >
            <span className={cn(
              'absolute top-[3px] left-0 w-4 h-4 bg-white rounded-full transition-transform',
              enabled ? 'translate-x-[20px]' : 'translate-x-[3px]'
            )} />
          </button>
        </div>
      </div>

      {toggleError && (
        <p className="mb-3 text-[12px] text-[#DC2626] bg-[#FEF2F2] rounded-[6px] px-3 py-2">
          {toggleError}
        </p>
      )}

      {/* Info blocks */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { days: 60, label: '60 dias' },
          { days: 30, label: '30 dias' },
          { days: 15, label: '15 dias' },
        ].map(({ label }) => (
          <div key={label} className="flex items-center gap-2 p-3 rounded-[6px] bg-[#F9FAFB] border border-[#E5E5E5]">
            <Clock size={13} className="text-[#9CA3AF]" />
            <span className="text-[12px] text-[#6B7280]">Disparo {label} antes</span>
          </div>
        ))}
      </div>

      {/* Custom text */}
      <div className="mb-5">
          <label className="block text-[12px] font-semibold text-[#6B7280] uppercase tracking-wide mb-1.5">
            Texto personalizado (abertura do e-mail)
          </label>
          <textarea
            value={customText}
            onChange={e => setCustomText(e.target.value)}
            rows={3}
            placeholder="Deixe em branco para usar o texto padrão..."
            className="w-full px-3 py-2 rounded-[6px] border border-[#D1D1D1] text-[13px] focus:outline-none focus:border-[#0BD904] resize-none"
          />
          <div className="flex items-center justify-between mt-2">
            <p className="text-[11px] text-[#9CA3AF]">
              Aparece antes do resumo da apólice no e-mail.
            </p>
            <Button size="sm" variant="secondary" onClick={handleSaveText}>
              {savedText ? '✓ Salvo' : 'Salvar texto'}
            </Button>
          </div>
        </div>

      {/* Logs */}
      <div className="border-t border-[#E5E5E5] pt-4">
        <button
          onClick={handleShowLogs}
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#6B7280] hover:text-[#0D0D0D] transition-colors"
        >
          <Send size={13} />
          {showLogs ? 'Ocultar' : 'Ver'} histórico de disparos
        </button>

        {showLogs && (
          <div className="mt-3">
            {logsLoading ? (
              <p className="text-[13px] text-[#9CA3AF]">Carregando...</p>
            ) : logs.length === 0 ? (
              <p className="text-[13px] text-[#9CA3AF]">Nenhum e-mail enviado ainda.</p>
            ) : (
              <div className="space-y-1">
                {logs.map(log => (
                  <div key={log.id} className="flex items-center gap-3 py-2 border-b border-[#F3F4F6]">
                    <span className={cn(
                      'w-2 h-2 rounded-full flex-shrink-0',
                      log.status === 'sent' ? 'bg-[#0BD904]' : 'bg-[#DC2626]'
                    )} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-medium text-[#0D0D0D] truncate">
                        {log.clients?.name ?? '—'} · {CAMPAIGN_LABELS[log.campaign_type] ?? log.campaign_type}
                      </p>
                      {log.policies && (
                        <p className="text-[11px] text-[#9CA3AF]">{log.policies.seguradora} · {log.policies.ramo}</p>
                      )}
                    </div>
                    <span className="text-[11px] text-[#9CA3AF] flex-shrink-0">{formatDate(log.sent_at)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
