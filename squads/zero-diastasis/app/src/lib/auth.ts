import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from './supabase/server';
import { isDemoMode, DEMO_USER } from './demo';

function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return !!url && !url.includes('placeholder');
}

export async function getSession() {
  if (isDemoMode()) return { user: DEMO_USER };
  if (!isSupabaseConfigured()) return null;
  const supabase = createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

export async function getUser() {
  if (isDemoMode()) return DEMO_USER as any;
  if (!isSupabaseConfigured()) return null;
  try {
    const supabase = createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (err) {
    console.error('getUser error:', err);
    return null;
  }
}

export async function requireAuth() {
  const user = await getUser();
  if (!user) {
    redirect('/auth/login');
  }
  return user;
}

export async function signOut() {
  if (isDemoMode()) return;
  if (!isSupabaseConfigured()) return;
  const supabase = createServerSupabaseClient();
  await supabase.auth.signOut();
}
