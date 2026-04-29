-- Zero Diastasis™ — Planner: Daily Intentions
-- Allows users to set a daily intention/note for each day of the protocol

CREATE TABLE IF NOT EXISTS daily_intentions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL CHECK (day_number BETWEEN 1 AND 28),
  intention TEXT,
  mood TEXT CHECK (mood IN ('great', 'good', 'okay', 'tired', 'struggling')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, day_number)
);

CREATE INDEX idx_daily_intentions_user ON daily_intentions(user_id);

CREATE TRIGGER daily_intentions_updated_at
  BEFORE UPDATE ON daily_intentions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE daily_intentions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own intentions"
  ON daily_intentions FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
