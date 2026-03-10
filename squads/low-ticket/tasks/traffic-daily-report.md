---
task: Daily Performance Report
responsavel: "@metrics-analyst"
responsavel_type: agent
atomic_layer: task
elicit: true
Entrada: |
  - period: Período de análise (today, yesterday, 7d, 30d)
  - platform: Plataforma (meta, google, tiktok, all)
  - metrics_data: Dados de métricas (CSV, screenshot, ou manual)
  - cpa_target: CPA target definido no media-plan.md
Saida: |
  - daily-report.md: Relatório de performance
  - performance-analysis.md: Análise detalhada com diagnóstico
  - action-items.md: Ações recomendadas priorizadas
Checklist:
  - "[ ] Coletar dados de todas as plataformas ativas"
  - "[ ] Calcular KPIs consolidados"
  - "[ ] Comparar com CPA targets e benchmarks"
  - "[ ] Identificar winners (ads, adsets, públicos)"
  - "[ ] Identificar losers para pausar"
  - "[ ] Analisar métricas do funil (drop-off por etapa)"
  - "[ ] Calcular unit economics atualizado"
  - "[ ] Gerar ações recomendadas priorizadas"
  - "[ ] Submeter relatório ao @traffic-head"
---

# *daily-report / *identify-winners / *funnel-metrics — Performance Analysis

Analisa métricas de performance e gera relatório com ações recomendadas.

## Uso

```
@metrics-analyst *daily-report --period 7d --platform all
@metrics-analyst *identify-winners
@metrics-analyst *funnel-metrics
@metrics-analyst *roi-analysis
```

## Output: daily-report.md

```markdown
# Performance Report — [Data/Período]

## Resumo Executivo
| Métrica | Valor | vs Target | Trend |
|---------|-------|-----------|-------|
| Spend | R$[X] | — | — |
| Purchases | [N] | — | ↑/↓ |
| CPA | R$[X] | R$[target] | 🟢/🟡/🔴 |
| ROAS | [X]x | [target]x | 🟢/🟡/🔴 |
| CTR | [X]% | >1% | 🟢/🟡/🔴 |
| CR (LP) | [X]% | >2% | 🟢/🟡/🔴 |
| AOV | R$[X] | R$[target] | — |

## Status: 🟢 SAUDÁVEL / 🟡 ATENÇÃO / 🔴 CRÍTICO

---

## Winners 🏆
| Rank | Item | Tipo | CPA | ROAS | Ação |
|:----:|------|------|-----|------|------|
| 1 | [Ad/Adset name] | Ad | R$8 | 3.4x | ESCALAR |
| 2 | [Ad/Adset name] | Adset | R$10 | 2.7x | ESCALAR |
| 3 | [Ad/Adset name] | Ad | R$11 | 2.5x | MANTER |

## Losers 💀
| Item | Tipo | CPA | Spend | Ação |
|------|------|-----|-------|------|
| [Ad/Adset name] | Ad | R$35 | R$70 | PAUSAR |
| [Ad/Adset name] | Adset | R$28 | R$56 | PAUSAR |

---

## Funil de Conversão
| Etapa | Visitantes | Conv. | Drop-off |
|-------|:----------:|:-----:|:--------:|
| Clique no Ad | 1,000 | — | — |
| Landing Page | 850 | 85% | 15% |
| Scroll 50% | 510 | 60% | 40% |
| CTA Click | 170 | 20% | 80% |
| Checkout | 102 | 12% | 88% |
| Purchase | 30 | 3% | 97% |

**Gargalo identificado:** [Etapa com maior drop-off anormal]

---

## Unit Economics (Atualizado)
| Métrica | Planejado | Real | Delta |
|---------|-----------|------|-------|
| Preço produto | R$27 | R$27 | — |
| AOV (com bumps) | R$45 | R$[X] | [+/-] |
| CPA | R$12 | R$[X] | [+/-] |
| Taxas | R$4.50 | R$[X] | — |
| **Lucro/venda** | **R$28.50** | **R$[X]** | [+/-] |

---

## Ações Recomendadas (por prioridade)

### 🔴 Urgente
1. [Ação] — Impacto: [Alto/Médio/Baixo] — Responsável: [@agente]

### 🟡 Importante
2. [Ação] — Impacto: [Alto/Médio/Baixo] — Responsável: [@agente]

### 🟢 Otimização
3. [Ação] — Impacto: [Alto/Médio/Baixo] — Responsável: [@agente]
```

## Benchmarks de Referência

| Métrica | Ruim | OK | Bom | Excelente |
|---------|------|-----|-----|-----------|
| CTR (cold) | <0.5% | 0.5-1% | 1-2% | >2% |
| CTR (retarget) | <1% | 1-3% | 3-5% | >5% |
| CPC | >R$5 | R$2-5 | R$1-2 | <R$1 |
| CR (LP) | <1% | 1-2% | 2-5% | >5% |
| ROAS | <1x | 1-2x | 2-3x | >3x |
| CPA (low-ticket) | >R$20 | R$15-20 | R$10-15 | <R$10 |
