# PRD — AIOX Documentation Site

**Author:** @pm (Morgan)
**Version:** 1.0
**Date:** 2026-03-25
**Status:** Approved

---

## 1. Product Vision

Criar a documentacao definitiva do ecossistema AIOX + Mega Brain: um site estatico, dark-themed, que permita consultar rapidamente qualquer agente, comando, workflow, task ou expert do sistema.

## 2. User Stories

### US-1: Consultar Agente
**Como** usuario do AIOX, **quero** ver todos os detalhes de um agente (persona, comandos, exclusivos, colaboracoes), **para** saber exatamente como ativa-lo e o que ele faz.

### US-2: Entender Workflows
**Como** usuario, **quero** visualizar os 4 workflows primarios com fases, agentes e outputs, **para** saber qual workflow usar em cada situacao.

### US-3: Buscar Comandos
**Como** usuario, **quero** buscar rapidamente um comando (slash ou agent), **para** nao precisar lembrar de cor todos os comandos.

### US-4: Explorar Mega Brain
**Como** usuario, **quero** ver todos os 14 experts com suas 5 camadas de DNA, **para** entender que conhecimento esta disponivel no sistema.

### US-5: Consultar Tasks
**Como** usuario, **quero** filtrar e buscar entre as 207 tasks por categoria e agent, **para** saber que automacoes existem.

### US-6: Entender Constitution
**Como** usuario, **quero** ver os 6 artigos constitucionais com severidade visual, **para** entender as regras inegociaveis do sistema.

### US-7: Navegar pelo Squad
**Como** usuario, **quero** ver a hierarquia do Low-Ticket Squad (Commander > Chiefs > Specialists), **para** entender a estrutura de marketing.

### US-8: Busca Global
**Como** usuario, **quero** uma busca que funcione em tempo real filtrando agentes, comandos, workflows, experts e artigos, **para** encontrar qualquer coisa em <3 segundos.

## 3. Functional Requirements

### FR-1: Navigation
- FR-1.1: Sidebar fixa com links para todas as secoes
- FR-1.2: Sidebar colapsavel para ganhar espaco
- FR-1.3: Status indicator (versao + online dot)

### FR-2: Home Page
- FR-2.1: Hero section com titulo, descricao e CTAs
- FR-2.2: Stats cards (agents, workflows, tasks, commands)
- FR-2.3: "Como funciona" em 3 passos visuais
- FR-2.4: Feature grid com links para secoes
- FR-2.5: Arquitetura de 4 camadas (L1-L4) visual

### FR-3: Agents Page (/aiox/)
- FR-3.1: Quick reference pills para navegacao por anchor
- FR-3.2: Card expandido por agente com: persona, zodiac, archetype, role, comandos, exclusivos, collaborates
- FR-3.3: Cada comando mostra nome + descricao
- FR-3.4: Delegation matrix table
- FR-3.5: Story permissions e blocked ops quando aplicavel

### FR-4: Workflows Page (/workflows/)
- FR-4.1: Selection guide (quando usar cada workflow)
- FR-4.2: Modos de execucao (YOLO, Interactive, Preflight)
- FR-4.3: Diagrama visual por workflow com fases, agentes e outputs
- FR-4.4: QA Loop commands e verdicts
- FR-4.5: 7-point quality gate checklist
- FR-4.6: Spec Pipeline complexity classes

### FR-5: Commands Page (/commands/)
- FR-5.1: Activation syntax (3 formas)
- FR-5.2: Agent commands (* prefix) com descricoes
- FR-5.3: Slash commands (/ prefix) com categoria, descricao e uso

### FR-6: Squads Page (/squads/)
- FR-6.1: Stats (commander, chiefs, specialists, departments)
- FR-6.2: T1 Commander com destaque visual (glow)
- FR-6.3: T2 Chiefs em grid com department badge
- FR-6.4: T3 Specialists agrupados por departamento
- FR-6.5: Low-Ticket Squad workflows (5 pipelines)

### FR-7: Mega Brain Page (/mega-brain/)
- FR-7.1: Stats (items, experts, layers, dossiers, playbooks)
- FR-7.2: DNA System - 5 layers com icone e descricao
- FR-7.3: Architecture tree visual
- FR-7.4: Sync Pipeline em 4 passos
- FR-7.5: 14 Expert cards com todas as layers e items
- FR-7.6: Dossier categories
- FR-7.7: Company context (founders, products, business model)
- FR-7.8: Low-Ticket Squad workflows

### FR-8: Tasks Page (/workflows/ — merged)
- FR-8.1: Filtro por categoria (19 categorias)
- FR-8.2: Busca textual em tempo real
- FR-8.3: Card por task com nome, agente, descricao, arquivo
- FR-8.4: Contador de resultados filtrados

### FR-9: Constitution Page (/constitution/)
- FR-9.1: Severity legend visual
- FR-9.2: Card por artigo com numero, nome, severidade badge, icone
- FR-9.3: Lista de regras por artigo
- FR-9.4: Enforcement description

### FR-10: Search Page (/search/)
- FR-10.1: Input com autofocus e contador de resultados
- FR-10.2: Busca em tempo real (client-side, sem API)
- FR-10.3: Resultados agrupados por tipo (Agents, Workflows, Commands, Experts, Articles)
- FR-10.4: Link direto para secao relevante

## 4. Non-Functional Requirements

- **NFR-1:** Site deve buildar como static export (next export)
- **NFR-2:** First Load JS < 100KB por pagina
- **NFR-3:** Build time < 30 segundos
- **NFR-4:** Zero erros de TypeScript em strict mode
- **NFR-5:** Responsivo (desktop-first, funcional em tablet)
- **NFR-6:** Dark theme exclusively (sem light mode)
- **NFR-7:** Fontes: Inter + JetBrains Mono (Google Fonts)

## 5. Constraints

- **CON-1:** Next.js 14 com App Router
- **CON-2:** Tailwind CSS 3.4 para styling
- **CON-3:** TypeScript strict mode
- **CON-4:** Static export (output: 'export')
- **CON-5:** Dados hardcoded em src/data/*.ts (sem CMS/API)
- **CON-6:** Porta 3456 para dev server

## 6. Acceptance Criteria

### AC-1: Navegacao
- [ ] Sidebar visivel em todas as paginas
- [ ] Sidebar colapsavel funciona
- [ ] Active state correto no link atual

### AC-2: Conteudo
- [ ] Todos os 12 AIOX agents documentados com comandos
- [ ] Todos os 18 Low-Ticket agents documentados
- [ ] 4 workflows com diagramas visuais
- [ ] 207 tasks listadas e filtraveis
- [ ] 8 slash commands documentados
- [ ] 14 Mega Brain experts com DNA layers
- [ ] 6 artigos constitucionais
- [ ] Company context e business model

### AC-3: Busca
- [ ] Busca global encontra agentes por @id
- [ ] Busca global encontra comandos por *nome ou /nome
- [ ] Busca global encontra experts por nome
- [ ] Resultados agrupados por tipo

### AC-4: Build
- [ ] `npm run build` passa sem erros
- [ ] Static export gera todas as paginas
- [ ] `npm run dev` roda na porta 3456
