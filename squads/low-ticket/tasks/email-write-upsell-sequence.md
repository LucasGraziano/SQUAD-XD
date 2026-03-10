---
task: Write Upsell & Reactivation Email Sequences
responsavel: "@copywriter"
responsavel_type: agent
atomic_layer: task
elicit: false
Entrada: |
  - email_strategy: email-strategy.md
  - value_ladder: Escada de valor completa
  - product_blueprint: product-blueprint.md
Saida: |
  - upsell-sequence.md: Emails de upsell por produto da escada
  - reactivation-sequence.md: Sequência de reativação para inativos
Checklist:
  - "[ ] Email de upsell para cada produto da escada de valor"
  - "[ ] Timing alinhado com milestones do produto principal"
  - "[ ] Sequência de reativação para compradores inativos (D35+)"
  - "[ ] Conteúdo de valor gratuito intercalado com ofertas"
  - "[ ] Segmentação: quem já comprou upsell X não recebe oferta de X"
  - "[ ] Soft offer approach (não hard sell)"
---

# *write-upsell — Write Upsell & Reactivation Sequences

Cria sequências de upsell e reativação para maximizar LTV.

## Uso

```
@copywriter *write-upsell
```
