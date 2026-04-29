---
expert: chase
domain: ai-native-build
dna_version: v3
tokens: 620
updated: 2026-04-29
source: "Transcrições: Top 5 Claude Code Skills, Top 10 Claude Code Skills, Claude Code Skills (47+18)"
---

# Chase — DNA v3

## L1: Filosofias Fundamentais

1. **CLI + Skill + Hook = Sistema completo** — Qualquer problema tem 3 camadas. CLI: poder. Skill: inteligência. Hook: automação. Um sistema sem as 3 camadas é incompleto.

2. **Revisão adversarial é obrigatória** — LLMs não criticam seu próprio código. Um sistema de qualidade exige um revisor externo (Codex, Gemini). Sem isso, o sistema se auto-elogia.

3. **Skills são capacidades, não comandos** — Skills se auto-ativam por contexto. Comandos são manuais. Um sistema maduro usa mais skills que comandos.

## L2: Modelos Mentais

- **Token economy**: cada operação tem custo. Haiku para simples = 88% mais barato. Obsidian/NotebookLM = offload para servidores externos = custo zero.
- **70x Graphify rule**: queries em knowledge graph custam 1/70 do custo de ler arquivos diretamente (Karpathy).
- **Deterministico vs. Semântico**: hooks são deterministicos (sempre executam). Skills são semânticos (IA decide). Cada tipo tem seu lugar.
- **Library over generation**: ter uma biblioteca (70 brands, 47 skills) custa menos tokens que gerar do zero toda vez.

## L3: Heurísticas Operacionais

1. **Skill description tem mais impacto que skill body** — A IA decide ativar pela description. Body só é lido depois. Escrever descriptions com keywords de trigger precisas.
2. **Codex adversarial antes de considerar pronto** — `codeex colad adversarial review` em qualquer projeto
3. **Playwright CLI > Playwright MCP** — CLI usa accessibility tree (código), MCP usa screenshots (caro + impreciso)
4. **NotebookLM para research** — Offload análise de PDFs/vídeos para Google. Claude recebe só o sumário.
5. **Karpathy Graphify para codebases grandes** — Converter em grafo uma vez, queries 70x mais baratas depois

## L4: Frameworks Práticos

### Framework: CLI + Skill + Hook (qualquer problema)
```
PROBLEMA: quero que IA faça X automaticamente

1. CLI: existe CLI para X? (Playwright, Firecrawl, NotebookLM, GWS)
   Se sim → instalar + documentar no skill como usar

2. Skill: criar SKILL.md com description trigger-rich
   description: "quando X acontecer / quando user pedir Y"
   body: "usar CLI Z da seguinte forma..."

3. Hook: se deve acontecer SEMPRE (não só quando IA decide)
   type: PostToolUse/PreToolUse/UserPromptSubmit/Stop
   command: node/bash/python que executa a automação
```

### Framework: Token Optimization Decision Tree
```
Tarefa recebida
├── Complexidade: ALTA → Opus 4.7
├── Complexidade: MÉDIA → Sonnet 4.6
├── Complexidade: BAIXA → Haiku 4.5
├── Research/análise de docs → NotebookLM (Google server, free)
├── Query em codebase grande → Graphify (70x mais barato)
└── Design UI → DESIGN.md existente? Sim → usar. Não → getdesign CLI
```

### Framework: Skill Creation (da Skill Creator oficial)
```
1. Identificar o problema recorrente (>3x necessário)
2. Escrever description com triggers explícitos
3. Escrever body com protocolo exato
4. Testar: a IA ativa automaticamente quando deveria?
5. Benchmark com/sem skill para medir melhoria
```

## L5: Metodologias Avançadas

**Método: AI-Native Project Setup (checklist)**

```
Pré-trabalho (uma vez por projeto):
□ CLAUDE.md específico com contexto completo
□ DESIGN.md na pasta do app (usar getdesign como base)
□ Skills criadas para casos de uso recorrentes
□ Hooks configurados para automações críticas
□ Knowledge layer com dossiers relevantes

Por sessão:
□ Contexto limpo (/clear se tarefa nova)
□ Plan Mode antes de implementar
□ Modelo correto para complexidade
□ /checkpoint ao terminar bloco significativo

Por feature:
□ Codex adversarial review antes de marcar como done
□ Browser test com Playwright se tem UI
□ /compact se contexto > 80k tokens
```

**Stack de ferramentas essenciais:**
```
Obrigatório: Playwright CLI, awesomedesign/getdesign, Obsidian skills
Recomendado: Firecrawl, NotebookLM-pine, Karpathy Graphify, Codex plugin
Avançado: LightRAG, GWS, Claude Code Router
```
