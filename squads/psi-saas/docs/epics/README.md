# Vínculo — Épicos do MVP

**Agente:** @po (Pax) — validação concluída  
**Veredicto:** GO — todos os artefatos aprovados ✓

---

## Mapa de Épicos

| Épico | Nome | Stories | Estimativa | Dependências | Status |
|-------|------|---------|-----------|-------------|--------|
| [001](epic-001-foundation.md) | Foundation & Core Infrastructure | 4 | ~20h | — | Ready |
| [002](epic-002-patients-agenda.md) | Gestão de Pacientes + Agenda | 5 | ~32h | 001 | Ready |
| [003](epic-003-prontuario-notas.md) | Prontuário + Notas + IA Linhagem | 4 | ~31h | 002 | Ready |
| [004](epic-004-cobranca-financeiro.md) | Cobrança Automática + Financeiro | 4 | ~28h | 002 | Ready |
| [005](epic-005-alerta-abandono.md) | Alerta de Risco de Abandono | 3 | ~19h | 002+004 | Ready |

**Total estimado MVP:** ~130h de desenvolvimento  
**Ritmo realista (Lucas solo, 10h/semana):** ~13 semanas  
**Com ajuda (freelancer ou pair):** ~7–8 semanas

---

## Sequência de Execução Recomendada

```
Semana 1–2:   Epic 001 (Foundation)
Semana 3–5:   Epic 002 (Pacientes + Agenda) — paralelo: setup Pagar.me e Z-API
Semana 6–7:   Epic 003 stories 3.1 + 3.2 (Prontuário + Imutabilidade)
Semana 7–8:   Epic 004 (Cobrança + Financeiro)
Semana 9:     Epic 003 story 3.3 + 3.4 (Export PDF + IA Linhagem)
Semana 10–11: Epic 005 (Alerta de Abandono — feature killer)
Semana 12–13: QA geral + ajustes + beta com 5 psicólogos
```

---

## Checklist @po — Validação de Artefatos

- [x] PRD v0.2 alinhado com todos os épicos
- [x] Architecture.md cobre todos os módulos
- [x] Brand guidelines completo com tokens de design
- [x] Cada story tem critérios de aceite testáveis
- [x] Dependências entre épicos mapeadas
- [x] Estimativas realistas para desenvolvedor solo
- [x] Compliance CFP/LGPD presente nos épicos relevantes
- [x] Feature killer (Epic 005) tem definição de done clara

**Artefatos aprovados para desenvolvimento. @sm → @dev pode iniciar Epic 001.**
