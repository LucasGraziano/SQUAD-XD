CREATE TABLE policy_pendencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  broker_id UUID NOT NULL REFERENCES brokers(id) ON DELETE CASCADE,
  policy_id UUID REFERENCES policies(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT NOT NULL DEFAULT 'medium'
    CHECK (priority IN ('high', 'medium', 'low')),
  due_date DATE,
  status TEXT NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'resolved')),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT policy_or_lead CHECK (policy_id IS NOT NULL OR lead_id IS NOT NULL)
);

CREATE INDEX ON policy_pendencies (broker_id, status);
CREATE INDEX ON policy_pendencies (policy_id);
CREATE INDEX ON policy_pendencies (lead_id);

ALTER TABLE policy_pendencies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "broker own pendencies" ON policy_pendencies
  FOR ALL USING (broker_id = (SELECT id FROM brokers WHERE user_id = auth.uid()));
