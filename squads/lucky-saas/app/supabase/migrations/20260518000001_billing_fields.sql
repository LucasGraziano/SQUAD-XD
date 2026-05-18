-- Story 6.3: billing fields in brokers table
ALTER TABLE brokers
  ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS subscription_id TEXT,
  ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'trial'
    CHECK (subscription_status IN ('trial', 'active', 'past_due', 'canceled', 'churned')),
  ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'profissional'
    CHECK (plan IN ('solo', 'profissional', 'equipe', 'enterprise')),
  ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMPTZ DEFAULT (now() + interval '14 days'),
  ADD COLUMN IF NOT EXISTS current_period_end TIMESTAMPTZ;
