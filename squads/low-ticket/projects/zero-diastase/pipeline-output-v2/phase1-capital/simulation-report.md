# SIMULATION REPORT — ZERO DIASTASIS™

> Gerado por: @cashflow-simulator (Cipher)
> Data: 2026-03-19
> Status: DRAFT
> Base: Capital Plan v1.1 (Snowball Model — R$700 seed)

---

## Parâmetros da Simulação

| Parâmetro | Valor |
|-----------|-------|
| Capital seed mensal | R$700 (≈ $127 USD) |
| Modelo de escala | Snowball (reinveste 100% do lucro) |
| Preço front-end | $19.90 |
| Order bump | $4.00 (take rate 30%) |
| Upsell 1 | $9.00 (take rate 15%) |
| Upsell 2 | $29.00 (take rate 6%) |
| Gateway fee | 5% |
| AOV líquido | $22.98 |
| Câmbio | R$5.50/USD |
| Mercado mês 1 | Colômbia (exclusivo) |

---

## Simulação 1: Breakeven Analysis

### Ponto de Equilíbrio

| Métrica | Valor |
|---------|-------|
| **CPA breakeven** | **$22.98** |
| Vendas mínimas para cobrir R$700 | 6 vendas |
| Revenue mínimo para breakeven | $137.88 |

> Com apenas 6 vendas no mês, o seed de R$700 já se paga. Tudo acima disso é lucro reinvestível.

### Margem por CPA

| CPA | Lucro/venda | Margem | Vendas com $127 | Lucro total mês 1 |
|-----|------------|--------|-----------------|-------------------|
| $2.00 | $20.98 | 91% | 64 | $1,343 (R$7.387) |
| $4.00 | $18.98 | 83% | 32 | $607 (R$3.339) |
| **$6.00** | **$16.98** | **74%** | **21** | **$357 (R$1.964)** |
| $8.00 | $14.98 | 65% | 16 | $240 (R$1.320) |
| $10.00 | $12.98 | 56% | 13 | $169 (R$930) |
| $12.00 | $10.98 | 48% | 11 | $121 (R$666) |
| $15.00 | $7.98 | 35% | 8 | $64 (R$352) |
| $22.98 | $0.00 | 0% | 6 | $0 |

---

## Simulação 2: Snowball Completo — 12 Meses

### Regras do Snowball

1. Seed fixo: R$700/mês (injeção nova de capital)
2. Reinvestimento: 100% do lucro nos meses 1-3
3. Cap: A partir do mês 4, reinveste MAX R$15.000/mês. Excedente = retirada.
4. CPA degrada 5% a cada dobra de budget (efeito de escala)
5. Expansão geográfica conforme budget cresce

### Cenário Realista (CPA inicial $6, ROAS ~3.8x)

| Mês | Seed | ROI In | Budget USD | País(es) | CPA | Vendas | Revenue | Lucro | Retirada |
|-----|------|--------|-----------|----------|-----|--------|---------|-------|----------|
| 1 | R$700 | — | $127 | CO | $6.00 | 21 | $508 | R$1.964 | R$0 |
| 2 | R$700 | R$1.964 | $484 | CO+MX | $6.15 | 79 | $1.911 | R$6.506 | R$0 |
| 3 | R$700 | R$6.506 | $1.310 | CO+MX+CL | $6.30 | 208 | $5.031 | R$16.619 | R$0 |
| 4 | R$700 | R$15.000 | $2.855 | CO+MX+CL | $6.50 | 439 | $10.620 | R$35.638 | **R$20.638** |
| 5 | R$700 | R$15.000 | $2.855 | CO+MX+CL+PR | $6.50 | 439 | $10.620 | R$35.638 | **R$20.638** |
| 6 | R$700 | R$15.000 | $2.855 | 4 países | $6.50 | 439 | $10.620 | R$35.638 | **R$20.638** |

**Totais 6 meses:**
- Investido (seeds): R$4.200
- Revenue total: ~R$160.000
- Lucro total: ~R$96.000
- Retiradas totais: ~R$62.000

**Meta R$15K/mês atingida:** Mês 3

### Cenário Otimista (CPA $3, ROAS ~7.7x)

| Mês | Budget USD | Vendas | Lucro | Retirada |
|-----|-----------|--------|-------|----------|
| 1 | $127 | 42 | R$4.912 | R$0 |
| 2 | $1.020 | 340 | R$36.629 | R$0 |
| 3 | $2.855 (cap) | 952 | R$93.670 | **R$78.670** |

**Meta R$15K/mês:** Mês 2 já.

### Cenário Pessimista (CPA $10, ROAS ~2.3x)

| Mês | Budget USD | Vendas | Lucro | Acumulado |
|-----|-----------|--------|-------|-----------|
| 1 | $127 | 13 | R$935 | R$935 |
| 2 | $297 | 30 | R$2.140 | R$3.075 |
| 3 | $516 | 52 | R$3.718 | R$6.793 |
| 4 | $803 | 80 | R$5.770 | R$12.563 |
| 5 | $1.176 | 118 | R$8.448 | R$21.011 |
| 6 | $1.663 | 166 | R$11.935 | R$32.946 |

**Meta R$15K/mês:** Mês 7-8

---

## Simulação 3: Sensibilidade de Bump/Upsell

### Impacto no AOV e no Snowball

| Cenário | Bump | Up1 | Up2 | AOV Líq. | Lucro/venda @CPA $6 | Mês p/ R$15K |
|---------|------|-----|-----|----------|---------------------|-------------|
| Sem bumps/upsells | 0% | 0% | 0% | $18.91 | $12.91 | Mês 4 |
| **Pessimista** | 20% | 8% | 3% | $20.32 | $14.32 | Mês 3-4 |
| **Realista** | 30% | 15% | 6% | $22.98 | $16.98 | **Mês 3** |
| **Otimista** | 40% | 22% | 10% | $26.11 | $20.11 | Mês 2-3 |

> **Insight crítico:** A diferença entre "sem bumps" e "com bumps otimista" é de $7.20/venda. Em 21 vendas (mês 1), são $151 a mais — quase o budget total reinvestido. **Bump/upsell são o acelerador do snowball.**

---

## Simulação 4: Stress Test — E se o CPA for alto?

### Quanto CPA o modelo aguenta?

| CPA | ROAS | Snowball cresce? | Tempo p/ R$15K | Veredicto |
|-----|------|-----------------|----------------|-----------|
| $3 | 7.7x | Explosivo | 2 meses | GO AGRESSIVO |
| $6 | 3.8x | Saudável | 3 meses | **GO — TARGET** |
| $10 | 2.3x | Lento mas vivo | 7-8 meses | GO com cautela |
| $15 | 1.5x | Quase estagnado | 12+ meses | ITERATE obrigatório |
| $20 | 1.15x | Morto | Nunca | KILL |
| $23 | 1.0x | Breakeven | — | KILL imediato |

> **O modelo aguenta CPA até $12-13 e ainda cresce.** Acima disso, o snowball perde momentum e precisa de otimização antes de continuar.

---

## Simulação 5: Impacto por País

### CPM e CPA estimados

| País | CPM | CTR | CPC | CVR | CPA Est. | Budget mínimo viável |
|------|-----|-----|-----|-----|----------|---------------------|
| **Colômbia** | $3.50 | 1.8% | $0.19 | 3.5% | **$5.57** | $50/mês |
| **México** | $5.00 | 1.5% | $0.33 | 3.0% | $11.11 | $100/mês |
| **Chile** | $6.00 | 1.6% | $0.38 | 3.2% | $11.72 | $100/mês |
| **Puerto Rico** | $8.00 | 1.4% | $0.57 | 2.8% | $20.41 | $200/mês |

### Quando cada país entra no Snowball

| Gatilho | País | % do Budget |
|---------|------|-------------|
| Budget > $300/mês | **+ México** | 30% |
| Budget > $800/mês | **+ Chile** | 15% |
| Budget > $1.500/mês | **+ Puerto Rico** | 5% |
| Budget > $2.000/mês | **+ TikTok Ads** | 10% |

---

## Simulação 6: Pior Caso — Mês 1 com 0 Vendas

### O que acontece se der errado?

| Cenário | Budget perdido | Ação | Próximo passo |
|---------|---------------|------|---------------|
| 0 vendas em 30 dias | R$700 (~$127) | KILL total | Analisar dados (CTR, CPC, quiz) para diagnosticar |
| 0 vendas + CTR < 0.5% | R$700 | Problema no criativo | Phase 5/6: novos criativos e hooks |
| 0 vendas + CTR > 1.5% + quiz completion < 20% | R$700 | Problema no quiz | Otimizar com Cabral |
| 0 vendas + quiz completion > 50% + 0 checkouts | R$700 | Problema na TSL/preço | Phase 5: reescrever TSL |

> **Risco máximo: R$700.** É o custo de um jantar para dois. Se perder, os dados coletados valem mais que o dinheiro — mostram exatamente onde está o problema.

---

## Conclusões do Simulador

### Veredicto: GO

1. **R$700 é suficiente para validar em LATAM.** CPMs de $3.50 em CO compram ~36K impressões — dados estatisticamente relevantes
2. **O snowball é o caminho.** Com ROAS 3.8x, o capital se multiplica 2.6x por mês
3. **Meta R$15K no mês 3 (realista).** Sem injeção extra de capital, só com seed + ROI
4. **Risco controlado:** Perda máxima = R$700 no mês 1. Thresholds protegem contra queima prolongada
5. **Concentrar em CO primeiro** é a decisão correta — menor CPA, maior volume de busca

### 3 Métricas Vitais

1. **CPA real vs $6 target** — define velocidade do snowball
2. **Quiz completion rate** — 35 etapas é longo, precisa >60%
3. **Bump take rate** — cada ponto percentual acelera o compounding

---

*Simulation Report gerado por Cipher (Cashflow Simulator) — Low-Ticket Squad*
*Pipeline: New Offer Pipeline v2.0 | Phase 1 | Data: 2026-03-19*
*Modelo: Snowball — R$700 seed + reinvestimento de ROI*
