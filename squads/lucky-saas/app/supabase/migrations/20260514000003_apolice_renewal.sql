-- =============================================================
-- Lucky SaaS — Epic 7: Story 7.5 — Renovação 1 Click
-- Migration: 20260514000003_apolice_renewal.sql
-- =============================================================

-- Link apólice → cotação de renovação gerada
ALTER TABLE policies
  ADD COLUMN IF NOT EXISTS renewal_quote_id      UUID REFERENCES quote_requests(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS renewed_by_apolice_id UUID REFERENCES policies(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_policies_renewal_quote ON policies(renewal_quote_id);
