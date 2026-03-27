export interface Command {
  name: string
  description: string
  usage: string[]
  category: 'productivity' | 'content' | 'tools'
}

export const slashCommands: Command[] = [
  {
    name: '/atlas',
    description: 'Ativa o agente Atlas, Chief of Staff do Low-Ticket Squad. Coordena todos os 28 agentes especializados.',
    usage: ['/atlas', '/atlas deploy-squad', '/atlas status'],
    category: 'productivity',
  },
  {
    name: '/atlas-briefing',
    description: 'Gera briefing operacional diario com integração Notion. Mostra tasks, deadlines, blockers e foco recomendado.',
    usage: ['/atlas-briefing', '/atlas-briefing --compact'],
    category: 'productivity',
  },
  {
    name: '/custos',
    description: 'Dashboard consolidado de todos os serviços de IA com custos estimados e limites gratuitos.',
    usage: ['/custos'],
    category: 'productivity',
  },
  {
    name: '/weekly-prep',
    description: 'Preparação automática da pauta da weekly. Consolida progresso, blockers e próximos passos.',
    usage: ['/weekly-prep'],
    category: 'productivity',
  },
  {
    name: '/review-day',
    description: 'Fechamento de sessão + log de produtividade. Registra o que foi feito e planeja próxima sessão.',
    usage: ['/review-day'],
    category: 'productivity',
  },
  {
    name: '/ebook',
    description: 'Gerador de ebooks/PDFs profissionais com identidade visual. Puppeteer + HTML/CSS templates.',
    usage: ['/ebook modulo-1', '/ebook modulo-2', '/ebook tracker', '/ebook custom "Titulo"'],
    category: 'content',
  },
  {
    name: '/research',
    description: 'Pesquisa científica com citações reais. Busca artigos, livros, meta-análises e compila resumo estruturado.',
    usage: ['/research "diastasis recti exercise"', '/research --deep "pelvic floor postpartum"'],
    category: 'content',
  },
  {
    name: '/video-tools',
    description: 'Ferramentas de processamento de vídeo via FFmpeg. Concat, audio, trim, export para Meta Ads, thumbnails.',
    usage: ['/video-tools concat', '/video-tools add-audio', '/video-tools trim', '/video-tools export', '/video-tools thumbnail'],
    category: 'tools',
  },
  {
    name: '/checkpoint',
    description: 'Cria snapshot do contexto da conversa atual. Salva o que fizemos, decisões, próximos passos — tudo em .claude/checkpoints/ para retomar depois.',
    usage: ['/checkpoint', '/checkpoint "Titulo custom"', '/checkpoint --tag feature,ui'],
    category: 'productivity',
  },
  {
    name: '/recall',
    description: 'Retoma contexto de sessões anteriores. Lista, busca e carrega checkpoints salvos — permite continuar qualquer conversa em outro ambiente.',
    usage: ['/recall', '/recall --last', '/recall --search "landing page"', '/recall 3'],
    category: 'productivity',
  },
]

export const agentCommands = [
  { prefix: '*help', description: 'Mostrar todos os comandos disponíveis do agente ativo' },
  { prefix: '*create-story', description: 'Criar nova user story a partir de PRD/epic' },
  { prefix: '*task {name}', description: 'Executar task específica do agente' },
  { prefix: '*workflow {name}', description: 'Iniciar workflow multi-agente' },
  { prefix: '*plan', description: 'Criar plano de implementação' },
  { prefix: '*exit', description: 'Sair do modo agente ativo' },
  { prefix: '*kb', description: 'Ativar Knowledge Base mode (AIOX Method)' },
  { prefix: '*status', description: 'Ver contexto e progresso atual' },
  { prefix: '*guide', description: 'Guia completo do agente ativo' },
]

export const activationSyntax = [
  { syntax: '@agent-name', example: '@dev', description: 'Ativa agente AIOX core' },
  { syntax: '/AIOX:agents:agent-name', example: '/AIOX:agents:architect', description: 'Ativa via slash command' },
  { syntax: '/atlas', example: '/atlas', description: 'Ativa Commander Atlas (Low-Ticket Squad)' },
]
