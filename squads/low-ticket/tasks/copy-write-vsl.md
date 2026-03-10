---
task: Write VSL Script
responsavel: "@script-writer"
responsavel_type: agent
atomic_layer: task
elicit: true
Entrada: |
  - offer-thesis.md: Tese da oferta
  - product-blueprint.md: Estrutura do produto
  - hooks.md: Hooks aprovados
  - duration: Duração do VSL (default: 10min)
Saida: |
  - vsl-script.md: Roteiro completo com direções de câmera
Checklist:
  - "[ ] Selecionar hook de abertura"
  - "[ ] Escrever roteiro com timestamps"
  - "[ ] Incluir direções visuais"
  - "[ ] Incluir pontos de retenção"
  - "[ ] Submeter para revisão do @copy-chief"
---

# *write-vsl — Roteiro de VSL

Cria roteiro completo de Video Sales Letter com direções de câmera.

## Estrutura do VSL

```markdown
# VSL Script — [Nome da Oferta]
## Duração estimada: [X] minutos
## Formato: [Talking head / Slides / Hybrid]

---

### [00:00 - 00:03] HOOK
🎬 Direção: Close-up, olhar direto para câmera
📝 "[Hook principal — scroll-stop em 3 segundos]"

### [00:03 - 00:30] IDENTIFICAÇÃO
🎬 Direção: Medium shot, tom conversacional
📝 "Se você é [persona] e já tentou [X] sem sucesso..."
📝 "Então os próximos [X] minutos podem mudar tudo."

### [00:30 - 02:00] PROBLEMA
🎬 Direção: Slides com dados / B-roll
📝 [Amplifica dores usando linguagem exata do público]
🔄 Re-hook aos 45s: "[frase de retenção]"

### [02:00 - 04:00] AGITAÇÃO + MECANISMO
🎬 Direção: Retorna para talking head
📝 [Por que soluções comuns falham]
📝 [Introduz o mecanismo único]
🔄 Re-hook aos 3min: "[frase de retenção]"

### [04:00 - 06:00] SOLUÇÃO + PROVA
🎬 Direção: Slides com resultados / Screenshots
📝 [Apresenta a solução]
📝 [Mostra provas e resultados]
🔄 Re-hook aos 5min: "[frase de retenção]"

### [06:00 - 08:00] OFERTA
🎬 Direção: Slides com stack visual
📝 [Apresenta o produto]
📝 [Stack de valor com preços âncora]
📝 [Bônus um a um]

### [08:00 - 09:00] PREÇO + GARANTIA
🎬 Direção: Talking head, tom confiante
📝 [Revela preço com ancoragem]
📝 [Garantia de X dias]

### [09:00 - 10:00] CTA + FECHAMENTO
🎬 Direção: Close-up, urgência natural
📝 [Chamada para ação clara]
📝 [Último apelo emocional]
📝 [CTA final]

---
## Notas de Produção
- Pontos de corte: [timestamps para edição]
- Músicas sugeridas: [mood/estilo]
- Elementos visuais: [lista de slides/B-roll necessários]
```
