export interface Article {
  number: string
  name: string
  severity: 'NON-NEGOTIABLE' | 'MUST' | 'SHOULD'
  icon: string
  description: string
  rules: string[]
  enforcement: string
}

export const articles: Article[] = [
  {
    number: 'I',
    name: 'CLI First',
    severity: 'NON-NEGOTIABLE',
    icon: '⌨️',
    description: 'Toda funcionalidade DEVE funcionar 100% via CLI antes de qualquer UI.',
    rules: [
      'CLI tem prioridade máxima — é a interface primária',
      'Observabilidade é secundária — dashboards observam, nunca controlam',
      'UI é terciária — só quando CLI e observabilidade estão completos',
      'Nenhum agente pode criar UI antes do CLI funcionar',
    ],
    enforcement: 'Gate automático bloqueia qualquer PR que adicione UI sem CLI equivalente',
  },
  {
    number: 'II',
    name: 'Agent Authority',
    severity: 'NON-NEGOTIABLE',
    icon: '🛡️',
    description: 'Cada agente tem autoridade exclusiva sobre seu domínio. Violações são bloqueadas.',
    rules: [
      '@devops é EXCLUSIVO para git push, PR creation, releases e MCP management',
      '@sm/@po são EXCLUSIVOS para story creation e validation',
      '@architect é EXCLUSIVO para decisões de arquitetura',
      '@qa é EXCLUSIVO para quality verdicts (PASS/FAIL/WAIVED)',
      'Agentes DEVEM delegar quando fora do escopo',
    ],
    enforcement: 'Tentativa de operação exclusiva por agente não autorizado é BLOQUEADA imediatamente',
  },
  {
    number: 'III',
    name: 'Story-Driven Development',
    severity: 'MUST',
    icon: '📖',
    description: 'Nenhum código é escrito sem uma story aprovada. Stories guiam TODO o desenvolvimento.',
    rules: [
      'Todo código precisa de uma story com acceptance criteria claros',
      'Progresso é rastreado via checkboxes na story: [ ] → [x]',
      'File List na story mantém registro de todos os arquivos alterados',
      'Stories seguem o lifecycle: Draft → Ready → InProgress → InReview → Done',
    ],
    enforcement: 'Commits sem story ID referenciada são flagged no code review',
  },
  {
    number: 'IV',
    name: 'No Invention',
    severity: 'MUST',
    icon: '🚫',
    description: 'Cada statement em specs DEVE rastrear para um requirement ou research finding. ZERO features inventadas.',
    rules: [
      'Todo item em spec.md rastreia para FR-*, NFR-*, CON-* ou research finding',
      'Nenhuma feature pode ser adicionada que não esteja nos requirements',
      'Assumptions não pesquisadas são PROIBIDAS',
      'Gate é enforced no task spec-write-spec.md',
    ],
    enforcement: 'Spec critique (QA) verifica traceability — BLOCKED se score < 3.0',
  },
  {
    number: 'V',
    name: 'Quality First',
    severity: 'MUST',
    icon: '✅',
    description: 'Código passa por 5 quality checks antes de push. Zero tolerância para debt.',
    rules: [
      'npm run lint — zero errors obrigatório',
      'npm run typecheck — TypeScript strict mode',
      'npm test — todos os testes passando',
      'npm run build — build com sucesso',
      'CodeRabbit — 0 issues CRITICAL',
    ],
    enforcement: 'Pre-push gate BLOQUEIA violações. QA Gate com 7-point checklist adicional',
  },
  {
    number: 'VI',
    name: 'Absolute Imports',
    severity: 'SHOULD',
    icon: '📦',
    description: 'Preferir @/ imports sobre caminhos relativos ../../../ para manter legibilidade.',
    rules: [
      'Usar @/ prefix para imports internos',
      'NUNCA usar caminhos relativos como ../../../',
      'ESLint enforces a convenção automaticamente',
      'Exceção: imports dentro do mesmo diretório podem ser relativos',
    ],
    enforcement: 'ESLint rule warning (não bloqueante, mas flagged em reviews)',
  },
]

export const severityColors = {
  'NON-NEGOTIABLE': { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30' },
  'MUST': { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
  'SHOULD': { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
}
