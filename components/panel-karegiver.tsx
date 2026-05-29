'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

type Karegiver = {
  id: string;
  caregiver_email: string;
  access_level: string;
  invited_at: string;
  accepted_at: string | null;
};

function format_tanggal(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function PanelKaregiver() {
  const [daftar, set_daftar] = useState<Karegiver[]>([]);
  const [email, set_email] = useState('');
  const [sedang_muat, set_sedang_muat] = useState(true);
  const [sedang_kirim, set_sedang_kirim] = useState(false);
  const [sedang_cabut, set_sedang_cabut] = useState<string | null>(null);

  const muat_karegiver = useCallback(async () => {
    try {
      const res = await fetch('/api/caregivers');
      if (!res.ok) return;
      const body = (await res.json()) as { caregivers: Karegiver[] };
      set_daftar(body.caregivers ?? []);
    } catch {
      // abaikan
    } finally {
      set_sedang_muat(false);
    }
  }, []);

  useEffect(() => {
    void muat_karegiver();
  }, [muat_karegiver]);

  async function tangani_undang(e: React.FormEvent) {
    e.preventDefault();
    set_sedang_kirim(true);

    try {
      const res = await fetch('/api/caregivers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const body = (await res.json()) as { caregiver?: Karegiver; kesalahan?: string };

      if (!res.ok) {
        toast.error(body.kesalahan ?? 'Failed to send invite.');
        return;
      }

      if (body.caregiver) {
        set_daftar((prev) => [body.caregiver!, ...prev]);
      }
      set_email('');
      toast.success('Invite sent! They will receive an email with the access link.');
    } catch {
      toast.error('Network error. Please try again.');
    } finally {
      set_sedang_kirim(false);
    }
  }

  async function tangani_cabut(id: string) {
    set_sedang_cabut(id);
    try {
      const res = await fetch(`/api/caregivers/${id}`, { method: 'DELETE' });
      if (res.ok) {
        set_daftar((prev) => prev.filter((k) => k.id !== id));
      }
    } catch {
      // abaikan
    } finally {
      set_sedang_cabut(null);
    }
  }

  return (
    <div className="mt-8 space-y-8">
      <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        <h2 className="text-base font-semibold text-foreground">Share with a caregiver</h2>
        <p className="mt-1 text-sm text-muted">
          Invite a family member or doctor to view your alerts. They get a read-only link — no
          account needed.
        </p>

        <form onSubmit={(e) => void tangani_undang(e)} className="mt-5 flex gap-3">
          <input
            type="email"
            required
            placeholder="caregiver@example.com"
            value={email}
            onChange={(e) => set_email(e.target.value)}
            className="flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none ring-accent/30 transition-shadow focus:ring-2"
          />
          <button
            type="submit"
            disabled={sedang_kirim}
            className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {sedang_kirim ? 'Sending…' : 'Invite'}
          </button>
        </form>

      </section>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        <h2 className="text-base font-semibold text-foreground">Active caregivers</h2>

        {sedang_muat ? (
          <p className="mt-4 text-sm text-muted">Loading…</p>
        ) : daftar.length === 0 ? (
          <p className="mt-4 text-sm text-muted">No caregivers yet. Invite someone above.</p>
        ) : (
          <ul className="mt-4 divide-y divide-border">
            {daftar.map((k) => (
              <li key={k.id} className="flex items-center justify-between gap-4 py-3">
                <div>
                  <p className="text-sm font-medium text-foreground">{k.caregiver_email}</p>
                  <p className="text-xs text-muted">
                    Invited {format_tanggal(k.invited_at)}
                    {k.accepted_at ? ` · Accepted ${format_tanggal(k.accepted_at)}` : ' · Pending'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => void tangani_cabut(k.id)}
                  disabled={sedang_cabut === k.id}
                  className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-red-50 hover:border-red-200 hover:text-red-700 disabled:cursor-wait disabled:opacity-60 transition-colors"
                >
                  {sedang_cabut === k.id ? 'Revoking…' : 'Revoke'}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
