---
date: 2026-03-30
title: "Zero Diastase — Criativos completos com Poppins + 10 MP4s"
branch: "master"
story: ""
tags: [creatives, zero-diastase, ads, mp4, poppins]
last_commit: "e759826"
created_by: "atlas"
---

## O que fizemos

### Sessao anterior (contexto restaurado)
- Criamos 5 ads HTML estaticos com imagens AI (Gemini) para Zero Diastasis
- Layouts: antes-depois (fullscreen), hook-frustrada (dark cinematic), espejo (split panel), esperanca (image+card), mama-real (bubbles)
- Criamos 5 versoes stories (1080x1920) de cada ad
- Geramos prompts para Gemini, usuario salvou 5 imagens PNG (~2.7MB cada)
- Pipeline record-creative.js (Puppeteer + FFmpeg) para HTML -> MP4

### Sessao atual
- Migracaa de fonte: Playfair Display + Inter -> **Poppins** em todos os 10 arquivos HTML
- Fix layout **ad-esperanca** (square + stories): imagem maior (60%->72% square, 50%->58% stories), card mais compacto, sem espaco branco
- Regravacao de todos os **10 MP4s** (5 square 1080x1080 + 5 stories 1080x1920) com 20s/30fps

## Estado atual
- 10 HTML ads prontos com fonte Poppins
- 10 MP4s gravados e prontos para upload
- Todos os ads com ~20s de duracao, animacoes CSS suaves
- CTA arrow com nudge 3s (lento, natural)
- Shine effect 4s no botao CTA

## Arquivos chave

### HTML (10 arquivos)
- `squads/low-ticket/projects/zero-diastase/creatives/ad-antes-depois-1080x1080.html`
- `squads/low-ticket/projects/zero-diastase/creatives/ad-hook-frustrada-1080x1080.html`
- `squads/low-ticket/projects/zero-diastase/creatives/ad-espejo-1080x1080.html`
- `squads/low-ticket/projects/zero-diastase/creatives/ad-esperanca-1080x1080.html`
- `squads/low-ticket/projects/zero-diastase/creatives/ad-mama-real-1080x1080.html`
- `squads/low-ticket/projects/zero-diastase/creatives/ad-antes-depois-1080x1920.html`
- `squads/low-ticket/projects/zero-diastase/creatives/ad-hook-frustrada-1080x1920.html`
- `squads/low-ticket/projects/zero-diastase/creatives/ad-espejo-1080x1920.html`
- `squads/low-ticket/projects/zero-diastase/creatives/ad-esperanca-1080x1920.html`
- `squads/low-ticket/projects/zero-diastase/creatives/ad-mama-real-1080x1920.html`

### MP4s (10 arquivos, 1-1.9MB cada)
- Mesmos nomes acima com extensao .mp4

### Imagens AI (5 PNGs, ~2.7MB cada)
- `img-antes-depois.png` — split antes/depois
- `img-sofia-frustrada.png` — mulher frustrada na cama
- `img-sofia-esperanca.png` — mulher fazendo yoga
- `img-espelho.png` — mulher no espelho
- `img-mama-real.png` — mae com filho na cozinha

### Pipeline
- `record-creative.js` — gravador Puppeteer+FFmpeg (suporta filtro por nome)
- `record-stories.js` — wrapper sequencial para stories

## Decisoes tomadas
- Poppins como fonte unica (substituiu Playfair Display para headlines + Inter para body)
- Imagem do esperanca ampliada para 72% (square) / 58% (stories) para eliminar espaco branco
- Stories gravados 2 em paralelo max (1920px consome mais memoria que 1080px)
- Cada MP4 com 20s duracao, 30fps, CRF 18 (alta qualidade)
- CTA nudge arrow 3s, shine 4s (ritmo lento e natural)

## Proximos passos
- Revisar qualidade visual de cada MP4 (abrir e verificar)
- Subir MP4s para Meta Ads Manager
- Ads texto-only antigos (7 arquivos) podem ser regravados com Poppins se necessario
- Considerar criar mais variantes (novos angulos, testimonials, UGC-style)
- Configurar campanhas no Meta Ads (ABO ou CBO)

## Contexto tecnico
- Stack: HTML/CSS puro + Puppeteer + FFmpeg
- Fonte: Google Fonts Poppins (400-900)
- Cores brand: coral #E8837C, mint #7ECEC1, warm white #FFF8F5
- Imagens: Gemini AI generated, ~2.7MB PNG cada
- Pipeline: `node record-creative.js {filtro}` grava MP4 de qualquer HTML
- Mercado: LATAM hispanico, idioma espanhol neutro, preco $19.90 USD
