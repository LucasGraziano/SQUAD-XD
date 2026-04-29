# M1 — Validação Financeira Zero Diastasis™
**Agent:** Vault (Capital Allocator) + Cipher (Cashflow Simulator)  
**Data:** 2026-04-14  
**Status:** COMPLETO ✅

---

## Parâmetros de Entrada

| Variável | Valor |
|----------|-------|
| Câmbio USD/BRL | R$5,70 |
| Front-end | US$19,90 = **R$113,43** |
| UP0 Order Bump | US$4,00 = R$22,80 |
| UP1 Aceleração | US$9,00 = R$51,30 |
| UP2 Reset Postural | US$29,00 = R$165,30 |
| Taxas plataforma (Hotmart/LastLink) | 12% total |
| Custo do produto | R$0 (digital) |
| Budget teste | R$600 |
| Meta mensal | R$15.000 |

## Receita Líquida por Transação (após 12% taxa)

| Item | Bruto | Líquido |
|------|-------|---------|
| Front-end | R$113,43 | **R$99,82** |
| UP0 bump | R$22,80 | R$20,06 |
| UP1 | R$51,30 | R$45,14 |
| UP2 | R$165,30 | R$145,46 |

---

## Modelo de 3 Cenários

### Premissas de Take Rate

| Métrica | Pessimista | Base | Otimista |
|---------|-----------|------|----------|
| CPA (R$) | R$55 | R$35 | R$25 |
| UP0 take rate | 15% | 30% | 45% |
| UP1 take rate | 8% | 18% | 28% |
| UP2 take rate | 3% | 8% | 15% |

### Receita Líquida por Comprador

| Cenário | Cálculo | Total |
|---------|---------|-------|
| **Pessimista** | R$99,82 + R$3,01 + R$3,61 + R$4,36 | **R$110,80** |
| **Base** | R$99,82 + R$6,02 + R$8,13 + R$11,64 | **R$125,61** |
| **Otimista** | R$99,82 + R$9,03 + R$12,64 + R$21,82 | **R$143,31** |

### ROI por Cenário

| Cenário | CPA | Rev/buyer | ROAS | Status |
|---------|-----|-----------|------|--------|
| Pessimista | R$55 | R$110,80 | **2.01** | ✅ Acima do floor 1.5 |
| Base | R$35 | R$125,61 | **3.59** | ✅ Acima do target escala 1.8 |
| Otimista | R$25 | R$143,31 | **5.73** | ✅ Excepcional |

---

## Simulação com Budget R$600

| Cenário | Compradores | Receita líquida | ROAS | Lucro |
|---------|-------------|-----------------|------|-------|
| Pessimista (CPA R$55) | 10 | R$1.108 | 1.85 | **R$508** |
| Base (CPA R$35) | 17 | R$2.135 | 3.56 | **R$1.535** |
| Otimista (CPA R$25) | 24 | R$3.439 | 5.73 | **R$2.839** |

> ⚠️ Todos os 3 cenários são positivos com R$600. O teste é seguro.

---

## Breakeven por CPA — Onde os Upsells Salvam o Negócio

| CPA | Front-end só | Com upsells base | Status |
|-----|-------------|------------------|--------|
| R$35 | ROAS 2.85 | ROAS 3.59 | ✅ |
| R$55 | ROAS 1.81 | ROAS 2.01 | ✅ |
| R$67 | ROAS 1.49 ❌ | ROAS 1.87 ✅ | ⚠️ Upsells críticos |
| R$80 | ROAS 1.25 ❌ | ROAS 1.57 ✅ | ⚠️ Upsells críticos |
| R$84 | ROAS 1.19 ❌ | ROAS 1.50 ⚠️ | ❌ No floor exato |
| R$96 | ROAS 1.04 ❌ | ROAS 1.31 ❌ | 💀 Kill |

**Limiar crítico:** CPA > R$67 → frente não sustenta sozinha. Upsells não são opcionais.

---

## Take Rate Mínima para Viabilidade

> Pergunta: qual take rate mínima de upsell salva o negócio se CPA = R$70?

**CPA R$70 com front-end:** ROAS = 99,82/70 = **1.43 ❌** (abaixo do floor 1.5)  
**Gap a cobrir:** R$70 × 1.5 - R$99,82 = **R$5,18**

| Opção | Take rate mínima | Viável? |
|-------|-----------------|---------|
| Só UP0 bump | 26% | ✅ Alcançável |
| Só UP1 | 12% | ✅ Muito alcançável |
| UP0 (20%) + UP1 (5%) | combinação | ✅ Fácil |

**Conclusão:** Take rates muito baixas já salvam o negócio. O negócio é resiliente.

---

## Meta R$15.000/mês — O Que Precisa Acontecer

| Cenário | Compradores/mês | Ad spend/mês | Ad spend/dia | ROAS |
|---------|----------------|--------------|--------------|------|
| Pessimista | 135 | R$7.425 | R$247 | 2.02 |
| Base | 119 | R$4.165 | R$139 | 3.60 |
| Otimista | 105 | R$2.625 | R$87 | 5.71 |

> Cenário base: **R$139/dia em ads** para R$15K/mês líquido. Muito viável em escala.

---

## Decisões Chave

### ✅ CONFIRMADO: Matemática fecha
- Budget R$600 de teste cobre qualquer cenário com ROAS positivo
- Mesmo no pior cenário (CPA R$55), o negócio tem ROAS 2.01

### ✅ CONFIRMADO: Upsells são críticos acima de CPA R$67
- Abaixo de R$67: upsells são puro lucro extra
- Entre R$67-84: upsells são o que salva o negócio
- Acima de R$84: upsells base não sustentam → UP2 (R$29) passa a ser crítico

### ✅ CONFIRMADO: Critério de sucesso real do teste
Não é "vendi ou não vendi". O teste valida se:
1. CPA ficou ≤ R$67 (frente sustenta)
2. OU CPA R$68-84 com UP0 ≥ 26% OR UP1 ≥ 12%
3. ROAS ≥ 1.5 considerando TODOS os produtos da stack

### ⚠️ DECISÃO PENDENTE: Order Bump posição
- Bump pré-checkout (atual no briefing) pode aumentar abandono
- Bump pós-checkout preserva a venda principal
- Recomendação Vault: testar pós-compra primeiro, monitorar AOV

---

*— Vault, alocando capital 💰 | Cipher, simulando cenários 📊*
