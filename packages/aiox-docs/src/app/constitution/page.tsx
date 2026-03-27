import React from 'react';

export default function ConstitutionPage() {
  return (
    <div className="grid-bg">
      <section className="relative px-12 pt-16 pb-10 border-b border-surface-600">
        <div className="absolute inset-0 bg-gradient-to-b from-coral/10 via-transparent to-transparent pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-coral status-dot" />
            <span className="text-xs text-text-muted uppercase tracking-widest">AIOX Constitution</span>
          </div>
          <h1 className="text-5xl font-extrabold mb-4 tracking-tight">
            <span className="gradient-text">AIOX + MEGA BRAIN</span>
          </h1>
          <p className="text-xl text-text-secondary max-w-3xl font-medium leading-relaxed">
            O Guia Definitivo: Onde a filosofia vira código e o volume vira lucro. 
            A simbiose entre o motor de execução AIOX e a inteligência estratégica do Mega Brain.
          </p>
        </div>
      </section>

      {/* 1. AIOX METHOD */}
      <section className="px-12 py-16 border-b border-surface-600">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-3xl">🏛️</span>
          <h2 className="text-3xl font-bold text-text-primary">1. AIOX Method: O Motor de Execução</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="rounded-2xl bg-surface-800 border border-surface-600 p-8 card-hover">
            <h3 className="text-xl font-bold text-coral mb-4 flex items-center gap-2">
              <span>🤖</span> Arquitetura de Agentes (Tiers)
            </h3>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <span className="text-menta font-bold shrink-0">T1</span>
                <div>
                  <p className="font-bold text-text-primary">Core (AIOX Standard)</p>
                  <p className="text-sm text-text-secondary">Dex, Quinn, Aria, Morgan, Pax, River, Atlas. Foco em engenharia de software rigorosa.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-gold font-bold shrink-0">T2</span>
                <div>
                  <p className="font-bold text-text-primary">Commander (Low-Ticket)</p>
                  <p className="text-sm text-text-secondary">Atlas (Chief of Staff). Orquestra os departamentos de marketing e vendas.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-purple-400 font-bold shrink-0">T3</span>
                <div>
                  <p className="font-bold text-text-primary">Chief & Specialist</p>
                  <p className="text-sm text-text-secondary">Especialistas em Copy, Funnel, Creative e Traffic (ex: Hook Master, Quiz Builder).</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl bg-surface-800 border border-surface-600 p-8 card-hover">
            <h3 className="text-xl font-bold text-menta mb-4 flex items-center gap-2">
              <span>⚡</span> Heurísticas de Workflow
            </h3>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-surface-900 border border-surface-700">
                <p className="font-bold text-text-primary text-sm mb-1">Clean Handoff (Contexto é Rei)</p>
                <p className="text-xs text-text-secondary">Nunca misture planejamento e código no mesmo chat. Agentes performam melhor com janelas de contexto limpas.</p>
              </div>
              <div className="p-4 rounded-xl bg-surface-900 border border-surface-700">
                <p className="font-bold text-text-primary text-sm mb-1">SM → DEV → QA Cycle</p>
                <p className="text-xs text-text-secondary">River prepara, Dex implementa, Quinn revisa. Um agente nunca revisa o próprio trabalho.</p>
              </div>
              <div className="p-4 rounded-xl bg-surface-900 border border-surface-700">
                <p className="font-bold text-text-primary text-sm mb-1">Sharding Protocol</p>
                <p className="text-xs text-text-secondary">Documentos são quebrados em pedaços (shards). O Dev carrega apenas o necessário, economizando tokens e mantendo foco.</p>
              </div>
              <div className="p-4 rounded-xl bg-surface-900 border border-surface-700">
                <p className="font-bold text-text-primary text-sm mb-1">IDS (Incremental Development System)</p>
                <p className="text-xs text-text-secondary">Antes de criar, checa o Registry (REUSE/ADAPT/CREATE). Reutiliza heurísticas e componentes existentes.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MEGA BRAIN */}
      <section className="px-12 py-16 border-b border-surface-600">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-3xl">🧠</span>
          <h2 className="text-3xl font-bold text-text-primary">2. Mega Brain: A Biblioteca de DNA Estratégico</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { title: 'Filosofias', icon: '💎', desc: 'Crenças fundamentais (ex: "Volume negates luck"). Guiam o "porquê".' },
            { title: 'Modelos Mentais', icon: '🧩', desc: 'Frameworks cognitivos (ex: "Value Equation"). Guiam o pensamento.' },
            { title: 'Heurísticas', icon: '⚡', desc: 'Regras práticas e atalhos (ex: "Pergunta antes de prescrever"). Guiam a ação.' },
            { title: 'Frameworks', icon: '🏗️', desc: 'Estruturas implementáveis (ex: "CLOSER", "Atomic Design").' },
            { title: 'Metodologias', icon: '📋', desc: 'Processos step-by-step (ex: "Scrum", "NEPQ").' }
          ].map((item, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-surface-800 border border-surface-600 card-hover">
              <span className="text-3xl mb-4 block">{item.icon}</span>
              <h4 className="text-lg font-bold text-gold mb-2">{item.title}</h4>
              <p className="text-sm text-text-secondary">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl bg-gold/5 border border-gold/20 p-8">
          <h3 className="text-xl font-bold text-gold mb-6 flex items-center gap-2">
            <span>🏆</span> Hall of Fame Experts
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Alex Hormozi', focus: 'Offers & Scaling' },
              { name: 'Cole Gordon', focus: 'Sales Teams' },
              { name: 'Jeremy Miner', focus: 'NEPQ / Sales' },
              { name: 'Blair Warren', focus: 'Persuasion' },
              { name: 'Russell Brunson', focus: 'Funnels' },
              { name: 'David Allen', focus: 'Productivity' },
              { name: 'Ken Schwaber', focus: 'Scrum/Agile' },
              { name: 'Jim Edwards', focus: 'Copywriting' }
            ].map(e => (
              <div key={e.name} className="p-4 rounded-xl bg-surface-800 border border-surface-700">
                <p className="font-bold text-text-primary text-sm">{e.name}</p>
                <p className="text-xs text-text-muted">{e.focus}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. A CONEXÃO */}
      <section className="px-12 py-16 border-b border-surface-600">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-3xl">🔗</span>
          <h2 className="text-3xl font-bold text-text-primary">3. A Conexão: Simbiose Técnica</h2>
        </div>

        <div className="rounded-2xl bg-surface-800 border border-surface-600 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-8 border-r border-surface-600">
              <h3 className="text-xl font-bold text-coral mb-6 flex items-center gap-2">
                <span>👑</span> Orion (AIOX-Master) como Ponte
              </h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-gold/10 text-gold flex items-center justify-center font-bold shrink-0">1</div>
                  <div>
                    <p className="font-bold text-text-primary">Consulta ao Mega Brain</p>
                    <p className="text-sm text-text-secondary">Identifica os experts e heurísticas ideais para o problema via Canonical Map.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-menta/10 text-menta flex items-center justify-center font-bold shrink-0">2</div>
                  <div>
                    <p className="font-bold text-text-primary">Injeção de DNA</p>
                    <p className="text-sm text-text-secondary">Injeta essas heurísticas nas instruções dos agentes especializados em tempo real.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-purple-400/10 text-purple-400 flex items-center justify-center font-bold shrink-0">3</div>
                  <div>
                    <p className="font-bold text-text-primary">Validação de Framework</p>
                    <p className="text-sm text-text-secondary">O QA (Quinn) usa checklists do Mega Brain para garantir excelência absoluta.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-8 bg-surface-900/50">
              <h3 className="text-xl font-bold text-menta mb-6">Fluxo Integrado</h3>
              <div className="space-y-4">
                {[
                  { step: 'Ideação', agent: 'Atlas (Analyst)', desc: 'Extrai a "Big Idea" com o Mega Brain carregado.' },
                  { step: 'Documentação', agent: 'Morgan (PM)', desc: 'Cria o PRD usando frameworks de oferta (Hormozi/Brunson).' },
                  { step: 'Sharding', agent: 'Orion (Master)', desc: 'Quebra a estratégia em histórias acionáveis.' },
                  { step: 'Implementação', agent: 'Dex (Dev)', desc: 'Codifica seguindo as heurísticas de conversão injetadas.' }
                ].map((f, i) => ( i > 0 && <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-surface-800 border border-surface-700">
                    <div>
                      <p className="text-[10px] text-text-muted uppercase tracking-widest">{f.step}</p>
                      <p className="text-sm font-bold text-text-primary">{f.agent}</p>
                    </div>
                    <p className="text-xs text-text-secondary text-right max-w-[150px]">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER TIPS */}
      <section className="px-12 py-16 pb-32">
        <div className="p-8 rounded-3xl bg-gradient-to-br from-coral/10 via-gold/5 to-menta/10 border border-white/5">
          <h3 className="text-2xl font-bold text-text-primary mb-6 text-center">🚀 Como Extrair o Máximo</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <span className="text-2xl mb-2 block">🎯</span>
              <p className="text-sm font-bold text-text-primary mb-1">Agente Certo</p>
              <p className="text-xs text-text-secondary">Não peça código para o PM. Use o @dev.</p>
            </div>
            <div className="text-center">
              <span className="text-2xl mb-2 block">⌨️</span>
              <p className="text-sm font-bold text-text-primary mb-1">Modo KB</p>
              <p className="text-xs text-text-secondary">Use *kb para profundidade estratégica.</p>
            </div>
            <div className="text-center">
              <span className="text-2xl mb-2 block">🧩</span>
              <p className="text-sm font-bold text-text-primary mb-1">Confie nos Shards</p>
              <p className="text-xs text-text-secondary">Siga o fluxo de Stories, não o PRD inteiro.</p>
            </div>
            <div className="text-center">
              <span className="text-2xl mb-2 block">📈</span>
              <p className="text-sm font-bold text-text-primary mb-1">Volume + Heurística</p>
              <p className="text-xs text-text-secondary">Produza volume com a base do Mega Brain.</p>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-white/5 text-center text-text-muted text-sm italic">
            "Getting Real" — Start with No, Build Less, Fix Time Flex Scope.
          </div>
        </div>
      </section>
    </div>
  );
}
