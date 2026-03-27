'use client'
import { useState, useMemo } from 'react'
import { aioxAgents, lowTicketAgents, allAgents } from '@/data/agents'
import { workflows } from '@/data/workflows'
import { slashCommands, agentCommands } from '@/data/commands'
import { experts, dnaLayers } from '@/data/mega-brain'
import { articles } from '@/data/constitution'

interface SearchResult {
  type: 'agent' | 'workflow' | 'command' | 'expert' | 'article'
  title: string
  subtitle: string
  detail: string
  link?: string
  icon: string
  color: string
}

function buildIndex(): SearchResult[] {
  const results: SearchResult[] = []

  allAgents.forEach(a => {
    results.push({
      type: 'agent',
      title: `@${a.id}`,
      subtitle: `${a.name} — ${a.title}`,
      detail: a.role + (a.commands ? ' | Cmds: ' + a.commands.map(c => c.cmd).join(', ') : ''),
      link: a.system === 'aiox' ? `/aiox/#${a.id}` : `/squads/`,
      icon: a.icon,
      color: a.system === 'aiox' ? 'text-coral' : 'text-gold',
    })
  })

  workflows.forEach(w => {
    results.push({
      type: 'workflow',
      title: w.name,
      subtitle: w.type,
      detail: w.description + ' | When: ' + w.whenToUse,
      link: '/workflows/',
      icon: '🔄',
      color: 'text-menta',
    })
  })

  slashCommands.forEach(c => {
    results.push({
      type: 'command',
      title: c.name,
      subtitle: c.category,
      detail: c.description + ' | Usage: ' + c.usage.join(', '),
      link: '/commands/',
      icon: '⌨️',
      color: 'text-gold',
    })
  })

  agentCommands.forEach(c => {
    results.push({
      type: 'command',
      title: c.prefix,
      subtitle: 'Agent Command',
      detail: c.description,
      link: '/commands/',
      icon: '⚡',
      color: 'text-menta',
    })
  })

  experts.forEach(e => {
    results.push({
      type: 'expert',
      title: e.name,
      subtitle: e.focus,
      detail: e.layers.map(l => l.name).join(', ') + ' | ' + e.layers.flatMap(l => l.items).slice(0, 3).join('; '),
      link: `/mega-brain/#${e.id}`,
      icon: e.icon,
      color: 'text-gold',
    })
  })

  articles.forEach(a => {
    results.push({
      type: 'article',
      title: `Art. ${a.number} — ${a.name}`,
      subtitle: a.severity,
      detail: a.description + ' | ' + a.rules.join('; '),
      link: '/constitution/',
      icon: a.icon,
      color: a.severity === 'NON-NEGOTIABLE' ? 'text-red-400' : a.severity === 'MUST' ? 'text-amber-400' : 'text-blue-400',
    })
  })

  return results
}

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const index = useMemo(() => buildIndex(), [])

  const results = useMemo(() => {
    if (!query.trim()) return index
    const q = query.toLowerCase()
    return index.filter(r =>
      r.title.toLowerCase().includes(q) ||
      r.subtitle.toLowerCase().includes(q) ||
      r.detail.toLowerCase().includes(q)
    )
  }, [query, index])

  const typeLabels: Record<string, string> = {
    agent: 'Agents',
    workflow: 'Workflows',
    command: 'Commands',
    expert: 'Experts',
    article: 'Constitution',
  }

  const grouped = useMemo(() => {
    const groups: Record<string, SearchResult[]> = {}
    results.forEach(r => {
      if (!groups[r.type]) groups[r.type] = []
      groups[r.type].push(r)
    })
    return groups
  }, [results])

  return (
    <div className="grid-bg">
      <section className="relative px-12 pt-16 pb-10 border-b border-surface-600">
        <div className="absolute inset-0 bg-gradient-to-b from-menta/5 via-transparent to-transparent pointer-events-none" />
        <div className="relative">
          <h1 className="text-4xl font-bold mb-6">
            <span className="gradient-text-menta">Quick Search</span>
          </h1>
          <div className="relative max-w-2xl">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar agentes, comandos, workflows, experts..."
              className="w-full px-5 py-3.5 rounded-xl bg-surface-800 border border-surface-600 text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-coral/50 focus:ring-1 focus:ring-coral/20 transition-all"
              autoFocus
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted text-xs">
              {results.length} resultados
            </span>
          </div>
        </div>
      </section>

      <section className="px-12 py-10 pb-20">
        {Object.entries(grouped).map(([type, items]) => (
          <div key={type} className="mb-8">
            <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">
              {typeLabels[type] || type} ({items.length})
            </h2>
            <div className="space-y-2">
              {items.map((item, i) => (
                <a
                  key={i}
                  href={item.link}
                  className="flex items-start gap-4 rounded-lg bg-surface-800 border border-surface-600 px-5 py-3.5 card-hover"
                >
                  <span className="text-lg mt-0.5">{item.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`text-sm font-semibold font-mono ${item.color}`}>{item.title}</span>
                      <span className="text-xs text-text-muted">{item.subtitle}</span>
                    </div>
                    <p className="text-xs text-text-secondary truncate">{item.detail}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        ))}

        {results.length === 0 && (
          <div className="text-center py-20">
            <p className="text-text-muted text-sm">Nenhum resultado para &ldquo;{query}&rdquo;</p>
          </div>
        )}
      </section>
    </div>
  )
}
