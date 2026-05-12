# Premia — Analytics & Tracking Plan

**Versão:** 1.0  
**Data:** 2026-05-11  
**Autor:** Morgan @pm  
**Ferramenta:** PostHog (self-hosted ou cloud)

---

## 1. Justificativa da Ferramenta

**PostHog** — escolhido por:
- LGPD-friendly: dados podem ficar no Brasil (self-hosted no Supabase ou Railway)
- Funnels, session recording, feature flags em uma ferramenta
- SDK Next.js nativo com auto-capture
- Alternativa a Mixpanel sem custo de MAU para volume inicial (< 1M eventos/mês)

**Não usar:** GA4 (modelo de eventos inadequado para SaaS B2B), Hotjar (sem funnels)

---

## 2. Eventos P0 — Críticos para OKRs

Estes eventos são a base de medição dos OKRs. Devem ser implementados antes do lançamento público.

### Onboarding Funnel (O4 — Produto)

| Evento | Propriedades | Mede |
|--------|-------------|------|
| `signup_completed` | `plan_trialing`, `source` | Entrada no funil |
| `csv_import_started` | `file_size_kb`, `row_count_estimated` | Intenção de import |
| `csv_import_completed` | `policies_imported`, `clients_imported`, `time_to_import_ms` | Aha moment step 1 |
| `first_alert_viewed` | `days_until_expiry`, `time_since_signup_ms` | Aha moment step 2 |
| `onboarding_completed` | `total_time_ms`, `steps_completed` | Funil completo |

**KR mensurável:** `time_since_signup_ms` no evento `first_alert_viewed` < 900.000ms (15 min)

### Trial → Paid (O1 — Tração)

| Evento | Propriedades | Mede |
|--------|-------------|------|
| `trial_started` | `plan`, `source`, `referral_code` | Entrada trial |
| `trial_day_7_active` | `policies_count`, `alerts_configured` | Engajamento mid-trial |
| `plan_selected` | `plan`, `billing_period` | Intenção de compra |
| `checkout_completed` | `plan`, `mrr`, `trial_converted` | Conversão paga |
| `trial_expired_without_conversion` | `days_active`, `last_action` | Churn de trial |

**KR mensurável:** `trial_converted: true` / total trials ≥ 20%

### Upsell & Upgrade (O3 — Receita)

| Evento | Propriedades | Mede |
|--------|-------------|------|
| `plan_gate_shown` | `feature`, `current_plan`, `required_plan`, `modal_type` | Exposição a upsell |
| `plan_gate_dismissed` | `feature`, `current_plan` | Resistência a upgrade |
| `upgrade_clicked` | `from_plan`, `to_plan`, `trigger_feature` | Intenção de upgrade |
| `upgrade_completed` | `from_plan`, `to_plan`, `mrr_delta` | Expansão de receita |
| `roi_calculator_interacted` | `policies_input`, `commission_input`, `roi_result` | Engajamento com ROI |

---

## 3. Eventos P1 — Comportamento de Produto

| Evento | Propriedades |
|--------|-------------|
| `portal_link_sent` | `client_id`, `via` (whatsapp/email/copy) |
| `portal_viewed_by_client` | `broker_id`, `policies_shown` |
| `email_campaign_sent` | `campaign_type`, `recipients_count` |
| `email_campaign_opened` | `campaign_id`, `days_until_expiry` |
| `policy_renewed` | `policy_id`, `via` (manual/email_campaign) |
| `cross_sell_opportunity_viewed` | `client_id`, `missing_ramo` |
| `report_exported` | `report_type`, `format` |

---

## 4. Eventos P2 — Retenção & NPS

| Evento | Propriedades |
|--------|-------------|
| `nps_shown` | `trigger` (day_30/day_90) |
| `nps_submitted` | `score`, `comment` |
| `session_started` | `days_since_last_session` |
| `feature_first_use` | `feature_name` |
| `cancellation_flow_started` | `reason_shown` |
| `cancellation_reason_selected` | `reason` |

---

## 5. Funnels a Configurar no PostHog

### Funil 1 — Aha Moment (O4/KR1)
```
signup_completed
  → csv_import_completed
    → first_alert_viewed
```
**Meta:** 60% dos signups completam o funil em < 15 min

### Funil 2 — Trial Conversion (O1/KR2)
```
trial_started
  → onboarding_completed
    → plan_gate_shown (qualquer)
      → checkout_completed
```
**Meta:** ≥ 20% de trial → paid

### Funil 3 — Upsell Contextual
```
plan_gate_shown
  → upgrade_clicked
    → upgrade_completed
```
**Meta por gate:** Portal = 15%, E-mail automático = 12%, 2º usuário = 25%

---

## 6. Dashboards OKR

### Dashboard "North Star" (atualização diária)
- Trial-to-paid conversion rate (rolling 30d)
- Tempo médio até aha moment (p50, p90)
- MRR atual + MRR adicionado no mês
- Churn rate mensal

### Dashboard "Produto" (atualização semanal)
- % trials com CSV importado no dia 1
- % usuários ativos com ≥ 1 alerta configurado
- Plan gate conversion por feature
- DAU/MAU ratio

### Dashboard "Retenção" (atualização mensal)
- Cohort retention (% ativos por mês após signup)
- NPS score (p50, distribuição)
- Feature adoption por plano

---

## 7. Implementação — Prioridade de Desenvolvimento

### Sprint 1 (antes do beta)
```typescript
// PostHog provider no layout.tsx
posthog.identify(user.id, {
  plan: subscription.plan,
  broker_susep: broker.susep,
  policies_count: broker.policies_count,
  trial_started_at: subscription.trial_start,
});

// Evento crítico no CSV import
posthog.capture('csv_import_completed', {
  policies_imported: result.count,
  time_to_import_ms: Date.now() - importStartTime,
});
```

### Sprint 2 (antes do lançamento público)
- PlanGate analytics (`plan_gate_shown`, `upgrade_clicked`)
- NPS widget (PostHog surveys — nativo)
- Funis configurados no dashboard

### Sprint 3 (pós-lançamento)
- Session recording (PostHog) para páginas críticas: onboarding, pricing, plan gate
- A/B test framework via PostHog feature flags (trial 14d vs 7d)

---

## 8. Privacidade & LGPD

- **Dados pessoais de clientes do corretor:** NUNCA enviar ao PostHog (nome, CPF, apólice)
- **Dados permitidos:** IDs anonimizados, contagens, timestamps, planos
- **Opt-out:** Respeitar `Do Not Track` + incluir opção de opt-out nas configurações da conta
- **Retenção de dados:** 12 meses (configurar data retention no PostHog)
- **Consentimento:** Cookie banner na primeira visita (landing page)

---

*analytics-plan v1.0 — Premia · Morgan @pm · 2026-05-11*  
*Referências: docs/prd.md (OKRs Seção 1), docs/billing-spec.md*
