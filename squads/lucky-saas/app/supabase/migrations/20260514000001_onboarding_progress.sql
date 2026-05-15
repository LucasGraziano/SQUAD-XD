-- =============================================================
-- Lucky SaaS — Epic 7: Onboarding Checklist
-- Migration: 20260514000001_onboarding_progress.sql
-- =============================================================

ALTER TABLE brokers
  ADD COLUMN IF NOT EXISTS onboarding_progress JSONB NOT NULL DEFAULT '{
    "profile": false,
    "first_client": false,
    "first_apolice": false,
    "viewed_alertas": false,
    "shared_portal": false,
    "dismissed": false,
    "completed_at": null
  }';
