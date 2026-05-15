'use client'

import { useState, useEffect } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X, MessageCircle, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LeadActivityTimeline } from './LeadActivityTimeline'
import { moveLead, addNote, fetchLeadActivities, updateRecovery } from '@/app/(dashboard)/pipeline/actions'
import type { Lead, LeadActivity, LeadStatus } from '@/types/lead'
import { PIPELINE_COLUMNS, RAMO_LABELS, SOURCE_LABELS } from '@/types/lead'

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(iso))
}

interface Props {
  lead: Lead | null
  onClose: () => void
  onStatusChange: (leadId: string, newStatus: LeadStatus) => void
}

export function LeadDrawer({ lead, onClose, onStatusChange }: Props) {
  const [activities, setActivities] = useState<LeadActivity[]>([])
  const [loadingActivities, setLoadingActivities] = useState(false)
  const [note, setNote] = useState('')
  const [savingNote, setSavingNote] = useState(false)
  const [movingTo, setMovingTo] = useState<LeadStatus | ''>('')
  const [renewalDate, setRenewalDate] = useState('')
  const [recoveryNotes, setRecoveryNotes] = useState('')
  const [savingRecovery, setSavingRecovery] = useState(false)

  useEffect(() => {
    if (!lead) return
    setMovingTo('')
    setNote('')
    setRenewalDate(lead.expected_renewal_date ?? '')
    setRecoveryNotes(lead.recovery_notes ?? '')
    setLoadingActivities(true)
    fetchLeadActivities(lead.id).then(({ data }) => {
      setActivities(data ?? [])
      setLoadingActivities(false)
    })
  }, [lead?.id])

  async function handleMove(newStatus: LeadStatus) {
    if (!lead || newStatus === lead.status) return
    setMovingTo(newStatus)
    const result = await moveLead(lead.id, newStatus, lead.status)
    if (!result.error) {
      onStatusChange(lead.id, newStatus)
      const { data } = await fetchLeadActivities(lead.id)
      setActivities(data ?? [])
    }
    setMovingTo('')
  }

  async function handleSaveNote() {
    if (!lead || !note.trim()) return
    setSavingNote(true)
    const result = await addNote(lead.id, note.trim())
    if (result.data) {
      setActivities(prev => [result.data as LeadActivity, ...prev])
      setNote('')
    }
    setSavingNote(false)
  }

  async function handleSaveRecovery() {
    if (!lead) return
    setSavingRecovery(true)
    await updateRecovery(lead.id, {
      expected_renewal_date: renewalDate || null,
      recovery_notes: recoveryNotes || null,
    })
    setSavingRecovery(false)
  }

  return (
    <Dialog.Root open={!!lead} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />
        <Dialog.Content
          onInteractOutside={onClose}
          className="fixed right-0 top-0 z-50 h-full w-[400px] max-w-full bg-white shadow-xl flex flex-col focus:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right duration-200"
        >
          {lead && (
            <>
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E5E5]">
                <div className="flex-1 min-w-0 mr-3">
                  <Dialog.Title className="text-[16px] font-semibold text-[#0D0D0D] truncate">
                    {lead.name}
                  </Dialog.Title>
                  {lead.ramo && (
                    <span className="text-[11px] text-[#6B7280]">{RAMO_LABELS[lead.ramo]}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={movingTo || lead.status}
                    onChange={(e) => handleMove(e.target.value as LeadStatus)}
                    className="h-8 rounded-[6px] border border-[#D1D1D1] bg-white px-2 text-[12px] text-[#0D0D0D] outline-none focus:border-[#0BD904] transition-colors cursor-pointer"
                  >
                    {PIPELINE_COLUMNS.map((col) => (
                      <option key={col.status} value={col.status}>{col.label}</option>
                    ))}
                  </select>
                  <Dialog.Close asChild>
                    <button className="p-1.5 rounded-[6px] text-[#6B7280] hover:bg-[#F4F4F4] transition-colors">
                      <X size={16} />
                    </button>
                  </Dialog.Close>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {/* Contact info */}
                <div className="px-5 py-4 border-b border-[#E5E5E5]">
                  <div className="flex items-center gap-3 mb-2">
                    <a
                      href={`https://wa.me/55${lead.phone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[13px] text-[#0D0D0D] hover:text-[#0BD904] transition-colors font-medium"
                    >
                      <MessageCircle size={14} className="text-[#6B7280]" />
                      {lead.phone}
                    </a>
                  </div>
                  {lead.email && (
                    <p className="text-[13px] text-[#6B7280] mb-2">{lead.email}</p>
                  )}
                  <div className="flex flex-wrap gap-3 text-[12px] text-[#6B7280]">
                    {lead.source && (
                      <span>Fonte: <span className="text-[#0D0D0D]">{SOURCE_LABELS[lead.source]}</span></span>
                    )}
                    <span>Entrou em: <span className="text-[#0D0D0D]">{formatDate(lead.created_at)}</span></span>
                  </div>
                </div>

                {/* Quick note */}
                <div className="px-5 py-4 border-b border-[#E5E5E5]">
                  <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-2">Anotação Rápida</p>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Registrar contato, detalhe ou próximo passo..."
                    rows={3}
                    className="w-full rounded-[6px] border border-[#D1D1D1] bg-white px-3 py-2.5 text-[13px] text-[#0D0D0D] placeholder:text-[#9CA3AF] outline-none focus:border-[#0BD904] focus:shadow-[0_0_0_3px_rgba(11,217,4,0.12)] transition-colors resize-none"
                  />
                  <Button
                    size="sm"
                    className="mt-2"
                    onClick={handleSaveNote}
                    loading={savingNote}
                    disabled={!note.trim()}
                  >
                    Salvar Anotação
                  </Button>
                </div>

                {/* Recovery section — perdido leads only */}
                {lead.status === 'perdido' && (
                  <div className="px-5 py-4 border-b border-[#E5E5E5] bg-[#FFFBEB]">
                    <p className="text-[11px] font-bold text-[#D97706] uppercase tracking-wider mb-3">Recuperação</p>
                    <div className="space-y-3">
                      <div>
                        <label className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wide block mb-1">
                          Data provável de renovação
                        </label>
                        <input
                          type="date"
                          value={renewalDate}
                          onChange={(e) => setRenewalDate(e.target.value)}
                          className="w-full h-9 rounded-[6px] border border-[#D1D1D1] bg-white px-3 text-[13px] text-[#0D0D0D] outline-none focus:border-[#0BD904] focus:shadow-[0_0_0_3px_rgba(11,217,4,0.12)] transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wide block mb-1">
                          Notas de recuperação
                        </label>
                        <textarea
                          value={recoveryNotes}
                          onChange={(e) => setRecoveryNotes(e.target.value)}
                          placeholder="Ex: cliente renova em julho, prefere WhatsApp..."
                          rows={2}
                          className="w-full rounded-[6px] border border-[#D1D1D1] bg-white px-3 py-2.5 text-[13px] text-[#0D0D0D] placeholder:text-[#9CA3AF] outline-none focus:border-[#0BD904] focus:shadow-[0_0_0_3px_rgba(11,217,4,0.12)] transition-colors resize-none"
                        />
                      </div>
                      <Button
                        size="sm"
                        onClick={handleSaveRecovery}
                        loading={savingRecovery}
                      >
                        Salvar dados de recuperação
                      </Button>
                    </div>
                  </div>
                )}

                {/* History */}
                <div className="px-5 py-4">
                  <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-3">Histórico</p>
                  {loadingActivities
                    ? <p className="text-[13px] text-[#9CA3AF]">Carregando...</p>
                    : <LeadActivityTimeline activities={activities} />
                  }
                </div>
              </div>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
