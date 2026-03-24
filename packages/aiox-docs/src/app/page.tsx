import Link from 'next/link'
import StatCard from '@/components/StatCard'

const features = [
  {
    icon: '🤖',
    title: '12 Core Agents',
    desc: 'Agentes especializados com personas únicas — do Orchestrator ao DevOps.',
    href: '/aiox/',
    color: 'coral' as const,
  },
  {
    icon: '🎖️',
    title: '29 Squad Agents',
    desc: 'Low-Ticket Squad hierárquico: Commander → Chiefs → Specialists.',
    href: '/squads/',
    color: 'gold' as const,
  },
  {
    icon: '🔄',
    title: '14 Workflows',
    desc: 'Desde Story Development Cycle até Brownfield Discovery.',
    href: '/workflows/',
    color: 'menta' as const,
  },
  {
    icon: '⌨️',
    title: '8 Slash Commands',
    desc: 'Produtividade, geração de conteúdo e ferramentas de mídia.',
    href: '/commands/',
    color: 'coral' as const,
  },
  {
    icon: '🧠',
    title: 'Mega Brain',
    desc: '9 mentor DNAs, 31 dossiers, 60+ knowledge items alimentando agentes.',
    href: '/mega-brain/',
    color: 'gold' as const,
  },
  {
    icon: '📋',
    title: '208 Tasks',
    desc: 'Database, development, QA, documentation, DevOps e muito mais.',
    href: '/commands/',
    color: 'menta' as const,
  },
]

export default function HomePage() {
  return (
    <div className="grid-bg">
      {/* Hero */}
      <section className="relative px-12 pt-20 pb-16 border-b border-surface-600">
        <div className="absolute inset-0 bg-gradient-to-b from-coral/5 via-transparent to-transparent pointer-events-none" />
        <div className="relative max-w-4xl">
          <div className="flex items-center gap-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-menta status-dot" />
            <span className="text-xs text-text-muted uppercase tracking-widest">Synkra AIOX v3.0</span>
          </div>
          <h1 className="text-5xl font-bold mb-4 leading-tight">
            <span className="gradient-text">AI-Orchestrated</span>
            <br />
            Development System
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl leading-relaxed">
            Meta-framework que orquestra agentes de IA para desenvolvimento full-stack,
            produção de conteúdo e operações de marketing digital.
          </p>

          <div className="flex gap-3 mt-8">
            <Link
              href="/aiox/"
              className="px-5 py-2.5 bg-coral text-white rounded-lg text-sm font-medium hover:bg-coral-dark transition-colors"
            >
              Explorar Agentes
            </Link>
            <Link
              href="/workflows/"
              className="px-5 py-2.5 bg-surface-700 text-text-primary rounded-lg text-sm font-medium hover:bg-surface-600 transition-colors border border-surface-500"
            >
              Ver Workflows
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-12 py-10">
        <div className="grid grid-cols-4 gap-4">
          <StatCard value={41} label="Total Agents" icon="🤖" color="coral" />
          <StatCard value={14} label="Workflows" icon="🔄" color="menta" />
          <StatCard value={208} label="Tasks" icon="📋" color="gold" />
          <StatCard value={8} label="Slash Commands" icon="⌨️" color="coral" />
        </div>
      </section>

      {/* How it works */}
      <section className="px-12 py-10">
        <h2 className="text-xl font-bold mb-2 text-text-primary">Como funciona</h2>
        <p className="text-sm text-text-secondary mb-8">3 camadas de inteligência orquestrada</p>

        <div className="grid grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-surface-800 border border-coral/20">
            <div className="w-10 h-10 rounded-lg bg-coral/10 flex items-center justify-center text-xl mb-4">1</div>
            <h3 className="font-semibold text-sm mb-2 text-text-primary">Ative um agente</h3>
            <code className="text-xs font-mono text-coral bg-coral/5 px-2 py-1 rounded block mb-3">@dev</code>
            <p className="text-xs text-text-secondary">
              Cada agente tem persona, expertise e comandos exclusivos. Use <code className="text-coral">@nome</code> para ativar.
            </p>
          </div>
          <div className="p-6 rounded-xl bg-surface-800 border border-menta/20">
            <div className="w-10 h-10 rounded-lg bg-menta/10 flex items-center justify-center text-xl mb-4">2</div>
            <h3 className="font-semibold text-sm mb-2 text-text-primary">Execute comandos</h3>
            <code className="text-xs font-mono text-menta bg-menta/5 px-2 py-1 rounded block mb-3">*develop</code>
            <p className="text-xs text-text-secondary">
              Comandos com <code className="text-menta">*prefixo</code> executam tasks estruturadas com inputs, outputs e validações.
            </p>
          </div>
          <div className="p-6 rounded-xl bg-surface-800 border border-gold/20">
            <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center text-xl mb-4">3</div>
            <h3 className="font-semibold text-sm mb-2 text-text-primary">Workflows orquestrados</h3>
            <code className="text-xs font-mono text-gold bg-gold/5 px-2 py-1 rounded block mb-3">SDC → QA Loop</code>
            <p className="text-xs text-text-secondary">
              Workflows conectam múltiplos agentes em sequência com handoffs automáticos e quality gates.
            </p>
          </div>
        </div>
      </section>

      {/* Feature grid */}
      <section className="px-12 py-10 pb-20">
        <h2 className="text-xl font-bold mb-2 text-text-primary">Explore o sistema</h2>
        <p className="text-sm text-text-secondary mb-8">Tudo que o AIOX e Mega Brain oferecem</p>

        <div className="grid grid-cols-3 gap-4">
          {features.map((f) => (
            <Link
              key={f.title}
              href={f.href}
              className="p-5 rounded-xl bg-surface-800 border border-surface-600 card-hover group"
            >
              <span className="text-2xl mb-3 block">{f.icon}</span>
              <h3 className="font-semibold text-sm mb-1 text-text-primary group-hover:text-coral transition-colors">
                {f.title}
              </h3>
              <p className="text-xs text-text-secondary">{f.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Architecture overview */}
      <section className="px-12 py-10 border-t border-surface-600">
        <h2 className="text-xl font-bold mb-6 text-text-primary">Arquitetura de 4 Camadas</h2>
        <div className="grid grid-cols-4 gap-3">
          {[
            { layer: 'L1', name: 'Framework Core', mut: 'NEVER modify', color: 'border-red-500/30 bg-red-500/5', paths: '.aiox-core/core/' },
            { layer: 'L2', name: 'Templates', mut: 'Extend-only', color: 'border-yellow-500/30 bg-yellow-500/5', paths: '.aiox-core/development/' },
            { layer: 'L3', name: 'Project Config', mut: 'Mutable (select)', color: 'border-blue-500/30 bg-blue-500/5', paths: '.aiox-core/data/' },
            { layer: 'L4', name: 'Runtime', mut: 'ALWAYS modify', color: 'border-green-500/30 bg-green-500/5', paths: 'packages/, squads/' },
          ].map((l) => (
            <div key={l.layer} className={`p-4 rounded-xl border ${l.color}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono font-bold text-text-primary">{l.layer}</span>
                <span className="text-xs text-text-secondary">{l.name}</span>
              </div>
              <p className="text-[10px] text-text-muted mb-1">{l.mut}</p>
              <code className="text-[10px] font-mono text-text-muted">{l.paths}</code>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="px-12 py-8 border-t border-surface-600 text-center">
        <p className="text-xs text-text-muted">
          Synkra AIOX Documentation — Built with Next.js + Tailwind CSS
        </p>
      </footer>
    </div>
  )
}
