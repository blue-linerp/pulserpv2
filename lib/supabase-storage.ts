import 'server-only';

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

export function hasSupabaseStorage() {
  return Boolean(supabaseUrl && supabaseServiceKey);
}

function storageUrl(key?: string) {
  if (!supabaseUrl) throw new Error('Missing SUPABASE_URL');
  const base = `${supabaseUrl.replace(/\/$/, '')}/rest/v1/app_storage`;
  return key ? `${base}?key=eq.${encodeURIComponent(key)}&select=value` : base;
}

function headers(prefer?: string) {
  if (!supabaseServiceKey) throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');
  return {
    apikey: supabaseServiceKey,
    Authorization: `Bearer ${supabaseServiceKey}`,
    'Content-Type': 'application/json',
    ...(prefer ? { Prefer: prefer } : {})
  };
}

export async function readStorageValue<T>(key: string, fallback: T): Promise<T> {
  if (!hasSupabaseStorage()) return fallback;
  const response = await fetch(storageUrl(key), { headers: headers(), cache: 'no-store' });
  if (!response.ok) throw new Error(`Supabase read failed for ${key}`);
  const rows = await response.json() as { value: T }[];
  return rows[0]?.value ?? fallback;
}

export async function writeStorageValue<T>(key: string, value: T): Promise<void> {
  if (!hasSupabaseStorage()) return;
  const response = await fetch(storageUrl(), {
    method: 'POST',
    headers: headers('resolution=merge-duplicates'),
    body: JSON.stringify({ key, value, updated_at: new Date().toISOString() })
  });
  if (!response.ok) throw new Error(`Supabase write failed for ${key}`);
}
