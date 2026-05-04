import {
  domains,
  experts,
  dossiers,
  playbooks,
  dnaLayers,
  wikiLayers,
  dnaV3Features,
  tokenBudgets,
  knowledgeCommands,
  knowledgeVersion,
} from '@/data/knowledge-system'

const domainColors: Record<string, string> = {
  'copy-persuasion': 'bg-coral/10 text-coral border-coral/20',
  'offers-pricing': 'bg-gold/10 text-gold border-gold/20',
  'sales-closing': 'bg-green-500/10 text-green-400 border-green-500/20',
  'traffic-ads': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'funnels-value-ladder': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  'systems-ops': 'bg-menta/10 text-menta border-menta/20',
  'psychology-influence': 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  'ai-native-build': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  'product-engineering': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  'saas-operations': 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
}

const domainLabels: Record<string, string> = {
  'copy-persuasion': 'Copy',
  'offers-pricing': 'Offers',
  'sales-closing': 'Sales',
  'traffic-ads': 'Traffic',
  'funnels-value-ladder': 'Funnels',
  'systems-ops': 'Systems',
  'psychology-influence': 'Psych',
  'ai-native-build': 'AI Build',
  'product-engineering': 'Product',
  'saas-operations': 'SaaS Ops',
}

export default function KnowledgePage() {
  const totalExperts = experts.length

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
            Extrai DNA de experts, gera dossiers cross-source, playbooks operacionais
            e acumula conhecimento compounding via Wiki.
          </p>
          <div className="flex gap-8 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-menta">{domains.length}</div>
              <div className="text-xs text-text-muted">Dominios</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-coral">{totalExperts}</div>
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
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">Wiki</div>
              <div className="text-xs text-text-muted">Compounding</div>
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
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-text-primary mb-1">DNA Extraction v3 — 5 Camadas</h2>
            <p className="text-sm text-text-secondary">
              Cada expert e comprimido em 5 camadas cognitivas via <code className="text-coral font-mono text-xs">/ingest</code>.
              Max ~700 tokens por DNA.
            </p>
          </div>
          <div className="flex gap-2">
            {dnaV3Features.map((f) => (
              <div key={f.id} className="rounded-lg border border-surface-600 bg-surface-800/50 px-3 py-2 text-xs">
                <div className="font-mono text-gold mb-0.5">{f.name}</div>
                <div className="text-text-muted max-w-[180px]">{f.description}</div>
              </div>
            ))}
          </div>
        </div>
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

      {/* Experts */}
      <section className="px-12 py-10 border-b border-surface-600">
        <h2 className="text-lg font-semibold text-text-primary mb-2">{totalExperts} Experts com DNA Extraído</h2>
        <p className="text-sm text-text-secondary mb-6">
          Cada expert tem DNA v3 com 5 camadas cognitivas. Alguns aparecem em múltiplos domínios.
        </p>
        <div className="grid grid-cols-3 gap-3">
          {experts.map((expert) => (
            <div key={expert.id} className="rounded-lg border border-surface-600 bg-surface-800/50 p-3 hover:border-menta/30 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <span className="text-sm font-bold text-text-primary">{expert.name}</span>
                <span className="text-[10px] font-mono text-text-muted">{expert.domains.length}d</span>
              </div>
              <p className="text-xs text-text-secondary mb-2">{expert.specialty}</p>
              <div className="flex gap-1 flex-wrap">
                {expert.domains.map((d) => (
                  <span key={d} className={`px-1.5 py-0.5 rounded text-[10px] border ${domainColors[d] || 'bg-surface-700 text-text-muted border-surface-600'}`}>
                    {domainLabels[d] || d}
                  </span>
                ))}
              </div>
            </div>
          ))}
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

      {/* Wiki Compounding Layer */}
      <section className="px-12 py-10 border-b border-surface-600">
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-lg font-semibold text-text-primary">Wiki — Camada Compounding</h2>
          <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-xs border border-blue-500/20">Novo</span>
        </div>
        <p className="text-sm text-text-secondary mb-6">
          Memória viva da operação. RAW/ guarda fontes imutáveis. WIKI/ acumula artigos compilados pelo LLM — cada sessão relevante vira conhecimento permanente.
        </p>
        <div className="grid grid-cols-2 gap-4 mb-6">
          {wikiLayers.map((layer) => (
            <div key={layer.id} className={`rounded-lg border p-4 ${layer.immutable ? 'border-surface-500 bg-surface-800/50' : 'border-blue-500/30 bg-blue-500/5'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold font-mono text-text-primary">{layer.name}</span>
                {layer.immutable && <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-700 text-text-muted">IMUTÁVEL</span>}
              </div>
              <p className="text-xs text-text-secondary mb-2">{layer.description}</p>
              <code className="text-[10px] text-text-muted font-mono">{layer.path}</code>
            </div>
          ))}
        </div>
        <div className="rounded-lg border border-surface-600 bg-surface-800/50 p-4">
          <div className="text-xs font-semibold text-text-primary mb-3">Provenance Protocol — Obrigatório em toda ingestão</div>
          <div className="space-y-1.5">
            {[
              { tag: '[VERIFIED: source]', desc: 'Confirmado via tool nessa sessão', color: 'text-menta' },
              { tag: '[CITED: url]', desc: 'Referenciado de URL viva', color: 'text-blue-400' },
              { tag: '[ASSUMED]', desc: 'Conhecimento de treino — listar separadamente para confirmação antes de usar em copy ou decisão', color: 'text-gold' },
            ].map((p) => (
              <div key={p.tag} className="flex items-start gap-3">
                <code className={`text-xs font-mono whitespace-nowrap ${p.color}`}>{p.tag}</code>
                <span className="text-xs text-text-secondary">{p.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commands */}
      <section className="px-12 py-10 border-b border-surface-600">
        <h2 className="text-lg font-semibold text-text-primary mb-6">Comandos do Knowledge System</h2>
        <div className="space-y-2">
          {knowledgeCommands.map((c) => (
            <div key={c.command} className="flex items-start gap-4 rounded-lg border border-surface-600 bg-surface-800/50 p-3">
              <code className="text-sm font-mono text-coral whitespace-nowrap min-w-[150px]">{c.command}</code>
              <div className="flex-1">
                <div className="text-sm text-text-primary">{c.description}</div>
                <div className="text-xs text-text-muted font-mono mt-0.5">{c.mode}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Knowledge Flywheel */}
      <section className="px-12 py-10">
        <h2 className="text-lg font-semibold text-text-primary mb-6">Knowledge Flywheel</h2>
        <div className="rounded-lg border border-surface-600 bg-surface-800/30 p-6">
          <div className="flex items-center justify-center gap-2 mb-6 flex-wrap">
            {[
              { step: '1. Consumir', detail: 'Vídeo, transcrição, pesquisa', color: 'border-menta/40 bg-menta/5' },
              { step: '2. /ingest DNA', detail: '5 camadas cognitivas', color: 'border-coral/40 bg-coral/5' },
              { step: '3. /dossier', detail: 'Convergências cross-source', color: 'border-gold/40 bg-gold/5' },
              { step: '4. /wiki-ingest', detail: 'Insights de sessão → RAW', color: 'border-blue-500/40 bg-blue-500/5' },
              { step: '5. Agentes usam', detail: '*knowledge no contexto', color: 'border-purple-500/40 bg-purple-500/5' },
            ].map((item, i) => (
              <div key={item.step} className="flex items-center gap-2">
                <div className={`rounded-lg border px-4 py-3 text-center min-w-[130px] ${item.color}`}>
                  <div className="text-xs font-bold text-text-primary">{item.step}</div>
                  <div className="text-[10px] text-text-muted mt-0.5">{item.detail}</div>
                </div>
                {i < 4 && <span className="text-text-muted text-sm">&rarr;</span>}
              </div>
            ))}
          </div>
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-menta/20 bg-menta/5 px-4 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-menta status-dot" />
              <span className="text-xs text-menta">Melhores decisoes geram mais conteudo — o ciclo se retroalimenta</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
