# Zero Diastasis — Checklist de Imagens

Todas as imagens devem ser colocadas em `public/images/`.
Formato recomendado: **WebP** (fallback JPEG). Resolução: **2x** para retina.

## CRÍTICAS (Impacto direto em conversão)

### 1. Hero Image
- **Arquivo:** `images/hero-mama.webp`
- **Usado em:** HeroSection.tsx
- **Dimensões:** 1040×1200px (exibe 520×600)
- **Descrição:** Mamá latina (28-42 anos), sorrindo, confiante, roupa casual confortável, ambiente iluminado e quente. Abdômen visível mas discreto — foco na expressão de confiança e bem-estar.
- **Estilo:** Lifestyle editorial, iluminação natural, tons warm. Referência: Ritual vitamins, BetterMe hero shots.
- **NÃO usar:** Fotos de estúdio frias, modelos fitness, before/after clínico.

### 2. Product Mockup
- **Arquivo:** `images/product-mockup.webp`
- **Usado em:** ValueStackSection.tsx
- **Dimensões:** 1400×800px (exibe 700×400)
- **Descrição:** Mockup digital mostrando os 3 entregáveis: iPad com e-book aberto + iPhone com audio-guía player + tracker de progresso impresso. Background transparente ou soft gradient nude/warm.
- **Ferramenta sugerida:** Canva, Smartmockups, ou Figma com mockup plugin.

### 3. Mechanism/Breathing Image
- **Arquivo:** `images/mechanism-breathing.webp`
- **Usado em:** MechanismSection.tsx
- **Dimensões:** 1040×960px (exibe 520×480)
- **Descrição:** Mamá fazendo exercício de respiração suave — deitada ou sentada, olhos fechados, mãos no abdômen. Ambiente doméstico aconchegante, tons warm. Transmitir facilidade e calma.
- **Estilo:** Lifestyle wellness, iluminação suave golden hour.

## ALTA PRIORIDADE (Social proof visual)

### 4-9. Resultados Antes/Depois (3 pares)
- **Diretório:** `images/results/`
- **Usados em:** ResultsSection.tsx
- **Dimensões:** 560×640px cada (exibe 280×320)
- **Arquivos:**
  - `valentina-before.webp` / `valentina-after.webp`
  - `daniela-before.webp` / `daniela-after.webp`
  - `isabella-before.webp` / `isabella-after.webp`
- **Descrição:** Fotos de abdômen com roupas iguais (antes/depois), mesma iluminação, mesma pose. Foco no torso. Respeitar privacidade — sem rostos se preferir.
- **IMPORTANTE:** Se usar fotos de clientes reais, obter consentimento por escrito. Se não disponíveis, usar stock photos com disclaimer ou ilustrações.

## MÉDIA PRIORIDADE (Brand & UI)

### 10. Favicon / App Icon
- **Arquivo:** `public/favicon.ico` + `public/apple-touch-icon.png`
- **Dimensões:** 32×32 (ico), 180×180 (apple-touch)
- **Descrição:** Ícone minimalista — círculos concêntricos em blush (#C97B7B) ou iniciais "ZD" em serif.

### 11. Open Graph / Social Share
- **Arquivo:** `images/og-image.webp`
- **Dimensões:** 1200×630px
- **Descrição:** Card para compartilhar em redes sociais. Logo Zero Diastasis + headline "Tu barriga de mamá NO es gordura" + foto hero. Background warm com gradiente blush.

### 12. Logo (PNG version)
- **Arquivo:** `images/logo.png`
- **Dimensões:** 400×96px
- **Descrição:** Versão PNG do logo para fallback. Já existe SVG em `images/logo.svg`.

## NICE TO HAVE (Elevação premium)

### 13. Protocol Phase Icons (4)
- **Arquivos:** `images/phase-1.svg` ... `images/phase-4.svg`
- **Descrição:** Ícones customizados para cada fase (Desbloqueo, Reconexión, Compresión, Anclaje). Estilo line-art em gold.

### 14. Testimonial Avatars (3)
- **Arquivos:** `images/avatar-maria.webp`, `images/avatar-ana.webp`, `images/avatar-carmen.webp`
- **Dimensões:** 80×80px
- **Descrição:** Fotos de rosto circulares para depoimentos. Se não disponíveis, os atuais avatares com iniciais funcionam bem.

### 15. Background Patterns
- **Arquivo:** `images/pattern-dots.svg`
- **Descrição:** Pattern sutil de pontos ou organic shapes em nude/blush para backgrounds de seções.

---

## Diretrizes Visuais

| Aspecto | Diretriz |
|---------|----------|
| **Tom** | Warm, maternal, empoderador, não clínico |
| **Modelo** | Latina, 28-42 anos, corpo real (não fitness model) |
| **Cores dominantes** | Tons warm (#FFFAF5), nude (#F5E6D3), blush (#D4A5A5) |
| **Iluminação** | Natural, golden hour, suave |
| **NÃO usar** | Stock photos genéricas, tons frios/azuis, modelos extremamente fit |
| **Formato** | WebP primeiro, JPEG fallback, SVG para ícones |
| **Compressão** | WebP quality 80-85%, max 200KB por imagem |

## Onde Produzir

1. **Stock premium:** Pexels, Unsplash (procurar "latina mom", "postpartum wellness", "breathing exercise")
2. **Mockups:** Smartmockups.com, ls.graphics, Canva
3. **Ícones custom:** Figma + export SVG
4. **AI generation:** Midjourney/DALL-E para conceitos (verificar licença comercial)
5. **Produção real:** Sessão fotográfica com mamás reais do programa (ideal)
