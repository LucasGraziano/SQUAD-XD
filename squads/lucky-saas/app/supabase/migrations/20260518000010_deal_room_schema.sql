-- =============================================================
-- Lucky SaaS — Epic 8: Deal Room — Schema Evolution
-- Migration: 20260518000010_deal_room_schema.sql
-- ADR: docs/architecture/adrs/ADR-006-deal-room.md
-- =============================================================

-- 1. Expandir status de quote_requests para suportar ciclo completo de deal
ALTER TABLE quote_requests
  DROP CONSTRAINT IF EXISTS quote_requests_status_check;

ALTER TABLE quote_requests
  ADD CONSTRAINT quote_requests_status_check
  CHECK (status IN (
    'prospecting',    -- lead puro, sem cotação montada
    'draft',          -- cotação sendo montada
    'sent',           -- enviada ao cliente para aprovação
    'approved',       -- cliente aprovou
    'submitted',      -- enviada à seguradora
    'under_analysis', -- seguradora analisando
    'issued',         -- seguradora emitiu, aguarda registro
    'contracted',     -- apólice criada
    'rejected'        -- recusada (pelo cliente ou seguradora)
  ));

-- 2. Adicionar campos de proposta à seguradora (todos nullable — zero breaking change)
ALTER TABLE quote_requests
  ADD COLUMN IF NOT EXISTS proposal_number   TEXT,
  ADD COLUMN IF NOT EXISTS protocol_number   TEXT,
  ADD COLUMN IF NOT EXISTS response_deadline DATE,
  ADD COLUMN IF NOT EXISTS rejection_reason  TEXT,
  ADD COLUMN IF NOT EXISTS submitted_at      TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS issued_at         TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS source            TEXT,
  ADD COLUMN IF NOT EXISTS original_lead_id  UUID REFERENCES leads(id) ON DELETE SET NULL;

-- 3. Criar deal_stage_history — auditoria completa de transições
CREATE TABLE IF NOT EXISTS deal_stage_history (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id     UUID        NOT NULL REFERENCES quote_requests(id) ON DELETE CASCADE,
  broker_id   UUID        NOT NULL REFERENCES brokers(id)        ON DELETE CASCADE,
  from_stage  TEXT        NOT NULL,
  to_stage    TEXT        NOT NULL,
  note        TEXT,
  changed_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS deal_stage_history_deal_id_idx    ON deal_stage_history (deal_id);
CREATE INDEX IF NOT EXISTS deal_stage_history_broker_id_idx  ON deal_stage_history (broker_id);

ALTER TABLE deal_stage_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "broker own deal history" ON deal_stage_history
  FOR ALL USING (
    broker_id = (SELECT id FROM brokers WHERE user_id = auth.uid() LIMIT 1)
  )
  WITH CHECK (
    broker_id = (SELECT id FROM brokers WHERE user_id = auth.uid() LIMIT 1)
  );

-- 4. [SKIPPED] Migração leads→quote_requests — lead_id não existe em quote_requests neste projeto.
-- 5. [SKIPPED] Migração proposals→quote_requests — depende de lead_id.

-- 6. Índice adicional para queries de deals submetidos por período
CREATE INDEX IF NOT EXISTS quote_requests_submitted_at_idx
  ON quote_requests (broker_id, submitted_at)
  WHERE submitted_at IS NOT NULL;

-- NOTA: tabela proposals mantida por 1 sprint para rollback safety.
-- Remover após Epic 8 estabilizar em produção.
COMMENT ON TABLE proposals IS 'DEPRECATED — dados migrados para quote_requests (Epic 8 Deal Room). Remover após estabilização.';
