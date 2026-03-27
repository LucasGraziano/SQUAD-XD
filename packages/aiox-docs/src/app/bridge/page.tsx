import { syncPipeline, memoryArchitecture, lowTicketWorkflows, dnaLayers, memoryBrackets } from '@/data/mega-brain'

export default function BridgePage() {
  return (
    <div className="grid-bg min-h-screen">
      {/* Hero */}
      <section className="relative px-12 pt-16 pb-10 border-b border-surface-600">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 via-transparent to-transparent pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-purple-400 status-dot" />
            <span className="text-xs text-text-muted uppercase tracking-widest">System Integration</span>
          </div>
          <h1 className="text-4xl font-bold mb-3">
            <span className="gradient-text">AIOX</span>
            <span className="text-text-muted mx-3">+</span>
            <span className="gradient-text-menta">Mega Brain</span>
          </h1>
          <p className="text-text-secondary max-w-3xl leading-relaxed">
            Dois sistemas independentes conectados por um <strong className="text-purple-400">Knowledge Feeder Bridge</strong>.
            O AIOX orquestra agentes e workflows de desenvolvimento. O Mega Brain armazena conhecimento de 14 experts em 5 camadas DNA.
            A ponte sincroniza conhecimento do MB para os agentes AIOX consumirem.
          </p>
        </div>
      </section>

      {/* ═══ THE BIG PICTURE ═══ */}
      <section className="px-12 py-10 border-b border-surface-600">
        <h2 className="text-xl font-bold mb-6 text-text-primary">Arquitetura de Conexão</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* AIOX Box */}
          <div className="rounded-2xl bg-surface-800 border-2 border-coral/30 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-coral/10 flex items-center justify-center text-xl">🤖</div>
              <div>
                <h3 className="text-lg font-bold text-coral">AIOX</h3>
                <span className="text-[10px] text-text-muted">AI-Orchestrated System</span>
              </div>
            </div>
            <ul className="space-y-2 text-xs text-text-secondary">
              <li className="flex gap-2"><span className="text-coral">-</span>12 Core Agents com personas</li>
              <li className="flex gap-2"><span className="text-coral">-</span>4 Workflows primários (SDC, QA, Spec, Brownfield)</li>
              <li className="flex gap-2"><span className="text-coral">-</span>207 Tasks estruturadas</li>
              <li className="flex gap-2"><span className="text-coral">-</span>Constitution com 6 artigos</li>
              <li className="flex gap-2"><span className="text-coral">-</span>Synapse Engine (8-layer context)</li>
              <li className="flex gap-2"><span className="text-coral">-</span>Agent MEMORY.md (10 arquivos)</li>
            </ul>
            <div className="mt-4 pt-3 border-t border-surface-700">
              <span className="text-[10px] text-text-muted">Foco:</span>
              <span className="text-xs text-coral ml-2 font-medium">Execução + Orquestração</span>
            </div>
          </div>

          {/* Bridge Box */}
          <div className="rounded-2xl bg-surface-800 border-2 border-purple-500/30 p-6 flex flex-col justify-center">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">🔗</div>
              <h3 className="text-lg font-bold text-purple-400">Knowledge Feeder</h3>
              <span className="text-[10px] text-text-muted">Bridge Layer</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-coral">AIOX</span>
                <span className="flex-1 border-t border-dashed border-purple-500/30" />
                <span className="text-purple-400">←</span>
                <span className="flex-1 border-t border-dashed border-purple-500/30" />
                <span className="text-menta">MB</span>
              </div>
              <div className="rounded-lg bg-surface-900 border border-surface-700 p-3 text-center">
                <code className="text-[10px] font-mono text-purple-400">SHA-256 hash comparison</code>
                <div className="text-[10px] text-text-muted mt-1">Delta detection: new / modified / deleted</div>
              </div>
              <div className="rounded-lg bg-surface-900 border border-surface-700 p-3 text-center">
                <code className="text-[10px] font-mono text-purple-400">mb-sync-state.json</code>
                <div className="text-[10px] text-text-muted mt-1">{memoryArchitecture.bridge.totalSynced} files synced</div>
              </div>
              <div className="rounded-lg bg-surface-900 border border-surface-700 p-3 text-center">
                <code className="text-[10px] font-mono text-purple-400">knowledgeId: k-012...k-060</code>
                <div className="text-[10px] text-text-muted mt-1">Stored in docs/knowledge/</div>
              </div>
            </div>
          </div>

          {/* Mega Brain Box */}
          <div className="rounded-2xl bg-surface-800 border-2 border-menta/30 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-menta/10 flex items-center justify-center text-xl">🧠</div>
              <div>
                <h3 className="text-lg font-bold text-menta">Mega Brain</h3>
                <span className="text-[10px] text-text-muted">External Knowledge Repository</span>
              </div>
            </div>
            <ul className="space-y-2 text-xs text-text-secondary">
              <li className="flex gap-2"><span className="text-menta">-</span>14 Experts com DNA completo</li>
              <li className="flex gap-2"><span className="text-menta">-</span>5 DNA Layers (Filosofias → Metodologias)</li>
              <li className="flex gap-2"><span className="text-menta">-</span>42 Dossiers compilados</li>
              <li className="flex gap-2"><span className="text-menta">-</span>JARVIS-MEMORY.md (contexto sistema)</li>
              <li className="flex gap-2"><span className="text-menta">-</span>Hooks de persistência automática</li>
              <li className="flex gap-2"><span className="text-menta">-</span>YAML com evidências + peso de confiança</li>
            </ul>
            <div className="mt-4 pt-3 border-t border-surface-700">
              <span className="text-[10px] text-text-muted">Foco:</span>
              <span className="text-xs text-menta ml-2 font-medium">Conhecimento + Estratégia</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SYNC PIPELINE ═══ */}
      <section className="px-12 py-10 border-b border-surface-600">
        <h2 className="text-xl font-bold mb-2 text-text-primary">Sync Pipeline</h2>
        <p className="text-sm text-text-secondary mb-6 max-w-2xl">
          O pipeline de sincronização transfere conhecimento do Mega Brain para o AIOX em 7 etapas. Baseado em <strong className="text-menta">hash comparison</strong>, só processa arquivos novos ou modificados.
        </p>

        <div className="rounded-2xl bg-surface-800 border border-surface-600 p-6">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[19px] top-4 bottom-4 w-px bg-gradient-to-b from-menta via-purple-500 to-coral" />

            <div className="space-y-5">
              {syncPipeline.map((step) => (
                <div key={step.step} className="relative flex items-start gap-5">
                  <div className="relative z-10 flex items-center justify-center w-10 h-10 rounded-full bg-surface-900 border-2 border-surface-600 text-lg shrink-0">
                    {step.icon}
                  </div>
                  <div className="pt-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs font-bold text-text-muted">Step {step.step}</span>
                      <h4 className="text-sm font-bold text-text-primary">{step.name}</h4>
                    </div>
                    <p className="text-xs text-text-secondary">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-4 text-xs text-text-muted">
          <span>Last sync: <strong className="text-text-secondary">{memoryArchitecture.bridge.lastSync}</strong></span>
          <span className="text-surface-600">|</span>
          <span>Detection: <code className="text-menta font-mono">{memoryArchitecture.bridge.detectionMethod}</code></span>
          <span className="text-surface-600">|</span>
          <span>Total synced: <strong className="text-text-secondary">{memoryArchitecture.bridge.totalSynced} files</strong></span>
        </div>
      </section>

      {/* ═══ DATA FLOW DETAIL ═══ */}
      <section className="px-12 py-10 border-b border-surface-600">
        <h2 className="text-xl font-bold mb-2 text-text-primary">Fluxo Completo de Dados</h2>
        <p className="text-sm text-text-secondary mb-6 max-w-2xl">
          Como o conhecimento do Mega Brain chega ao contexto de um agente AIOX durante uma conversa.
        </p>

        <div className="rounded-2xl bg-surface-900 border border-surface-700 p-8">
          <div className="space-y-4">
            {[
              { from: 'Mega Brain', path: 'knowledge/dna/persons/alex-hormozi/FILOSOFIAS.yaml', desc: 'Expert DNA armazenado em YAML com 5 camadas, citações e peso', color: 'text-menta', badge: 'SOURCE' },
              { from: 'Knowledge Feeder', path: 'SHA-256 hash → compare with mb-sync-state.json', desc: 'Detecta se o arquivo é novo, modificado ou inalterado', color: 'text-purple-400', badge: 'DETECT' },
              { from: 'Bridge', path: 'knowledgeId: k-012 assigned → docs/knowledge/k-012.md', desc: 'ID atribuído e conteúdo completo armazenado no AIOX', color: 'text-purple-400', badge: 'STORE' },
              { from: 'Agent Memory', path: '.aiox-core/development/agents/dev/MEMORY.md', desc: 'Referência adicionada ao Knowledge Feed do MEMORY.md do agente', color: 'text-coral', badge: 'INDEX' },
              { from: 'Synapse Engine', path: 'calculateBracket() → MemoryBridge → SynapseMemoryProvider', desc: 'Bracket determina quanto contexto alocar para memória', color: 'text-gold', badge: 'INJECT' },
              { from: 'Agent Context', path: '<synapse-rules> XML injected', desc: 'Conhecimento disponível para o agente usar na conversa', color: 'text-green-400', badge: 'USE' },
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-4">
                <span className={`text-[10px] px-2.5 py-1 rounded-full bg-surface-800 border border-surface-700 font-bold ${step.color} shrink-0 w-16 text-center`}>
                  {step.badge}
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-xs font-bold ${step.color}`}>{step.from}</span>
                    <code className="text-[10px] font-mono text-text-muted truncate">{step.path}</code>
                  </div>
                  <p className="text-xs text-text-secondary">{step.desc}</p>
                </div>
                {i < 5 && <span className="text-text-muted text-sm mt-3">↓</span>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ WHAT EACH SYSTEM OWNS ═══ */}
      <section className="px-12 py-10 border-b border-surface-600">
        <h2 className="text-xl font-bold mb-6 text-text-primary">Separação de Responsabilidades</h2>

        <div className="rounded-xl bg-surface-800 border border-surface-600 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-700">
                <th className="text-left px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Responsabilidade</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-coral uppercase tracking-wider">AIOX</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-menta uppercase tracking-wider">Mega Brain</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-700">
              {[
                ['Orquestração de agentes', 'Owner', '-'],
                ['Workflows de desenvolvimento', 'Owner', '-'],
                ['Constitution e rules', 'Owner', '-'],
                ['Knowledge DNA (experts)', '-', 'Owner'],
                ['JARVIS-MEMORY (contexto)', '-', 'Owner'],
                ['Dossiers compilados', '-', 'Owner'],
                ['Agent MEMORY.md', 'Owner (storage)', 'Contributor (Knowledge Feed)'],
                ['Sync pipeline', 'Consumer', 'Source'],
                ['Bracket-aware injection', 'Owner (Synapse)', 'Provider (hooks)'],
                ['Decision tracking', '-', 'Owner (memory_updater hook)'],
                ['Session persistence', 'Storage target', 'Owner (agent_memory_persister hook)'],
                ['Low-Ticket Squad ops', 'Consumers', 'Knowledge source'],
              ].map(([resp, aiox, mb]) => (
                <tr key={resp}>
                  <td className="px-5 py-3 text-text-secondary text-xs">{resp}</td>
                  <td className="px-5 py-3 text-xs">
                    <span className={aiox === 'Owner' || aiox?.includes('Owner') ? 'text-coral font-bold' : aiox === '-' ? 'text-text-muted' : 'text-text-secondary'}>
                      {aiox}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-xs">
                    <span className={mb === 'Owner' || mb?.includes('Owner') ? 'text-menta font-bold' : mb === '-' ? 'text-text-muted' : 'text-text-secondary'}>
                      {mb}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ═══ KEY DESIGN PRINCIPLES ═══ */}
      <section className="px-12 py-10 pb-20">
        <h2 className="text-xl font-bold mb-6 text-text-primary">Princípios de Design</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: '🛡️', title: 'Fail-Open Architecture', desc: 'Todos os sistemas de memória degradam gracefully. Timeout ou erro → retorna array vazio. Nunca bloqueia execução.', color: 'border-green-500/20' },
            { icon: '🎚️', title: 'Bracket-Aware Injection', desc: 'Contexto restante determina profundidade da memória. 60-100% = skip. 0-25% = full content + handoff warning.', color: 'border-gold/20' },
            { icon: '🔒', title: 'Hash-Based Sync', desc: 'SHA-256 comparison garante que apenas arquivos new/modified são processados. Zero overhead para unchanged files.', color: 'border-coral/20' },
            { icon: '🎯', title: 'Sector-Filtered Recall', desc: 'Cada agente recebe apenas memórias relevantes ao seu papel. @dev → procedural/semantic. @qa → reflective/episodic.', color: 'border-purple-500/20' },
            { icon: '⚡', title: '15ms Timeout Budget', desc: 'Synapse engine tem budget máximo de 15ms para memory retrieval. Session-level cache por {agentId}-{bracket}.', color: 'border-menta/20' },
            { icon: '🔄', title: 'Pattern Promotion', desc: 'Padrões vistos em 3+ agents são promovidos de MEMORY.md individual para CLAUDE.md ou .claude/rules/ (global).', color: 'border-blue-500/20' },
          ].map((p) => (
            <div key={p.title} className={`rounded-xl bg-surface-800 border ${p.color} p-5`}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xl">{p.icon}</span>
                <h3 className="text-sm font-bold text-text-primary">{p.title}</h3>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
