'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function TombolTandaiBaca({ alert_id, sudah_dibaca }: { alert_id: string; sudah_dibaca: boolean }) {
  const router = useRouter();
  const [sedang_proses, set_sedang_proses] = useState(false);

  if (sudah_dibaca) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800">
        ✓ Marked as read
      </span>
    );
  }

  async function tandai() {
    set_sedang_proses(true);
    await fetch(`/api/alerts/${alert_id}/read`, { method: 'PATCH' });
    router.refresh();
    set_sedang_proses(false);
  }

  return (
    <button
      type="button"
      disabled={sedang_proses}
      onClick={() => void tandai()}
      className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-wait disabled:opacity-70"
    >
      {sedang_proses ? 'Updating…' : 'Mark as read'}
    </button>
  );
}
