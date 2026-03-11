# DevOps Agent Memory (Gage)

## Active Patterns
<!-- Current, verified patterns used by this agent -->

### Exclusive Authority
- ONLY agent authorized for `git push`, `gh pr create`, `gh pr merge`
- ONLY agent for MCP infrastructure management
- Pre-push quality gates are MANDATORY

### Quality Gates (Pre-Push)
1. `npm run lint` — ESLint must PASS
2. `npm test` — Jest must PASS
3. CodeRabbit review — 0 CRITICAL issues
4. Story status = "Done" or "Ready for Review"
5. No uncommitted changes, no merge conflicts

### Git Conventions
- Conventional Commits: `feat:`, `fix:`, `docs:`, `test:`, `chore:`
- Branch patterns: `feat/*`, `fix/*`, `docs/*`
- Semantic versioning: MAJOR.MINOR.PATCH

### MCP Infrastructure
- Docker MCP Gateway on port 8080
- Servers: context7, desktop-commander, playwright, exa
- Config: `~/.docker/mcp/catalogs/docker-mcp.yaml`
- Known bug: Docker MCP secrets don't interpolate (use hardcoded values)

### Repository Detection
- Uses `repository-detector.js` for dynamic context
- Framework-dev vs project-dev mode detection

## Promotion Candidates
<!-- Patterns seen across 3+ agents — candidates for CLAUDE.md or .claude/rules/ -->
<!-- Format: - **{pattern}** | Source: {agent} | Detected: {YYYY-MM-DD} -->

## Archived
<!-- Patterns no longer relevant — kept for history -->
<!-- Format: - ~~{pattern}~~ | Archived: {YYYY-MM-DD} | Reason: {reason} -->

## 📚 Knowledge Feed

### [2026-03-11] MEGA-BRAIN: "FOUNDER PROFILE - LUCAS (GRAZIANO)"
- Source: D:\MEGA BRAIN XD\mega-brain\agents\sua-empresa\founders\FOUNDER-LUCAS.md | ID: k-059
- Lucas precisa ser mais eficiente em sua implementação de sistemas
> Full content: docs/knowledge/k-059.md


### [2026-03-11] MEGA-BRAIN: "COMPANY CONTEXT - Contexto Completo da Empresa"
- Source: D:\MEGA BRAIN XD\mega-brain\agents\sua-empresa\COMPANY-CONTEXT.md | ID: k-057
- Implementação de pipeline de CI/CD
- Desenvolvimento de scripts para automação de testes
- Otimização de processos para entrega de software
> Full content: docs/knowledge/k-057.md


### [2026-03-11] MEGA-BRAIN: "DNA: the-scalable-company — METODOLOGIAS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\the-scalable-company\METODO... | ID: k-052
- Implementacao de processos de entrega contuinada
- Melhoria de fluxos de trabalho e processos de entrega
> Full content: docs/knowledge/k-052.md


### [2026-03-11] MEGA-BRAIN: "DNA: the-scalable-company — HEURISTICAS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\the-scalable-company\HEURIS... | ID: k-051
- continuous integration
- delivery and deployment
> Full content: docs/knowledge/k-051.md


### [2026-03-11] MEGA-BRAIN: "DNA: the-scalable-company — FILOSOFIAS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\the-scalable-company\FILOSO... | ID: k-049
- Sistemas escaláveis são a chave para o crescimento
- A transparência é essencial para a criação de uma cultura de aprendizado
> Full content: docs/knowledge/k-049.md


### [2026-03-11] MEGA-BRAIN: "DNA: sam-oven — MODELOS-MENTAIS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\sam-oven\MODELOS-MENTAIS.yaml | ID: k-048
- Implement a system for iterating and refining the business model.
- Develop a plan for scaling the business model.
- Use data to inform decisions about resource allocation and business operations.
> Full content: docs/knowledge/k-048.md


### [2026-03-11] MEGA-BRAIN: "DNA: richard-linder — FRAMEWORKS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\richard-linder\FRAMEWORKS.yaml | ID: k-039
- Implementar os frameworks em diferentes ambientes
- Desenvolver algoritmos para otimizar a implementação dos frameworks
- Monitorar a eficiência dos frameworks em diferentes ambientes
> Full content: docs/knowledge/k-039.md


### [2026-03-11] MEGA-BRAIN: "DNA: jordan-lee — METODOLOGIAS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\jordan-lee\METODOLOGIAS.yaml | ID: k-036
- Implementar um sistema de monitoramento de desempenho para garantir a qualidade dos resultados
- Desenvolver um processo de feedback automático para melhorar a eficiência
> Full content: docs/knowledge/k-036.md


### [2026-03-11] MEGA-BRAIN: "DNA: jordan-lee — FILOSOFIAS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\jordan-lee\FILOSOFIAS.yaml | ID: k-033
- Implementar sistemas de monitoramento e controle de qualidade
> Full content: docs/knowledge/k-033.md


### [2026-03-11] MEGA-BRAIN: "DNA: jeremy-miner — MODELOS-MENTAIS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\jeremy-miner\MODELOS-MENTAI... | ID: k-032
- Integrating these models into sales automation tools
> Full content: docs/knowledge/k-032.md


### [2026-03-11] MEGA-BRAIN: "DNA: jeremy-miner — HEURISTICAS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\jeremy-miner\HEURISTICAS.yaml | ID: k-030
- Implementação de regras de vendas em pipeline
- Desenvolvimento de scripts de venda
- Ajustes de configuração
> Full content: docs/knowledge/k-030.md


### [2026-03-11] MEGA-BRAIN: "DNA: jeremy-haynes — METODOLOGIAS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\jeremy-haynes\METODOLOGIAS.... | ID: k-026
- The DNA: jeremy-haynes — METODOLOGIAS protocol is DevOps-friendly and effective
- Jeremy Haynes' case studies demonstrate the success of DevOps marketing strategies
- The protocol provides a clear and concise framework for DevOps and marketing strategies
> Full content: docs/knowledge/k-026.md


### [2026-03-11] MEGA-BRAIN: "DNA: jeremy-haynes — FRAMEWORKS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\jeremy-haynes\FRAMEWORKS.yaml | ID: k-024
- A integração de desenvolvimento e operações é fundamental para o sucesso dos frameworks.
- Os frameworks devem ser adaptados às necessidades específicas do negócio.
> Full content: docs/knowledge/k-024.md


### [2026-03-11] MEGA-BRAIN: "DNA: jeremy-haynes — CONFIG"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\jeremy-haynes\CONFIG.yaml | ID: k-022
- Implementar pipeline de entrega contínua
- Melhorar segurança de rede
> Full content: docs/knowledge/k-022.md


### [2026-03-11] MEGA-BRAIN: "DNA: cole-gordon — FRAMEWORKS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\cole-gordon\FRAMEWORKS.yaml | ID: k-018
- price signaling
- incentives
> Full content: docs/knowledge/k-018.md


### [2026-03-11] MEGA-BRAIN: "DNA: alex-hormozi — METODOLOGIAS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\alex-hormozi\METODOLOGIAS.yaml | ID: k-015
- Automatizar processos de venda
- Melhorar a experiência do cliente
> Full content: docs/knowledge/k-015.md


### [2026-03-11] MEGA-BRAIN: "DNA: alex-hormozi — FILOSOFIAS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\alex-hormozi\FILOSOFIAS.yaml | ID: k-012
- foco em criar valor desproporcional com star employees
> Full content: docs/knowledge/k-012.md
