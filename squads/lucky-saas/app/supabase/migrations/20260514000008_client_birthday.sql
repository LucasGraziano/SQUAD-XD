-- birthday_notifications_log: tracks annual birthday notifications to prevent duplicates
CREATE TABLE birthday_notifications_log (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id  UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  broker_id  UUID NOT NULL REFERENCES brokers(id) ON DELETE CASCADE,
  year       INT NOT NULL,
  notified_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(client_id, year)
);

-- Index for birthday job: find clients with birthday today
-- birth_date already exists on clients from initial schema
CREATE INDEX IF NOT EXISTS idx_clients_birth_month_day
  ON clients (
    EXTRACT(MONTH FROM birth_date),
    EXTRACT(DAY FROM birth_date)
  )
  WHERE birth_date IS NOT NULL;
