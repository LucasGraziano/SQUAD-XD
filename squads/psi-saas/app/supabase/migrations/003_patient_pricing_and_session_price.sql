-- ─────────────────────────────────────────────────────────────────────────────
-- Migration 003 — Patient-level pricing + session price per patient
-- ─────────────────────────────────────────────────────────────────────────────
-- Adds per-patient pricing override: session_price_cents and billing_cycle.
-- Null means "use psychologist default" — the app falls back to psy settings.

ALTER TABLE patients
  ADD COLUMN IF NOT EXISTS session_price_cents INTEGER,
  ADD COLUMN IF NOT EXISTS billing_cycle       TEXT CHECK (billing_cycle IN ('per_session', 'weekly', 'monthly'));

COMMENT ON COLUMN patients.session_price_cents IS
  'Per-patient price override in cents. NULL = use psychologist default.';
COMMENT ON COLUMN patients.billing_cycle IS
  'Per-patient billing cycle override. NULL = use psychologist default.';
