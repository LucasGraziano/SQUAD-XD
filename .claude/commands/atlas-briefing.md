# /atlas-briefing - Briefing Operacional Diário

Gera um briefing operacional completo para o Lucas, mostrando exatamente o que fazer nas horas disponíveis hoje.

## Uso

```
/atlas-briefing           # Briefing completo (default)
/atlas-briefing --compact # Versão resumida
```

## Execução

### 1. Carregar contexto

Ler os seguintes arquivos/fontes:

```
# Memórias do projeto
C:\Users\Graziano\.claude\projects\D--SQUAD-XD\memory\user_lucas_profile.md
C:\Users\Graziano\.claude\projects\D--SQUAD-XD\memory\project_launch_zero_diastase.md

# Projeto ativo
squads/low-ticket/projects/zero-diastase/briefing.md
```

### 2. Puxar tasks do Notion

Usar curl para consultar o Notion (token em `~/.claude/.mcp.json` campo `NOTION_TOKEN`):

```bash
# Tasks do Projeto GC que não estão Done, ordenadas por due
curl -s -X POST "https://api.notion.com/v1/databases/1e7f8404-ef57-8144-b61d-c612e69e3ba2/query" \
  -H "Authorization: Bearer <NOTION_TOKEN>" \
  -H "Notion-Version: 2022-06-28" \
  -H "Content-Type: application/json" \
  -d '{
    "filter": {"and": [
      {"property": "Status", "status": {"does_not_equal": "Done"}},
      {"property": "Project", "relation": {"contains": "2bbf8404-ef57-80c2-ac43-cb8fa7d189ba"}}
    ]},
    "sorts": [{"property": "Due", "direction": "ascending"}]
  }'
```

Extrair de cada task: Name, Status, Priority, Due date.

### 3. Calcular contexto temporal

```
- Data de hoje (da system date)
- Dia da semana
- Dias até lançamento (2026-03-29)
- Janela de trabalho: 20:15-22:15 (2h) se dia útil, tarde inteira se fds
- Energia do dia: Seg/Ter = alta, Qua = média, Qui/Sex = baixa, Fds = variável
```

### 4. Classificar tasks

Para cada task do Notion:
- **HOJE**: Due date = hoje
- **ATRASADA**: Due date < hoje e Status != Done
- **PRÓXIMA**: Due date = amanhã ou depois
- **SEM DATA**: Sem due date (potencial risco)

### 5. Gerar briefing visual

```markdown
╔══════════════════════════════════════════════════════════╗
║  🎖️ ATLAS BRIEFING — {data formatada}                   ║
║  {dia da semana} | Energia: {nível} | Janela: {horário}  ║
╠══════════════════════════════════════════════════════════╣

## 📍 ONDE ESTAMOS
- Dias até lançamento: {N}
- Tasks concluídas: {done} / {total}
- Progresso: ████████░░░░░░░░ {percentual}%

## 🔥 FAZER HOJE ({data})
{Lista de tasks com due = hoje, formatadas como checklist}

## ⚠️ ATRASADAS
{Tasks com due < hoje, se houver}

## 📋 PRÓXIMOS DIAS
{Tasks futuras, agrupadas por dia}

## 🚧 BLOCKERS
{Dependências não resolvidas, ex: "Quiz do Cabral: status?"}
{Tasks sem data que são pré-requisitos}

## 🎯 FOCO DA SESSÃO
> Em 2h, o que vai mover mais a agulha é: {recomendação}

╚══════════════════════════════════════════════════════════╝
— Atlas, coordenando operações 🎖️
```

### 6. Regras do briefing

- **Tom:** Direto, técnico, sem enrolação (perfil do Lucas)
- **Prioridade:** Sempre recomendar UMA tarefa principal para a sessão
- **Realismo:** Se há blockers que impedem progresso, ser honesto
- **Cabral check:** Sempre incluir status das dependências do Cabral
- **Compliance:** Nunca sugerir tasks de L1/L2 (framework protected)

### 7. Modo --compact

Se `--compact`, mostrar apenas:

```
🎖️ ATLAS | {data} | {dias} dias para launch
🔥 HOJE: {task principal}
⚠️ BLOCKER: {se houver}
🎯 FOCO: {recomendação em 1 linha}
```

---
*Atlas Briefing — Low-Ticket Squad Command*
