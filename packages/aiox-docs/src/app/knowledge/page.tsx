import {
  domains,
  dossiers,
  playbooks,
  dnaLayers,
  tokenBudgets,
  knowledgeCommands,
  knowledgeVersion,
} from '@/data/knowledge-system'

export default function KnowledgePage() {
  return (
    <div className="grid-bg min-h-screen">
      {/* Hero */}
      <section className="relative px-12 pt-16 pb-10 border-b border-surface-600">
        <div className="absolute inset-0 bg-gradient-to-b from-menta/5 via-transparent to-transparent pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-menta status-dot" />
            <span className="text-xs text-text-muted uppercase tracking-widest">Knowledge System v{knowledgeVersion}</span>
          </div>
          <h1 className="text-4xl font-bold mb-3">
            <span className="gradient-text">Knowledge Layer</span>
          </h1>
          <p className="text-text-secondary max-w-2xl">
            Sistema de inteligencia cognitiva para agentes AIOX.
            Extrai DNA de experts, gera dossiers cross-source e playbooks operacionais.
            Tudo carregado sob demanda com token budget rigoroso.
          </p>
          <div className="flex gap-6 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-menta">{domains.length}</div>
              <div className="text-xs text-text-muted">Dominios</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-coral">14+</div>
              <div className="text-xs text-text-muted">Experts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gold">{dossiers.length}</div>
              <div className="text-xs text-text-muted">Dossiers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{playbooks.length}</div>
              <div className="text-xs text-text-muted">Playbooks</div>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section className="px-12 py-10 border-b border-surface-600">
        <h2 className="text-lg font-semibold text-text-primary mb-6">Arquitetura de Carregamento</h2>
        <div className="grid grid-cols-4 gap-4">
          {[
            { step: 'Boot', load: '_REGISTRY.yaml', tokens: `~${tokenBudgets.indexOnly * 3} tokens`, color: 'border-menta/30 bg-menta/5' },
            { step: 'Ativacao', load: '_index.md por dominio', tokens: `~${tokenBudgets.indexOnly} tokens/dominio`, color: 'border-coral/30 bg-coral/5' },
            { step: 'Pedido', load: 'Expert / DNA / Dossier / Playbook', tokens: '500-1000 tokens', color: 'border-gold/30 bg-gold/5' },
            { step: 'Limite', load: 'Max por sessao', tokens: `${tokenBudgets.maxPerSession} tokens`, color: 'border-purple-500/30 bg-purple-500/5' },
          ].map((item) => (
            <div key={item.step} className={`rounded-lg border p-4 ${item.color}`}>
              <div className="text-sm font-bold text-text-primary mb-1">{item.step}</div>
              <div className="text-xs text-text-secondary mb-2">{item.load}</div>
              <div className="text-xs font-mono text-text-muted">{item.tokens}</div>
            </div>
          ))}
        </div>
      </section>

      {/* DNA Layers */}
      <section className="px-12 py-10 border-b border-surface-600">
        <h2 className="text-lg font-semibold text-text-primary mb-2">DNA Extraction v2 — 5 Camadas</h2>
        <p className="text-sm text-text-secondary mb-6">
          Cada expert e comprimido em 5 camadas cognitivas via <code className="text-coral font-mono text-xs">/ingest</code>.
          Max ~700 tokens por DNA.
        </p>
        <div className="space-y-3">
          {dnaLayers.map((layer, i) => {
            const colors = ['border-menta/30 bg-menta/5', 'border-blue-500/30 bg-blue-500/5', 'border-coral/30 bg-coral/5', 'border-gold/30 bg-gold/5', 'border-purple-500/30 bg-purple-500/5']
            return (
              <div key={layer.level} className={`rounded-lg border p-4 ${colors[i]}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold text-text-primary">{layer.level} {layer.name}</span>
                  <span className="text-xs font-mono text-text-muted">max {layer.maxItems}</span>
                </div>
                <div className="text-xs text-text-secondary mb-1">{layer.description}</div>
                <div className="text-xs text-text-muted italic">Teste: {layer.test}</div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Domains */}
      <section className="px-12 py-10 border-b border-surface-600">
        <h2 className="text-lg font-semibold text-text-primary mb-6">7 Dominios de Conhecimento</h2>
        <div className="grid grid-cols-2 gap-4">
          {domains.map((d) => (
            <div key={d.id} className="rounded-lg border border-surface-600 bg-surface-800/50 p-4 hover:border-menta/30 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-text-primary">{d.name}</span>
                <span className="text-xs font-mono text-menta">{d.expertCount} experts</span>
              </div>
              <p className="text-xs text-text-secondary mb-2">{d.description}</p>
              <div className="flex gap-1.5 flex-wrap">
                {d.agents.map((a) => (
                  <span key={a} className="px-2 py-0.5 rounded-full bg-surface-700 text-xs text-text-muted">@{a}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Dossiers */}
      <section className="px-12 py-10 border-b border-surface-600">
        <h2 className="text-lg font-semibold text-text-primary mb-2">Cross-Source Dossiers</h2>
        <p className="text-sm text-text-secondary mb-6">
          Convergencias entre multiplos experts. Gerados via <code className="text-coral font-mono text-xs">/dossier</code>.
          ~1000 tokens cada.
        </p>
        <div className="grid grid-cols-3 gap-4">
          {dossiers.map((d) => (
            <div key={d.id} className="rounded-lg border border-surface-600 bg-surface-800/50 p-4 hover:border-coral/30 transition-colors">
              <div className="text-sm font-bold text-text-primary mb-1">{d.name}</div>
              <p className="text-xs text-text-secondary mb-2">{d.description}</p>
              <div className="text-xs text-text-muted mb-2">{d.sources.length} sources: {d.sources.join(', ')}</div>
              <div className="flex gap-1.5 flex-wrap">
                {d.agents.map((a) => (
                  <span key={a} className="px-2 py-0.5 rounded-full bg-surface-700 text-xs text-text-muted">@{a}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Playbooks */}
      <section className="px-12 py-10 border-b border-surface-600">
        <h2 className="text-lg font-semibold text-text-primary mb-2">Playbooks Operacionais</h2>
        <p className="text-sm text-text-secondary mb-6">
          Frameworks accionaveis gerados de dossiers. Consultados via <code className="text-coral font-mono text-xs">/playbook</code>.
          ~800 tokens cada.
        </p>
        <div className="grid grid-cols-2 gap-4">
          {playbooks.map((p) => (
            <div key={p.id} className="rounded-lg border border-surface-600 bg-surface-800/50 p-4 hover:border-gold/30 transition-colors">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold text-text-primary">{p.name}</span>
                <span className="text-xs font-mono text-gold">~{p.tokenBudget}t</span>
              </div>
              <p className="text-xs text-text-secondary mb-2">{p.description}</p>
              <div className="text-xs text-text-muted mb-2">Source: {p.sourceDossier}</div>
              <div className="flex gap-1.5 flex-wrap">
                {p.agents.map((a) => (
                  <span key={a} className="px-2 py-0.5 rounded-full bg-surface-700 text-xs text-text-muted">@{a}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Commands */}
      <section className="px-12 py-10 border-b border-surface-600">
        <h2 className="text-lg font-semibold text-text-primary mb-6">Comandos do Knowledge System</h2>
        <div className="space-y-2">
          {knowledgeCommands.map((c) => (
            <div key={c.command} className="flex items-start gap-4 rounded-lg border border-surface-600 bg-surface-800/50 p-3">
              <code className="text-sm font-mono text-coral whitespace-nowrap min-w-[140px]">{c.command}</code>
              <div>
                <div className="text-sm text-text-primary">{c.description}</div>
                <div className="text-xs text-text-muted font-mono mt-0.5">{c.mode}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Knowledge Flywheel */}
      <section className="px-12 py-10">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Knowledge Flywheel</h2>
        <div className="flex items-center justify-center gap-3 py-6">
          {['Consumir conteudo', '/ingest DNA', '/dossier cross-source', 'Agentes usam', 'Melhores decisoes'].map((step, i) => (
            <div key={step} className="flex items-center gap-3">
              <div className="rounded-lg border border-surface-600 bg-surface-800 px-4 py-3 text-xs text-text-secondary text-center max-w-[120px]">
                {step}
              </div>
              {i < 4 && <span className="text-text-muted">&rarr;</span>}
            </div>
          ))}
        </div>
        <p className="text-xs text-text-muted text-center mt-2">
          O ciclo se retroalimenta: melhores decisoes geram mais conteudo para consumir e extrair.
        </p>
      </section>
    </div>
  )
}
