export interface Task {
  name: string
  file: string
  agent: string
  description: string
  category: string
}

export const taskCategories = [
  { id: 'story', label: 'Story Development', icon: '📖', color: 'coral', count: 6 },
  { id: 'qa', label: 'Quality Assurance', icon: '✅', color: 'green', count: 20 },
  { id: 'spec', label: 'Specification Pipeline', icon: '📝', color: 'blue', count: 5 },
  { id: 'db', label: 'Database', icon: '🗄️', color: 'emerald', count: 21 },
  { id: 'dev', label: 'Development', icon: '💻', color: 'coral', count: 7 },
  { id: 'brownfield', label: 'Brownfield Assessment', icon: '🏚️', color: 'amber', count: 4 },
  { id: 'arch', label: 'Architecture & Design', icon: '🏛️', color: 'purple', count: 5 },
  { id: 'ux', label: 'Design System & UX', icon: '🎨', color: 'pink', count: 10 },
  { id: 'epic', label: 'Epic & Backlog', icon: '📋', color: 'blue', count: 10 },
  { id: 'scaffold', label: 'Scaffolding', icon: '🏗️', color: 'menta', count: 7 },
  { id: 'mcp', label: 'MCP & Infrastructure', icon: '⚙️', color: 'red', count: 6 },
  { id: 'github', label: 'GitHub & Git', icon: '🔀', color: 'gray', count: 10 },
  { id: 'docs', label: 'Documentation', icon: '📄', color: 'cyan', count: 7 },
  { id: 'analysis', label: 'Analysis & Research', icon: '🔍', color: 'indigo', count: 13 },
  { id: 'workflow', label: 'Workflow & Automation', icon: '🔄', color: 'menta', count: 11 },
  { id: 'utility', label: 'Utility & Maintenance', icon: '🔧', color: 'gray', count: 40 },
  { id: 'squad', label: 'Squad Management', icon: '🎖️', color: 'gold', count: 11 },
  { id: 'release', label: 'Release & Deployment', icon: '🚀', color: 'red', count: 5 },
  { id: 'security', label: 'Security & Compliance', icon: '🛡️', color: 'red', count: 3 },
]

export const tasks: Task[] = [
  // Story Development
  { name: 'Create Next Story', file: 'create-next-story.md', agent: '@sm', description: 'Criar story a partir de epic/PRD com acceptance criteria, scope e dependências', category: 'story' },
  { name: 'Validate Next Story', file: 'validate-next-story.md', agent: '@po', description: 'Validar story draft com checklist de 10 pontos (GO/NO-GO)', category: 'story' },
  { name: 'Develop Story', file: 'dev-develop-story.md', agent: '@dev', description: 'Implementar story completa (Interactive/YOLO/Pre-Flight modes)', category: 'story' },
  { name: 'Apply QA Fixes', file: 'dev-apply-qa-fixes.md', agent: '@dev', description: 'Aplicar correções baseadas no feedback do QA gate', category: 'story' },
  { name: 'QA Gate', file: 'qa-gate.md', agent: '@qa', description: 'Quality gate com 7 checks: code review, tests, AC, regressions, performance, security, docs', category: 'story' },
  { name: 'Story Checkpoint', file: 'story-checkpoint.md', agent: '@dev', description: 'Checkpoint de progresso mid-development', category: 'story' },

  // Quality Assurance
  { name: 'QA Review Story', file: 'qa-review-story.md', agent: '@qa', description: 'Review de acceptance criteria da story', category: 'qa' },
  { name: 'QA Run Tests', file: 'qa-run-tests.md', agent: '@qa', description: 'Executar e validar suíte de testes', category: 'qa' },
  { name: 'QA Test Design', file: 'qa-test-design.md', agent: '@qa', description: 'Criar test cases a partir de acceptance criteria', category: 'qa' },
  { name: 'QA Generate Tests', file: 'qa-generate-tests.md', agent: '@qa', description: 'Gerar testes automatizados a partir de specs', category: 'qa' },
  { name: 'QA Trace Requirements', file: 'qa-trace-requirements.md', agent: '@qa', description: 'Rastrear requirements → acceptance criteria → implementação', category: 'qa' },
  { name: 'QA NFR Assessment', file: 'qa-nfr-assess.md', agent: '@qa', description: 'Avaliar Non-Functional Requirements (performance, security, etc.)', category: 'qa' },
  { name: 'QA False Positive Detection', file: 'qa-false-positive-detection.md', agent: '@qa', description: 'Detectar falsos positivos em checks de qualidade', category: 'qa' },
  { name: 'QA Migration Validation', file: 'qa-migration-validation.md', agent: '@qa', description: 'Validar migrações de banco de dados', category: 'qa' },
  { name: 'QA Library Validation', file: 'qa-library-validation.md', agent: '@qa', description: 'Validar uso e compatibilidade de bibliotecas', category: 'qa' },
  { name: 'QA Browser Console Check', file: 'qa-browser-console-check.md', agent: '@qa', description: 'Verificar console do browser para erros/warnings', category: 'qa' },
  { name: 'QA Review Build', file: 'qa-review-build.md', agent: '@qa', description: 'Review de build output em 10 fases', category: 'qa' },
  { name: 'QA Review Proposal', file: 'qa-review-proposal.md', agent: '@qa', description: 'Review de propostas de mudanças', category: 'qa' },
  { name: 'QA Risk Profile', file: 'qa-risk-profile.md', agent: '@qa', description: 'Avaliar perfil de risco das mudanças', category: 'qa' },
  { name: 'QA Security Checklist', file: 'qa-security-checklist.md', agent: '@qa', description: 'Checklist de segurança (OWASP)', category: 'qa' },
  { name: 'QA Evidence Requirements', file: 'qa-evidence-requirements.md', agent: '@qa', description: 'Coletar evidências para acceptance criteria', category: 'qa' },
  { name: 'QA Fix Issues', file: 'qa-fix-issues.md', agent: '@qa', description: 'Gerenciar correções e rework', category: 'qa' },
  { name: 'QA Create Fix Request', file: 'qa-create-fix-request.md', agent: '@qa', description: 'Criar request de correção para @dev', category: 'qa' },
  { name: 'QA Backlog Follow-up', file: 'qa-backlog-add-followup.md', agent: '@qa', description: 'Adicionar follow-up items ao backlog', category: 'qa' },
  { name: 'QA After Creation', file: 'qa-after-creation.md', agent: '@qa', description: 'QA após criação inicial da story', category: 'qa' },

  // Spec Pipeline
  { name: 'Gather Requirements', file: 'spec-gather-requirements.md', agent: '@pm', description: 'Coletar requirements de PRD/stakeholders (FR-*, NFR-*, CON-*)', category: 'spec' },
  { name: 'Assess Complexity', file: 'spec-assess-complexity.md', agent: '@architect', description: 'Avaliar complexidade em 5 dimensões (Scope, Integration, Infrastructure, Knowledge, Risk)', category: 'spec' },
  { name: 'Research Dependencies', file: 'spec-research-dependencies.md', agent: '@analyst', description: 'Pesquisar dependências externas, APIs, bibliotecas', category: 'spec' },
  { name: 'Write Spec', file: 'spec-write-spec.md', agent: '@pm', description: 'Escrever especificação formal (Article IV: No Invention enforced)', category: 'spec' },
  { name: 'Critique Spec', file: 'spec-critique.md', agent: '@qa', description: 'Critiquar spec (APPROVED ≥4.0 / NEEDS_REVISION 3.0-3.9 / BLOCKED <3.0)', category: 'spec' },

  // Database
  { name: 'DB Bootstrap', file: 'db-bootstrap.md', agent: '@data-engineer', description: 'Bootstrap schema inicial do banco de dados', category: 'db' },
  { name: 'DB Schema Audit', file: 'db-schema-audit.md', agent: '@data-engineer', description: 'Auditar schema existente para inconsistências', category: 'db' },
  { name: 'DB Domain Modeling', file: 'db-domain-modeling.md', agent: '@data-engineer', description: 'Modelagem de domínio (DDD)', category: 'db' },
  { name: 'DB Apply Migration', file: 'db-apply-migration.md', agent: '@data-engineer', description: 'Aplicar migração de schema', category: 'db' },
  { name: 'DB Rollback', file: 'db-rollback.md', agent: '@data-engineer', description: 'Rollback de migração', category: 'db' },
  { name: 'DB Dry Run', file: 'db-dry-run.md', agent: '@data-engineer', description: 'Dry-run de migração (preview sem aplicar)', category: 'db' },
  { name: 'DB Verify Order', file: 'db-verify-order.md', agent: '@data-engineer', description: 'Verificar ordem de execução das migrações', category: 'db' },
  { name: 'DB Run SQL', file: 'db-run-sql.md', agent: '@data-engineer', description: 'Executar SQL diretamente', category: 'db' },
  { name: 'DB Explain', file: 'db-explain.md', agent: '@data-engineer', description: 'EXPLAIN de query para otimização', category: 'db' },
  { name: 'DB Analyze Hotpaths', file: 'db-analyze-hotpaths.md', agent: '@data-engineer', description: 'Detectar bottlenecks de performance', category: 'db' },
  { name: 'DB Analyze Performance', file: 'db-analyze-performance.md', agent: '@data-engineer', description: 'Análise consolidada de performance', category: 'db' },
  { name: 'DB Seed', file: 'db-seed.md', agent: '@data-engineer', description: 'Seed de dados de teste', category: 'db' },
  { name: 'DB Load CSV', file: 'db-load-csv.md', agent: '@data-engineer', description: 'Carregar dados de arquivo CSV', category: 'db' },
  { name: 'DB Snapshot', file: 'db-snapshot.md', agent: '@data-engineer', description: 'Criar snapshot do banco', category: 'db' },
  { name: 'DB Policy Apply', file: 'db-policy-apply.md', agent: '@data-engineer', description: 'Aplicar políticas RLS (Row-Level Security)', category: 'db' },
  { name: 'DB RLS Audit', file: 'db-rls-audit.md', agent: '@data-engineer', description: 'Auditar configuração RLS', category: 'db' },
  { name: 'DB Env Check', file: 'db-env-check.md', agent: '@data-engineer', description: 'Verificar ambiente de banco de dados', category: 'db' },
  { name: 'DB Supabase Setup', file: 'db-supabase-setup.md', agent: '@data-engineer', description: 'Setup integração Supabase', category: 'db' },
  { name: 'DB Squad Integration', file: 'db-squad-integration.md', agent: '@data-engineer', description: 'Integração de banco squad-specific', category: 'db' },
  { name: 'DB Smoke Test', file: 'db-smoke-test.md', agent: '@data-engineer', description: 'Smoke test de operações CRUD', category: 'db' },
  { name: 'DB Impersonate', file: 'db-impersonate.md', agent: '@data-engineer', description: 'Testar com different database roles', category: 'db' },

  // Development
  { name: 'Improve Code Quality', file: 'dev-improve-code-quality.md', agent: '@dev', description: 'Melhorar qualidade de código existente', category: 'dev' },
  { name: 'Optimize Performance', file: 'dev-optimize-performance.md', agent: '@dev', description: 'Otimizar performance de código', category: 'dev' },
  { name: 'Suggest Refactoring', file: 'dev-suggest-refactoring.md', agent: '@dev', description: 'Sugerir melhorias de refactoring', category: 'dev' },
  { name: 'Backlog Tech Debt', file: 'dev-backlog-debt.md', agent: '@dev', description: 'Gerenciar backlog de technical debt', category: 'dev' },
  { name: 'Build Autonomous', file: 'build-autonomous.md', agent: '@dev', description: 'Build autônomo com retries automáticos', category: 'dev' },
  { name: 'Build Component', file: 'build-component.md', agent: '@dev', description: 'Build de componente individual', category: 'dev' },
  { name: 'Build Project', file: 'build.md', agent: '@dev', description: 'Build completo do projeto', category: 'dev' },

  // Architecture
  { name: 'Analyze Impact', file: 'architect-analyze-impact.md', agent: '@architect', description: 'Analisar impacto de modificações no sistema', category: 'arch' },
  { name: 'Analyze Framework', file: 'analyze-framework.md', agent: '@architect', description: 'Analisar estrutura do AIOX framework', category: 'arch' },
  { name: 'Analyze Cross-Artifact', file: 'analyze-cross-artifact.md', agent: '@qa', description: 'Análise de consistência cross-artifact', category: 'arch' },
  { name: 'Analyze Project Structure', file: 'analyze-project-structure.md', agent: '@architect', description: 'Analisar estrutura do projeto', category: 'arch' },
  { name: 'Analyze Performance', file: 'analyze-performance.md', agent: '@architect', description: 'Análise de performance (queries, hotpaths)', category: 'arch' },

  // UX/Design System
  { name: 'Setup Design System', file: 'setup-design-system.md', agent: '@ux', description: 'Bootstrap design system completo', category: 'ux' },
  { name: 'Create Wireframe', file: 'ux-create-wireframe.md', agent: '@ux', description: 'Criar wireframes de interface', category: 'ux' },
  { name: 'User Research', file: 'ux-user-research.md', agent: '@ux', description: 'Conduzir estudos de user research', category: 'ux' },
  { name: 'DS Scan Artifact', file: 'ux-ds-scan-artifact.md', agent: '@ux', description: 'Escanear artefatos do design system', category: 'ux' },
  { name: 'Bootstrap Shadcn', file: 'bootstrap-shadcn-library.md', agent: '@dev', description: 'Bootstrap biblioteca Shadcn UI', category: 'ux' },
  { name: 'Run DS Pipeline', file: 'run-design-system-pipeline.md', agent: '@ux', description: 'Pipeline completo de design system', category: 'ux' },
  { name: 'Extract Tokens', file: 'extract-tokens.md', agent: '@ux', description: 'Extrair design tokens do projeto', category: 'ux' },
  { name: 'Export Tokens DTCG', file: 'export-design-tokens-dtcg.md', agent: '@ux', description: 'Exportar tokens em formato W3C DTCG', category: 'ux' },
  { name: 'Extend Pattern', file: 'extend-pattern.md', agent: '@ux', description: 'Estender design patterns existentes', category: 'ux' },
  { name: 'Deprecate Component', file: 'deprecate-component.md', agent: '@dev', description: 'Deprecar componentes obsoletos', category: 'ux' },

  // Epic & Backlog
  { name: 'Execute Epic Plan', file: 'execute-epic-plan.md', agent: '@pm', description: 'Executar plano de epic (wave-based parallel)', category: 'epic' },
  { name: 'Manage Story Backlog', file: 'po-manage-story-backlog.md', agent: '@po', description: 'Gerenciar backlog completo de stories', category: 'epic' },
  { name: 'Backlog Add', file: 'po-backlog-add.md', agent: '@po', description: 'Adicionar item ao backlog', category: 'epic' },
  { name: 'Pull Story', file: 'po-pull-story.md', agent: '@po', description: 'Puxar story do backlog para sprint', category: 'epic' },
  { name: 'Pull from ClickUp', file: 'po-pull-story-from-clickup.md', agent: '@po', description: 'Importar story do ClickUp', category: 'epic' },
  { name: 'Close Story', file: 'po-close-story.md', agent: '@po', description: 'Fechar story como Done', category: 'epic' },
  { name: 'Sync Story', file: 'po-sync-story.md', agent: '@po', description: 'Sincronizar status da story', category: 'epic' },
  { name: 'Sync to ClickUp', file: 'po-sync-story-to-clickup.md', agent: '@po', description: 'Exportar story para ClickUp', category: 'epic' },
  { name: 'Stories Index', file: 'po-stories-index.md', agent: '@po', description: 'Indexar todas as stories', category: 'epic' },
  { name: 'Orchestrate', file: 'orchestrate.md', agent: '@pm', description: 'Orquestrar workflow multi-agente', category: 'epic' },

  // MCP & Infrastructure
  { name: 'Add MCP', file: 'add-mcp.md', agent: '@devops', description: 'Adicionar MCP server do catálogo', category: 'mcp' },
  { name: 'Remove MCP', file: 'remove-mcp.md', agent: '@devops', description: 'Remover MCP server', category: 'mcp' },
  { name: 'Search MCP', file: 'search-mcp.md', agent: '@devops', description: 'Buscar MCP no catálogo', category: 'mcp' },
  { name: 'List MCPs', file: 'list-mcps.md', agent: '@devops', description: 'Listar MCPs instalados', category: 'mcp' },
  { name: 'Setup MCP Docker', file: 'setup-mcp-docker.md', agent: '@devops', description: 'Setup Docker MCP infrastructure', category: 'mcp' },
  { name: 'MCP Workflow', file: 'mcp-workflow.md', agent: '@devops', description: 'Orquestração de workflow MCP', category: 'mcp' },

  // GitHub & Git
  { name: 'Setup GitHub', file: 'setup-github.md', agent: '@devops', description: 'Setup repositório GitHub', category: 'github' },
  { name: 'GitHub Issue Triage', file: 'github-issue-triage.md', agent: '@qa', description: 'Triagem de GitHub issues', category: 'github' },
  { name: 'Resolve GitHub Issue', file: 'resolve-github-issue.md', agent: '@dev', description: 'Resolver issue específica', category: 'github' },
  { name: 'PR Automation', file: 'pr-automation.md', agent: '@devops', description: 'Automação de criação de PR', category: 'github' },
  { name: 'Pre-Push Quality Gate', file: 'github-devops-pre-push-quality-gate.md', agent: '@devops', description: 'Gate de qualidade pre-push (MANDATORY)', category: 'github' },
  { name: 'Repository Cleanup', file: 'github-devops-repository-cleanup.md', agent: '@devops', description: 'Limpeza de repositório', category: 'github' },
  { name: 'Version Management', file: 'github-devops-version-management.md', agent: '@devops', description: 'Gerenciamento de versão e releases', category: 'github' },
  { name: 'Review Contributor PR', file: 'review-contributor-pr.md', agent: '@architect', description: 'Review de PR de contribuidor', category: 'github' },

  // Brownfield
  { name: 'Analyze Brownfield', file: 'analyze-brownfield.md', agent: '@architect', description: 'Análise completa de projeto existente', category: 'brownfield' },
  { name: 'Brownfield Create Epic', file: 'brownfield-create-epic.md', agent: '@pm', description: 'Criar epic a partir de análise brownfield', category: 'brownfield' },
  { name: 'Brownfield Create Story', file: 'brownfield-create-story.md', agent: '@sm', description: 'Criar stories para brownfield', category: 'brownfield' },
  { name: 'Create Brownfield Story', file: 'create-brownfield-story.md', agent: '@sm', description: 'Story alternativa para brownfield', category: 'brownfield' },

  // Squad Management
  { name: 'Squad Analyze', file: 'squad-creator-analyze.md', agent: '@pm', description: 'Analisar estrutura de squad', category: 'squad' },
  { name: 'Squad Create', file: 'squad-creator-create.md', agent: '@pm', description: 'Criar novo squad', category: 'squad' },
  { name: 'Squad Design', file: 'squad-creator-design.md', agent: '@pm', description: 'Desenhar configuração de squad', category: 'squad' },
  { name: 'Squad Validate', file: 'squad-creator-validate.md', agent: '@dev', description: 'Validar configuração', category: 'squad' },
  { name: 'Squad Publish', file: 'squad-creator-publish.md', agent: '@pm', description: 'Publicar squad no registry', category: 'squad' },
  { name: 'Squad Extend', file: 'squad-creator-extend.md', agent: '@pm', description: 'Estender capabilities', category: 'squad' },
  { name: 'Squad List', file: 'squad-creator-list.md', agent: '@pm', description: 'Listar squads disponíveis', category: 'squad' },
  { name: 'Squad Migrate', file: 'squad-creator-migrate.md', agent: '@pm', description: 'Migrar configuração', category: 'squad' },
  { name: 'Integrate Squad', file: 'integrate-squad.md', agent: '@dev', description: 'Integrar squad no projeto', category: 'squad' },

  // Security
  { name: 'Security Scan', file: 'security-scan.md', agent: '@qa', description: 'Scan de vulnerabilidades', category: 'security' },
  { name: 'Security Audit', file: 'security-audit.md', agent: '@qa', description: 'Audit de segurança completo', category: 'security' },
  { name: 'Security Checklist', file: 'qa-security-checklist.md', agent: '@qa', description: 'Checklist OWASP de segurança', category: 'security' },

  // Release
  { name: 'Release Management', file: 'release-management.md', agent: '@devops', description: 'Workflow completo de release', category: 'release' },
  { name: 'Publish NPM', file: 'publish-npm.md', agent: '@devops', description: 'Publicar pacote no npm', category: 'release' },
  { name: 'CI/CD Configuration', file: 'ci-cd-configuration.md', agent: '@devops', description: 'Configurar pipeline CI/CD', category: 'release' },
  { name: 'Environment Bootstrap', file: 'environment-bootstrap.md', agent: '@devops', description: 'Bootstrap de ambiente', category: 'release' },
  { name: 'Setup Database', file: 'setup-database.md', agent: '@devops', description: 'Setup de banco de dados', category: 'release' },
]

export const totalTasks = 207
