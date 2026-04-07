# Agent Memory — *remember / *recall / *forget

Sistema de memória persistente para agentes AIOX. Permite que agentes lembrem decisões, preferências e contexto entre sessões.

## Comandos

Dentro de qualquer agente ativo (@copy-chief, @atlas, etc.):

```
*remember {tipo} {conteúdo}     # Salvar uma memória
*recall                          # Ver memórias do agente atual
*recall --project {nome}         # Filtrar por projeto
*forget {filename}               # Remover uma memória
```

### Tipos de memória

| Tipo | Retenção | Auto-load | Exemplo |
|------|----------|-----------|---------|
| `decision` | 90 dias | Sim | "Decidimos usar Poppins como fonte padrão para Zero Diastasis" |
| `preference` | Permanente | Sim | "Lucas prefere respostas diretas sem resumo no final" |
| `context` | 30 dias | Não | "Budget atual de ads é $4.20/dia, campanha broad LATAM" |
| `lesson` | Permanente | Sim | "Puppeteer em 1920px: máximo 1 instância simultânea" |

## Execução de *remember

### 1. Identificar agente ativo
O agente que está ativo no momento é o dono da memória.

### 2. Parsear input
```
*remember decision Decidimos usar preço de $19.90 com bump de $4
         ^^^^^^^^ ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
         tipo     conteúdo
```

### 3. Salvar memória

Criar arquivo em `.aiox/memory/{agent-id}/{date}-{type}-{slug}.md`:

```markdown
---
type: {tipo}
title: "{título extraído do conteúdo}"
agent: {agent-id}
date: {YYYY-MM-DD}
project: "{projeto ativo, se houver}"
tags: [{tags relevantes}]
retention: {dias ou -1}
---

{conteúdo completo}
```

### 4. Confirmar
```
💾 Memória salva: {título}
📁 .aiox/memory/{agent-id}/{filename}
🏷️ Tipo: {tipo} | Retenção: {dias}d
```

## Execução de *recall

### 1. Ler memórias do agente

Ler todos os arquivos em `.aiox/memory/{agent-id}/`, filtrar por:
- Tipo `loadOnActivation: true` (decision, preference, lesson)
- Não expirados (checar retenção)
- Se `--project` fornecido, filtrar por projeto

### 2. Exibir

```markdown
🧠 Memórias de {agent-name} ({total} ativas)

### Decisões
- [{date}] {título} — {resumo 1 linha}

### Preferências
- {título} — {resumo 1 linha}

### Lições
- {título} — {resumo 1 linha}
```

## Execução de *forget

### 1. Localizar arquivo
Buscar `{filename}` em `.aiox/memory/{agent-id}/`.

### 2. Confirmar e remover
Deletar o arquivo e confirmar:
```
🗑️ Memória removida: {filename}
```

## Auto-load na ativação

Quando um agente é ativado via `@agent-name`:
1. Checar se `.aiox/memory/{agent-id}/` existe
2. Se sim, carregar memórias com `loadOnActivation: true`
3. Apresentar resumo compacto: "🧠 {N} memórias carregadas"
4. Token budget: máximo 2000 tokens de memória por ativação

## Notas

- Memórias são por AGENTE, não globais
- O commander (@atlas) tem acesso de leitura a TODOS os agentes
- Memórias expiradas são removidas automaticamente (pruning)
- Máximo 50 memórias por agente
- Diretório: `.aiox/memory/` (gitignored por padrão — memórias são locais)
