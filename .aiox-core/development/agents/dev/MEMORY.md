# Dev Agent Memory (Dex)

## Active Patterns
<!-- Current, verified patterns used by this agent -->

### Key Patterns
- CommonJS (`require`/`module.exports`), NOT ES Modules
- ES2022, Node.js 18+, 2-space indent, single quotes
- Absolute imports always (never relative `../`)
- kebab-case for files, PascalCase for components
- Jest 30.2.0 for testing, `npm test` to run

### Project Structure
- `.aiox-core/core/` — Core modules (synapse, session, code-intel, orchestration)
- `.aiox-core/development/` — Agents, tasks, templates, scripts
- `.aiox-core/infrastructure/` — CI/CD, git detection, project-status
- `tests/` — Test suites (mirrors source structure)
- `docs/stories/` — Story files (active development)

### Git Rules
- NEVER push — delegate to @devops
- Conventional commits: `feat:`, `fix:`, `docs:`, `test:`, `chore:`, `refactor:`
- Reference story: `feat: implement feature [Story NOG-18]`

### Common Gotchas
- Windows paths: use forward slashes in code, bash shell not cmd
- `fs.existsSync` for sync checks, `fs.promises` for async
- atomicWriteSync from `.aiox-core/core/synapse/utils/atomic-write` for safe file writes
- CodeRabbit runs in WSL, not Windows directly

### Story Workflow
- Read task → Implement → Write tests → Validate → Mark checkbox [x]
- ONLY update: checkboxes, Debug Log, Completion Notes, Change Log, File List
- NEVER modify: Status, Story, AC, Dev Notes, Testing sections

## Promotion Candidates
<!-- Patterns seen across 3+ agents — candidates for CLAUDE.md or .claude/rules/ -->
<!-- Format: - **{pattern}** | Source: {agent} | Detected: {YYYY-MM-DD} -->
- **NEVER push — delegate to @devops** | Source: dev, analyst, sm, data-engineer, ux, qa (6 agents) | Detected: 2026-02-22 | Status: Already elevated to `.claude/rules/agent-authority.md`
- **CommonJS module system (require/module.exports)** | Source: dev, analyst, sm, data-engineer, ux, architect (6 agents) | Detected: 2026-02-22 | Status: Already in CLAUDE.md (Padroes de Codigo)
- **Conventional commits format** | Source: dev, devops, analyst, sm, data-engineer, ux (6 agents) | Detected: 2026-02-22 | Status: Already in CLAUDE.md (Convencoes Git)
- **kebab-case for files** | Source: dev, analyst, sm, data-engineer, ux (5 agents) | Detected: 2026-02-22 | Status: Already in CLAUDE.md (Padroes de Codigo)

## Archived
<!-- Patterns no longer relevant — kept for history -->
<!-- Format: - ~~{pattern}~~ | Archived: {YYYY-MM-DD} | Reason: {reason} -->

## 📚 Knowledge Feed

<!-- Older entries archived. See docs/knowledge/index.yaml -->

### [2026-03-11] MEGA-BRAIN: "DNA: jeremy-miner — FRAMEWORKS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\jeremy-miner\FRAMEWORKS.yaml | ID: k-029
- Implementar frameworks de Jeremy Miner em projetos de vendas
> Full content: docs/knowledge/k-029.md


### [2026-03-11] MEGA-BRAIN: "DNA: jeremy-miner — FILOSOFIAS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\jeremy-miner\FILOSOFIAS.yaml | ID: k-028
- Use self-persuasion techniques to overcome objections and build trust with prospects.
> Full content: docs/knowledge/k-028.md


### [2026-03-11] MEGA-BRAIN: "DNA: jeremy-haynes — MODELOS-MENTAIS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\jeremy-haynes\MODELOS-MENTA... | ID: k-027
- bullet 1: Focus on delivering results
- bullet 2: Adjust pricing strategies
- bullet 3: Emphasize volume-based approaches
> Full content: docs/knowledge/k-027.md


### [2026-03-11] MEGA-BRAIN: "DNA: jeremy-haynes — METODOLOGIAS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\jeremy-haynes\METODOLOGIAS.... | ID: k-026
- Jeremy Haynes' methodologies for marketing digital are comprehensive and effective
- DNA: jeremy-haynes — METODOLOGIAS provides a clear structure for marketing strategies
- The methodologies include multiple case studies and results, demonstrating their success
> Full content: docs/knowledge/k-026.md


### [2026-03-11] MEGA-BRAIN: "DNA: jeremy-haynes — HEURISTICAS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\jeremy-haynes\HEURISTICAS.yaml | ID: k-025
- Aqui estão algumas das heurísticas apresentadas. A ideia é implementá-las de forma a melhorar a experiência do usuário e a eficiência da campanha de vendas.
- É importante lembrar que a estratégia é baseada em dados e evidências.
- Aqui estão algumas das regras que foram apresentadas. É importante implementá-las de forma a melhorar a eficiência da campanha de vendas.
> Full content: docs/knowledge/k-025.md


### [2026-03-11] MEGA-BRAIN: "DNA: jeremy-haynes — FRAMEWORKS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\jeremy-haynes\FRAMEWORKS.yaml | ID: k-024
- Jeremy Haynes é um especialista em marketing, com um foco nos frameworks de marketing que pode ser adaptado para diferentes indústrias.
- Os frameworks são estruturas específicas de marketing, cada uma com objetivos e componentes próprios.
- Os frameworks podem ser usados para diferentes objetivos, como validação, confiança, premium e demanda.
> Full content: docs/knowledge/k-024.md


### [2026-03-11] MEGA-BRAIN: "DNA: jeremy-haynes — FILOSOFIAS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\jeremy-haynes\FILOSOFIAS.yaml | ID: k-023
- Implement customer-centric sales strategies to deliver value and results rather than just making a sale.
- Use data and analytics to optimize pricing and increase revenue.
- Focus on building a strong brand and differentiating yourself from competitors.
> Full content: docs/knowledge/k-023.md


### [2026-03-11] MEGA-BRAIN: "DNA: jeremy-haynes — CONFIG"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\jeremy-haynes\CONFIG.yaml | ID: k-022
- Implementar framework Hydra Strategy
- Aumentar valor excedendo preco a cada 30 dias
- Melhorar processos de pagamento
> Full content: docs/knowledge/k-022.md


### [2026-03-11] MEGA-BRAIN: "DNA: cole-gordon — MODELOS-MENTAIS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\cole-gordon\MODELOS-MENTAIS... | ID: k-021
- O modelo cole-gordon é uma abordagem de vendas baseada em modelos mentais que busca entender as crenças e objecções dos clientes.
- A abordagem é composta por 8 modelos mentais diferentes, cada um com suas próprias estratégias e objetivos.
> Full content: docs/knowledge/k-021.md


### [2026-03-11] MEGA-BRAIN: "DNA: cole-gordon — METODOLOGIAS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\cole-gordon\METODOLOGIAS.yaml | ID: k-020
- bullet 1: Implement 7 levers for show rate optimization
- bullet 2: Configure a 2-day rolling booking window
> Full content: docs/knowledge/k-020.md


### [2026-03-11] MEGA-BRAIN: "DNA: cole-gordon — HEURISTICAS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\cole-gordon\HEURISTICAS.yaml | ID: k-019
- Implementar AI de call intelligence após 3 meses de calibração
- Ajustar preço até chegar em 20-50%
- Consolidar oferta em 3-4 pilares principais
> Full content: docs/knowledge/k-019.md


### [2026-03-11] MEGA-BRAIN: "DNA: cole-gordon — FRAMEWORKS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\cole-gordon\FRAMEWORKS.yaml | ID: k-018
- structured calls
- role separation
> Full content: docs/knowledge/k-018.md


### [2026-03-11] MEGA-BRAIN: "DNA: cole-gordon — FILOSOFIAS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\cole-gordon\FILOSOFIAS.yaml | ID: k-017
- A importancia da conviction no vendizado
- A necessidade de demonstrar valor ao cliente
- A importancia de acreditar em estatisticas e nao em palavras
> Full content: docs/knowledge/k-017.md


### [2026-03-11] MEGA-BRAIN: "DNA: alex-hormozi — MODELOS-MENTAIS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\alex-hormozi\MODELOS-MENTAI... | ID: k-016
- Create a sales process with a clear structure and functionality
- Analyze the role of BDRs in generating interest
- Consider the importance of emotional connection in sales
> Full content: docs/knowledge/k-016.md


### [2026-03-11] MEGA-BRAIN: "DNA: alex-hormozi — METODOLOGIAS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\alex-hormozi\METODOLOGIAS.yaml | ID: k-015
- Desenvolver frameworks de venda personalizados
- Implementar tecnologias de automação de vendas
> Full content: docs/knowledge/k-015.md


### [2026-03-11] MEGA-BRAIN: "DNA: alex-hormozi — HEURISTICAS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\alex-hormozi\HEURISTICAS.yaml | ID: k-014
- Implementing question-based approach in sales scripts and calls
- Limiting pitches to three points to maximize impact
- Prioritizing channel-independence to reduce reliance on a single sales channel
> Full content: docs/knowledge/k-014.md


### [2026-03-11] MEGA-BRAIN: "DNA: alex-hormozi — FRAMEWORKS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\alex-hormozi\FRAMEWORKS.yaml | ID: k-013
- O uso do CLOSER Framework pode ser eficaz para estruturar calls de vendas com perguntas.
- A Conviction Framework é uma estratégia para controlar o tom de voz e aumentar a persuasão.
- A escala do processo de vendas é crucial para alcançar resultados em curto prazo.
> Full content: docs/knowledge/k-013.md


### [2026-03-11] MEGA-BRAIN: "DNA: alex-hormozi — FILOSOFIAS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\alex-hormozi\FILOSOFIAS.yaml | ID: k-012
- investir em vendas outbound
- deixar claro estabilidade sobre velocidade de escala
> Full content: docs/knowledge/k-012.md


### [2026-03-10] MEGA-BRAIN: "QUIZ - ZERO DIASTASE (Funil de Vendas)"
- Source: D:\MEGA BRAIN XD\mega-brain\agents\sua-empresa\products\QUIZ-ZERO-DIASTASE.md | ID: k-011
- Source ingested from: D:\MEGA BRAIN XD\mega-brain\agents\sua-empresa\products\QUIZ-ZERO-DIASTASE.md
> Full content: docs/knowledge/k-011.md


### [2026-03-10] MEGA-BRAIN: "QUIZ - ZERO DIASTASE (Funil de Vendas)"
- Source: D:\MEGA BRAIN XD\mega-brain\agents\sua-empresa\products\QUIZ-ZERO-DIASTASE.md | ID: k-008
- Source ingested from: D:\MEGA BRAIN XD\mega-brain\agents\sua-empresa\products\QUIZ-ZERO-DIASTASE.md
> Full content: docs/knowledge/k-008.md
