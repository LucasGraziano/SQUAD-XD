-- Zero Diastasis™ — Row Level Security Policies

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE day_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE symptom_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_bonuses ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update their own profile
CREATE POLICY profiles_select ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY profiles_update ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY profiles_insert ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Purchases: users can read their own; service role inserts via webhook
CREATE POLICY purchases_select ON purchases FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY purchases_service_insert ON purchases FOR INSERT WITH CHECK (true);

-- Day progress: users own their data
CREATE POLICY day_progress_select ON day_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY day_progress_insert ON day_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY day_progress_update ON day_progress FOR UPDATE USING (auth.uid() = user_id);

-- Measurements: users own their data
CREATE POLICY measurements_select ON measurements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY measurements_insert ON measurements FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Photos: users own their data
CREATE POLICY photos_select ON photos FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY photos_insert ON photos FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY photos_delete ON photos FOR DELETE USING (auth.uid() = user_id);

-- Symptom entries: users own their data
CREATE POLICY symptoms_select ON symptom_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY symptoms_insert ON symptom_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY symptoms_update ON symptom_entries FOR UPDATE USING (auth.uid() = user_id);

-- User bonuses: users own their data
CREATE POLICY bonuses_select ON user_bonuses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY bonuses_insert ON user_bonuses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY bonuses_update ON user_bonuses FOR UPDATE USING (auth.uid() = user_id);
