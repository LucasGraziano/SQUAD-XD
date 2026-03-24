# /custos - Dashboard de Gastos com IAs

Mostra um dashboard consolidado de todos os serviços de IA que o Lucas usa, com custos estimados e limites gratuitos.

## Uso

```
/custos              # Dashboard completo
/custos --mes        # Resumo do mês atual
```

## Execução

### 1. Carregar registro de custos

Ler o arquivo de tracking:

```
.claude/tracking/ai-costs.json
```

Se não existir, criar com a estrutura base (ver seção 4).

### 2. Verificar usage da API Anthropic

```bash
# Checar plano e usage atual (se disponível)
# O Lucas usa Claude Code via Max subscription
```

### 3. Gerar dashboard

```markdown
╔══════════════════════════════════════════════════════════╗
║  💰 DASHBOARD DE CUSTOS IA — {mês/ano}                  ║
╠══════════════════════════════════════════════════════════╣

## Serviços Ativos

| Serviço | Plano | Custo/mês | Uso este mês | Status |
|---------|-------|-----------|-------------|--------|
| Claude Code | Max | $100/mês (ou $200) | {sessões} sessões | ✅ Ativo |
| ElevenLabs | Free | $0 | {chars}/10.000 chars | {status} |
| Veo 3 | Free (Google AI Studio) | $0 | {videos} vídeos | {status} |
| Canva | Pro (se tiver) | R${valor} | — | {status} |
| Notion | Free | $0 | — | ✅ |
| HeyGen | Free trial | $0 | {credits} créditos | {status} |

## Resumo Financeiro

| Métrica | Valor |
|---------|-------|
| Total fixo/mês | R${total} |
| Budget ads (teste) | R$600 |
| Receita até agora | R$0 (pré-launch) |
| Break-even estimado | {cálculo} vendas |

## Limites Gratuitos para Maximizar

| Serviço | Limite Free | Dica |
|---------|------------|------|
| ElevenLabs | 10.000 chars/mês | Gerar todos os áudios de uma vez, priorizar voz ES |
| Veo 3 | ~50 vídeos/dia (Google AI Studio) | Gerar todos os clips num dia, salvar tudo |
| HeyGen | 1 min free trial | Usar só se Veo 3 não der conta do avatar |
| Canva | Free tier OK para imagens | Templates prontos + Text-to-Image |
| ChatGPT | Free tier (GPT-4o mini) | Backup para ideias rápidas |
| Gemini | Free (Google) | Backup + integração com Google Workspace |

## Tracking de Uso

Para registrar um gasto, diga:
- "gastei X no ElevenLabs"
- "usei Y créditos no HeyGen"
- "assinei Canva Pro por R$Z"

Eu atualizo o arquivo de tracking automaticamente.

╚══════════════════════════════════════════════════════════╝
```

### 4. Estrutura do arquivo de tracking

Se `.claude/tracking/ai-costs.json` não existir, criar:

```json
{
  "version": "1.0",
  "currency": "BRL",
  "services": {
    "claude": {
      "plan": "Max",
      "cost_monthly_usd": 100,
      "status": "active",
      "notes": "Claude Code CLI — primary tool"
    },
    "elevenlabs": {
      "plan": "Free",
      "cost_monthly": 0,
      "limit": "10000 chars/month",
      "used_this_month": 0,
      "status": "active"
    },
    "veo3": {
      "plan": "Free (Google AI Studio)",
      "cost_monthly": 0,
      "limit": "~50 videos/day",
      "used_this_month": 0,
      "status": "active"
    },
    "canva": {
      "plan": "Free",
      "cost_monthly": 0,
      "status": "active"
    },
    "notion": {
      "plan": "Free",
      "cost_monthly": 0,
      "status": "active"
    },
    "heygen": {
      "plan": "Free trial",
      "cost_monthly": 0,
      "limit": "1 min",
      "used_this_month": 0,
      "status": "active"
    }
  },
  "monthly_logs": [],
  "total_fixed_monthly_brl": 0,
  "exchange_rate_usd_brl": 5.75
}
```

### 5. Atualizar tracking

Quando o usuário reportar um gasto:
1. Ler `.claude/tracking/ai-costs.json`
2. Atualizar o campo relevante
3. Adicionar entry em `monthly_logs`
4. Salvar

### 6. Recomendações automáticas

Sempre incluir no final:
- Se algum serviço free está perto do limite → avisar
- Se existe alternativa gratuita → sugerir
- Break-even: quantas vendas a $19.90 para cobrir custos fixos

---
*AIOX Productivity — Cost Tracking Command*
