---
task: New Offer Pipeline
responsavel: "@commander"
responsavel_type: agent
atomic_layer: task
elicit: true
Entrada: |
  - niche: Nicho do produto (obrigatório)
  - persona: Descrição do público-alvo (obrigatório)
  - price: Preço do produto (default: 27)
  - product_type: Tipo de produto (ebook, curso, templates, etc.)
Saida: |
  - offer-thesis.md: Tese da oferta validada
  - product-blueprint.md: Estrutura do produto
  - sales-letter.md: Carta de vendas
  - hooks.md: Variações de ganchos
  - creative-briefs/: Briefings de criativos
  - funnel-architecture.md: Arquitetura do funil
  - media-plan.md: Plano de mídia
Checklist:
  - "[ ] Coletar briefing do usuário (nicho, persona, preço)"
  - "[ ] FASE 1: Inteligência — definir tese da oferta"
  - "[ ] FASE 2: Produto — estruturar entregável"
  - "[ ] FASE 3: Copy — criar textos persuasivos"
  - "[ ] FASE 4: Criativos — gerar briefings visuais"
  - "[ ] FASE 5: Funil — arquitetar funil de vendas"
  - "[ ] FASE 6: Tráfego — plano de mídia e campanhas"
  - "[ ] Entregar pacote completo ao usuário"
---

# *new-offer — Pipeline Completo

Orquestra o pipeline completo de criação de oferta low-ticket, do zero à oferta pronta para tráfego.

## Uso

```
@commander *new-offer --niche "emagrecimento" --persona "mulher 30-45" --price 27
```

## Pipeline de Execução

### Fase 1: Inteligência (delegada a @intel-chief)

```
Commander → @intel-chief *define-thesis
  ├── @intel-chief delega para @research-miner *mine-pains
  ├── @intel-chief delega para @competitor-analyst *analyze-competitors
  └── @intel-chief sintetiza tudo em offer-thesis.md

📄 Output: offer-thesis.md
🔄 Usuário aprova tese antes de avançar
```

**offer-thesis.md contém:**
- Resumo do nicho e oportunidade
- Top 10 dores (com citações diretas do público)
- Top 10 desejos (com citações diretas)
- Análise de 3-5 concorrentes principais
- Ângulos de copy recomendados
- Posicionamento sugerido
- GAPs identificados na concorrência

### Fase 2: Produto (delegada a @product-architect)

```
Commander → @product-architect *design-product
  └── Define formato, módulos, bônus, entrega

📄 Output: product-blueprint.md
🔄 Usuário aprova estrutura do produto
```

### Fase 3: Copy (delegada a @copy-chief)

```
Commander → @copy-chief *copy-brief
  ├── @copy-chief delega para @hook-master *generate-hooks
  ├── @copy-chief delega para @copywriter *write-sales-letter
  ├── @copy-chief delega para @script-writer *write-vsl
  └── @copy-chief revisa e aprova todos os textos

📄 Output: hooks.md, sales-letter.md, vsl-script.md
🔄 Usuário aprova copy antes de avançar
```

### Fase 4: Criativos (delegada a @creative-director)

```
Commander → @creative-director *create-ad-visuals
  └── Gera prompts AI art, briefings de design, direção visual

📄 Output: creative-briefs/, ad-prompts/
🔄 Usuário aprova direção criativa
```

### Fase 5: Funil (delegada a @funnel-chief)

```
Commander → @funnel-chief *design-funnel
  ├── @funnel-chief delega para @funnel-engineer *build-landing
  └── @funnel-chief delega para @quiz-builder *build-quiz (se aplicável)

📄 Output: funnel-architecture.md, page-specs/
🔄 Usuário aprova arquitetura do funil
```

### Fase 6: Tráfego (delegada a @traffic-head)

```
Commander → @traffic-head *media-plan
  ├── @traffic-head delega para @media-buyer *structure-campaign
  └── @traffic-head delega para @metrics-analyst (prepara dashboard)

📄 Output: media-plan.md, campaign-structure.md
🔄 Usuário aprova plano de mídia
```

## Entrega Final

```
✅ Oferta low-ticket pronta!

📁 Artefatos gerados:
  📄 offer-thesis.md          — Tese da oferta
  📄 product-blueprint.md     — Estrutura do produto
  📄 sales-letter.md          — Carta de vendas
  📄 hooks.md                 — 15+ variações de ganchos
  📄 vsl-script.md            — Roteiro de VSL
  📁 creative-briefs/         — Briefings de criativos
  📁 ad-prompts/              — Prompts para AI art
  📄 funnel-architecture.md   — Arquitetura do funil
  📁 page-specs/              — Specs das páginas
  📄 media-plan.md            — Plano de mídia
  📄 campaign-structure.md    — Estrutura de campanhas

🚀 Próximos passos:
  1. Criar o produto baseado em product-blueprint.md
  2. Implementar o funil baseado em page-specs/
  3. Criar os criativos baseado em creative-briefs/
  4. Subir campanhas baseado em campaign-structure.md
  5. Monitorar métricas com @metrics-analyst
```
