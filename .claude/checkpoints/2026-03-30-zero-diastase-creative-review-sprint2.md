---
date: 2026-03-30
title: "Zero Diastase — Creative Review Sprint 2: novos formatos + thumbnails"
branch: "master"
story: ""
tags: [creatives, zero-diastase, ads, sprint2, diversificacao, chat, texto-bold]
last_commit: "e759826"
created_by: "atlas"
---

## O que fizemos

### Sprint 1 — Correcoes base (sessao anterior, mesma data)
- Migracao de fonte para Poppins em todos os 10 ads com imagem
- Fix layout ad-esperanca (imagem 72%/58%, card compacto)
- Regravacao de 10 MP4s (5 square + 5 stories)

### Sprint 2 — Diversificacao (esta sessao)
- Lemos e analisamos o CREATIVE-REVIEW.md (score 62/100)
- Extraimos **10 first-frame thumbnails** (t=3s) para usar como ads estaticos
- Criamos **3 novos formatos** de ad (6 HTMLs total):
  - **texto-bold** — texto grande sobre fundo claro, hook "Si tu barriga parece de 5 meses..."
  - **texto-abdominales** — texto sobre fundo escuro, hook contraintuitivo "Los abdominales EMPEORAN tu diastasis"
  - **chat-screenshot** — conversa WhatsApp fake entre amigas contando sobre o protocolo
- Diversificamos CTAs: DESCUBRE TU NIVEL, EMPIEZA HOY, VER SI CALIFICO
- Gravamos **6 novos MP4s** (3 square + 3 stories)

## Estado atual

### Inventario completo de criativos
- **16 MP4s** prontos para Meta Ads (8 square + 8 stories)
- **10 thumbnails** em `first-frames/` para ads estaticos
- **6 HTMLs novos** (texto-bold, texto-abdominales, chat-screenshot x2 formatos)
- **10 HTMLs com imagem** (antes-depois, hook-frustrada, espejo, esperanca, mama-real x2 formatos)
- **7 motion graphics antigos** (el-precio, no-es-tu-culpa, la-verdad, el-espejo, las-4-fases, la-garantia, los-numeros)

### CTAs em uso
- "HAZ EL TEST GRATIS" — ads originais com imagem
- "DESCUBRE TU NIVEL" — texto-bold
- "EMPIEZA HOY POR $19.90" — texto-abdominales
- "VER SI CALIFICO" — chat-screenshot

## Arquivos chave

### Novos (criados nesta sessao)
- `creatives/ad-texto-bold-1080x1080.html` + `1080x1920.html`
- `creatives/ad-texto-abdominales-1080x1080.html` + `1080x1920.html`
- `creatives/ad-chat-screenshot-1080x1080.html` + `1080x1920.html`
- `creatives/extract-frames.js` — script Puppeteer para extrair thumbnails
- `creatives/first-frames/` — 10 PNGs de thumbnails

### Atualizados
- `creatives/record-creative.js` — adicionados 6 novos criativos ao array

### Review
- `CREATIVE-REVIEW.md` — analise completa dos criativos (score 62/100)

## Decisoes tomadas
- Delays de animacao mantidos como estavam (usuario confirmou que estao ok nos MP4s)
- Novos formatos focados em diversificacao: texto puro + chat nativo (zero imagem AI)
- Chat-screenshot usa formato WhatsApp fake (muito eficaz em LATAM)
- Texto-abdominales usa fundo escuro (#0A0A0A) para contrastar com os ads claros
- Stories gravados 1 de cada vez (2 em paralelo crasham puppeteer por memoria)
- Texto bold ads com 10s de duracao (curtos, quase estaticos)
- Chat-screenshot com 15s (precisa de tempo para mensagens aparecerem)

## Proximos passos
- Subir MP4s para Meta Ads Manager e criar campanhas
- Testar ads estaticos (thumbnails) vs videos animados
- Monitorar metricas: CTR > 1.5%, CPA < $5, Hook rate > 30%
- Considerar cortar el-espejo motion graphic (duplica ad-espejo foto)
- Se CTR baixo: criar variantes UGC / carrossel educativo
- Se rejeicao Meta por imagens AI: migrar para stock/UGC real

## Contexto tecnico
- Stack: HTML/CSS puro + Puppeteer + FFmpeg
- Fonte: Google Fonts Poppins (400-900)
- Cores brand: coral #E8837C, mint #7ECEC1, warm white #FFF8F5, dark #0A0A0A
- Pipeline: `node record-creative.js {filtro}` (grava qualquer HTML como MP4)
- Pipeline: `node extract-frames.js` (extrai thumbnails de todos os ads)
- Limitacao: max 1 puppeteer 1920px simultaneo, max 2-3 puppeteer 1080px
- Mercado: LATAM hispanico, espanhol neutro, $19.90 USD
