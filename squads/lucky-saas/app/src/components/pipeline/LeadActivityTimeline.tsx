import { MessageSquare, ArrowRight, Plus } from 'lucide-react'
import type { LeadActivity } from '@/types/lead'
import { PIPELINE_COLUMNS } from '@/types/lead'

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}

function statusLabel(status: string) {
  return PIPELINE_COLUMNS.find(c => c.status === status)?.label ?? status
}

interface Props {
  activities: LeadActivity[]
}

export function LeadActivityTimeline({ activities }: Props) {
  if (activities.length === 0) {
    return (
      <p className="text-[13px] text-[#9CA3AF] py-4 text-center">Nenhuma atividade registrada.</p>
    )
  }

  return (
    <div className="space-y-3">
      {activities.map((activity) => (
        <div key={activity.id} className="flex gap-3 items-start">
          <div className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center bg-[#F4F4F4]">
            {activity.type === 'note' || activity.type === 'contact'
              ? <MessageSquare size={12} className="text-[#6B7280]" />
              : activity.content === 'Lead criado'
              ? <Plus size={12} className="text-[#0BD904]" />
              : <ArrowRight size={12} className="text-[#6B7280]" />
            }
          </div>
          <div className="flex-1 min-w-0">
            {activity.type === 'status_change' ? (
              <p className="text-[13px] text-[#0D0D0D]">
                {activity.content === 'Lead criado'
                  ? 'Lead criado'
                  : <>Movido para <span className="font-medium">{statusLabel(activity.content)}</span></>
                }
              </p>
            ) : (
              <p className="text-[13px] text-[#0D0D0D] break-words">{activity.content}</p>
            )}
            <p className="text-[11px] text-[#9CA3AF] mt-0.5">{formatDate(activity.created_at)}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
