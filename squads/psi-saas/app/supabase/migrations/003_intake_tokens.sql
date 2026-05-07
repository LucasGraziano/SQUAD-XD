-- ══════════════════════════════════════════════════════════
-- Vínculo — Intake Tokens
-- Migration: 003
-- Tabela de links de intake (formulário público para cadastro
-- de novo paciente pelo próprio paciente).
-- ══════════════════════════════════════════════════════════

CREATE TABLE intake_tokens (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  token               TEXT NOT NULL UNIQUE,
  psychologist_id     UUID REFERENCES psychologists(id) ON DELETE CASCADE NOT NULL,
  patient_name_hint   TEXT,
  expires_at          TIMESTAMPTZ NOT NULL,
  used                BOOLEAN NOT NULL DEFAULT FALSE,
  used_at             TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index para lookup rápido por token (caminho quente do submit)
CREATE INDEX idx_intake_tokens_token ON intake_tokens(token);
CREATE INDEX idx_intake_tokens_psychologist ON intake_tokens(psychologist_id);

-- ── RLS ─────────────────────────────────────────────────
ALTER TABLE intake_tokens ENABLE ROW LEVEL SECURITY;

-- Psicólogo vê e cria seus próprios tokens
CREATE POLICY "psy_select_intake_tokens" ON intake_tokens
  FOR SELECT USING (psychologist_id = current_psychologist_id());

CREATE POLICY "psy_insert_intake_tokens" ON intake_tokens
  FOR INSERT WITH CHECK (psychologist_id = current_psychologist_id());

CREATE POLICY "psy_delete_intake_tokens" ON intake_tokens
  FOR DELETE USING (psychologist_id = current_psychologist_id());

-- UPDATE (marcar como usado) é feito via service_role (api/intake/submit)
-- Sem policy de UPDATE para usuário autenticado — service_role bypassa RLS
