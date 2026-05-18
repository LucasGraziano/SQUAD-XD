ALTER TABLE brokers ADD COLUMN IF NOT EXISTS cancel_at_period_end BOOLEAN DEFAULT false;
