# FUNNEL ARCHITECTURE — ZERO DIASTASIS™
## Gerado por: 🔧 Flow (Funnel Chief)
## Data: 2026-03-09

---

## 1. TIPO DE FUNIL

**Quiz Funnel → TSL → Checkout → Upsell Flow**

```
[META ADS]
    │
    ▼
[QUIZ] ─── 18 páginas, 2-3 min ─── lead capture no P16
    │
    ▼
[TSL PAGE] ─── Text Sales Letter em espanhol
    │
    ▼
[CHECKOUT] ─── US$19.90
    │  └── [ORDER BUMP] Pack Recetas US$4 ← FASE C (não no MVP)
    │
    ▼
[UPSELL 1] ─── Aceleración US$9 ← FASE C
    │
    ▼
[UPSELL 2] ─── Reset Postural US$29 ← FASE C
    │
    ▼
[THANK YOU] ─── Email de acesso + instruções
    │
    ▼
[SITE DE ENTREGA] ─── Área de membros (MVP: Google Drive/Notion)
```

---

## 2. FLUXO DETALHADO — MVP (Fase A)

### O que montar AGORA para validar:

```
AD (Meta)
  │
  │  CTA: "Haz el quiz gratis"
  │  URL: tudominio.com/quiz
  ▼
QUIZ (Typeform / Involve.me)
  │
  │  18 perguntas, lead capture
  │  Redirect após resultado:
  ▼
TSL PAGE (landing page com texto da Fase 3)
  │
  │  URL: tudominio.com/oferta
  │  CTA: "Quiero mi plan — $19.90"
  ▼
CHECKOUT (LastLink / Hotmart)
  │
  │  Produto: Zero Diastasis™ — US$19.90
  │  Sem bumps/upsells no MVP
  ▼
THANK YOU PAGE
  │
  │  "¡Felicidades! Tu acceso está listo."
  │  Botão: "Acceder a mi protocolo"
  │  + Email automático com link de acesso
  ▼
ENTREGA (MVP)
  │
  │  Google Drive / Notion / Memberkit
  │  Conteúdo: E-book Módulo 1 + Áudios Módulo 2 + PDF exercícios
  │  (mínimo para 7 dias de conteúdo)
  ▼
EMAIL PÓS-COMPRA
  │
  │  Email 1 (imediato): Link de acesso + "Como empezar"
  │  Email 2 (dia 1): "Tu primera sesión está lista"
  │  Email 3 (dia 3): "¿Cómo te sientes? Es normal si..."
  │  Email 4 (dia 7): "¡Completaste la semana 1!"
```

---

## 3. PÁGINAS — SPECS TÉCNICAS

### 3.1 Quiz

| Spec | Valor |
|------|-------|
| **Plataforma** | Typeform (recomendado) ou Involve.me |
| **URL** | tudominio.com/quiz |
| **Responsivo** | Mobile-first obrigatório |
| **Velocidade** | < 2s para carregar |
| **Barra de progresso** | Sim |
| **Auto-advance** | Sim, após seleção |
| **Lead capture** | Email + nome (página 16) |
| **Redirect** | → TSL page após resultado |
| **Pixel events** | `QuizStart`, `QuizComplete`, `Lead` |

### 3.2 TSL Page (Landing Page)

| Spec | Valor |
|------|-------|
| **Plataforma** | Carrd, Unbounce, WordPress, ou HTML estático |
| **URL** | tudominio.com/oferta |
| **Conteúdo** | Texto do `tsl-zero-diastasis-ES.md` (Fase 3) |
| **Width** | Máx 680px (conteúdo), centralizado |
| **Background** | #FFFAF5 (White Warm) |
| **CTA buttons** | #C97B7B (Blush forte), 2-3 ao longo da página |
| **Mobile** | 90%+ do tráfego — testar em celular ANTES de rodar |
| **Velocidade** | < 3s first load (LATAM tem internet variável) |
| **Pixel events** | `PageView`, `ViewContent`, `InitiateCheckout` (no CTA) |
| **Timer** | Opcional — countdown 5 min no topo (após quiz) |
| **Sticky CTA** | Barra fixa no bottom mobile com botão de compra |

**Elementos obrigatórios na TSL:**
1. Resultado personalizado (referência ao quiz)
2. Headline + mecanismo
3. 4 fases do protocolo
4. Stack de valor
5. Ancoragem $99.99 → $19.90
6. Garantia 28 días
7. FAQ
8. CTA final
9. Disclaimer de bienestar no footer

### 3.3 Checkout

| Spec | Valor |
|------|-------|
| **Plataforma** | LastLink ou Hotmart |
| **Produto** | Zero Diastasis™ |
| **Preço** | US$19.90 (pagamento único) |
| **Moeda** | USD |
| **Métodos** | Cartão de crédito + PIX (se Hotmart) |
| **Idioma** | Espanhol |
| **Pixel events** | `Purchase` (valor = 19.90, moeda = USD) |
| **Garantia** | 28 días |
| **Bump** | Desativado no MVP |
| **Upsells** | Desativados no MVP |

### 3.4 Thank You Page

| Spec | Valor |
|------|-------|
| **URL** | tudominio.com/gracias |
| **Conteúdo** | Confirmação + próximos passos + link de acesso |
| **Email** | Trigger automático com credenciais de acesso |
| **Pixel events** | `Purchase` (redundância com checkout) |

**Copy da Thank You:**
```
¡Felicidades, {nombre}! Tu acceso a Zero Diastasis™ está listo.

📩 Revisa tu email — te enviamos el link de acceso.

TUS PRÓXIMOS PASOS:
1. Abre el email que te acabamos de enviar
2. Accede a tu protocolo
3. Lee el e-book "El Desbloqueo" primero (20 min)
4. Mañana comienza tu Día 1

¿Preguntas? Escríbenos a: soporte@tudominio.com

[BOTÓN: ACCEDER A MI PROTOCOLO]
```

---

## 4. TRACKING & PIXELS

### Meta Pixel — Eventos obrigatórios

| Evento | Onde | Parâmetros |
|--------|------|------------|
| `PageView` | Todas as páginas | — |
| `ViewContent` | Quiz start + TSL | content_name: "quiz" ou "tsl" |
| `Lead` | Quiz lead capture (P16) | — |
| `InitiateCheckout` | CTA da TSL (clique) | value: 19.90, currency: USD |
| `Purchase` | Thank You page | value: 19.90, currency: USD |

### Custom Events (opcionais mas recomendados)

| Evento | Onde | Para que |
|--------|------|---------|
| `QuizStart` | Quiz P1 | Medir taxa de início |
| `Quiz25` | Quiz P5 | Drop-off por fase |
| `Quiz50` | Quiz P9 | Drop-off por fase |
| `Quiz75` | Quiz P14 | Drop-off por fase |
| `QuizComplete` | Quiz P17 | Completion rate |

### UTM Structure

```
?utm_source=facebook
&utm_medium=paid
&utm_campaign={campaign_name}
&utm_content={ad_name}
&utm_term={adset_name}
```

---

## 5. CONVERSION MAP — BENCHMARKS

### Funil Completo (projeção conservadora)

```
1,000 cliques no ad
    │
    ▼
700 quiz starts (70% CTR ad → quiz)
    │
    ▼
315 quiz completes (45% completion)
    │
    ▼
250 leads capturados (80% lead capture)
    │
    ▼
200 TSL views (80% veem a TSL)
    │
    ▼
10-20 compras (5-10% TSL → purchase)
    │
    ▼
= CPA de US$5-10 (com CPC de US$0.10-0.20 em LATAM)
```

### KPIs por etapa

| Etapa | Target | Alerta se |
|-------|:------:|:---------:|
| CTR ad | > 1.5% | < 1% |
| Ad → Quiz start | > 65% | < 50% |
| Quiz completion | > 40% | < 30% |
| Lead capture rate | > 75% | < 60% |
| Lead → TSL view | > 75% | < 60% |
| TSL → Purchase | > 5% | < 3% |
| **CPA** | **< US$12** | **> US$18** |

### Diagnóstico rápido de problemas

| Sintoma | Provável causa | Ação |
|---------|---------------|------|
| CTR baixo (< 1%) | Hook fraco ou público errado | Testar novos hooks/públicos |
| Quiz completion baixo (< 30%) | Quiz longo ou confuso | Reduzir perguntas, melhorar UX |
| Lead capture baixo (< 60%) | Não vêem valor no resultado | Melhorar copy do resultado |
| TSL → Purchase baixo (< 3%) | TSL não convence ou preço | Testar novos ângulos, garantia |
| CPA alto (> $18) | Múltiplos problemas | Auditar cada etapa isoladamente |

---

## 6. PLATAFORMAS RECOMENDADAS (MVP)

### Opção 1: Simples e rápido (recomendado para validação)

| Componente | Plataforma | Custo/mês |
|-----------|------------|:---------:|
| Quiz | Typeform (free tier) | $0 |
| TSL | Carrd.co | $19/ano |
| Checkout | Hotmart | % por venda |
| Email | Mailchimp (free tier) | $0 |
| Entrega | Google Drive + Notion | $0 |
| **Total fixo** | | **~$2/mês** |

### Opção 2: Profissional (após validação)

| Componente | Plataforma | Custo/mês |
|-----------|------------|:---------:|
| Quiz | Involve.me ou Typeform Pro | $29-49 |
| TSL + Site | WordPress + Elementor | $10-20 |
| Checkout | Hotmart ou LastLink | % por venda |
| Email | ActiveCampaign | $29 |
| Entrega | Memberkit ou Hotmart Sparkle | $0-49 |
| **Total fixo** | | **~$100-150/mês** |

---

## 7. CHECKLIST DE IMPLEMENTAÇÃO

### Para rodar tráfego (Fase A):

| # | Tarefa | Status |
|---|--------|:------:|
| 1 | Criar quiz no Typeform com 18 perguntas (ES) | ⬚ |
| 2 | Configurar lead capture no P16 | ⬚ |
| 3 | Criar TSL page com texto da Fase 3 | ⬚ |
| 4 | Configurar checkout no Hotmart/LastLink (US$19.90) | ⬚ |
| 5 | Criar Thank You page | ⬚ |
| 6 | Instalar Meta Pixel em todas as páginas | ⬚ |
| 7 | Configurar eventos de conversão | ⬚ |
| 8 | Conectar email (welcome + acesso) | ⬚ |
| 9 | Testar fluxo completo em mobile | ⬚ |
| 10 | Preparar entrega mínima (E-book + 7 áudios) | ⬚ |

---

## APROVAÇÃO

| Dept | Status |
|------|--------|
| Funnel (Flow) | ✅ ENTREGUE |
| Quiz (Riddle) | ✅ ENTREGUE |
| Localization (Lingua) | ✅ REVISADO |
| Commander (Atlas) | ⏳ AGUARDANDO |

---

*🔧 Flow (Funnel Chief) + ❓ Riddle (Quiz Builder)*
*Pipeline: new-offer adaptado | Projeto: Zero Diastasis™*
