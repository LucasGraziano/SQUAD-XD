---
name: ai-native-operator-system
type: dossier
domain: cross-domain
sources:
  - top-5-claude-code-skills (Chase)
  - top-10-claude-code-skills (Chase)
  - frontend-design-skills
  - claude-code-mcp
  - claude-code-skills (47 skills + hooks)
  - claude-code-para-empreendedores (Mateus Dias)
  - pare-de-queimar-tokens-com-design (Alon)
  - masterclass-claude-code
  - full-course-4h
  - agent-teams
tokens: 950
updated: 2026-04-29
---

# Dossier: AI-Native Operator System

**Convergência de 10 fontes sobre construção e operação de sistemas Claude Code em produção.**

---

## 1. PRINCÍPIO FUNDAMENTAL: Sistema > Sessão

A diferença entre um "usuário de IA" e um "operador de IA" é que o operador constrói
um **sistema** que persiste entre sessões, acumula conhecimento e melhora sozinho.

**Convergência total (10/10 fontes):** Todo expert enfatiza que a vantagem não está
no modelo — está na infraestrutura ao redor do modelo.

---

## 2. DESIGN.md: O Artefato Mais Impactante para Qualidade Visual

**Fonte primária:** Alon (pare-de-queimar-tokens), Chase (top-5, top-10)

### O que é
Arquivo markdown com tokens de design (cores, tipografia, espaçamento, motion, voice)
que a IA lê antes de gerar qualquer UI. Equivalente a dar um briefing de marca para
um designer antes de ele trabalhar.

### Por que funciona
- Reduz drasticamente o "AI slop" (interfaces genéricas, bento grids, neon, glassmorphism)
- Economiza tokens: IA não precisa ler centenas de linhas de HTML para entender o estilo
- Mantém consistência entre sessões sem reexplicar

### Implementação
1. Criar `DESIGN.md` na raiz do projeto ou pasta do app
2. Incluir: cores (hex exatos), tipografia (família + pesos + escala), espaçamento, bordas, motion
3. Opcional: usar `npx getdesign@latest` para gerar a partir de 70 brands como base
4. IA lê o arquivo antes de qualquer geração de frontend

### Economia
> "Em vez dos agentes ficarem lendo todo o seu HTML, gastando um monte de token,
> vai funcionar muito mais rápido gastando muito menos tokens." — Alon

---

## 3. SKILLS: Capacidade Composta Sem Custo de Tokens

**Fonte primária:** Chase (CLAUDE CODE SKILLS — 47 skills + 18 hooks)

### Hierarquia de ativação
1. **Slash commands** (`/nome`): determinístico, manual, sempre executa o corpo inteiro
2. **Skills** (`SKILL.md` com `description:`): semântico, auto-trigger por contexto

### Como a IA carrega skills
A IA carrega skills pelo **nome + descrição** no frontmatter, não pelo corpo.
O corpo só é lido quando a skill é realmente ativada. Isso significa:
- Ter 50 skills não custa 50x mais tokens no contexto base
- A description deve ser precisa e trigger-rich para ativação correta

### Skills de maior ROI
1. **Design-aware-ui** → previne retrabalho de design
2. **Knowledge-router** → acessa base de conhecimento estruturada
3. **Context-hygiene** → previne gasto desnecessário de tokens
4. **Atlas-briefing** → contexto operacional instantâneo
5. **Brand-recommender** → inspiração visual on-demand

---

## 4. HOOKS: Automação Determinística

**Fonte primária:** Chase (CLAUDE CODE SKILLS)

### Diferença crítica
- **Skills**: IA decide quando usar (semântico, pode não disparar)
- **Hooks**: sistema executa sempre (determinístico, infalível)

### 4 tipos de hooks
| Hook | Trigger | Uso ideal |
|------|---------|-----------|
| UserPromptSubmit | Antes de cada resposta | Injetar contexto situacional |
| PreToolUse | Antes de ferramenta específica | Validar antes de executar |
| PostToolUse | Depois de ferramenta | Verificar qualidade, notificar |
| Stop | Fim de resposta | Checkpoint automático, cleanup |

### Exemplo real: JSON validator no PostToolUse(Write|Edit)
```json
{
  "matcher": "Write|Edit",
  "hooks": [{
    "type": "command",
    "command": "node .aiox-core/core/hooks/validate-json.js \"$CLAUDE_TOOL_OUTPUT\""
  }]
}
```

---

## 5. HIERARQUIA DE MODELOS: Opus → Sonnet → Haiku

**Fonte primária:** Mateus Dias (empreendedores), Chase (top-10)

### Padrão de uso eficiente
```
Opus 4.7  → Orquestração, decisões complexas, planos
Sonnet 4.6 → Implementação principal, análise
Haiku 4.5  → Tarefas simples, formatação, classificação
```

> "Subagentes mais burros fazem o trabalho braçal enquanto o agente principal pensa"
> — Mateus Dias

### Claude Code Router (88% de economia)
Proxy entre Claude Code e OpenRouter que roteia para modelos mais baratos em tarefas simples.
Para tasks com complexidade <= MEDIUM, usar Haiku economiza ~88% dos tokens.

---

## 6. KNOWLEDGE OFFLOADING: Economizar Tokens com Ferramentas Externas

### NotebookLM-pine (offload para Google — free tokens)
- Análise de PDFs, vídeos, pesquisa → processada pelos servidores do Google
- Claude Code só recebe o sumário estruturado
- Ideal para: research antes de implementar, análise de documentos longos

### Karpathy Graphify (70x mais barato em queries)
- Converte codebase em knowledge graph queryável
- Query no grafo custa ~1/70 do custo de ler os arquivos diretamente
- Ideal para: projetos grandes, análise de dependências, onboarding em codebases novos

### awesomedesign.md / getdesign CLI (design sem gastar tokens)
- 70 brands pré-analisados em DESIGN.md files
- Baixar uma vez, referenciar sempre
- Não precisa pedir à IA para "criar um design bonito" — apenas apontar para o arquivo

---

## 7. CONTEXT HYGIENE: O Hábito Mais Barato e Mais Ignorado

**Fonte primária:** Mateus Dias, Chase

### Regras dos experts
- `/clear` ao mudar de tarefa (não apenas ao mudar de sessão)
- `/compact` quando contexto > 50k tokens em tarefa longa
- `/checkpoint` antes de grandes mudanças para poder recuperar
- Spawn background agent para tarefas independentes (não poluem o contexto principal)

### Mateus Dias: "Plan Mode 90% do tempo"
- Shift+Tab no terminal para entrar em Plan Mode
- Planejar antes de executar reduz drasticamente os erros
- Plano = 10 tokens. Erro = 500+ tokens para corrigir.

---

## 8. MCP STACK: O Ecossistema de Ferramentas

**Fonte primária:** CLAUDE CODE MCP (30+ MCPs catalogados)

### MCPs de maior impacto operacional
| MCP | Caso de uso | Economia |
|-----|------------|---------|
| Playwright CLI | Browser automation, testes | Substitui screenshots (10x mais barato) |
| Firecrawl | Web scraping antibot | Dados estruturados direto para LLM |
| GWS (Google) | Email, Calendar, Drive | Produtividade pessoal integrada |
| Obsidian | RAG local sem overhead | Mini-RAG gratuito |
| LightRAG | Graph RAG open-source | Para bases > 1000 docs |

### Playwright CLI > Playwright MCP
O CLI analisa o accessibility tree (código), não screenshots.
10-50x mais eficiente e mais preciso que alternativas baseadas em screenshot.

---

## 9. FRAMEWORKS COGNITIVOS: Como os Experts Pensam

### Chase (top-10)
**Framework: "CLI + Skill + Hook = Sistema"**
Todo problema tem 3 camadas:
1. CLI: o poder (Playwright, Firecrawl, GWS)
2. Skill: o cérebro (instrui a IA como usar)
3. Hook: o gatilho (automação determinística)

### Mateus Dias
**Framework: "Agente é um sistema, não uma ferramenta"**
O agente não é você usando IA. É uma estrutura que funciona sem você.
CLAUDE.md = contrato do sistema. Agentes = departamentos. Skills = procedimentos.

### Alon
**Framework: "Tokens = dinheiro. DESIGN.md = investimento."**
Cada vez que você não tem um DESIGN.md, está "pagando" para a IA reaprender
o estilo do seu produto do zero. Uma vez criado, o arquivo economiza para sempre.

---

## 10. ANTI-PADRÕES: O Que Não Fazer

**Convergência 8/10 fontes**

| Anti-padrão | Por que é ruim | Alternativa |
|------------|--------------|------------|
| Não ter DESIGN.md | UI genérica a cada sessão | Criar DESIGN.md uma vez |
| Usar um modelo para tudo | Gasto 3-10x maior | Hierarquia Opus/Sonnet/Haiku |
| Não limpar contexto | Tokens caros, respostas piores | /clear entre tarefas |
| Skills sem description forte | Nunca ativam | Description com keywords de trigger |
| CLAUDE.md genérico | IA não sabe o contexto do projeto | CLAUDE.md com context específico |
| Ignorar hooks | Processos quebram silenciosamente | Hooks determinísticos para validações |
| Pedir à IA para revisar seu próprio código | Auto-elogio garantido | Codex adversarial review |

---

## SÍNTESE EXECUTIVA

Um operador AI-native não usa Claude Code como um assistente de chat.
Ele constrói um **sistema** com:

1. **DESIGN.md** → UI consistente sem tokens extras
2. **Skills** → capacidades especializadas auto-ativadas
3. **Hooks** → automação determinística
4. **Knowledge Layer** → expertise acumulada
5. **Hierarquia de modelos** → custo otimizado por complexidade
6. **Context hygiene** → máxima eficiência por sessão

O retorno sobre o investimento de construir esse sistema é exponencial:
cada projeto novo se beneficia de toda a infraestrutura anterior.

---

*Gerado por @aios-master | Convergência de 10 transcrições | 2026-04-29*
