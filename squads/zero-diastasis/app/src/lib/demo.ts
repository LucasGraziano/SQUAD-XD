// Demo mode: when Supabase is placeholder, provide mock data
// so the app is fully functional visually on localhost.

export function isDemoMode(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  return !url || url.includes('placeholder');
}

export const DEMO_USER = {
  id: 'demo-user-001',
  email: 'sofia@ejemplo.com',
  user_metadata: { locale: 'es' },
};

export const DEMO_PROFILE = {
  id: 'demo-user-001',
  full_name: 'Sofía García',
  email: 'sofia@ejemplo.com',
  locale: 'es' as const,
  birth_type: 'natural' as const,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

// Simulates purchase 5 days ago so demo user is on day 5
const DEMO_PURCHASE_DATE = new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString();

export const DEMO_PURCHASES = [
  { purchase_date: DEMO_PURCHASE_DATE },
];

export const DEMO_COMPLETED_DAYS = [1, 2, 3, 4];

export const DEMO_PROGRESS = DEMO_COMPLETED_DAYS.map((day) => ({
  day_number: day,
}));

export const DEMO_MEASUREMENTS = [
  { day: 1, waist_cm: 82.5, diastasis_fingers: 3.0, weight_kg: 67.0 },
  { day: 3, waist_cm: 81.8, diastasis_fingers: 2.8, weight_kg: 66.8 },
];

export const DEMO_BONUSES = [
  { bonus_id: 'stack-360' },
  { bonus_id: 'tracker-28' },
];
