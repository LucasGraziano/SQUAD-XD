-- Intake tokens: one-time links for patients to fill their own registration form
CREATE TABLE IF NOT EXISTS intake_tokens (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token           text NOT NULL UNIQUE,
  psychologist_id uuid NOT NULL REFERENCES psychologists(id) ON DELETE CASCADE,
  patient_name_hint text,
  expires_at      timestamptz NOT NULL,
  used            boolean NOT NULL DEFAULT false,
  used_at         timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- Index for fast token lookup
CREATE INDEX IF NOT EXISTS idx_intake_tokens_token ON intake_tokens(token);
CREATE INDEX IF NOT EXISTS idx_intake_tokens_psychologist ON intake_tokens(psychologist_id);

-- RLS: only the owning psychologist can see their tokens
ALTER TABLE intake_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Psychologist can manage own intake tokens"
  ON intake_tokens
  FOR ALL
  USING (
    psychologist_id IN (
      SELECT id FROM psychologists WHERE user_id = auth.uid()
    )
  );

-- Public read for token validation (submit endpoint uses service role, so this is informational)
-- The API route uses service_role key and bypasses RLS for submit/validate operations.
