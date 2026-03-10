---
task: Create Ad Creatives
responsavel: "@creative-director"
responsavel_type: agent
atomic_layer: task
elicit: true
Entrada: |
  - hooks.md: Hooks aprovados
  - scripts/: Roteiros aprovados
  - visual-identity.md: Identidade visual (se existir)
  - platform: Plataforma (meta, google, tiktok)
Saida: |
  - creative-briefs/: Briefings por criativo
  - ad-prompts/: Prompts para AI art
  - visual-identity.md: Identidade visual (se não existia)
Checklist:
  - "[ ] Definir identidade visual (se necessário)"
  - "[ ] Criar briefings de criativos estáticos"
  - "[ ] Criar briefings de criativos em vídeo"
  - "[ ] Gerar prompts para AI art"
  - "[ ] Adaptar formatos por plataforma"
---

# *create-ad-visuals — Criativos de Ads

Gera briefings completos e prompts de AI art para criativos de anúncios.

## Output

### creative-briefs/ (por criativo)

```markdown
# Creative Brief #1 — [Nome]

**Tipo:** Estático / Carrossel / Vídeo
**Plataforma:** Meta (Feed + Stories)
**Tamanho:** 1080x1080 (feed) + 1080x1920 (stories)

**Hook visual:** [O que deve capturar atenção]
**Texto overlay:** "[Headline do hook]"
**CTA visual:** [Botão, seta, etc.]

**Elementos:**
- Fundo: [cor/textura/imagem]
- Texto: [fonte, tamanho, cor]
- Imagem principal: [descrição]
- Badge: [desconto, garantia, etc.]

**Referências:** [links de inspiração do swipe file]
```

### ad-prompts/ (para AI art)

```markdown
# AI Art Prompt #1

**Tool:** Midjourney v6
**Prompt:** "Professional product mockup, [produto] floating on gradient background, soft shadows, clean modern design, golden accents, 4K quality --ar 1:1 --v 6 --s 750"
**Negative:** "text, watermark, blurry, low quality"

**Variations:**
- v1: Background azul escuro (confiança)
- v2: Background vermelho (urgência)
- v3: Background verde (resultado)
```
