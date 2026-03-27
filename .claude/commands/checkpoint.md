# /checkpoint - Criar Checkpoint de Contexto

Cria um snapshot do contexto atual da conversa para ser retomado posteriormente via `/recall`.

## Uso

```
/checkpoint                    # Cria checkpoint com detecção automática
/checkpoint {título}           # Cria checkpoint com título customizado
/checkpoint --tag {tag1,tag2}  # Cria checkpoint com tags específicas
```

## Execução

### 1. Coletar Contexto Atual

Executar em paralelo:

```bash
# Branch atual e status
git branch --show-current
git status --short

# Últimos commits (para entender o que foi feito)
git log --oneline -5

# Arquivos modificados recentemente
git diff --stat HEAD~3..HEAD
```

### 2. Gerar Conteúdo do Checkpoint

Analisar o contexto da conversa atual e gerar:

**Título:** Usar `$ARGUMENTS` se fornecido, senão gerar automaticamente baseado no trabalho realizado.

**Slug:** Gerar a partir do título (lowercase, hífens, sem acentos). Formato: `YYYY-MM-DD-{slug}.md`

**Conteúdo do arquivo:**

```markdown
---
date: {YYYY-MM-DD}
title: "{título}"
branch: "{branch atual}"
story: "{story ativa, se houver}"
tags: [{tags relevantes}]
last_commit: "{hash do último commit}"
created_by: "orion"
---

## O que fizemos
{Resumo claro e conciso das ações realizadas nesta sessão}

## Estado atual
{Estado do projeto — o que está funcionando, o que está em progresso}

## Arquivos chave
{Lista dos arquivos mais importantes criados/modificados}

## Decisões tomadas
{Decisões técnicas ou de design importantes}

## Próximos passos
{O que deveria ser feito a seguir}

## Contexto técnico
{Stack, padrões, dependências, configurações relevantes para retomar}
```

### 3. Salvar Checkpoint

Salvar o arquivo em `.claude/checkpoints/{YYYY-MM-DD}-{slug}.md`

### 4. Confirmar

Mostrar:

```
✅ Checkpoint criado: {título}
📁 Arquivo: .claude/checkpoints/{filename}
🏷️ Tags: {tags}

💡 Use /recall para retomar este contexto em qualquer sessão futura.
```

## Notas

- Checkpoints são commitáveis — ficam no repo e podem ser acessados de qualquer máquina
- O sistema gera checkpoints automaticamente em pontos-chave, mas este comando permite criação manual
- Tags ajudam na busca via `/recall --search`
- Não há limite de checkpoints, mas mantenha-os relevantes
