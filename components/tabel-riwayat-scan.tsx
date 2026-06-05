import Link from 'next/link';
import { perkirakan_jumlah_obat_dari_sumber } from '@/lib/scan/perkirakan-jumlah-obat-dari-sumber';

export type BarisLogScan = {
  id: string;
  created_at: string;
  scan_type: string | null;
  sources_crawled: number | null;
  alerts_generated: number | null;
  duration_ms: number | null;
};

function format_waktu(iso: string, format_panjang = false) {
  return new Date(iso).toLocaleString('en-US', {
    weekday: format_panjang ? 'short' : undefined,
    month: 'short',
    day: 'numeric',
    year: format_panjang ? 'numeric' : undefined,
    hour: '2-digit',
    minute: '2-digit',
  });
}

function label_tipe(scan_type: string | null) {
  if (scan_type === 'manual') return 'Scan Now';
  if (scan_type === 'cron') return 'Scheduled (6h)';
  return scan_type ?? 'Background';
}

type PropsTabel = {
  riwayat: BarisLogScan[];
  /** Tampilan ringkas di dashboard vs penuh di halaman history. */
  varian?: 'ringkas' | 'penuh';
};

export function TabelRiwayatScan({ riwayat, varian = 'penuh' }: PropsTabel) {
  if (riwayat.length === 0) {
    return (
      <div className="card-surface border border-dashed border-border px-6 py-12 text-center">
        <p className="text-sm font-medium text-foreground">No scans yet</p>
        <p className="mt-2 text-sm text-muted">
          Run <strong>Scan Now</strong> on the Alerts page to check FDA, PubMed, and medical news
          for your medications.
        </p>
        <Link href="/dashboard" className="btn-primary mt-6 inline-flex">
          Go to Alerts
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-[640px] w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left">
            <th className="pb-2.5 text-xs font-medium text-muted">Time</th>
            <th className="pb-2.5 text-xs font-medium text-muted">Type</th>
            <th className="pb-2.5 text-xs font-medium text-muted">Meds scanned</th>
            <th className="pb-2.5 text-xs font-medium text-muted">Sources</th>
            <th className="pb-2.5 text-xs font-medium text-muted">New alerts</th>
            <th className="pb-2.5 text-xs font-medium text-muted">Duration</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {riwayat.map((log) => {
            const obat_perkiraan = perkirakan_jumlah_obat_dari_sumber(log.sources_crawled);
            const jumlah_alert = log.alerts_generated ?? 0;

            return (
              <tr key={log.id} className="group">
                <td className="py-3 text-foreground">
                  {format_waktu(log.created_at, varian === 'penuh')}
                </td>
                <td className="py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      log.scan_type === 'manual'
                        ? 'bg-accent-soft text-accent'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {label_tipe(log.scan_type)}
                  </span>
                </td>
                <td className="py-3 tabular-nums text-muted">
                  {obat_perkiraan != null ? `~${obat_perkiraan}` : '—'}
                </td>
                <td className="py-3 tabular-nums text-muted">{log.sources_crawled ?? '—'}</td>
                <td className="py-3 tabular-nums">
                  <span
                    className={
                      jumlah_alert > 0 ? 'font-medium text-foreground' : 'text-muted'
                    }
                  >
                    {log.alerts_generated ?? '—'}
                  </span>
                </td>
                <td className="py-3 tabular-nums text-muted">
                  {log.duration_ms != null ? `${(log.duration_ms / 1000).toFixed(1)}s` : '—'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {varian === 'penuh' ? (
        <p className="mt-4 text-xs text-muted">
          Meds scanned is estimated from sources crawled (FDA + 2 sources per medication).
          Scheduled scans run every 6 hours when configured on the server.
        </p>
      ) : null}
    </div>
  );
}
