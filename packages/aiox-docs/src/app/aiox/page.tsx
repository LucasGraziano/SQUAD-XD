import { aioxAgents } from '@/data/agents'

const tierOrder = { core: 0, commander: 1, chief: 2, specialist: 3 }
const sorted = [...aioxAgents].sort((a, b) => tierOrder[a.tier] - tierOrder[b.tier])

const agentColors: Record<string, string> = {
  'aiox-master': 'border-gold/40 hover:border-gold',
  dev: 'border-coral/30 hover:border-coral',
  qa: 'border-green-500/30 hover:border-green-500',
  architect: 'border-purple-500/30 hover:border-purple-500',
  pm: 'border-blue-500/30 hover:border-blue-500',
  po: 'border-amber-500/30 hover:border-amber-500',
  sm: 'border-cyan-500/30 hover:border-cyan-500',
  analyst: 'border-indigo-500/30 hover:border-indigo-500',
  'data-engineer': 'border-emerald-500/30 hover:border-emerald-500',
  'ux-design-expert': 'border-pink-500/30 hover:border-pink-500',
  devops: 'border-red-500/30 hover:border-red-500',
  'squad-creator': 'border-menta/30 hover:border-menta',
}

export default function AioxPage() {
  return (
    <div className="grid-bg">
      <section className="relative px-12 pt-16 pb-10 border-b border-surface-600">
        <div className="absolute inset-0 bg-gradient-to-b from-coral/5 via-transparent to-transparent pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-coral status-dot" />
            <span className="text-xs text-text-muted uppercase tracking-widest">AIOX Core</span>
          </div>
          <h1 className="text-4xl font-bold mb-3">
            <span className="gradient-text">12 Core Agents</span>
          </h1>
          <p className="text-text-secondary max-w-2xl">
            Cada agente possui persona, expertise exclusiva e comandos dedicados.
            Ative com <code className="text-coral font-mono text-sm">@nome</code> ou{' '}
            <code className="text-coral font-mono text-sm">/AIOX:agents:nome</code>.
          </p>
        </div>
      </section>

      {/* Quick Reference */}
      <section className="px-12 py-8 border-b border-surface-600">
        <h2 className="text-sm font-semibold text-text-primary mb-4">Quick Reference</h2>
        <div className="flex flex-wrap gap-2">
          {sorted.map((a) => (
            <a
              key={a.id}
              href={`#${a.id}`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-800 border border-surface-600 text-xs text-text-secondary hover:text-coral hover:border-coral/30 transition-all"
            >
              <span>{a.icon}</span>
              <span>@{a.id}</span>
            </a>
          ))}
        </div>
      </section>

      {/* Agent Cards */}
      <section className="px-12 py-10">
        <div className="space-y-6">
          {sorted.map((agent) => (
            <div
              key={agent.id}
              id={agent.id}
              className={`rounded-xl bg-surface-800 border ${agentColors[agent.id] || 'border-surface-600'} p-6 card-hover scroll-mt-8`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{agent.icon}</span>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-bold text-text-primary">{agent.name}</h3>
                      <span className="text-xs text-text-muted">({agent.title})</span>
                    </div>
                    <code className="text-sm font-mono text-coral">@{agent.id}</code>
                  </div>
                </div>
                <span className="text-[10px] px-2.5 py-1 rounded-full font-semibold bg-coral/10 text-coral uppercase tracking-wider">
                  Core
                </span>
              </div>

              <p className="text-sm text-text-secondary mb-5 leading-relaxed">{agent.role}</p>

              <div className="grid grid-cols-2 gap-4">
                {agent.commands && agent.commands.length > 0 && (
                  <div className="rounded-lg bg-surface-900 p-4 border border-surface-700">
                    <h4 className="text-xs font-semibold text-menta uppercase tracking-wider mb-3">Comandos</h4>
                    <div className="space-y-1.5">
                      {agent.commands.map((c) => (
                        <div key={c.cmd} className="flex items-start gap-2">
                          <code className="text-[11px] font-mono px-2 py-1 rounded bg-menta/5 text-menta border border-menta/10 shrink-0">
                            {c.cmd}
                          </code>
                          <span className="text-[11px] text-text-muted pt-1">{c.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {agent.exclusive && agent.exclusive.length > 0 && (
                  <div className="rounded-lg bg-surface-900 p-4 border border-surface-700">
                    <h4 className="text-xs font-semibold text-gold uppercase tracking-wider mb-3">Exclusivo</h4>
                    <ul className="space-y-1.5">
                      {agent.exclusive.map((ex) => (
                        <li key={ex} className="text-xs text-text-secondary flex items-start gap-2">
                          <span className="text-gold mt-0.5">-</span>
                          {ex}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {agent.collaborates && agent.collaborates.length > 0 && (
                <div className="mt-4 pt-4 border-t border-surface-700">
                  <span className="text-[10px] text-text-muted uppercase tracking-wider">Colabora com: </span>
                  {agent.collaborates.map((c) => (
                    <code key={c} className="text-[11px] font-mono text-text-secondary mx-1">{c}</code>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Delegation Matrix */}
      <section className="px-12 py-10 border-t border-surface-600 pb-20">
        <h2 className="text-xl font-bold mb-6 text-text-primary">Delegation Matrix</h2>
        <div className="rounded-xl bg-surface-800 border border-surface-600 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-700">
                <th className="text-left px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Flow</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Pattern</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-700">
              <tr><td className="px-5 py-3 text-text-secondary">Git Push</td><td className="px-5 py-3"><code className="text-coral font-mono text-xs">ANY agent</code> <span className="text-text-muted mx-2">-&gt;</span> <code className="text-menta font-mono text-xs">@devops *push</code></td></tr>
              <tr><td className="px-5 py-3 text-text-secondary">Schema Design</td><td className="px-5 py-3"><code className="text-coral font-mono text-xs">@architect</code> <span className="text-text-muted mx-2">-&gt;</span> <code className="text-menta font-mono text-xs">@data-engineer DDL</code></td></tr>
              <tr><td className="px-5 py-3 text-text-secondary">Story Flow</td><td className="px-5 py-3"><code className="text-coral font-mono text-xs">@sm *draft</code> <span className="text-text-muted mx-2">-&gt;</span> <code className="font-mono text-xs text-gold">@po *validate</code> <span className="text-text-muted mx-2">-&gt;</span> <code className="font-mono text-xs text-menta">@dev *develop</code> <span className="text-text-muted mx-2">-&gt;</span> <code className="font-mono text-xs text-green-400">@qa *qa-gate</code> <span className="text-text-muted mx-2">-&gt;</span> <code className="font-mono text-xs text-red-400">@devops *push</code></td></tr>
              <tr><td className="px-5 py-3 text-text-secondary">Epic Flow</td><td className="px-5 py-3"><code className="text-coral font-mono text-xs">@pm *create-epic</code> <span className="text-text-muted mx-2">-&gt;</span> <code className="font-mono text-xs text-gold">@pm *execute-epic</code> <span className="text-text-muted mx-2">-&gt;</span> <code className="font-mono text-xs text-menta">@sm *draft per story</code></td></tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
