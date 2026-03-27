---
date: 2026-03-26
title: "Brownfield Discovery — Controle Financeiro Pessoal"
branch: "master"
story: "EPIC-CF-01"
tags: [brownfield, controle-financeiro, google-sheets, ai, classification]
last_commit: "d43a3b1"
created_by: "orion"
---

## O que fizemos
- Brownfield Discovery completo (10 fases) no projeto Controle Financeiro
- Fase 1: System Architecture — análise do Excel, 3 opções avaliadas, recomendação Google Sheets + AI
- Fase 2: Data Analysis — mineração de padrões, schema proposto, estratégia de auto-classificação
- Fase 3: UX/Interface — jornada atual vs ideal, design da interface no Sheets
- Fases 4-8: Consolidação — 13 débitos catalogados, assessment aprovado pelo QA gate
- Fase 9: Relatório Executivo — custos, ROI, timeline
- Fase 10: Epic + 5 stories detalhadas prontas para implementação

## Estado atual
- Brownfield COMPLETO — todos os artefatos gerados
- Solução recomendada: Google Sheets + AI (Claude API) + Apps Script
- 8 stories planejadas, 5 escritas em detalhe (1.1, 1.2, 1.3, 1.4, 1.6)
- Estimativa total: 28h de implementação em 10 dias
- Custo operacional: ~R$ 5/mês
- Nenhum código implementado ainda — fase de planning completa

## Arquivos chave
- `docs/architecture/system-architecture.md` — Arquitetura (Fase 1)
- `Inbox/Controle Financeiro/docs/data/DATA-ANALYSIS.md` — Dados (Fase 2)
- `Inbox/Controle Financeiro/docs/frontend/frontend-spec.md` — UX (Fase 3)
- `Inbox/Controle Financeiro/docs/prd/technical-debt-assessment.md` — Assessment Final (Fases 4-8)
- `Inbox/Controle Financeiro/docs/reports/TECHNICAL-DEBT-REPORT.md` — Relatório Executivo (Fase 9)
- `Inbox/Controle Financeiro/docs/stories/epic-controle-financeiro.md` — Epic (Fase 10)
- `Inbox/Controle Financeiro/docs/stories/1.*.md` — Stories detalhadas

## Decisões tomadas
- Google Sheets + AI é a melhor opção (nota 4.2/5, empate com Web App mas menor risco)
- Claude API para classificação (custo ~R$0.01/txn)
- 3 camadas de classificação: Regras > AI > Manual
- Feedback loop para aprendizado contínuo
- Nubank como banco prioritário para parser CSV
- Dashboard nativo do Sheets (sem Looker Studio no MVP)

## Próximos passos
- Aprovar a solução e iniciar implementação
- Story 1.1: Criar Google Sheet e migrar dados
- Story 1.2: Implementar motor de regras
- Story 1.3: Integrar Claude API
- Para o TCC Investment: brownfield pendente

## Contexto técnico
- Fonte de dados: Excel com 263 transações, 9 colunas, 4 abas
- Target: Google Sheets + Apps Script (V8 runtime) + Claude API
- ~85% das transações auto-classificáveis por regras do histórico
- ~10% precisam de AI, ~5% manuais
- Projeção: 95% auto-classificação após 6 meses de uso
