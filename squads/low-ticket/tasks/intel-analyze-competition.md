---
task: Analyze Competition
responsavel: "@competitor-analyst"
responsavel_type: agent
atomic_layer: task
elicit: true
Entrada: |
  - niche: Nicho do produto
  - competitor_urls: URLs de concorrentes (opcional)
Saida: |
  - competitor-analysis.md: Análise competitiva completa
  - swipe-file/: Pasta com referências organizadas
Checklist:
  - "[ ] Identificar 3-5 concorrentes principais"
  - "[ ] Analisar ofertas (preço, formato, bônus)"
  - "[ ] Analisar copy (ângulos, headlines, CTA)"
  - "[ ] Analisar ads na biblioteca de anúncios"
  - "[ ] Identificar GAPs e oportunidades"
  - "[ ] Montar swipe file organizado"
---

# *analyze-competitors — Análise Competitiva

Análise completa dos concorrentes do nicho com swipe file.

## Output: competitor-analysis.md

```markdown
# Análise Competitiva — [Nicho]

## Concorrentes Mapeados

### 1. [Concorrente A]
- **Produto:** [nome, formato]
- **Preço:** R$X
- **Ângulo principal:** [qual ângulo de copy usam]
- **Pontos fortes:** [o que fazem bem]
- **Pontos fracos:** [onde falham]
- **Ads ativos:** [quantidade, tipos]

### 2. [Concorrente B]
...

## Matriz Comparativa

| Aspecto | Conc. A | Conc. B | Conc. C | NOSSO GAP |
|---------|---------|---------|---------|-----------|
| Preço | ... | ... | ... | ... |
| Formato | ... | ... | ... | ... |
| Ângulo | ... | ... | ... | ... |
| Bônus | ... | ... | ... | ... |
| Funil | ... | ... | ... | ... |

## GAPs Identificados
1. [Ninguém está abordando X]
2. [Todos usam formato Y, ninguém usa Z]
3. [Ângulo W não está sendo explorado]

## Oportunidades
1. [Oportunidade baseada em GAP]
2. ...
```
