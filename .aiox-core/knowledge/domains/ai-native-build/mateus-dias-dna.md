---
expert: mateus-dias
domain: ai-native-build
dna_version: v3
tokens: 580
updated: 2026-04-29
source: "Transcrição: Claude Code para Empreendedores (Mateus Dias)"
---

# Mateus Dias — DNA v3

## L1: Filosofias Fundamentais

1. **Agente é um sistema, não uma ferramenta** — Claude Code não é você usando IA. É uma estrutura que funciona sem você. A diferença entre um usuário e um operador é que o operador constrói infraestrutura.

2. **CLAUDE.md como contrato** — O arquivo CLAUDE.md é o contrato do sistema. Sem ele, o agente é genérico. Com ele específico e rico, o agente é um especialista do seu contexto.

3. **Planejamento antes de execução** — 10 tokens de plano evitam 500 tokens de correção. Plan Mode é o hábito mais barato com maior ROI.

## L2: Modelos Mentais

- **22 Agentes = 22 Departamentos**: cada agente tem escopo, responsabilidade e persona definidos. Agente sem escopo = agente ineficiente.
- **8 Squads**: grupos de agentes por vertical (produto, marketing, ops, etc.). Squads permitem paralelismo.
- **Hierarquia cognitiva**: Opus orquestra → Sonnet implementa → Haiku executa tarefas simples. Modelo certo para complexidade certa = 3-10x mais barato.
- **Context hygiene como disciplina**: /clear entre tarefas é mais barato que compactação reativa.

## L3: Heurísticas Operacionais

1. **Plan Mode 90% do tempo** — Shift+Tab no terminal antes de executar qualquer tarefa não trivial
2. **/clear entre tarefas** — Ao mudar de contexto, limpar. Contexto sujo = respostas piores + gasto maior
3. **Subagentes para tarefas independentes** — Não poluir o contexto principal com trabalho paralelo
4. **CLAUDE.md específico, não genérico** — Incluir: stack, squads ativos, padrões de código, convenções
5. **Testar sem confirmar primeiro** — Plan Mode mostra o que vai acontecer antes de executar

## L4: Frameworks Práticos

### Framework: 8-Squad Architecture
```
Squad 1: Produto (dev, qa, architect)
Squad 2: Marketing (copy, design, tráfego)
Squad 3: Operacional (processos, documentação)
Squad 4: Dados (analytics, BI)
Squad 5: Infraestrutura (devops, deploy)
Squad 6: Pesquisa (competitor, market research)
Squad 7: Financeiro (custos, projeções)
Squad 8: Conteúdo (blog, social, SEO)
```

### Framework: Plan Mode Protocol
```
1. Shift+Tab → entrar em Plan Mode
2. Descrever a tarefa completa
3. Revisar o plano proposto
4. Identificar riscos ou gaps
5. Aprovar → executar
```

## L5: Metodologias Avançadas

**Método: Operador AI-Native**
O operador AI-native não usa Claude Code para tarefas isoladas.
Ele constrói um sistema que:
- Persiste entre sessões (CLAUDE.md + memory)
- Acumula conhecimento (knowledge layer)
- Melhora com cada projeto (dossiers)
- Executa em paralelo (squads + background agents)
- Tem custo controlado (context hygiene + model hierarchy)

A diferença para o usuário médio:
- Usuário: abre Claude Code, digita um pedido, obtém um resultado
- Operador: o sistema trabalha enquanto o operador pensa estratégia
