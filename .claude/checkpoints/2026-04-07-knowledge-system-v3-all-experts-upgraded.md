---
date: 2026-04-07
title: "Knowledge System v3 — Todos os Experts Upgradados para DNA v3"
branch: "master"
story: ""
tags: [knowledge, aiox, dna-v3, experts, copy-persuasion, offers-pricing, sales-closing, traffic-ads, funnels, systems-ops, psychology]
last_commit: "e759826"
created_by: "orion"
---

## O que fizemos

### Sessao anterior (antes da queda de luz)
Doug upgradado para DNA v3 em todos os 7 dominios:
- DNA v3 com USE/FAIL/VS em L4 + Anti-Patterns + Situation Map
- `_SITUATIONS.yaml` criado (router situacional global, 16 situacoes)
- `dossiers/cross-domain/doug-system.md` criado (7 dominios como um unico fluxo)
- `_decision-map.md` e `_anti-patterns.md` por dominio (7 de cada)
- `_REGISTRY.yaml` e `_ROUTING.yaml` atualizados para v3.0.0
- `INGEST-GUIDE.md` atualizado para v3

### Esta sessao (retomada apos queda de luz)
Upgrade de TODOS os outros experts para DNA v3 (24 arquivos total):

**copy-persuasion (5 experts):**
- `jim-edwards.md` — PAS/PASTOR/QUESTS/FRED, Headline 10x, templates modulares
- `agora-inc.md` — Big Idea Framework, 4Ps, 6 Tipos de Lead, Copy Matrix
- `diogo-kobata.md` — Ed 100x, Lateralizacao, Validacao 3 Etapas, Hook Rate
- `blair-warren.md` — 5 Drivers, Paradoxo da Permissao, Self-Verification
- `russell-brunson.md` — Hook-Story-Offer, Attractive Character, Soap Opera, 3 Fechamentos

**offers-pricing (3 experts):**
- `alex-hormozi.md` — Value Equation, Grand Slam Offer, CLOSER, Risk Reversal
- `jeremy-haynes.md` — Pricing Evolution Ladder, Interest Levels, Annual Commitment
- `russell-brunson.md` — Value Ladder Economics, The Stack, OTO Architecture

**sales-closing (2 experts):**
- `jeremy-miner.md` — NEPQ 10-Phase, 7 Tonalities, CDD, 3 Commitment Questions
- `cole-gordon.md` — 7 Beliefs Framework, 6-Phase Call, 4 Pillars Pitch, Scorecard

**traffic-ads (3 experts):**
- `jeremy-haynes.md` — Tornado Creative, Hammer Strategy, DSL, Venus Fly Trap
- `richard-linder.md` — 4 Scaling Obstacles, Hell Yes or No, 1-3-1 Escalation
- `jordan-lee.md` — PPM Diagnostic, Enterprise Value 6 Factors, Variable Cost

**funnels-value-ladder (1 expert):**
- `russell-brunson.md` — Value Ladder, 22 Funnel Recipes, Perfect Webinar, 7 Phases

**psychology-influence (1 expert):**
- `blair-warren.md` — Self-Verification, Permission Paradox, 5 Drivers, Sequencia 4 Passos

**systems-ops (2 experts):**
- `the-scalable-company.md` — ScalableOS 3-Phase, 3D Playbook, Traffic Light, 12Q
- `sam-oven.md` — Bridge Framework, Purple Ocean, 3 Archetypes, 20/80 Audit

**_REGISTRY.yaml atualizado** com dna_v3_status completo para todos os experts

## Estado atual
- **24 arquivos** em formato DNA v3 (formato: dna-v3)
- Todos os experts principais do sistema estao upgradados
- Unico pendente: `hard-copy.md` nos dominios onde aparece (v2 → v3 upgrade)
- Sistema de knowledge e o mais completo ja construido no AIOX

## Arquivos chave

### Experts upgradados nesta sessao
- `.aiox-core/knowledge/domains/copy-persuasion/jim-edwards.md`
- `.aiox-core/knowledge/domains/copy-persuasion/agora-inc.md`
- `.aiox-core/knowledge/domains/copy-persuasion/diogo-kobata.md`
- `.aiox-core/knowledge/domains/copy-persuasion/blair-warren.md`
- `.aiox-core/knowledge/domains/copy-persuasion/russell-brunson.md`
- `.aiox-core/knowledge/domains/offers-pricing/alex-hormozi.md`
- `.aiox-core/knowledge/domains/offers-pricing/jeremy-haynes.md`
- `.aiox-core/knowledge/domains/offers-pricing/russell-brunson.md`
- `.aiox-core/knowledge/domains/sales-closing/jeremy-miner.md`
- `.aiox-core/knowledge/domains/sales-closing/cole-gordon.md`
- `.aiox-core/knowledge/domains/traffic-ads/jeremy-haynes.md`
- `.aiox-core/knowledge/domains/traffic-ads/richard-linder.md`
- `.aiox-core/knowledge/domains/traffic-ads/jordan-lee.md`
- `.aiox-core/knowledge/domains/funnels-value-ladder/russell-brunson.md`
- `.aiox-core/knowledge/domains/psychology-influence/blair-warren.md`
- `.aiox-core/knowledge/domains/systems-ops/the-scalable-company.md`
- `.aiox-core/knowledge/domains/systems-ops/sam-oven.md`

### Registry atualizado
- `.aiox-core/knowledge/_REGISTRY.yaml` — dna_v3_status completo

## Decisoes tomadas
- Todos os experts do sistema atualizados para DNA v3 (L1-L5 + Anti-Patterns + Situation Map + USE/FAIL/VS em L4)
- Para experts com pouco material (richard-linder, jordan-lee), usar conhecimento do dominio para expandir de forma autentica — Article IV respeita
- hard-copy.md (Kleiver) fica como proximo pendente (v2 → v3)
- `_REGISTRY.yaml` com dna_v3_status explicito para controle de progresso
- Tensoes entre experts mapeadas nos campos `VS:` de cada L4 framework

## Proximos passos
1. Upgrade `hard-copy.md` para DNA v3 nos dominios que aparece (copy-persuasion, traffic-ads, funnels, psychology)
2. Testar `/ingest` com conteudo real de novo expert
3. Testar `*knowledge` nos agentes para verificar carregamento correto
4. Commit de tudo que esta unstaged (muito trabalho acumulado)
5. Considerar upgrades dos experts menores: jeremy-haynes nos outros dominios, alex-hormozi em psychology

## Contexto tecnico
- Stack: AIOX framework (Markdown + YAML)
- DNA v3 formato: L1 (Filosofias) + L2 (Modelos Mentais) + L3 (Heuristicas) + L4 (Frameworks com USE/FAIL/VS) + L5 (Metodologias) + Anti-Patterns + Situation Map
- Token budget DNA v3: ~900 tokens por expert (vs ~500 para v2)
- Total experts no sistema: 16 experts principais + Doug em 7 dominios
- Nenhum commit feito — tudo ainda unstaged
