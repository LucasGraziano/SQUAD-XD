import { experts, dnaLayers, megaBrainStats, companyContext } from '@/data/mega-brain'

const layerColors: Record<string, string> = {
  coral: 'border-coral/30 text-coral',
  menta: 'border-menta/30 text-menta',
  gold: 'border-gold/30 text-gold',
}

export default function MegaBrainPage() {
  return (
    <div className="grid-bg">
      <section className="relative px-12 pt-16 pb-10 border-b border-surface-600">
        <div className="absolute inset-0 bg-gradient-to-b from-gold/5 via-menta/3 to-transparent pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-gold status-dot" />
            <span className="text-xs text-text-muted uppercase tracking-widest">Knowledge Engine</span>
          </div>
          <h1 className="text-4xl font-bold mb-3">
            <span className="gradient-text">Mega Brain</span>
          </h1>
          <p className="text-text-secondary max-w-2xl">
            Repositorio externo de conhecimento que sincroniza expertise de mentores
            diretamente na memoria dos agentes. DNA de 8 experts, dossiers, playbooks
            e contexto da empresa.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="px-12 py-8 border-b border-surface-600">
        <div className="grid grid-cols-6 gap-3">
          <div className="rounded-xl bg-coral/5 border border-coral/20 p-4 text-center">
            <span className="text-xl font-bold text-coral">{megaBrainStats.totalKnowledgeItems}</span>
            <p className="text-[10px] text-text-muted mt-1">Knowledge Items</p>
          </div>
          <div className="rounded-xl bg-menta/5 border border-menta/20 p-4 text-center">
            <span className="text-xl font-bold text-menta">{megaBrainStats.experts}</span>
            <p className="text-[10px] text-text-muted mt-1">Experts</p>
          </div>
          <div className="rounded-xl bg-gold/5 border border-gold/20 p-4 text-center">
            <span className="text-xl font-bold text-gold">{megaBrainStats.dnaLayers}</span>
            <p className="text-[10px] text-text-muted mt-1">DNA Layers</p>
          </div>
          <div className="rounded-xl bg-purple-500/5 border border-purple-500/20 p-4 text-center">
            <span className="text-xl font-bold text-purple-400">{megaBrainStats.dossiers}</span>
            <p className="text-[10px] text-text-muted mt-1">Dossiers</p>
          </div>
          <div className="rounded-xl bg-blue-500/5 border border-blue-500/20 p-4 text-center">
            <span className="text-xl font-bold text-blue-400">{megaBrainStats.playbooks}</span>
            <p className="text-[10px] text-text-muted mt-1">Playbooks</p>
          </div>
          <div className="rounded-xl bg-surface-800 border border-surface-600 p-4 text-center">
            <span className="text-[11px] font-mono text-text-secondary">{megaBrainStats.syncMode}</span>
            <p className="text-[10px] text-text-muted mt-1">Sync Mode</p>
          </div>
        </div>
      </section>

      {/* DNA Layers */}
      <section className="px-12 py-10 border-b border-surface-600">
        <h2 className="text-xl font-bold mb-2 text-text-primary">DNA System — 5 Layers</h2>
        <p className="text-sm text-text-secondary mb-6">Cada expert tem ate 5 camadas de conhecimento estruturado</p>
        <div className="grid grid-cols-5 gap-3">
          {dnaLayers.map((layer) => (
            <div key={layer.name} className={`rounded-xl bg-surface-800 border ${layerColors[layer.color]} p-4`}>
              <span className="text-2xl block mb-2">{layer.icon}</span>
              <h3 className={`text-xs font-bold ${layerColors[layer.color].split(' ')[1]} mb-1`}>{layer.name}</h3>
              <p className="text-[10px] text-text-muted leading-relaxed">{layer.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Architecture */}
      <section className="px-12 py-10 border-b border-surface-600">
        <h2 className="text-xl font-bold mb-6 text-text-primary">Arquitetura do Mega Brain</h2>
        <div className="rounded-xl bg-surface-800 border border-surface-600 p-6">
          <pre className="text-xs font-mono text-text-secondary leading-relaxed">
{`D:/MEGA BRAIN XD/mega-brain/
├── knowledge/
│   ├── dna/
│   │   ├── persons/           # 8 expert profiles
│   │   │   ├── alex-hormozi/  # FILOSOFIAS, MODELOS-MENTAIS, HEURISTICAS, FRAMEWORKS, METODOLOGIAS
│   │   │   ├── cole-gordon/
│   │   │   ├── jeremy-haynes/
│   │   │   ├── jeremy-miner/
│   │   │   ├── jordan-lee/
│   │   │   ├── richard-linder/
│   │   │   ├── sam-oven/
│   │   │   └── the-scalable-company/
│   │   └── skills/            # Skill YAML files
│   ├── dossiers/              # 31 expert profiles (markdown)
│   └── playbooks/             # 12 process docs (markdown)
└── agents/
    └── sua-empresa/
        ├── COMPANY-CONTEXT.md
        ├── founders/
        │   ├── FOUNDER-LUCAS.md
        │   └── FOUNDER-CABRAL.md
        └── products/
            └── QUIZ-ZERO-DIASTASE.md`}
          </pre>
        </div>
      </section>

      {/* Sync Pipeline */}
      <section className="px-12 py-10 border-b border-surface-600">
        <h2 className="text-xl font-bold mb-6 text-text-primary">Sync Pipeline</h2>
        <div className="grid grid-cols-4 gap-4">
          {[
            { step: 1, title: 'Scan', desc: 'scanMegaBrainKnowledge() varre DNA, dossiers, playbooks', icon: '🔍' },
            { step: 2, title: 'Hash', desc: 'SHA-256 compara com sync state para detectar mudancas', icon: '🔐' },
            { step: 3, title: 'Parse', desc: 'YAML/MD convertido em documentos estruturados com metadata', icon: '📄' },
            { step: 4, title: 'Feed', desc: 'Knowledge items (k-###) injetados na MEMORY.md dos agentes', icon: '🧠' },
          ].map(s => (
            <div key={s.step} className="rounded-xl bg-surface-800 border border-surface-600 p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 rounded-full bg-gold/10 text-gold text-sm flex items-center justify-center font-mono">{s.step}</span>
                <span className="text-lg">{s.icon}</span>
              </div>
              <h3 className="text-sm font-bold text-text-primary mb-1">{s.title}</h3>
              <p className="text-xs text-text-secondary">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Experts */}
      <section className="px-12 py-10 border-b border-surface-600">
        <h2 className="text-xl font-bold mb-2 text-text-primary">8 Expert DNAs</h2>
        <p className="text-sm text-text-secondary mb-8">Conhecimento estruturado de mentores de classe mundial</p>

        <div className="space-y-6">
          {experts.map((expert) => (
            <div
              key={expert.id}
              id={expert.id}
              className={`rounded-xl bg-surface-800 border border-${expert.color}/20 p-6 scroll-mt-8`}
            >
              <div className="flex items-center gap-4 mb-5">
                <span className="text-3xl">{expert.icon}</span>
                <div>
                  <h3 className="text-lg font-bold text-text-primary">{expert.name}</h3>
                  <p className="text-sm text-text-muted">{expert.focus}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {expert.layers.map((layer) => {
                  const dnaLayer = dnaLayers.find(d => d.name === layer.name)
                  return (
                    <div key={layer.name} className="rounded-lg bg-surface-900 border border-surface-700 p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <span>{dnaLayer?.icon}</span>
                        <h4 className="text-xs font-bold text-coral uppercase tracking-wider">{layer.name}</h4>
                        {dnaLayer?.description && <span className="text-[10px] text-text-muted">— {dnaLayer.description}</span>}
                      </div>
                      <ul className="space-y-1.5">
                        {layer.items.map((item, i) => (
                          <li key={i} className="text-xs text-text-secondary flex items-start gap-2">
                            <span className="text-menta mt-0.5 shrink-0">-</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Company Context */}
      <section className="px-12 py-10 pb-20">
        <h2 className="text-xl font-bold mb-6 text-text-primary">Company Context</h2>
        <div className="grid grid-cols-2 gap-6">
          <div className="rounded-xl bg-surface-800 border border-surface-600 p-6">
            <h3 className="text-sm font-bold text-gold mb-4">Founders</h3>
            {companyContext.founders.map(f => (
              <div key={f.name} className="mb-4 last:mb-0">
                <h4 className="text-sm font-semibold text-text-primary">{f.name}</h4>
                <p className="text-xs text-menta">{f.role}</p>
                <p className="text-xs text-text-secondary mt-1">{f.focus}</p>
              </div>
            ))}
          </div>
          <div className="rounded-xl bg-surface-800 border border-surface-600 p-6">
            <h3 className="text-sm font-bold text-gold mb-4">Products</h3>
            {companyContext.products.map(p => (
              <div key={p.name}>
                <h4 className="text-sm font-semibold text-text-primary">{p.name}</h4>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-coral/10 text-coral border border-coral/20">{p.type}</span>
                <p className="text-xs text-text-secondary mt-2">{p.target} — {p.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
