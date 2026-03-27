export interface Expert {
  id: string
  name: string
  focus: string
  icon: string
  color: string
  keyInsight: string
  layers: { name: string; items: string[] }[]
}

export interface DnaLayer {
  name: string
  icon: string
  description: string
  color: string
}

export const dnaLayers: DnaLayer[] = [
  { name: 'FILOSOFIAS', icon: '💎', description: 'Crenças fundamentais e princípios filosóficos que guiam decisões', color: 'coral' },
  { name: 'MODELOS-MENTAIS', icon: '🧩', description: 'Frameworks cognitivos para interpretar situações e tomar decisões', color: 'menta' },
  { name: 'HEURISTICAS', icon: '⚡', description: 'Regras práticas e atalhos decisórios testados em campo', color: 'gold' },
  { name: 'FRAMEWORKS', icon: '🏗️', description: 'Estruturas implementáveis para resolver problemas específicos', color: 'coral' },
  { name: 'METODOLOGIAS', icon: '📋', description: 'Processos completos e step-by-step para executar estratégias', color: 'menta' },
]

export const experts: Expert[] = [
  {
    id: 'alex-hormozi',
    name: 'Alex Hormozi',
    focus: 'Sales & Business Scaling',
    icon: '💰',
    color: 'coral',
    keyInsight: 'CLOSER Framework (question-based closing) + Farm System (6:3:1 BDR:SDS:Closer ratio)',
    layers: [
      { name: 'FILOSOFIAS', items: ['Outbound resilience — indestructible moat', 'Meritocracy-based compensation', 'High-performance culture over comfort', '"Largar para crescer" — let go at each level to scale', 'Pay minimum for maximum value', 'Volume negates luck', 'Price is a proxy for value', 'Sell the vacation, not the plane flight'] },
      { name: 'MODELOS-MENTAIS', items: ['Christmas Tree Structure — hierarchy for sales orgs', 'Farm System — Double A → Triple A → The Bigs (develop, don\'t hire closers)', '3 Stakeholders model', 'Growth Levels — each level requires letting go', 'BDR as Advertisement — outbound = marketing', 'Value Equation: Dream Outcome × Likelihood / Time × Effort'] },
      { name: 'HEURISTICAS', items: ['Questions-only sales approach', '3-point max in any pitch', 'Channel independence (never depend on 1 source)', 'Outbound timeline: 3 months to results', 'Low performer removal: 30-day cycle', 'Cobrar mais → mais commitment → melhores resultados', 'Escassez real > urgência artificial', 'Garantia remove risco → remove objeção principal'] },
      { name: 'FRAMEWORKS', items: ['CLOSER: Clarify, Label, Overview, Sell vacation, Explain, Reinforce', 'Conviction Framework (7-38-55 Mehrabian: tone > words)', 'Scaling Framework (Christmas Tree + Farm System)', 'Diagnostic Sales (questions diagnose before prescribing)', 'Value Ladder: Free → Low-Ticket → Core → High-Ticket → Continuity', 'Offer Stack: Core + Bonuses + Guarantee + Scarcity + Urgency'] },
      { name: 'METODOLOGIAS', items: ['Implement CLOSER in 6 steps', 'Build Farm System: recruit raw → train BDRs → promote to SDS → graduate to Closer', '$100M Offers: identify pain → create solution → package → premium pricing', '$100M Leads: warm outreach → cold outreach → content → paid ads', 'Spouse Objection Handler: redirect to partner involvement'] },
    ],
  },
  {
    id: 'blair-warren',
    name: 'Blair Warren',
    focus: 'Persuasion & Influence',
    icon: '🎭',
    color: 'purple',
    keyInsight: 'One Sentence Persuasion: 5 Drivers (Dreams, Failures, Fears, Suspicions, Enemies)',
    layers: [
      { name: 'FILOSOFIAS', items: ['Persuasion invisibility — focus 100% on the other person', 'Crooked Wisdom — powerful principles seem deceptively simple', 'Remove yourself from the equation entirely', 'Validate, never correct'] },
      { name: 'MODELOS-MENTAIS', items: ['Self-Verification Theory — validation beats praise (people want to be understood, not flattered)', 'Paradox of Permission — allowing fear reduces it'] },
      { name: 'HEURISTICAS', items: ['Justifying failures opens responsibility', 'Overlapping 5 drivers multiplies power', 'Validate the universal need behind the specific request'] },
      { name: 'FRAMEWORKS', items: ['One Sentence Persuasion — 5 Drivers: Encourage Dreams + Justify Failures + Allay Fears + Confirm Suspicions + Help Throw Rocks at Enemies', 'Validate & Fascinate paradigm'] },
    ],
  },
  {
    id: 'cole-gordon',
    name: 'Cole Gordon',
    focus: 'Sales Models & Team Scaling',
    icon: '🎯',
    color: 'menta',
    keyInsight: '7 Beliefs Framework (Pain→Doubt→Cost→Desire→Money→Support→Trust) — map every objection to a missing belief',
    layers: [
      { name: 'FILOSOFIAS', items: ['Philosophy > tactics (systems survive, scripts die)', 'Objections = uninstalled beliefs (prevent, don\'t rebut)', 'Internal pressure > external pressure', 'Conviction beats skill', 'Trust via Discovery (not rapport)', 'Different > Better', 'Data > closer\'s word', 'Secret shopping = best behavioral reform tool', 'Name & shame for accountability', 'Warmup before SPIN'] },
      { name: 'MODELOS-MENTAIS', items: ['Objection = Uninstalled Belief model', 'Upstream prevention > downstream handling', 'Anvil Drop (bad transitions kill deals)', 'Hell Island / Heaven Island (urgency framing)', 'Say/Do Ratio (accountability metric)', '4 Pillars Pitch model', 'Mehrabian 7-38-55 (7% words, 38% tone, 55% body)'] },
      { name: 'HEURISTICAS', items: ['45-second check-ins (Double Tie Down)', '2-day booking window maximum', '1 manager per 6-10 closers', '3 offers/day per closer', 'Double booking 1.5-2x capacity', 'Neutral tone 80-90% of call', 'Close rate 20-50% is healthy', 'Q4 inflation 2.5x normal objections', '24-48h follow-up window', 'Secret shopping > mystery shopping', 'Talk Track > Script (flexible vs rigid)', 'Interest Level Scale 1-10 for grading leads'] },
      { name: 'FRAMEWORKS', items: ['7 Beliefs Framework: Pain, Doubt, Cost, Desire, Money, Support, Trust', '6-Phase Call Flow: Intro → Discovery → Transition → Pitch → Committing → Objection Handling', '4 Pillars Pitch structure', '3 Tonality Levels (Curious → Concerned → Confident)', '7 Levers for Show Rate (booking window, calendar, grading, LNS, email, double-booking, re-bookings)', 'Sales Team 4 Phases: Recruit → Train → Deploy → Optimize', 'Priority Buckets (8 views for pipeline management)', 'Four-Scorecard System', 'The Big Three problems: weak discovery, weak pitch, can\'t close', 'Hammer Them Campaign (follow-up sequence)', 'VAK System (Visual-Auditory-Kinesthetic matching)'] },
      { name: 'METODOLOGIAS', items: ['Pre-Call Ritual (5 min warm-up)', 'Introduction Phase (pattern interrupt + frame)', 'Discovery via 7 Beliefs installation', 'Transition (Anvil Drop prevention)', '4 Pillars Pitch Delivery', 'Commitment Sequence (micro-commits → macro)', 'Open Wallet Technique', 'Spouse/Partner Objection handling', 'Setter Daily Workflow', 'Closer Pipeline Review', 'Show Rate Optimization Playbook'] },
    ],
  },
  {
    id: 'david-allen',
    name: 'David Allen',
    focus: 'Productivity & GTD',
    icon: '📥',
    color: 'blue',
    keyInsight: 'Mind Like Water — tactical clarity before strategic thinking; empty mind enables visionary work',
    layers: [
      { name: 'FILOSOFIAS', items: ['Mind Like Water — respond proportionally to stimulus, return to calm', 'Bottom-Up Liberates Top-Down — clean operational first, then think strategically', 'Capture everything, decide nothing until review'] },
    ],
  },
  {
    id: 'jeremy-haynes',
    name: 'Jeremy Haynes',
    focus: 'Marketing & Ad Production',
    icon: '📱',
    color: 'gold',
    keyInsight: 'Volume > Perfection: 50+ creatives/week, <10% hit rate is normal. NICHE = RICH.',
    layers: [
      { name: 'FILOSOFIAS', items: ['Persuading (for their benefit) vs convincing (for yours)', 'Recurring revenue justified ONLY by ongoing results/access', 'Volume > perfection (hit rate <10% normal)', 'Different > Better (always)', 'NICHE = RICH (inch wide, mile deep)', 'Time is most valuable — sell value not hours', 'Redundancy = protection (backup everything)', 'High price = better execution quality', 'System certainty determines pricing power', 'VSLs are dead (consumer behavior changed)', 'Buy competitors\' products (best training method)', 'MRR $1 = $50-80 enterprise value at exit'] },
      { name: 'FRAMEWORKS', items: ['Ad Creative Formula: Hook → Story → Offer → CTA', 'Audience Segmentation: Cold → Warm → Hot → Buyer', 'Campaign Structure: Testing → Scaling → Maintenance', 'Creative Testing Protocol: 3×3×3 (hooks × bodies × CTAs)', '50+ creatives/week production pipeline'] },
      { name: 'METODOLOGIAS', items: ['Agency Scaling: Niche → Offer → Fulfillment → Scale', 'Client Acquisition Flywheel: Paid Ads → Results → Case Studies → More Clients', 'Creative volume production workflow'] },
    ],
  },
  {
    id: 'jeremy-miner',
    name: 'Jeremy Miner',
    focus: 'NEPQ & Neuro-Emotional Sales',
    icon: '🧠',
    color: 'coral',
    keyInsight: '7th Level Selling: Never pitch — diagnose. Tension creates decision.',
    layers: [
      { name: 'FILOSOFIAS', items: ['Never pitch — diagnose', 'People buy emotionally, justify logically', 'The problem is never the problem (go 3 levels deeper)', 'Tension creates decision (comfort kills sales)', 'Questions control conversations, statements lose them'] },
      { name: 'FRAMEWORKS', items: ['NEPQ: Neuro-Emotional Persuasion Questions', 'Problem Awareness Ladder: Unaware → Problem-Aware → Solution-Aware → Product-Aware → Most Aware', 'Tone & Pacing: Curious → Concerned → Confident → Casual', 'Objection Dissolution: Agree → Isolate → Reverse → Close', 'Micro-Commitment Stacking: small yeses → big yes'] },
      { name: 'METODOLOGIAS', items: ['7th Level Selling: Connect → Situation → Problem → Solution → Consequence → Commitment → Close', 'Emotional temperature reading throughout call'] },
    ],
  },
  {
    id: 'jim-edwards',
    name: 'Jim Edwards',
    focus: 'Copywriting & Direct Response',
    icon: '✍️',
    color: 'amber',
    keyInsight: 'Copywriting formulas and direct response principles',
    layers: [
      { name: 'FILOSOFIAS', items: ['Copy is salesmanship in print', 'Benefits > features (always)', 'One message, one audience, one call to action', 'Curiosity is the strongest hook'] },
    ],
  },
  {
    id: 'russell-brunson',
    name: 'Russell Brunson',
    focus: 'Funnels & Value Ladders',
    icon: '🔺',
    color: 'orange',
    keyInsight: 'Funnel Stacking: breakeven front-end, all profit from backend. Distribution = real asset.',
    layers: [
      { name: 'FILOSOFIAS', items: ['Breakeven on front-end, all profit from backend (funnel stacking)', 'The problem is ALWAYS the funnel', 'Internet = media company, not business', 'Strategy survives platform changes (tactics die)', 'Funnels work for ANY business', 'Obsession with customer journey, not product', 'Distribution = the real asset (not the product)', 'Document, don\'t create'] },
      { name: 'FRAMEWORKS', items: ['Value Ladder: Free → Low → Core → High → Continuity', 'Funnel Stacking: sequential upsells with free communication between funnels', 'Hook-Story-Offer framework for all content', 'Expert Secrets: find your voice, build tribe, change world'] },
    ],
  },
  {
    id: 'sam-oven',
    name: 'Sam Ovens',
    focus: 'Consulting & Business Model',
    icon: '🔬',
    color: 'indigo',
    keyInsight: 'Bridge Model: Current State → Offer (Toll=Price) → Desired State. DWY > DFY > DIY.',
    layers: [
      { name: 'FILOSOFIAS', items: ['Bridge analogy: current state → offer bridge → desired state (toll = price)', 'Purple Ocean: proven market + unique twist (not red ocean, not blue)', 'DWY is gold standard (Done With You > DFY and DIY)', '80/20: 20% effort = 80% results', 'Objections are trolls (tests, not real barriers)', 'Unique mechanism is essential for differentiation', 'Premium pricing via lifetime ROI calculation', 'Differentiation via tweak, not revolution'] },
      { name: 'FRAMEWORKS', items: ['Consulting Blueprint: Niche → Offer → Funnel → Traffic → Close → Deliver', 'Quantum Model: Information → Automation → Done-For-You → Platform (evolution)', 'Webinar Funnel: Ad → Registration → Webinar → Application → Close'] },
      { name: 'METODOLOGIAS', items: ['Consulting Accelerator: Mindset → Niche → Offer → Acquisition → Delivery → Scale', 'UpLevel Consulting: advanced positioning, premium pricing, team building'] },
    ],
  },
  {
    id: 'ken-schwaber',
    name: 'Ken Schwaber',
    focus: 'Scrum & Agile (PMBOK)',
    icon: '🔄',
    color: 'cyan',
    keyInsight: 'Scrum framework, Kaizen continuous improvement, PMBOK project management',
    layers: [
      { name: 'FILOSOFIAS', items: ['Empirical process control (transparency, inspection, adaptation)', 'Self-organizing teams over command-and-control', 'Working software over documentation', 'Kaizen: continuous small improvements', 'Sprint = timebox of focus'] },
    ],
  },
  {
    id: 'diogo-kobata',
    name: 'Diogo Kobata',
    focus: 'Creative Production & Direct Response (BR)',
    icon: '🎬',
    color: 'pink',
    keyInsight: 'High-volume creative production for Brazilian direct response market',
    layers: [
      { name: 'FILOSOFIAS', items: ['Volume de criativos vence perfeição', 'Teste rápido, mate rápido, escale rápido', 'Direct response > branding (para low-ticket)', 'Copy brasileira tem ritmo próprio (não traduzir do inglês)'] },
    ],
  },
  {
    id: 'jordan-lee',
    name: 'Jordan Lee',
    focus: 'Enterprise Value & Org Structure',
    icon: '🏢',
    color: 'menta',
    keyInsight: 'Build to sell even if you never do. Systems run business, people run systems.',
    layers: [
      { name: 'FILOSOFIAS', items: ['Build to sell, even if you never do', 'Systems run the business, people run the systems', 'Enterprise value > monthly revenue', 'Recurring revenue is the foundation of wealth'] },
      { name: 'FRAMEWORKS', items: ['Team Structure Diamond: CEO → Ops → Sales → Delivery → Support', 'Hiring: A-players hire A-players, B-players hire C-players', 'KPI Dashboard: Revenue, Profit, LTV, CAC, Churn, NPS'] },
    ],
  },
  {
    id: 'richard-linder',
    name: 'Richard Linder',
    focus: 'Conversion Optimization',
    icon: '⚙️',
    color: 'gray',
    keyInsight: 'Optimize the system, not the symptom. Simplify before you optimize.',
    layers: [
      { name: 'FILOSOFIAS', items: ['Optimize the system, not the symptom', 'Measurement is the first step to improvement', 'Simplify before you optimize'] },
      { name: 'FRAMEWORKS', items: ['Conversion Optimization: Traffic → Landing → Offer → Follow-up', 'Split Testing Protocol: Hypothesis → Test → Measure → Iterate', 'Funnel Diagnostic: Where are people dropping off?'] },
    ],
  },
  {
    id: 'the-scalable-company',
    name: 'The Scalable Company',
    focus: 'Scaling Methodologies',
    icon: '📈',
    color: 'emerald',
    keyInsight: 'Scale systems not effort. Constraint theory: find and fix the bottleneck.',
    layers: [
      { name: 'FILOSOFIAS', items: ['Scale systems, not effort', 'Constraint theory: find and fix the bottleneck', 'Predictable revenue requires predictable systems', 'Culture eats strategy for breakfast'] },
      { name: 'FRAMEWORKS', items: ['Scaling Readiness: Product-Market Fit → Unit Economics → Team → Systems → Capital', 'Growth Engine: Acquisition → Activation → Revenue → Retention → Referral (AARRR)', 'Operations Maturity: Chaos → Reactive → Proactive → Predictive → Autonomous'] },
      { name: 'METODOLOGIAS', items: ['Scale Sprint: 90-day intensive scaling program', 'Department Building: Hire → Train → Document → Delegate → Audit'] },
    ],
  },
]

export const megaBrainStats = {
  totalKnowledgeItems: 60,
  totalDnaElements: 6000,
  experts: 14,
  dnaLayers: 5,
  dossiers: 42,
  playbooks: 12,
  domains: 40,
  skillChunks: 292,
  syncMode: 'Incremental (SHA-256)',
  lastSync: '2026-03-11',
  totalFilesMB: 193,
}

export const dossierCategories = [
  { category: 'Person Dossiers', count: 14, desc: 'Full writeups connecting expert DNA layers' },
  { category: 'Organization Dossiers', count: 2, desc: 'PMI (PMBOK) + Agora Inc (Big Black Book)' },
  { category: 'Phase 8 Themes', count: 3, desc: 'Copywriting & Persuasion, Funnels & Value Ladder, Traffic & Acquisition' },
  { category: 'Operational Structure', count: 5, desc: 'Team Structure, Sales Process, Hiring, Compensation, Metrics' },
  { category: 'Sales & Closing', count: 5, desc: 'Pricing, Management, Culture & Gamification, Call Funnels, Show Rates' },
  { category: 'Methodologies', count: 3, desc: 'NEPQ Methodology, Paid Media Scaling, Business Operating Systems' },
]

export const companyContext = {
  name: 'Squad XD',
  status: 'PRE-REVENUE (hypothesis not validated)',
  revenue: 'R$0',
  founders: [
    {
      name: 'Lucas Graziano',
      role: 'CEO / CMO / Operator',
      age: 22,
      focus: 'AI Orchestration, Ad creatives, Traffic management, BI/analytics, Funnel optimization',
      style: 'Consistent (daily incremental progress), organized, strategic',
      workWindow: '20:15-22:15 weekdays (2h)',
      goals: 'Generate consistent revenue → exit CLT → R$1M invested in 5yr',
    },
    {
      name: 'Pedro Cabral',
      role: 'CTO / Architect of Offer',
      age: 22,
      focus: 'Market research, Offer architecture, Copy, Big idea, Mechanism',
      style: 'Explosive (high energy spikes), intense focus during peaks',
      goals: 'R$150K/1yr → R$500K/3yr → R$1M+/5yr → R$10M patrimônio/10yr',
    },
  ],
  products: [
    {
      name: 'Zero Diástase',
      type: 'Low-Ticket Funnel',
      price: 'US$19 (LATAM) / R$84 (Brazil)',
      target: 'Mães LATAM 32-45y, pós-parto diástase',
      mechanism: 'Ginástica Hipopressiva ("Cinta Invisível" / "Zíper Abdominal")',
      delivery: '4 módulos, 28 dias (3x áudios 8-10 min/dia)',
      upsells: 'Order bump $4, Upsell $9, Upsell $29',
      expectedArpu: 'US$27-35',
      testBudget: 'R$600 (3-5 dias)',
      market: 'Colômbia > México > Porto Rico > LATAM',
      cpaMax: 'R$25',
    },
  ],
  businessModel: [
    { layer: 1, name: 'Low Ticket (Caixa)', desc: 'US$19 quiz → TSL → checkout (bump $4, upsells $9/$29)' },
    { layer: 2, name: 'Authority', desc: 'R$97-147 (entry) → R$997-1.5K (central) → R$3.997+ (backend)' },
    { layer: 3, name: 'SaaS', desc: 'Proprietary tech (CRM, decision systems) — ONLY after validating Layer 1-2' },
  ],
  philosophy: '"Getting Real" (37signals) — Start with No, Build Less, Fix Time Flex Scope. Kill switch: R$500 loss = kill; 2 months no profit = pivot.',
}

// ── Memory System ──────────────────────────────────────

export interface MemoryBracket {
  id: string
  name: string
  contextRange: string
  maxTokens: number
  behavior: string
  color: string
}

export const memoryBrackets: MemoryBracket[] = [
  { id: 'fresh', name: 'FRESH', contextRange: '60-100%', maxTokens: 0, behavior: 'Nenhuma memória injetada — contexto disponível é suficiente', color: 'green' },
  { id: 'moderate', name: 'MODERATE', contextRange: '40-60%', maxTokens: 50, behavior: 'Layer 1: Metadata — lembretes breves das memórias mais relevantes', color: 'yellow' },
  { id: 'depleted', name: 'DEPLETED', contextRange: '25-40%', maxTokens: 200, behavior: 'Layer 2: Chunks — blocos de conhecimento expandidos para reforço', color: 'orange' },
  { id: 'critical', name: 'CRITICAL', contextRange: '0-25%', maxTokens: 1000, behavior: 'Layer 3: Full Content — memória completa + alerta de handoff', color: 'red' },
]

export interface AgentSectorPref {
  agent: string
  icon: string
  sectors: string[]
  description: string
}

export const agentSectorPreferences: AgentSectorPref[] = [
  { agent: 'dev', icon: '💻', sectors: ['procedural', 'semantic'], description: 'Foco em como fazer (procedural) e o que significa (semantic)' },
  { agent: 'qa', icon: '✅', sectors: ['reflective', 'episodic'], description: 'Foco em lições passadas (reflective) e experiências (episodic)' },
  { agent: 'architect', icon: '📐', sectors: ['semantic', 'reflective'], description: 'Foco em conceitos (semantic) e reflexões arquiteturais (reflective)' },
  { agent: 'pm', icon: '📋', sectors: ['episodic', 'semantic'], description: 'Foco em histórico de decisões (episodic) e contexto (semantic)' },
  { agent: 'po', icon: '🎯', sectors: ['episodic', 'semantic'], description: 'Foco em validações passadas (episodic) e critérios (semantic)' },
  { agent: 'sm', icon: '🌊', sectors: ['procedural', 'episodic'], description: 'Foco em processos (procedural) e experiências de sprint (episodic)' },
  { agent: 'devops', icon: '🚀', sectors: ['procedural', 'episodic'], description: 'Foco em procedimentos (procedural) e incidentes (episodic)' },
  { agent: 'analyst', icon: '🔍', sectors: ['semantic', 'reflective'], description: 'Foco em dados (semantic) e análises passadas (reflective)' },
  { agent: 'data-engineer', icon: '🗄️', sectors: ['procedural', 'semantic'], description: 'Foco em schema procedures (procedural) e modelo de dados (semantic)' },
  { agent: 'ux-design-expert', icon: '🎨', sectors: ['reflective', 'procedural'], description: 'Foco em decisões de design (reflective) e padrões de UI (procedural)' },
]

export interface MemoryHook {
  name: string
  trigger: string
  purpose: string
  behavior: string
  timeout?: string
  system: 'mega-brain' | 'aiox'
}

export const memoryHooks: MemoryHook[] = [
  { name: 'agent_memory_persister', trigger: 'SessionEnd', purpose: 'Persistir aprendizados da sessão no MEMORY.md do agente', behavior: 'Append de entrada com timestamp, progresso (%), arquivos processados. Max 200 linhas (header + 175 recentes).', timeout: 'Advisory', system: 'mega-brain' },
  { name: 'memory_hints_injector', trigger: 'UserPromptSubmit', purpose: 'Injeção bracket-aware de memória do agente', behavior: 'Calcula contexto restante → bracket → lê MEMORY.md → injeta hints proporcionais', timeout: '80ms', system: 'mega-brain' },
  { name: 'memory_updater', trigger: 'Keyword detection (decid*, escolh*, prefiro)', purpose: 'Auto-update JARVIS-MEMORY.md com decisões detectadas', behavior: 'Detecta padrões de decisão na mensagem → append na seção DECISIONS com timestamp', system: 'mega-brain' },
  { name: 'claude_md_agent_sync', trigger: 'PostToolUse (Write/Edit agents/)', purpose: 'Sync CLAUDE.md quando estrutura de agentes muda', behavior: 'Conta agentes por tipo → atualiza tabela → log em claude-md-sync.jsonl', system: 'mega-brain' },
]

export interface SyncPipelineStep {
  step: number
  name: string
  description: string
  icon: string
}

export const syncPipeline: SyncPipelineStep[] = [
  { step: 1, name: 'Hash Calculation', description: 'SHA-256 calculado para cada arquivo YAML em knowledge/dna/', icon: '🔐' },
  { step: 2, name: 'Delta Detection', description: 'Comparação com mb-sync-state.json — detecta new/modified/deleted', icon: '🔍' },
  { step: 3, name: 'Knowledge ID Assignment', description: 'Novos arquivos recebem knowledgeId incremental (k-012, k-013...)', icon: '🏷️' },
  { step: 4, name: 'Content Extraction', description: 'Conteúdo extraído do YAML e convertido para Markdown', icon: '📄' },
  { step: 5, name: 'Agent Memory Feed', description: 'Entrada adicionada ao Knowledge Feed do MEMORY.md de cada agente', icon: '🧠' },
  { step: 6, name: 'Knowledge Store', description: 'Conteúdo completo salvo em docs/knowledge/k-###.md', icon: '💾' },
  { step: 7, name: 'State Update', description: 'mb-sync-state.json atualizado com hash + knowledgeId + timestamp', icon: '✅' },
]

export const memoryArchitecture = {
  aioxMemory: {
    name: 'AIOX Agent Memory',
    location: '.aiox-core/development/agents/{agent}/MEMORY.md',
    agents: 10,
    sections: ['Active Patterns', 'Key Patterns', 'Promotion Candidates', 'Archived', 'Knowledge Feed'],
    maxLines: 200,
    syncRule: '.claude/rules/agent-memory-imports.md',
  },
  megaBrainMemory: {
    name: 'Mega Brain Knowledge Base',
    location: 'D:/MEGA BRAIN XD/mega-brain/knowledge/',
    experts: 14,
    dnaLayers: 5,
    yamlFields: ['id', 'nome', 'declaracao', 'evidencias', 'implicacoes', 'conflitos_potenciais', 'dominios', 'peso'],
    contextFile: 'JARVIS-MEMORY.md',
    contextSections: ['Os Fundadores', 'A Empresa', 'Padrões Observados', 'Decisões Tomadas', 'Calibrações Brasil'],
  },
  bridge: {
    name: 'Knowledge Feeder Bridge',
    location: 'packages/knowledge-feeder/',
    syncStateFile: '.aios/mb-sync-state.json',
    totalSynced: 49,
    lastSync: '2026-03-11',
    detectionMethod: 'SHA-256 hash comparison',
  },
  synapse: {
    name: 'Synapse Memory Engine',
    location: '.aiox-core/core/synapse/',
    components: ['engine.js', 'memory/memory-bridge.js', 'memory/synapse-memory-provider.js'],
    cacheKey: '{agentId}-{bracket}',
    timeout: '15ms',
    failMode: 'Fail-open (returns empty array)',
  },
}

export const lowTicketWorkflows = [
  { name: 'New Offer Pipeline', phases: 9, desc: 'Intelligence → Product → Copy → Copy Review → Creative → Funnel Arch → Funnel Build → Traffic → Email' },
  { name: 'Audit Pipeline', phases: 6, desc: 'Parallel analysis of existing materials and competitors' },
  { name: 'Email Nurture Pipeline', phases: 5, desc: 'Welcome → Nurture → Abandonment → Upsell → Reactivation sequences' },
  { name: 'Scaling Pipeline', phases: 4, desc: 'Weekly optimization cycles: SCALE / CUT / TEST decisions' },
  { name: 'Daily Monitor Pipeline', phases: 3, desc: 'Anomaly detection → Alerts → Daily actions' },
]
