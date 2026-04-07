---
date: 2026-03-31
title: "Zero Diástasis — Criativos 100% Finalizados"
branch: "master"
story: "ZD — LANÇAMENTO: revisar criativos + subir campanhas Meta Ads"
tags: [creatives, zero-diastase, launch-ready, meta-ads]
last_commit: "e759826"
created_by: "orion"
---

## O que fizemos
- Re-gravaram 4 MP4s quadrados que ainda usavam fonte antiga (las-4-fases, la-verdad, los-numeros, el-espejo) → agora todos com Poppins
- Gravaram La Verdad 35s em ambos os formatos (square + story) — versão estendida para voiceover
- Criaram 6 story HTML versions (1080x1920) para todos os motion graphics
- Criaram 8 ads estáticos animados (antes-depois, hook-frustrada, espejo, esperanca, mama-real, texto-bold, texto-abdominales, chat-screenshot) em ambos os formatos
- Criaram carousel "Las 4 Fases" com 4 cards compactos (cover, fases1-2, fases3-4, CTA) em PNG
- Migraram todas as fontes de Playfair Display/Inter → Poppins em 8 HTMLs base
- Salvaram roteiro de voiceover para La Verdad 35s

## Estado atual
- **33 MP4s** prontos (todos com Poppins, ambos formatos square 1080x1080 + story 1080x1920)
- **16 PNGs** do carousel (4 cards compactos × 2 formatos + 6 cards individuais × 2 formatos)
- **1 roteiro** de voiceover (roteiro-la-verdad-35s.md)
- **57/59 tasks Done** no Notion (97%)
- **2 tasks restantes** são manuais: infra (hospedagem + pixel) e lançamento (subir campanhas)

## Arquivos chave

### Motion Graphics (HTML → MP4, square + story)
- `el-precio-square-1080x1080.html` / `el-precio-story-1080x1920.html`
- `las-4-fases-square-1080x1080.html` / `las-4-fases-story-1080x1920.html`
- `la-garantia-square-1080x1080.html` / `la-garantia-story-1080x1920.html`
- `la-verdad-square-1080x1080.html` / `la-verdad-story-1080x1920.html`
- `los-numeros-square-1080x1080.html` / `los-numeros-story-1080x1920.html`
- `no-es-tu-culpa-square-1080x1080.html` / `no-es-tu-culpa-story-1080x1920.html`
- `el-espejo-square-1080x1080.html` / `el-espejo-story-1080x1920.html`
- `la-verdad-35s-1080x1080.html` / `la-verdad-35s-1080x1920.html`

### Ads Estáticos Animados (HTML → MP4, square + story)
- `ad-antes-depois`, `ad-hook-frustrada`, `ad-espejo`, `ad-esperanca`, `ad-mama-real`
- `ad-texto-bold`, `ad-texto-abdominales`, `ad-chat-screenshot`

### Carousel
- `carrossel-4-fases/` — 4 cards compactos + 6 individuais, capture scripts

### Pipeline tools
- `record-creative.js` — Puppeteer + FFmpeg HTML→MP4 recorder (31 entries)
- `carrossel-4-fases/capture-cards.js` — Puppeteer PNG capture for carousel
- `roteiro-la-verdad-35s.md` — Script de voiceover para La Verdad 35s

## Decisões tomadas
1. **Fonte Poppins** para toda a marca (substituiu Playfair Display + Inter)
2. **4 cards compactos** no carousel (em vez de 6 individuais) — feedback do Lucas: "12 é muito"
3. **La Verdad 35s** com estrutura em 5 atos para permitir voiceover sincronizado
4. **Parallel recording** com limite de 2-3 Puppeteer simultâneos em 1080px, 1 em 1920px
5. **Brand colors** mantidos: coral #E8837C, mint #7ECEC1, warm white #FFF8F5, dark #0A0A0A/#1A1A1A

## Próximos passos
1. **Comprar hospedagem** para a landing page (task manual do Lucas)
2. **Instalar pixel Facebook** na landing page
3. **Revisar os 33 MP4s** visualmente antes de subir
4. **Subir campanhas no Meta Ads** com os criativos finalizados
5. **Gravar voiceover** usando o roteiro salvo (La Verdad 35s)

## Contexto técnico
- **Stack:** HTML/CSS animado → Puppeteer screenshot/recording → FFmpeg encoding
- **Node.js** com puppeteer para automação de browser
- **FFmpeg** libx264, crf 18, preset slow, yuv420p
- **Formatos:** 1080x1080 (feed/square) e 1080x1920 (stories) — todos os criativos em ambos
- **Notion DB:** `1e7f8404-ef57-8144-b61d-c612e69e3ba2` (projeto Zero Diástasis)
- **Notion Project ID:** `2bbf8404-ef57-80c2-ac43-cb8fa7d189ba`
