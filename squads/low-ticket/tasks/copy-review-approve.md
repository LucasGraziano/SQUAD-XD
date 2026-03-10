---
task: Review & Approve Copy
responsavel: "@copy-chief"
responsavel_type: agent
atomic_layer: task
elicit: true
Entrada: |
  - copy_piece: Peça de copy para revisão (sales letter, hooks, scripts, emails)
  - offer_thesis: offer-thesis.md como referência
  - voice_guide: voice-guide.md (se existir)
  - author_agent: Agente que produziu o copy (@copywriter, @hook-master, @script-writer)
Saida: |
  - review-verdict.md: Veredicto com feedback detalhado
  - approved-copy/: Pasta com peças aprovadas (versão final)
Checklist:
  - "[ ] Verificar alinhamento com offer-thesis.md"
  - "[ ] Avaliar ângulo de persuasão escolhido"
  - "[ ] Checar uso de linguagem do público (language-patterns.md)"
  - "[ ] Validar estrutura persuasiva (headline → lead → body → CTA)"
  - "[ ] Verificar clareza e fluidez do texto"
  - "[ ] Checar gatilhos mentais (escassez, urgência, prova, autoridade)"
  - "[ ] Validar CTA (clareza, urgência, ação específica)"
  - "[ ] Checar objeções antecipadas e respondidas"
  - "[ ] Emitir veredicto: APPROVED / NEEDS REVISION / REJECTED"
  - "[ ] Se NEEDS REVISION: listar pontos específicos para correção"
---

# *review-copy / *approve-angle — Review & Approve Copy

Processo formal de revisão e aprovação de toda peça de copy produzida pelo departamento.

## Uso

```
@copy-chief *review-copy --piece sales-letter.md
@copy-chief *approve-angle --piece hooks.md
```

## Critérios de Avaliação

### Scorecard de Copy (10 pontos)

| Critério | Peso | Score |
|----------|:----:|:-----:|
| **Alinhamento com tese** | 2 | /2 |
| **Linguagem do público** | 2 | /2 |
| **Estrutura persuasiva** | 1.5 | /1.5 |
| **Clareza e fluidez** | 1 | /1 |
| **Gatilhos mentais** | 1 | /1 |
| **CTA effectiveness** | 1 | /1 |
| **Objeções antecipadas** | 1 | /1 |
| **Originalidade vs genérico** | 0.5 | /0.5 |
| **TOTAL** | **10** | **/10** |

### Veredictos

| Veredicto | Score | Ação |
|-----------|:-----:|------|
| **APPROVED** | >= 8.0 | Copy aprovada, segue para próxima fase |
| **NEEDS REVISION** | 5.0 - 7.9 | Retorna para o autor com feedback específico |
| **REJECTED** | < 5.0 | Reescrever do zero com novo briefing |

## Output: review-verdict.md

```markdown
# Copy Review — [Peça]
## Revisor: Quill (Copy Chief)
## Data: [data]

### Peça avaliada: [nome do arquivo]
### Autor: [@agente]

### Scorecard

| Critério | Score | Comentário |
|----------|:-----:|-----------|
| Alinhamento com tese | 1.8/2 | Boa conexão com dor principal |
| Linguagem do público | 1.5/2 | Algumas frases muito "copywriter" |
| Estrutura persuasiva | 1.2/1.5 | Lead forte, body perde ritmo |
| Clareza e fluidez | 0.8/1 | Parágrafos longos demais |
| Gatilhos mentais | 0.8/1 | Falta prova social |
| CTA effectiveness | 0.9/1 | Bom, mas pode ser mais urgente |
| Objeções antecipadas | 0.7/1 | Faltou objeção de preço |
| Originalidade | 0.4/0.5 | OK |
| **TOTAL** | **8.1/10** | |

### Veredicto: ✅ APPROVED

### Feedback:
1. **Ajuste menor:** Trocar "metodologia exclusiva" por linguagem do público
2. **Sugestão:** Adicionar 1 depoimento antes do CTA
3. **Nota:** Lead excelente, manter essa abertura

### Versão aprovada: `approved-copy/sales-letter-v1-approved.md`
```

## Fluxo de Revisão

```
@copywriter produz copy
    ↓
@copy-chief *review-copy
    ↓
┌─── APPROVED ────→ Segue para próxima fase
│
├─── NEEDS REVISION ─→ Feedback específico → @copywriter corrige → Re-review
│     (máx 2 ciclos)
│
└─── REJECTED ────→ Novo briefing → @copywriter reescreve do zero
```
