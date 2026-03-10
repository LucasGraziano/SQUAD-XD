import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getProtocolDay } from '@/hooks/use-protocol-day';
import type { Purchase } from '@/types/database';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: Request) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await request.formData();
  const photo = formData.get('photo') as File | null;
  const photoType = (formData.get('photo_type') as string) || 'front';

  if (!photo) {
    return NextResponse.json({ error: 'No photo provided' }, { status: 400 });
  }

  // Validate file type
  if (!ALLOWED_TYPES.includes(photo.type)) {
    return NextResponse.json({ error: 'Invalid file type. Only JPEG, PNG and WebP allowed.' }, { status: 400 });
  }

  // Validate file size
  if (photo.size > MAX_SIZE) {
    return NextResponse.json({ error: 'File too large. Maximum 5MB.' }, { status: 400 });
  }

  // Validate photo type
  if (!['front', 'side', 'other'].includes(photoType)) {
    return NextResponse.json({ error: 'Invalid photo type' }, { status: 400 });
  }

  const { data: purchases } = await supabase
    .from('purchases')
    .select('purchase_date')
    .eq('user_id', user.id)
    .order('purchase_date', { ascending: true })
    .limit(1);

  const purchaseDate = ((purchases || []) as Pick<Purchase, 'purchase_date'>[])[0]?.purchase_date || new Date().toISOString();
  const dayNumber = getProtocolDay(purchaseDate);

  // Sanitize filename
  const ext = photo.name.split('.').pop()?.toLowerCase() || 'jpg';
  const safeExt = ['jpg', 'jpeg', 'png', 'webp'].includes(ext) ? ext : 'jpg';
  const fileName = `${user.id}/day-${dayNumber}-${photoType}-${Date.now()}.${safeExt}`;

  const { error: uploadError } = await supabase.storage
    .from('progress-photos')
    .upload(fileName, photo);

  if (uploadError) {
    console.error('Photo upload error:', uploadError.message);
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { error: insertError } = await supabase.from('photos').insert({
    user_id: user.id,
    day_number: dayNumber,
    storage_path: fileName,
    photo_type: photoType,
  } as any);

  if (insertError) {
    console.error('Photo record insert error:', insertError.message);
    // Attempt cleanup of orphaned file
    await supabase.storage.from('progress-photos').remove([fileName]);
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
