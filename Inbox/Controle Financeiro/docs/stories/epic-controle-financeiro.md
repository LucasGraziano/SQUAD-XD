# Epic: Automação do Controle Financeiro Pessoal

> **ID:** EPIC-CF-01
> **Status:** Ready
> **Criado por:** @pm (Morgan) — Brownfield Discovery Phase 10
> **Data:** 2026-03-26
> **Atualizado:** 2026-03-26 (premissas: custo zero, Bradesco, Ollama local)
> **Origem:** Brownfield Discovery Assessment

---

## Objetivo

Migrar o controle financeiro pessoal de um Excel manual para Google Sheets automatizado com classificação por AI local (Ollama), importação de extratos do Bradesco e dashboard inteligente. **Custo operacional: R$ 0/mês.**

## Premissas Atualizadas

| Premissa | Valor |
|----------|-------|
| Orçamento | R$ 0 (uso pessoal, sem gastos) |
| Banco principal | Bradesco |
| AI para classificação | Ollama local (Llama 3.2, já instalado) |
| Custo operacional mensal | R$ 0 |

## Escopo

### IN
- Migração dos 263 registros existentes para Google Sheets
- Motor de classificação automática (regras + Ollama local)
- Importação de extratos bancários (CSV/OFX do Bradesco como P0)
- Dashboard com gráficos e KPIs
- Alertas de orçamento por email
- Feedback loop (correções do usuário viram regras)

### OUT
- Integração direta via Open Finance / API bancária
- App mobile nativo (usar Google Sheets app)
- Multi-user / compartilhamento
- APIs pagas (Claude, OpenAI, etc.)

## Critérios de Sucesso

- [ ] 263 transações migradas sem perda
- [ ] ≥85% de auto-classificação em transações novas
- [ ] Tempo de processamento mensal ≤ 10 minutos
- [ ] Dashboard com pelo menos 4 gráficos funcionais
- [ ] Import de CSV/OFX Bradesco funcional
- [ ] Alerta de orçamento funcionando
- [ ] Custo operacional = R$ 0

## Stories

| # | Story | Prioridade | Horas | Fase |
|---|-------|-----------|-------|------|
| 1.1 | Migração Excel → Google Sheets | P0 | 3h | 1 |
| 1.2 | Motor de Classificação por Regras | P0 | 5h | 2 |
| 1.3 | Classificação AI via Ollama Local | P0 | 5h | 2 |
| 1.4 | Parser CSV/OFX Bradesco + Importação | P0 | 4h | 3 |
| 1.6 | Dashboard Principal | P1 | 3h | 4 |
| 1.7 | Budget Tracking + Alertas | P2 | 3h | 4 |
| 1.8 | Relatório Mensal por Email | P2 | 2h | 4 |

## Arquitetura de Classificação (Custo Zero)

```
Transação nova
    │
    ▼
┌───────────────────────┐
│ Camada 1: Regras      │  ← Custo: R$ 0
│ (match local, ~85%)   │     Velocidade: instantâneo
└──────────┬────────────┘
           │ Sem match?
           ▼
┌───────────────────────┐
│ Camada 2: Ollama      │  ← Custo: R$ 0 (local)
│ Llama 3.2 local       │     Velocidade: ~1-2s/txn
│ (localhost:11434)     │
└──────────┬────────────┘
           │ Baixa confiança?
           ▼
┌───────────────────────┐
│ Camada 3: Manual      │  ← ~5% das transações
│ Usuário decide        │
└───────────────────────┘
```

**Nota sobre Ollama + Google Sheets:**
O Ollama roda local (localhost:11434), mas Apps Script não acessa localhost. Solução:
- **Opção A:** Script Python local que classifica e atualiza o Sheets via API
- **Opção B:** Classificar via script local antes de importar no Sheets
- **Opção C:** Apps Script classifica por regras (85%), o resto fica como 🔴 para revisão rápida manual

**Recomendação:** Opção C no MVP (regras cobrem 85%), Ollama como upgrade posterior via script Python.

## Timeline

- **Semana 1:** Stories 1.1 + 1.2 (Migração + Regras = 85% auto)
- **Semana 2:** Stories 1.4 + 1.6 (Import Bradesco + Dashboard)
- **Backlog:** Stories 1.3 + 1.7 + 1.8 (Ollama + Alertas)

## Dependências

- Conta Google (já tem)
- Ollama instalado (já tem — Llama 3.2)
- Extrato CSV/OFX do Bradesco para teste

---

*Epic atualizado por @pm (Morgan) — Premissas: custo zero, Bradesco, Ollama*
