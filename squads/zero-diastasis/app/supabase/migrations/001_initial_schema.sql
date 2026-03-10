-- Zero Diastasis™ — Initial Schema
-- Tables: profiles, day_progress, measurements, photos, symptom_entries, user_bonuses, purchases

-- Profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT NOT NULL,
  locale TEXT DEFAULT 'es' CHECK (locale IN ('es', 'pt')),
  birth_type TEXT CHECK (birth_type IN ('natural', 'cesarean', 'unknown')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Purchases (tracks product purchases)
CREATE TABLE IF NOT EXISTS purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  purchase_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  source TEXT CHECK (source IN ('lastlink', 'hotmart', 'manual')),
  external_id TEXT,
  amount_cents INTEGER,
  currency TEXT DEFAULT 'USD',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_purchases_user ON purchases(user_id);

-- Day progress (tracks completion per day)
CREATE TABLE IF NOT EXISTS day_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL CHECK (day_number BETWEEN 1 AND 28),
  completed_at TIMESTAMPTZ DEFAULT now(),
  audio_listened BOOLEAN DEFAULT false,
  notes TEXT,
  UNIQUE(user_id, day_number)
);

CREATE INDEX idx_day_progress_user ON day_progress(user_id);

-- Measurements (body measurements tracking)
CREATE TABLE IF NOT EXISTS measurements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL CHECK (day_number BETWEEN 0 AND 28),
  waist_cm NUMERIC(5,1),
  diastasis_fingers NUMERIC(3,1),
  weight_kg NUMERIC(5,1),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_measurements_user ON measurements(user_id);

-- Photos (before/after progress photos)
CREATE TABLE IF NOT EXISTS photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL CHECK (day_number BETWEEN 0 AND 28),
  storage_path TEXT NOT NULL,
  photo_type TEXT DEFAULT 'front' CHECK (photo_type IN ('front', 'side', 'other')),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_photos_user ON photos(user_id);

-- Symptom entries (daily symptom diary)
CREATE TABLE IF NOT EXISTS symptom_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL CHECK (day_number BETWEEN 1 AND 28),
  energy_level INTEGER CHECK (energy_level BETWEEN 1 AND 5),
  pain_level INTEGER CHECK (pain_level BETWEEN 0 AND 5),
  bloating INTEGER CHECK (bloating BETWEEN 0 AND 5),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_symptoms_user ON symptom_entries(user_id);

-- User bonuses (tracks unlocked bonuses)
CREATE TABLE IF NOT EXISTS user_bonuses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  bonus_id TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT now(),
  downloaded BOOLEAN DEFAULT false,
  UNIQUE(user_id, bonus_id)
);

CREATE INDEX idx_user_bonuses_user ON user_bonuses(user_id);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
