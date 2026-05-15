import Link from 'next/link'
import { Calendar, Phone, MapPin, MessageSquare, Video } from 'lucide-react'
import type { CalendarEvent, EventType } from '@/app/actions/calendar'

const TYPE_META: Record<EventType, { icon: React.ElementType; color: string }> = {
  followup: { icon: MessageSquare, color: '#6366F1' },
  call:     { icon: Phone,         color: '#0891B2' },
  meeting:  { icon: Video,         color: '#059669' },
  visit:    { icon: MapPin,        color: '#D97706' },
}

function formatEventTime(iso: string) {
  const date = new Date(iso)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const time = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  if (date.toDateString() === today.toDateString()) return `Hoje ${time}`
  if (date.toDateString() === tomorrow.toDateString()) return `Amanhã ${time}`
  return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' }) + ' ' + time
}

interface Props {
  events: CalendarEvent[]
}

export function UpcomingEventsWidget({ events }: Props) {
  return (
    <div className="bg-white rounded-[8px] border border-[#E5E5E5] p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[14px] font-semibold text-[#0D0D0D]">Próximas Atividades</p>
        <Link href="/agenda" className="text-[12px] text-[#0BD904] font-medium hover:underline">
          Ver agenda →
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="py-6 text-center">
          <Calendar size={20} className="text-[#D1D5DB] mx-auto mb-2" />
          <p className="text-[13px] text-[#9CA3AF]">Nenhuma atividade agendada.</p>
          <Link
            href="/agenda"
            className="mt-2 inline-block text-[12px] text-[#0BD904] font-medium hover:underline"
          >
            Criar atividade →
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {events.map(event => {
            const meta = TYPE_META[event.event_type]
            const Icon = meta.icon
            return (
              <Link
                key={event.id}
                href="/agenda"
                className="flex items-center gap-3 p-2.5 rounded-[6px] hover:bg-[#F9FAFB] transition-colors"
              >
                <div
                  className="w-7 h-7 rounded-[6px] flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: meta.color + '14' }}
                >
                  <Icon size={13} style={{ color: meta.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-[#0D0D0D] truncate">{event.title}</p>
                  <p className="text-[11px] text-[#9CA3AF]">
                    {formatEventTime(event.scheduled_at)}
                    {event.clients?.name && ` · ${event.clients.name}`}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
