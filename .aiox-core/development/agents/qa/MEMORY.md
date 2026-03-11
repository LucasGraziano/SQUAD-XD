# QA Agent Memory (Quinn)

## Active Patterns
<!-- Current, verified patterns used by this agent -->

### Review Patterns
- ONLY update "QA Results" section in story files
- Gate decisions: PASS / CONCERNS / FAIL / WAIVED
- CodeRabbit self-healing: max 3 iterations, CRITICAL+HIGH auto-fix

### Test Infrastructure
- `npm test` — Jest 30.2.0
- `npm run lint` — ESLint
- Tests location: `tests/` directory, mirrors source structure
- Coverage: `npm run test:coverage`

### Quality Checks (7-point)
1. Code review (patterns, readability)
2. Unit tests (coverage, passing)
3. Acceptance criteria met
4. No regressions
5. Performance acceptable
6. Security (OWASP basics)
7. Documentation updated

### Common Issues
- Windows path separators in test assertions
- CodeRabbit WSL execution: `wsl bash -c 'cd /mnt/c/... && ~/.local/bin/coderabbit ...'`
- SYNAPSE metrics at `.synapse/metrics/`
- Pipeline benchmarks at `tests/synapse/benchmarks/`

### Git Rules
- Read-only: `git status`, `git log`, `git diff`
- NEVER commit or push

## Promotion Candidates
<!-- Patterns seen across 3+ agents — candidates for CLAUDE.md or .claude/rules/ -->
<!-- Format: - **{pattern}** | Source: {agent} | Detected: {YYYY-MM-DD} -->

## Archived
<!-- Patterns no longer relevant — kept for history -->
<!-- Format: - ~~{pattern}~~ | Archived: {YYYY-MM-DD} | Reason: {reason} -->

## 📚 Knowledge Feed

### [2026-03-11] MEGA-BRAIN: "FOUNDER PROFILE - LUCAS (GRAZIANO)"
- Source: D:\MEGA BRAIN XD\mega-brain\agents\sua-empresa\founders\FOUNDER-LUCAS.md | ID: k-059
- Lucas precisa ser mais cuidadoso em sua análise de dados
> Full content: docs/knowledge/k-059.md


### [2026-03-11] MEGA-BRAIN: "DNA: the-scalable-company — METODOLOGIAS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\the-scalable-company\METODO... | ID: k-052
- Testes e validacao de metodologias
- Melhoria contuinada de resultados e eficiencia
> Full content: docs/knowledge/k-052.md


### [2026-03-11] MEGA-BRAIN: "DNA: the-scalable-company — HEURISTICAS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\the-scalable-company\HEURIS... | ID: k-051
- quality assurance
- testing for automation
> Full content: docs/knowledge/k-051.md


### [2026-03-11] MEGA-BRAIN: "DNA: sam-oven — MODELOS-MENTAIS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\sam-oven\MODELOS-MENTAIS.yaml | ID: k-048
- Test the business model for flaws and areas for improvement.
- Evaluate the user experience and identify areas for improvement.
- Conduct regular reviews to ensure the business model is aligned with customer needs.
> Full content: docs/knowledge/k-048.md


### [2026-03-11] MEGA-BRAIN: "DNA: richard-linder — FRAMEWORKS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\richard-linder\FRAMEWORKS.yaml | ID: k-039
- Testar os frameworks em diferentes cenários
- Avaliar a eficiência dos frameworks em diferentes aspectos da empresa
- Desenvolver ferramentas para avaliar a qualidade dos frameworks
> Full content: docs/knowledge/k-039.md


### [2026-03-11] MEGA-BRAIN: "DNA: jeremy-miner — MODELOS-MENTAIS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\jeremy-miner\MODELOS-MENTAI... | ID: k-032
- Testing the effectiveness of each model in sales scenarios
> Full content: docs/knowledge/k-032.md


### [2026-03-11] MEGA-BRAIN: "DNA: jeremy-miner — HEURISTICAS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\jeremy-miner\HEURISTICAS.yaml | ID: k-030
- Verificação de regras de vendas
- Análise de casos de sucesso
- Testes de eficácia
> Full content: docs/knowledge/k-030.md


### [2026-03-11] MEGA-BRAIN: "DNA: jeremy-haynes — METODOLOGIAS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\jeremy-haynes\METODOLOGIAS.... | ID: k-026
- The DNA: jeremy-haynes — METODOLOGIAS protocol is well-tested and effective
- Jeremy Haynes' case studies demonstrate the success of well-tested marketing strategies
- The protocol provides a clear and concise framework for testing and validation
> Full content: docs/knowledge/k-026.md


### [2026-03-11] MEGA-BRAIN: "DNA: jeremy-haynes — FRAMEWORKS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\jeremy-haynes\FRAMEWORKS.yaml | ID: k-024
- A qualidade é fundamental para garantir que os frameworks sejam eficazes.
- A validação dos frameworks é essencial para garantir que sejam aplicados corretamente.
> Full content: docs/knowledge/k-024.md


### [2026-03-11] MEGA-BRAIN: "DNA: cole-gordon — FRAMEWORKS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\cole-gordon\FRAMEWORKS.yaml | ID: k-018
- offer design
- strategy
> Full content: docs/knowledge/k-018.md


### [2026-03-11] MEGA-BRAIN: "DNA: alex-hormozi — FILOSOFIAS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\alex-hormozi\FILOSOFIAS.yaml | ID: k-012
- celebrar resultados
- criar métricas objetivas
> Full content: docs/knowledge/k-012.md
