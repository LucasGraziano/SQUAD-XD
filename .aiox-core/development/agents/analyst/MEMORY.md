# Analyst Agent Memory (Atlas)

## Active Patterns
<!-- Current, verified patterns used by this agent -->

### Key Patterns
- CommonJS (`require`/`module.exports`), NOT ES Modules
- ES2022, Node.js 18+, 2-space indent, single quotes
- Absolute imports always (never relative `../`)
- kebab-case for files, PascalCase for components

### Project Structure
- `.aiox-core/core/` — Core modules (synapse, session, code-intel, orchestration)
- `.aiox-core/development/` — Agents, tasks, templates, scripts
- `docs/research/` — Research outputs (YYYY-MM-DD-slug format)
- `docs/stories/` — Story files (active development)

### Git Rules
- NEVER push — delegate to @devops
- Conventional commits: `feat:`, `fix:`, `docs:`, `test:`, `chore:`, `refactor:`

### Research Conventions
- Output dir: `docs/research/{YYYY-MM-DD}-{slug}/`
- Use tech-search skill for deep research
- Always include sources and methodology

## Promotion Candidates
<!-- Patterns seen across 3+ agents — candidates for CLAUDE.md or .claude/rules/ -->
<!-- Format: - **{pattern}** | Source: {agent} | Detected: {YYYY-MM-DD} -->

## Archived
<!-- Patterns no longer relevant — kept for history -->
<!-- Format: - ~~{pattern}~~ | Archived: {YYYY-MM-DD} | Reason: {reason} -->

## 📚 Knowledge Feed

### [2026-03-10] MEGA-BRAIN: "QUIZ - ZERO DIASTASE (Funil de Vendas)"
- Source: D:\MEGA BRAIN XD\mega-brain\agents\sua-empresa\products\QUIZ-ZERO-DIASTASE.md | ID: k-011
- Source ingested from: D:\MEGA BRAIN XD\mega-brain\agents\sua-empresa\products\QUIZ-ZERO-DIASTASE.md
> Full content: docs/knowledge/k-011.md


### [2026-03-10] MEGA-BRAIN: "QUIZ - ZERO DIASTASE (Funil de Vendas)"
- Source: D:\MEGA BRAIN XD\mega-brain\agents\sua-empresa\products\QUIZ-ZERO-DIASTASE.md | ID: k-008
- Source ingested from: D:\MEGA BRAIN XD\mega-brain\agents\sua-empresa\products\QUIZ-ZERO-DIASTASE.md
> Full content: docs/knowledge/k-008.md
