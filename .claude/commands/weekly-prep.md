# /weekly-prep - Preparar Pauta da Weekly com Cabral

Gera automaticamente a pauta da weekly de segunda-feira (20-21h) baseada nas tasks do Notion e no estado do projeto.

## Uso

```
/weekly-prep          # Gerar pauta completa
```

## Execução

### 1. Carregar contexto

```
C:\Users\Graziano\.claude\projects\D--SQUAD-XD\memory\project_launch_zero_diastase.md
C:\Users\Graziano\.claude\projects\D--SQUAD-XD\memory\user_lucas_profile.md
```

### 2. Puxar tasks do Notion

Mesmo query do atlas-briefing — todas as tasks do Projeto GC que não estão Done.

```bash
curl -s -X POST "https://api.notion.com/v1/databases/1e7f8404-ef57-8144-b61d-c612e69e3ba2/query" \
  -H "Authorization: Bearer <NOTION_TOKEN_FROM_.mcp.json>" \
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

### 3. Classificar tasks por responsável

- **Tasks do Lucas:** Criativos, ads, tracking, infra
- **Tasks do Cabral:** Quiz, TSL, entregáveis, checkout

### 4. Gerar pauta

```markdown
╔══════════════════════════════════════════════════════════╗
║  📋 PAUTA WEEKLY — {data} (Seg 20-21h)                  ║
║  Tempo: 60 min MAX | Pauta fixa, sem tangentes          ║
╠══════════════════════════════════════════════════════════╣

## 1. Check-in rápido (5 min)
- Como foi a semana?
- Algum blocker urgente?

## 2. Status das entregas (15 min)

### Lucas (Operação/Criativos):
{Lista de tasks do Lucas com status}
- ✅ Concluído: {lista}
- 🔄 Em progresso: {lista}
- ❌ Não iniciado: {lista}

### Cabral (Oferta/Funil):
{Lista de tasks do Cabral com status}
- Quiz: {status — X% pronto? Traduzido ES?}
- TSL/Sales Page: {status}
- Entregáveis (PDFs/áudios): {status}
- Checkout: {status}

## 3. Blockers e dependências (10 min)
{Lista de dependências cruzadas}
- Ex: "Lucas não pode configurar pixel sem hospedagem"
- Ex: "Ads não adianta sem quiz funcional"

## 4. Decisões necessárias (15 min)
{Perguntas que precisam de resposta dos dois}
- Plataforma de checkout: Kiwify ou LastLink?
- Quiz: usar Typeform ou custom?
- Budget de ads: confirmar R$600?

## 5. Plano da próxima semana (10 min)
{Proposta de divisão de tarefas para a semana}

### Lucas foca em:
{top 3 tasks}

### Cabral foca em:
{top 3 tasks}

## 6. Compromisso de entrega (5 min)
- Lucas entrega: {item} até {data}
- Cabral entrega: {item} até {data}

╚══════════════════════════════════════════════════════════╝
— Gerado por Atlas | Tempo total: 60 min
```

### 5. Regras

- **Tempo fixo:** 60 min máximo (conforme Plano de Guerra: "Meetings Are Toxic")
- **Pauta fixa:** Não sair dos tópicos
- **Ação:** Cada tópico termina com compromisso concreto
- **Tom:** Direto, sem rodeios
- **Enviar para Cabral:** Oferecer copiar pauta para WhatsApp/Discord

---
*AIOX Productivity — Weekly Prep Command*
