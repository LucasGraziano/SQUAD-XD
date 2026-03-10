---
task: Daily Recommendations
responsavel: "@traffic-head"
responsavel_type: agent
atomic_layer: task
elicit: true
Entrada: |
  - daily_report: daily-report.md do @metrics-analyst
  - alerts: alerts.md da anomaly check
  - media_plan: media-plan.md (targets e budget)
Saida: |
  - daily-actions.md: Lista priorizada de ações recomendadas para o dia
Checklist:
  - "[ ] Processar alertas critical — ações imediatas"
  - "[ ] Processar alertas warning — ações preventivas"
  - "[ ] Avaliar oportunidades de info alerts"
  - "[ ] Priorizar ações por impacto (alto/médio/baixo)"
  - "[ ] Atribuir responsável para cada ação (@agente)"
  - "[ ] Estimar impacto esperado de cada ação"
  - "[ ] Apresentar recomendações para aprovação do usuário"
---

# *daily-actions — Daily Recommendations

Gera lista priorizada de ações diárias baseada no relatório e alertas.

## Uso

```
@traffic-head *daily-actions
```

## Output: daily-actions.md

```markdown
# Ações do Dia — [Data]

## 🔴 Urgente (fazer agora)
1. **[Ação]** — Impacto: Alto — @[agente]
   - Motivo: [por que é urgente]
   - Como: [passo a passo]

## 🟡 Importante (fazer hoje)
2. **[Ação]** — Impacto: Médio — @[agente]
   - Motivo: [justificativa]
   - Como: [passo a passo]

## 🟢 Otimização (quando possível)
3. **[Ação]** — Impacto: Baixo — @[agente]
   - Motivo: [oportunidade]
   - Como: [passo a passo]

## Resumo: X ações (X urgentes, X importantes, X otimizações)
```
