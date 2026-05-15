-- =============================================================
-- Lucky SaaS — Epic 7: Status Flow de Propostas
-- Migration: 20260514000002_quote_status_flow.sql
-- =============================================================

-- Expandir status constraint (draft→sent→approved→rejected→contracted)
ALTER TABLE quote_requests DROP CONSTRAINT IF EXISTS quote_requests_status_check;
ALTER TABLE quote_requests
  ADD CONSTRAINT quote_requests_status_check
  CHECK (status IN ('draft', 'sent', 'approved', 'rejected', 'contracted'));

-- Timestamps por estado e vínculo com apólice gerada
ALTER TABLE quote_requests
  ADD COLUMN IF NOT EXISTS sent_at       TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS approved_at   TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS rejected_at   TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS contracted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS apolice_id    UUID REFERENCES policies(id) ON DELETE SET NULL;

-- Histórico de transições de status
CREATE TABLE IF NOT EXISTS quote_status_history (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id    UUID        NOT NULL REFERENCES quote_requests(id) ON DELETE CASCADE,
  broker_id   UUID        NOT NULL REFERENCES brokers(id) ON DELETE CASCADE,
  from_status TEXT        NOT NULL,
  to_status   TEXT        NOT NULL,
  changed_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE quote_status_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "broker own history" ON quote_status_history
  FOR ALL USING (broker_id = (SELECT id FROM brokers WHERE user_id = auth.uid()))
  WITH CHECK (broker_id = (SELECT id FROM brokers WHERE user_id = auth.uid()));

CREATE INDEX IF NOT EXISTS idx_quote_status_history_quote_id ON quote_status_history(quote_id);
CREATE INDEX IF NOT EXISTS idx_quote_requests_status ON quote_requests(status);
CREATE INDEX IF NOT EXISTS idx_quote_requests_broker_status ON quote_requests(broker_id, status);
