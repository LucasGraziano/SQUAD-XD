# FUNNEL ARCHITECTURE v2.0 — Zero Diastasis™

> Gerado por: @funnel-chief + @quiz-builder
> Data: 2026-03-19
> Status: DRAFT
> Decisão D2: SEM VSL. Quiz → TSL → Checkout.
> Decisão D3: Complementar quiz do Cabral, não redesenhar.

---

## Fluxo Completo

```
[META ADS] — broad LATAM, 3-4 criativos
     │
     ▼
[QUIZ LANDING PAGE]
  │  Hero: "Descubre tu nivel de separación abdominal"
  │  CTA: "EMPEZAR TEST GRATIS"
     │
     ▼
[QUIZ — 35 etapas] (estrutura do Cabral)
  │  6 fases: Intro → Diagnóstico → Consciência → Impedimento → Desejo → Oferta
  │  Loadings motivacionais entre fases
  │  Gráficos condicionais (5 paths)
     │
     ▼
[TSL — Text Sales Letter]
  │  Resultado personalizado do quiz
  │  10 blocos: identificação → revelação → mecanismo → prova → oferta → garantia → FAQ
  │  Ancoragem: ~~$99.99~~ → $19.90
     │
     ▼
[CHECKOUT — Hotmart]
  │  $19.90 + Order Bump: Recetas ($4)
     │
     ▼
[THANK YOU PAGE + UPSELL 1]
  │  "¡Felicidades!" + Aceleración ($9)
     │
     ▼
[UPSELL 2 PAGE]
  │  Reset Postural ($29) ou Downsell ($14)
     │
     ▼
[ÁREA DE MEMBROS — Hotmart]
  │  Módulo 1 imediato → Drip 28 dias
     │
     ▼
[EMAIL SEQUENCES]
  │  Welcome → Nurture 28d → Ofertas internas → LTV
```

---

## Quiz — Integração com Estrutura do Cabral

### 6 Fases (35 etapas)

| Fase | Etapas | Objetivo | Status (Cabral) |
|------|--------|----------|-----------------|
| **1. Intro** | 1-5 | Capturar dados básicos, engajar | ✅ Prontas |
| **2. Diagnóstico** | 6-9 | Avaliar nível de separação | ⚠️ Etapa 9 precisa ajuste |
| **3. Consciência** | 10-13 | Educar sobre diástase, elevar consciência | ⚠️ Etapa 13 incompleta |
| **4. Impedimento** | 14-19 | Identificar objeções e bloqueios | ⚠️ Loadings incompletos |
| **5. Desejo** | 20-24 | Gráficos condicionais, criar visão de futuro | ❌ Incompletas |
| **6. Oferta** | 25-35 | Apresentar solução, produtos, página de vendas | ❌ Pendentes |

### O Que Completar (Responsabilidade: Cabral + Squad)

| Item | Status | Ação |
|------|--------|------|
| Etapa 9 (diagnóstico) | Precisa ajuste | Cabral valida + squad refina |
| Etapa 13 (respostas) | Incompletas | Cabral completa |
| Loadings (6, 10, 14, 19) | Todos incompletos | Squad cria micro-copy motivacional em ES |
| Gráficos condicionais (20-24) | Incompletos | Squad design visual + lógica |
| Etapas desejo (20-21 v2) | Incompletas | Squad completa em ES |
| Compromisso (22) | Incompleta | Squad cria |
| Prova social (23) | Incompleta | Squad cria (depoimentos sintéticos) |
| Produtos (31-34) | Pendentes | Squad configura bump/upsells |
| Página de vendas (35) | Parcial | = TSL (já criada na Phase 5) |
| Tradução ES neutro | Não iniciada | Squad traduz tudo |

### Loadings Motivacionais (a criar)

| Loading | Após etapa | Micro-copy (ES) |
|---------|-----------|-----------------|
| Loading 1 | Etapa 5 (fim intro) | "Analizando tus respuestas..." + barra animada |
| Loading 2 | Etapa 9 (fim diagnóstico) | "Calculando tu nivel de separación..." |
| Loading 3 | Etapa 13 (fim consciência) | "Preparando tu plan personalizado..." |
| Loading 4 | Etapa 19 (fim impedimento) | "Casi listo... generando tu resultado..." |

### Gráficos Condicionais (5 paths)

Baseado no fluxo do Cabral (FLUXO_ETAPA19-20-21.PNG):

| Path | Condição | Gráfico | Mensagem |
|------|----------|---------|----------|
| A | Separação leve + pouca dor | Progresso rápido | "Tu caso es favorable — resultados rápidos esperados" |
| B | Separação moderada + dor lombar | Progresso médio | "Tu nivel responde bien a la reprogramación" |
| C | Separação avançada + múltiplos sintomas | Progresso gradual | "Tu caso necesita el protocolo completo — 28 días" |
| D | Pós-cesárea | Path especial | "Post-cesárea: tu cuerpo necesita enfoque suave" |
| E | Tentou de tudo | Path frustrada | "Nada funcionó porque atacaban el síntoma, no la causa" |

---

## Páginas do Funil

### 1. Quiz Landing Page

| Elemento | Spec |
|----------|------|
| **URL** | zerodiastasis.com/test (ou Hotmart link direto) |
| **Hero headline** | "Descubre tu nivel de separación abdominal en 2 minutos" |
| **Hero subhead** | "Test gratuito · 100% confidencial · Resultado inmediato" |
| **Hero visual** | Sofia (frontal) + ilustração abdômen |
| **CTA** | "EMPEZAR TEST GRATIS" (botão coral, fullwidth mobile) |
| **Below fold** | 3 badges: "5,000+ mujeres" · "2 minutos" · "100% gratis" |
| **Footer** | Disclaimer + "Zero Diastasis™" |
| **Pixel** | Meta Pixel fire: PageView, ViewContent |

### 2. Quiz (35 etapas — Hotmart/Typeform/custom)

| Aspecto | Spec |
|---------|------|
| **Design** | Brand colors aplicadas. 1 pergunta por tela. Mobile-first |
| **Progress bar** | Topo, coral, incremental |
| **Transições** | Slide left (swipe feel) |
| **Loadings** | Full-screen com animação, 3-5 segundos, micro-copy |
| **Gráficos** | Chart.js ou imagem estática por path |
| **Pixel events** | QuizStart, QuizStep5, QuizStep13, QuizStep19, QuizComplete |

### 3. TSL (pós-quiz)

| Aspecto | Spec |
|---------|------|
| **Conteúdo** | Ver `phase5-copy/sales-letter.md` |
| **Design** | Ver `phase6-creative/creative-briefs.md` → TSL Page specs |
| **Resultado dinâmico** | Preencher com path do quiz (A-E) |
| **Pixel events** | ViewContent (TSL), AddToCart (clique no CTA) |

### 4. Checkout (Hotmart)

| Aspecto | Spec |
|---------|------|
| **Produto** | Zero Diastasis™ — $19.90 |
| **Bump** | Recetas Antiinflamatorias — $4.00 (checkbox) |
| **Design** | Cores da brand, trust badges |
| **Pixel events** | InitiateCheckout, Purchase |

### 5. Thank You + Upsell 1

| Aspecto | Spec |
|---------|------|
| **Mensagem** | "¡Felicidades! Tu protocolo está listo." |
| **Acesso** | Botão para área de membros |
| **Upsell 1** | Bloco abaixo: Aceleración $9 |
| **Timer** | Não (sem fake urgency) |
| **Pixel events** | Purchase (upsell tracked separado) |

### 6. Upsell 2 Page

| Aspecto | Spec |
|---------|------|
| **Se aceitou Up1** | Oferecer Reset Postural $29 |
| **Se recusou Up1** | Oferecer Reset Postural $29 (mesmo) |
| **Downsell** | Se recusar Up2: Reset Lombar (lite) $14 |

---

## Tracking Plan

### Meta Pixel Events

| Evento | Página | Trigger |
|--------|--------|---------|
| PageView | Todas | Carregamento |
| ViewContent | Quiz landing | Carregamento |
| Lead | Quiz complete | Etapa 35 |
| AddToCart | TSL | Clique no CTA de compra |
| InitiateCheckout | Checkout | Carregamento do checkout |
| Purchase | Thank you | Confirmação de pagamento |
| Purchase (bump) | Thank you | Se bump = true |
| Purchase (upsell1) | Upsell 1 | Aceitou Aceleración |
| Purchase (upsell2) | Upsell 2 | Aceitou Reset Postural |

### UTM Structure

```
utm_source=meta
utm_medium=paid
utm_campaign={campaign_name}
utm_content={ad_name}
utm_term={adset_name}
```

### Custom Conversions (Meta)

| Conversão | Valor | Otimização |
|-----------|-------|-----------|
| QuizComplete | $0 (lead) | Otimizar para volume |
| Purchase | $19.90 | Otimizar para valor |
| Purchase + Bump | $23.90 | Otimizar para valor |

---

## Métricas de Funil

| Etapa | Métrica | Target | Kill |
|-------|---------|--------|------|
| Ad → Quiz landing | CTR | >1.5% | <0.5% |
| Landing → Quiz start | Start rate | >70% | <40% |
| Quiz start → Complete | Completion | >60% | <30% |
| Quiz → TSL view | View rate | >85% | <50% |
| TSL → Checkout | Conversion | >15% | <5% |
| Checkout → Purchase | Payment | >70% | <40% |
| Purchase → Bump | Take rate | >25% | <15% |
| Purchase → Upsell 1 | Take rate | >12% | <5% |
| Purchase → Upsell 2 | Take rate | >6% | <2% |

---

*Funnel Architecture — Funnel Dept — Low-Ticket Squad*
*Pipeline v2.0 | Phase 7 | Data: 2026-03-19*
