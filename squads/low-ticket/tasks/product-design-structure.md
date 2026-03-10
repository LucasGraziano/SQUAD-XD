---
task: Design Product Structure
responsavel: "@product-architect"
responsavel_type: agent
atomic_layer: task
elicit: true
Entrada: |
  - niche: Nicho do produto
  - offer-thesis.md: Tese da oferta
  - format: Formato preferido (ebook, curso, templates, etc.)
  - price: Preço do produto
Saida: |
  - product-blueprint.md: Estrutura completa do produto
  - content-outline.md: Outline detalhado do conteúdo
  - bonus-strategy.md: Estratégia de bônus
Checklist:
  - "[ ] Definir formato ideal baseado no nicho"
  - "[ ] Estruturar módulos/capítulos"
  - "[ ] Definir transformação principal"
  - "[ ] Criar estratégia de bônus"
  - "[ ] Planejar experiência de entrega"
  - "[ ] Submeter para aprovação"
---

# *design-product — Estrutura do Produto

Estrutura o produto e entregável completo.

## Output: product-blueprint.md

```markdown
# Product Blueprint — [Nome do Produto]

## Visão Geral
- **Nome:** [Nome do produto]
- **Formato:** [Ebook / Mini-curso / Templates / Workshop]
- **Preço:** R$[X]
- **Transformação:** "[Estado A] → [Estado B] em [tempo]"
- **Quick Win:** [Resultado rápido que o comprador terá]

## Estrutura do Conteúdo

### Módulo 1: [Nome]
- **Objetivo:** [O que a pessoa aprende/consegue]
- **Formato:** [Vídeo 10min / PDF 15pg / Template]
- **Entregável:** [O que recebe]

### Módulo 2: [Nome]
...

### Módulo 3: [Nome]
...

## Bônus

### Bônus 1: [Nome] — Valor R$[X]
- **O que é:** [Descrição]
- **Por que é valioso:** [Justificativa]
- **Formato:** [PDF / Vídeo / Template]

### Bônus 2: [Nome] — Valor R$[X]
...

## Stack de Valor
| Componente | Valor percebido |
|-----------|----------------|
| Produto principal | R$197 |
| Bônus 1 | R$97 |
| Bônus 2 | R$67 |
| Bônus 3 | R$47 |
| **Total** | **R$408** |
| **Preço real** | **R$27** |
| **Desconto percebido** | **93% off** |

## Experiência de Entrega
- **Acesso:** [imediato após compra]
- **Plataforma:** [área de membros / email / Google Drive]
- **Onboarding:** [primeiro email com instruções]
- **Suporte:** [email / grupo / sem suporte]

## Anti-Reembolso
- Quick win no módulo 1 (resultado rápido = satisfação)
- Bônus entregues imediatamente (valor percebido alto)
- Garantia condicional (completar módulo 1 antes de pedir)
```
