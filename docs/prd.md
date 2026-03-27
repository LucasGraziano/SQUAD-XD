# PRODUCT REQUIREMENTS DOCUMENT (PRD) - SQUAD XD (BROWNFIELD)

## 1. Visão Geral e Objetivos
O **SQUAD XD** é uma plataforma de orquestração de IA de alto desempenho, projetada para automatizar o ciclo completo de desenvolvimento de software e marketing digital (nicho low-ticket). O objetivo é permitir que um "Vibe CEO" dirija uma equipe de agentes de IA para criar produtos, funis e código com mínima intervenção manual.

### 1.1 Objetivos Principais
- **Automação Total:** Reduzir o tempo de criação de um novo produto (funil + códgio) de semanas para dias.
- **DNA Injection:** Integrar o Mega Brain como fonte de verdade para todas as decisões estratégicas.
- **Qualidade Rigorosa:** Implementar QA Gates em todas as etapas do processo.

## 2. Requisitos de Negócio (Epic 1: Framework AIOX)
- **FR-1:** O sistema deve permitir a ativação de agentes especializados (PM, Dev, QA, etc.).
- **FR-2:** O sistema deve suportar workflows Brownfield e Greenfield.
- **FR-3:** Integração nativa com Mega Brain (D:\MEGA BRAIN XD) para consulta de heurísticas.

## 3. Requisitos de Negócio (Epic 2: AIOX Docs)
- **FR-4:** Site didático em Next.js para visualizar agentes, tasks e o Mega Brain.
- **FR-5:** Interface responsiva e estética "Brand DNA" (alto contraste, neons).
- **FR-6:** Busca rápida de comandos e tarefas.

## 4. Requisitos de Negócio (Epic 3: Low-Ticket Squad)
- **FR-7:** Automação de criação de páginas de vendas (HTML/CSS) para produtos como "Zero Diástase".
- **FR-8:** Geração de scripts de VSL baseados no Mega Brain.

## 5. Arquitetura Proposta (Resumo)
- **Monorepo:** Uso de pacotes compartilhados em `/packages`.
- **Orquestração:** Baseada em arquivos `.md` e `.yaml` no `.aiox-core`.
- **Status Tracking:** Stories em `docs/stories/` com estados definidos (Draft, Approved, InProgress, Done).

## 6. Métricas de Sucesso
- Tempo de ativação de um novo agente < 1s.
- Cobertura de documentação (PRD + Architecture) = 100%.
- Taxa de aprovação do QA Gate > 90%.
