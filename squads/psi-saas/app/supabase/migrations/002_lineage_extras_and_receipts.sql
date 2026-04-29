-- ══════════════════════════════════════════════════════════
-- Vínculo — Migration 002
-- Adds: lineage extras, payment notes, abandonment indexes
-- ══════════════════════════════════════════════════════════

-- Add missing columns to lineage_analyses
ALTER TABLE lineage_analyses
  ADD COLUMN IF NOT EXISTS top_techniques  TEXT[]  NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS top_themes      TEXT[]  NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS insight         TEXT;

-- Add notes column to payments (free-form memo)
ALTER TABLE payments
  ADD COLUMN IF NOT EXISTS notes TEXT;

-- Better composite index for abandonment queries
CREATE INDEX IF NOT EXISTS idx_abandonment_psy_score
  ON abandonment_scores(psychologist_id, score DESC);

CREATE INDEX IF NOT EXISTS idx_sessions_status
  ON sessions(psychologist_id, status);

CREATE INDEX IF NOT EXISTS idx_payments_due_date
  ON payments(psychologist_id, due_date);
