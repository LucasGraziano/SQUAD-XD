# KILL RULES — Zero Diastasis™

> Gerado por: @test-kill-operator (Blade) + @metrics-analyst + @capital-allocator (Vault)
> Data: 2026-03-19
> Status: DRAFT
> Filosofia: "Dados rápidos, decisões rápidas. Não morrer devagar."

---

## Princípios

1. **Kill rápido, scale rápido.** Com R$700/mês, cada real gasto em ad ruim é um real que não testa o próximo.
2. **Dados > Intuição.** Mínimo de impressões/cliques antes de decidir.
3. **Matar o ad, não a oferta.** Se todos os ads falham, o problema é o funnel, não o criativo.
4. **Nunca otimizar um morto.** Se matou, matou. Próximo teste.

---

## Kill Rules por Nível

### Nível 1 — Ad (Criativo individual)

| Métrica | Período | Kill Threshold | Mínimo para decidir |
|---------|---------|---------------|---------------------|
| **CTR** | 48h | < 0.5% | > 1,000 impressões |
| **CPL** | 72h | > $4.00 | > 5 leads |
| **CPA** | 7 dias | > $12.00 | > 3 vendas |
| **Frequência** | 7 dias | > 3.0 | > 500 alcance |
| **Hook rate** (vídeo) | 48h | < 15% (3s views / impressões) | > 500 impressões |
| **Hold rate** (vídeo) | 72h | < 25% (ThruPlay / 3s views) | > 100 3s views |

**Ação ao matar ad:** Pausar. Nunca deletar (manter dados para análise).

### Nível 2 — Adset (Audiência)

| Métrica | Período | Kill Threshold | Mínimo para decidir |
|---------|---------|---------------|---------------------|
| **CPA médio** | 10 dias | > $10.00 consistente | > 10 leads |
| **Delivery** | 72h | < 100 impressões/dia | Budget > $3/dia |
| **Learning phase** | 14 dias | Ainda em learning sem sair | > $50 gastos |

**Ação ao matar adset:** Pausar. Se era o único adset, criar novo com variação.

### Nível 3 — Campanha

| Métrica | Período | Kill Threshold | Mínimo para decidir |
|---------|---------|---------------|---------------------|
| **ROAS** | 14 dias | < 1.0x | > $60 gastos |
| **CPA** | 14 dias | > $15.00 | > 5 vendas |
| **Tendência** | 21 dias | CPA subindo 3 semanas consecutivas | — |

**Ação ao matar campanha:** Pausar tudo. Review completo de funnel antes de relançar.

---

## Kill Rules por Etapa do Funnel

### Ad → Quiz Landing (CTR)

| Resultado | Significado | Ação |
|-----------|-------------|------|
| CTR > 2.0% | Excelente — ad ressoa | Scale esse criativo |
| CTR 1.5-2.0% | Bom — funciona | Manter, testar variações |
| CTR 0.5-1.5% | Mediano — hook fraco | Testar novo hook/headline |
| **CTR < 0.5%** | **KILL** | **Pausar ad** |

### Quiz Landing → Quiz Start (Start Rate)

| Resultado | Significado | Ação |
|-----------|-------------|------|
| > 70% | Excelente | Landing page funciona |
| 40-70% | Mediano | Otimizar headline/CTA da landing |
| **< 40%** | **KILL** | **Redesenhar landing page** |

### Quiz Start → Quiz Complete (Completion Rate)

| Resultado | Significado | Ação |
|-----------|-------------|------|
| > 60% | Excelente | Quiz engaja bem |
| 30-60% | Mediano | Identificar etapa de abandono, otimizar |
| **< 30%** | **KILL** | **Quiz muito longo ou desalinhado com ad** |

### Quiz Complete → TSL View

| Resultado | Significado | Ação |
|-----------|-------------|------|
| > 85% | Excelente | Transição quiz→TSL natural |
| 50-85% | Mediano | Melhorar resultado do quiz, adicionar urgência |
| **< 50%** | **KILL** | **Resultado do quiz não convence** |

### TSL → Checkout (Conversion Rate)

| Resultado | Significado | Ação |
|-----------|-------------|------|
| > 15% | Excelente — TSL vende | Scale |
| 5-15% | Bom — funciona | Otimizar blocos fracos |
| **< 5%** | **KILL** | **TSL não convence, reescrever** |

### Checkout → Purchase (Payment Rate)

| Resultado | Significado | Ação |
|-----------|-------------|------|
| > 70% | Excelente | Checkout limpo |
| 40-70% | Mediano | Problemas de UX ou pagamento |
| **< 40%** | **KILL** | **Problema de checkout — verificar Hotmart config** |

---

## Kill Rules por País

### Quando analisar por país

Só analisar breakdown por país após **500+ impressões por país** (mínimo estatístico).

### Ação por país

| CPA do país | Ação |
|-------------|------|
| < $6.00 | Manter — país eficiente |
| $6.00-$10.00 | Monitorar — pode melhorar com mais dados |
| $10.00-$15.00 | Se consistente por 14 dias, excluir do targeting |
| > $15.00 | Excluir imediatamente (se > 10 leads sem venda) |

**Nota:** Não excluir países nos primeiros 7 dias — Meta precisa de tempo para otimizar delivery.

---

## Kill Rules de Produto (Backend)

### Bump Take Rate

| Resultado | Significado | Ação |
|-----------|-------------|------|
| > 30% | Excelente | Manter como está |
| 15-30% | Bom | Testar novo copy no checkbox |
| **< 15%** | **KILL** | **Trocar oferta de bump** |

### Upsell 1 Take Rate

| Resultado | Significado | Ação |
|-----------|-------------|------|
| > 15% | Excelente | Manter |
| 5-15% | Bom | Otimizar copy da thank you page |
| **< 5%** | **KILL** | **Revisar oferta ou preço do upsell 1** |

### Upsell 2 Take Rate

| Resultado | Significado | Ação |
|-----------|-------------|------|
| > 8% | Excelente | Manter |
| 2-8% | Bom | Testar preço ($29 vs $24) |
| **< 2%** | **KILL** | **Oferta não ressoa, trocar produto** |

### Refund Rate

| Resultado | Significado | Ação |
|-----------|-------------|------|
| < 5% | Excelente | Produto entrega valor |
| 5-8% | Aceitável | Monitorar, melhorar onboarding |
| 8-12% | Alerta | Investigar motivos, melhorar expectativa |
| **> 12%** | **KILL** | **Desalinhamento promessa vs entrega** |

---

## Árvore de Decisão — "O Que Matar?"

```
CPA > $12?
├── SIM → Qual etapa falha?
│   ├── CTR < 0.5% → Matar AD (hook ruim)
│   ├── Quiz < 30% → Matar QUIZ (desalinhado)
│   ├── TSL < 5% → Matar TSL (copy fraco)
│   ├── Checkout < 40% → Matar CHECKOUT (UX/pagamento)
│   └── Todos OK mas CPA alto → Matar AUDIÊNCIA ou PREÇO
│
└── NÃO → CPA < $6?
    ├── SIM → SCALE (aumentar 20%/semana)
    └── NÃO → OTIMIZAR (testar variações sem matar)
```

---

## Protocolo de Kill

### Antes de matar qualquer coisa

1. **Verificar volume mínimo** — Tem impressões/cliques/leads suficientes para decidir?
2. **Verificar tracking** — Pixel está disparando? Dados são confiáveis?
3. **Verificar período** — É resultado de pelo menos 48-72h (não de 1 hora)?
4. **Verificar sazonalidade** — Domingo/segunda vs sexta/sábado podem ter padrões diferentes

### Ao executar kill

1. **PAUSAR** (nunca deletar)
2. **Documentar** motivo no nome do ad: `IMG_NoEsTuCulpa_v1_KILLED_LowCTR`
3. **Analisar** o que aprendemos
4. **Iterar** com novo teste baseado no learning

### Cadência de reviews

| Review | Frequência | Decisões |
|--------|-----------|----------|
| **Check rápido** | Diário (2 min) | Spend OK? Algo queimando? |
| **Review tático** | A cada 3 dias | Kill/keep ads individuais |
| **Review estratégico** | Semanal (domingos) | Kill/keep adsets, ajustar budget |
| **Review de negócio** | Mensal | Kill/keep campanha, decisão Scale/Pivot/Kill |

---

## Glossário Rápido

| Termo | Definição |
|-------|-----------|
| **CTR** | Click-Through Rate — cliques ÷ impressões |
| **CPL** | Cost Per Lead — spend ÷ quiz completions |
| **CPA** | Cost Per Acquisition — spend ÷ vendas |
| **ROAS** | Return On Ad Spend — revenue ÷ spend |
| **Hook rate** | 3-second video views ÷ impressões |
| **Hold rate** | ThruPlay (15s+) ÷ 3-second views |
| **Take rate** | % que aceita bump/upsell |
| **Kill** | Pausar permanentemente (dados mantidos) |

---

*Kill Rules — Traffic Dept — Low-Ticket Squad*
*Pipeline v2.0 | Phase 10 | Data: 2026-03-19*
