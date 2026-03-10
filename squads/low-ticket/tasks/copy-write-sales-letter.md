---
task: Write Sales Letter
responsavel: "@copywriter"
responsavel_type: agent
atomic_layer: task
elicit: true
Entrada: |
  - offer-thesis.md: Tese da oferta
  - product-blueprint.md: Estrutura do produto
  - voice-guide.md: Guia de voz (opcional)
  - hooks.md: Hooks aprovados
Saida: |
  - sales-letter.md: Carta de vendas completa
Checklist:
  - "[ ] Ler offer-thesis.md e product-blueprint.md"
  - "[ ] Selecionar ângulo principal"
  - "[ ] Escrever headline + sub-headline"
  - "[ ] Escrever lead (abertura)"
  - "[ ] Escrever corpo (problema → agitação → solução)"
  - "[ ] Incluir provas e depoimentos"
  - "[ ] Apresentar oferta e bônus"
  - "[ ] Escrever CTA e urgência"
  - "[ ] Submeter para revisão do @copy-chief"
---

# *write-sales-letter — Carta de Vendas

Escreve carta de vendas completa baseada na tese da oferta.

## Estrutura da Sales Letter

```markdown
# [HEADLINE PRINCIPAL]
## [Sub-headline que complementa]

### Lead (Abertura)
[Hook que conecta com a dor/desejo principal da persona]
[Identificação — "Se você é X e está passando por Y..."]

### Problema
[Amplifica a dor — usa citações diretas do language-patterns.md]
[Mostra que entende profundamente o problema]

### Agitação
[Consequências de não resolver]
[Urgência natural — o que piora com o tempo]

### Solução
[Apresenta a transformação possível]
[Introduz o produto como veículo da transformação]

### Mecanismo
[Explica POR QUE funciona — diferencial único]
[Credibilidade — por que isso é diferente]

### Prova
[Depoimentos, resultados, números]
[Screenshots, antes/depois]

### Oferta
[Nome do produto]
[O que está incluso]
[Valor de cada componente]

### Bônus
[Bônus 1 — valor R$X]
[Bônus 2 — valor R$Y]
[Stack total de valor]

### Preço
[Ancoragem de preço]
[Preço real]
[Justificativa do valor]

### Garantia
[Tipo de garantia (7, 15, 30 dias)]
[Reversão de risco]

### CTA
[Chamada para ação clara e urgente]
[Botão de compra]

### FAQ
[3-5 perguntas que quebram objeções]

### Fechamento
[Último apelo emocional]
[CTA final]
```
