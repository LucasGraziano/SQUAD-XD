-- =============================================================
-- Lucky SaaS — Agenda + Google Calendar
-- Migration: 20260511000001_calendar.sql
-- =============================================================

CREATE TABLE calendar_events (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  broker_id        UUID NOT NULL REFERENCES brokers(id) ON DELETE CASCADE,
  client_id        UUID REFERENCES clients(id) ON DELETE SET NULL,
  policy_id        UUID REFERENCES policies(id) ON DELETE SET NULL,
  title            TEXT NOT NULL,
  event_type       TEXT NOT NULL DEFAULT 'followup'
                   CHECK (event_type IN ('meeting', 'call', 'visit', 'followup')),
  scheduled_at     TIMESTAMPTZ NOT NULL,
  duration_minutes INT NOT NULL DEFAULT 30,
  notes            TEXT,
  google_event_id  TEXT,
  is_done          BOOLEAN NOT NULL DEFAULT false,
  created_at       TIMESTAMPTZ DEFAULT now(),
  updated_at       TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_calendar_events_broker ON calendar_events (broker_id, scheduled_at);
CREATE INDEX idx_calendar_events_client ON calendar_events (client_id) WHERE client_id IS NOT NULL;

CREATE TABLE google_calendar_tokens (
  broker_id     UUID PRIMARY KEY REFERENCES brokers(id) ON DELETE CASCADE,
  access_token  TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  expires_at    TIMESTAMPTZ,
  calendar_id   TEXT NOT NULL DEFAULT 'primary',
  google_email  TEXT,
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "broker_own_calendar_events" ON calendar_events
  USING (broker_id = (SELECT id FROM brokers WHERE user_id = auth.uid()))
  WITH CHECK (broker_id = (SELECT id FROM brokers WHERE user_id = auth.uid()));

ALTER TABLE google_calendar_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "broker_own_google_tokens" ON google_calendar_tokens
  USING (broker_id = (SELECT id FROM brokers WHERE user_id = auth.uid()))
  WITH CHECK (broker_id = (SELECT id FROM brokers WHERE user_id = auth.uid()));
