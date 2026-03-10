---
task: Write Welcome Email Sequence
responsavel: "@copywriter"
responsavel_type: agent
atomic_layer: task
elicit: false
Entrada: |
  - email_strategy: email-strategy.md
  - product_blueprint: product-blueprint.md
  - approved_copy: Copy aprovada (voz, tom, linguagem)
Saida: |
  - welcome-sequence.md: Sequência completa de welcome (3-5 emails)
Checklist:
  - "[ ] Email 1 (D0): Boas-vindas + acesso + primeiro passo"
  - "[ ] Email 2 (D1): Value — tip rápido + motivação"
  - "[ ] Email 3 (D3): Story — conexão emocional"
  - "[ ] Email 4 (D5): Check-in — como está indo"
  - "[ ] Email 5 (D7): Celebração 1ª semana + soft upsell"
  - "[ ] Cada email tem: assunto, preview text, corpo, CTA"
  - "[ ] Tom consistente com a marca"
  - "[ ] Personalização (nome) em todos os emails"
  - "[ ] Link de unsubscribe em todos"
---

# *write-welcome — Write Welcome Email Sequence

Cria a sequência de welcome (boas-vindas) para novos compradores.

## Uso

```
@copywriter *write-welcome
```
