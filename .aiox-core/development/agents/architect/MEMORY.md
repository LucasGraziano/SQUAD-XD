# Architect Agent Memory (Aria)

## Active Patterns
<!-- Current, verified patterns used by this agent -->

### Architecture Decisions
- CLI First > Observability > UI (Constitution Article I)
- Task-First: Tasks define WHAT, executors are interchangeable
- Provider-agnostic code-intel layer (Code Graph MCP primary)
- SYNAPSE 8-layer context engine (L0-L2 active, L3-L7 disabled per NOG-18)

### Key Architectural Patterns
- Tiered loading in UAP: Critical (80ms) → High (120ms) → Best-effort (180ms)
- Circuit breaker for external providers (code-intel, MCP)
- Atomic writes for file persistence (`atomicWriteSync`)
- ideSync for cross-IDE agent distribution

### Technology Stack
- Node.js 18+, CommonJS, ES2022
- Jest 30.2.0, ESLint, Prettier
- Supabase (database), Vercel (hosting)

### Delegation Rules
- Database schema design → @data-engineer
- Git push/PR → @devops
- Implementation → @dev

### Project Structure
- `.aiox-core/core/` — Engine modules
- `docs/architecture/` — Architecture docs
- `docs/prd/` — Sharded PRDs

## Promotion Candidates
<!-- Patterns seen across 3+ agents — candidates for CLAUDE.md or .claude/rules/ -->
<!-- Format: - **{pattern}** | Source: {agent} | Detected: {YYYY-MM-DD} -->

## Archived
<!-- Patterns no longer relevant — kept for history -->
<!-- Format: - ~~{pattern}~~ | Archived: {YYYY-MM-DD} | Reason: {reason} -->

## 📚 Knowledge Feed

<!-- Older entries archived. See docs/knowledge/index.yaml -->

### [2026-03-11] MEGA-BRAIN: "DNA: jordan-lee — HEURISTICAS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\jordan-lee\HEURISTICAS.yaml | ID: k-035
- Importância de high growth, profitability e scalability para maximizar valorização
> Full content: docs/knowledge/k-035.md


### [2026-03-11] MEGA-BRAIN: "DNA: jordan-lee — FRAMEWORKS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\jordan-lee\FRAMEWORKS.yaml | ID: k-034
- Design and implement frameworks for enterprise value and sales team structure
- Develop scalable and flexible cost structure frameworks
- Create talent acquisition strategies that leverage marketing and AI
> Full content: docs/knowledge/k-034.md


### [2026-03-11] MEGA-BRAIN: "DNA: jordan-lee — FILOSOFIAS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\jordan-lee\FILOSOFIAS.yaml | ID: k-033
- Designar um core team mínimo com pessoas insubstituíveis
> Full content: docs/knowledge/k-033.md


### [2026-03-11] MEGA-BRAIN: "DNA: jeremy-miner — MODELOS-MENTAIS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\jeremy-miner\MODELOS-MENTAI... | ID: k-032
- Understanding the underlying principles of each model
> Full content: docs/knowledge/k-032.md


### [2026-03-11] MEGA-BRAIN: "knowledge/dna/persons/JEREMY-MINER/METODOLOGIAS.yaml"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\jeremy-miner\METODOLOGIAS.yaml | ID: k-031
- bullet 1
> Full content: docs/knowledge/k-031.md


### [2026-03-11] MEGA-BRAIN: "DNA: jeremy-miner — HEURISTICAS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\jeremy-miner\HEURISTICAS.yaml | ID: k-030
- Análise estrutural das regras de vendas
- Conceito de heurística em vendas
- Desenvolvimento de protocolos de venda
> Full content: docs/knowledge/k-030.md


### [2026-03-11] MEGA-BRAIN: "DNA: jeremy-miner — FILOSOFIAS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\jeremy-miner\FILOSOFIAS.yaml | ID: k-028
- Design sales and marketing strategies that focus on problem awareness and discovery.
> Full content: docs/knowledge/k-028.md


### [2026-03-11] MEGA-BRAIN: "DNA: jeremy-haynes — MODELOS-MENTAIS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\jeremy-haynes\MODELOS-MENTA... | ID: k-027
- bullet 1: Differentiate from competitors
> Full content: docs/knowledge/k-027.md


### [2026-03-11] MEGA-BRAIN: "DNA: jeremy-haynes — METODOLOGIAS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\jeremy-haynes\METODOLOGIAS.... | ID: k-026
- The DNA: jeremy-haynes — METODOLOGIAS protocol is well-structured and easy to follow
- Jeremy Haynes' case studies demonstrate the effectiveness of the methodologies
- The protocol provides a clear and concise framework for marketing strategies
> Full content: docs/knowledge/k-026.md


### [2026-03-11] MEGA-BRAIN: "DNA: jeremy-haynes — HEURISTICAS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\jeremy-haynes\HEURISTICAS.yaml | ID: k-025
- Aqui estão algumas das heurísticas apresentadas. A ideia é implementá-las de forma a melhorar a experiência do usuário e a eficiência da campanha de vendas.
- É importante lembrar que a estratégia é baseada em dados e evidências.
- Aqui estão algumas das regras que foram apresentadas. É importante implementá-las de forma a melhorar a eficiência da campanha de vendas.
> Full content: docs/knowledge/k-025.md


### [2026-03-11] MEGA-BRAIN: "DNA: jeremy-haynes — FRAMEWORKS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\jeremy-haynes\FRAMEWORKS.yaml | ID: k-024
- A arquitetura dos frameworks é fundamental para seu sucesso.
- Os frameworks devem ser adaptados às necessidades específicas do negócio.
> Full content: docs/knowledge/k-024.md


### [2026-03-11] MEGA-BRAIN: "DNA: jeremy-haynes — CONFIG"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\jeremy-haynes\CONFIG.yaml | ID: k-022
- Desenvolver framework Pentagon Solution
- Aumentar velocidade de escalabilidade
> Full content: docs/knowledge/k-022.md


### [2026-03-11] MEGA-BRAIN: "DNA: cole-gordon — HEURISTICAS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\cole-gordon\HEURISTICAS.yaml | ID: k-019
- Desenvolver rep em máximo 1-2 áreas de foco por semana
- Implementar confirmation page otimizada
- Usar assinatura casual em emails de follow-up
> Full content: docs/knowledge/k-019.md


### [2026-03-11] MEGA-BRAIN: "DNA: cole-gordon — FRAMEWORKS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\cole-gordon\FRAMEWORKS.yaml | ID: k-018
- personalization
- pricing decisions
> Full content: docs/knowledge/k-018.md


### [2026-03-11] MEGA-BRAIN: "DNA: cole-gordon — FILOSOFIAS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\cole-gordon\FILOSOFIAS.yaml | ID: k-017
- A importancia da comunicação eficaz no vendizado
> Full content: docs/knowledge/k-017.md


### [2026-03-11] MEGA-BRAIN: "DNA: alex-hormozi — MODELOS-MENTAIS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\alex-hormozi\MODELOS-MENTAI... | ID: k-016
- Design a sales management system with a clear hierarchy
- Think about the different types of stakeholders involved in sales
- Use analogies to simplify complex sales concepts
> Full content: docs/knowledge/k-016.md


### [2026-03-11] MEGA-BRAIN: "DNA: alex-hormozi — METODOLOGIAS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\alex-hormozi\METODOLOGIAS.yaml | ID: k-015
- Projetar arquiteturas de vendas escaláveis
- Implementar métricas de desempenho
> Full content: docs/knowledge/k-015.md


### [2026-03-11] MEGA-BRAIN: "DNA: alex-hormozi — HEURISTICAS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\alex-hormozi\HEURISTICAS.yaml | ID: k-014
- Designing sales processes with scalability in mind
> Full content: docs/knowledge/k-014.md


### [2026-03-11] MEGA-BRAIN: "DNA: alex-hormozi — FRAMEWORKS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\alex-hormozi\FRAMEWORKS.yaml | ID: k-013
- A implementação do CLOSER Framework requer uma abordagem estruturada para garantir a eficácia.
> Full content: docs/knowledge/k-013.md


### [2026-03-11] MEGA-BRAIN: "DNA: alex-hormozi — FILOSOFIAS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\alex-hormozi\FILOSOFIAS.yaml | ID: k-012
- cultura de alta performance
- remover low performers rapidamente
> Full content: docs/knowledge/k-012.md
