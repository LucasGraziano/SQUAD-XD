---
task: Mine Audience Pain & Desires
responsavel: "@research-miner"
responsavel_type: agent
atomic_layer: task
elicit: true
Entrada: |
  - niche: Nicho do produto
  - persona: Descrição do público-alvo
  - sources: Fontes para mineração (reddit, quora, forums, social)
Saida: |
  - pains.md: Dores mineradas com citações
  - desires.md: Desejos minerados com citações
  - language-patterns.md: Padrões de linguagem da persona
Checklist:
  - "[ ] Identificar comunidades relevantes"
  - "[ ] Minerar dores com citações diretas"
  - "[ ] Minerar desejos com citações diretas"
  - "[ ] Extrair padrões de linguagem"
  - "[ ] Categorizar por intensidade/urgência"
  - "[ ] Documentar fontes"
---

# *mine-pains / *mine-desires — Mineração de Audiência

Minera dores, desejos e linguagem do público em fontes online.

## Processo

1. **Identificar comunidades** onde a persona está ativa
2. **Buscar posts, comentários e discussões** sobre o tema
3. **Extrair citações diretas** — palavras EXATAS do público
4. **Categorizar** por intensidade e frequência
5. **Documentar** com fonte e contexto

## Fontes de Mineração

| Fonte | O que buscar |
|-------|-------------|
| Reddit | Subreddits do nicho, posts com mais upvotes |
| Quora | Perguntas mais visualizadas sobre o tema |
| YouTube | Comentários em vídeos populares do nicho |
| Amazon | Reviews de livros/produtos do nicho |
| Facebook Groups | Posts com mais engajamento |
| Instagram | Comentários em perfis de referência |
| Twitter/X | Threads e reclamações sobre o tema |

## Output Format

### pains.md
```markdown
# Dores da Persona — [Nicho]

## Intensas (impedem de viver bem)
1. "[citação exata do público]"
   - Fonte: r/subreddit, post XYZ
   - Frequência: Alta (encontrada 15+ vezes)
   - Emoção: Frustração

## Moderadas (incomodam no dia-a-dia)
...

## Leves (irritações menores)
...
```

### desires.md
```markdown
# Desejos da Persona — [Nicho]

## Urgentes (querem resolver AGORA)
1. "[citação exata]"
   - Fonte: ...
   - Frequência: Alta

## Aspiracionais (sonham em alcançar)
...
```
