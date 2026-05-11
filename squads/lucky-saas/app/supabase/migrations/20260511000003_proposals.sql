CREATE TABLE proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  broker_id UUID NOT NULL REFERENCES brokers(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  proposal_number TEXT,
  protocol_number TEXT,
  seguradora TEXT NOT NULL,
  ramo TEXT NOT NULL,
  premium_estimate NUMERIC(12,2),
  commission_pct NUMERIC(5,2),
  status TEXT NOT NULL DEFAULT 'rascunho'
    CHECK (status IN ('rascunho','enviada','em_analise','emitida','recusada','cancelada')),
  sent_at TIMESTAMPTZ,
  response_at TIMESTAMPTZ,
  notes TEXT,
  policy_id UUID REFERENCES policies(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX ON proposals (broker_id, status);

ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "broker own proposals" ON proposals
  FOR ALL USING (broker_id = (SELECT id FROM brokers WHERE user_id = auth.uid()));
