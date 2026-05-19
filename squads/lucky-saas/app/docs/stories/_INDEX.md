# Stories Index — Premia SaaS

**Gerado em:** 2026-05-18 (atualizado por @sm)
**Total de Stories:** 46
**Stories Done:** 39
**Épicos ativos:** 0, 2, 5, 6, 7

---

## Status Legend

| Badge | Significado |
|-------|------------|
| ✅ Done | Implementado, validado, em produção |
| 🔍 Ready for Review | Implementado, aguardando validação do @po |
| 🟡 Ready | Validado pelo @po, pronto para dev |
| 📝 Draft | Especificado, aguardando refinamento |

---

## Epic 0 — Setup & Infraestrutura

| Story | Título | Status | Pontos | Prioridade |
|-------|--------|--------|--------|-----------|
| 0.4 | Landing Page: Pricing v2 + Copy Improvements | ✅ Done | — | P1 |
| 0.5 | Billing Management: Upgrade e Cancelamento de Plano | ✅ Done | — | P2 |

**Nota:** Epic 0 cobre setup inicial da plataforma, landing page e infraestrutura de billing.

---

## Epic 2 — IA & Processamento

| Story | Título | Status | Pontos | Prioridade |
|-------|--------|--------|--------|-----------|
| 2.3 | PDF Import via IA (Groq + unpdf) | ✅ Done | — | P2 |

**Nota:** Epic 2 cobre integrações de IA generativa para processamento de documentos.

---

## Epic 5 — Core da Plataforma (MVP)

**Tema:** Funcionalidades core do CRM de seguros — gestão de carteira, clientes, apólices, propostas, sinistros, comissões e relatórios.

| Story | Título | Status | Complexidade | Prioridade |
|-------|--------|--------|-------------|-----------|
| 5.1 | Portal do Cliente | ✅ Done | L | P1 |
| 5.2 | Proposta Comercial em PDF | ✅ Done | M | P1 |
| 5.2b | Proposta PDF: ACs Pendentes (SUSEP, Validade Configurável, E-mail) | ✅ Done | S | P1 |
| 5.3 | Sinistro Tracking | ✅ Done | M | P1 |
| 5.4 | E-mails Automáticos (Resend) | 📝 Draft | M | P2 |
| 5.5 | Relatórios Avançados + Forecast de Comissões | ✅ Done | L | P1 |
| 5.6 | Agenda Integrada (Google Calendar) | 📝 Draft | M | P2 |
| 5.7 | WhatsApp via Z-API | 📝 Draft | L | P3 |
| 5.8 | Portal do Cliente v2 (Self-Service Total) | ✅ Done | M | P1 |
| 5.9 | Multicálculo Manual (Proposta Comparativa Multi-Seguradora) | ✅ Done | M | P1 |
| 5.10 | Multicálculo via API (10 Seguradoras) | 📝 Draft | XL | P3 |
| 5.11 | Controle de Pendências por Apólice | ✅ Done | S | P2 |
| 5.12 | Previsão de Comissão | ✅ Done | M | P2 |
| 5.13 | Ciclo Completo Proposta → Apólice | ✅ Done | M | P1 |
| 5.14 | Email Marketing de Renovações | ✅ Done | M | P2 |
| 5.15 | Importação em Massa de Apólices (CSV) | ✅ Done | L | P1 |
| 5.16 | Relatório de Desempenho Operacional | ✅ Done | M | P2 |
| 5.17 | Extrato Histórico de Comissões | ✅ Done | S | P2 |

**Stories concluídas:** 15/18 | **Stories pendentes:** 3 (5.4, 5.6, 5.7)

---

## Epic 6 — Monetização & Engajamento

**Tema:** Modelo de negócio, monetização via Stripe, integrações de produtividade, PWA e referral.

| Story | Título | Status | Complexidade | Prioridade |
|-------|--------|--------|-------------|-----------|
| 6.1 | ZapSign: Assinatura Digital de Propostas e Apólices | 🟡 Ready | M | P2 |
| 6.2 | PlanGate: Upsell Contextual no Momento da Dor | ✅ Done | M | P1 |
| 6.3 | Pricing Page + Stripe Checkout | 🟡 Ready | M | P1 |
| 6.4 | Stripe Billing Lifecycle (Webhooks + Subscription Management) | 🟡 Ready | L | P1 |
| 6.5 | Calculadora de ROI na Landing Page | ✅ Done | S | P2 |
| 6.6 | PWA: Push Notifications Nativas | ✅ Done | M | P2 |
| 6.7 | Programa de Referral | ✅ Done | M | P3 |
| 6.8 | Google Calendar Sync (Vencimentos) | ✅ Done | M | P2 |
| 6.9 | WhatsApp API (Templates de Renovação) | 🟡 Ready | L | P2 |
| 6.10 | Multicálculo (Multi-Seguradora por Ramo) | 📝 Draft | XL | P3 |

**Stories concluídas:** 6/10 (+ 6.3 e 6.4 prontas para dev) | **Stories prontas para dev:** 3 | **Pendentes:** 1

---

## Epic 7 — Core Loop & Retenção

**Tema:** Engajamento, ativação, retenção e cross-sell — o loop que faz o corretor não conseguir viver sem o Premia.

| Story | Título | Status | T-Shirt | Pontos | Prioridade |
|-------|--------|--------|---------|--------|-----------|
| 7.1 | Onboarding Checklist Gamificado | ✅ Done | M | 3 | P1 |
| 7.2 | Importação CSV de Apólices | ✅ Done | M | 4 | P1 |
| 7.3 | Status Flow de Propostas | ✅ Done | S | 2 | P1 |
| 7.4 | Converter Proposta Aprovada em Apólice (1 Clique) | ✅ Done | S | 2 | P1 |
| 7.5 | Renovar Apólice com 1 Clique (Gera Proposta de Renovação) | ✅ Done | M | 3 | P1 |
| 7.6 | Pipeline Lead → Criar Cotação Direto do Card | ✅ Done | S | 2 | P2 |
| 7.7 | Histórico de Versões de Proposta | ✅ Done | M | 3 | P2 |
| 7.8 | Link de Proposta Enviável ao Cliente (sem login) | ✅ Done | M | 3 | P2 |
| 7.9 | "First Win" Notification (Primeiro Alerta Disparado) | ✅ Done | S | 2 | P2 |
| 7.10 | Empty States Inteligentes com CTA Guiado | ✅ Done | S | 2 | P2 |
| 7.11 | Score de Saúde da Carteira | ✅ Done | M | 3 | P2 |
| 7.12 | Cross-sell Automático ("Clientes sem Seguro Auto") | ✅ Done | M | 4 | P2 |
| 7.13 | Histórico de Renovações por Cliente | ✅ Done | S | 2 | P2 |
| 7.14 | Relatório de Carteira Compartilhável (PDF de Portfólio) | ✅ Done | M | 5 | P3 |
| 7.15 | Notificação de Aniversário com Cross-sell Sugerido | ✅ Done | M | 4 | P3 |

**Stories concluídas:** 15/15 | **Total Epic 7:** 15

---

## Epic 8 — Deal Room: Fluxo Unificado de Negociações

**Tema:** Unificar Pipeline, Cotações e Propostas em um único fluxo de deal — do primeiro contato à apólice emitida.  
**ADR:** `docs/architecture/adrs/ADR-006-deal-room.md`

| Story | Título | Status | T-Shirt | Prioridade |
|-------|--------|--------|---------|-----------|
| 8.1 | Schema Evolution (deals + deal_stage_history) | ✅ Done | M | P0 |
| 8.2 | Server Actions Unificadas | ✅ Done | M | P0 |
| 8.3 | Pipeline Rebuild (Kanban de Deals) | ✅ Done | L | P0 |
| 8.4 | Deal Workspace (/deals/[id]) | ✅ Done | L | P0 |
| 8.5 | Timeline + Deprecar /propostas | ✅ Done | S | P1 |
| 8.6 | Auto-triggers por Transição de Estágio | ✅ Done | M | P1 |
| 8.7 | /apolices com Origem + Deals Listagem | ✅ Done | S | P2 |
| 8.8 | Analytics de Funil | ✅ Done | M | P2 |

**Fase 1 (blocker):** 8.1 → 8.2 → 8.3 + 8.4 (paralelo)  
**Fase 2:** 8.5 + 8.6 (paralelo, depende de 8.2)  
**Fase 3:** 8.7 + 8.8 (paralelo, depende de 8.4)

---

## Visão Consolidada

| Épico | Total | Done | Ready for Review | Ready | Draft |
|-------|-------|------|-----------------|-------|-------|
| Epic 0 | 2 | 2 | 0 | 0 | 0 |
| Epic 2 | 1 | 1 | 0 | 0 | 0 |
| Epic 5 | 18 | 15 | 0 | 0 | 3 |
| Epic 6 | 10 | 6 | 0 | 3 | 1 |
| Epic 7 | 15 | 15 | 0 | 0 | 0 |
| Epic 8 | 8 | 8 | 0 | 0 | 0 |
| **Total** | **54** | **47** | **0** | **3** | **4** |

---

## Sprint 8 — Backlog Prioritário

### P0 — Deal Room (sequência obrigatória)
1. **8.1** — Schema Evolution (foundation de tudo)
2. **8.2** — Server Actions Unificadas
3. **8.3** — Pipeline Rebuild
4. **8.4** — Deal Workspace

### P1 — Deal Room (após P0)
5. **8.5** — Timeline + Deprecar /propostas
6. **8.6** — Auto-triggers

### P2 — Deal Room + Pendentes
7. **8.7** — /apolices com Origem
8. **8.8** — Analytics de Funil
9. **5.4** — E-mails Automáticos de Renovação (Resend)
10. **6.9** — WhatsApp API Templates

### Backlog de Pesquisa
1. **5.10/6.10** — Multicálculo Real via API de Seguradoras
2. **5.7** — WhatsApp Z-API

---

## Dependências Críticas

```
8.1 (Schema) → 8.2 (Actions) → 8.3 (Pipeline) ─┐
                             ↓                    ├→ 8.5 (Timeline)
                           8.4 (Workspace) ───────┘    ↓
                                                    8.6 (Auto-triggers)
                                                    8.7 (Apolices origem)
                                                    8.8 (Analytics)

[Epic 7 — todos Done ✅]
6.3 (Stripe Checkout) → 6.4 (Billing Lifecycle) [Ready]
```

---

*Atualizado por @master (Orion) em 2026-05-18 — Epic 8 Deal Room adicionado.*
