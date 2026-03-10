---
task: Define Offer Thesis
responsavel: "@intel-chief"
responsavel_type: agent
atomic_layer: task
elicit: true
Entrada: |
  - niche: Nicho do produto
  - persona: Descrição do público-alvo
  - research_data: Dados de @research-miner (pains.md, desires.md)
  - competitor_data: Dados de @competitor-analyst (competitor-analysis.md)
Saida: |
  - offer-thesis.md: Tese da oferta validada com dados
Checklist:
  - "[ ] Delegar mineração de dores para @research-miner"
  - "[ ] Delegar análise competitiva para @competitor-analyst"
  - "[ ] Sintetizar dados coletados"
  - "[ ] Definir posicionamento e ângulos"
  - "[ ] Gerar offer-thesis.md"
  - "[ ] Submeter para aprovação do usuário"
---

# *define-thesis — Definir Tese da Oferta

Sintetiza dados de pesquisa de mercado e concorrência em uma tese de oferta validada.

## Uso

```
@intel-chief *define-thesis --niche "emagrecimento" --persona "mulher 30-45"
```

## Processo

1. **Delegar pesquisa** para @research-miner e @competitor-analyst
2. **Coletar outputs:** pains.md, desires.md, language-patterns.md, competitor-analysis.md
3. **Sintetizar** em tese unificada
4. **Apresentar** para aprovação do usuário

## Estrutura do offer-thesis.md

```markdown
# Tese da Oferta — [Nome do Nicho]

## Oportunidade de Mercado
[Resumo da oportunidade identificada]

## Persona
- **Quem:** [descrição demográfica e psicográfica]
- **Situação atual:** [onde estão agora]
- **Onde querem chegar:** [estado desejado]

## Top 10 Dores (por intensidade)
1. "[citação exata]" — Fonte: [comunidade/fórum]
2. ...

## Top 10 Desejos (por urgência)
1. "[citação exata]" — Fonte: [comunidade/fórum]
2. ...

## Linguagem da Persona
- Palavras que usam: [lista]
- Expressões comuns: [lista]
- Tom predominante: [frustrado, esperançoso, etc.]

## Análise Competitiva
| Concorrente | Preço | Formato | Ângulo | GAP |
|-------------|-------|---------|--------|-----|
| ... | ... | ... | ... | ... |

## Ângulos Recomendados
1. **[Ângulo 1]:** [justificativa baseada em dados]
2. **[Ângulo 2]:** [justificativa]
3. **[Ângulo 3]:** [justificativa]

## Posicionamento Sugerido
[Como nos posicionar diferente da concorrência]

## Big Idea
[A grande ideia da oferta em 1-2 frases]
```
