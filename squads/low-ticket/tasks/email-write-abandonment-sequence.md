---
task: Write Abandonment Email Sequence
responsavel: "@copywriter"
responsavel_type: agent
atomic_layer: task
elicit: false
Entrada: |
  - email_strategy: email-strategy.md
  - approved_copy: Copy aprovada da oferta
  - offer_thesis: offer-thesis.md (dor, mecanismo, objeções)
Saida: |
  - abandonment-sequence.md: Sequências de abandono (quiz + checkout)
Checklist:
  - "[ ] Sequência abandono de quiz (3 emails: +1h, +24h, +72h)"
  - "[ ] Sequência abandono de checkout (3 emails: +30min, +24h, +48h)"
  - "[ ] Cada email aborda objeção diferente"
  - "[ ] Urgência crescente mas não agressiva"
  - "[ ] Desconto condicional no último email (opcional)"
  - "[ ] Links diretos para retomar o processo"
  - "[ ] Tom empático, não pushy"
---

# *write-abandonment — Write Abandonment Email Sequence

Cria sequências de recuperação para abandono de quiz e checkout.

## Uso

```
@copywriter *write-abandonment
```
