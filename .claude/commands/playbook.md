# /playbook - Consultar ou Gerar Playbooks Operacionais

Playbooks sao frameworks accionaveis gerados de dossiers e experts. Cada playbook e um guia operacional compacto (~800 tokens) que um agente pode usar diretamente.

## Uso

```
/playbook {nome}                  # Consultar playbook existente
/playbook --list                  # Listar todos os playbooks
/playbook --generate {tema}       # Gerar novo playbook de dossier/experts
/playbook --generate {tema} --from {dossier}  # Gerar de dossier especifico
```

## Execucao

### 1. Parsear input

Extrair:
- `action`: consultar (default), listar, ou gerar
- `nome`: slug do playbook
- `from`: dossier fonte (opcional, para geracao)

### 2. Modo --list

Ler `_REGISTRY.yaml` secao `playbooks:` e exibir:

```markdown
📋 Playbooks Disponiveis

| Playbook | Source Dossier | Agentes | Tokens |
|----------|---------------|---------|--------|
| operating-system | process-improvement | pm, commander, sm | ~800 |
| meeting-rhythm | process-improvement | pm, commander | ~800 |
| referral-system | risk-management | analyst, pm | ~800 |
| sales-productivity | offers-pricing | analyst, pm | ~800 |

💡 Use /playbook {nome} para consultar um playbook
💡 Use /playbook --generate {tema} para criar um novo
```

### 3. Modo consultar (default)

1. Verificar se `.aiox-core/knowledge/playbooks/{nome}.md` existe
2. Se existe: ler e exibir o conteudo completo
3. Se nao existe: sugerir playbooks similares ou `/playbook --generate`

### 4. Modo --generate

1. Identificar dossier fonte:
   - Se `--from` fornecido: usar esse dossier
   - Se nao: buscar dossier mais relevante para o tema em `_REGISTRY.yaml`
2. Ler o dossier fonte de `.aiox-core/knowledge/dossiers/`
3. Opcionalmente ler experts adicionais relevantes
4. Gerar playbook no formato abaixo
5. Salvar em `.aiox-core/knowledge/playbooks/{slug}.md`
6. Atualizar `_REGISTRY.yaml` secao `playbooks:`
7. Confirmar

### Formato do Playbook (~800 tokens max)

```markdown
---
playbook: "{Nome do Playbook}"
source_dossier: "{dossier-slug}"
sources: ["{expert1}", "{expert2}"]
agents: ["{agent1}", "{agent2}"]
elements: {count}
date: {YYYY-MM-DD}
---

## Objetivo
{O que este playbook resolve — 1-2 frases}

## Filosofia Core
{Os 2-3 principios fundamentais que guiam este playbook}

## Framework
{Processo step-by-step principal — max 6 steps}

### Step 1: {nome}
{Descricao + como executar}

### Step 2: {nome}
{...}

## Scripts & Templates
{Templates prontos para uso — max 3}

## Heuristicas
{Regras com numeros para tomada de decisao — max 5}

## Timing & Cadencia
{Quando executar cada parte — frequencia, duracao}

## Metricas de Sucesso
{Como saber se esta funcionando — max 3 KPIs}
```

### 5. Confirmacao

```
✅ Playbook {acao}: {nome}
📁 Arquivo: .aiox-core/knowledge/playbooks/{nome}.md
📊 Tokens: ~{contagem}
🤖 Agentes: {lista de agentes que usam}

💡 Agentes com acesso automatico a este playbook via routing.
```

## Notas

- Playbooks sao gerados de dossiers, que sao gerados de experts
- Cadeia: /ingest → experts → /dossier → dossiers → /playbook → playbooks
- Cada playbook deve ser ACCIONAVEL — se nao pode ser executado diretamente, comprima mais
- Token budget: max 800 tokens por playbook
- Playbooks sao carregados sob demanda via `*knowledge playbook:{nome}`
