# /metrics-review — Análise de Campanha com Kill Rules

Analisa os dados do Meta Ads Manager contra as kill rules do Zero Diastase e emite veredicto GO/PAUSE/KILL por criativo e por funil.

## Uso

```
/metrics-review                    # Análise interativa (pede os dados)
/metrics-review --quick            # Só veredicto final, sem breakdown
```

## Execução

### 1. Carregar kill rules

Ler: `squads/low-ticket/projects/zero-diastase/pipeline-output-v2/phase10-traffic/kill-rules.md`

### 2. Coletar métricas do usuário

Solicitar ou processar os dados colados:

```
📊 Métricas para análise — cole os dados do Meta Ads Manager:

Por AD (obrigatório):
- Nome do ad
- Spend (R$)
- Impressões
- CTR (%)
- Cliques
- Conversões / Vendas
- CPA (R$) — se houver

Por FUNIL (se disponível):
- Quiz start rate (%)
- Quiz completion rate (%)
- TSL → Checkout (%)
- Checkout → Purchase (%)

Período dos dados: ___
```

### 3. Aplicar kill rules por ad

Para cada ad, verificar:

| Métrica | Kill Threshold | Status |
|---------|---------------|--------|
| CTR | < 1% em 48h | 🔴/🟢 |
| CPA | > R$25 em 7d | 🔴/🟢 |
| Hook rate (vídeo) | < 15% (3s views / impressões) | 🔴/🟢 |
| Hold rate (vídeo) | < 25% (ThruPlay / 3s views) | 🔴/🟢 |

Veredicto por ad: **KILL** / **MANTER** / **ESCALAR** / **SEM DADOS SUFICIENTES**

### 4. Análise do funil (se dados disponíveis)

```
Quiz start rate:
  > 70% → ✅ Landing page funciona
  40-70% → ⚠️ Otimizar headline/CTA
  < 40% → 🔴 KILL — redesenhar landing

Quiz completion rate:
  > 60% → ✅ Quiz engaja
  30-60% → ⚠️ Identificar etapa de abandono
  < 30% → 🔴 KILL — quiz desalinhado com ad

TSL → Checkout:
  > 15% → ✅ TSL convence
  5-15% → ⚠️ Otimizar blocos fracos
  < 5%  → 🔴 KILL — reescrever TSL

Checkout → Purchase:
  > 70% → ✅ Checkout limpo
  40-70% → ⚠️ Problema de UX
  < 40% → 🔴 KILL — verificar configuração Kiwify
```

### 5. Diagnóstico de onde está o problema

Usar árvore de decisão das kill rules:

```
CPA > R$25?
├── SIM → Qual etapa falha?
│   ├── CTR < 1% → Problema: AD (hook ruim)
│   ├── Quiz < 30% → Problema: QUIZ (desalinhado)
│   ├── TSL < 5% → Problema: TSL (copy fraco)
│   ├── Checkout < 40% → Problema: CHECKOUT
│   └── Todos OK mas CPA alto → Problema: AUDIÊNCIA ou PREÇO
└── NÃO → CPA < R$10?
    ├── SIM → ESCALAR (aumentar 20%/semana)
    └── NÃO → OTIMIZAR (testar variações)
```

### 6. Gerar relatório

```markdown
╔══════════════════════════════════════════════════════════╗
║  📊 METRICS REVIEW — Zero Diastase — {data}             ║
║  Período: {período} | Spend total: R${total}            ║
╠══════════════════════════════════════════════════════════╣

## Veredicto por Ad

| Ad | CTR | CPA | Veredicto | Ação |
|----|-----|-----|-----------|------|
| {nome} | {%} | R${} | 🟢 MANTER / 🔴 KILL | {ação} |

## Diagnóstico do Funil

| Etapa | Taxa | Status | Ação |
|-------|------|--------|------|
| Quiz start | {%} | 🟢/⚠️/🔴 | {ação} |
| Quiz complete | {%} | 🟢/⚠️/🔴 | {ação} |
| TSL → Checkout | {%} | 🟢/⚠️/🔴 | {ação} |
| Checkout → Purchase | {%} | 🟢/⚠️/🔴 | {ação} |

## Diagnóstico principal

O gargalo está em: {etapa com pior performance}

## Próxima ação (1 coisa só)

> {ação concreta e específica}

## Budget restante

R${restante} de R$600 | Wave {1 ou 2} ativa
╚══════════════════════════════════════════════════════════╝
```

### 7. Atualizar métricas

Atualizar a tabela em `squads/low-ticket/projects/zero-diastase/sprint-status.md` (seção métricas) com os dados da análise.

---
*Metrics Review — Traffic Dept — Low-Ticket Squad*
