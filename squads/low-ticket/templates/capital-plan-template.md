# CAPITAL PLAN — {{OFFER_NAME}}

> Gerado por: @capital-allocator (Vault) + @cashflow-simulator (Cipher)
> Data: {{DATE}}
> Status: DRAFT / APPROVED
> Orçamento Total: ${{BUDGET}} USD

---

## Resumo Executivo

| Métrica | Valor |
|---------|-------|
| **Orçamento total (mês 1)** | ${{BUDGET}} USD |
| **Duração do teste** | {{X}} dias |
| **CPA target** | ${{CPA_TARGET}} USD |
| **CPA máximo (breakeven)** | ${{CPA_MAX}} USD |
| **LTV target 30 dias** | ${{LTV_30}} USD |
| **Meta: LTV ≥ 2x CPA** | {{Sim/Não}} |

---

## Alocação por Canal

| Canal | Budget | % Total | CPA Target | Objetivo |
|-------|--------|---------|------------|----------|
| Meta Ads (FB/IG) | ${{X}} | {{X}}% | ${{X}} | {{teste de criativos / escala}} |
| Google Ads | ${{X}} | {{X}}% | ${{X}} | {{search intent / display}} |
| TikTok Ads | ${{X}} | {{X}}% | ${{X}} | {{awareness / conversão}} |
| Reserva | ${{X}} | {{X}}% | — | {{contingência}} |
| **TOTAL** | **${{BUDGET}}** | **100%** | — | — |

---

## Plano de Testes

### Fase 1 — Teste Inicial (Dias 1-{{X}})
- **Budget:** ${{X}}/dia
- **Criativos:** {{X}} variações
- **Audiências:** {{X}} segmentos
- **Objetivo:** Identificar CPA baseline e criativos winners

### Fase 2 — Otimização (Dias {{X}}-{{X}})
- **Budget:** ${{X}}/dia
- **Ação:** Cortar losers, duplicar winners, testar variações
- **Objetivo:** Estabilizar CPA abaixo do target

### Fase 3 — Escala Controlada (Dias {{X}}-{{X}})
- **Budget:** ${{X}}/dia
- **Ação:** Aumentar budget em winners, expandir audiências
- **Objetivo:** Volume com CPA estável

---

## Thresholds de Decisão

### 🔴 KILL (Pausar imediatamente)
- CPA > ${{CPA_KILL}} por 3+ dias consecutivos
- CTR < 0.5% após 1000+ impressões
- CVR < 0.5% após 500+ cliques na LP
- Sem conversão após gastar ${{BUDGET_MIN_KILL}}

### 🟡 ITERATE (Ajustar e retestar)
- CPA entre ${{CPA_TARGET}} e ${{CPA_ITERATE_MAX}}
- CTR ok mas CVR baixo → problema na LP
- CVR ok mas CPA alto → problema no criativo/targeting

### 🟢 SCALE (Aumentar investimento)
- CPA < ${{CPA_TARGET}} por 3+ dias consecutivos
- ROAS > 2.0 estável
- Volume suficiente sem saturação de audiência

---

## Simulação de Cenários

### Cenário Otimista
| Métrica | Valor |
|---------|-------|
| CPA | ${{X}} |
| CVR | {{X}}% |
| Vendas/mês | {{X}} |
| Revenue | ${{X}} |
| Lucro | ${{X}} |
| ROAS | {{X}}x |

### Cenário Realista
| Métrica | Valor |
|---------|-------|
| CPA | ${{X}} |
| CVR | {{X}}% |
| Vendas/mês | {{X}} |
| Revenue | ${{X}} |
| Lucro | ${{X}} |
| ROAS | {{X}}x |

### Cenário Pessimista
| Métrica | Valor |
|---------|-------|
| CPA | ${{X}} |
| CVR | {{X}}% |
| Vendas/mês | {{X}} |
| Revenue | ${{X}} |
| Lucro | ${{X}} |
| ROAS | {{X}}x |

---

## Unit Economics

| Componente | Valor | Taxa | Revenue |
|-----------|-------|------|---------|
| Front-end | ${{PRICE}} | 100% | ${{X}} |
| Bump | ${{BUMP_PRICE}} | {{BUMP_RATE}}% | ${{X}} |
| Upsell 1 | ${{UP1_PRICE}} | {{UP1_RATE}}% | ${{X}} |
| Upsell 2 | ${{UP2_PRICE}} | {{UP2_RATE}}% | ${{X}} |
| **AOV** | — | — | **${{AOV}}** |
| Taxas gateway | — | {{GW_RATE}}% | -${{X}} |
| **Revenue líquido** | — | — | **${{NET_REV}}** |

---

## Cronograma de Review

| Dia | Ação | Responsável |
|-----|------|-------------|
| D3 | Primeiro check de métricas | @metrics-analyst |
| D7 | Review semanal + decisões | @commander + @capital-allocator |
| D14 | Avaliação de escala | @test-kill-operator |
| D21 | Review de LTV | @ltv-architect |
| D30 | Fechamento mês 1 + plano mês 2 | @commander |

---
*Template: capital-plan | Squad: low-ticket*
