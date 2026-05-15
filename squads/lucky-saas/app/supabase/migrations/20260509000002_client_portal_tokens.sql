-- =============================================================
-- Lucky SaaS — Portal do Cliente (tokens de acesso)
-- Migration: 20260509000002_client_portal_tokens.sql
-- =============================================================

CREATE TABLE client_portal_tokens (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  broker_id  UUID NOT NULL REFERENCES brokers(id) ON DELETE CASCADE,
  client_id  UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  token      TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  expires_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_portal_tokens_token     ON client_portal_tokens(token);
CREATE INDEX idx_portal_tokens_client_id ON client_portal_tokens(client_id);
CREATE INDEX idx_portal_tokens_broker_id ON client_portal_tokens(broker_id);

ALTER TABLE client_portal_tokens ENABLE ROW LEVEL SECURITY;

-- Brokers can manage their own tokens
CREATE POLICY "portal_tokens_broker_all" ON client_portal_tokens
  FOR ALL USING (broker_id = public.get_broker_id())
  WITH CHECK (broker_id = public.get_broker_id());

-- Public can read valid (non-revoked, non-expired) tokens by token value
-- This enables server-side validation with the anon key
CREATE POLICY "portal_tokens_public_read" ON client_portal_tokens
  FOR SELECT USING (
    revoked_at IS NULL
    AND (expires_at IS NULL OR expires_at > now())
  );
