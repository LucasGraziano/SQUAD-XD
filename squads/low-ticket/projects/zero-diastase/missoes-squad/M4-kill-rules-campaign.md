# M4 — Kill Rules + Estrutura de Campanha
**Agent:** Boost (Traffic Head)  
**Data:** 2026-04-14  
**Status:** COMPLETO ✅  
**Referência:** DNA Matheus Bressan (traffic-ads), Conclave ZD 2026-04-14

---

## PREMISSAS

| Variável | Valor |
|----------|-------|
| Budget total | R$600 |
| Produto | US$19,90 ≈ R$113 |
| ROI floor | 1.5 |
| ROI target validação | 2.0 |
| ROI target escala | 1.8 |
| País | Colômbia (P1) |
| Plataforma | Meta Ads (Facebook/Instagram) |
| Criativos disponíveis | Ad1 (vídeo), Ad2 (imagem) |

---

## ESTRUTURA DE CAMPANHA

### Regra Bressan: 1 CBO, nunca duplicar

> "Duplicar fragmenta o aprendizado do algoritmo. O algoritmo do Meta aprende com volume de dados — dividir orçamento dilui o sinal."

```
CAMPANHA: [ZD] Quiz - CO - Teste
├── Tipo: CBO (Campaign Budget Optimization)
├── Objetivo: Conversões (Purchase)
├── Budget: R$50-80/dia (testar com R$30-50 inicialmente)
│
└── ADSET 1: CO - Advantage+
    ├── País: Colômbia
    ├── Público: Advantage+ Audience (deixar Meta otimizar)
    ├── Idade: 25-45 (mulheres)
    ├── Posicionamento: Advantage+ Placements
    └── CRIATIVOS:
        ├── Ad1 — Vídeo (hook dor) ← SUBIR PRIMEIRO
        └── Ad2 — Imagem (reframe) ← após Ad1 validado
```

### Por que Ad1 primeiro?
- Vídeo tem mais dados de otimização (view, 3s, 25%, 50%, 75%, 100%)
- Hook de dor converte melhor na fase de awareness fria
- Permite diagnosticar drop-off no quiz via UTMs no vídeo

---

## KILL RULES POR THRESHOLD

### REGRA GERAL
> Lucas: ao atingir o threshold de spend, **parar e avaliar** antes de continuar. Não é automático — é checagem obrigatória.

---

### THRESHOLD R$150 — Diagnóstico de Criativo

**Quando:** Após R$150 gastos (3-4 dias a R$40-50/dia)

| Métrica | Kill | Iterar | Manter |
|---------|------|--------|--------|
| CTR (feed) | < 0.8% | 0.8-1.5% | > 1.5% |
| CPC | > R$4,00 | R$2-4 | < R$2 |
| Cliques no quiz | < 5 | 5-15 | > 15 |
| Iniciaram quiz | < 3 | 3-8 | > 8 |

**Ação Kill R$150:**  
→ Criativo com CTR < 0.8% e CPC > R$4: **PAUSA — não vale continuar**  
→ Testar novo criativo ou ajustar hook

**Ação Iterar:**  
→ Ajustar thumbnail do vídeo OU primeiros 3 segundos  
→ Não mudar o produto — só o ângulo de entrada

---

### THRESHOLD R$300 — Diagnóstico de Funil

**Quando:** Após R$300 gastos (~7 dias)

| Métrica | Kill | Iterar | Escalar |
|---------|------|--------|---------|
| Conversões | 0 | 1-4 | ≥ 5 |
| CPA (se houve venda) | > R$80 | R$50-80 | < R$50 |
| ROAS total (com upsells) | < 1.0 | 1.0-1.5 | > 1.5 |
| Taxa conclusão quiz | < 25% | 25-40% | > 40% |

**Ação Kill R$300:**  
→ 0 conversões + taxa conclusão quiz < 25%: **PAUSA TOTAL**  
→ Diagnóstico: problema é criativo (CTR baixo) OU quiz (conclusão baixa) OU oferta (conversão baixa)

**Ação Iterar R$300:**  
→ 1-4 conversões + ROAS 1.0-1.5: **não matar** — ajustar quiz OU testar segundo criativo  
→ Verificar onde está o maior drop no quiz (Q1→Q2, Q6→Q7, ou na oferta final)

---

### THRESHOLD R$500 — Kill Switch Total

**Quando:** Após R$500 gastos sem ROI ≥ 1.5 consolidado

```
CÁLCULO DO KILL SWITCH:

Total gasto: R$500
Receita necessária (ROI 1.5): R$750
Receita com upsells base (30% bump, 18% UP1, 8% UP2): 
  X compradores × R$125,61 = R$750
  → X = 5.97 → 6 compradores mínimos

SE após R$500: menos de 6 vendas totais (considerando stack)
→ KILL TOTAL. Parar tudo.
→ Diagnóstico de funil antes de reiniciar.
```

| Cenário | Receita com R$500 | ROAS | Decisão |
|---------|------------------|------|---------|
| 0 vendas | R$0 | 0 | 💀 KILL |
| 3 vendas (só front) | R$299 | 0.60 | 💀 KILL |
| 6 vendas (front+upsells base) | R$754 | 1.51 | ⚠️ NO FLOOR — continuar com cautela |
| 10 vendas (front+upsells) | R$1.256 | 2.51 | ✅ VALIDADO — escalar |

---

## MÉTRICAS DE MONITORAMENTO

### O que olhar no Meta Gerenciador (diário)

| Métrica | Frequência | Alerta |
|---------|-----------|--------|
| CPM | Diário | > R$15 = público saturando |
| CTR (link) | Diário | < 0.8% = hook fraco |
| CPC | Diário | > R$3 = público errado ou hook fraco |
| Frequência | Diário | > 2.5 = queimar público, alargar |

### O que olhar no Quiz (via inlead.digital analytics)

| Etapa | Drop-off Esperado | Alerta |
|-------|------------------|--------|
| Entrada → Q1 | 10-15% | > 30% = problema na tela de entrada |
| Q1-Q3 (dados) | 5-10% | > 20% = sliders com fricção |
| Q4-Q6 (gravidez) | 5% | > 15% = desqualificação (mulheres sem filhos) |
| Q7-Q13 (sintomas) | 5-8% | > 20% = não se identificam |
| Loading → Oferta | 10-15% | > 30% = loading ou copy da oferta |
| Oferta → Checkout | 75-80% drop (normal) | > 85% drop = preço ou copy da oferta |

**O maior sinal de alerta:** Drop > 40% no loading principal (entre "SÍ ME INTERESA" e a oferta). Significa que a antecipação falhou.

---

## PROTOCOLO PRÉ-LANÇAMENTO (Checklist)

Antes de ligar a campanha:

- [ ] Pixel Meta instalado e disparando Purchase
- [ ] GTM configurado (pageview, scroll, clique CTA, início checkout, purchase)
- [ ] Quiz funcionando end-to-end (testar em celular Android + iOS)
- [ ] Checkout funcional em CO (testar com cartão teste)
- [ ] UTM padronizado: `?utm_source=meta&utm_medium=paid&utm_campaign=zd-quiz-co&utm_content=ad1-video`
- [ ] Hotmart configurado: product + upsell flow ativo
- [ ] Kill rules impressas/salvas — Lucas tem acesso antes de subir

---

## PRÓXIMA FASE: 5 CRIATIVOS VALIDADOS

> Bressan: "Nunca escale sem 5 criativos com 5-10 vendas cada. Isso é pré-requisito."

| Fase | Budget | Objetivo |
|------|--------|----------|
| Teste 1 | R$600 | Validar funil + 1 criativo |
| Teste 2 | R$600 | Validar criativo #2 + #3 |
| Teste 3 | R$400 | Validar #4 + #5 |
| Escala | R$200+/dia | 1 CBO com 5 winners |

---

*— Boost, maximizando ROAS 📊*
