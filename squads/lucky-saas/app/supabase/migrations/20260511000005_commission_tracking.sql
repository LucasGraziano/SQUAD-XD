ALTER TABLE policies
  ADD COLUMN IF NOT EXISTS commission_received NUMERIC(12,2),
  ADD COLUMN IF NOT EXISTS commission_received_at DATE,
  ADD COLUMN IF NOT EXISTS commission_status TEXT DEFAULT 'prevista'
    CHECK (commission_status IN ('prevista', 'recebida', 'vencida'));
