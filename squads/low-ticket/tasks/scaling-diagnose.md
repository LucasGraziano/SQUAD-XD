---
task: Scaling Diagnosis & Decision
responsavel: "@commander"
responsavel_type: agent
atomic_layer: task
elicit: true
Entrada: |
  - weekly_metrics: weekly-metrics-report.md do @metrics-analyst
  - cpa_target: CPA target do media-plan.md
  - current_creatives: Lista de criativos ativos e suas métricas
  - funnel_metrics: Métricas de conversão do funil
Saida: |
  - scaling-decision.md: Decisões de SCALE/CUT/TEST com justificativa
Checklist:
  - "[ ] Analisar métricas consolidadas da semana"
  - "[ ] Identificar winners para escalar (CPA < target, ROAS > 2x)"
  - "[ ] Identificar losers para pausar (CPA > 2x target por 3+ dias)"
  - "[ ] Detectar creative fatigue (frequência > 3, CTR caindo)"
  - "[ ] Avaliar saturação de público"
  - "[ ] Calcular headroom de escala (budget vs volume disponível)"
  - "[ ] Definir ações: SCALE (aumentar budget), CUT (pausar), TEST (novas variações)"
  - "[ ] Priorizar ações por impacto esperado"
  - "[ ] Definir quais departamentos precisam criar novas variações"
  - "[ ] Submeter decisões para aprovação"
---

# *scaling-diagnose — Scaling Diagnosis

Analisa performance semanal e decide: escalar, cortar ou testar.

## Uso

```
@commander *scaling-diagnose
```

## Decision Matrix

| Sinal | Decisão | Ação |
|-------|---------|------|
| CPA < target, ROAS > 2x | SCALE | Aumentar budget 20-50% |
| CPA OK mas estagnado | TEST | Novas variações de creative/copy |
| CTR caindo, frequência > 3 | TEST | Creative fatigue — novos hooks |
| CPA > 1.5x target | CUT + TEST | Pausar losers, testar novos |
| CPA > 2x target | CUT | Pausar imediatamente |
| Público saturado | TEST | Novos públicos (research-miner) |
