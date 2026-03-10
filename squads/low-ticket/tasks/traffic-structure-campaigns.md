---
task: Structure Campaigns
responsavel: "@media-buyer"
responsavel_type: agent
atomic_layer: task
elicit: true
Entrada: |
  - media_plan: Plano de mídia do @traffic-head
  - creatives: Briefings de criativos aprovados
  - audiences: Públicos definidos
  - platform: Plataforma (meta, google, tiktok)
  - budget: Orçamento de teste
Saida: |
  - campaign-structure.md: Estrutura completa das campanhas
  - audiences.md: Públicos definidos com targeting
  - test-plan.md: Plano de testes A/B
Checklist:
  - "[ ] Definir estrutura de campanhas (CBO vs ABO)"
  - "[ ] Mapear públicos por adset"
  - "[ ] Distribuir criativos por adset"
  - "[ ] Definir budget por adset"
  - "[ ] Definir regras de kill/scale"
  - "[ ] Criar plano de teste A/B"
  - "[ ] Submeter para aprovação do @traffic-head"
---

# *structure-campaign — Estruturar Campanhas

Estrutura campanhas de teste completas por plataforma.

## Uso

```
@media-buyer *structure-campaign --platform meta --budget 500
```

## Output: campaign-structure.md

```markdown
# Estrutura de Campanhas — [Oferta]
## Plataforma: Meta Ads
## Budget de Teste: R$500

---

## Campanha 1: TESTE COLD (ABO)
**Objetivo:** Conversão (Purchase)
**Budget:** R$350 (R$70/adset)
**Duração:** 5 dias

### Adset 1: Interesse Direto
- **Público:** Interesse em [X], [Y], [Z]
- **Idade:** 25-45
- **Gênero:** [Todos / Feminino / Masculino]
- **Placement:** Automatic
- **Budget:** R$70
- **Ads:**
  - Ad 1: [Hook dor] + Imagem estática
  - Ad 2: [Hook curiosidade] + Carrossel
  - Ad 3: [Hook desejo] + Vídeo 30s

### Adset 2: Lookalike
- **Público:** LAL 1% de compradores / leads
- **Budget:** R$70
- **Ads:** [mesmos 3 ads]

### Adset 3: Broad (sem interesse)
- **Público:** 25-45, sem interesses definidos
- **Budget:** R$70
- **Ads:** [mesmos 3 ads]

### Adset 4: Concorrentes
- **Público:** Interesse em [concorrente A], [concorrente B]
- **Budget:** R$70
- **Ads:** [mesmos 3 ads]

### Adset 5: Comportamental
- **Público:** Engajamento com [tema], compradores online
- **Budget:** R$70
- **Ads:** [mesmos 3 ads]

---

## Campanha 2: RETARGETING (CBO)
**Objetivo:** Conversão (Purchase)
**Budget:** R$150
**Duração:** Ongoing

### Adset 1: Visitou LP (não comprou)
- **Público:** Custom Audience - LP visitors 7d
- **Ads:** [Hooks de urgência/prova social]

### Adset 2: Iniciou checkout (não completou)
- **Público:** Custom Audience - Checkout initiate 14d
- **Ads:** [Hooks de escassez/garantia]

---

## Regras de Operação

### Kill Rules (pausar)
- Adset gastou 2x CPA target sem conversão → PAUSAR
- Ad com CTR < 0.5% após 1000 impressões → PAUSAR
- CPM > 3x média do adset → PAUSAR

### Scale Rules (escalar)
- Adset com 3+ conversões abaixo CPA target → DUPLICAR
- Ad com CTR > 2% e conversões → AUMENTAR budget 20%
- Winner confirmado (5+ conversões) → Mover para CBO

### Teste A/B
| Teste | Variável | Duração |
|-------|----------|---------|
| Teste 1 | Hooks (dor vs curiosidade) | 3 dias |
| Teste 2 | Formato (imagem vs vídeo) | 3 dias |
| Teste 3 | Público (interesse vs LAL) | 5 dias |
```

## Naming Convention

```
[Oferta]_[Objetivo]_[Tipo]_[Público]_[Data]

Exemplos:
LT27_CONV_COLD_InteresseDireto_250225
LT27_CONV_COLD_LAL1Compradores_250225
LT27_CONV_RTG_LPVisitors7d_250225
```
