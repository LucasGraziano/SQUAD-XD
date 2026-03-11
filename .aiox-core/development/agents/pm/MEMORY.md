# PM Agent Memory (Morgan)

## Active Patterns
<!-- Current, verified patterns used by this agent -->

### Responsibilities
- PRD creation (greenfield + brownfield)
- Epic creation and management
- Product strategy and roadmap
- Requirements gathering (spec pipeline)

### Epic Orchestration
- `*execute-epic` with `EPIC-{ID}-EXECUTION.yaml`
- State tracked in `.aiox/epic-{epicId}-state.yaml`
- Wave-based parallel execution

### Delegation
- Story creation → @sm (`*draft`)
- Course correction → @aiox-master (`*correct-course`)
- Deep research → @analyst (`*research`)

### Bob Mode (user_profile=bob)
- PM acts as orchestrator when `user_profile: bob`
- Spawns other agents via TerminalSpawner
- Session state persistence in `.aiox/bob-session/`

### Key Locations
- PRD: `docs/prd/` (sharded)
- Epics: `docs/stories/epics/`
- Templates: `.aiox-core/development/templates/`

## Promotion Candidates
<!-- Patterns seen across 3+ agents — candidates for CLAUDE.md or .claude/rules/ -->
<!-- Format: - **{pattern}** | Source: {agent} | Detected: {YYYY-MM-DD} -->

## Archived
<!-- Patterns no longer relevant — kept for history -->
<!-- Format: - ~~{pattern}~~ | Archived: {YYYY-MM-DD} | Reason: {reason} -->

## 📚 Knowledge Feed

<!-- Older entries archived. See docs/knowledge/index.yaml -->

### [2026-03-11] MEGA-BRAIN: "DNA: the-scalable-company — METODOLOGIAS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\the-scalable-company\METODO... | ID: k-052
- Planejamento e execucao de projetos
- Melhoria contuinada de resultados e eficiencia
> Full content: docs/knowledge/k-052.md


### [2026-03-11] MEGA-BRAIN: "DNA: the-scalable-company — HEURISTICAS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\the-scalable-company\HEURIS... | ID: k-051
- project management
- agile methodologies
> Full content: docs/knowledge/k-051.md


### [2026-03-11] MEGA-BRAIN: "DNA: the-scalable-company — FILOSOFIAS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\the-scalable-company\FILOSO... | ID: k-049
- Aprender com os erros é fundamental para criar playbooks
- Documentar como os clientes acontecem é o exercício mais valioso que um founder pode fazer
> Full content: docs/knowledge/k-049.md


### [2026-03-11] MEGA-BRAIN: "DNA: sam-oven — MODELOS-MENTAIS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\sam-oven\MODELOS-MENTAIS.yaml | ID: k-048
- Develop a project plan for implementing the business model.
- Estimate costs and timelines for implementation.
- Coordinate with stakeholders to ensure a smooth implementation process.
> Full content: docs/knowledge/k-048.md


### [2026-03-11] MEGA-BRAIN: "DNA: sam-oven — CONFIG"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\sam-oven\CONFIG.yaml | ID: k-043
- Definir prioridades e objetivos claros para as agências
- Gerenciar recursos de forma eficiente e eficaz
- Estabelecer metas de crescimento e alcance
> Full content: docs/knowledge/k-043.md


### [2026-03-11] MEGA-BRAIN: "DNA: richard-linder — FRAMEWORKS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\richard-linder\FRAMEWORKS.yaml | ID: k-039
- Implementar os frameworks em diferentes projetos
- Desenvolver algoritmos para otimizar a implementação dos frameworks
- Monitorar a eficiência dos frameworks em diferentes projetos
> Full content: docs/knowledge/k-039.md


### [2026-03-11] MEGA-BRAIN: "DNA: jordan-lee — MODELOS-MENTAIS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\jordan-lee\MODELOS-MENTAIS.... | ID: k-037
- prioritize people-process-management diagnostics
- identify areas for improvement in sales and marketing
> Full content: docs/knowledge/k-037.md


### [2026-03-11] MEGA-BRAIN: "DNA: jordan-lee — METODOLOGIAS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\jordan-lee\METODOLOGIAS.yaml | ID: k-036
- Definir os objetivos de vendas e alinhar as expectativas com os resultados
- Implementar um sistema de gestão de projeto para garantir a entrega de resultados
> Full content: docs/knowledge/k-036.md


### [2026-03-11] MEGA-BRAIN: "DNA: jordan-lee — FILOSOFIAS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\jordan-lee\FILOSOFIAS.yaml | ID: k-033
- Definir objetivos e metas claras para os negócios
> Full content: docs/knowledge/k-033.md


### [2026-03-11] MEGA-BRAIN: "DNA: jeremy-miner — MODELOS-MENTAIS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\jeremy-miner\MODELOS-MENTAI... | ID: k-032
- Prioritizing the implementation of these models in sales teams
> Full content: docs/knowledge/k-032.md


### [2026-03-11] MEGA-BRAIN: "DNA: jeremy-miner — HEURISTICAS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\jeremy-miner\HEURISTICAS.yaml | ID: k-030
- Gerenciamento de projetos de venda
- Planejamento de estratégia de vendas
- Gestão de recursos
> Full content: docs/knowledge/k-030.md


### [2026-03-11] MEGA-BRAIN: "DNA: jeremy-haynes — METODOLOGIAS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\jeremy-haynes\METODOLOGIAS.... | ID: k-026
- The DNA: jeremy-haynes — METODOLOGIAS protocol is project management-friendly and effective
- Jeremy Haynes' case studies demonstrate the success of project management marketing strategies
- The protocol provides a clear and concise framework for project management and marketing strategies
> Full content: docs/knowledge/k-026.md


### [2026-03-11] MEGA-BRAIN: "DNA: jeremy-haynes — FRAMEWORKS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\jeremy-haynes\FRAMEWORKS.yaml | ID: k-024
- A gestão é fundamental para garantir que os frameworks sejam aplicados corretamente.
- A gestão dos recursos é essencial para garantir que os frameworks sejam eficazes.
> Full content: docs/knowledge/k-024.md


### [2026-03-11] MEGA-BRAIN: "DNA: jeremy-haynes — CONFIG"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\jeremy-haynes\CONFIG.yaml | ID: k-022
- Ajustar prioridades e orçamentos
- Melhorar gestão de projeto
> Full content: docs/knowledge/k-022.md


### [2026-03-11] MEGA-BRAIN: "DNA: cole-gordon — FRAMEWORKS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\cole-gordon\FRAMEWORKS.yaml | ID: k-018
- friction
- alignment
> Full content: docs/knowledge/k-018.md


### [2026-03-11] MEGA-BRAIN: "DNA: alex-hormozi — FILOSOFIAS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\alex-hormozi\FILOSOFIAS.yaml | ID: k-012
- construir pipeline interno de talentos
- valorizar o sistema de treinamento
> Full content: docs/knowledge/k-012.md


### [2026-03-10] MEGA-BRAIN: "FOUNDER PROFILE - LUCAS (GRAZIANO)"
- Source: D:\MEGA BRAIN XD\mega-brain\agents\sua-empresa\founders\FOUNDER-LUCAS.md | ID: k-010
- Source ingested from: D:\MEGA BRAIN XD\mega-brain\agents\sua-empresa\founders\FOUNDER-LUCAS.md
> Full content: docs/knowledge/k-010.md


### [2026-03-10] MEGA-BRAIN: "FOUNDER PROFILE - PEDRO CABRAL"
- Source: D:\MEGA BRAIN XD\mega-brain\agents\sua-empresa\founders\FOUNDER-CABRAL.md | ID: k-009
- Source ingested from: D:\MEGA BRAIN XD\mega-brain\agents\sua-empresa\founders\FOUNDER-CABRAL.md
> Full content: docs/knowledge/k-009.md


### [2026-03-10] MEGA-BRAIN: "FOUNDER PROFILE - LUCAS (GRAZIANO)"
- Source: D:\MEGA BRAIN XD\mega-brain\agents\sua-empresa\founders\FOUNDER-LUCAS.md | ID: k-007
- Source ingested from: D:\MEGA BRAIN XD\mega-brain\agents\sua-empresa\founders\FOUNDER-LUCAS.md
> Full content: docs/knowledge/k-007.md


### [2026-03-10] MEGA-BRAIN: "FOUNDER PROFILE - PEDRO CABRAL"
- Source: D:\MEGA BRAIN XD\mega-brain\agents\sua-empresa\founders\FOUNDER-CABRAL.md | ID: k-006
- Source ingested from: D:\MEGA BRAIN XD\mega-brain\agents\sua-empresa\founders\FOUNDER-CABRAL.md
> Full content: docs/knowledge/k-006.md
