import { CLAIM_STATUS_COLORS, CLAIM_STATUS_LABELS } from '@/types/claim'
import type { ClaimUpdate } from '@/types/claim'

interface Props {
  updates: ClaimUpdate[]
}

function formatDateTime(iso: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}

export function ClaimTimeline({ updates }: Props) {
  if (updates.length === 0) {
    return <p className="text-[13px] text-[#9CA3AF] py-4 text-center">Nenhum histórico registrado.</p>
  }

  return (
    <div className="relative">
      <div className="absolute left-4 top-0 bottom-0 w-px bg-[#E5E5E5]" />
      <div className="space-y-4">
        {[...updates].reverse().map((u, i) => {
          const color = CLAIM_STATUS_COLORS[u.new_status as keyof typeof CLAIM_STATUS_COLORS] ?? '#9CA3AF'
          const isFirst = i === 0
          return (
            <div key={u.id} className="relative flex gap-4 pl-10">
              <div
                className="absolute left-[10px] top-1 w-[10px] h-[10px] rounded-full border-2 border-white shrink-0"
                style={{ backgroundColor: color, zIndex: 1 }}
              />
              <div className="flex-1 pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span
                      className="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[11px] font-semibold"
                      style={{ backgroundColor: color + '1A', color }}
                    >
                      {CLAIM_STATUS_LABELS[u.new_status as keyof typeof CLAIM_STATUS_LABELS] ?? u.new_status}
                    </span>
                    {u.old_status && (
                      <span className="ml-1.5 text-[11px] text-[#9CA3AF]">
                        (de {CLAIM_STATUS_LABELS[u.old_status as keyof typeof CLAIM_STATUS_LABELS] ?? u.old_status})
                      </span>
                    )}
                    {isFirst && (
                      <span className="ml-2 text-[10px] font-medium bg-[#0D0D0D] text-white px-1.5 py-0.5 rounded-[3px]">
                        Atual
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-[#9CA3AF] shrink-0">{formatDateTime(u.created_at)}</span>
                </div>
                {u.note && (
                  <p className="mt-1 text-[13px] text-[#4B5563] bg-[#F9FAFB] rounded-[6px] px-3 py-2 border border-[#E5E5E5]">
                    {u.note}
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
