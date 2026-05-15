-- =============================================================
-- Lucky SaaS — Multicálculo: quote_requests + quote_items
-- Migration: 20260510000002_quote_requests.sql
-- =============================================================

CREATE TABLE quote_requests (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    broker_id           UUID NOT NULL REFERENCES brokers(id) ON DELETE CASCADE,
    client_id           UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    ramo                TEXT NOT NULL,
    object_description  TEXT,
    notes               TEXT,
    status              TEXT NOT NULL DEFAULT 'draft'
                        CHECK (status IN ('draft', 'sent')),
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    updated_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE quote_items (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quote_request_id    UUID NOT NULL REFERENCES quote_requests(id) ON DELETE CASCADE,
    broker_id           UUID NOT NULL REFERENCES brokers(id) ON DELETE CASCADE,
    seguradora          TEXT NOT NULL,
    premium_total       NUMERIC(12,2) NOT NULL,
    payment_frequency   TEXT DEFAULT 'anual'
                        CHECK (payment_frequency IN ('mensal', 'trimestral', 'semestral', 'anual')),
    franchise_value     NUMERIC(12,2),
    coverages           TEXT[] DEFAULT '{}',
    exclusions          TEXT[] DEFAULT '{}',
    broker_note         TEXT,
    is_recommended      BOOLEAN DEFAULT false,
    sort_order          INTEGER DEFAULT 0,
    created_at          TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "broker_quote_requests" ON quote_requests FOR ALL
    USING (broker_id = (SELECT id FROM brokers WHERE user_id = auth.uid()))
    WITH CHECK (broker_id = (SELECT id FROM brokers WHERE user_id = auth.uid()));
CREATE POLICY "broker_quote_items" ON quote_items FOR ALL
    USING (broker_id = (SELECT id FROM brokers WHERE user_id = auth.uid()))
    WITH CHECK (broker_id = (SELECT id FROM brokers WHERE user_id = auth.uid()));

CREATE INDEX idx_quote_requests_broker_id ON quote_requests(broker_id);
CREATE INDEX idx_quote_requests_client_id ON quote_requests(client_id);
CREATE INDEX idx_quote_items_quote_request_id ON quote_items(quote_request_id);

CREATE TRIGGER quote_requests_updated_at BEFORE UPDATE ON quote_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
