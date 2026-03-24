# AIOX Productivity System — Guia Completo

> Sistema de produtividade pessoal integrado ao AIOX para maximizar as 2h/dia do Lucas.

---

## Comandos Disponíveis

### Comandos Rápidos (slash commands)

| Comando | O que faz | Quando usar |
|---------|-----------|-------------|
| `/atlas` | Ativa o Commander Atlas (Chief of Staff) | Quando precisa coordenar o Low-Ticket Squad |
| `/atlas-briefing` | Briefing operacional diário do Notion | Ao abrir o terminal — mostra o que fazer hoje |
| `/custos` | Dashboard de gastos com IAs | Mensal, para controlar orçamento |
| `/weekly-prep` | Gera pauta da weekly com Cabral | Segunda antes das 20h |
| `/review-day` | Fecha a sessão: marca tasks + gera log | No final de cada sessão de trabalho |

### Auto-Briefing (Hook)

O sistema roda automaticamente `/atlas-briefing --compact` na primeira mensagem de cada sessão.
Configurado em `.claude/settings.json` → hooks → UserPromptSubmit (once: true).

---

## Acesso pelo Celular

### Claude App (GRATUITO com plano Max)

O Lucas já tem plano Claude Max ($100/mês). O app mobile está **incluído** sem custo adicional.

**Setup:**
1. Baixar "Claude by Anthropic" na App Store ou Google Play
2. Fazer login com a mesma conta do Claude Code
3. Usar normalmente — mesma IA, chat por texto ou voz

**Limitações do app mobile vs Claude Code:**
- Não tem acesso ao filesystem local
- Não roda comandos bash
- Não acessa MCP servers
- É um chat puro (sem tools)

### Claude Code Remote Control (incluído no Max)

**O mais poderoso: controle o Claude Code do celular.**

1. No PC, rodar: `claude --remote`
2. Acessar `claude.ai/code` no celular (ou app Claude)
3. O Claude Code continua rodando no PC — você só controla pelo celular
4. Código nunca sai da máquina, apenas mensagens trafegam

**Segurança:** Tudo via HTTPS, sem portas abertas. Código fica local.

**Quando usar:**
- Começou uma task no PC e precisa sair
- Quer revisar progresso pelo celular
- Quer dar comandos rápidos no ônibus/metrô

### Alternativas 100% Gratuitas (sem plano pago)

| App | Custo | Modelo | Limitação |
|-----|-------|--------|-----------|
| Claude App (Free tier) | $0 | Sonnet | Mensagens limitadas/dia |
| Gemini App (Google) | $0 | Gemini Pro | Integra com Google Workspace |
| ChatGPT App | $0 | GPT-4o mini | Mensagens limitadas |

---

## Tracking de Custos

### Arquivo de tracking
`.claude/tracking/ai-costs.json`

### Serviços ativos (Março 2026)

| Serviço | Plano | Custo | Limite Free |
|---------|-------|-------|-------------|
| Claude (Code + App + Remote) | Max | R$575/mês | — |
| ElevenLabs | Free | R$0 | 10.000 chars/mês |
| Veo 3 (Google AI Studio) | Free | R$0 | ~50 vídeos/dia |
| Canva | Free | R$0 | Templates + IA básica |
| Notion | Free | R$0 | Ilimitado para uso pessoal |
| HeyGen | Free trial | R$0 | 1 min total |
| Gemini | Free | R$0 | Chat + Workspace |

**Total fixo:** R$575/mês (apenas Claude Max)

### Como registrar gastos

Diga ao Claude: "gastei X no ElevenLabs" ou "assinei Canva Pro por R$X" — ele atualiza o tracking.

---

## Estrutura de Arquivos

```
.claude/
├── commands/
│   ├── atlas.md              # /atlas — Ativa Commander Atlas
│   ├── atlas-briefing.md     # /atlas-briefing — Briefing diário
│   ├── custos.md             # /custos — Dashboard de custos
│   ├── weekly-prep.md        # /weekly-prep — Pauta da weekly
│   ├── review-day.md         # /review-day — Fechamento de sessão
│   ├── AIOX/agents/          # Agentes AIOX (dev, qa, etc.)
│   └── AIOS/agents/          # Agentes AIOS (legacy)
├── tracking/
│   └── ai-costs.json         # Registro de gastos com IAs
├── logs/
│   └── session-YYYY-MM-DD.md # Logs de sessão (gerados por /review-day)
├── settings.json             # Hooks + config do projeto
└── rules/                    # Regras contextuais do AIOX
```

---

## Integração com Notion

### IDs importantes

| Recurso | ID |
|---------|-----|
| Database Tasks | `1e7f8404-ef57-8144-b61d-c612e69e3ba2` |
| Projeto GC | `2bbf8404-ef57-80c2-ac43-cb8fa7d189ba` |
| Lucas (People) | `229f8404-ef57-80c5-b5ab-f49fe44d7321` |
| Cabral (People) | `229f8404-ef57-80a4-bf83-f195aa41927b` |

### Token
Armazenado em `~/.claude/.mcp.json` → env → NOTION_TOKEN

### API usada
Notion API v2022-06-28 via curl (MCP server tem problemas de auth intermitentes).

---

## Fluxo Diário Recomendado

### Dia Útil (20:15-22:15)

```
20:15  Abrir Claude Code → auto-briefing aparece
20:20  Executar a task do dia (o briefing já diz qual)
21:45  Finalizar task principal
21:50  /review-day → marcar tasks como Done
22:00  Se segunda: /weekly-prep para preparar pauta
22:15  Desligar. Amanhã o briefing sabe onde parou.
```

### Segunda-feira (Weekly)

```
19:45  /weekly-prep → gerar pauta
20:00  Weekly com Cabral (60 min max, pauta fixa)
21:00  Executar task do dia
22:15  /review-day
```

### Fim de Semana (Mais tempo disponível)

```
Tarde   Abrir Claude Code → briefing
        Executar tasks mais pesadas (vídeos, infra)
        /review-day no final
```

---

## Dicas de Produtividade

1. **Uma task por sessão.** Você funciona melhor com foco único.
2. **Briefing primeiro.** Nunca comece sem saber o que fazer.
3. **Feche a sessão.** /review-day evita tasks perdidas.
4. **Celular para revisão.** Use Remote Control para acompanhar, não para produzir.
5. **Custos mensais.** /custos uma vez por mês para não estourar.
6. **Maximize free tiers.** Gere todos os áudios ElevenLabs de uma vez. Veo 3 tem ~50 vídeos/dia grátis.

---

## Notion Tasks — Zero Diastase (Configuradas)

As 6 tasks do Projeto GC foram criadas no Notion com conteudo completo e prompts prontos:

| Task | Page ID | Conteudo |
|------|---------|----------|
| Video 1 "La Verdad" | `32cf8404-ef57-818e-...` | Script v2 P1 + 5 Veo 3 prompts (3 avatar + 2 b-roll) |
| Video 2 "El Espejo" | `32cf8404-ef57-812a-...` | Script v2 P2 + 6 Veo 3 prompts (4 avatar + 2 b-roll) |
| Imagens Estaticas | `32cf8404-ef57-81c8-...` | 4 imagens + AI prompts para cada |
| Carrossel | `32cf8404-ef57-81c7-...` | Las 4 Fases (4 slides) + Link Ad Quiz |
| Infra & Tracking | `32cf8404-ef57-8146-...` | Hosting + Pixel + Checkout checklist |
| Launch Day | `32cf8404-ef57-8185-...` | 8-item checklist + KPIs + estrutura campanha |

### Veo 3 Prompts — Padrao

Todos os prompts seguem estas regras:
- **Idioma do prompt:** Ingles
- **Fala do avatar:** Espanhol neutro (LATAM)
- **Duracao maxima:** 8 segundos por clip
- **Avatar Sofia:** Latina ~35yo, pele #B27C58, cabelo #291B0F, estilo documentario
- **Continuidade visual:** Prompts conectam entre si (mesma roupa, cenario, iluminacao)
- **Tom:** Avatar fala calmamente, olhando para camera

### Pipeline v2 (fonte dos scripts)

Os scripts e criativos vem do pipeline-output-v2:
- `phase5-copy/ad-scripts.md` — 6 ad scripts com storyboards
- `phase5-copy/hooks.md` — 20 hooks em 5 angulos
- `phase6-creative/creative-briefs.md` — 5 briefs + UX specs + AI prompts
- `phase6-creative/brand-identity-kit.md` — Paleta v2: Coral #E8837C, White Warm #FFF8F5, Verde Menta #7ECEC1

---

## Troubleshooting

### Notion API retorna 401
- Verificar token em `~/.claude/.mcp.json` → `NOTION_TOKEN`
- MCP server tem problemas intermitentes — usar curl direto como fallback
- Token atual: comeca com `ntn_6663...`

### Caracteres estranhos no Notion (UTF-8)
- Windows terminal usa cp1252, nao UTF-8
- Solucao: usar Python `urllib.request` com `.encode('utf-8')` em vez de curl
- Notion recebe UTF-8 corretamente mesmo que terminal mostre `?`

### Hook de auto-briefing nao dispara
- Verificar `.claude/settings.json` → hooks → UserPromptSubmit
- O hook usa `once: true` — dispara apenas na primeira mensagem
- Se nao funcionar, rodar `/atlas-briefing --compact` manualmente

---

*AIOX Productivity System v1.0 — Criado em 2026-03-23*
*Documentacao revisada e finalizada pelo @analyst (Atlas/Alex) do AIOX*
