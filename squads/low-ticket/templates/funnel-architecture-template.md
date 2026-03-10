# FUNNEL ARCHITECTURE MAP — {{OFFER_NAME}}

> Gerado por: @funnel-chief (Flow) + @quiz-builder (Riddle)
> Data: {{DATE}}
> Status: DRAFT / APPROVED

---

## Fluxo Macro do Funil

```
[AD] → [QUIZ] → [RESULT PAGE] → [LP/SALES] → [CHECKOUT + BUMP] → [UPSELL 1] → [UPSELL 2] → [THANK YOU] → [MEMBERS AREA]
```

---

## Página 1 — Quiz Landing

| Aspecto | Spec |
|---------|------|
| **URL** | {{domain}}/quiz |
| **Objetivo** | Segmentar persona/dor, aumentar intenção, personalizar resultado |
| **Perguntas** | {{5-8 perguntas}} |
| **Segmentação** | {{critério de segmentação — ex: nível de experiência, dor principal}} |
| **CTA** | "Ver mi resultado personalizado" |
| **Mobile** | Tela cheia, 1 pergunta por tela, progresso visível |

### Perguntas do Quiz

| # | Pergunta | Opções | Segmenta |
|---|----------|--------|----------|
| 1 | {{pergunta}} | {{A, B, C}} | {{variável}} |
| 2 | {{pergunta}} | {{A, B, C}} | {{variável}} |
| 3 | {{pergunta}} | {{A, B, C}} | {{variável}} |
| 4 | {{pergunta}} | {{A, B, C}} | {{variável}} |
| 5 | {{pergunta}} | {{A, B, C}} | {{variável}} |

### Lógica de Resultado

| Perfil | Resultado | Headline Personalizada | Dor Enfatizada |
|--------|-----------|----------------------|----------------|
| A | {{resultado}} | "{{headline}}" | {{dor}} |
| B | {{resultado}} | "{{headline}}" | {{dor}} |
| C | {{resultado}} | "{{headline}}" | {{dor}} |

---

## Página 2 — Quiz Result + Bridge

| Aspecto | Spec |
|---------|------|
| **URL** | {{domain}}/resultado |
| **Objetivo** | Mostrar resultado personalizado + bridge para LP |
| **Personalização** | Headline e descrição mudam baseado no quiz |
| **Elementos** | Resultado, explicação, social proof contextual, CTA para LP |
| **CTA** | "Descubre cómo solucionarlo →" |

---

## Página 3 — Landing Page / Sales Page

| Aspecto | Spec |
|---------|------|
| **URL** | {{domain}}/oferta |
| **Objetivo** | Converter visitante qualificado pelo quiz em comprador |
| **Coerência** | Headline DEVE refletir resultado do quiz |
| **Estrutura** | {{ver seções abaixo}} |

### Seções da LP (ordem)

| # | Seção | Conteúdo |
|---|-------|----------|
| 1 | Hero | Headline personalizada + sub + CTA |
| 2 | Problema | Agitar dor principal (linguagem do avatar) |
| 3 | Inversão | Big Idea — o problema real oculto |
| 4 | Mecanismo | Apresentar {{MECHANISM_NAME}}™ + 4 pilares |
| 5 | O que você recebe | Stack de valor com preços ancorados |
| 6 | Prova social | Resultados, depoimentos, números |
| 7 | Garantia | {{tipo de garantia}} |
| 8 | FAQ | {{5-8 objeções respondidas}} |
| 9 | CTA final | Preço + urgência + botão |

---

## Página 4 — Checkout

| Aspecto | Spec |
|---------|------|
| **URL** | {{domain}}/checkout |
| **Preço** | ${{PRICE}} USD |
| **Campos** | Nome, Email, Cartão (máx 5 campos) |
| **Trust badges** | Próximo ao botão de compra |
| **Bump** | {{ver abaixo}} |

### Order Bump

| Aspecto | Detalhe |
|---------|---------|
| **Produto** | {{nome do bump}} |
| **Preço** | ${{BUMP_PRICE}} |
| **Copy** | "{{headline do bump — ex: 'Agrega el kit de implementación rápida'}}" |
| **Posição** | Acima do botão de compra |
| **Meta conversão** | 30-50% |

---

## Página 5 — Upsell 1

| Aspecto | Spec |
|---------|------|
| **URL** | {{domain}}/oferta-especial |
| **Preço** | ${{UPSELL1_PRICE}} USD |
| **Posicionamento** | "Si quieres resultados en la mitad del tiempo…" |
| **Formato** | VSL curto (3-5 min) + bullets + CTA |
| **Copy de transição** | {{Como conecta ao front-end recém comprado}} |
| **Meta conversão** | 15-25% |
| **Botões** | "Sí, lo quiero" / "No, gracias, continuar" |

---

## Página 6 — Upsell 2

| Aspecto | Spec |
|---------|------|
| **URL** | {{domain}}/oferta-premium |
| **Preço** | ${{UPSELL2_PRICE}} USD |
| **Tipo** | {{Produto premium / Assinatura mensal}} |
| **Posicionamento** | "{{Domina / Continua evolucionando con...}}" |
| **Meta conversão** | 10-20% |
| **Botões** | "Quiero acceso completo" / "No, gracias" |

---

## Página 7 — Thank You

| Aspecto | Spec |
|---------|------|
| **URL** | {{domain}}/gracias |
| **Elementos** | Confirmação, acesso, próximos passos, expectativa de email |
| **CTA interno** | Link para área de membros |

---

## Tracking & Pixels

| Evento | Pixel | Onde |
|--------|-------|------|
| PageView | Meta + GA4 | Todas as páginas |
| Lead | Meta | Conclusão do quiz |
| InitiateCheckout | Meta + GA4 | Abertura do checkout |
| Purchase | Meta + GA4 | Compra confirmada |
| Upsell | Meta | Upsell aceito |

---

## Checklist de Aprovação

- [ ] Quiz segmenta corretamente
- [ ] Resultado do quiz reflete na LP (coerência brutal)
- [ ] LP e checkout consistentes visualmente
- [ ] Bump com copy de transição lógica
- [ ] Upsells com copy de transição (não aleatórios)
- [ ] Mobile-first em todas as páginas
- [ ] Pixels implementados em todos os eventos
- [ ] Velocidade < 3s em mobile

---
*Template: funnel-architecture | Squad: low-ticket*
