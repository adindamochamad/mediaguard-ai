'use client';

import { useRouter } from 'next/navigation';
import { buat_klien_supabase_peramban } from '@/lib/supabase/client';

type PropsTombolKeluar = {
  className?: string;
};

export function TombolKeluar({ className = '' }: PropsTombolKeluar) {
  const router = useRouter();

  async function tangani_keluar() {
    const supabase = buat_klien_supabase_peramban();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={tangani_keluar}
      className={`w-full rounded-xl border border-border bg-card px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-slate-50 hover:text-foreground ${className}`.trim()}
    >
      Sign out
    </button>
  );
}
