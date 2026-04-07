export interface Domain {
  id: string
  name: string
  expertCount: number
  agents: string[]
  description: string
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

export const knowledgeVersion = '2.0.0'

export const domains: Domain[] = [
  {
    id: 'copy-persuasion',
    name: 'Copy & Persuasion',
    expertCount: 5,
    agents: ['copy-chief', 'analyst'],
    description: 'Headlines, hooks, emotional triggers, awareness levels, long-form copy',
  },
  {
    id: 'offers-pricing',
    name: 'Offers & Pricing',
    expertCount: 3,
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
    expertCount: 3,
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
    expertCount: 4,
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
  { command: '/ingest', description: 'Extrair DNA cognitivo de video, transcricao ou texto', mode: 'DNA v2 (5 camadas) ou --mode simple (3 campos)' },
  { command: '/dossier', description: 'Gerar dossier cross-source de um tema ou dominio', mode: '/dossier {tema} ou /dossier --auto {dominio}' },
  { command: '/playbook', description: 'Consultar ou gerar playbook operacional', mode: '/playbook {nome} ou /playbook --generate {tema}' },
  { command: '/conclave', description: 'Deliberacao multi-agente com CRITIC + ADVOCATE + SYNTHESIZER', mode: '/conclave {pergunta} ou /conclave --v1 {pergunta}' },
  { command: '*knowledge', description: 'Carregar conhecimento dentro de um agente ativo', mode: '*knowledge {domain|expert|dossier:X|playbook:X}' },
  { command: '*remember', description: 'Salvar memoria persistente do agente', mode: '*remember {tipo} {conteudo}' },
  { command: '*recall', description: 'Ver memorias do agente ativo', mode: '*recall ou *recall --project {nome}' },
]
