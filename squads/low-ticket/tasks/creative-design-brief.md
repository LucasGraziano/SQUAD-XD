---
task: Create Design Brief
responsavel: "@visual-designer"
responsavel_type: agent
atomic_layer: task
elicit: true
Entrada: |
  - hooks: hooks.md aprovados
  - offer_thesis: offer-thesis.md
  - brand_guidelines: visual-identity.md ou brand-guidelines.md (se existir)
  - type: Tipo da peça (ad, landing-page, pdf, social)
  - format: Formato (imagem, carrossel, story)
Saida: |
  - design-brief.md: Brief completo com specs, referências, paleta, tipografia
  - image-prompts.md: Prompts formatados para IA de imagem (Midjourney/DALL-E/Flux)
Checklist:
  - "[ ] Definir objetivo visual da peça (awareness, conversão, branding)"
  - "[ ] Especificar dimensões e formato (1080x1080, 1080x1920, etc.)"
  - "[ ] Definir paleta de cores (alinhada com marca)"
  - "[ ] Especificar tipografia (títulos e corpo)"
  - "[ ] Descrever composição e hierarquia visual"
  - "[ ] Definir estilo fotográfico ou ilustrativo"
  - "[ ] Incluir referências visuais (moodboard)"
  - "[ ] Gerar prompts para IA de imagem"
  - "[ ] Validar regra dos 20% texto (Meta Ads)"
  - "[ ] Verificar contraste WCAG AA para acessibilidade"
  - "[ ] Submeter brief para aprovação do @creative-director"
---

# *design-brief — Create Design Brief

Cria brief de design completo para qualquer peça visual do squad.

## Uso

```
@visual-designer *design-brief --type ad --format imagem
@visual-designer *design-brief --type landing-page
@visual-designer *design-brief --type pdf
@visual-designer *image-prompts --style realistic --quantity 10
```
