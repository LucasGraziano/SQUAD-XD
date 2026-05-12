# Premia — Billing & Trial Specification

**Versão:** 1.0  
**Data:** 2026-05-11  
**Autor:** Morgan @pm  
**Stack:** Stripe + Supabase (`subscriptions` table) + Next.js Server Actions

---

## 1. Trial

| Parâmetro | Valor | Justificativa |
|-----------|-------|--------------|
| Duração | **14 dias** | Variante A nos testes de pricing; tempo suficiente para Carlos importar CSV e ver valor |
| Cartão na entrada | **Não** | Reduz fricção de onboarding; risco de fraude baixo dado perfil do usuário |
| Plano de trial | **Profissional** | Expõe o plano âncora; Portal + e-mail automático criam o aha moment |
| Limite durante trial | Nenhum | Trial deve ser a experiência completa do Profissional |
| Lembrete | Dia 7 e dia 13 (e-mail + in-app banner) | "X dias restantes — não perca seus alertas configurados" |

### Trial Expiration — Estado Hard Block
Quando o trial expira sem conversão:
- Dashboard exibe banner full-width vermelho: **"Seu trial encerrou. Seus dados estão seguros — escolha um plano para continuar."**
- Navegação bloqueada: apenas `/pricing` e `/account` acessíveis
- Dados preservados por **30 dias** após expiração (sem deletar)
- Após 30 dias sem conversão: conta marcada `status: churned`, dados anonimizados (LGPD)
- **Não usar soft warning** — confusão sobre o que o usuário pode fazer causa suporte desnecessário

---

## 2. Planos & Limites Técnicos

| Limite | Solo | Profissional | Equipe |
|--------|------|-------------|--------|
| Clientes | 100 (hard) | Ilimitado | Ilimitado |
| Usuários | 1 | 1 | 5 |
| Apólices | até 100 clientes × N | Ilimitado | Ilimitado |
| Armazenamento (Portal) | — | 500 MB | 2 GB |
| E-mails automáticos/mês | — | 500 | 2.000 |

**Hard vs. Soft limits:**
- Hard: bloqueia a ação + exibe `<PlanGate>` (100 clientes no Solo, 2º usuário no Profissional)
- Soft: exibe aviso mas permite continuar (e-mail próximo do limite — alerta aos 400/500)

---

## 3. Lifecycle de Assinatura

```
[Trial] ──── converte ────► [Ativo]
   │                           │
   │ expira                    │ cancela / inadimplência
   ▼                           ▼
[Expirado] ─── 30 dias ──► [Churned]
                               │
                               │ reativa
                               ▼
                           [Ativo] (novo ciclo)
```

### Estados da `subscriptions` table

```sql
status: 'trialing' | 'active' | 'past_due' | 'canceled' | 'churned'
plan:   'solo' | 'profissional' | 'equipe' | 'enterprise'
```

---

## 4. Upgrade & Downgrade

### Upgrade (ex: Solo → Profissional)
- **Timing:** Imediato (Stripe `proration_behavior: 'always_invoice'`)
- **Cobrança:** Proporcional ao período restante do ciclo atual
- **UX:** Modal de confirmação com breakdown do valor proporcional
- **Acesso:** Liberado em < 2 segundos via webhook `customer.subscription.updated`

### Downgrade (ex: Profissional → Solo)
- **Timing:** Aplicado no **próximo ciclo** (não imediato — evita perda de acesso pago)
- **Dados afetados:**
  - Apólices acima de 100 clientes → ficam `read-only` (não deletadas)
  - Portal do Cliente → links existentes exibem mensagem: "Corretor atualizou o plano — entre em contato"
  - E-mails automáticos → desativados (campanhas ativas pausadas)
- **Banner in-app:** "Downgrade agendado para DD/MM. Seus dados estão preservados."

### Cancelamento
- Aplicado no fim do período pago (Stripe `cancel_at_period_end: true`)
- Dados preservados 30 dias no estado `canceled`
- E-mail de winback no dia 7 e dia 25 após cancelamento

---

## 5. Stripe Webhooks — Eventos Críticos

| Evento Stripe | Ação no Premia | Prioridade |
|---------------|---------------|------------|
| `customer.subscription.created` | Criar registro em `subscriptions`, marcar status `trialing` ou `active` | P0 |
| `customer.subscription.updated` | Atualizar `plan` e `status` em tempo real | P0 |
| `customer.subscription.deleted` | Marcar `canceled`, iniciar countdown de 30 dias | P0 |
| `invoice.payment_succeeded` | Confirmar pagamento, renovar ciclo | P0 |
| `invoice.payment_failed` | Marcar `past_due`, enviar e-mail de falha de pagamento | P0 |
| `invoice.payment_action_required` | E-mail com link de autenticação (3DS) | P1 |
| `customer.subscription.trial_will_end` | Disparo 3 dias antes — e-mail de urgência "trial encerrando" | P1 |

### Segurança de Webhooks
```typescript
// Sempre verificar assinatura Stripe antes de processar
const sig = headers['stripe-signature'];
const event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
```

---

## 6. Billing Portal

Usar Stripe Customer Portal (hosted) para:
- Troca de cartão de crédito
- Histórico de faturas
- Cancelamento de assinatura
- Upgrade/downgrade de plano

Ativar via: `stripe.billingPortal.sessions.create({ customer: customerId, return_url: '/account' })`

---

## 7. Failure Recovery — Inadimplência

| Dia | Ação |
|-----|------|
| D+0 | Pagamento falhou → e-mail automático Stripe |
| D+3 | Retry automático Stripe (2ª tentativa) |
| D+7 | Retry automático Stripe (3ª tentativa) + e-mail manual Premia |
| D+14 | Status `past_due` → acesso reduzido (read-only) |
| D+21 | Status `canceled` → 30 dias de grace period |

---

*billing-spec v1.0 — Premia · Morgan @pm · 2026-05-11*  
*Referências: docs/prd.md (Seção 4), docs/architecture.md*
