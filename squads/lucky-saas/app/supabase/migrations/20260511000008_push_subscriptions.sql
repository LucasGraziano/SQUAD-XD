-- Story 6.6: PWA Push Subscriptions

CREATE TABLE push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  broker_id UUID NOT NULL REFERENCES brokers(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (broker_id, endpoint)
);

ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "broker own push subscriptions"
  ON push_subscriptions FOR ALL
  USING (broker_id = (SELECT id FROM brokers WHERE user_id = auth.uid()));

CREATE INDEX idx_push_subscriptions_broker_id ON push_subscriptions(broker_id);
