---
name: ai-native-project-setup
source_dossier: ai-native-operator-system
domain: ai-native-build
tokens: 750
updated: 2026-04-29
---

# Playbook: AI-Native Project Setup

**Quando usar:** Iniciar qualquer projeto novo com Claude Code, ou fazer upgrade de projeto existente para operação AI-native.

---

## FASE 0 — Antes de Começar (5 min)

```
□ Qual é o squad? (nome, propósito, stack)
□ Tem identidade visual? (sim → brand-guidelines | não → escolher brand de referência)
□ Quais são os agentes necessários? (mínimo: dev, qa, pm)
□ Qual modelo principal? (Opus para orquestrar, Sonnet para implementar)
```

---

## FASE 1 — Estrutura Base (30 min)

### 1.1 CLAUDE.md específico
```
Incluir obrigatoriamente:
□ Nome e propósito do projeto/squad
□ Stack técnico completo (linguagem, frameworks, banco)
□ Agentes ativos e seus escopos
□ Convenções de código (naming, estrutura de pastas)
□ Padrões específicos (ex: "nunca usar useEffect sem cleanup")
□ O que NUNCA fazer (ex: "nunca commitar .env")
```

### 1.2 DESIGN.md (se tem UI)
```
Opção A — Tem identidade visual própria:
  1. Ler brand-guidelines existente
  2. Tokenizar: hex exatos, fontes, escala, espaçamento, motion
  3. Escrever DESIGN.md em squads/{squad}/app/

Opção B — Sem identidade:
  1. npx getdesign@latest list → escolher brand mais próximo
  2. npx getdesign@latest add {brand} --out squads/{squad}/app/DESIGN.md
  3. Ajustar tokens para o contexto do produto

Validação:
  □ Todas as cores têm hex exato?
  □ Escala tipográfica completa (size + weight + line-height)?
  □ Motion tokens definidos?
  □ Anti-patterns explícitos listados?
```

### 1.3 Skills essenciais
```
□ design-aware-ui — se tem UI
□ knowledge-router — se vai usar knowledge layer
□ context-hygiene — sempre (economiza tokens)
Verificar: .claude/skills/ tem os arquivos?
```

---

## FASE 2 — Hooks de Segurança (15 min)

```
Verificar .claude/settings.json:
□ UserPromptSubmit: contexto de sessão injetado
□ PostToolUse(Write|Edit): JSON validator ativo
□ PreToolUse(Write): check-design-md.js ativo (se tem UI)
□ Stop: review-day reminder ativo
```

---

## FASE 3 — Knowledge Layer (opcional, 20 min)

```
□ _REGISTRY.yaml: novo squad/contexto referenciado?
□ _SITUATIONS.yaml: situações específicas do squad mapeadas?
□ _ROUTING.yaml: agentes do squad têm routing correto?

Se vai usar experts de info-marketing: carregar dossier correspondente
Se vai usar ai-native-build: carregar dossier ai-native-operator-system
Se vai usar design: carregar brand da biblioteca
```

---

## FASE 4 — Teste de Qualidade (10 min)

```
□ Pedir UI simples → verificou DESIGN.md antes?
□ Pedir copy → ativou knowledge-router?
□ Mudar contexto → sugeriu /clear?
□ Rodar Plan Mode → Shift+Tab funciona?
□ Code review → Codex adversarial disponível?
```

---

## CHECKLIST RÁPIDA — Por Sessão

```
Início de sessão:
□ Contexto limpo? (/clear se tarefa nova)
□ Plan Mode antes de implementar (Shift+Tab)
□ Modelo correto para a tarefa

Durante:
□ /compact se contexto > 80k tokens
□ Background agent se tarefa paralela independente

Fim de sessão:
□ /checkpoint se progresso significativo
□ /review-day para fechar
```

---

## KPIs de um Sistema AI-Native Saudável

| Métrica | Target | Sinal de problema |
|---------|--------|-------------------|
| UI sem retrabalho | > 80% | DESIGN.md ausente ou incompleto |
| Tokens/sessão | < 50k em tarefas normais | Contexto não limpo, modelo errado |
| Plan Mode uso | > 70% das tasks | Execução impulsiva |
| Code review externo | 100% antes de merge | Self-review sem adversarial |
| /clear por dia | > 1x | Contexto acumulando |

---

*Gerado de: dossiers/cross-source/ai-native-operator-system.md | @aios-master*
