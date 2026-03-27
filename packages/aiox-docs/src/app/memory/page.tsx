import {
  memoryBrackets,
  agentSectorPreferences,
  memoryHooks,
  syncPipeline,
  memoryArchitecture,
} from '@/data/mega-brain'

const bracketColors: Record<string, string> = {
  green: 'border-green-500/30 bg-green-500/5 text-green-400',
  yellow: 'border-yellow-500/30 bg-yellow-500/5 text-yellow-400',
  orange: 'border-orange-500/30 bg-orange-500/5 text-orange-400',
  red: 'border-red-500/30 bg-red-500/5 text-red-400',
}

const sectorColors: Record<string, string> = {
  procedural: 'bg-coral/10 text-coral border-coral/20',
  semantic: 'bg-menta/10 text-menta border-menta/20',
  reflective: 'bg-gold/10 text-gold border-gold/20',
  episodic: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
}

export default function MemoryPage() {
  return (
    <div className="grid-bg min-h-screen">
      {/* Hero */}
      <section className="relative px-12 pt-16 pb-10 border-b border-surface-600">
        <div className="absolute inset-0 bg-gradient-to-b from-gold/5 via-transparent to-transparent pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-gold status-dot" />
            <span className="text-xs text-text-muted uppercase tracking-widest">Cognitive Infrastructure</span>
          </div>
          <h1 className="text-4xl font-bold mb-3">
            <span className="gradient-text">Memory System</span>
          </h1>
          <p className="text-text-secondary max-w-3xl leading-relaxed">
            O AIOX e o Mega Brain possuem sistemas de memória independentes mas conectados. Juntos, formam uma arquitetura cognitiva que permite aos agentes <strong className="text-gold">lembrar, aprender e adaptar</strong> suas respostas ao contexto.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="px-12 py-8 border-b border-surface-600">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-xl bg-surface-800 border border-surface-600 p-5 text-center">
            <div className="text-2xl font-bold text-coral">{memoryArchitecture.aioxMemory.agents}</div>
            <div className="text-xs text-text-muted mt-1">Agent Memory Files</div>
          </div>
          <div className="rounded-xl bg-surface-800 border border-surface-600 p-5 text-center">
            <div className="text-2xl font-bold text-menta">4</div>
            <div className="text-xs text-text-muted mt-1">Memory Brackets</div>
          </div>
          <div className="rounded-xl bg-surface-800 border border-surface-600 p-5 text-center">
            <div className="text-2xl font-bold text-gold">{memoryArchitecture.bridge.totalSynced}</div>
            <div className="text-xs text-text-muted mt-1">Synced Knowledge Files</div>
          </div>
          <div className="rounded-xl bg-surface-800 border border-surface-600 p-5 text-center">
            <div className="text-2xl font-bold text-purple-400">4</div>
            <div className="text-xs text-text-muted mt-1">Memory Sectors</div>
          </div>
        </div>
      </section>

      {/* ═══ AIOX MEMORY ═══ */}
      <section className="px-12 py-10 border-b border-surface-600">
        <h2 className="text-xl font-bold mb-2 text-text-primary">AIOX Agent Memory</h2>
        <p className="text-sm text-text-secondary mb-6 max-w-2xl">
          Cada um dos {memoryArchitecture.aioxMemory.agents} agentes possui um arquivo <code className="text-coral font-mono text-xs">MEMORY.md</code> persistente com 5 seções estruturadas.
        </p>

        <div className="rounded-xl bg-surface-800 border border-surface-600 p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-lg">📁</span>
            <code className="text-sm font-mono text-coral">{memoryArchitecture.aioxMemory.location}</code>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {memoryArchitecture.aioxMemory.sections.map((section) => (
              <div key={section} className="rounded-lg bg-surface-900 border border-surface-700 p-4">
                <h4 className="text-xs font-bold text-menta mb-2">{section}</h4>
                <p className="text-[10px] text-text-muted">
                  {section === 'Active Patterns' && 'Padrões atuais verificados (3-5 key patterns)'}
                  {section === 'Key Patterns' && 'Coding standards, project structure, git rules'}
                  {section === 'Promotion Candidates' && 'Padrões em 3+ agents → candidatos a CLAUDE.md'}
                  {section === 'Archived' && 'Padrões obsoletos (data + motivo de remoção)'}
                  {section === 'Knowledge Feed' && 'Entradas timestamped do Mega Brain ingest (k-###)'}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-4 text-xs text-text-muted">
            <span>Max linhas: <strong className="text-text-secondary">{memoryArchitecture.aioxMemory.maxLines}</strong></span>
            <span className="text-surface-600">|</span>
            <span>Import rule: <code className="text-coral font-mono">{memoryArchitecture.aioxMemory.syncRule}</code></span>
          </div>
        </div>

        {/* Lifecycle */}
        <h3 className="text-sm font-bold text-text-primary mb-3 uppercase tracking-wider">Ciclo de Vida da Memória</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl bg-surface-800 border border-coral/20 p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">📝</span>
              <h4 className="text-sm font-bold text-coral">1. Criação</h4>
            </div>
            <ul className="space-y-2 text-xs text-text-secondary">
              <li className="flex gap-2"><span className="text-coral shrink-0">-</span>Agente observa padrões durante a sessão</li>
              <li className="flex gap-2"><span className="text-coral shrink-0">-</span>Hook <code className="font-mono text-text-muted">agent_memory_persister</code> roda no SessionEnd</li>
              <li className="flex gap-2"><span className="text-coral shrink-0">-</span>Append com timestamp + progresso (%) + files</li>
              <li className="flex gap-2"><span className="text-coral shrink-0">-</span>Max 200 linhas (header + 175 entries recentes)</li>
            </ul>
          </div>
          <div className="rounded-xl bg-surface-800 border border-menta/20 p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">🔍</span>
              <h4 className="text-sm font-bold text-menta">2. Recall</h4>
            </div>
            <ul className="space-y-2 text-xs text-text-secondary">
              <li className="flex gap-2"><span className="text-menta shrink-0">-</span>Agente ativa → lê MEMORY.md via imports</li>
              <li className="flex gap-2"><span className="text-menta shrink-0">-</span>Synapse calcula bracket de contexto</li>
              <li className="flex gap-2"><span className="text-menta shrink-0">-</span>MemoryBridge filtra por sector preferences</li>
              <li className="flex gap-2"><span className="text-menta shrink-0">-</span>Injeta via &lt;synapse-rules&gt; XML</li>
            </ul>
          </div>
          <div className="rounded-xl bg-surface-800 border border-gold/20 p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">♻️</span>
              <h4 className="text-sm font-bold text-gold">3. Promoção</h4>
            </div>
            <ul className="space-y-2 text-xs text-text-secondary">
              <li className="flex gap-2"><span className="text-gold shrink-0">-</span>Padrão visto em 3+ agents</li>
              <li className="flex gap-2"><span className="text-gold shrink-0">-</span>Move para Promotion Candidates</li>
              <li className="flex gap-2"><span className="text-gold shrink-0">-</span>Elevado a CLAUDE.md ou <code className="font-mono text-text-muted">.claude/rules/</code></li>
              <li className="flex gap-2"><span className="text-gold shrink-0">-</span>Padrões obsoletos → Archived (com data)</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ═══ BRACKET SYSTEM ═══ */}
      <section className="px-12 py-10 border-b border-surface-600">
        <h2 className="text-xl font-bold mb-2 text-text-primary">Bracket System</h2>
        <p className="text-sm text-text-secondary mb-6 max-w-2xl">
          O sistema adapta a quantidade de memória injetada baseado no <strong className="text-menta">contexto restante</strong> da conversa. Quanto menos contexto disponível, mais memória é carregada.
        </p>

        <div className="space-y-3">
          {memoryBrackets.map((b) => (
            <div key={b.id} className={`rounded-xl border p-5 flex items-start gap-5 ${bracketColors[b.color]}`}>
              <div className="text-center shrink-0 w-20">
                <div className="text-lg font-bold">{b.name}</div>
                <div className="text-[10px] opacity-70">{b.contextRange}</div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-xs font-mono font-bold">Max {b.maxTokens} tokens</span>
                  {b.maxTokens === 0 && <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface-800 text-text-muted border border-surface-600">skip</span>}
                </div>
                <p className="text-sm opacity-90">{b.behavior}</p>
              </div>

              {/* Visual bar */}
              <div className="w-24 shrink-0">
                <div className="h-2 rounded-full bg-surface-900 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: b.maxTokens === 0 ? '0%' : `${Math.min(100, b.maxTokens / 10)}%`,
                      background: b.color === 'green' ? '#22c55e' : b.color === 'yellow' ? '#eab308' : b.color === 'orange' ? '#f97316' : '#ef4444',
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ SECTOR PREFERENCES ═══ */}
      <section className="px-12 py-10 border-b border-surface-600">
        <h2 className="text-xl font-bold mb-2 text-text-primary">Agent Sector Preferences</h2>
        <p className="text-sm text-text-secondary mb-6 max-w-2xl">
          Cada agente tem preferências por tipos específicos de memória. O sistema filtra automaticamente para entregar apenas o conhecimento mais relevante ao papel do agente.
        </p>

        {/* Sector Legend */}
        <div className="flex flex-wrap gap-3 mb-6">
          {Object.entries(sectorColors).map(([sector, cls]) => (
            <span key={sector} className={`text-[10px] px-3 py-1.5 rounded-full border font-bold uppercase tracking-wider ${cls}`}>
              {sector}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {agentSectorPreferences.map((pref) => (
            <div key={pref.agent} className="rounded-lg bg-surface-800 border border-surface-700 p-4 flex items-start gap-4">
              <span className="text-2xl">{pref.icon}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <code className="text-sm font-mono text-coral font-bold">@{pref.agent}</code>
                </div>
                <p className="text-xs text-text-muted mb-2">{pref.description}</p>
                <div className="flex gap-1.5">
                  {pref.sectors.map((s) => (
                    <span key={s} className={`text-[10px] px-2 py-0.5 rounded-full border ${sectorColors[s]}`}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ MEGA BRAIN MEMORY ═══ */}
      <section className="px-12 py-10 border-b border-surface-600">
        <h2 className="text-xl font-bold mb-2 text-text-primary">Mega Brain Knowledge Store</h2>
        <p className="text-sm text-text-secondary mb-6 max-w-2xl">
          O Mega Brain armazena conhecimento em formato YAML estruturado com 5 camadas DNA por expert. Cada entrada rastreia evidências, implicações e peso de confiança.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* YAML Structure */}
          <div className="rounded-xl bg-surface-800 border border-surface-600 p-6">
            <h3 className="text-sm font-bold text-gold mb-4">Estrutura YAML (por DNA layer)</h3>
            <div className="space-y-2">
              {memoryArchitecture.megaBrainMemory.yamlFields.map((field) => (
                <div key={field} className="flex items-center gap-3 text-xs">
                  <code className="font-mono text-menta w-32 shrink-0">{field}</code>
                  <span className="text-text-muted">
                    {field === 'id' && 'ID único (FIL-AH-001)'}
                    {field === 'nome' && 'Nome da filosofia/modelo/etc'}
                    {field === 'declaracao' && 'Declaração completa com contexto'}
                    {field === 'evidencias' && 'Citações diretas com chunk_id e source_id'}
                    {field === 'implicacoes' && 'fazer: [...] + evitar: [...]'}
                    {field === 'conflitos_potenciais' && 'Conflitos com outros princípios'}
                    {field === 'dominios' && 'Tags de domínio (sales, scaling, etc)'}
                    {field === 'peso' && 'Confiança 0.0-1.0 baseada em evidências'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* JARVIS-MEMORY */}
          <div className="rounded-xl bg-surface-800 border border-surface-600 p-6">
            <h3 className="text-sm font-bold text-gold mb-4">JARVIS-MEMORY.md (Contexto do Sistema)</h3>
            <p className="text-xs text-text-secondary mb-4">
              Memória relacional do Mega Brain — quem somos, o que fazemos, decisões tomadas.
            </p>
            <div className="space-y-2">
              {memoryArchitecture.megaBrainMemory.contextSections.map((section) => (
                <div key={section} className="flex items-start gap-3 rounded-lg bg-surface-900 border border-surface-700 p-3">
                  <span className="text-gold shrink-0 text-xs mt-0.5">-</span>
                  <div>
                    <span className="text-xs font-bold text-text-primary">{section}</span>
                    <p className="text-[10px] text-text-muted mt-0.5">
                      {section === 'Os Fundadores' && 'Perfil completo de Lucas e Cabral (idade, skills, horários, metas)'}
                      {section === 'A Empresa' && 'Squad XD: produto, avatar, revenue, modelo operacional'}
                      {section === 'Padrões Observados' && 'Comportamentos e tendências detectados ao longo do tempo'}
                      {section === 'Decisões Tomadas' && 'Registro timestamped de decisões com motivos'}
                      {section === 'Calibrações Brasil' && 'Ajustes específicos para o mercado brasileiro'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ MEMORY HOOKS ═══ */}
      <section className="px-12 py-10 border-b border-surface-600">
        <h2 className="text-xl font-bold mb-2 text-text-primary">Memory Hooks</h2>
        <p className="text-sm text-text-secondary mb-6 max-w-2xl">
          Hooks Python que automatizam a persistência e injeção de memória. Executam em momentos específicos do ciclo de vida da conversa.
        </p>

        <div className="space-y-3">
          {memoryHooks.map((hook) => (
            <div key={hook.name} className="rounded-xl bg-surface-800 border border-surface-600 p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <code className="text-sm font-mono text-coral font-bold">{hook.name}</code>
                  <span className="text-[10px] ml-3 px-2 py-0.5 rounded-full bg-menta/10 text-menta border border-menta/20 font-mono">{hook.trigger}</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${hook.system === 'mega-brain' ? 'bg-gold/10 text-gold border-gold/20' : 'bg-coral/10 text-coral border-coral/20'}`}>
                  {hook.system}
                </span>
              </div>
              <p className="text-sm text-text-primary mb-1">{hook.purpose}</p>
              <p className="text-xs text-text-muted">{hook.behavior}</p>
              {hook.timeout && (
                <span className="inline-block mt-2 text-[10px] px-2 py-0.5 rounded bg-surface-900 text-text-muted border border-surface-700">
                  Timeout: {hook.timeout}
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ═══ SYNAPSE ENGINE ═══ */}
      <section className="px-12 py-10 pb-20">
        <h2 className="text-xl font-bold mb-2 text-text-primary">Synapse Memory Engine</h2>
        <p className="text-sm text-text-secondary mb-6 max-w-2xl">
          Motor de injeção de memória do AIOX. Coordena bracket detection, memory retrieval e context injection com <strong className="text-menta">fail-open architecture</strong>.
        </p>

        <div className="rounded-xl bg-surface-800 border border-surface-600 p-6 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <span className="text-[10px] text-text-muted uppercase tracking-wider">Location</span>
              <code className="block text-xs font-mono text-coral mt-1">{memoryArchitecture.synapse.location}</code>
            </div>
            <div>
              <span className="text-[10px] text-text-muted uppercase tracking-wider">Cache Key</span>
              <code className="block text-xs font-mono text-menta mt-1">{memoryArchitecture.synapse.cacheKey}</code>
            </div>
            <div>
              <span className="text-[10px] text-text-muted uppercase tracking-wider">Timeout</span>
              <code className="block text-xs font-mono text-gold mt-1">{memoryArchitecture.synapse.timeout}</code>
            </div>
            <div>
              <span className="text-[10px] text-text-muted uppercase tracking-wider">Fail Mode</span>
              <code className="block text-xs font-mono text-green-400 mt-1">{memoryArchitecture.synapse.failMode}</code>
            </div>
          </div>
        </div>

        {/* Flow Diagram */}
        <h3 className="text-sm font-bold text-text-primary mb-4 uppercase tracking-wider">Retrieval Flow</h3>
        <div className="rounded-xl bg-surface-900 border border-surface-700 p-6">
          <div className="space-y-3">
            {[
              { label: 'Synapse Engine', desc: 'Recebe request de ativação do agente', color: 'text-coral' },
              { label: 'calculateBracket()', desc: 'Calcula % de contexto restante → determina bracket', color: 'text-menta' },
              { label: 'MemoryBridge.getMemoryHints()', desc: 'Consulta agentId + bracket + tokenBudget', color: 'text-gold' },
              { label: 'SynapseMemoryProvider', desc: 'Filtra por sector preferences do agente', color: 'text-purple-400' },
              { label: 'MemoryLoader.queryMemories()', desc: 'Busca nas MEMORY.md com limite de tokens', color: 'text-blue-400' },
              { label: 'formatSynapseRules()', desc: 'Formata como <synapse-rules> XML e injeta no contexto', color: 'text-menta' },
            ].map((step, i) => (
              <div key={step.label} className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-surface-800 border border-surface-600 flex items-center justify-center text-xs font-bold text-text-muted shrink-0">
                  {i + 1}
                </div>
                <div>
                  <code className={`text-sm font-mono font-bold ${step.color}`}>{step.label}</code>
                  <p className="text-xs text-text-muted mt-0.5">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
