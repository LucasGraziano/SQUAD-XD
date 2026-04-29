export interface WorkflowPhase {
  number: number
  agent: string
  agentIcon: string
  task: string
  output: string
  description: string
}

export interface Workflow {
  id: string
  name: string
  type: string
  category: 'meta' | 'greenfield' | 'brownfield'
  description: string
  phases: WorkflowPhase[]
  whenToUse: string
  complexity?: 'any' | 'simple' | 'standard' | 'complex'
}

export const workflows: Workflow[] = [
  {
    id: 'story-development-cycle',
    name: 'Story Development Cycle (SDC)',
    type: 'PRIMARY',
    category: 'meta',
    description: 'Full 4-phase workflow for all development work. Create → Validate → Implement → QA Review.',
    whenToUse: 'New story from epic, any development task',
    phases: [
      { number: 1, agent: 'sm', agentIcon: '🌊', task: 'create-next-story.md', output: 'story.md', description: 'Create story from PRD/epic' },
      { number: 2, agent: 'po', agentIcon: '🎯', task: 'validate-next-story.md', output: 'GO/NO-GO verdict', description: '10-point validation checklist' },
      { number: 3, agent: 'dev', agentIcon: '💻', task: 'dev-develop-story.md', output: 'Working code', description: 'Implement with CodeRabbit self-healing' },
      { number: 4, agent: 'qa', agentIcon: '✅', task: 'qa-gate.md', output: 'PASS/FAIL verdict', description: '7-point quality gate' },
    ],
  },
  {
    id: 'qa-loop',
    name: 'QA Loop',
    type: 'ITERATIVE',
    category: 'meta',
    description: 'Automated review-fix cycle. @qa reviews → verdict → @dev fixes → re-review (max 5 iterations).',
    whenToUse: 'QA found issues, need iteration',
    phases: [
      { number: 1, agent: 'qa', agentIcon: '✅', task: 'qa-review', output: 'APPROVE/REJECT/BLOCKED', description: 'Review code quality and criteria' },
      { number: 2, agent: 'dev', agentIcon: '💻', task: 'dev-apply-qa-fixes', output: 'Fixed code', description: 'Apply fixes from QA feedback' },
      { number: 3, agent: 'qa', agentIcon: '✅', task: 'qa-re-review', output: 'Final verdict', description: 'Re-review after fixes (max 5x)' },
    ],
  },
  {
    id: 'spec-pipeline',
    name: 'Spec Pipeline',
    type: 'PRE-IMPLEMENTATION',
    category: 'meta',
    description: 'Transform informal requirements into executable spec. 6 phases with complexity-based phase skipping.',
    whenToUse: 'Complex feature needs spec before coding',
    phases: [
      { number: 1, agent: 'pm', agentIcon: '📋', task: 'spec-gather', output: 'requirements.json', description: 'Gather requirements (never skip)' },
      { number: 2, agent: 'architect', agentIcon: '📐', task: 'spec-assess', output: 'complexity.json', description: 'Assess complexity (5 dimensions, score 1-25)' },
      { number: 3, agent: 'analyst', agentIcon: '🔍', task: 'spec-research', output: 'research.json', description: 'Research dependencies (skip if SIMPLE)' },
      { number: 4, agent: 'pm', agentIcon: '📋', task: 'spec-write', output: 'spec.md', description: 'Write specification (never skip)' },
      { number: 5, agent: 'qa', agentIcon: '✅', task: 'spec-critique', output: 'critique.json', description: 'Critique spec (APPROVED/NEEDS_REVISION/BLOCKED)' },
      { number: 6, agent: 'architect', agentIcon: '📐', task: 'spec-plan', output: 'implementation.yaml', description: 'Implementation plan (if APPROVED)' },
    ],
  },
  {
    id: 'brownfield-discovery',
    name: 'Brownfield Discovery',
    type: 'ASSESSMENT',
    category: 'brownfield',
    description: '10-phase technical debt assessment for existing codebases. Data collection → drafting → validation → finalization.',
    whenToUse: 'Joining existing project, legacy assessment',
    phases: [
      { number: 1, agent: 'architect', agentIcon: '📐', task: 'analyze-brownfield', output: 'system-architecture.md', description: 'System architecture analysis' },
      { number: 2, agent: 'data-engineer', agentIcon: '🗄️', task: 'db-schema-audit', output: 'SCHEMA.md + DB-AUDIT.md', description: 'Database audit (if DB exists)' },
      { number: 3, agent: 'ux-design-expert', agentIcon: '🎨', task: 'frontend-spec', output: 'frontend-spec.md', description: 'Frontend specification' },
      { number: 4, agent: 'architect', agentIcon: '📐', task: 'tech-debt-draft', output: 'technical-debt-DRAFT.md', description: 'Technical debt draft' },
      { number: 5, agent: 'data-engineer', agentIcon: '🗄️', task: 'db-review', output: 'db-specialist-review.md', description: 'Database specialist review' },
      { number: 6, agent: 'ux-design-expert', agentIcon: '🎨', task: 'ux-review', output: 'ux-specialist-review.md', description: 'UX specialist review' },
      { number: 7, agent: 'qa', agentIcon: '✅', task: 'qa-review', output: 'qa-review.md', description: 'QA gate (APPROVED/NEEDS WORK)' },
      { number: 8, agent: 'architect', agentIcon: '📐', task: 'finalize', output: 'technical-debt-assessment.md', description: 'Final assessment document' },
      { number: 9, agent: 'analyst', agentIcon: '🔍', task: 'executive-report', output: 'TECHNICAL-DEBT-REPORT.md', description: 'Executive summary report' },
      { number: 10, agent: 'pm', agentIcon: '📋', task: 'epic-stories', output: 'Epic + stories', description: 'Create epic and stories for fixes' },
    ],
  },

  // ─── GREENFIELD WORKFLOWS ───────────────────────────────────────────────────

  {
    id: 'greenfield-fullstack',
    name: 'Greenfield Full-Stack',
    type: 'GREENFIELD',
    category: 'greenfield',
    description: 'Projeto novo do zero, aplicação full-stack completa. PRD → Arquitetura → Schema → UX → Epics → Stories → Dev.',
    whenToUse: 'Novo produto SaaS, app web/mobile, sistema completo — nenhum código existente',
    complexity: 'complex',
    phases: [
      { number: 1, agent: 'analyst', agentIcon: '🔍', task: 'create-project-brief', output: 'project-brief.md', description: 'Brief do projeto, persona, mercado' },
      { number: 2, agent: 'pm', agentIcon: '📋', task: 'create-prd', output: 'PRD.md', description: 'Product Requirements Document completo' },
      { number: 3, agent: 'architect', agentIcon: '🏛️', task: 'create-full-stack-architecture', output: 'architecture.md', description: 'Stack, infraestrutura, API design' },
      { number: 4, agent: 'data-engineer', agentIcon: '🗄️', task: 'create-schema', output: 'SCHEMA.md', description: 'Schema de banco, RLS, migrations' },
      { number: 5, agent: 'ux-design-expert', agentIcon: '🎨', task: 'setup', output: 'design-system.md', description: 'Design system, tokens, atomic components' },
      { number: 6, agent: 'pm', agentIcon: '📋', task: 'create-epic', output: 'epic-{N}.yaml', description: 'Epics estruturados (wave-based)' },
      { number: 7, agent: 'sm', agentIcon: '🌊', task: 'draft', output: 'stories/*.md', description: 'User stories com acceptance criteria' },
      { number: 8, agent: 'po', agentIcon: '🎯', task: 'validate-story-draft', output: 'GO/NO-GO', description: '10-point validation checklist' },
      { number: 9, agent: 'dev', agentIcon: '💻', task: 'dev-develop-story', output: 'Working code', description: 'Implementação iterativa por story' },
      { number: 10, agent: 'qa', agentIcon: '✅', task: 'qa-gate', output: 'PASS/FAIL', description: 'Quality gate final' },
      { number: 11, agent: 'devops', agentIcon: '🚀', task: 'push + create-pr', output: 'PR + deploy', description: 'Push, PR e deploy (exclusivo @devops)' },
    ],
  },

  {
    id: 'greenfield-service',
    name: 'Greenfield Service/API',
    type: 'GREENFIELD',
    category: 'greenfield',
    description: 'Novo microservice, API REST/GraphQL ou backend service. Foco em arquitetura e contrato de API.',
    whenToUse: 'Novo serviço backend, API, microservice, worker — sem frontend',
    complexity: 'standard',
    phases: [
      { number: 1, agent: 'pm', agentIcon: '📋', task: 'create-prd', output: 'PRD.md', description: 'Requisitos e escopo do serviço' },
      { number: 2, agent: 'architect', agentIcon: '🏛️', task: 'create-backend-architecture', output: 'architecture.md', description: 'API design, patterns, integrações' },
      { number: 3, agent: 'data-engineer', agentIcon: '🗄️', task: 'create-schema', output: 'SCHEMA.md', description: 'Schema e queries otimizadas' },
      { number: 4, agent: 'sm', agentIcon: '🌊', task: 'draft', output: 'stories/*.md', description: 'Stories por endpoint/domínio' },
      { number: 5, agent: 'dev', agentIcon: '💻', task: 'dev-develop-story', output: 'Working code', description: 'Implementação com testes' },
      { number: 6, agent: 'qa', agentIcon: '✅', task: 'qa-gate', output: 'PASS/FAIL', description: 'Security audit + API contract check' },
      { number: 7, agent: 'devops', agentIcon: '🚀', task: 'push + create-pr', output: 'PR + deploy', description: 'Push e deploy' },
    ],
  },

  {
    id: 'greenfield-ui',
    name: 'Greenfield UI/Frontend',
    type: 'GREENFIELD',
    category: 'greenfield',
    description: 'Nova interface, landing page, design system ou componentes frontend. Foco em UX e atomic design.',
    whenToUse: 'Nova UI, landing page, design system, componentes React — API já existe ou mock',
    complexity: 'standard',
    phases: [
      { number: 1, agent: 'ux-design-expert', agentIcon: '🎨', task: 'research', output: 'ux-research.md', description: 'User research e personas' },
      { number: 2, agent: 'architect', agentIcon: '🏛️', task: 'create-front-end-architecture', output: 'frontend-architecture.md', description: 'Stack frontend, routing, state management' },
      { number: 3, agent: 'ux-design-expert', agentIcon: '🎨', task: 'tokenize', output: 'design-tokens.md', description: 'Design tokens (cores, tipografia, espaçamento)' },
      { number: 4, agent: 'sm', agentIcon: '🌊', task: 'draft', output: 'stories/*.md', description: 'Stories por componente/página' },
      { number: 5, agent: 'dev', agentIcon: '💻', task: 'dev-develop-story', output: 'Working UI', description: 'Implementação com Atomic Design' },
      { number: 6, agent: 'ux-design-expert', agentIcon: '🎨', task: 'a11y-check', output: 'WCAG report', description: 'Verificação de acessibilidade' },
      { number: 7, agent: 'qa', agentIcon: '✅', task: 'qa-gate', output: 'PASS/FAIL', description: 'Visual + functional QA gate' },
      { number: 8, agent: 'devops', agentIcon: '🚀', task: 'push + create-pr', output: 'PR + deploy', description: 'Push e deploy' },
    ],
  },

  // ─── BROWNFIELD VARIANTS ─────────────────────────────────────────────────────

  {
    id: 'brownfield-fullstack',
    name: 'Brownfield Full-Stack',
    type: 'BROWNFIELD',
    category: 'brownfield',
    description: 'Modernização ou refactor de aplicação full-stack existente. Assessment completo antes de qualquer mudança.',
    whenToUse: 'App legada com dívida técnica, refactor completo, migração de stack',
    complexity: 'complex',
    phases: [
      { number: 1, agent: 'architect', agentIcon: '🏛️', task: 'analyze-brownfield', output: 'system-architecture.md', description: 'Mapear arquitetura atual' },
      { number: 2, agent: 'data-engineer', agentIcon: '🗄️', task: 'db-schema-audit', output: 'DB-AUDIT.md', description: 'Audit do banco de dados' },
      { number: 3, agent: 'ux-design-expert', agentIcon: '🎨', task: 'audit', output: 'ux-audit.md', description: 'Audit de UX e design system' },
      { number: 4, agent: 'qa', agentIcon: '✅', task: 'audit-codebase', output: 'qa-review.md', description: 'QA gate: APPROVED/NEEDS WORK' },
      { number: 5, agent: 'architect', agentIcon: '🏛️', task: 'finalize', output: 'technical-debt-assessment.md', description: 'Assessment final com roadmap' },
      { number: 6, agent: 'pm', agentIcon: '📋', task: 'create-epic', output: 'epics/*.yaml', description: 'Epics de modernização' },
    ],
  },

  {
    id: 'brownfield-service',
    name: 'Brownfield Service',
    type: 'BROWNFIELD',
    category: 'brownfield',
    description: 'Refactor ou migração de serviço/API existente. Análise de dependências e risco antes de modificar.',
    whenToUse: 'Refactor de API legada, migração de ORM, mudança de banco, breaking changes',
    complexity: 'standard',
    phases: [
      { number: 1, agent: 'architect', agentIcon: '🏛️', task: 'map-codebase', output: 'service-map.md', description: 'Mapear serviço e dependências' },
      { number: 2, agent: 'data-engineer', agentIcon: '🗄️', task: 'db-schema-audit', output: 'DB-AUDIT.md', description: 'Audit do schema e queries' },
      { number: 3, agent: 'architect', agentIcon: '🏛️', task: 'analyze-impact', output: 'impact-analysis.md', description: 'Análise de impacto de mudanças' },
      { number: 4, agent: 'sm', agentIcon: '🌊', task: 'draft', output: 'stories/*.md', description: 'Stories de refactor segmentadas' },
      { number: 5, agent: 'dev', agentIcon: '💻', task: 'dev-develop-story', output: 'Refactored service', description: 'Refactor incremental' },
      { number: 6, agent: 'qa', agentIcon: '✅', task: 'qa-gate', output: 'PASS/FAIL', description: 'QA gate com foco em regressão' },
    ],
  },

  {
    id: 'brownfield-ui',
    name: 'Brownfield UI',
    type: 'BROWNFIELD',
    category: 'brownfield',
    description: 'Redesign ou refactor de frontend existente. Audit de design system + consolidação de componentes.',
    whenToUse: 'Redesign de UI legada, migração de CSS framework, consolidar design system existente',
    complexity: 'standard',
    phases: [
      { number: 1, agent: 'ux-design-expert', agentIcon: '🎨', task: 'audit', output: 'design-audit.md', description: 'Audit completo do design atual' },
      { number: 2, agent: 'ux-design-expert', agentIcon: '🎨', task: 'shock-report', output: 'shock-report.md', description: 'Relatório de inconsistências visuais' },
      { number: 3, agent: 'ux-design-expert', agentIcon: '🎨', task: 'consolidate', output: 'consolidation-plan.md', description: 'Plano de consolidação de componentes' },
      { number: 4, agent: 'architect', agentIcon: '🏛️', task: 'create-front-end-architecture', output: 'frontend-architecture.md', description: 'Nova arquitetura frontend' },
      { number: 5, agent: 'sm', agentIcon: '🌊', task: 'draft', output: 'stories/*.md', description: 'Stories de migração por componente' },
      { number: 6, agent: 'dev', agentIcon: '💻', task: 'dev-develop-story', output: 'Migrated UI', description: 'Migração incremental' },
      { number: 7, agent: 'qa', agentIcon: '✅', task: 'qa-gate', output: 'PASS/FAIL', description: 'QA visual + WCAG check' },
    ],
  },
]

export const workflowSelectionGuide = [
  // Meta-workflows
  { situation: 'Nova story de um epic', workflow: 'Story Development Cycle', category: 'meta' },
  { situation: 'QA encontrou problemas, precisa iterar', workflow: 'QA Loop', category: 'meta' },
  { situation: 'Feature complexa precisa de spec', workflow: 'Spec Pipeline → então SDC', category: 'meta' },
  { situation: 'Bug fix simples', workflow: 'SDC — modo YOLO', category: 'meta' },
  // Greenfield
  { situation: 'Produto novo do zero (full-stack)', workflow: 'Greenfield Full-Stack', category: 'greenfield' },
  { situation: 'Novo backend / API / microservice', workflow: 'Greenfield Service', category: 'greenfield' },
  { situation: 'Nova UI / landing page / design system', workflow: 'Greenfield UI', category: 'greenfield' },
  // Brownfield
  { situation: 'Entrando em projeto existente (assessment)', workflow: 'Brownfield Discovery', category: 'brownfield' },
  { situation: 'Modernizar app legada completa', workflow: 'Brownfield Full-Stack', category: 'brownfield' },
  { situation: 'Refactor/migrar serviço existente', workflow: 'Brownfield Service', category: 'brownfield' },
  { situation: 'Redesign ou refactor de UI legada', workflow: 'Brownfield UI', category: 'brownfield' },
]

export type WorkflowCategory = 'all' | 'meta' | 'greenfield' | 'brownfield'
