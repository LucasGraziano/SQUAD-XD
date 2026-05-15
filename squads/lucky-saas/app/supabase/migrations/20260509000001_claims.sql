-- =============================================================
-- Lucky SaaS — Sinistro Tracking
-- Migration: 20260509000001_claims.sql
-- =============================================================

CREATE TABLE claims (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  broker_id              UUID NOT NULL REFERENCES brokers(id) ON DELETE CASCADE,
  policy_id              UUID NOT NULL REFERENCES policies(id) ON DELETE RESTRICT,
  client_id              UUID NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
  occurrence_date        DATE NOT NULL,
  claim_type             TEXT NOT NULL
                         CHECK (claim_type IN ('colisao', 'roubo', 'incendio', 'alagamento', 'outros')),
  description            TEXT,
  insurer_process_number TEXT,
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

CREATE INDEX idx_claims_broker_id   ON claims(broker_id);
CREATE INDEX idx_claims_policy_id   ON claims(policy_id);
CREATE INDEX idx_claims_client_id   ON claims(client_id);
CREATE INDEX idx_claims_status      ON claims(broker_id, status);
CREATE INDEX idx_claim_updates_claim ON claim_updates(claim_id);

ALTER TABLE claims        ENABLE ROW LEVEL SECURITY;
ALTER TABLE claim_updates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "claims_all" ON claims
  FOR ALL USING (broker_id = public.get_broker_id())
  WITH CHECK (broker_id = public.get_broker_id());

CREATE POLICY "claim_updates_all" ON claim_updates
  FOR ALL USING (broker_id = public.get_broker_id())
  WITH CHECK (broker_id = public.get_broker_id());

CREATE TRIGGER claims_updated_at
  BEFORE UPDATE ON claims
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
