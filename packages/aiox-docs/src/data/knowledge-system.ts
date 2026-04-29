export interface Domain {
  id: string
  name: string
  expertCount: number
  agents: string[]
  description: string
}

export interface Expert {
  id: string
  name: string
  domains: string[]
  specialty: string
}

export interface Dossier {
  id: string
  name: string
  sources: string[]
  agents: string[]
  description: string
  tokenBudget: number
}

export interface Playbook {
  id: string
  name: string
  sourceDossier: string
  agents: string[]
  description: string
  tokenBudget: number
}

export interface DnaLayer {
  level: string
  name: string
  maxItems: number
  test: string
  description: string
}

export interface WikiLayer {
  id: string
  name: string
  description: string
  path: string
  immutable: boolean
}

export const knowledgeVersion = '3.1.0'

export const domains: Domain[] = [
  {
    id: 'copy-persuasion',
    name: 'Copy & Persuasion',
    expertCount: 7,
    agents: ['copy-chief', 'analyst'],
    description: 'Headlines, hooks, emotional triggers, awareness levels, long-form copy',
  },
  {
    id: 'offers-pricing',
    name: 'Offers & Pricing',
    expertCount: 4,
    agents: ['pm', 'analyst', 'commander'],
    description: 'Offer creation, value equation, pricing, stacking, guarantees',
  },
  {
    id: 'sales-closing',
    name: 'Sales & Closing',
    expertCount: 3,
    agents: ['analyst', 'copy-chief'],
    description: 'Discovery, objection handling, closing, NEPQ, call funnels',
  },
  {
    id: 'traffic-ads',
    name: 'Traffic & Ads',
    expertCount: 5,
    agents: ['traffic-head', 'creative-director'],
    description: 'Meta Ads, creative testing, scaling, audiences, kill rules',
  },
  {
    id: 'funnels-value-ladder',
    name: 'Funnels & Value Ladder',
    expertCount: 3,
    agents: ['funnel-chief', 'pm', 'architect'],
    description: 'Quiz funnels, VSL, value ladders, bump/upsell, conversion',
  },
  {
    id: 'systems-ops',
    name: 'Systems & Ops',
    expertCount: 3,
    agents: ['pm', 'sm', 'architect'],
    description: 'Business OS, team structure, processes, GTD, Scrum',
  },
  {
    id: 'psychology-influence',
    name: 'Psychology & Influence',
    expertCount: 3,
    agents: ['copy-chief', 'analyst', 'creative-director'],
    description: 'Persuasion principles, cognitive biases, emotional triggers',
  },
  {
    id: 'ai-native-build',
    name: 'AI-Native Build',
    expertCount: 3,
    agents: ['aios-master', 'architect', 'dev', 'commander'],
    description: 'Claude Code operations: skills, hooks, DESIGN.md, token optimization, agent systems, Plan Mode',
  },
]

export const experts: Expert[] = [
  { id: 'doug', name: 'Doug', domains: ['copy-persuasion', 'offers-pricing', 'sales-closing', 'traffic-ads', 'funnels-value-ladder', 'systems-ops', 'psychology-influence'], specialty: 'Multi-domínio — DNA v3 cross-domain' },
  { id: 'hard-copy', name: 'Hard Copy (Kleiver)', domains: ['copy-persuasion', 'traffic-ads', 'funnels-value-ladder', 'psychology-influence'], specialty: 'Copy brasileira, storytelling, persuasão emocional' },
  { id: 'jim-edwards', name: 'Jim Edwards', domains: ['copy-persuasion'], specialty: 'Fórmulas de copy, hooks, bullets' },
  { id: 'agora-inc', name: 'Agora Inc', domains: ['copy-persuasion'], specialty: 'Long-form copy, leads, direct response' },
  { id: 'diogo-kobata', name: 'Diogo Kobata', domains: ['copy-persuasion'], specialty: 'Copy em português, storytelling, VSL' },
  { id: 'blair-warren', name: 'Blair Warren', domains: ['copy-persuasion', 'psychology-influence'], specialty: 'Persuasão profunda, One Sentence Persuasion' },
  { id: 'russell-brunson', name: 'Russell Brunson', domains: ['copy-persuasion', 'offers-pricing', 'funnels-value-ladder'], specialty: 'Funis, value ladder, epiphany bridge' },
  { id: 'alex-hormozi', name: 'Alex Hormozi', domains: ['offers-pricing'], specialty: 'Value equation, offer stacking, garantias' },
  { id: 'jeremy-haynes', name: 'Jeremy Haynes', domains: ['offers-pricing', 'traffic-ads'], specialty: 'Meta Ads, scaling, creative testing' },
  { id: 'jeremy-miner', name: 'Jeremy Miner', domains: ['sales-closing'], specialty: 'NEPQ, perguntas de fechamento, call funnels' },
  { id: 'cole-gordon', name: 'Cole Gordon', domains: ['sales-closing'], specialty: 'High-ticket closing, objeções, setter/closer' },
  { id: 'richard-linder', name: 'Richard Linder', domains: ['traffic-ads'], specialty: 'Criativo em tráfego pago, ad angles' },
  { id: 'jordan-lee', name: 'Jordan Lee', domains: ['traffic-ads'], specialty: 'Audiências, targeting, funil de tráfego' },
  { id: 'the-scalable-company', name: 'The Scalable Company', domains: ['systems-ops'], specialty: 'Business OS, ScalableOS, processos de escala' },
  { id: 'sam-oven', name: 'Sam Oven', domains: ['systems-ops'], specialty: 'Simplificação, foco, coaching business' },
  { id: 'mateus-dias', name: 'Mateus Dias', domains: ['ai-native-build'], specialty: '22 agentes, 8 squads, Plan Mode, CLAUDE.md como contrato' },
  { id: 'chase', name: 'Chase', domains: ['ai-native-build'], specialty: 'Skills, hooks, CLIs, token economy, adversarial review' },
  { id: 'alon', name: 'Alon', domains: ['ai-native-build'], specialty: 'DESIGN.md protocol, design tokens, anti-AI-slop' },
]

export const dossiers: Dossier[] = [
  {
    id: 'copywriting-persuasion',
    name: 'Copywriting & Persuasion',
    sources: ['agora-inc', 'blair-warren', 'jim-edwards', 'russell-brunson', 'diogo-kobata'],
    agents: ['copy-chief', 'creative-director'],
    description: 'Convergencias de persuasao e copy entre 5 experts',
    tokenBudget: 1000,
  },
  {
    id: 'traffic-acquisition',
    name: 'Traffic Acquisition',
    sources: ['jeremy-haynes', 'richard-linder', 'jordan-lee'],
    agents: ['traffic-head', 'creative-director'],
    description: 'Convergencias de aquisicao de trafego entre 3 experts',
    tokenBudget: 1000,
  },
  {
    id: 'funnels-value-ladder',
    name: 'Funnels & Value Ladder',
    sources: ['russell-brunson', 'jeremy-haynes', 'sam-oven'],
    agents: ['funnel-chief', 'pm'],
    description: 'Convergencias de funis e value ladder entre 3 experts',
    tokenBudget: 1000,
  },
  {
    id: 'offers-pricing',
    name: 'Offers & Pricing',
    sources: ['alex-hormozi', 'russell-brunson', 'jeremy-haynes'],
    agents: ['pm', 'analyst', 'commander'],
    description: 'Convergencias de ofertas e pricing entre 3 experts',
    tokenBudget: 1000,
  },
  {
    id: 'risk-management',
    name: 'Risk Management',
    sources: ['alex-hormozi', 'cole-gordon', 'jeremy-miner'],
    agents: ['analyst', 'pm', 'commander'],
    description: 'Convergencias de gestao de risco entre 3 experts',
    tokenBudget: 1000,
  },
  {
    id: 'process-improvement',
    name: 'Process Improvement',
    sources: ['the-scalable-company', 'sam-oven', 'david-allen', 'ken-schwaber'],
    agents: ['pm', 'sm', 'architect'],
    description: 'Convergencias de melhoria de processos entre 4 experts',
    tokenBudget: 1000,
  },
  {
    id: 'ai-native-operator-system',
    name: 'AI-Native Operator System',
    sources: ['mateus-dias', 'chase', 'alon', '+7 fontes'],
    agents: ['aios-master', 'architect', 'dev', 'commander'],
    description: 'Convergência de 10 transcrições sobre Claude Code — skills, hooks, DESIGN.md, token economy, context hygiene, model hierarchy',
    tokenBudget: 950,
  },
]

export const playbooks: Playbook[] = [
  {
    id: 'operating-system',
    name: 'Business Operating System',
    sourceDossier: 'process-improvement',
    agents: ['pm', 'commander', 'sm'],
    description: 'Business OS (ScalableOS + GTD + Scrum) — cadencia operacional',
    tokenBudget: 800,
  },
  {
    id: 'meeting-rhythm',
    name: 'Meeting Rhythm',
    sourceDossier: 'process-improvement',
    agents: ['pm', 'commander'],
    description: 'Cadencia QSP > MBR > Weekly > 1:1',
    tokenBudget: 800,
  },
  {
    id: 'referral-system',
    name: 'Referral System',
    sourceDossier: 'risk-management',
    agents: ['analyst', 'pm'],
    description: '6 microcommitments > 10 nomes — sistema de referral',
    tokenBudget: 800,
  },
  {
    id: 'sales-productivity',
    name: 'Sales Productivity',
    sourceDossier: 'offers-pricing',
    agents: ['analyst', 'pm'],
    description: 'PTB + time blocking + batching — produtividade em vendas',
    tokenBudget: 800,
  },
  {
    id: 'ai-native-project-setup',
    name: 'AI-Native Project Setup',
    sourceDossier: 'ai-native-operator-system',
    agents: ['aios-master', 'commander', 'architect', 'dev'],
    description: 'Checklist de 4 fases para setup de projeto Claude Code — CLAUDE.md, DESIGN.md, skills, hooks, quality KPIs',
    tokenBudget: 750,
  },
]

export const dnaLayers: DnaLayer[] = [
  {
    level: 'L1',
    name: 'Filosofias',
    maxItems: 8,
    test: 'Se removesse, 50%+ das decisoes mudariam?',
    description: 'Crencas fundamentais que guiam todas as decisoes do expert',
  },
  {
    level: 'L2',
    name: 'Modelos Mentais',
    maxItems: 6,
    test: 'Usa para PENSAR, nao para FAZER?',
    description: 'Frameworks cognitivos que o expert usa para analisar situacoes',
  },
  {
    level: 'L3',
    name: 'Heuristicas',
    maxItems: 8,
    test: 'Tem threshold quantitativo?',
    description: 'Regras praticas com NUMEROS — thresholds, ratios, limites',
  },
  {
    level: 'L4',
    name: 'Frameworks',
    maxItems: 5,
    test: 'Tem passos sequenciais?',
    description: 'Processos step-by-step accionaveis',
  },
  {
    level: 'L5',
    name: 'Metodologias',
    maxItems: 3,
    test: 'Implementacao completa A->Z?',
    description: 'Guias de implementacao de ponta a ponta',
  },
]

export const wikiLayers: WikiLayer[] = [
  {
    id: 'raw',
    name: 'RAW/',
    description: 'Fontes brutas — imutáveis. Sessões, campanhas, pesquisas, frameworks descobertos.',
    path: '.aiox-core/knowledge/RAW/',
    immutable: true,
  },
  {
    id: 'wiki',
    name: 'WIKI/',
    description: 'Artigos compilados pelo LLM. Indexados em index.md, log append-only em log.md.',
    path: '.aiox-core/knowledge/WIKI/',
    immutable: false,
  },
]

export const dnaV3Features = [
  {
    id: 'decision-map',
    name: '_decision-map.md',
    description: 'Mapa de decisão por domínio — quando usar qual framework/expert para cada situação',
    command: null,
  },
  {
    id: 'anti-patterns',
    name: '_anti-patterns.md',
    description: 'Anti-padrões conhecidos por domínio — erros frequentes com contexto e solução',
    command: null,
  },
]

export const tokenBudgets = {
  indexOnly: 50,
  singleExpert: 500,
  singleDna: 700,
  singleDossier: 1000,
  singlePlaybook: 800,
  fullDomain: 2500,
  maxPerSession: 5000,
}

export const knowledgeCommands = [
  { command: '/ingest', description: 'Extrair DNA cognitivo de video, transcricao ou texto', mode: 'DNA v3 (5 camadas) ou --mode simple (3 campos)' },
  { command: '/dossier', description: 'Gerar dossier cross-source de um tema ou dominio', mode: '/dossier {tema} ou /dossier --auto {dominio}' },
  { command: '/playbook', description: 'Consultar ou gerar playbook operacional', mode: '/playbook {nome} ou /playbook --generate {tema}' },
  { command: '/conclave', description: 'Deliberacao multi-agente com CRITIC + ADVOCATE + SYNTHESIZER', mode: '/conclave {pergunta} ou /conclave --v1 {pergunta}' },
  { command: '/wiki-ingest', description: 'Ingerir fonte no wiki compounding (URL ou path)', mode: '/wiki-ingest <url|path> — usa defuddle para URLs' },
  { command: '/wiki-query', description: 'Buscar no conhecimento acumulado do wiki', mode: '/wiki-query "<pergunta>" — sintetiza com citações' },
  { command: '/wiki-lint', description: 'Verificar qualidade e integridade do wiki', mode: '/wiki-lint — auto-fix links, reporta contradições' },
  { command: '/wiki-status', description: 'Ver índice e log de operações do wiki', mode: '/wiki-status — tabela de artigos + últimas 10 ops' },
  { command: '*knowledge', description: 'Carregar conhecimento dentro de um agente ativo', mode: '*knowledge {domain|expert|dossier:X|playbook:X}' },
  { command: '*remember', description: 'Salvar memoria persistente do agente', mode: '*remember {tipo} {conteudo}' },
  { command: '*recall', description: 'Ver memorias do agente ativo', mode: '*recall ou *recall --project {nome}' },
]
