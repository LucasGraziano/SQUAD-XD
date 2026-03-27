# DOCUMENTAÇÃO DE ESTADO ATUAL (BROWNFIELD) - SQUAD XD

## 1. Visão Geral do Projeto
O projeto **SQUAD XD** é um ecossistema de orquestração de IA baseado no framework **AIOX**. Ele foi iniciado como um "Greenfield" funcional, mas sem a documentação formal de requisitos (PRD) e arquitetura.

## 2. Estrutura do Monorepo
- **.aiox-core/**: O coração do framework. Contém a lógica de orquestração, agentes, tasks e templates.
- **packages/aiox-docs/**: Site de documentação didática (Next.js + Tailwind) focado em explicar o AIOX e o Mega Brain.
- **packages/ebook-generator/**: (A ser analisado) Provável ferramenta de geração de conteúdo.
- **packages/knowledge-feeder/**: (A ser analisado) Provável ferramenta de ingestão de dados.
- **packages/zero-diastasis-site/**: Site do produto principal "Zero Diástase".
- **squads/low-ticket/**: Configurações e projetos específicos para o nicho de produtos de baixo ticket.

## 3. Tech Stack Identificada
- **Framework IA:** AIOX (v4.0 Protocol).
- **Frontend:** Next.js, React, TypeScript, Tailwind CSS.
- **Orquestração:** Codex CLI / Gemini CLI / Claude Code.
- **Knowledge Base:** Mega Brain (D:\MEGA BRAIN XD).

## 4. Gaps de Documentação (Dívida Técnica)
- [ ] **PRD (docs/prd.md):** Ausente. Não há definição formal de features, objetivos de negócio e métricas de sucesso.
- [ ] **Architecture (docs/architecture.md):** Parcial. A estrutura de pastas existe, mas não há um documento que defina os padrões de comunicação entre serviços e fluxos de dados.
- [ ] **Sharding:** Como não há PRD, as stories estão sendo criadas de forma ad-hoc ou sem um roadmap claro.

## 5. Próximos Passos (Protocolo Orion)
1. **Gerar docs/prd.md:** Transformar o "conhecimento implícito" do código em requisitos explícitos.
2. **Gerar docs/architecture.md:** Definir a arquitetura atual para guiar futuras expansões.
3. **Executar Sharding:** Quebrar os documentos em pedaços acionáveis para o fluxo SM → DEV → QA.
