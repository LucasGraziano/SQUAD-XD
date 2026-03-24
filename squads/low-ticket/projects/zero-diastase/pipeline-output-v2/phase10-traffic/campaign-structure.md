# CAMPAIGN STRUCTURE — Zero Diastasis™

> Gerado por: @media-buyer + @traffic-head + @metrics-analyst
> Data: 2026-03-19
> Status: DRAFT
> Plataforma: Meta Ads

---

## Estrutura de Campanha — Visão Geral

```
CONTA DE ANÚNCIOS (Pixel Novo — Zero Diastasis)
│
├── [CBO] ZD — Launch — Broad LATAM
│   │
│   ├── [Adset] Broad — Mujeres 25-45 — LATAM
│   │   ├── [Ad] IMG — No Es Tu Culpa (Script 3)
│   │   ├── [Ad] VID — La Verdad 35s (Script 1)
│   │   ├── [Ad] IMG — El Precio (Script 5)
│   │   └── [Ad] VID — El Espejo 30s (Script 2)     ← P2, adicionar D3-D5
│   │
│   └── (Adsets futuros quando escalar)
│
└── [CBO] ZD — Retargeting (FUTURO — quando pixel tiver dados)
    └── (Após 500+ quiz completions)
```

---

## Campanha Principal — Specs

### Nível: Campanha

| Parâmetro | Valor | Motivo |
|-----------|-------|--------|
| **Nome** | `ZD_Launch_BroadLATAM_[data]` | Convenção de naming |
| **Objetivo** | Conversions | Otimizar para ação real |
| **Evento de conversão** | Lead (QuizComplete) → migrar para Purchase | Learning phase viável |
| **Tipo de orçamento** | CBO (Campaign Budget Optimization) | Meta distribui entre adsets |
| **Budget diário** | $4.20/dia (≈ R$23/dia) | Seed R$700/mês ÷ 30 dias |
| **Otimização de entrega** | Lowest cost | Sem bid cap (budget muito baixo) |
| **Attribution** | 7-day click, 1-day view | Padrão para low-ticket |

### Nível: Adset

| Parâmetro | Valor |
|-----------|-------|
| **Nome** | `Broad_Mujeres2545_LATAM_[data]` |
| **Audiência** | Broad |
| **Idade** | 25-45 |
| **Gênero** | Mulheres |
| **Geo** | AR, CO, MX, CL, PE, EC, GT, DO, CR, PA, UY, PY, BO, HN, SV, NI, PR |
| **Idioma** | Espanhol |
| **Interesses** | Nenhum (broad) |
| **Exclusões** | Nenhuma |
| **Placements** | Automatic |
| **Frequência** | Monitor (pausar se > 2.5) |
| **Schedule** | Always on |

### Nível: Ads

| Ad | Nome | Formato | Asset | Primary Text | Headline | CTA |
|----|------|---------|-------|-------------|----------|-----|
| 1 | `IMG_NoEsTuCulpa_v1` | Imagem 1080x1080 | Remix.png + design | Copy Script 3 (150 chars) | "Tu cuerpo no necesita fuerza" | "Hacer Test Gratis" |
| 2 | `VID_LaVerdad_35s_v1` | Vídeo 35s 9:16+1:1 | Sofia talking head | Copy Script 1 (200 chars) | "Descubre por qué empeoran" | "Hacer Test Gratis" |
| 3 | `IMG_ElPrecio_v1` | Imagem 1080x1080 | Comparativo 3 cols | Copy Script 5 (180 chars) | "$19.90 — Sin cirugía, sin gym" | "Hacer Test Gratis" |
| 4 | `VID_ElEspejo_30s_v1` | Vídeo 30s 9:16+1:1 | Sofia UGC selfie | Copy Script 2 (180 chars) | "¿Sigues pareciendo embarazada?" | "Hacer Test Gratis" |

---

## Naming Convention

### Campanha
```
{Produto}_{Fase}_{Audiência}_{Data}
ZD_Launch_BroadLATAM_20260319
```

### Adset
```
{Targeting}_{Demo}_{Geo}_{Data}
Broad_Mujeres2545_LATAM_20260319
```

### Ad
```
{Formato}_{Nome}_{Versão}
IMG_NoEsTuCulpa_v1
VID_LaVerdad_35s_v1
```

---

## UTM Parameters

### Estrutura

```
?utm_source=meta
&utm_medium=paid
&utm_campaign={{campaign.name}}
&utm_content={{ad.name}}
&utm_term={{adset.name}}
```

### URL Final (Quiz Landing)

```
https://zerodiastasis.com/test?utm_source=meta&utm_medium=paid&utm_campaign={{campaign.name}}&utm_content={{ad.name}}&utm_term={{adset.name}}
```

*(Substituir por URL Hotmart se usando link direto)*

---

## Pixel Setup

### Eventos Configurados

| Evento | Tipo | Trigger | Valor |
|--------|------|---------|-------|
| `PageView` | Standard | Todas as páginas | — |
| `ViewContent` | Standard | Quiz landing page | — |
| `Lead` | Standard | Quiz complete (etapa 35) | $0 |
| `AddToCart` | Standard | Clique no CTA da TSL | — |
| `InitiateCheckout` | Standard | Checkout Hotmart carrega | — |
| `Purchase` | Standard | Compra confirmada | $19.90 |
| `Purchase` (bump) | Custom | Compra com bump | $23.90 |
| `Purchase` (upsell1) | Custom | Aceleración aceita | $9.00 |
| `Purchase` (upsell2) | Custom | Reset Postural aceito | $29.00 |

### Custom Conversions

| Nome | Regra | Valor | Uso |
|------|-------|-------|-----|
| `ZD_QuizComplete` | URL contains `/resultado` OR event = Lead | $0 | Otimização de campanha (Fase 1) |
| `ZD_Purchase` | event = Purchase AND value >= 19.90 | Dinâmico | Otimização de campanha (Fase 2+) |
| `ZD_HighValue` | event = Purchase AND value >= 23.90 | Dinâmico | Reportagem (compradores com bump+) |

### Pixel Diagnostics

| Check | Frequência | Ação se falhar |
|-------|-----------|----------------|
| Pixel firing? | D1 | Verificar instalação no Hotmart |
| Events matching? | D1-D3 | Meta Events Manager → Test Events |
| Atribuição correta? | D7 | Comparar Meta vs Hotmart vendas |
| Deduplicação | D7 | Verificar se não há double-counting |

---

## Retargeting — Fase Futura

### Quando ativar retargeting

| Condição | Métrica |
|----------|---------|
| Quiz completions acumulados | > 500 |
| Pixel data days | > 14 dias |
| Budget permite | > $8/dia total |

### Audiências de Retargeting (quando disponíveis)

| Audiência | Definição | Ad | Estimativa |
|-----------|-----------|-----|-----------|
| **Quiz Abandoners** | Iniciou quiz, não completou | "¿Olvidaste algo?" + resultado parcial | 40% do tráfego |
| **TSL Viewers** | Viu TSL, não comprou | Reminder com prova social | 15% do tráfego |
| **Checkout Abandoners** | Iniciou checkout, não pagou | Urgência + garantia | 5% do tráfego |
| **Buyers** | Comprou produto principal | Upsell 1 ou 2 | Excluir de prospecção |

### Lookalike Audiences (quando disponíveis)

| Audiência | Seed | Quando |
|-----------|------|--------|
| LAL 1% Purchasers | Todos que compraram | > 100 purchases |
| LAL 1% Quiz Completers | Todos que completaram quiz | > 500 completions |
| LAL 1% High Value | Comprou + bump/upsell | > 50 high-value purchases |

---

## Regras de Escalação

### Budget Increase Rules

| Condição | Ação | Limite |
|----------|------|--------|
| CPA < $6 por 3 dias consecutivos | Aumentar budget 20% | Máximo 1 aumento por semana |
| CPA < $4 por 5 dias consecutivos | Aumentar budget 30% | Máximo $2/dia de aumento |
| Winner claro (1 ad com 80%+ do spend eficiente) | Criar novo adset com winner isolado | Manter original rodando |

### Budget Decrease Rules

| Condição | Ação |
|----------|------|
| CPA > $10 por 3 dias | Reduzir budget 20%, revisar criativos |
| CPA > $12 por 5 dias | Pausar campanha, revisar todo o funnel |
| ROAS < 1.0 por 7 dias | Kill — repensar abordagem |

---

## Checklist de Lançamento

| # | Item | Status |
|---|------|--------|
| 1 | Conta de Ads Manager configurada | ⬜ |
| 2 | Pixel novo criado e instalado no Hotmart | ⬜ |
| 3 | Eventos de conversão configurados | ⬜ |
| 4 | Custom conversions criadas | ⬜ |
| 5 | Página de quiz publicada e funcional | ⬜ |
| 6 | TSL publicada e funcional | ⬜ |
| 7 | Checkout Hotmart configurado ($19.90 + bump $4) | ⬜ |
| 8 | Thank You page com upsell funcional | ⬜ |
| 9 | 3-4 criativos prontos (imagens + vídeos) | ⬜ |
| 10 | UTMs testados end-to-end | ⬜ |
| 11 | Pixel test events validado | ⬜ |
| 12 | Campanha criada no Ads Manager (pausada) | ⬜ |
| 13 | Forma de pagamento do Ads Manager ativa | ⬜ |
| 14 | Email de welcome sequence ativa | ⬜ |
| 15 | **GO LIVE — ativar campanha** | ⬜ |

---

*Campaign Structure — Traffic Dept — Low-Ticket Squad*
*Pipeline v2.0 | Phase 10 | Data: 2026-03-19*
