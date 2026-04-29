# CAMPAIGN STRUCTURE — Zero Diastasis™

> Gerado por: @media-buyer + @traffic-head + @metrics-analyst
> Data: 2026-03-19 | **Atualizado: 2026-04-07** (6 criativos finais + Wave 1/Wave 2)
> Status: PRONTO PARA IMPLEMENTAR (aguardando funil fechado)
> Plataforma: Meta Ads

---

## Estrutura de Campanha — Visão Geral

```
CONTA DE ANÚNCIOS (Pixel Novo — Zero Diastasis)
│
├── [CBO] ZD_Launch_BroadLATAM_[data]   ← Budget: R$60-70/dia
│   │
│   ├── [Adset] Broad_Mujeres2545_LATAM_[data]
│   │   │
│   │   ├── ── WAVE 1 (subir primeiro — R$300 total) ──
│   │   ├── [Ad 1] IMG  — No_Es_Tu_Culpa_v1        ← Tier 1 🥇
│   │   ├── [Ad 2] VID  — La_Verdad_35s_v1          ← Tier 1 🥇 (compliance fixado)
│   │   ├── [Ad 3] IMG  — Ad_Hook_Frustrada_v1      ← Tier 1 🥇
│   │   │
│   │   ├── ── WAVE 2 (subir após wave 1 — R$300 total) ──
│   │   ├── [Ad 4] VID  — El_Espejo_Story_v1        ← Tier 2 🥈
│   │   ├── [Ad 5] VID  — AD1_Finale_v1             ← Benchmark
│   │   └── [Ad 6] IMG  — AD2_Baseline_v1           ← Baseline validada
│   │
│   └── (Adsets futuros quando escalar — lookalike 1% purchasers)
│
└── [CBO] ZD — Retargeting (FUTURO — após 500+ quiz completions)
    └── (Quiz abandoners / TSL viewers / Checkout abandoners)
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
| **Budget diário** | R$60-70/dia | Wave 1: R$300 total (5 dias) → Wave 2: R$300 total |
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

#### Wave 1 — Subir no dia do lançamento

| Ad | Nome no Ads Manager | Formato | Arquivo | Headline | CTA | Wave |
|----|---------------------|---------|---------|----------|-----|------|
| 1 | `IMG_NoEsTuCulpa_v1` | Imagem 1:1 1080x1080 | `no-es-tu-culpa-square-1080x1080.html` (exportar PNG) | "No es falta de voluntad" | "Hacer Test Gratis" | 1 |
| 2 | `VID_LaVerdad_35s_v1` | Vídeo 9:16 35s | `la-verdad-35s-1080x1920.html` (exportar MP4) | "Los abdominales empeoran tu diástasis" | "Hacer Test Gratis" | 1 |
| 3 | `IMG_HookFrustrada_v1` | Imagem 9:16 1080x1920 | `ad-hook-frustrada-1080x1920.html` (exportar PNG) | Hook cinematic Sofia frustrada | "Hacer Test Gratis" | 1 |

#### Wave 2 — Subir após resultados da Wave 1

| Ad | Nome no Ads Manager | Formato | Arquivo | Headline | CTA | Wave |
|----|---------------------|---------|---------|----------|-----|------|
| 4 | `VID_ElEspejo_v1` | Vídeo 9:16 30s | `el-espejo-story-1080x1920.html` (exportar MP4) | "¿Sigues pareciendo embarazada?" | "Hacer Test Gratis" | 2 |
| 5 | `VID_AD1_Finale_v1` | Vídeo (benchmark) | `materiais/.../ADS/AD 1 - FINALE.mp4` | A definir | "Hacer Test Gratis" | 2 |
| 6 | `IMG_AD2_Baseline_v1` | Imagem (baseline) | `materiais/.../ADS/AD2.png` | A definir | "Hacer Test Gratis" | 2 |

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
