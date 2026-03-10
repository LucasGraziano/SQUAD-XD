export type Profile = {
  id: string;
  full_name: string | null;
  email: string;
  locale: 'es' | 'pt';
  birth_type: 'natural' | 'cesarean' | 'unknown' | null;
  created_at: string;
  updated_at: string;
};

export type Purchase = {
  id: string;
  user_id: string;
  product_id: string;
  product_name: string;
  purchase_date: string;
  source: 'lastlink' | 'hotmart' | 'manual' | null;
  external_id: string | null;
  amount_cents: number | null;
  currency: string;
  created_at: string;
};

export type DayProgress = {
  id: string;
  user_id: string;
  day_number: number;
  completed_at: string;
  audio_listened: boolean;
  notes: string | null;
};

export type Measurement = {
  id: string;
  user_id: string;
  day_number: number;
  waist_cm: number | null;
  diastasis_fingers: number | null;
  weight_kg: number | null;
  notes: string | null;
  created_at: string;
};

export type Photo = {
  id: string;
  user_id: string;
  day_number: number;
  storage_path: string;
  photo_type: 'front' | 'side' | 'other';
  created_at: string;
};

export type SymptomEntry = {
  id: string;
  user_id: string;
  day_number: number;
  energy_level: number | null;
  pain_level: number | null;
  bloating: number | null;
  notes: string | null;
  created_at: string;
};

export type UserBonus = {
  id: string;
  user_id: string;
  bonus_id: string;
  unlocked_at: string;
  downloaded: boolean;
};

export type Database = {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Partial<Profile> & { id: string; email: string }; Update: Partial<Profile> };
      purchases: { Row: Purchase; Insert: Omit<Purchase, 'id' | 'created_at'>; Update: Partial<Purchase> };
      day_progress: { Row: DayProgress; Insert: Omit<DayProgress, 'id' | 'completed_at'>; Update: Partial<DayProgress> };
      measurements: { Row: Measurement; Insert: Omit<Measurement, 'id' | 'created_at'>; Update: Partial<Measurement> };
      photos: { Row: Photo; Insert: Omit<Photo, 'id' | 'created_at'>; Update: Partial<Photo> };
      symptom_entries: { Row: SymptomEntry; Insert: Omit<SymptomEntry, 'id' | 'created_at'>; Update: Partial<SymptomEntry> };
      user_bonuses: { Row: UserBonus; Insert: Omit<UserBonus, 'id' | 'unlocked_at'>; Update: Partial<UserBonus> };
    };
  };
};
