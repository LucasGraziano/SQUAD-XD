# /recall - Retomar Contexto de Sessões Anteriores

Carrega checkpoints salvos de sessões anteriores, permitindo retomar o contexto de qualquer conversa em um novo ambiente.

## Uso

```
/recall                  # Lista últimos 10 checkpoints disponíveis
/recall --last           # Carrega o checkpoint mais recente
/recall {slug}           # Carrega checkpoint específico pelo slug
/recall --search {termo} # Busca checkpoints por palavra-chave
```

## Execução

### 1. Identificar modo de operação

Verificar argumentos passados: `$ARGUMENTS`

- Sem argumentos → modo **listagem**
- `--last` → modo **carregar último**
- `--search {termo}` → modo **busca**
- `{slug}` → modo **carregar específico**

### 2. Modo Listagem (default)

Ler todos os arquivos em `.claude/checkpoints/` ordenados por data (mais recente primeiro).

Para cada checkpoint, extrair do frontmatter:
- `date`
- `title`
- `branch`
- `story` (se houver)
- `tags`

Exibir como tabela numerada:

```
📋 Checkpoints Disponíveis

#  | Data       | Título                          | Branch          | Tags
1  | 2026-03-26 | Sistema de Checkpoints          | master          | feature, recall
2  | 2026-03-25 | Landing page AIOX               | feat/landing    | ui, docs
...

💡 Use /recall --last para carregar o mais recente
💡 Use /recall {número} para carregar um específico
```

### 3. Modo Carregar Checkpoint

Ler o arquivo do checkpoint selecionado em `.claude/checkpoints/`.

Apresentar ao usuário:

```
🔄 Checkpoint Restaurado: {title}
📅 Data: {date}
🌿 Branch: {branch}
📖 Story: {story}

## O que foi feito
{resumo das ações}

## Estado quando paramos
{estado do projeto}

## Decisões tomadas
{decisões importantes}

## Próximos passos
{o que falta fazer}

## Contexto técnico
{stack, padrões, dependências relevantes}
```

Após apresentar, perguntar:

> Contexto restaurado! Quer continuar de onde paramos ou precisa de algo diferente?

### 4. Modo Busca

Usar Grep para buscar o termo em todos os arquivos de `.claude/checkpoints/`.

Exibir resultados matching com o mesmo formato da listagem.

### 5. Verificações

- Se não houver checkpoints: mostrar mensagem amigável explicando que ainda não existem checkpoints e que eles são criados automaticamente ou com `/checkpoint`
- Se o slug não existir: sugerir checkpoints com nomes similares

## Notas

- Checkpoints ficam em `.claude/checkpoints/` como arquivos markdown com frontmatter YAML
- São criados automaticamente pelo Orion quando completamos projetos/tarefas significativas
- Podem ser criados manualmente com `/checkpoint`
- O sistema de checkpoint é local ao repositório — funciona em qualquer máquina com acesso ao repo
