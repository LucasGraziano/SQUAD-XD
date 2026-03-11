# Data Engineer Agent Memory (Dara)

## Active Patterns
<!-- Current, verified patterns used by this agent -->

### Key Patterns
- CommonJS (`require`/`module.exports`), NOT ES Modules
- ES2022, Node.js 18+, 2-space indent, single quotes
- Absolute imports always (never relative `../`)
- kebab-case for files, PascalCase for components

### Project Structure
- `.aiox-core/core/` — Core modules
- `packages/db/` — Database packages (if applicable)
- `tests/` — Test suites (mirrors source structure)

### Git Rules
- NEVER push — delegate to @devops
- Conventional commits: `feat:`, `fix:`, `docs:`, `test:`

### Database Conventions
- Schema design follows architect decisions
- RLS policies for row-level security
- Migration scripts with rollback procedures

## Promotion Candidates
<!-- Patterns seen across 3+ agents — candidates for CLAUDE.md or .claude/rules/ -->
<!-- Format: - **{pattern}** | Source: {agent} | Detected: {YYYY-MM-DD} -->

## Archived
<!-- Patterns no longer relevant — kept for history -->
<!-- Format: - ~~{pattern}~~ | Archived: {YYYY-MM-DD} | Reason: {reason} -->

## 📚 Knowledge Feed

<!-- Older entries archived. See docs/knowledge/index.yaml -->

### [2026-03-11] MEGA-BRAIN: "Dossier: [Nome do Especialista]"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dossiers\persons\DOSSIER-EXAMPLE.md | ID: k-054
- Analisar video "Como Vender High-Ticket"
- Desenvolver blueprint de ofertas
> Full content: docs/knowledge/k-054.md


### [2026-03-11] MEGA-BRAIN: "DNA: the-scalable-company — METODOLOGIAS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\the-scalable-company\METODO... | ID: k-052
- Avaliacao de dados para melhorias
- Melhoria de processos de coleta e analise de dados
> Full content: docs/knowledge/k-052.md


### [2026-03-11] MEGA-BRAIN: "DNA: the-scalable-company — HEURISTICAS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\the-scalable-company\HEURIS... | ID: k-051
- data-driven decision making
- automating processes
> Full content: docs/knowledge/k-051.md


### [2026-03-11] MEGA-BRAIN: "DNA: the-scalable-company — FILOSOFIAS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\the-scalable-company\FILOSO... | ID: k-049
- Investir em sistemas e processos é fundamental para a escala
- A transparência é essencial para a criação de uma cultura de aprendizado
> Full content: docs/knowledge/k-049.md


### [2026-03-11] MEGA-BRAIN: "DNA: sam-oven — MODELOS-MENTAIS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\sam-oven\MODELOS-MENTAIS.yaml | ID: k-048
- Analyze customer data to inform the business model.
- Develop metrics to measure the effectiveness of the business model.
- Use data to identify trends and areas for improvement.
> Full content: docs/knowledge/k-048.md


### [2026-03-11] MEGA-BRAIN: "DNA: richard-linder — MODELOS-MENTAIS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\richard-linder\MODELOS-MENT... | ID: k-042
- Paid Assessment as Filter can help filter candidates based on skills assessment
> Full content: docs/knowledge/k-042.md


### [2026-03-11] MEGA-BRAIN: "DNA: richard-linder — FRAMEWORKS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\richard-linder\FRAMEWORKS.yaml | ID: k-039
- Avaliar a precisão dos dados coletados com os frameworks
- Desenvolver algoritmos para analisar os dados coletados
- Implementar um sistema de monitoramento para os frameworks
> Full content: docs/knowledge/k-039.md


### [2026-03-11] MEGA-BRAIN: "DNA: jordan-lee — METODOLOGIAS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\jordan-lee\METODOLOGIAS.yaml | ID: k-036
- Analisar dados de chamadas de vendas para identificar padrões e tendências
- Desenvolver um modelo de predição de sucesso de vendas
> Full content: docs/knowledge/k-036.md


### [2026-03-11] MEGA-BRAIN: "DNA: jordan-lee — HEURISTICAS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\jordan-lee\HEURISTICAS.yaml | ID: k-035
- Análise de dados para identificar fatores que determinam enterprise value
> Full content: docs/knowledge/k-035.md


### [2026-03-11] MEGA-BRAIN: "DNA: jordan-lee — FRAMEWORKS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\jordan-lee\FRAMEWORKS.yaml | ID: k-034
- Analyze and visualize data for business operations and sales optimization
- Develop and maintain AI-powered tools for sales coaching and training
- Implement data-driven decision making for talent acquisition
> Full content: docs/knowledge/k-034.md


### [2026-03-11] MEGA-BRAIN: "DNA: jordan-lee — FILOSOFIAS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\jordan-lee\FILOSOFIAS.yaml | ID: k-033
- Analisar dados para entender tendências e padrões
> Full content: docs/knowledge/k-033.md


### [2026-03-11] MEGA-BRAIN: "DNA: jeremy-miner — MODELOS-MENTAIS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\jeremy-miner\MODELOS-MENTAI... | ID: k-032
- Extracting relevant data points for sales analysis
> Full content: docs/knowledge/k-032.md


### [2026-03-11] MEGA-BRAIN: "DNA: jeremy-miner — HEURISTICAS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\jeremy-miner\HEURISTICAS.yaml | ID: k-030
- Análise de dados de vendas
- Conhecimento de tendências no mercado
- Desenvolvimento de relatórios de vendas
> Full content: docs/knowledge/k-030.md


### [2026-03-11] MEGA-BRAIN: "DNA: jeremy-haynes — METODOLOGIAS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\jeremy-haynes\METODOLOGIAS.... | ID: k-026
- The DNA: jeremy-haynes — METODOLOGIAS protocol is data-driven and effective
- Jeremy Haynes' case studies demonstrate the success of data-driven marketing strategies
- The protocol provides a clear and concise framework for data analysis and marketing strategies
> Full content: docs/knowledge/k-026.md


### [2026-03-11] MEGA-BRAIN: "DNA: jeremy-haynes — FRAMEWORKS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\jeremy-haynes\FRAMEWORKS.yaml | ID: k-024
- A análise de dados é essencial para entender o desempenho dos frameworks.
- Os dados podem ser usados para otimizar o processo de marketing.
> Full content: docs/knowledge/k-024.md


### [2026-03-11] MEGA-BRAIN: "DNA: jeremy-haynes — FILOSOFIAS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\jeremy-haynes\FILOSOFIAS.yaml | ID: k-023
- Analyze customer behavior and sales data to identify trends and optimize sales strategies.
- Develop a pricing strategy that takes into account the value provided to customers.
> Full content: docs/knowledge/k-023.md


### [2026-03-11] MEGA-BRAIN: "DNA: jeremy-haynes — CONFIG"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\jeremy-haynes\CONFIG.yaml | ID: k-022
- Melhorar capacidade de processamento de dados
- Aumentar capacidade de armazenamento de dados
> Full content: docs/knowledge/k-022.md


### [2026-03-11] MEGA-BRAIN: "DNA: cole-gordon — FRAMEWORKS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\cole-gordon\FRAMEWORKS.yaml | ID: k-018
- sales operations
- team structure
> Full content: docs/knowledge/k-018.md


### [2026-03-11] MEGA-BRAIN: "DNA: alex-hormozi — MODELOS-MENTAIS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\alex-hormozi\MODELOS-MENTAI... | ID: k-016
- Use data to analyze sales performance and identify trends
- Consider the role of technology in sales automation
- Use metrics to measure the effectiveness of sales strategies
> Full content: docs/knowledge/k-016.md


### [2026-03-11] MEGA-BRAIN: "DNA: alex-hormozi — FILOSOFIAS"
- Source: D:\MEGA BRAIN XD\mega-brain\knowledge\dna\persons\alex-hormozi\FILOSOFIAS.yaml | ID: k-012
- monitore métricas de atração e retenção
> Full content: docs/knowledge/k-012.md
