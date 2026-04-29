# Decision Map — AI-Native Build

## Quando Usar Qual Expert

### Para configurar Claude Code / estruturar um projeto novo
→ **Expert: Mateus Dias** | Framework: 8-Squad Architecture + CLAUDE.md como Contrato
- Situação: projeto novo, sem agentes definidos, sem CLAUDE.md
- Carregar: `domains/ai-native-build/mateus-dias-dna.md`
- Sinal de alerta: CLAUDE.md genérico → agente sem contexto real

### Para criar skills / configurar auto-triggers
→ **Expert: Chase** | Framework: CLI + Skill + Hook
- Situação: comportamento recorrente que precisa de automação
- Carregar: `domains/ai-native-build/chase-dna.md`
- Pergunta-chave: "precisa ser determinístico ou semântico?"
  - Determinístico (sempre acontece) → Hook
  - Semântico (quando relevante) → Skill

### Para reduzir gasto de tokens
→ **Expert: Chase** | Framework: Model Hierarchy + Context Hygiene + Offloading
- Situação: custo alto, sessões lentas, token budget estourado
- Carregar: `domains/ai-native-build/chase-dna.md`
- Quick wins: /clear entre tarefas, Haiku para simples, NotebookLM para research

### Para criar DESIGN.md / melhorar qualidade visual de UI
→ **Expert: Alon** | Framework: DESIGN.md Protocol
- Situação: UI com AI slop, identidade inconsistente, refazendo design
- Carregar: `domains/ai-native-build/alon-dna.md`
- Ferramenta: `npx getdesign@latest` para 70 brands como referência

### Para estruturar time de agentes IA
→ **Expert: Mateus Dias** | Framework: 22 Agentes em 8 Squads
- Situação: expandindo de uso pessoal para equipe/empresa
- Carregar: `domains/ai-native-build/mateus-dias-dna.md`
- Princípio: cada agente = departamento com escopo claro

### Para code review de qualidade com IA
→ **Expert: Chase** | Framework: Codex Adversarial Review
- Situação: código gerado por IA sem revisão externa
- Carregar: `domains/ai-native-build/chase-dna.md`
- Ferramenta: `codeex colad adversarial review`

---

## Árvore de Decisão Rápida

```
PRECISO DE...
│
├── Configurar projeto/agentes → Mateus Dias (squads + CLAUDE.md)
│
├── Criar automação → Chase
│   ├── Sempre executa? → Hook
│   └── Contexto decide? → Skill
│
├── Reduzir custo → Chase
│   ├── Task simples? → Haiku
│   ├── Research? → NotebookLM
│   ├── Codebase grande? → Karpathy Graphify
│   └── Contexto sujo? → /clear
│
├── Melhorar UI → Alon
│   ├── Sem DESIGN.md? → criar primeiro
│   ├── Sem identidade? → npx getdesign@latest
│   └── Com identidade? → tokenizar brand-guidelines → DESIGN.md
│
└── Code review → Chase (Codex adversarial)
```

---

## Tensões Conhecidas

| Expert A | Expert B | Tensão | Critério |
|----------|----------|--------|---------|
| Mateus Dias | Chase | Mateus: foco em squads/org. Chase: foco em tools/CLIs | Estrutura organizacional → Mateus. Ferramentas específicas → Chase |
| Alon | Chase | Alon: DESIGN.md como prioridade máxima. Chase: token economy acima de tudo | UI-heavy project → Alon primeiro. Token-constrained → Chase primeiro |

---

## Dossier Recomendado

Para visão consolidada de todos os experts: `dossiers/cross-source/ai-native-operator-system.md` (~950 tokens)
