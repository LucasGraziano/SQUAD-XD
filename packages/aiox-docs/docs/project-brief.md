# Project Brief — AIOX Documentation Site

**Author:** @analyst (Atlas)
**Date:** 2026-03-25
**Status:** Approved

---

## 1. Visao Geral

### Problema
O sistema AIOX + Mega Brain possui dezenas de agentes, centenas de tasks, workflows complexos e um knowledge base com 14 experts e 6000+ elementos de DNA. Atualmente, a unica forma de entender o sistema e lendo arquivos YAML/MD espalhados por 2 repositorios. Nao existe uma interface visual unificada para consulta rapida.

### Solucao
Um site de documentacao interativo, dark-themed (inspirado em emailhacker.ai/brand-dna), que organiza TODO o conhecimento do AIOX e Mega Brain de forma didatica, pesquisavel e visual.

### Publico-Alvo
- **Lucas Graziano** (CEO/CMO) — consulta rapida de comandos, agentes e workflows
- **Pedro Cabral** (CTO) — referencia tecnica de arquitetura e processos
- **Futuros membros** — onboarding acelerado no sistema

## 2. Objetivos

| # | Objetivo | Metrica de Sucesso |
|---|----------|-------------------|
| 1 | Centralizar documentacao AIOX | 100% dos agentes, workflows e tasks documentados |
| 2 | Documentar Mega Brain | 14 experts com DNA completo visivel |
| 3 | Busca rapida | Encontrar qualquer agente/comando em <3 segundos |
| 4 | Onboarding | Novo membro entende o sistema em <30 minutos |
| 5 | Auto-suficiente | Site funciona offline (static export) |

## 3. Escopo

### IN Scope
- Homepage com visao geral e metricas
- Pagina de Constitution (6 artigos)
- Pagina de Core Agents (12 agentes com comandos detalhados)
- Pagina de Workflows (4 workflows + modos de execucao + quality gates)
- Pagina de Commands (slash commands + agent commands + activation syntax)
- Pagina de Squads (Low-Ticket com hierarquia de 29 agentes)
- Pagina do Mega Brain (14 experts, 5 DNA layers, sync pipeline, company context)
- Pagina de Tasks (207 tasks filtráveis por categoria)
- Busca global client-side

### OUT of Scope
- Backend/API (static export only)
- Autenticacao/login
- Edicao de conteudo via UI
- Integracao com Notion/ClickUp
- Mobile app
- CI/CD automatizado

## 4. Restricoes

- **Budget:** Zero (ferramentas ja disponiveis)
- **Timeline:** 1 sessao de desenvolvimento
- **Stack:** Next.js 14 + Tailwind CSS + TypeScript (ja definido)
- **Hospedagem:** Static export (pode servir de qualquer lugar)
- **Dados:** Hardcoded em TypeScript (nao precisa de CMS)

## 5. Riscos

| Risco | Probabilidade | Impacto | Mitigacao |
|-------|--------------|---------|-----------|
| Dados ficarem desatualizados | Alta | Medio | Dados em arquivos .ts faceis de atualizar |
| Muitas paginas sem conteudo | Baixa | Alto | Priorizar profundidade sobre quantidade |
| Build quebrar | Baixa | Baixo | TypeScript strict + build validation |

## 6. Referencia Visual

- **Inspiracao:** https://emailhacker.ai/brand-dna
- **Tema:** Dark tech minimalist
- **Paleta:** Coral #E8837C, Menta #7ECEC1, Gold #D4A574
- **Fontes:** Inter (sans), JetBrains Mono (code)
