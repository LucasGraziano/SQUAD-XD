# Stories Index — Premia SaaS

**Gerado em:** 2026-05-14
**Total de Stories:** 46
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
| 0.5 | Billing Management: Upgrade e Cancelamento de Plano | 📝 Draft | — | P2 |

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
| 6.7 | Programa de Referral | 🟡 Ready | M | P3 |
| 6.8 | Google Calendar Sync (Vencimentos) | 🟡 Ready | M | P2 |
| 6.9 | WhatsApp API (Templates de Renovação) | 🟡 Ready | L | P2 |
| 6.10 | Multicálculo (Multi-Seguradora por Ramo) | 📝 Draft | XL | P3 |

**Stories concluídas:** 4/10 | **Stories prontas para dev:** 5 | **Pendentes:** 1

---

## Epic 7 — Core Loop & Retenção

**Tema:** Engajamento, ativação, retenção e cross-sell — o loop que faz o corretor não conseguir viver sem o Premia.

| Story | Título | Status | T-Shirt | Pontos | Prioridade |
|-------|--------|--------|---------|--------|-----------|
| 7.1 | Onboarding Checklist Gamificado | 📝 Draft | M | 3 | P1 |
| 7.2 | Importação CSV de Apólices | 📝 Draft | M | 4 | P1 |
| 7.3 | Status Flow de Propostas | 📝 Draft | S | 2 | P1 |
| 7.4 | Converter Proposta Aprovada em Apólice (1 Clique) | 📝 Draft | S | 2 | P1 |
| 7.5 | Renovar Apólice com 1 Clique (Gera Proposta de Renovação) | 📝 Draft | M | 3 | P1 |
| 7.6 | Pipeline Lead → Criar Cotação Direto do Card | 📝 Draft | S | 2 | P2 |
| 7.7 | Histórico de Versões de Proposta | 📝 Draft | M | 3 | P2 |
| 7.8 | Link de Proposta Enviável ao Cliente (sem login) | 📝 Draft | M | 3 | P2 |
| 7.9 | "First Win" Notification (Primeiro Alerta Disparado) | 📝 Draft | S | 2 | P2 |
| 7.10 | Empty States Inteligentes com CTA Guiado | 📝 Draft | S | 2 | P2 |
| 7.11 | Score de Saúde da Carteira | 📝 Draft | M | 3 | P2 |
| 7.12 | Cross-sell Automático ("Clientes sem Seguro Auto") | 📝 Draft | M | 4 | P2 |
| 7.13 | Histórico de Renovações por Cliente | 🔍 Ready for Review | S | 2 | P2 |
| 7.14 | Relatório de Carteira Compartilhável (PDF de Portfólio) | 🔍 Ready for Review | M | 5 | P3 |
| 7.15 | Notificação de Aniversário com Cross-sell Sugerido | 🔍 Ready for Review | M | 4 | P3 |

**Stories entregues:** 3/15 (7.13–7.15, Ready for Review) | **Implementadas (sem status atualizado):** 12 | **Total Epic 7:** 15

---

## Visão Consolidada

| Épico | Total | Done | Ready for Review | Ready | Draft |
|-------|-------|------|-----------------|-------|-------|
| Epic 0 | 2 | 1 | 0 | 0 | 1 |
| Epic 2 | 1 | 1 | 0 | 0 | 0 |
| Epic 5 | 18 | 15 | 0 | 0 | 3 |
| Epic 6 | 10 | 4 | 0 | 5 | 1 |
| Epic 7 | 15 | 0 | 3 | 0 | 12 |
| **Total** | **46** | **21** | **3** | **5** | **17** |

---

## Backlog Prioritário — Próximas Stories

### Imediato (Sprint 8)
1. **6.3** — Pricing Page + Stripe Checkout (P1, blocker para monetização real)
2. **6.4** — Stripe Billing Lifecycle (P1, webhook de pagamento)
3. **0.5** — Billing Management (upgrade/cancel via portal do cliente)

### Próximo Trimestre
1. **5.4** — E-mails Automáticos de Renovação (Resend)
2. **6.8** — Google Calendar Sync (Broker plan)
3. **6.9** — WhatsApp API Templates
4. **6.1** — ZapSign Assinatura Digital
5. **6.7** — Programa de Referral

### Backlog de Pesquisa
1. **5.10/6.10** — Multicálculo Real via API de Seguradoras (viabilidade técnica pendente)
2. **5.7** — WhatsApp Z-API (análise de custo/benefício)

---

## Dependências Críticas

```
6.3 (Stripe Checkout) → 6.4 (Billing Lifecycle) → 0.5 (Billing Management)

5.13 (Proposta → Apólice) → 7.5 (Renovação 1 Clique)
       ↓
5.9 (Multicálculo) → 7.8 (Link Compartilhável)
                  → 7.7 (Histórico de Versões)

7.5 (Renovação) → 7.13 (Histórico de Renovações) ✅

6.2 (PlanGate) → 7.14 (Relatório PDF) ✅
```

---

*Índice gerado por @master (Orion) em 2026-05-14. Atualizar manualmente a cada sprint ou usar `*stories-index` via @po.*
