# Sprint Status — Zero Diastasis™
> Atualizado: 2026-04-07 | Responsável: Lucas (operador) + Cabral (arquiteto)
> **Regra:** atualizar este arquivo a cada sessão de trabalho.

---

## 🗺️ FUNIL — VISÃO GERAL

```
[ADS] ──→ [QUIZ] ──→ [TSL] ──→ [CHECKOUT] ──→ [UPSELLS] ──→ [ENTREGA]
  ✅          ✅*        ✅*         ❌               ❌            ✅
```

`*` = pronto no pipeline, aguardando publicação/aprovação do Cabral

---

## STATUS POR ETAPA

### 1. ADS ✅ Prontos — aguardando funil fechado

**Wave 1 (R$300 — subir primeiro):**
| # | Arquivo | Formato | Status |
|---|---------|---------|--------|
| 1 | `no-es-tu-culpa-square-1080x1080.html` | Imagem 1:1 | ✅ Pronto |
| 2 | `la-verdad-35s-1080x1920.html` | Story (HTML→MP4) | ✅ Pronto (compliance fixado) |
| 3 | `ad-hook-frustrada-1080x1920.html` | Imagem Story | ✅ Pronto |

**Wave 2 (R$300 — subir após wave 1):**
| # | Arquivo | Formato | Status |
|---|---------|---------|--------|
| 4 | `el-espejo-story-1080x1920.html` | Story (HTML→MP4) | ✅ Pronto |
| 5 | `materiais/Documentos existentes/ADS/AD 1 - FINALE.mp4` | Vídeo | ✅ Pronto |
| 6 | `materiais/Documentos existentes/ADS/AD2.png` | Imagem | ✅ Pronto |

**Kill rules:** CTR <1%/48h → pausar | CTR ≥2% + ROAS ≥1.5x → escalar

---

### 2. QUIZ ✅ Traduzido — aguardando Cabral publicar

- Estrutura: 35 etapas (6 fases psicológicas)
- Link atual: https://inlead.digital/zero-diastese
- Tradução ES: feita, Cabral enviando versão final
- **Pendência:** Cabral subir a versão em espanhol

---

### 3. TSL ✅ Draft completo — aguardando Cabral aprovar e publicar

> **ATENÇÃO:** a TSL já está escrita em espanhol neutro.
> Localização: `pipeline-output-v2/phase5-copy/sales-letter.md`
> 10 blocos: identificação → revelação → mecanismo → prova social → stack → garantia → CTA → FAQ
>
> **O que falta:** Cabral revisar, ajustar depoimentos e publicar como página web.

- Preço exibido: ~~$99.99~~ → $19.90 ✅
- Garantia: 28 dias ✅
- Mecanismo: "faja invisible" / reprogramação muscular ✅
- FAQ: 7 perguntas ✅

---

### 4. CHECKOUT ❌ Pendente — Cabral

- Plataforma: Kiwify ou LastLink (Cabral decide)
- Produto principal: US$19.90
- Order bump: Pack de Recetas US$4
- **Pendência:** Cabral configurar e compartilhar o link

---

### 5. UPSELLS ❌ Pendente — Cabral

| Upsell | Preço | Status |
|--------|-------|--------|
| Aceleración | US$9 | ❌ Não configurado |
| Reset Postural | US$29 | ❌ Não configurado |

---

### 6. ENTREGÁVEIS ✅ Produto completo — 9 arquivos prontos

| Arquivo | Tipo | Status |
|---------|------|--------|
| `el-desbloqueo.html` | Módulo 1 | ✅ |
| `guia-modulo-2 (1).html` | Módulo 2: Reconexión | ✅ |
| `guia-modulo-3.html` | Módulo 3: Compresión | ✅ |
| `guia-modulo-4.html` | Módulo 4: Anclaje | ✅ |
| `guia-modulo-5.html` | Módulo 5: Cierre Total (extra) | ✅ |
| `stack-360.html` | Bônus Stack 360° | ✅ |
| `vacuum-master.html` | Bônus Vacuum Master | ✅ |
| `tracker-28-dias.html` | Tracker 28 Días | ✅ |
| `pack-recetas.html` | Pack de Recetas (order bump) | ✅ |

**Converter para PDF:** `node export-pdfs.js` (instalar Puppeteer primeiro: `npm install puppeteer`)

**Estratégia de entrega MVP:** Google Drive link → enviado por email pós-compra via Kiwify/LastLink

---

## 🔴 BLOCKERS (o que trava o lançamento)

| # | Blocker | Responsável | Urgência |
|---|---------|-------------|---------|
| 1 | Quiz em ES publicado | Cabral | 🔴 Alta |
| 2 | TSL aprovada e publicada como página | Cabral | 🔴 Alta |
| 3 | Checkout configurado (produto + bump) | Cabral | 🔴 Alta |
| 4 | Upsells configurados | Cabral | 🟡 Média |

---

## ✅ O QUE LUCAS PODE FAZER AGORA

- [ ] Estruturar campanha no Facebook Ads Manager (criar, não publicar)
- [ ] Instalar Meta Pixel no domínio do quiz
- [ ] Configurar audiências: mulheres 28-45, CO + MX + PR, broad
- [ ] Converter HTML → PDF com `node export-pdfs.js`
- [ ] Hospedar PDFs no Google Drive com link compartilhável
- [ ] Aguardar vídeos Alan Tracker para ingest de configuração de campanha
- [ ] Cobrar Cabral: quiz ao vivo + TSL publicada + checkout

---

## 📊 MÉTRICAS DE CAMPANHA (preencher quando live)

| Data | Spend (R$) | Impressões | CTR | CPC | Vendas | CPA | ROAS |
|------|-----------|------------|-----|-----|--------|-----|------|
| — | — | — | — | — | — | — | — |

**Meta:** CPA ≤ R$25 | CTR ≥ 1% | ROAS ≥ 1.5x

---

## 📅 LINHA DO TEMPO

| Marco | Data Alvo | Status |
|-------|-----------|--------|
| Produto completo | ✅ 2026-04-07 | Concluído |
| Criativos Wave 1 prontos | ✅ 2026-04-07 | Concluído |
| Quiz ES publicado | TBD | Aguardando Cabral |
| TSL publicada | TBD | Aguardando Cabral |
| Checkout configurado | TBD | Aguardando Cabral |
| **GO LIVE** | TBD | Aguardando blockers |
| Decisão escala/pivot | +5 dias de tráfego | — |

---

## 🧪 CONTEXTO ESTRATÉGICO

- **Modelo:** ZD como laboratório de tráfego LATAM → caixa → SaaS (decisão Conclave 72% CONDITIONAL)
- **Budget total:** R$600 (Wave 1: R$300 → Wave 2: R$300)
- **Kill switch macro:** R$500 sem retorno = mata oferta
- **2 meses sem lucro = pivot de nicho**
- **Discovery paralelo:** 30min/dia pesquisando dor de psicólogos (SaaS futuro)

---

*Atualizar este arquivo após cada sessão de trabalho ou mudança de status.*
