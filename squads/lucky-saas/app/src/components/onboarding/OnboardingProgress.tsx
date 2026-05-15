interface Props {
  completed: number
  total: number
}

export function OnboardingProgress({ completed, total }: Props) {
  const pct = Math.round((completed / total) * 100)

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-semibold text-[#6B7280]">{completed} de {total} concluídos</span>
        <span className="text-[12px] font-bold text-[#0D0D0D]">{pct}%</span>
      </div>
      <div className="h-[6px] w-full rounded-full bg-[#F3F4F6] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            backgroundColor: pct === 100 ? '#0BD904' : pct >= 60 ? '#0BD904' : pct >= 30 ? '#FBBF24' : '#D1D1D1',
          }}
        />
      </div>
    </div>
  )
}
