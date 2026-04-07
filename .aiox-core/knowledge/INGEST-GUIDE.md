# Guia de Ingestao de Conhecimento — v3.0

## Metodo Recomendado: `/ingest` (DNA v3)

O comando `/ingest` automatiza todo o processo de extração cognitiva.

### Uso rapido
```
/ingest
```
Depois cole o conteudo (transcricao, video YouTube, texto) e o sistema extrai automaticamente.

### Opcoes
- `/ingest` — DNA v3 completo (7 secoes, ~900 tokens)
- `/ingest --mode v2` — DNA v2 legado (5 camadas, ~700 tokens)
- `/ingest --mode simple` — Formato legado (3 campos, ~500 tokens)
- `/ingest --merge` — Enriquece DNA existente com nova fonte

---

## DNA v3 — 7 Secoes Cognitivas (Formato Atual)

DNA v3 adiciona `USE:/FAIL:/VS:` inline em cada L4 framework, mais 2 novas secoes finais: `## Anti-Patterns` e `## Situation Map`.

| Secao | Tipo | Max Items | Proposito |
|-------|------|-----------|-----------|
| L1 Filosofias | Camada | 8 | Crencas fundamentais que guiam decisoes |
| L2 Modelos Mentais | Camada | 8 | Frameworks para PENSAR, nao fazer |
| L3 Heuristicas | Camada | 10 | Regras com threshold quantitativo |
| L4 Frameworks | Camada | 7 | Passos sequenciais com USE/FAIL/VS |
| L5 Metodologias | Camada | 5 | Implementacoes completas A→Z |
| Anti-Patterns | Nova | 5-6 | O que NAO fazer + Fix |
| Situation Map | Nova | 6-8 | Tabela situacao → framework → sinal de alerta |

### Formato `USE:/FAIL:/VS:` em L4

Cada framework em L4 obrigatoriamente tem 3 linhas inline:
```markdown
- **Nome do Framework**: descricao dos passos...
  - USE: quando usar, em qual contexto, quais pre-condicoes
  - FAIL: o que nao fazer, erro classico, anti-pattern especifico
  - VS: tensoes ou diferencas com outro expert/framework mapeado
```

### Formato da secao `## Anti-Patterns`

```markdown
## Anti-Patterns
- **Nome do Anti-Pattern**: descricao do comportamento incorreto → consequencia → **Fix:** acao corretiva especifica
```

### Formato da secao `## Situation Map`

```markdown
## Situation Map
| Situacao | Framework | Sinal de Alerta |
|----------|-----------|-----------------|
| Descricao da situacao | Expert + Framework especifico | Sinal de que o framework errado esta sendo usado |
```

### Formato completo do arquivo DNA v3
```markdown
---
expert: {nome}
domain: {dominio}
source: [{fontes}]
format: dna-v3
elements: N
---

## L1 Filosofias (max 8)
- ...

## L2 Modelos Mentais (max 8)
- **Nome**: ...

## L3 Heuristicas (max 10)
- Regras com NUMEROS...

## L4 Frameworks (max 7)
- **Nome**: passos...
  - USE: quando usar
  - FAIL: erro classico
  - VS: tensoes com outros experts

## L5 Metodologias (max 5)
- Implementacoes completas A→Z...

## Anti-Patterns
- **Nome**: comportamento errado → consequencia → **Fix:** acao

## Situation Map
| Situacao | Framework | Sinal de Alerta |
|----------|-----------|-----------------|
| ... | ... | ... |
```

---

## DNA v2 — 5 Camadas Cognitivas (Legado)

DNA v2 e o formato anterior, ainda valido para experts nao-Doug. DNA v3 e obrigatorio apenas para Doug (todos os 7 dominios).

| Camada | Nome | Max Items | Teste de Inclusao |
|--------|------|-----------|-------------------|
| L1 | Filosofias | 8 | Se removesse, 50%+ das decisoes mudariam? |
| L2 | Modelos Mentais | 6 | Usa para PENSAR, nao para FAZER? |
| L3 | Heuristicas | 8 | Tem threshold quantitativo? |
| L4 | Frameworks | 5 | Tem passos sequenciais? |
| L5 | Metodologias | 3 | Implementacao completa A→Z? |

---

## Arquitetura de Conhecimento v3 (Novos Artefatos)

Alem dos DNAs, o sistema v3 possui artefatos de suporte por dominio:

### `_SITUATIONS.yaml` (global)
Router situacional — mapeia situacoes de negocio para expert + framework + arquivo.
```yaml
situations:
  content_creation:
    - id: SC-001
      trigger: "Criar post/story/conteudo novo..."
      primary_expert: doug
      primary_domain: copy-persuasion
      framework: "Sistema T.A.D."
      load_file: "domains/copy-persuasion/doug.md"
```
Localizado em: `.aiox-core/knowledge/_SITUATIONS.yaml`

### `_decision-map.md` (por dominio)
Arvore de decisao situacional: situacao → expert → framework.
```markdown
## Quando Usar Qual Expert
### Para criar copy de alta conversao
- Headline → Expert: Agora Inc | Framework: ...
```
Localizado em: `.aiox-core/knowledge/domains/{dominio}/_decision-map.md`

### `_anti-patterns.md` (por dominio)
Lista de anti-patterns criticos e recorrentes com signal + consequencia + fix.
```markdown
## Criticos (falha imediata)
**AP-01 | Nome**: sinal → consequencia → fonte → fix
```
Localizado em: `.aiox-core/knowledge/domains/{dominio}/_anti-patterns.md`

### Dossiers Cross-Domain
Sistemas integrados de um expert em multiplos dominios.
- `dossiers/cross-domain/doug-system.md` — 7 dominios do Doug como fluxo unificado

---

## Outros Comandos do Knowledge System

### Dossiers (convergencias cross-source)
```
/dossier {tema}           — Gerar dossier de um tema
/dossier --auto {domain}  — Auto-gerar de experts do dominio
/dossier --list           — Listar dossiers existentes
```
~1000 tokens cada. Salvos em `.aiox-core/knowledge/dossiers/`.

### Playbooks (frameworks operacionais)
```
/playbook {nome}                          — Consultar existente
/playbook --generate {tema} --from {dossier} — Gerar novo
/playbook --list                          — Listar playbooks
```
~800 tokens cada. Salvos em `.aiox-core/knowledge/playbooks/`.

### Consulta dentro de agentes
```
*knowledge {dominio}                  — Index do dominio
*knowledge dossier:{nome}             — Carregar dossier
*knowledge playbook:{nome}            — Carregar playbook
*knowledge decision-map:{dominio}     — Decision map do dominio
*knowledge anti-patterns:{dominio}    — Anti-patterns do dominio
*knowledge situations:{dominio}       — Filtrar situacoes do dominio
```

---

## Fluxo Manual (legado)

### Passo 1: Preparar o conteudo
Cole o conteudo bruto (transcricao, notas, resumo) em uma conversa com o Claude.

### Passo 2: Pedir a compressao
Use `/ingest` ou o prompt manual:

```
Comprima este conteudo no formato AIOX Knowledge v3.
Expert: {nome}
Dominio: {escolha: copy-persuasion | offers-pricing | sales-closing | traffic-ads | funnels-value-ladder | systems-ops | psychology-influence}

REGRAS:
- DNA v3 (~900 tokens): L1-L5 + USE/FAIL/VS em L4 + Anti-Patterns + Situation Map
- DNA v2 (~700 tokens): apenas L1-L5 (modo legado)
- Zero teoria, so pratica
- Incluir numeros sempre que possivel
- USE/FAIL/VS deve ser especifico (nao generico)
- Anti-Patterns: max 6, com Fix acionavel
- Situation Map: max 8 linhas, sinal de alerta preciso
```

### Passo 3: Salvar no AIOX
```bash
# Path: .aiox-core/knowledge/domains/{dominio}/{expert-slug}.md

# Atualizar _index.md do dominio (adicionar expert se novo)
# Atualizar _REGISTRY.yaml (dna_v3_status + total_experts)
# Atualizar _ROUTING.yaml se expert e relevante para novos agentes
```

### Passo 4: Verificar routing
Se o expert e relevante para um agente que NAO esta mapeado:
- Editar `_ROUTING.yaml` e adicionar o dominio ao agente

---

## Dominios disponiveis
1. `copy-persuasion` — Headlines, hooks, emotional triggers, narrativa
2. `offers-pricing` — Offer creation, value equation, pricing, stacking
3. `sales-closing` — DM, objection handling, StoryAds, ascensao
4. `traffic-ads` — Instagram orgânico, StoryAds, Money Brand, Z4
5. `funnels-value-ladder` — Teia de Ofertas, value ladders, ascensao
6. `systems-ops` — Agentes neurais, PromptBook, DOUG.EXE, escala solo
7. `psychology-influence` — Tensao psicologica, dissecacao neural, urgencia

## Multi-dominio
Se um expert cobre MAIS de 1 dominio, crie 1 arquivo por dominio.
Exemplo: Doug tem arquivo em todos os 7 dominios.
Exemplo: Russell Brunson tem arquivo em:
- `offers-pricing/russell-brunson.md`
- `funnels-value-ladder/russell-brunson.md`
- `copy-persuasion/russell-brunson.md`

## Regra de Upgrade DNA v2 → v3
DNA v3 e obrigatorio apenas para experts com 5+ frameworks mapeados em L4.
Para experts com 1-4 frameworks, DNA v2 e suficiente.
Indicador de quando fazer upgrade: quando o agente frequentemente aplica o framework errado ou precisa de contexto adicional sobre quando usar cada um.
