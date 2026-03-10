---
task: Create Video Specification
responsavel: "@video-editor"
responsavel_type: agent
atomic_layer: task
elicit: true
Entrada: |
  - hooks: hooks.md aprovados
  - scripts: vsl-script.md ou ad scripts
  - offer_thesis: offer-thesis.md
  - type: Tipo do vídeo (ad, ugc, vsl, tutorial, testimonial)
  - duration: Duração alvo (15s, 30s, 60s, 3min)
Saida: |
  - video-script.md: Roteiro completo com timing, visual e áudio
  - editing-spec.md: Guia de edição com cortes, transições, overlays
  - thumbnail-brief.md: Brief de thumbnail (se aplicável)
Checklist:
  - "[ ] Definir hook visual para os primeiros 3 segundos"
  - "[ ] Criar roteiro com timing preciso (segundo a segundo)"
  - "[ ] Especificar B-roll, overlays e text-on-screen"
  - "[ ] Definir trilha sonora / sound design"
  - "[ ] Incluir legendas (80%+ assiste sem som)"
  - "[ ] Especificar formato (9:16 vertical como padrão)"
  - "[ ] Criar 3-5 variações de hook para teste A/B"
  - "[ ] Definir thumbnail (se plataforma exigir)"
  - "[ ] Validar duração para a plataforma (Meta, TikTok, YouTube)"
  - "[ ] Submeter spec para aprovação do @creative-director"
---

# *video-spec — Create Video Specification

Cria roteiro e especificação de edição para vídeos do squad.

## Uso

```
@video-editor *video-script --type ad --duration 30s
@video-editor *editing-spec
@video-editor *thumbnail-brief --platform meta
@video-editor *hook-variations --quantity 5
@video-editor *ugc-guidelines --niche "saúde feminina"
```
