-- =============================================================
-- Lucky SaaS — Schema inicial
-- Migration: 20260507000001_initial_schema.sql
-- =============================================================

-- BROKERS
CREATE TABLE brokers (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                 UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name                    TEXT NOT NULL,
    creci                   TEXT,
    phone                   TEXT,
    email                   TEXT NOT NULL,
    logo_url                TEXT,
    plan                    TEXT NOT NULL DEFAULT 'starter' CHECK (plan IN ('starter', 'pro', 'broker')),
    stripe_customer_id      TEXT,
    stripe_subscription_id  TEXT,
    subscription_status     TEXT DEFAULT 'trialing',
    trial_ends_at           TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '14 days'),
    settings                JSONB NOT NULL DEFAULT '{}',
    created_at              TIMESTAMPTZ DEFAULT NOW(),
    updated_at              TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_brokers_user_id ON brokers(user_id);
CREATE INDEX idx_brokers_stripe_customer ON brokers(stripe_customer_id);

-- CLIENTS
CREATE TABLE clients (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    broker_id   UUID NOT NULL REFERENCES brokers(id) ON DELETE CASCADE,
    name        TEXT NOT NULL,
    cpf_cnpj    TEXT,
    email       TEXT,
    phone       TEXT NOT NULL,
    birth_date  DATE,
    address     JSONB,
    tags        TEXT[] DEFAULT '{}',
    notes       TEXT,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_clients_broker_id ON clients(broker_id);
CREATE INDEX idx_clients_name ON clients(broker_id, name);
CREATE INDEX idx_clients_birth_date ON clients(birth_date) WHERE birth_date IS NOT NULL;

-- LEADS
CREATE TABLE leads (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    broker_id        UUID NOT NULL REFERENCES brokers(id) ON DELETE CASCADE,
    client_id        UUID REFERENCES clients(id) ON DELETE SET NULL,
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

CREATE INDEX idx_leads_broker_id ON leads(broker_id);
CREATE INDEX idx_leads_status ON leads(broker_id, status);
CREATE INDEX idx_leads_last_activity ON leads(last_activity_at);

-- LEAD ACTIVITIES
CREATE TABLE lead_activities (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id         UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    broker_id       UUID NOT NULL REFERENCES brokers(id) ON DELETE CASCADE,
    type            TEXT NOT NULL CHECK (type IN ('status_change', 'note', 'contact')),
    content         TEXT NOT NULL,
    previous_status TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_lead_activities_lead_id ON lead_activities(lead_id);
CREATE INDEX idx_lead_activities_broker_id ON lead_activities(broker_id);

-- POLICIES (Apólices)
CREATE TABLE policies (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    broker_id           UUID NOT NULL REFERENCES brokers(id) ON DELETE CASCADE,
    client_id           UUID NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
    policy_number       TEXT,
    ramo                TEXT NOT NULL,
    seguradora          TEXT NOT NULL,
    start_date          DATE NOT NULL,
    end_date            DATE NOT NULL,
    premium_total       NUMERIC(12,2) NOT NULL,
    payment_frequency   TEXT DEFAULT 'anual'
                        CHECK (payment_frequency IN ('mensal', 'trimestral', 'semestral', 'anual')),
    installments        INTEGER DEFAULT 1,
    commission_pct      NUMERIC(5,2) NOT NULL,
    commission_expected NUMERIC(12,2) GENERATED ALWAYS AS (premium_total * commission_pct / 100) STORED,
    commission_type     TEXT DEFAULT 'angariacao'
                        CHECK (commission_type IN ('angariacao', 'renovacao', 'mista')),
    status              TEXT NOT NULL DEFAULT 'ativa'
                        CHECK (status IN ('ativa', 'vencida', 'cancelada', 'suspensa', 'renovada')),
    parent_policy_id    UUID REFERENCES policies(id),
    notes               TEXT,
    metadata            JSONB DEFAULT '{}',
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    updated_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_policies_broker_id ON policies(broker_id);
CREATE INDEX idx_policies_client_id ON policies(client_id);
CREATE INDEX idx_policies_end_date ON policies(end_date) WHERE status = 'ativa';
CREATE INDEX idx_policies_ramo ON policies(broker_id, ramo);
CREATE INDEX idx_policies_seguradora ON policies(broker_id, seguradora);
CREATE UNIQUE INDEX idx_policies_number_seguradora ON policies(broker_id, policy_number, seguradora)
    WHERE policy_number IS NOT NULL;

-- COMMISSIONS
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
                     ) STORED,
    reference_month  TEXT,
    notes            TEXT,
    created_at       TIMESTAMPTZ DEFAULT NOW(),
    updated_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_commissions_broker_id ON commissions(broker_id);
CREATE INDEX idx_commissions_policy_id ON commissions(policy_id);
CREATE INDEX idx_commissions_expected_date ON commissions(broker_id, expected_date);
CREATE INDEX idx_commissions_status ON commissions(broker_id, status);

-- ALERTS
CREATE TABLE alerts (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    broker_id     UUID NOT NULL REFERENCES brokers(id) ON DELETE CASCADE,
    policy_id     UUID REFERENCES policies(id) ON DELETE CASCADE,
    client_id     UUID REFERENCES clients(id) ON DELETE CASCADE,
    lead_id       UUID REFERENCES leads(id) ON DELETE CASCADE,
    type          TEXT NOT NULL,
    title         TEXT NOT NULL,
    description   TEXT,
    scheduled_for DATE NOT NULL,
    status        TEXT NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending', 'sent', 'dismissed', 'snoozed')),
    sent_at       TIMESTAMPTZ,
    metadata      JSONB DEFAULT '{}',
    created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_alerts_broker_id ON alerts(broker_id);
CREATE INDEX idx_alerts_scheduled ON alerts(broker_id, scheduled_for) WHERE status = 'pending';
CREATE INDEX idx_alerts_policy_id ON alerts(policy_id);

-- CLIENT EVENTS (aniversários, eventos de vida)
CREATE TABLE client_events (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    broker_id   UUID NOT NULL REFERENCES brokers(id) ON DELETE CASCADE,
    client_id   UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    type        TEXT NOT NULL CHECK (type IN ('birthday', 'policy_anniversary', 'life_event', 'custom')),
    title       TEXT NOT NULL,
    event_date  DATE NOT NULL,
    recurrent   BOOLEAN DEFAULT false,
    notes       TEXT,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_client_events_broker_id ON client_events(broker_id);
CREATE INDEX idx_client_events_date ON client_events(event_date);

-- CROSS-SELL OPPORTUNITIES
CREATE TABLE cross_sell_opportunities (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    broker_id       UUID NOT NULL REFERENCES brokers(id) ON DELETE CASCADE,
    client_id       UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    ramo_sugerido   TEXT NOT NULL,
    reason          TEXT NOT NULL,
    score           INTEGER NOT NULL CHECK (score BETWEEN 1 AND 5),
    status          TEXT NOT NULL DEFAULT 'aberta'
                    CHECK (status IN ('aberta', 'em_andamento', 'fechada', 'perdida', 'dispensada')),
    dismissed_until DATE,
    lost_reason     TEXT,
    linked_policy_id UUID REFERENCES policies(id),
    notes           TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_cross_sell_broker_id ON cross_sell_opportunities(broker_id);
CREATE INDEX idx_cross_sell_status ON cross_sell_opportunities(broker_id, status);

-- UPDATED_AT triggers
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER brokers_updated_at BEFORE UPDATE ON brokers FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER leads_updated_at BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER policies_updated_at BEFORE UPDATE ON policies FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER commissions_updated_at BEFORE UPDATE ON commissions FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER cross_sell_updated_at BEFORE UPDATE ON cross_sell_opportunities FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- TRIGGER: criar broker automaticamente no signup
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

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();
