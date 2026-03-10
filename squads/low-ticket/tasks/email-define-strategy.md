---
task: Define Email Strategy
responsavel: "@copy-chief"
responsavel_type: agent
atomic_layer: task
elicit: true
Entrada: |
  - offer_thesis: offer-thesis.md
  - product_blueprint: product-blueprint.md
  - persona: Dados da persona da oferta
Saida: |
  - email-strategy.md: Estratégia completa de email (segmentos, sequências, timing, métricas)
Checklist:
  - "[ ] Definir segmentos de audiência (buyers, leads, abandonos)"
  - "[ ] Mapear jornada do cliente (pré-compra, compra, pós-compra)"
  - "[ ] Definir sequências necessárias (welcome, nurture, abandono, upsell, reativação)"
  - "[ ] Definir frequência e timing de cada sequência"
  - "[ ] Definir métricas target (open rate, click rate, conversão)"
  - "[ ] Alinhar com escada de valor (quando oferecer cada produto)"
  - "[ ] Definir tom de voz e guidelines de copy para emails"
  - "[ ] Submeter estratégia para aprovação"
---

# *email-strategy — Define Email Strategy

Define a estratégia completa de email marketing para a oferta, incluindo segmentação, sequências, timing e métricas.

## Uso

```
@copy-chief *email-strategy
```

## Output: email-strategy.md

Documento com:
- Mapa de segmentos e sequências
- Timing e frequência por sequência
- Jornada do cliente email-mapped
- Métricas target por sequência
- Guidelines de copy
- Integração com escada de valor
