import { buat_klien_supabase_admin } from '@/lib/supabase/admin';

/** Memuat email auth pengguna — butuh service role (cron / server). */
export async function ambil_email_pengguna(id_pengguna: string): Promise<string | null> {
  const supabase = buat_klien_supabase_admin();
  const { data, error } = await supabase.auth.admin.getUserById(id_pengguna);

  if (error) {
    console.error('[email] gagal memuat user auth:', error.message);
    return null;
  }

  return data.user?.email?.trim() ?? null;
}
