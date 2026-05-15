-- =============================================================
-- Lucky SaaS — Epic 7: Story 7.9 — First Win Notification
-- Migration: 20260514000007_broker_first_win.sql
-- =============================================================

ALTER TABLE brokers
  ADD COLUMN IF NOT EXISTS first_alert_fired_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS first_win_seen_at     TIMESTAMPTZ;
