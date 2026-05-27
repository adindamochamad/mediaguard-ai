'use client';

import { useCallback, useState } from 'react';

type StatusDb = 'idle' | 'loading' | 'terhubung' | 'gagal' | 'env_belum_lengkap';

type ResponsKesehatan = {
  status_database: StatusDb | string;
  pesan?: string;
  pesan_ringkas?: string;
  hint?: string;
  hint_dashboard?: string;
};

export function PanelDatabaseStatus() {
  const [status, setStatus] = useState<StatusDb>('idle');
  const [detail, setDetail] = useState<ResponsKesehatan | null>(null);

  const jalankanCek = useCallback(async () => {
    setStatus('loading');
    setDetail(null);
    try {
      const respons = await fetch('/api/health/db');
      const data = (await respons.json()) as ResponsKesehatan;
      setDetail(data);
      const kode = data.status_database as StatusDb;
      if (kode === 'terhubung' || kode === 'gagal' || kode === 'env_belum_lengkap') {
        setStatus(kode);
      } else {
        setStatus('gagal');
      }
    } catch {
      setStatus('gagal');
      setDetail({
        status_database: 'gagal',
        pesan_ringkas: 'Could not reach the health endpoint.',
      });
    }
  }, []);

  const label_status: Record<StatusDb, string> = {
    idle: 'Not checked yet',
    loading: 'Checking…',
    terhubung: 'Connected',
    gagal: 'Error',
    env_belum_lengkap: 'Configuration incomplete',
  };

  const warna_status: Record<StatusDb, string> = {
    idle: 'bg-slate-100 text-slate-600',
    loading: 'bg-amber-50 text-amber-800',
    terhubung: 'bg-emerald-50 text-emerald-800',
    gagal: 'bg-red-50 text-red-800',
    env_belum_lengkap: 'bg-amber-50 text-amber-800',
  };

  return (
    <section id="status" className="px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-soft sm:p-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground">System status</h2>
              <p className="mt-2 max-w-md text-sm text-muted">
                Verifies Supabase environment variables and read access to the{' '}
                <code className="rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-foreground">
                  medications
                </code>{' '}
                table (Day 1).
              </p>
            </div>
            <button
              type="button"
              onClick={jalankanCek}
              disabled={status === 'loading'}
              className="shrink-0 rounded-xl bg-foreground px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === 'loading' ? 'Checking…' : 'Run health check'}
            </button>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${warna_status[status]}`}
            >
              {label_status[status]}
            </span>
            <span className="font-mono text-xs text-muted">GET /api/health/db</span>
          </div>

          {detail && (
            <pre className="mt-6 overflow-x-auto rounded-xl border border-border bg-slate-50 p-4 font-mono text-xs leading-relaxed text-foreground">
              {JSON.stringify(detail, null, 2)}
            </pre>
          )}

          <p className="mt-6 text-xs text-muted">
            Cron webhook:{' '}
            <code className="font-mono text-foreground">/api/webhooks/cron</code> — Bearer{' '}
            <code className="font-mono text-foreground">CRON_SECRET</code> (scheduled scans, Day 6+).
          </p>
        </div>
      </div>
    </section>
  );
}
