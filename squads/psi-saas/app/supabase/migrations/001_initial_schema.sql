-- ══════════════════════════════════════════════════════════
-- Vínculo — Initial Schema
-- Migration: 001
-- CFP Res. 001/2009 compliant (20-year retention)
-- LGPD — Lei 13.709/2018
-- ══════════════════════════════════════════════════════════

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── Psychologists ────────────────────────────────────────
CREATE TABLE psychologists (
  id                        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id                   UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name                 TEXT NOT NULL,
  crp                       TEXT NOT NULL,
  email                     TEXT NOT NULL,
  phone                     TEXT,
  avatar_url                TEXT,
  bio                       TEXT,
  theoretical_orientation   TEXT,
  session_duration_minutes  INTEGER NOT NULL DEFAULT 50,
  session_price_cents       INTEGER NOT NULL DEFAULT 20000,
  billing_cycle             TEXT NOT NULL DEFAULT 'per_session' CHECK (billing_cycle IN ('per_session', 'weekly', 'monthly')),
  timezone                  TEXT NOT NULL DEFAULT 'America/Sao_Paulo',
  onboarding_completed      BOOLEAN NOT NULL DEFAULT FALSE,
  onboarding_step           INTEGER NOT NULL DEFAULT 0,
  created_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Patients ─────────────────────────────────────────────
CREATE TABLE patients (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  psychologist_id      UUID REFERENCES psychologists(id) ON DELETE RESTRICT NOT NULL,
  full_name            TEXT NOT NULL,
  email                TEXT,
  phone                TEXT,
  birth_date           DATE,
  cpf_encrypted        TEXT,  -- AES-256-GCM encrypted
  address              JSONB,
  emergency_contact    JSONB,
  source               TEXT,  -- indicação, redes sociais, etc.
  status               TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'paused')),
  lgpd_consent         BOOLEAN NOT NULL DEFAULT FALSE,
  lgpd_consent_date    TIMESTAMPTZ,
  notes                TEXT,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Availability Slots ───────────────────────────────────
CREATE TABLE availability_slots (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  psychologist_id   UUID REFERENCES psychologists(id) ON DELETE CASCADE NOT NULL,
  day_of_week       INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sunday
  start_time        TIME NOT NULL,
  end_time          TIME NOT NULL,
  is_recurring      BOOLEAN NOT NULL DEFAULT TRUE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Sessions ─────────────────────────────────────────────
CREATE TABLE sessions (
  id                            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  psychologist_id               UUID REFERENCES psychologists(id) ON DELETE RESTRICT NOT NULL,
  patient_id                    UUID REFERENCES patients(id) ON DELETE RESTRICT NOT NULL,
  scheduled_at                  TIMESTAMPTZ NOT NULL,
  duration_minutes              INTEGER NOT NULL DEFAULT 50,
  status                        TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show', 'rescheduled')),
  session_number                INTEGER NOT NULL DEFAULT 1,
  modality                      TEXT NOT NULL DEFAULT 'presential' CHECK (modality IN ('presential', 'online')),
  price_cents                   INTEGER NOT NULL DEFAULT 0,
  billing_cycle                 TEXT NOT NULL DEFAULT 'per_session' CHECK (billing_cycle IN ('per_session', 'weekly', 'monthly')),
  google_calendar_event_id      TEXT,
  whatsapp_confirmation_sent    BOOLEAN NOT NULL DEFAULT FALSE,
  confirmed_at                  TIMESTAMPTZ,
  cancelled_at                  TIMESTAMPTZ,
  cancellation_reason           TEXT,
  created_at                    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Session Notes (Prontuário) ───────────────────────────
-- Notes are ENCRYPTED client-side (AES-256-GCM).
-- The server NEVER stores plaintext clinical notes.
-- CFP Res. 001/2009: immutable after 24h window.
CREATE TABLE session_notes (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id            UUID REFERENCES sessions(id) ON DELETE RESTRICT NOT NULL UNIQUE,
  psychologist_id       UUID REFERENCES psychologists(id) ON DELETE RESTRICT NOT NULL,
  patient_id            UUID REFERENCES patients(id) ON DELETE RESTRICT NOT NULL,
  content_encrypted     TEXT NOT NULL,  -- base64 AES-256-GCM ciphertext
  content_iv            TEXT NOT NULL,  -- base64 initialization vector
  content_salt          TEXT NOT NULL,  -- base64 PBKDF2 salt
  is_immutable          BOOLEAN NOT NULL DEFAULT FALSE,
  immutable_at          TIMESTAMPTZ,
  lineage_analysis_id   UUID,  -- FK added after lineage_analyses table
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Immutability trigger: locks note after 24h (CFP compliance)
CREATE OR REPLACE FUNCTION lock_note_after_24h()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.is_immutable = TRUE THEN
    RAISE EXCEPTION 'Esta nota clínica está bloqueada para edição (CFP Res. 001/2009).';
  END IF;

  IF NOW() > OLD.created_at + INTERVAL '24 hours' THEN
    NEW.is_immutable := TRUE;
    NEW.immutable_at := NOW();
    -- Only allow the immutability flag itself to be updated on locked notes
    IF OLD.content_encrypted != NEW.content_encrypted OR
       OLD.content_iv != NEW.content_iv OR
       OLD.content_salt != NEW.content_salt THEN
      RAISE EXCEPTION 'Notas clínicas não podem ser alteradas após 24 horas (CFP Res. 001/2009).';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_note_immutability
  BEFORE UPDATE ON session_notes
  FOR EACH ROW EXECUTE FUNCTION lock_note_after_24h();

-- ── Payments ─────────────────────────────────────────────
CREATE TABLE payments (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  psychologist_id       UUID REFERENCES psychologists(id) ON DELETE RESTRICT NOT NULL,
  patient_id            UUID REFERENCES patients(id) ON DELETE RESTRICT NOT NULL,
  session_id            UUID REFERENCES sessions(id) ON DELETE SET NULL,
  amount_cents          INTEGER NOT NULL,
  status                TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled', 'refunded')),
  billing_cycle         TEXT NOT NULL DEFAULT 'per_session' CHECK (billing_cycle IN ('per_session', 'weekly', 'monthly')),
  due_date              DATE NOT NULL,
  paid_at               TIMESTAMPTZ,
  pagarme_order_id      TEXT,
  pagarme_charge_id     TEXT,
  pix_qr_code           TEXT,
  pix_copy_paste        TEXT,
  receipt_sent          BOOLEAN NOT NULL DEFAULT FALSE,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Abandonment Scores ───────────────────────────────────
-- Calculated daily by Edge Function
CREATE TABLE abandonment_scores (
  id                          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  psychologist_id             UUID REFERENCES psychologists(id) ON DELETE CASCADE NOT NULL,
  patient_id                  UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  score                       NUMERIC(5,2) NOT NULL CHECK (score BETWEEN 0 AND 100),
  level                       TEXT NOT NULL CHECK (level IN ('low', 'medium', 'high', 'critical')),
  absence_rate                NUMERIC(5,2) NOT NULL DEFAULT 0,
  days_since_last_session     INTEGER NOT NULL DEFAULT 0,
  confirmation_response_rate  NUMERIC(5,2) NOT NULL DEFAULT 100,
  reschedule_pattern          NUMERIC(5,2) NOT NULL DEFAULT 0,
  alert_sent                  BOOLEAN NOT NULL DEFAULT FALSE,
  alert_sent_at               TIMESTAMPTZ,
  dismissed                   BOOLEAN NOT NULL DEFAULT FALSE,
  dismissed_at                TIMESTAMPTZ,
  calculated_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(psychologist_id, patient_id, calculated_at::DATE)
);

-- ── Lineage Analyses ─────────────────────────────────────
CREATE TABLE lineage_analyses (
  id                       UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  psychologist_id          UUID REFERENCES psychologists(id) ON DELETE CASCADE NOT NULL,
  dominant_approach        TEXT NOT NULL,
  approach_breakdown       JSONB NOT NULL DEFAULT '{}',
  confidence_score         NUMERIC(4,2) NOT NULL CHECK (confidence_score BETWEEN 0 AND 1),
  notes_analyzed_count     INTEGER NOT NULL DEFAULT 0,
  analyzed_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add FK from session_notes to lineage_analyses
ALTER TABLE session_notes
  ADD CONSTRAINT fk_lineage_analysis
  FOREIGN KEY (lineage_analysis_id)
  REFERENCES lineage_analyses(id) ON DELETE SET NULL;

-- ── Subscriptions ─────────────────────────────────────────
CREATE TABLE subscriptions (
  id                       UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  psychologist_id          UUID REFERENCES psychologists(id) ON DELETE RESTRICT NOT NULL UNIQUE,
  plan                     TEXT NOT NULL DEFAULT 'solo' CHECK (plan IN ('solo', 'clinico', 'pro')),
  status                   TEXT NOT NULL DEFAULT 'trialing' CHECK (status IN ('active', 'trialing', 'cancelled', 'past_due')),
  trial_ends_at            TIMESTAMPTZ,
  current_period_start     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  current_period_end       TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '14 days',
  pagarme_subscription_id  TEXT,
  created_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at               TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Audit Log (Immutable) ────────────────────────────────
-- CFP Res. 001/2009 + LGPD — all data access is logged
CREATE TABLE audit_log (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  psychologist_id UUID NOT NULL,
  action          TEXT NOT NULL,
  table_name      TEXT NOT NULL,
  record_id       UUID,
  ip_address      INET,
  user_agent      TEXT,
  metadata        JSONB,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Audit log is append-only — no updates or deletes
CREATE RULE no_update_audit AS ON UPDATE TO audit_log DO INSTEAD NOTHING;
CREATE RULE no_delete_audit AS ON DELETE TO audit_log DO INSTEAD NOTHING;

-- ── Updated_at Triggers ──────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_psychologists
  BEFORE UPDATE ON psychologists FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at_patients
  BEFORE UPDATE ON patients FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at_sessions
  BEFORE UPDATE ON sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at_session_notes
  BEFORE UPDATE ON session_notes FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at_payments
  BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at_subscriptions
  BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── Row Level Security ───────────────────────────────────
ALTER TABLE psychologists      ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients           ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions           ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_notes      ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments           ENABLE ROW LEVEL SECURITY;
ALTER TABLE abandonment_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE lineage_analyses   ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions      ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log          ENABLE ROW LEVEL SECURITY;

-- Helper function: get current psychologist id
CREATE OR REPLACE FUNCTION current_psychologist_id()
RETURNS UUID AS $$
  SELECT id FROM psychologists WHERE user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Psychologists: own row only
CREATE POLICY "psy_own_row" ON psychologists
  USING (user_id = auth.uid());

-- Patients: own patients only
CREATE POLICY "psy_own_patients" ON patients
  USING (psychologist_id = current_psychologist_id());

-- Availability slots: own only
CREATE POLICY "psy_own_slots" ON availability_slots
  USING (psychologist_id = current_psychologist_id());

-- Sessions: own sessions only
CREATE POLICY "psy_own_sessions" ON sessions
  USING (psychologist_id = current_psychologist_id());

-- Session notes: own notes only (content is encrypted anyway)
CREATE POLICY "psy_own_notes" ON session_notes
  USING (psychologist_id = current_psychologist_id());

-- Payments: own payments only
CREATE POLICY "psy_own_payments" ON payments
  USING (psychologist_id = current_psychologist_id());

-- Abandonment scores: own scores only
CREATE POLICY "psy_own_scores" ON abandonment_scores
  USING (psychologist_id = current_psychologist_id());

-- Lineage analyses: own only
CREATE POLICY "psy_own_lineage" ON lineage_analyses
  USING (psychologist_id = current_psychologist_id());

-- Subscriptions: own only
CREATE POLICY "psy_own_subscription" ON subscriptions
  USING (psychologist_id = current_psychologist_id());

-- Audit log: read own, no delete/update (enforced by rules above)
CREATE POLICY "psy_own_audit_read" ON audit_log
  FOR SELECT USING (psychologist_id = current_psychologist_id());

CREATE POLICY "psy_own_audit_insert" ON audit_log
  FOR INSERT WITH CHECK (psychologist_id = current_psychologist_id());

-- ── Indexes ──────────────────────────────────────────────
CREATE INDEX idx_patients_psychologist ON patients(psychologist_id);
CREATE INDEX idx_sessions_psychologist ON sessions(psychologist_id);
CREATE INDEX idx_sessions_patient ON sessions(patient_id);
CREATE INDEX idx_sessions_scheduled_at ON sessions(scheduled_at);
CREATE INDEX idx_session_notes_session ON session_notes(session_id);
CREATE INDEX idx_payments_psychologist ON payments(psychologist_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_abandonment_psychologist ON abandonment_scores(psychologist_id);
CREATE INDEX idx_abandonment_level ON abandonment_scores(level);
CREATE INDEX idx_audit_psychologist ON audit_log(psychologist_id);
CREATE INDEX idx_audit_created_at ON audit_log(created_at);
