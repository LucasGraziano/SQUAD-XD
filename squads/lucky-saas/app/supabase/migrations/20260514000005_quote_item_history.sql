-- =============================================================
-- Lucky SaaS — Epic 7: Story 7.7 — Histórico de Cotação
-- Migration: 20260514000005_quote_item_history.sql
-- =============================================================

CREATE TABLE IF NOT EXISTS quote_item_history (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_request_id UUID        NOT NULL REFERENCES quote_requests(id) ON DELETE CASCADE,
  quote_item_id    UUID        REFERENCES quote_items(id) ON DELETE SET NULL,
  broker_id        UUID        NOT NULL REFERENCES brokers(id) ON DELETE CASCADE,
  action           TEXT        NOT NULL, -- 'created' | 'updated' | 'deleted' | 'recommended'
  snapshot         JSONB       NOT NULL DEFAULT '{}',
  changed_at       TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE quote_item_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "broker own item history" ON quote_item_history
  FOR ALL USING (broker_id = (SELECT id FROM brokers WHERE user_id = auth.uid()))
  WITH CHECK (broker_id = (SELECT id FROM brokers WHERE user_id = auth.uid()));

CREATE INDEX IF NOT EXISTS idx_quote_item_history_quote ON quote_item_history(quote_request_id);
CREATE INDEX IF NOT EXISTS idx_quote_item_history_item ON quote_item_history(quote_item_id);
