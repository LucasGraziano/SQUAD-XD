# Database — Premia SaaS

**Versão:** 1.0 (retroativo)
**Data:** 2026-05-14
**Autor:** @data-engineer (Dara) + @master (Orion)
**Engine:** PostgreSQL 15 (via Supabase)

---

## 1. Visão Geral do Schema

Premia usa um schema único (`public`) com isolamento multi-tenant implementado via **Row Level Security (RLS)**. Todos os registros pertencem a um broker (corretor) identificado por `broker_id` e a função `get_broker_id()` garante que cada query retorne apenas dados do corretor autenticado.

### Mapa de Relacionamentos

```
auth.users (Supabase Auth)
    │ 1:1 (trigger on_auth_user_created)
    ▼
brokers ──────────────────────────────────────────────┐
    │                                                  │
    │ 1:N                                             │ FK (broker_id)
    ├──► clients ──────────────────────────────────►  │
    │        │ 1:N                                    │
    │        ├──► policies ──► commissions            │
    │        │        │ 1:N                           │
    │        │        └──► claims ──► claim_updates   │
    │        │                                        │
    │        ├──► client_events                       │
    │        └──► cross_sell_opportunities            │
    │                                                  │
    ├──► leads ──► lead_activities                   │
    │                                                  │
    ├──► alerts (policy/client/lead FK optional)      │
    ├──► quote_requests ──► quote_items               │
    │         │                                        │
    │         └──► quote_history_items               │
    │                                                  │
    ├──► proposals ──► proposal_items                │
    │         │                                        │
    │         └──► proposal_share_tokens              │
    │                                                  │
    ├──► claims ──► claim_updates                    │
    ├──► pendencies                                   │
    ├──► calendar_events                              │
    ├──► commission_rules                             │
    ├──► push_subscriptions                           │
    ├──► onboarding_progress (1:1)                   │
    ├──► broker_first_win (1:1)                      │
    └──► birthday_notifications_log                   │
                                                       │
portal_access_tokens ──────────────────────────────────┘
```

---

## 2. Tabelas Principais

### 2.1 `brokers` — Corretores

Tabela central. Um registro por usuário autenticado. Criado automaticamente via trigger quando um usuário se cadastra.

```sql
CREATE TABLE brokers (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                 UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name                    TEXT NOT NULL,
    creci                   TEXT,          -- Registro SUSEP/CRECI
    phone                   TEXT,
    email                   TEXT NOT NULL,
    logo_url                TEXT,          -- Supabase Storage URL
    plan                    TEXT NOT NULL DEFAULT 'starter'
                            CHECK (plan IN ('starter', 'pro', 'broker')),
    stripe_customer_id      TEXT,
    stripe_subscription_id  TEXT,
    subscription_status     TEXT DEFAULT 'trialing',
    trial_ends_at           TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '14 days'),
    settings                JSONB NOT NULL DEFAULT '{}',
    created_at              TIMESTAMPTZ DEFAULT NOW(),
    updated_at              TIMESTAMPTZ DEFAULT NOW()
);
```

**Campos JSONB `settings`:** `{ susep?: string, corretora_nome?: string, cor_primaria?: string }`

**Planos válidos:** `starter`, `pro`, `broker` (enterprise gerenciado fora do DB)

**Índices:** `user_id`, `stripe_customer_id`

---

### 2.2 `clients` — Clientes do Corretor

```sql
CREATE TABLE clients (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    broker_id   UUID NOT NULL REFERENCES brokers(id) ON DELETE CASCADE,
    name        TEXT NOT NULL,
    cpf_cnpj    TEXT,
    email       TEXT,
    phone       TEXT NOT NULL,
    birth_date  DATE,              -- Para alertas de aniversário
    address     JSONB,             -- { rua, numero, bairro, cidade, estado, cep }
    tags        TEXT[] DEFAULT '{}',
    notes       TEXT,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);
```

**Índices:** `(broker_id)`, `(broker_id, name)`, `(birth_date) WHERE birth_date IS NOT NULL`

---

### 2.3 `policies` — Apólices

```sql
CREATE TABLE policies (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    broker_id           UUID NOT NULL REFERENCES brokers(id) ON DELETE CASCADE,
    client_id           UUID NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
    policy_number       TEXT,
    ramo                TEXT NOT NULL,        -- 'auto', 'vida', 'saude', 'residencial', etc.
    seguradora          TEXT NOT NULL,
    start_date          DATE NOT NULL,
    end_date            DATE NOT NULL,
    premium_total       NUMERIC(12,2) NOT NULL,
    payment_frequency   TEXT DEFAULT 'anual',
    installments        INTEGER DEFAULT 1,
    commission_pct      NUMERIC(5,2) NOT NULL,
    commission_expected NUMERIC(12,2) GENERATED ALWAYS AS
                        (premium_total * commission_pct / 100) STORED,   -- Coluna gerada
    commission_type     TEXT DEFAULT 'angariacao',
    status              TEXT NOT NULL DEFAULT 'ativa'
                        CHECK (status IN ('ativa', 'vencida', 'cancelada', 'suspensa', 'renovada')),
    parent_policy_id    UUID REFERENCES policies(id),   -- Apólice original (self-reference)
    renewed_by_apolice_id UUID REFERENCES policies(id), -- Nova apólice que substituiu esta
    renewal_quote_id    UUID,                            -- Quote de renovação associada
    notes               TEXT,
    metadata            JSONB DEFAULT '{}',
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    updated_at          TIMESTAMPTZ DEFAULT NOW()
);
```

**`commission_expected`:** Coluna GENERATED ALWAYS — calculada automaticamente, nunca inserida manualmente.

**`renewed_by_apolice_id`:** Quando uma apólice é renovada, a apólice **antiga** recebe esta coluna preenchida com o ID da **nova** apólice. Status derivado: se `IS NOT NULL` → status visual = 'renovada'.

**Índices:** `(broker_id)`, `(client_id)`, `(end_date) WHERE status='ativa'`, `(broker_id, ramo)`, `(broker_id, seguradora)`, UNIQUE `(broker_id, policy_number, seguradora) WHERE policy_number IS NOT NULL`

---

### 2.4 `leads` — Pipeline de Vendas

```sql
CREATE TABLE leads (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    broker_id        UUID NOT NULL REFERENCES brokers(id) ON DELETE CASCADE,
    client_id        UUID REFERENCES clients(id) ON DELETE SET NULL,  -- Opcional
    name             TEXT NOT NULL,
    phone            TEXT NOT NULL,
    email            TEXT,
    ramo             TEXT,
    status           TEXT NOT NULL DEFAULT 'novo'
                     CHECK (status IN ('novo', 'cotacao_enviada', 'negociacao', 'fechado', 'perdido')),
    source           TEXT DEFAULT 'manual'
                     CHECK (source IN ('manual', 'manychat', 'instagram', 'indicacao', 'site')),
    last_activity_at TIMESTAMPTZ DEFAULT NOW(),
    closed_at        TIMESTAMPTZ,
    lost_reason      TEXT,
    notes            TEXT,
    metadata         JSONB DEFAULT '{}',
    created_at       TIMESTAMPTZ DEFAULT NOW(),
    updated_at       TIMESTAMPTZ DEFAULT NOW()
);
```

**Colunas Kanban:** status é o mapeamento para as colunas do pipeline.

---

### 2.5 `commissions` — Comissões

```sql
CREATE TABLE commissions (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    broker_id        UUID NOT NULL REFERENCES brokers(id) ON DELETE CASCADE,
    policy_id        UUID NOT NULL REFERENCES policies(id) ON DELETE CASCADE,
    expected_amount  NUMERIC(12,2) NOT NULL,
    received_amount  NUMERIC(12,2),
    expected_date    DATE NOT NULL,
    received_date    DATE,
    status           TEXT NOT NULL DEFAULT 'pendente'
                     CHECK (status IN ('pendente', 'recebido', 'parcial', 'atrasado', 'cancelado')),
    divergence_amount NUMERIC(12,2) GENERATED ALWAYS AS (
                         CASE WHEN received_amount IS NOT NULL
                         THEN received_amount - expected_amount
                         ELSE NULL END
                     ) STORED,              -- Coluna gerada: diferença recebido vs esperado
    reference_month  TEXT,
    notes            TEXT,
    created_at       TIMESTAMPTZ DEFAULT NOW(),
    updated_at       TIMESTAMPTZ DEFAULT NOW()
);
```

---

### 2.6 `alerts` — Central de Alertas

```sql
CREATE TABLE alerts (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    broker_id     UUID NOT NULL REFERENCES brokers(id) ON DELETE CASCADE,
    policy_id     UUID REFERENCES policies(id) ON DELETE CASCADE,    -- Opcional
    client_id     UUID REFERENCES clients(id) ON DELETE CASCADE,     -- Opcional
    lead_id       UUID REFERENCES leads(id) ON DELETE CASCADE,       -- Opcional
    type          TEXT NOT NULL,        -- 'renewal', 'birthday', 'overdue', etc.
    title         TEXT NOT NULL,
    description   TEXT,
    scheduled_for DATE NOT NULL,
    status        TEXT NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending', 'sent', 'dismissed', 'snoozed')),
    sent_at       TIMESTAMPTZ,
    metadata      JSONB DEFAULT '{}',
    created_at    TIMESTAMPTZ DEFAULT NOW()
);
```

**`type` valores em uso:** `'renewal'` (vencimento), `'birthday'` (aniversário de cliente), `'overdue'` (comissão atrasada)

**`metadata`:** Armazena dados extras por tipo. Ex: `{ daysUntilExpiry: 30, crossSellSuggestion: 'Seguro Auto' }`

---

### 2.7 `claims` — Sinistros

```sql
CREATE TABLE claims (
    id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    broker_id              UUID NOT NULL REFERENCES brokers(id) ON DELETE CASCADE,
    policy_id              UUID NOT NULL REFERENCES policies(id) ON DELETE RESTRICT,
    client_id              UUID NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
    occurrence_date        DATE NOT NULL,
    claim_type             TEXT NOT NULL
                           CHECK (claim_type IN ('colisao', 'roubo', 'incendio', 'alagamento', 'outros')),
    description            TEXT,
    insurer_process_number TEXT,     -- Número do processo na seguradora
    estimated_value        NUMERIC(12,2),
    status                 TEXT NOT NULL DEFAULT 'open'
                           CHECK (status IN ('open', 'analyzing', 'awaiting_docs', 'approved', 'paid', 'closed', 'denied')),
    created_at             TIMESTAMPTZ DEFAULT now(),
    updated_at             TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE claim_updates (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    claim_id    UUID NOT NULL REFERENCES claims(id) ON DELETE CASCADE,
    broker_id   UUID NOT NULL REFERENCES brokers(id) ON DELETE CASCADE,
    old_status  TEXT,
    new_status  TEXT NOT NULL,
    note        TEXT,
    created_at  TIMESTAMPTZ DEFAULT now()
);
```

---

### 2.8 `quote_requests` — Cotações (Multicálculo)

```sql
CREATE TABLE quote_requests (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    broker_id    UUID NOT NULL REFERENCES brokers(id) ON DELETE CASCADE,
    client_id    UUID REFERENCES clients(id),
    lead_id      UUID REFERENCES leads(id),           -- Link com pipeline
    ramo         TEXT NOT NULL,
    form_data    JSONB NOT NULL DEFAULT '{}',          -- Dados do formulário por ramo
    status       TEXT NOT NULL DEFAULT 'draft'
                 CHECK (status IN ('draft','sent','approved','rejected','expired','converted')),
    converted_at TIMESTAMPTZ,
    policy_id    UUID REFERENCES policies(id),         -- Apólice gerada
    renewal_quote_id UUID,                             -- Se é cotação de renovação
    share_token  TEXT UNIQUE,                          -- Token para link público
    share_expires_at TIMESTAMPTZ,
    created_at   TIMESTAMPTZ DEFAULT now(),
    updated_at   TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE quote_items (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quote_request_id UUID NOT NULL REFERENCES quote_requests(id) ON DELETE CASCADE,
    seguradora      TEXT NOT NULL,
    coverage_name   TEXT NOT NULL,
    premium         NUMERIC(12,2) NOT NULL,
    commission_pct  NUMERIC(5,2),
    details         JSONB DEFAULT '{}',
    created_at      TIMESTAMPTZ DEFAULT now()
);
```

**`quote_history_items`:** Snapshot de cada versão da cotação (Story 7.7) — permite ver histórico de edições.

---

### 2.9 `proposals` — Propostas Comerciais

```sql
CREATE TABLE proposals (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    broker_id    UUID NOT NULL REFERENCES brokers(id) ON DELETE CASCADE,
    client_id    UUID NOT NULL REFERENCES clients(id),
    quote_id     UUID REFERENCES quote_requests(id),
    title        TEXT NOT NULL,
    status       TEXT NOT NULL DEFAULT 'draft'
                 CHECK (status IN ('draft','sent','approved','rejected','expired')),
    valid_until  DATE,
    pdf_url      TEXT,
    signed_doc_url TEXT,
    zapsign_doc_id TEXT,
    notes        TEXT,
    created_at   TIMESTAMPTZ DEFAULT now(),
    updated_at   TIMESTAMPTZ DEFAULT now()
);
```

**`proposal_share_tokens`:** Token público para cliente ver proposta sem login (Story 7.8).

---

### 2.10 `pendencies` — Pendências por Apólice

```sql
CREATE TABLE pendencies (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    broker_id   UUID NOT NULL REFERENCES brokers(id) ON DELETE CASCADE,
    policy_id   UUID NOT NULL REFERENCES policies(id) ON DELETE CASCADE,
    client_id   UUID NOT NULL REFERENCES clients(id),
    title       TEXT NOT NULL,
    description TEXT,
    due_date    DATE NOT NULL,
    status      TEXT NOT NULL DEFAULT 'aberta'
                CHECK (status IN ('aberta', 'em_andamento', 'resolvida')),
    resolved_at TIMESTAMPTZ,
    created_at  TIMESTAMPTZ DEFAULT now(),
    updated_at  TIMESTAMPTZ DEFAULT now()
);
```

---

### 2.11 `cross_sell_opportunities` — Oportunidades de Cross-sell

```sql
CREATE TABLE cross_sell_opportunities (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    broker_id        UUID NOT NULL REFERENCES brokers(id) ON DELETE CASCADE,
    client_id        UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    ramo_sugerido    TEXT NOT NULL,       -- Ramo que o cliente não tem
    reason           TEXT NOT NULL,       -- "Tem auto, mas não tem vida"
    score            INTEGER NOT NULL CHECK (score BETWEEN 1 AND 5),
    status           TEXT NOT NULL DEFAULT 'aberta'
                     CHECK (status IN ('aberta', 'em_andamento', 'fechada', 'perdida', 'dispensada')),
    dismissed_until  DATE,
    lost_reason      TEXT,
    linked_policy_id UUID REFERENCES policies(id),  -- Apólice gerada (quando fechada)
    notes            TEXT,
    created_at       TIMESTAMPTZ DEFAULT NOW(),
    updated_at       TIMESTAMPTZ DEFAULT NOW()
);
```

---

### 2.12 `birthday_notifications_log` — Controle de Aniversários

Evita enviar a mesma notificação de aniversário mais de uma vez por ano por cliente.

```sql
CREATE TABLE birthday_notifications_log (
    id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id   UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    broker_id   UUID NOT NULL REFERENCES brokers(id) ON DELETE CASCADE,
    year        INT NOT NULL,          -- Ano em que a notificação foi enviada
    notified_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(client_id, year)            -- Constraint: 1 por cliente por ano
);
```

---

### 2.13 `onboarding_progress` — Progresso de Onboarding

```sql
CREATE TABLE onboarding_progress (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    broker_id   UUID NOT NULL UNIQUE REFERENCES brokers(id) ON DELETE CASCADE,
    steps       JSONB NOT NULL DEFAULT '{}',
    completed   BOOLEAN GENERATED ALWAYS AS (
                    (steps->>'importApolice')::boolean AND
                    (steps->>'cadastrarCliente')::boolean AND
                    (steps->>'configurarAlerta')::boolean AND
                    (steps->>'gerarProposta')::boolean
                ) STORED,
    created_at  TIMESTAMPTZ DEFAULT now(),
    updated_at  TIMESTAMPTZ DEFAULT now()
);
```

**`steps` JSONB:** `{ importApolice: bool, cadastrarCliente: bool, configurarAlerta: bool, gerarProposta: bool }`

**`completed`:** Coluna GENERATED — true quando todos os passos estiverem marcados.

---

### 2.14 Outras Tabelas

| Tabela | Descrição |
|--------|-----------|
| `lead_activities` | Histórico de atividades por lead (tipo, conteúdo, status anterior) |
| `client_events` | Eventos de vida do cliente (aniversário, aniversário de apólice, evento custom) |
| `calendar_events` | Eventos da agenda do corretor |
| `commission_rules` | Regras configuráveis de comissão por seguradora/ramo |
| `push_subscriptions` | Tokens de Web Push por dispositivo/broker |
| `portal_access_tokens` | Tokens JWT para acesso do cliente ao portal |
| `broker_first_win` | Flag de primeiro alerta disparado (para celebration banner) |
| `quote_history_items` | Snapshots de versões de cotações |
| `proposal_share_tokens` | Tokens para compartilhamento público de propostas |

---

## 3. RLS — Row Level Security

### 3.1 Função Helper Central

```sql
CREATE OR REPLACE FUNCTION public.get_broker_id()
RETURNS UUID LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public AS $$
  SELECT id FROM public.brokers WHERE user_id = auth.uid() LIMIT 1;
$$;
```

`SECURITY DEFINER` + `STABLE` = executa com privilégio do owner (não do usuário), mas pode ser cacheada pelo PostgreSQL durante a transaction (evita N+1).

### 3.2 Padrão de Política

```sql
-- Padrão aplicado em TODAS as tabelas com broker_id:
CREATE POLICY "{tabela}_all" ON {tabela}
  FOR ALL 
  USING (broker_id = public.get_broker_id())
  WITH CHECK (broker_id = public.get_broker_id());
```

**Exceção — `brokers`:** RLS própria usando `user_id = auth.uid()` diretamente (sem `get_broker_id()`).

**Exceção — Portal:** Consultas do portal usam **admin client** (service role), que bypassa RLS. O isolamento é feito via lógica de aplicação (validação do token → extração do `client_id` → query com filtro explícito).

### 3.3 Tabelas com RLS Ativo

Todas as tabelas do schema `public` têm RLS habilitado. As políticas são definidas em `supabase/migrations/20260507000002_rls_policies.sql` e nas migrations de cada feature.

---

## 4. Migrations

| Migration | Data | Descrição |
|-----------|------|-----------|
| `20260507000001_initial_schema.sql` | 2026-05-07 | Schema inicial: brokers, clients, leads, policies, commissions, alerts, client_events, cross_sell_opportunities |
| `20260507000002_rls_policies.sql` | 2026-05-07 | RLS em todas as tabelas iniciais + função `get_broker_id()` |
| `20260508000001_schema_updates.sql` | 2026-05-08 | Ajustes pós-MVP inicial |
| `20260509000001_claims.sql` | 2026-05-09 | Tabelas claims + claim_updates + RLS |
| `20260509000002_client_portal_tokens.sql` | 2026-05-09 | portal_access_tokens |
| `20260510000001_broker_susep.sql` | 2026-05-10 | Campo SUSEP no broker + commission_rules |
| `20260510000002_quote_requests.sql` | 2026-05-10 | quote_requests + quote_items + RLS |
| `20260511000001_calendar.sql` | 2026-05-11 | calendar_events + RLS |
| `20260511000002_pendencies.sql` | 2026-05-11 | pendencies + RLS |
| `20260511000003_proposals.sql` | 2026-05-11 | proposals + proposal_items |
| `20260511000004_email_campaigns.sql` | 2026-05-11 | E-mail campaigns (Story 5.4 — future) |
| `20260511000005_commission_tracking.sql` | 2026-05-11 | Refinamentos de commissions |
| `20260511000008_push_subscriptions.sql` | 2026-05-11 | push_subscriptions + RLS |
| `20260514000001_onboarding_progress.sql` | 2026-05-14 | onboarding_progress (1:1 com broker) |
| `20260514000002_quote_status_flow.sql` | 2026-05-14 | Status flow de cotações + share_token |
| `20260514000003_apolice_renewal.sql` | 2026-05-14 | renewed_by_apolice_id + renewal_quote_id em policies |
| `20260514000004_quote_lead_link.sql` | 2026-05-14 | lead_id em quote_requests |
| `20260514000005_quote_item_history.sql` | 2026-05-14 | quote_history_items (versões de proposta) |
| `20260514000006_quote_share_token.sql` | 2026-05-14 | share_token + share_expires_at em proposals |
| `20260514000007_broker_first_win.sql` | 2026-05-14 | broker_first_win (primeiro alerta disparado) |
| `20260514000008_client_birthday.sql` | 2026-05-14 | birthday_notifications_log + índice em clients.birth_date |

---

## 5. Índices Estratégicos

```sql
-- Performance crítica: alertas pendentes do dia
CREATE INDEX idx_alerts_scheduled 
  ON alerts(broker_id, scheduled_for) WHERE status = 'pending';

-- Performance crítica: apólices vencendo
CREATE INDEX idx_policies_end_date 
  ON policies(end_date) WHERE status = 'ativa';

-- Birthday job: busca por mês/dia de nascimento
CREATE INDEX idx_clients_birthday_month_day
  ON clients (
    EXTRACT(MONTH FROM birth_date),
    EXTRACT(DAY FROM birth_date)
  ) WHERE birth_date IS NOT NULL;

-- Comissões esperadas por período
CREATE INDEX idx_commissions_expected_date 
  ON commissions(broker_id, expected_date);
```

---

## 6. Triggers

| Trigger | Tabela | Função | Comportamento |
|---------|--------|--------|--------------|
| `on_auth_user_created` | `auth.users` | `handle_new_user()` | Cria broker automaticamente no signup |
| `brokers_updated_at` | `brokers` | `update_updated_at()` | Atualiza `updated_at` em cada UPDATE |
| `clients_updated_at` | `clients` | `update_updated_at()` | Idem |
| `policies_updated_at` | `policies` | `update_updated_at()` | Idem |
| `leads_updated_at` | `leads` | `update_updated_at()` | Idem |
| `commissions_updated_at` | `commissions` | `update_updated_at()` | Idem |
| `claims_updated_at` | `claims` | `update_updated_at()` | Idem |

**Trigger de signup:**
```sql
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.brokers (user_id, name, email)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        NEW.email
    )
    ON CONFLICT (user_id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## Change Log

| Data | Autor | Descrição |
|------|-------|-----------|
| 2026-05-14 | @master (Orion) | Documento criado — schema completo documentado com 21 migrations |
