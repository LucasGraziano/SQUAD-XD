---
task: Generate Hooks
responsavel: "@hook-master"
responsavel_type: agent
atomic_layer: task
elicit: true
Entrada: |
  - offer-thesis.md: Tese da oferta
  - persona: Descrição da persona
  - angle_type: Tipo de ângulo (dor, desejo, curiosidade, all)
  - qty: Quantidade de hooks (default: 15)
  - format: Formato (ad, email, video)
Saida: |
  - hooks.md: Variações de hooks organizadas por tipo
Checklist:
  - "[ ] Ler offer-thesis.md e language-patterns.md"
  - "[ ] Gerar hooks por tipo (curiosidade, dor, desejo, etc.)"
  - "[ ] Organizar por potencial de scroll-stop"
  - "[ ] Submeter para aprovação do @copy-chief"
---

# *generate-hooks — Gerar Variações de Hooks

Gera batch de hooks organizados por tipo e formato.

## Output: hooks.md

```markdown
# Hooks — [Oferta] | [Data]
## Persona: [descrição curta]
## Ângulo principal: [ângulo]

---

### 🔴 HOOKS DE DOR (pain-based)
1. "[Hook que amplifica dor específica]"
2. "[Hook que nomeia o problema]"
3. "[Hook que mostra consequência]"

### 🟢 HOOKS DE DESEJO (desire-based)
4. "[Hook que pinta resultado ideal]"
5. "[Hook que mostra transformação]"
6. "[Hook que ativa aspiração]"

### 🟡 HOOKS DE CURIOSIDADE (curiosity-based)
7. "[Hook que abre loop]"
8. "[Hook contraintuitivo]"
9. "[Hook com número específico]"

### 🔵 HOOKS CONTRÁRIOS (contrarian)
10. "[Hook que desafia crença]"
11. "[Hook polêmico controlado]"

### 🟣 HOOKS DE HISTÓRIA (story-based)
12. "[Hook com micro-narrativa]"
13. "[Hook de antes/depois]"

### ⚪ HOOKS DE PROVA (proof-based)
14. "[Hook com resultado específico]"
15. "[Hook com prova social]"

---
## Ranking por Potencial
| # | Hook | Tipo | Potencial |
|---|------|------|-----------|
| 7 | "[hook]" | Curiosidade | ⭐⭐⭐⭐⭐ |
| 1 | "[hook]" | Dor | ⭐⭐⭐⭐ |
| ... | ... | ... | ... |
```
