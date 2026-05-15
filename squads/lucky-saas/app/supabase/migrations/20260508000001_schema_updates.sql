-- =============================================================
-- Lucky SaaS — Schema Updates v2
-- Migration: 20260508000001_schema_updates.sql
-- =============================================================

-- ── CLIENTS — novos campos ────────────────────────────────────
ALTER TABLE clients
    ADD COLUMN IF NOT EXISTS cep          TEXT,
    ADD COLUMN IF NOT EXISTS tipo_pessoa  TEXT DEFAULT 'pf'
                                          CHECK (tipo_pessoa IN ('pf', 'pj'));

-- ── POLICIES — franquia + anexo ──────────────────────────────
ALTER TABLE policies
    ADD COLUMN IF NOT EXISTS valor_franquia  NUMERIC(12,2),
    ADD COLUMN IF NOT EXISTS anexo_url       TEXT;

-- ── LEADS — recuperação de clientes ──────────────────────────
-- expected_renewal_date: quando o seguro do prospect vence no concorrente
-- recovery_notes: contexto para a reabordagem
ALTER TABLE leads
    ADD COLUMN IF NOT EXISTS expected_renewal_date  DATE,
    ADD COLUMN IF NOT EXISTS recovery_notes         TEXT;

-- Index para alertas de recuperação (busca por data de renovação futura)
CREATE INDEX IF NOT EXISTS idx_leads_renewal_date
    ON leads(broker_id, expected_renewal_date)
    WHERE expected_renewal_date IS NOT NULL AND status = 'perdido';
