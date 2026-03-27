import { lowTicketAgents } from '@/data/agents'

const tiers = [
  { key: 'commander' as const, label: 'T1 Commander', desc: 'Coordenacao estrategica e alocacao de recursos', color: 'gold', border: 'border-gold/30' },
  { key: 'chief' as const, label: 'T2 Chiefs', desc: 'Lideranca departamental e supervisao de especialistas', color: 'menta', border: 'border-menta/30' },
  { key: 'specialist' as const, label: 'T3 Specialists', desc: 'Execucao tatica e producao direta', color: 'coral', border: 'border-surface-600' },
]

const departments = ['Intelligence', 'Copy', 'Creative', 'Funnel', 'Traffic', 'Product']

const deptColors: Record<string, string> = {
  Intelligence: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  Copy: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  Creative: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  Funnel: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  Traffic: 'bg-green-500/10 text-green-400 border-green-500/20',
  Product: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
}

export default function SquadsPage() {
  const commander = lowTicketAgents.filter(a => a.tier === 'commander')
  const chiefs = lowTicketAgents.filter(a => a.tier === 'chief')
  const specialists = lowTicketAgents.filter(a => a.tier === 'specialist')

  return (
    <div className="grid-bg">
      <section className="relative px-12 pt-16 pb-10 border-b border-surface-600">
        <div className="absolute inset-0 bg-gradient-to-b from-gold/5 via-transparent to-transparent pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-gold status-dot" />
            <span className="text-xs text-text-muted uppercase tracking-widest">Low-Ticket Squad</span>
          </div>
          <h1 className="text-4xl font-bold mb-3">
            <span className="gradient-text">29 Squad Agents</span>
          </h1>
          <p className="text-text-secondary max-w-2xl">
            Hierarquia militar de 3 tiers: Commander orquestra Chiefs departamentais
            que supervisionam Specialists taticos. Ativado via{' '}
            <code className="text-gold font-mono text-sm">/atlas</code>.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="px-12 py-8 border-b border-surface-600">
        <div className="grid grid-cols-4 gap-4">
          <div className="rounded-xl bg-gold/5 border border-gold/20 p-4 text-center">
            <span className="text-2xl font-bold text-gold">1</span>
            <p className="text-xs text-text-muted mt-1">Commander</p>
          </div>
          <div className="rounded-xl bg-menta/5 border border-menta/20 p-4 text-center">
            <span className="text-2xl font-bold text-menta">6</span>
            <p className="text-xs text-text-muted mt-1">Chiefs</p>
          </div>
          <div className="rounded-xl bg-coral/5 border border-coral/20 p-4 text-center">
            <span className="text-2xl font-bold text-coral">22</span>
            <p className="text-xs text-text-muted mt-1">Specialists</p>
          </div>
          <div className="rounded-xl bg-surface-800 border border-surface-600 p-4 text-center">
            <span className="text-2xl font-bold text-text-primary">6</span>
            <p className="text-xs text-text-muted mt-1">Departamentos</p>
          </div>
        </div>
      </section>

      {/* T1: Commander */}
      <section className="px-12 py-10 border-b border-surface-600">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 rounded-full bg-gold" />
          <div>
            <h2 className="text-lg font-bold text-text-primary">T1 — Commander</h2>
            <p className="text-xs text-text-muted">Coordenacao estrategica e alocacao de recursos</p>
          </div>
        </div>
        {commander.map(a => (
          <div key={a.id} className="rounded-xl bg-surface-800 border border-gold/30 p-6 glow-gold">
            <div className="flex items-center gap-4 mb-3">
              <span className="text-4xl">{a.icon}</span>
              <div>
                <h3 className="text-xl font-bold text-gold">{a.name}</h3>
                <p className="text-sm text-text-muted">{a.title}</p>
              </div>
            </div>
            <p className="text-sm text-text-secondary">{a.role}</p>
            <div className="mt-4">
              <code className="text-sm font-mono text-gold bg-gold/5 px-3 py-1.5 rounded-lg border border-gold/20">/atlas</code>
            </div>
          </div>
        ))}
      </section>

      {/* T2: Chiefs */}
      <section className="px-12 py-10 border-b border-surface-600">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 rounded-full bg-menta" />
          <div>
            <h2 className="text-lg font-bold text-text-primary">T2 — Chiefs</h2>
            <p className="text-xs text-text-muted">Lideranca departamental e supervisao de especialistas</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {chiefs.map(a => (
            <div key={a.id} className={`rounded-xl bg-surface-800 border border-menta/20 p-5 card-hover`}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{a.icon}</span>
                <div>
                  <h3 className="font-bold text-menta text-sm">{a.name}</h3>
                  <p className="text-[10px] text-text-muted">{a.title}</p>
                </div>
              </div>
              <p className="text-xs text-text-secondary mb-3">{a.role}</p>
              {a.department && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${deptColors[a.department]}`}>
                  {a.department}
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* T3: Specialists by Department */}
      <section className="px-12 py-10 pb-20">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-8 rounded-full bg-coral" />
          <div>
            <h2 className="text-lg font-bold text-text-primary">T3 — Specialists</h2>
            <p className="text-xs text-text-muted">Execucao tatica e producao direta</p>
          </div>
        </div>

        {departments.map(dept => {
          const deptAgents = specialists.filter(a => a.department === dept)
          if (deptAgents.length === 0) return null
          const chief = chiefs.find(c => c.department === dept)

          return (
            <div key={dept} className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${deptColors[dept]}`}>
                  {dept}
                </span>
                {chief && (
                  <span className="text-[10px] text-text-muted">
                    Lider: {chief.icon} {chief.name}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-4 gap-3">
                {deptAgents.map(a => (
                  <div key={a.id} className="rounded-lg bg-surface-800 border border-surface-600 p-4 card-hover">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{a.icon}</span>
                      <div>
                        <h4 className="text-xs font-semibold text-text-primary">{a.name}</h4>
                        <p className="text-[10px] text-text-muted">{a.title}</p>
                      </div>
                    </div>
                    <p className="text-[10px] text-text-secondary leading-relaxed">{a.role}</p>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </section>
    </div>
  )
}
