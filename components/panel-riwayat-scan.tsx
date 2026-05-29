type LogScan = {
  id: string;
  created_at: string;
  scan_type: string | null;
  sources_crawled: number | null;
  alerts_generated: number | null;
  duration_ms: number | null;
};

function format_waktu(iso: string) {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function PanelRiwayatScan({ riwayat }: { riwayat: LogScan[] }) {
  if (riwayat.length === 0) return null;

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <h2 className="text-sm font-semibold text-foreground">Scan History</h2>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-[480px] w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="pb-2.5 text-xs font-medium text-muted">Time</th>
              <th className="pb-2.5 text-xs font-medium text-muted">Type</th>
              <th className="pb-2.5 text-xs font-medium text-muted">Sources</th>
              <th className="pb-2.5 text-xs font-medium text-muted">New alerts</th>
              <th className="pb-2.5 text-xs font-medium text-muted">Duration</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {riwayat.map((log) => (
              <tr key={log.id} className="group">
                <td className="py-2.5 text-foreground">{format_waktu(log.created_at)}</td>
                <td className="py-2.5">
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs capitalize text-slate-700">
                    {log.scan_type ?? 'auto'}
                  </span>
                </td>
                <td className="py-2.5 tabular-nums text-muted">{log.sources_crawled ?? '—'}</td>
                <td className="py-2.5 tabular-nums text-muted">{log.alerts_generated ?? '—'}</td>
                <td className="py-2.5 tabular-nums text-muted">
                  {log.duration_ms != null ? `${(log.duration_ms / 1000).toFixed(1)}s` : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
