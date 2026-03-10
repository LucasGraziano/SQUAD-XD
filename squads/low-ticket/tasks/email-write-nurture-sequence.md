---
task: Write Nurture Email Sequence
responsavel: "@copywriter"
responsavel_type: agent
atomic_layer: task
elicit: false
Entrada: |
  - email_strategy: email-strategy.md
  - product_blueprint: product-blueprint.md (estrutura do protocolo/produto)
  - value_ladder: Escada de valor da oferta
Saida: |
  - nurture-sequence.md: Sequência de acompanhamento (D7-D28+)
Checklist:
  - "[ ] Emails de acompanhamento do protocolo/produto (1 por milestone)"
  - "[ ] Check-ins nos pontos-chave (D7, D14, D21, D28)"
  - "[ ] Upsells contextuais nos momentos certos"
  - "[ ] Solicitação de depoimento (D21)"
  - "[ ] Celebração de conclusão (D28)"
  - "[ ] Oferta de continuidade/manutenção pós-protocolo"
  - "[ ] Cada email alinhado com o momento do cliente no produto"
  - "[ ] Social proof integrada naturalmente"
---

# *write-nurture — Write Nurture Email Sequence

Cria a sequência de nurture que acompanha o cliente durante o uso do produto.

## Uso

```
@copywriter *write-nurture
```
