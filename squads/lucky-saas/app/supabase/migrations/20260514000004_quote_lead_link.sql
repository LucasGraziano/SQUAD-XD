-- =============================================================
-- Lucky SaaS — Epic 7: Story 7.6 — Cotação a partir de Lead
-- Migration: 20260514000004_quote_lead_link.sql
-- =============================================================

-- Link cotação → lead de origem
ALTER TABLE quote_requests
  ADD COLUMN IF NOT EXISTS lead_id UUID REFERENCES leads(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_quote_requests_lead_id ON quote_requests(lead_id);
