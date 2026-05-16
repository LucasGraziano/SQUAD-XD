-- =============================================================
-- Lucky SaaS — Story 6.8 / 5.6: Vencimentos → Google Calendar
-- Migration: 20260516000001_policy_renewal_calendar.sql
-- =============================================================

-- Track which Google Calendar event was created for each policy's renewal reminder
ALTER TABLE policies
  ADD COLUMN IF NOT EXISTS renewal_calendar_event_id TEXT;
