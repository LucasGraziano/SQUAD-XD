-- ══════════════════════════════════════════════════════════
-- Vínculo — RLS Hardening: WITH CHECK Explícito
-- Migration: 002
-- LGPD Art. 46 + CFP Res. 001/2009 compliance
-- Substitui políticas ALL implícitas por políticas granulares
-- por operação (SELECT / INSERT / UPDATE / DELETE)
-- ══════════════════════════════════════════════════════════

-- ── psychologists ────────────────────────────────────────
-- Isolamento por user_id (não psychologist_id — row própria)

DROP POLICY IF EXISTS "psy_own_row"          ON psychologists;
DROP POLICY IF EXISTS "psy_select_own_row"   ON psychologists;
DROP POLICY IF EXISTS "psy_insert_own_row"   ON psychologists;
DROP POLICY IF EXISTS "psy_update_own_row"   ON psychologists;
DROP POLICY IF EXISTS "psy_delete_own_row"   ON psychologists;

CREATE POLICY "psy_select_own_row" ON psychologists
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "psy_insert_own_row" ON psychologists
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "psy_update_own_row" ON psychologists
  FOR UPDATE
  USING     (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "psy_delete_own_row" ON psychologists
  FOR DELETE USING (user_id = auth.uid());

-- ── patients ─────────────────────────────────────────────

DROP POLICY IF EXISTS "psy_own_patients"    ON patients;
DROP POLICY IF EXISTS "psy_select_patients" ON patients;
DROP POLICY IF EXISTS "psy_insert_patients" ON patients;
DROP POLICY IF EXISTS "psy_update_patients" ON patients;
DROP POLICY IF EXISTS "psy_delete_patients" ON patients;

CREATE POLICY "psy_select_patients" ON patients
  FOR SELECT USING (psychologist_id = current_psychologist_id());

CREATE POLICY "psy_insert_patients" ON patients
  FOR INSERT WITH CHECK (psychologist_id = current_psychologist_id());

CREATE POLICY "psy_update_patients" ON patients
  FOR UPDATE
  USING     (psychologist_id = current_psychologist_id())
  WITH CHECK (psychologist_id = current_psychologist_id());

CREATE POLICY "psy_delete_patients" ON patients
  FOR DELETE USING (psychologist_id = current_psychologist_id());

-- ── availability_slots ───────────────────────────────────

DROP POLICY IF EXISTS "psy_own_slots"    ON availability_slots;
DROP POLICY IF EXISTS "psy_select_slots" ON availability_slots;
DROP POLICY IF EXISTS "psy_insert_slots" ON availability_slots;
DROP POLICY IF EXISTS "psy_update_slots" ON availability_slots;
DROP POLICY IF EXISTS "psy_delete_slots" ON availability_slots;

CREATE POLICY "psy_select_slots" ON availability_slots
  FOR SELECT USING (psychologist_id = current_psychologist_id());

CREATE POLICY "psy_insert_slots" ON availability_slots
  FOR INSERT WITH CHECK (psychologist_id = current_psychologist_id());

CREATE POLICY "psy_update_slots" ON availability_slots
  FOR UPDATE
  USING     (psychologist_id = current_psychologist_id())
  WITH CHECK (psychologist_id = current_psychologist_id());

CREATE POLICY "psy_delete_slots" ON availability_slots
  FOR DELETE USING (psychologist_id = current_psychologist_id());

-- ── sessions ─────────────────────────────────────────────

DROP POLICY IF EXISTS "psy_own_sessions"    ON sessions;
DROP POLICY IF EXISTS "psy_select_sessions" ON sessions;
DROP POLICY IF EXISTS "psy_insert_sessions" ON sessions;
DROP POLICY IF EXISTS "psy_update_sessions" ON sessions;
DROP POLICY IF EXISTS "psy_delete_sessions" ON sessions;

CREATE POLICY "psy_select_sessions" ON sessions
  FOR SELECT USING (psychologist_id = current_psychologist_id());

CREATE POLICY "psy_insert_sessions" ON sessions
  FOR INSERT WITH CHECK (psychologist_id = current_psychologist_id());

CREATE POLICY "psy_update_sessions" ON sessions
  FOR UPDATE
  USING     (psychologist_id = current_psychologist_id())
  WITH CHECK (psychologist_id = current_psychologist_id());

CREATE POLICY "psy_delete_sessions" ON sessions
  FOR DELETE USING (psychologist_id = current_psychologist_id());

-- ── session_notes ────────────────────────────────────────
-- Dado clínico sensível (AES-256-GCM). CFP Res. 001/2009.
-- DELETE bloqueado intencionalmente: notas são permanentes.

DROP POLICY IF EXISTS "psy_own_notes"    ON session_notes;
DROP POLICY IF EXISTS "psy_select_notes" ON session_notes;
DROP POLICY IF EXISTS "psy_insert_notes" ON session_notes;
DROP POLICY IF EXISTS "psy_update_notes" ON session_notes;

CREATE POLICY "psy_select_notes" ON session_notes
  FOR SELECT USING (psychologist_id = current_psychologist_id());

CREATE POLICY "psy_insert_notes" ON session_notes
  FOR INSERT WITH CHECK (psychologist_id = current_psychologist_id());

CREATE POLICY "psy_update_notes" ON session_notes
  FOR UPDATE
  USING     (psychologist_id = current_psychologist_id())
  WITH CHECK (psychologist_id = current_psychologist_id());

-- Sem DELETE policy: notas clínicas são imutáveis por lei

-- ── payments ─────────────────────────────────────────────

DROP POLICY IF EXISTS "psy_own_payments"    ON payments;
DROP POLICY IF EXISTS "psy_select_payments" ON payments;
DROP POLICY IF EXISTS "psy_insert_payments" ON payments;
DROP POLICY IF EXISTS "psy_update_payments" ON payments;
DROP POLICY IF EXISTS "psy_delete_payments" ON payments;

CREATE POLICY "psy_select_payments" ON payments
  FOR SELECT USING (psychologist_id = current_psychologist_id());

CREATE POLICY "psy_insert_payments" ON payments
  FOR INSERT WITH CHECK (psychologist_id = current_psychologist_id());

CREATE POLICY "psy_update_payments" ON payments
  FOR UPDATE
  USING     (psychologist_id = current_psychologist_id())
  WITH CHECK (psychologist_id = current_psychologist_id());

CREATE POLICY "psy_delete_payments" ON payments
  FOR DELETE USING (psychologist_id = current_psychologist_id());

-- ── abandonment_scores ───────────────────────────────────
-- Gerado por Edge Function. Psicólogo pode ler e dispensar (UPDATE),
-- mas não deletar scores calculados.

DROP POLICY IF EXISTS "psy_own_scores"    ON abandonment_scores;
DROP POLICY IF EXISTS "psy_select_scores" ON abandonment_scores;
DROP POLICY IF EXISTS "psy_insert_scores" ON abandonment_scores;
DROP POLICY IF EXISTS "psy_update_scores" ON abandonment_scores;

CREATE POLICY "psy_select_scores" ON abandonment_scores
  FOR SELECT USING (psychologist_id = current_psychologist_id());

CREATE POLICY "psy_insert_scores" ON abandonment_scores
  FOR INSERT WITH CHECK (psychologist_id = current_psychologist_id());

CREATE POLICY "psy_update_scores" ON abandonment_scores
  FOR UPDATE
  USING     (psychologist_id = current_psychologist_id())
  WITH CHECK (psychologist_id = current_psychologist_id());

-- Sem DELETE policy: scores são histórico de risco, não devem ser apagados

-- ── lineage_analyses ─────────────────────────────────────

DROP POLICY IF EXISTS "psy_own_lineage"    ON lineage_analyses;
DROP POLICY IF EXISTS "psy_select_lineage" ON lineage_analyses;
DROP POLICY IF EXISTS "psy_insert_lineage" ON lineage_analyses;
DROP POLICY IF EXISTS "psy_update_lineage" ON lineage_analyses;
DROP POLICY IF EXISTS "psy_delete_lineage" ON lineage_analyses;

CREATE POLICY "psy_select_lineage" ON lineage_analyses
  FOR SELECT USING (psychologist_id = current_psychologist_id());

CREATE POLICY "psy_insert_lineage" ON lineage_analyses
  FOR INSERT WITH CHECK (psychologist_id = current_psychologist_id());

CREATE POLICY "psy_update_lineage" ON lineage_analyses
  FOR UPDATE
  USING     (psychologist_id = current_psychologist_id())
  WITH CHECK (psychologist_id = current_psychologist_id());

CREATE POLICY "psy_delete_lineage" ON lineage_analyses
  FOR DELETE USING (psychologist_id = current_psychologist_id());

-- ── subscriptions ─────────────────────────────────────────
-- Managed externamente por webhook Pagar.me.
-- Psicólogo pode ler. Sem INSERT/UPDATE/DELETE direto — feito via service_role.

DROP POLICY IF EXISTS "psy_own_subscription"    ON subscriptions;
DROP POLICY IF EXISTS "psy_select_subscription" ON subscriptions;

CREATE POLICY "psy_select_subscription" ON subscriptions
  FOR SELECT USING (psychologist_id = current_psychologist_id());

-- INSERT/UPDATE/DELETE somente via service_role (webhook Pagar.me)
-- Nenhuma policy de write para o usuário autenticado

-- ── audit_log ────────────────────────────────────────────
-- Append-only reforçado por RLS + rules (no_update_audit, no_delete_audit).

DROP POLICY IF EXISTS "psy_own_audit_read"   ON audit_log;
DROP POLICY IF EXISTS "psy_own_audit_insert" ON audit_log;
DROP POLICY IF EXISTS "psy_select_audit"     ON audit_log;
DROP POLICY IF EXISTS "psy_insert_audit"     ON audit_log;

CREATE POLICY "psy_select_audit" ON audit_log
  FOR SELECT USING (psychologist_id = current_psychologist_id());

CREATE POLICY "psy_insert_audit" ON audit_log
  FOR INSERT WITH CHECK (psychologist_id = current_psychologist_id());

-- Sem UPDATE/DELETE: append-only garantido por esta ausência + rules no 001
