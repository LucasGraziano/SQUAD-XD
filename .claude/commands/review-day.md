# /review-day - Fechamento de Sessão

Fecha a sessão de trabalho: atualiza tasks no Notion, gera log do que foi feito, e prepara o contexto para a próxima sessão.

## Uso

```
/review-day           # Fechamento completo
```

## Execução

### 1. Perguntar ao usuário

Antes de atualizar qualquer coisa:

```
🎖️ Fechamento de sessão — {data}

O que você completou hoje?
(Liste as tasks ou diga "nada" se não completou nenhuma)
```

### 2. Atualizar tasks no Notion

Para cada task que o usuário confirmar como concluída:

```bash
curl -s -X PATCH "https://api.notion.com/v1/pages/{task_id}" \
  -H "Authorization: Bearer <NOTION_TOKEN>" \
  -H "Notion-Version: 2022-06-28" \
  -H "Content-Type: application/json" \
  -d '{"properties": {"Status": {"status": {"name": "Done"}}}}'
```

### 3. Gerar log da sessão

```markdown
╔══════════════════════════════════════════════════════════╗
║  📝 LOG DE SESSÃO — {data} ({dia semana})                ║
║  Janela: {horário início} - {horário fim}                ║
╠══════════════════════════════════════════════════════════╣

## Concluído hoje
{lista de tasks marcadas como Done}

## Em progresso (continua amanhã)
{tasks que ficaram em Doing}

## Blockers encontrados
{problemas que surgiram durante a sessão}

## Próxima sessão ({próximo dia útil})
Task prioritária: {próxima task pela ordem do Notion}

╚══════════════════════════════════════════════════════════╝
```

### 4. Salvar log

Salvar em `.claude/logs/session-{YYYY-MM-DD}.md`

Criar diretório `.claude/logs/` se não existir.

### 5. Atualizar custos (se aplicável)

Se durante a sessão o usuário usou ferramentas pagas, perguntar:
- "Usou ElevenLabs, HeyGen ou outro serviço pago hoje?"
- Se sim, atualizar `.claude/tracking/ai-costs.json`

---
*AIOX Productivity — Session Review Command*
