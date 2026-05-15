-- =============================================================
-- Lucky SaaS — Epic 7: Story 7.8 — Link de Compartilhamento
-- Migration: 20260514000006_quote_share_token.sql
-- =============================================================

-- Token público único + métricas de visualização
ALTER TABLE quote_requests
  ADD COLUMN IF NOT EXISTS share_token   UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
  ADD COLUMN IF NOT EXISTS view_count    INT  DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_viewed_at TIMESTAMPTZ;

-- Backfill share_token para registros existentes sem token (caso haja NULL)
UPDATE quote_requests SET share_token = gen_random_uuid() WHERE share_token IS NULL;

-- Aprovação pública via token (sem auth)
CREATE OR REPLACE FUNCTION approve_quote_by_token(p_token UUID)
RETURNS TABLE(quote_id UUID, new_status TEXT) AS $$
DECLARE
  v_quote quote_requests%ROWTYPE;
BEGIN
  SELECT * INTO v_quote FROM quote_requests WHERE share_token = p_token;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Proposta não encontrada';
  END IF;

  IF v_quote.status != 'sent' THEN
    RAISE EXCEPTION 'Proposta não está em estado enviada';
  END IF;

  UPDATE quote_requests
    SET status = 'approved', approved_at = now(),
        view_count = view_count + 1, last_viewed_at = now()
    WHERE share_token = p_token;

  RETURN QUERY SELECT v_quote.id, 'approved'::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE INDEX IF NOT EXISTS idx_quote_requests_share_token ON quote_requests(share_token);
