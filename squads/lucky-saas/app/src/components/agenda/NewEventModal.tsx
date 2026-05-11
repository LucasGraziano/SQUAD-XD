'use client'

import { useState, useEffect } from 'react'
import { X, Calendar, Phone, MapPin, MessageSquare, Video } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createCalendarEvent, updateCalendarEvent, type EventType, type CalendarEvent } from '@/app/actions/calendar'
import { searchClients } from '@/app/(dashboard)/apolices/actions'
import type { Client } from '@/types/client'

const EVENT_TYPES: { value: EventType; label: string; icon: React.ElementType }[] = [
  { value: 'followup', label: 'Follow-up', icon: MessageSquare },
  { value: 'call', label: 'Ligação', icon: Phone },
  { value: 'meeting', label: 'Reunião', icon: Video },
  { value: 'visit', label: 'Visita', icon: MapPin },
]

const DURATIONS = [
  { value: 15, label: '15 min' },
  { value: 30, label: '30 min' },
  { value: 45, label: '45 min' },
  { value: 60, label: '1 hora' },
  { value: 90, label: '1h30' },
  { value: 120, label: '2 horas' },
]

function toLocalDatetimeString(date: Date) {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

interface Props {
  open: boolean
  onOpenChange: (v: boolean) => void
  onCreated: (event: CalendarEvent) => void
  onUpdated?: (event: CalendarEvent) => void
  googleConnected: boolean
  defaultDate?: string
  editingEvent?: CalendarEvent | null
}

export function NewEventModal({
  open,
  onOpenChange,
  onCreated,
  onUpdated,
  googleConnected,
  defaultDate,
  editingEvent,
}: Props) {
  const isEdit = !!editingEvent

  const [title, setTitle] = useState('')
  const [type, setType] = useState<EventType>('followup')
  const [scheduledAt, setScheduledAt] = useState('')
  const [duration, setDuration] = useState(30)
  const [notes, setNotes] = useState('')
  const [syncGoogle, setSyncGoogle] = useState(googleConnected)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [clientQuery, setClientQuery] = useState('')
  const [clientResults, setClientResults] = useState<Client[]>([])
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [clientSearchOpen, setClientSearchOpen] = useState(false)
  const [clientSearching, setClientSearching] = useState(false)

  useEffect(() => {
    if (open) {
      if (editingEvent) {
        setTitle(editingEvent.title)
        setType(editingEvent.event_type)
        setScheduledAt(toLocalDatetimeString(new Date(editingEvent.scheduled_at)))
        setDuration(editingEvent.duration_minutes)
        setNotes(editingEvent.notes ?? '')
        setSyncGoogle(false)
        if (editingEvent.clients?.name) {
          setSelectedClient({
            id: editingEvent.client_id!,
            name: editingEvent.clients.name,
            phone: editingEvent.clients.phone ?? null,
          } as Client)
        } else {
          setSelectedClient(null)
        }
      } else {
        const now = new Date()
        now.setMinutes(Math.ceil(now.getMinutes() / 15) * 15, 0, 0)
        setScheduledAt(defaultDate ?? toLocalDatetimeString(now))
        setTitle('')
        setType('followup')
        setDuration(30)
        setNotes('')
        setSelectedClient(null)
        setSyncGoogle(googleConnected)
      }
      setClientQuery('')
      setError(null)
    }
  }, [open, defaultDate, googleConnected, editingEvent])

  useEffect(() => {
    if (!clientQuery.trim()) { setClientResults([]); setClientSearchOpen(false); return }
    const t = setTimeout(async () => {
      setClientSearching(true)
      const results = await searchClients(clientQuery)
      setClientResults(results)
      setClientSearchOpen(true)
      setClientSearching(false)
    }, 300)
    return () => clearTimeout(t)
  }, [clientQuery])

  async function handleSave() {
    if (!title.trim()) { setError('Título é obrigatório'); return }
    if (!scheduledAt) { setError('Data e hora são obrigatórias'); return }

    setSaving(true)
    setError(null)

    if (isEdit && editingEvent) {
      const { error: err } = await updateCalendarEvent(editingEvent.id, {
        title: title.trim(),
        event_type: type,
        scheduled_at: new Date(scheduledAt).toISOString(),
        duration_minutes: duration,
        client_id: selectedClient?.id ?? null,
        notes: notes.trim() || null,
      })
      setSaving(false)
      if (err) { setError(err); return }
      onUpdated?.({
        ...editingEvent,
        title: title.trim(),
        event_type: type,
        scheduled_at: new Date(scheduledAt).toISOString(),
        duration_minutes: duration,
        client_id: selectedClient?.id ?? null,
        notes: notes.trim() || null,
        clients: selectedClient
          ? { name: selectedClient.name, phone: selectedClient.phone ?? null }
          : null,
      })
      onOpenChange(false)
    } else {
      const result = await createCalendarEvent({
        title: title.trim(),
        event_type: type,
        scheduled_at: new Date(scheduledAt).toISOString(),
        duration_minutes: duration,
        client_id: selectedClient?.id ?? null,
        notes: notes.trim() || null,
        sync_google: syncGoogle && googleConnected,
      })
      setSaving(false)
      if (result.error) { setError(result.error); return }
      onCreated(result.data!)
      onOpenChange(false)
    }
  }

  if (!open) return null

  const inputCls = "h-10 w-full rounded-[6px] border border-[#D1D1D1] bg-white px-3 text-[14px] outline-none focus:border-[#0BD904] focus:shadow-[0_0_0_3px_rgba(11,217,4,0.12)] transition-colors"
  const labelCls = "block text-[12px] font-medium text-[#6B7280] mb-1.5"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={() => onOpenChange(false)} />
      <div className="relative bg-white rounded-[12px] shadow-2xl w-full max-w-[480px] mx-4 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F3F4F6]">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-[#0BD904]" />
            <p className="text-[15px] font-semibold text-[#0D0D0D]">
              {isEdit ? 'Editar Atividade' : 'Nova Atividade'}
            </p>
          </div>
          <button onClick={() => onOpenChange(false)} className="p-1 rounded text-[#9CA3AF] hover:text-[#0D0D0D] transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {/* Título */}
          <div>
            <label className={labelCls}>Título *</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Ex: Follow-up renovação João Silva"
              className={inputCls}
              autoFocus
            />
          </div>

          {/* Tipo */}
          <div>
            <label className={labelCls}>Tipo</label>
            <div className="grid grid-cols-4 gap-2">
              {EVENT_TYPES.map(t => {
                const Icon = t.icon
                const active = type === t.value
                return (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setType(t.value)}
                    className={`flex flex-col items-center gap-1 p-2.5 rounded-[6px] border text-center transition-all ${
                      active
                        ? 'border-[#0BD904] bg-[rgba(11,217,4,0.06)] text-[#0BD904]'
                        : 'border-[#E5E5E5] text-[#6B7280] hover:border-[#0BD904]'
                    }`}
                  >
                    <Icon size={15} />
                    <span className="text-[11px] font-medium">{t.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Data e hora + duração */}
          <div className="grid grid-cols-5 gap-3">
            <div className="col-span-3">
              <label className={labelCls}>Data e hora *</label>
              <input
                type="datetime-local"
                value={scheduledAt}
                onChange={e => setScheduledAt(e.target.value)}
                className={inputCls}
              />
            </div>
            <div className="col-span-2">
              <label className={labelCls}>Duração</label>
              <select
                value={duration}
                onChange={e => setDuration(Number(e.target.value))}
                className={inputCls}
              >
                {DURATIONS.map(d => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Cliente */}
          <div className="relative">
            <label className={labelCls}>Cliente (opcional)</label>
            {selectedClient ? (
              <div className="flex items-center justify-between h-10 rounded-[6px] border border-[#0BD904] bg-[rgba(11,217,4,0.05)] px-3">
                <span className="text-[14px] font-medium text-[#0D0D0D]">{selectedClient.name}</span>
                <button
                  type="button"
                  onClick={() => { setSelectedClient(null); setClientQuery('') }}
                  className="text-[#9CA3AF] hover:text-[#0D0D0D]"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div className="relative">
                <input
                  type="text"
                  value={clientQuery}
                  onChange={e => setClientQuery(e.target.value)}
                  placeholder="Buscar cliente..."
                  className={inputCls}
                />
                {clientSearchOpen && (
                  <div className="absolute top-[42px] left-0 right-0 z-20 bg-white border border-[#E5E5E5] rounded-[8px] shadow-lg overflow-hidden">
                    {clientSearching && <div className="px-4 py-3 text-[13px] text-[#9CA3AF]">Buscando...</div>}
                    {!clientSearching && clientResults.length === 0 && (
                      <div className="px-4 py-3 text-[13px] text-[#9CA3AF]">Nenhum cliente encontrado.</div>
                    )}
                    {clientResults.map(c => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => { setSelectedClient(c); setClientQuery(''); setClientSearchOpen(false) }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#F8F8F8] text-left"
                      >
                        <div className="w-7 h-7 rounded-full bg-[#F3F4F6] flex items-center justify-center flex-shrink-0 text-[12px] font-bold text-[#6B7280]">
                          {c.name[0]}
                        </div>
                        <div>
                          <p className="text-[13px] font-medium text-[#0D0D0D]">{c.name}</p>
                          <p className="text-[11px] text-[#9CA3AF]">{c.phone}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Notas */}
          <div>
            <label className={labelCls}>Notas (opcional)</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Assunto da ligação, pauta da reunião..."
              rows={3}
              className="w-full rounded-[6px] border border-[#D1D1D1] bg-white px-3 py-2 text-[14px] outline-none focus:border-[#0BD904] transition-colors resize-none"
            />
          </div>

          {/* Google Calendar sync — apenas no modo criação */}
          {!isEdit && googleConnected && (
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={syncGoogle}
                onChange={e => setSyncGoogle(e.target.checked)}
                className="w-4 h-4 accent-[#0BD904]"
              />
              <span className="text-[13px] text-[#0D0D0D]">Sincronizar com Google Calendar</span>
            </label>
          )}

          {isEdit && editingEvent?.google_event_id && (
            <p className="text-[12px] text-[#059669] flex items-center gap-1.5">
              <Calendar size={12} />
              Evento sincronizado — alterações serão refletidas no Google Calendar
            </p>
          )}

          {error && (
            <p className="text-[12px] text-[#EF4444] bg-[#FEF2F2] rounded-[6px] px-3 py-2">{error}</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#F3F4F6]">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Salvando...' : isEdit ? 'Salvar alterações' : 'Criar atividade'}
          </Button>
        </div>
      </div>
    </div>
  )
}
