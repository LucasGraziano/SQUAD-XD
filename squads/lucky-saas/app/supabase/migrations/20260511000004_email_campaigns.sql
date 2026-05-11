CREATE TABLE email_campaign_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  broker_id UUID NOT NULL REFERENCES brokers(id) ON DELETE CASCADE,
  policy_id UUID NOT NULL REFERENCES policies(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  campaign_type TEXT NOT NULL,
  sent_at TIMESTAMPTZ DEFAULT now(),
  resend_id TEXT,
  status TEXT NOT NULL DEFAULT 'sent',
  error_message TEXT
);

CREATE INDEX ON email_campaign_logs (broker_id, sent_at);
CREATE INDEX ON email_campaign_logs (policy_id, campaign_type);

ALTER TABLE email_campaign_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "broker own email logs" ON email_campaign_logs
  FOR ALL USING (broker_id = (SELECT id FROM brokers WHERE user_id = auth.uid()));

ALTER TABLE clients ADD COLUMN IF NOT EXISTS email_opt_out BOOLEAN DEFAULT false;
ALTER TABLE brokers ADD COLUMN IF NOT EXISTS renewal_emails_enabled BOOLEAN DEFAULT false;
ALTER TABLE brokers ADD COLUMN IF NOT EXISTS renewal_email_custom_text TEXT;
