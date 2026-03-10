---
task: Daily Anomaly Check
responsavel: "@traffic-head"
responsavel_type: agent
atomic_layer: task
elicit: false
Entrada: |
  - daily_report: daily-report.md do @metrics-analyst
  - cpa_target: CPA target do media-plan.md
  - historical_baselines: Médias dos últimos 7 dias
Saida: |
  - alerts.md: Lista de alertas categorizados (critical/warning/info)
Checklist:
  - "[ ] Comparar CPA atual vs target (critical se > 3x, warning se > 1.5x)"
  - "[ ] Verificar se spend excede 2x budget diário"
  - "[ ] Checar ROAS (critical se < 0.5)"
  - "[ ] Verificar account issues (reprovações, bloqueios, restrições)"
  - "[ ] Comparar CTR vs média 7d (warning se caiu > 30%)"
  - "[ ] Checar frequência por ad set (warning se > 3.0)"
  - "[ ] Verificar delivery issues (budget não sendo gasto)"
  - "[ ] Identificar novos winners (CPA < 0.7x target)"
  - "[ ] Checar se ad sets atingiram fase de aprendizado"
  - "[ ] Classificar cada alerta: CRITICAL / WARNING / INFO"
  - "[ ] Submeter alertas ao @traffic-head"
---

# *anomaly-check — Daily Anomaly Check

Analisa métricas diárias e identifica anomalias que requerem ação imediata.

## Uso

```
@traffic-head *anomaly-check
```

## Thresholds de Alerta

### 🔴 Critical (ação imediata)
- CPA > 3x target
- Spend > 2x budget diário
- ROAS < 0.5
- Account issues (reprovações, bloqueios)

### 🟡 Warning (monitorar / ajustar)
- CPA > 1.5x target
- CTR caiu > 30% vs média 7d
- Frequência > 3.0 em qualquer ad set
- Budget não sendo gasto (delivery issues)

### 🟢 Info (oportunidades)
- Novo winner identificado (CPA < 0.7x target)
- Ad set atingiu aprendizado
- Criativo completou 7 dias sem fatigue

## Output: alerts.md

```markdown
# Alertas — [Data]

## 🔴 Critical (X)
1. [Descrição] — Ação: [ação recomendada]

## 🟡 Warning (X)
1. [Descrição] — Ação: [ação recomendada]

## 🟢 Info (X)
1. [Descrição] — Ação: [ação recomendada]

## Resumo: X alertas (X critical, X warning, X info)
```
