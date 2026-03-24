import Link from 'next/link'
import { Agent } from '@/data/agents'

const tierColors = {
  core: 'border-coral/30 hover:border-coral/60',
  commander: 'border-gold/30 hover:border-gold/60',
  chief: 'border-menta/30 hover:border-menta/60',
  specialist: 'border-surface-500 hover:border-text-muted',
}

const tierBadge = {
  core: { bg: 'bg-coral/10 text-coral', label: 'Core' },
  commander: { bg: 'bg-gold/10 text-gold', label: 'T1 Commander' },
  chief: { bg: 'bg-menta/10 text-menta', label: 'T2 Chief' },
  specialist: { bg: 'bg-surface-500 text-text-secondary', label: 'T3 Specialist' },
}

export default function AgentCard({ agent, basePath }: { agent: Agent; basePath: string }) {
  const colors = tierColors[agent.tier]
  const badge = tierBadge[agent.tier]

  return (
    <Link
      href={`${basePath}${agent.id}/`}
      className={`block p-5 rounded-xl bg-surface-800 border ${colors} card-hover`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{agent.icon}</span>
          <div>
            <h3 className="font-semibold text-text-primary text-sm">{agent.name}</h3>
            <p className="text-xs text-text-muted">{agent.title}</p>
          </div>
        </div>
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${badge.bg}`}>
          {badge.label}
        </span>
      </div>
      <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
        {agent.role}
      </p>
      {agent.department && (
        <div className="mt-3 pt-3 border-t border-surface-600">
          <span className="text-[10px] text-text-muted uppercase tracking-wider">
            {agent.department}
          </span>
        </div>
      )}
      <div className="mt-3 flex items-center gap-1.5">
        <code className="text-[10px] font-mono text-coral bg-coral/5 px-1.5 py-0.5 rounded">
          @{agent.id}
        </code>
      </div>
    </Link>
  )
}
