'use client'

import { useState, useMemo } from 'react'
import { Plus, Phone, MapPin, MessageSquare, Video, Check, Trash2, Calendar, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toggleEventDone, deleteCalendarEvent, type CalendarEvent, type EventType } from '@/app/actions/calendar'
import { NewEventModal } from './NewEventModal'

const TYPE_META: Record<EventType, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  followup:  { label: 'Follow-up', icon: MessageSquare, color: '#6366F1', bg: 'rgba(99,102,241,0.08)' },
  call:      { label: 'Ligação',   icon: Phone,         color: '#0891B2', bg: 'rgba(8,145,178,0.08)'   },
  meeting:   { label: 'Reunião',   icon: Video,         color: '#059669', bg: 'rgba(5,150,105,0.08)'   },
  visit:     { label: 'Visita',    icon: MapPin,        color: '#D97706', bg: 'rgba(217,119,6,0.08)'   },
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

function formatDateLabel(iso: string) {
  const date = new Date(iso)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const d = date.toDateString()
  if (d === today.toDateString()) return 'Hoje'
  if (d === tomorrow.toDateString()) return 'Amanhã'

  return date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })
}

function groupByDay(events: CalendarEvent[]) {
  const groups: Record<string, CalendarEvent[]> = {}
  for (const ev of events) {
    const key = new Date(ev.scheduled_at).toDateString()
    if (!groups[key]) groups[key] = []
    groups[key].push(ev)
  }
  return groups
}

function EventRow({ event, onToggle, onDelete, onEdit }: {
  event: CalendarEvent
  onToggle: (id: string, done: boolean) => void
  onDelete: (id: string) => void
  onEdit: (event: CalendarEvent) => void
}) {
  const meta = TYPE_META[event.event_type]
  const Icon = meta.icon

  return (
    <div className={`flex items-center gap-3 p-3 rounded-[8px] border transition-all ${
      event.is_done
        ? 'border-[#F3F4F6] bg-[#FAFAFA] opacity-60'
        : 'border-[#E5E5E5] bg-white hover:border-[#D1D1D1]'
    }`}>
      {/* Done toggle */}
      <button
        onClick={() => onToggle(event.id, !event.is_done)}
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
          event.is_done
            ? 'border-[#0BD904] bg-[#0BD904]'
            : 'border-[#D1D1D1] hover:border-[#0BD904]'
        }`}
      >
        {event.is_done && <Check size={11} className="text-white" strokeWidth={3} />}
      </button>

      {/* Type icon */}
      <div
        className="w-8 h-8 rounded-[6px] flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: meta.bg }}
      >
        <Icon size={14} style={{ color: meta.color }} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`text-[14px] font-medium truncate ${event.is_done ? 'line-through text-[#9CA3AF]' : 'text-[#0D0D0D]'}`}>
          {event.title}
        </p>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          <span className="text-[12px] text-[#6B7280]">{formatTime(event.scheduled_at)}</span>
          {event.duration_minutes > 0 && (
            <span className="text-[12px] text-[#9CA3AF]">· {event.duration_minutes}min</span>
          )}
          {event.clients?.name && (
            <span className="text-[12px] text-[#6366F1] truncate">· {event.clients.name}</span>
          )}
          {event.notes && (
            <span className="text-[12px] text-[#9CA3AF] truncate max-w-[160px]" title={event.notes}>
              · {event.notes}
            </span>
          )}
          {event.google_event_id && (
            <span className="text-[10px] text-[#059669] flex items-center gap-0.5">
              <Calendar size={9} />
              Google
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {!event.is_done && (
          <button
            onClick={() => onEdit(event)}
            className="p-1.5 rounded text-[#9CA3AF] hover:text-[#6366F1] hover:bg-[rgba(99,102,241,0.08)] transition-colors"
            title="Editar"
          >
            <Pencil size={13} />
          </button>
        )}
        <button
          onClick={() => onDelete(event.id)}
          className="p-1.5 rounded text-[#9CA3AF] hover:text-[#EF4444] hover:bg-[#FEF2F2] transition-colors"
          title="Excluir"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  )
}

interface Props {
  initialEvents: CalendarEvent[]
  googleConnected: boolean
  googleEmail: string | null
}

export function AgendaClient({ initialEvents, googleConnected, googleEmail }: Props) {
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null)
  const [filter, setFilter] = useState<'pending' | 'done'>('pending')

  const filtered = useMemo(() => {
    return events.filter(e => filter === 'pending' ? !e.is_done : e.is_done)
  }, [events, filter])

  const grouped = useMemo(() => groupByDay(filtered), [filtered])
  const dayKeys = Object.keys(grouped).sort((a, b) => new Date(a).getTime() - new Date(b).getTime())

  async function handleToggle(id: string, done: boolean) {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, is_done: done } : e))
    await toggleEventDone(id, done)
  }

  async function handleDelete(id: string) {
    setEvents(prev => prev.filter(e => e.id !== id))
    await deleteCalendarEvent(id)
  }

  function handleCreated(event: CalendarEvent) {
    setEvents(prev => [...prev, event].sort(
      (a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime()
    ))
    setFilter('pending')
  }

  function handleUpdated(updated: CalendarEvent) {
    setEvents(prev =>
      prev.map(e => e.id === updated.id ? updated : e)
          .sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime())
    )
  }

  function openEdit(event: CalendarEvent) {
    setEditingEvent(event)
    setModalOpen(true)
  }

  function handleModalClose(v: boolean) {
    setModalOpen(v)
    if (!v) setEditingEvent(null)
  }

  const pendingCount = events.filter(e => !e.is_done).length
  const doneCount = events.filter(e => e.is_done).length

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-1 bg-[#F3F4F6] rounded-[8px] p-1">
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1.5 rounded-[6px] text-[13px] font-medium transition-colors ${
              filter === 'pending' ? 'bg-white text-[#0D0D0D] shadow-sm' : 'text-[#6B7280] hover:text-[#0D0D0D]'
            }`}
          >
            Pendentes {pendingCount > 0 && (
              <span className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full bg-[rgba(11,217,4,0.15)] text-[#0BD904] text-[10px] font-bold">
                {pendingCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setFilter('done')}
            className={`px-3 py-1.5 rounded-[6px] text-[13px] font-medium transition-colors ${
              filter === 'done' ? 'bg-white text-[#0D0D0D] shadow-sm' : 'text-[#6B7280] hover:text-[#0D0D0D]'
            }`}
          >
            Concluídas {doneCount > 0 && (
              <span className="ml-1 text-[#9CA3AF] text-[12px]">({doneCount})</span>
            )}
          </button>
        </div>

        <div className="flex items-center gap-3">
          {googleConnected && googleEmail && (
            <span className="text-[12px] text-[#6B7280] flex items-center gap-1.5">
              <Calendar size={12} className="text-[#0BD904]" />
              Google: {googleEmail}
            </span>
          )}
          <Button size="sm" onClick={() => { setEditingEvent(null); setModalOpen(true) }}>
            <Plus size={14} className="mr-1.5" />
            Nova atividade
          </Button>
        </div>
      </div>

      {dayKeys.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-12 h-12 rounded-full bg-[#F3F4F6] flex items-center justify-center mb-4">
            <Calendar size={20} className="text-[#9CA3AF]" />
          </div>
          <p className="text-[14px] font-medium text-[#6B7280] mb-1">
            {filter === 'pending' ? 'Nenhuma atividade pendente' : 'Nenhuma atividade concluída'}
          </p>
          {filter === 'pending' && (
            <p className="text-[13px] text-[#9CA3AF] mb-4">
              Crie follow-ups, ligações e reuniões para organizar sua agenda.
            </p>
          )}
          {filter === 'pending' && (
            <Button size="sm" onClick={() => { setEditingEvent(null); setModalOpen(true) }}>
              <Plus size={14} className="mr-1.5" />
              Nova atividade
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {dayKeys.map(dayKey => (
            <div key={dayKey}>
              <p className="text-[13px] font-semibold text-[#6B7280] mb-2 capitalize">
                {formatDateLabel(grouped[dayKey][0].scheduled_at)}
              </p>
              <div className="space-y-2">
                {grouped[dayKey].map(event => (
                  <EventRow
                    key={event.id}
                    event={event}
                    onToggle={handleToggle}
                    onDelete={handleDelete}
                    onEdit={openEdit}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <NewEventModal
        open={modalOpen}
        onOpenChange={handleModalClose}
        onCreated={handleCreated}
        onUpdated={handleUpdated}
        googleConnected={googleConnected}
        editingEvent={editingEvent}
      />
    </>
  )
}
