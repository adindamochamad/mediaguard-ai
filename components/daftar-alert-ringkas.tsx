'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { PanelKosongPeringatan } from '@/components/panel-kosong-peringatan';
import { buat_klien_supabase_peramban } from '@/lib/supabase/client';

type AlertRingkas = {
  id: string;
  user_id: string;
  severity: string;
  title: string;
  summary: string;
  source_url: string | null;
  ai_confidence: number | null;
  read_at: string | null;
  created_at: string;
};

const WARNA_SEVERITY: Record<string, string> = {
  critical: 'bg-red-100 text-red-800',
  warning:  'bg-amber-100 text-amber-900',
  info:     'bg-sky-100 text-sky-900',
};

function format_tanggal(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day:   'numeric',
    year:  'numeric',
  });
}

export function DaftarAlertRingkas({
  alerts,
  pengguna_id,
}: {
  alerts: AlertRingkas[];
  pengguna_id: string;
}) {
  const [daftar_alert, set_daftar_alert] = useState<AlertRingkas[]>(alerts);
  const [sedang_tandai, set_sedang_tandai] = useState<string | null>(null);
  const [pesan_galat, set_pesan_galat]     = useState<string | null>(null);
  const [filter, set_filter]               = useState<'all' | 'critical' | 'warning' | 'info' | 'unread'>('all');

  useEffect(() => { set_daftar_alert(alerts); }, [alerts]);

  const muat_ulang = useCallback(async () => {
    try {
      const res  = await fetch('/api/alerts?limit=20');
      if (!res.ok) return;
      const body = (await res.json()) as { alerts?: AlertRingkas[] };
      if (body.alerts) set_daftar_alert(body.alerts);
    } catch { /* abaikan */ }
  }, []);

  useEffect(() => {
    const supabase = buat_klien_supabase_peramban();
    const kanal = supabase
      .channel(`dashboard-alerts-${pengguna_id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'alerts', filter: `user_id=eq.${pengguna_id}` },
        (payload) => {
          const baru = payload.new as AlertRingkas;
          set_daftar_alert((prev) => {
            if (prev.some((a) => a.id === baru.id)) return prev;
            return [baru, ...prev].sort(
              (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
            );
          });
          set_pesan_galat(null);
        },
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'alerts', filter: `user_id=eq.${pengguna_id}` },
        (payload) => {
          const terbarui = payload.new as AlertRingkas;
          set_daftar_alert((prev) =>
            prev.map((a) => (a.id === terbarui.id ? terbarui : a)),
          );
        },
      )
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR') {
          set_pesan_galat(
            'Live updates unavailable. Run supabase/migrations/002_realtime_alerts.sql, then refresh.',
          );
        }
      });

    let kanal_tab: BroadcastChannel | null = null;
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      kanal_tab = new BroadcastChannel(`dashboard-sinkron-${pengguna_id}`);
      kanal_tab.onmessage = () => void muat_ulang();
    }

    const tangani_storage = (e: StorageEvent) => {
      if (e.key === `dashboard-sinkron-${pengguna_id}`) void muat_ulang();
    };
    window.addEventListener('storage', tangani_storage);

    return () => {
      void supabase.removeChannel(kanal);
      kanal_tab?.close();
      window.removeEventListener('storage', tangani_storage);
    };
  }, [pengguna_id, muat_ulang]);

  const tandai_baca = useCallback(async (alert_id: string) => {
    set_sedang_tandai(alert_id);
    set_pesan_galat(null);
    try {
      const res  = await fetch(`/api/alerts/${alert_id}/read`, { method: 'PATCH' });
      const body = (await res.json()) as { kesalahan?: string; read_at?: string };
      if (!res.ok) { set_pesan_galat(body.kesalahan ?? 'Failed to mark as read.'); return; }
      set_daftar_alert((prev) =>
        prev.map((a) =>
          a.id === alert_id ? { ...a, read_at: body.read_at ?? new Date().toISOString() } : a,
        ),
      );
    } catch {
      set_pesan_galat('Network error.');
    } finally {
      set_sedang_tandai(null);
    }
  }, []);

  const hitungan = {
    all:      daftar_alert.length,
    critical: daftar_alert.filter((a) => a.severity === 'critical').length,
    warning:  daftar_alert.filter((a) => a.severity === 'warning').length,
    info:     daftar_alert.filter((a) => a.severity === 'info').length,
    unread:   daftar_alert.filter((a) => !a.read_at).length,
  };

  const alert_terfilter = filter === 'all'    ? daftar_alert
    : filter === 'unread' ? daftar_alert.filter((a) => !a.read_at)
    : daftar_alert.filter((a) => a.severity === filter);

  const TAB_FILTER = [
    { id: 'all',      label: 'All'      },
    { id: 'critical', label: 'Critical' },
    { id: 'warning',  label: 'Warning'  },
    { id: 'info',     label: 'Info'     },
    { id: 'unread',   label: 'Unread'   },
  ] as const;

  return (
    <div className="mt-6">
      {pesan_galat ? (
        <p className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {pesan_galat}{' '}
          <button type="button" onClick={() => void muat_ulang()} className="font-semibold underline">
            Reload alerts
          </button>
        </p>
      ) : null}

      {daftar_alert.length === 0 ? (
        <PanelKosongPeringatan />
      ) : (
        <>
          {/* Filter tabs */}
          <div className="flex gap-1 overflow-x-auto pb-1">
            {TAB_FILTER.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => set_filter(tab.id)}
                className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  filter === tab.id
                    ? 'bg-accent text-white'
                    : 'bg-slate-100 text-muted hover:bg-slate-200 hover:text-foreground'
                }`}
              >
                {tab.label}
                <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold tabular-nums ${
                  filter === tab.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  {hitungan[tab.id]}
                </span>
              </button>
            ))}
          </div>

          <ul className="mt-4 space-y-4">
            {alert_terfilter.length === 0 ? (
              <li className="rounded-2xl border border-dashed border-border bg-card/50 px-6 py-10 text-center">
                <p className="text-sm text-muted">No {filter} alerts.</p>
              </li>
            ) : alert_terfilter.map((alert) => (
            <li key={alert.id} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-lg px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${WARNA_SEVERITY[alert.severity] ?? 'bg-slate-100 text-slate-800'}`}
                >
                  {alert.severity}
                </span>
                <time className="text-xs text-muted">{format_tanggal(alert.created_at)}</time>
                {alert.read_at ? (
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-medium text-emerald-800">
                    Read
                  </span>
                ) : (
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                    Unread
                  </span>
                )}
              </div>

              <h2 className="mt-2 text-base font-semibold text-foreground">{alert.title}</h2>
              <p className="mt-2 line-clamp-2 text-sm text-muted">{alert.summary}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href={`/dashboard/alerts/${alert.id}`}
                  className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:bg-slate-50"
                >
                  View details
                </Link>
                {!alert.read_at ? (
                  <button
                    type="button"
                    onClick={() => void tandai_baca(alert.id)}
                    disabled={sedang_tandai === alert.id}
                    className="rounded-lg bg-accent px-3 py-1.5 text-sm font-semibold text-white disabled:cursor-wait disabled:opacity-70"
                  >
                    {sedang_tandai === alert.id ? 'Updating…' : 'Mark as read'}
                  </button>
                ) : null}
              </div>
            </li>
          ))}
          </ul>
        </>
      )}
    </div>
  );
}
