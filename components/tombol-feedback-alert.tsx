'use client';

import { useCallback, useState } from 'react';

type PropsTombolFeedback = {
  alert_id: string;
  user_helpful: boolean | null;
  feedback_at: string | null;
  /** Perbarui state induk (daftar alert) setelah sukses. */
  on_feedback_tersimpan?: (helpful: boolean, feedback_at: string) => void;
  /** Tampilan ringkas di kartu daftar vs penuh di halaman detail. */
  ukuran?: 'ringkas' | 'penuh';
};

export function TombolFeedbackAlert({
  alert_id,
  user_helpful,
  feedback_at,
  on_feedback_tersimpan,
  ukuran = 'ringkas',
}: PropsTombolFeedback) {
  const [helpful_lokal, set_helpful_lokal] = useState<boolean | null>(user_helpful);
  const [waktu_lokal, set_waktu_lokal] = useState<string | null>(feedback_at);
  const [sedang_menyimpan, set_sedang_menyimpan] = useState(false);
  const [pesan_galat, set_pesan_galat] = useState<string | null>(null);

  const kirim_feedback = useCallback(
    async (helpful: boolean) => {
      if (sedang_menyimpan) return;
      set_sedang_menyimpan(true);
      set_pesan_galat(null);

      try {
        const respons = await fetch(`/api/alerts/${alert_id}/feedback`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ helpful }),
        });
        const body = (await respons.json()) as {
          kesalahan?: string;
          user_helpful?: boolean;
          feedback_at?: string;
        };

        if (!respons.ok) {
          set_pesan_galat(body.kesalahan ?? 'Could not save feedback.');
          return;
        }

        const waktu_baru = body.feedback_at ?? new Date().toISOString();
        const helpful_baru = body.user_helpful ?? helpful;
        set_helpful_lokal(helpful_baru);
        set_waktu_lokal(waktu_baru);
        on_feedback_tersimpan?.(helpful_baru, waktu_baru);
      } catch {
        set_pesan_galat('Network error while saving feedback.');
      } finally {
        set_sedang_menyimpan(false);
      }
    },
    [alert_id, on_feedback_tersimpan, sedang_menyimpan],
  );

  const kelas_tombol = (aktif: boolean, jenis: 'ya' | 'tidak') => {
    const dasar =
      'inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors disabled:cursor-wait disabled:opacity-60';
    if (!aktif) {
      return `${dasar} border-border bg-card text-muted hover:border-accent/40 hover:text-foreground`;
    }
    if (jenis === 'ya') {
      return `${dasar} border-emerald-300 bg-emerald-50 text-emerald-900`;
    }
    return `${dasar} border-amber-300 bg-amber-50 text-amber-900`;
  };

  return (
    <div className={ukuran === 'penuh' ? 'space-y-2' : ''}>
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted">
        Was this alert helpful?
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={sedang_menyimpan}
          onClick={() => void kirim_feedback(true)}
          className={kelas_tombol(helpful_lokal === true, 'ya')}
          aria-pressed={helpful_lokal === true}
        >
          <span aria-hidden>👍</span> Relevant
        </button>
        <button
          type="button"
          disabled={sedang_menyimpan}
          onClick={() => void kirim_feedback(false)}
          className={kelas_tombol(helpful_lokal === false, 'tidak')}
          aria-pressed={helpful_lokal === false}
        >
          <span aria-hidden>👎</span> Not relevant
        </button>
        {sedang_menyimpan ? (
          <span className="text-xs text-muted">Saving…</span>
        ) : null}
        {helpful_lokal !== null && waktu_lokal && !sedang_menyimpan ? (
          <span className="text-xs text-emerald-700">Thanks — feedback saved.</span>
        ) : null}
      </div>
      {ukuran === 'penuh' ? (
        <p className="text-xs text-muted">
          Your response helps MediGuard filter noise. This is not sent to a clinician.
        </p>
      ) : null}
      {pesan_galat ? <p className="text-xs text-red-600">{pesan_galat}</p> : null}
    </div>
  );
}
