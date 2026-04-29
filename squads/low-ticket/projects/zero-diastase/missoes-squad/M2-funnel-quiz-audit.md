# M2 — Auditoria do Quiz + Fluxo Pós-Compra
**Agent:** Flow (Funnel Chief)  
**Data:** 2026-04-14  
**Status:** COMPLETO ✅  
**Input:** `materiais/quiz/quiz-zero-diastasis-completo.md`

---

## PARTE A — Auditoria do Quiz (28 slides)

### Veredito por Slide

| # | Slide | Tipo | Veredito | Motivo |
|---|-------|------|----------|--------|
| 0 | Entrada "¡DESCUBRA SI TIENES DIASTASE!" | Hook | **MANTER** | Clareza imediata do benefício |
| 1 | ¿Cuántos años tienes? | Segmentação | **MANTER** | Qualifica faixa etária pós-parto |
| 2 | ¿Cuál es tu peso? | Segmentação | **MANTER** | Dados para personalização |
| 3 | ¿Cuál es tu altura? | Segmentação | **MANTER** | Idem |
| I1 | "¡NO HAY RESPUESTA CORRECTA!" | Interstitial | **MANTER** | Reduz ansiedade, aumenta taxa de conclusão |
| 4 | ¿Cuántos hijos tienes? | Diagnóstico | **MANTER** | Qualifica mãe vs. não-mãe |
| 5 | ¿Cuándo fue tu último embarazo? | Diagnóstico | **MANTER** | Define janela de recuperação |
| 6 | ¿Cómo fue tu último parto? | Diagnóstico | **MANTER** | Personaliza protocolo |
| I2 | "¿SABÍAS QUÉ?" | Educação | **MANTER** | Educa mecanismo, reduz objeção "vou fazer dieta" |
| 7 | ¿Cómo quedó tu abdomen? | Sintoma | **MANTER** | Core do diagnóstico |
| 8 | Al despertar ¿cómo está? | Sintoma | **MANTER** | Reconhecimento de padrão matinal |
| 9 | Al relajar ¿qué sucede? | Sintoma | **MANTER** | Alta identificação da Sofia |
| 10 | ¿Cómo te sientes al ejercitarte? | Sintoma | **MANTER** | Valida frustração com exercício |
| I3 | "HAS INTENTADO..." | Emocional | **MANTER** | Valida esforço anterior → abre para nova solução |
| 11 | ¿Qué ves al mirarte al espejo? | Dor emocional | **MANTER** | Motor de compra #1 |
| 12 | ¿Hace cuánto te sientes así? | Urgência | **MANTER** | Cria senso de "precisa parar agora" |
| 13 | ¿Qué más te atormenta? | Multi-dor | **MANTER** | Empilha dores antes do reframe |
| I4 | "¡EL PROBLEMA NO ERES TÚ!" | Reframe | **MANTER** ⭐ | Slide mais importante — elimina culpa |
| 14 | ¿Qué te impide comenzar? | Barreira | **MANTER** | Permite personalização da resposta |
| I5 | Resposta personalizada (ex: "FALTA DE TIEMPO") | Personalização | **MANTER** | Alta percepção de personalização |
| I6 | "PROTOCOLO DE 28 DÍAS" | Solução | **MANTER** | Apresenta solução antes de pedir dinheiro |
| L1 | Loading "preparando protocolo" | Transição | **MANTER** ⭐ | Cria antecipação — NÃO CORTAR |
| 15 | ¿Qué quieres sentir primero? | Desejo | **MANTER** | Ancora identidade futura |
| 16 | ¿Qué volverías a hacer? | Sonho | **MANTER** | Ativa identidade que a Sofia perdeu |
| I7 | "¿LISTA PARA CAMBIAR?" | Antes/depois | **REESCREVER** | Slide lento — substituir por prova social direta |
| I8 | "¡YA SOMOS MILES DE MADRES!" | Prova social | **MANTER** | Mas otimizar: incluir número concreto |
| I9 | Produto detalhado + fases | Educação produto | **CORTAR** ⚠️ | Muito informação antes do preço. Move para TSL |
| I10 | Bônus (Vacuum, Kergel, App) | Stack de valor | **MANTER** | Mas condensar em 1 slide |
| OF | Página de vendas (resultado final) | Oferta | **REESCREVER** | Remover timer falso, fortalecer urgência real |

**Contagem:** 22 MANTER | 2 REESCREVER | 1 CORTAR (incorporado na TSL)

---

### Diagnóstico de Conversão

**Pontos de drop-off crítico esperados:**
1. **Slides de peso/altura** (2-3) — sliders são fricção desnecessária. Considerar simplificar para ranges
2. **Slide 13 multi-select** — sem feedback visual de seleção → Sofia não sabe se está selecionado
3. **I9 produto detalhado** — mora o quiz antes do preço, mata momentum

**Taxa de conclusão benchmark (inlead.digital quiz health LATAM):** 35-55%  
**Meta interna:** ≥ 45% conclusão até oferta

---

## PARTE B — Fluxo Pós-Compra

### Plataforma Recomendada: Hotmart

| Critério | Hotmart | LastLink |
|----------|---------|---------|
| Upsell 1-click nativo | ✅ | ✅ |
| Order bump pós-checkout | ✅ | ⚠️ Limitado |
| LATAM currencies | ✅ | ✅ |
| Integração quiz → checkout | Webhook | Webhook |
| Suporte CO/MX/PR | ✅ | ✅ |

**Decisão:** Hotmart para o teste. LastLink como fallback se CPA de checkout for problema.

---

### Fluxo Completo Pós-Compra

```
[QUIZ RESULTADO]
      ↓
[CHECKOUT — US$19.90]
   Hotmart / 1 clique
      ↓
[ORDER BUMP — US$4] ← MOVIDO para aqui (pós-checkout, pré-TY)
   "Antes de ver seu acesso..."
   Pack Receitas Anti-Inflamatórias
   1 clique para adicionar
      ↓
[UPSELL 1 — US$9]
   Página de upsell dedicada
   "Seu protocolo está pronto — acelere os resultados"
   Aceleração: módulos extras
      ↓ (aceita)               ↓ (recusa)
[UPSELL 2 — US$29]         [DOWNSELL — US$7]
   Reset Postural Completo    Versão lite do UP1
   "Cuide do que sustenta"    "Mesmo resultado, ritmo menor"
      ↓                           ↓
[THANK YOU PAGE]
   Acesso imediato
   Botão de WhatsApp/grupo
   "Próximos passos" claro
```

---

### Especificação por Etapa

#### Order Bump (US$4) — POSIÇÃO: pós-checkout, pré-acesso
**Headline:** "¡Espera! Un regalo antes de acceder..."  
**Proposta:** Pack de Receitas Anti-Inflamatórias (15-20 receitas PDF)  
**Argumento:** "El protocolo trabaja desde adentro. Las recetas trabajan desde afuera."  
**Mecanismo:** Checkbox no thank-you page antes do botão de acesso  
**CTA:** "Sí, agregar por US$4 más"  
**Não-obrigatoriedade:** "No gracias, quiero solo el protocolo"

#### Upsell 1 (US$9) — ACELERAÇÃO
**Headline:** "¿Quieres resultados en la mitad del tiempo?"  
**Proposta:** Módulos acelerados + técnicas avançadas  
**Video:** 60-90s (pode ser texto/VSL curta)  
**CTA:** "Sí, quiero acelerar mis resultados"  
**Downsell trigger:** Clique em "No, gracias"

#### Downsell (US$7) — versão lite
**Headline:** "¿Y si pudieras comenzar por menos?"  
**Proposta:** Módulo 1 da aceleração por US$7  
**CTA:** "Sí, quiero este módulo"

#### Upsell 2 (US$29) — RESET POSTURAL
**Headline:** "Una cosa más — lo que sostiene tu abdomen"  
**Proposta:** Protocolo de postura + quadril + lombar completo  
**Argumento:** "El 73% de las mujeres con diástasis también tienen dolor en la cadera o la lumbar."  
**CTA:** "Sí, quiero el Reset Postural Completo"

---

### Métricas de Monitoramento do Funil

| Etapa | Benchmark LATAM | Meta interna |
|-------|----------------|--------------|
| Quiz → Oferta | 40-55% | 45% |
| Oferta → Checkout | 15-25% | 20% |
| Checkout → Bump | 20-35% | 30% |
| Bump → UP1 | 15-25% | 20% |
| UP1 → UP2 (ou DS) | 8-15% | 10% |

**AOV (ticket médio) esperado:**
- Sem upsells: US$19,90
- Com base upsells (30% B, 18% UP1, 8% UP2): US$19,90 + US$1,20 + US$1,62 + US$2,32 = **~US$25,04**
- Melhor: US$25-32 AOV realista

---

*— Flow, otimizando conversões 🔧*
