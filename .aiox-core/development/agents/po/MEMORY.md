# PO Agent Memory (Pax)

## Active Patterns
<!-- Current, verified patterns used by this agent -->

### Responsibilities
- Story validation (`*validate-story-draft`) — 10-point checklist
- Backlog management and prioritization
- Story lifecycle: Draft → Ready transition (MUST update status)
- Epic context tracking

### Validation Checklist (10 Points)
1. Clear title
2. Complete description
3. Testable AC (Given/When/Then)
4. Defined scope (IN/OUT)
5. Dependencies mapped
6. Complexity estimate
7. Business value
8. Risks documented
9. Criteria of Done
10. PRD/Epic alignment

### Story File Permissions
- CAN edit: QA Results section (when reviewing)
- MUST update: Status field (Draft → Ready on GO)
- CANNOT modify: AC, Scope, Title, Dev Notes, Testing

### Delegation
- Story creation → @sm (`*draft`)
- Epic creation → @pm (`*create-epic`)
- Course correction → @aiox-master

### Key Locations
- Stories: `docs/stories/`
- Backlog: `docs/stories/backlog/`
- Templates: `.aiox-core/development/templates/story-tmpl.yaml`

## Promotion Candidates
<!-- Patterns seen across 3+ agents — candidates for CLAUDE.md or .claude/rules/ -->
<!-- Format: - **{pattern}** | Source: {agent} | Detected: {YYYY-MM-DD} -->

## Archived
<!-- Patterns no longer relevant — kept for history -->
<!-- Format: - ~~{pattern}~~ | Archived: {YYYY-MM-DD} | Reason: {reason} -->

## 📚 Knowledge Feed

### [2026-03-11] MEGA-BRAIN: "FOUNDER PROFILE - LUCAS (GRAZIANO)"
- Source: D:\MEGA BRAIN XD\mega-brain\agents\sua-empresa\founders\FOUNDER-LUCAS.md | ID: k-059
- Lucas precisa ser mais eficiente em sua criação de criativos (ads)
> Full content: docs/knowledge/k-059.md


### [2026-03-11] MEGA-BRAIN: "COMPANY CONTEXT - Contexto Completo da Empresa"
- Source: D:\MEGA BRAIN XD\mega-brain\agents\sua-empresa\COMPANY-CONTEXT.md | ID: k-057
- Desenvolvimento de identidade visual para marca
- Criação de conteúdo para marketing
- Gerenciamento de relações com público-alvo
> Full content: docs/knowledge/k-057.md


### [2026-03-11] MEGA-BRAIN: "DNA: the-scalable-company — METODOLOGIAS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\the-scalable-company\METODO... | ID: k-052
- Melhoria contuinada de resultados e eficiencia
- Avaliacao de resultados e ajustes
> Full content: docs/knowledge/k-052.md


### [2026-03-11] MEGA-BRAIN: "DNA: the-scalable-company — HEURISTICAS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\the-scalable-company\HEURIS... | ID: k-051
- product development
- user experience
> Full content: docs/knowledge/k-051.md


### [2026-03-11] MEGA-BRAIN: "DNA: sam-oven — MODELOS-MENTAIS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\sam-oven\MODELOS-MENTAIS.yaml | ID: k-048
- Develop a plan for communicating the value proposition to customers.
- Create marketing materials that effectively communicate the business model.
- Evaluate the effectiveness of marketing efforts.
> Full content: docs/knowledge/k-048.md


### [2026-03-11] MEGA-BRAIN: "DNA: sam-oven — CONFIG"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\sam-oven\CONFIG.yaml | ID: k-043
- Desenvolver uma estratégia de marketing eficaz
- Definir um público-alvo e entender suas necessidades
- Criar conteúdo atraente e relevante
> Full content: docs/knowledge/k-043.md


### [2026-03-11] MEGA-BRAIN: "DNA: richard-linder — FRAMEWORKS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\richard-linder\FRAMEWORKS.yaml | ID: k-039
- Desenvolver materiais para apresentar os frameworks
- Implementar os frameworks em diferentes produtos
- Testar os frameworks em diferentes cenários
> Full content: docs/knowledge/k-039.md


### [2026-03-11] MEGA-BRAIN: "DNA: jordan-lee — MODELOS-MENTAIS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\jordan-lee\MODELOS-MENTAIS.... | ID: k-037
- emphasize presence and pitch in communication
> Full content: docs/knowledge/k-037.md


### [2026-03-11] MEGA-BRAIN: "DNA: jeremy-miner — MODELOS-MENTAIS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\jeremy-miner\MODELOS-MENTAI... | ID: k-032
- Developing content to explain these models to sales teams
> Full content: docs/knowledge/k-032.md


### [2026-03-11] MEGA-BRAIN: "DNA: jeremy-miner — HEURISTICAS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\jeremy-miner\HEURISTICAS.yaml | ID: k-030
- Análise de preços de venda
- Conhecimento de concorrentes
- Desenvolvimento de estratégia de preço
> Full content: docs/knowledge/k-030.md


### [2026-03-11] MEGA-BRAIN: "DNA: jeremy-haynes — METODOLOGIAS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\jeremy-haynes\METODOLOGIAS.... | ID: k-026
- The DNA: jeremy-haynes — METODOLOGIAS protocol is product-oriented and effective
- Jeremy Haynes' case studies demonstrate the success of product-oriented marketing strategies
- The protocol provides a clear and concise framework for product marketing and strategies
> Full content: docs/knowledge/k-026.md


### [2026-03-11] MEGA-BRAIN: "DNA: jeremy-haynes — FRAMEWORKS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\jeremy-haynes\FRAMEWORKS.yaml | ID: k-024
- A criação de conteúdo é fundamental para garantir que os frameworks sejam aplicados corretamente.
- A criação de conteúdo eficaz é essencial para atrair e engajar o público-alvo.
> Full content: docs/knowledge/k-024.md


### [2026-03-11] MEGA-BRAIN: "DNA: jeremy-haynes — CONFIG"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\jeremy-haynes\CONFIG.yaml | ID: k-022
- Desenvolver estratégia de conteúdo
- Melhorar experiência do cliente
> Full content: docs/knowledge/k-022.md


### [2026-03-11] MEGA-BRAIN: "DNA: cole-gordon — FRAMEWORKS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\cole-gordon\FRAMEWORKS.yaml | ID: k-018
- value capture
- value ceiling
> Full content: docs/knowledge/k-018.md


### [2026-03-11] MEGA-BRAIN: "DNA: alex-hormozi — FILOSOFIAS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\alex-hormozi\FILOSOFIAS.yaml | ID: k-012
- deixar claro expectativas na contratação
> Full content: docs/knowledge/k-012.md


### [2026-03-10] MEGA-BRAIN: "QUIZ - ZERO DIASTASE (Funil de Vendas)"
- Source: D:\MEGA BRAIN XD\mega-brain\agents\sua-empresa\products\QUIZ-ZERO-DIASTASE.md | ID: k-011
- Source ingested from: D:\MEGA BRAIN XD\mega-brain\agents\sua-empresa\products\QUIZ-ZERO-DIASTASE.md
> Full content: docs/knowledge/k-011.md


### [2026-03-10] MEGA-BRAIN: "QUIZ - ZERO DIASTASE (Funil de Vendas)"
- Source: D:\MEGA BRAIN XD\mega-brain\agents\sua-empresa\products\QUIZ-ZERO-DIASTASE.md | ID: k-008
- Source ingested from: D:\MEGA BRAIN XD\mega-brain\agents\sua-empresa\products\QUIZ-ZERO-DIASTASE.md
> Full content: docs/knowledge/k-008.md
