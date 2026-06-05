import { TabelRiwayatScan } from '@/components/tabel-riwayat-scan';
import { PenampilGangguanLayanan } from '@/components/penampil-gangguan-layanan';
import { buat_klien_supabase_server } from '@/lib/supabase/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';

const BATAS_LOG = 20;

export default async function HalamanRiwayatScan() {
  const supabase = await buat_klien_supabase_server();
  const {
    data: { user: pengguna },
  } = await supabase.auth.getUser();

  if (!pengguna) redirect('/login');

  const [
    { data: logs, error: galat_log },
    { count: jumlah_obat },
    { count: total_scan },
  ] = await Promise.all([
    supabase
      .from('scan_logs')
      .select('id, created_at, scan_type, sources_crawled, alerts_generated, duration_ms')
      .eq('user_id', pengguna.id)
      .order('created_at', { ascending: false })
      .limit(BATAS_LOG),
    supabase
      .from('medications')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', pengguna.id),
    supabase
      .from('scan_logs')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', pengguna.id),
  ]);

  const riwayat = logs ?? [];
  const scan_manual = riwayat.filter((l) => l.scan_type === 'manual').length;
  const total_alert_dari_log = riwayat.reduce((j, l) => j + (l.alerts_generated ?? 0), 0);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground"
        >
          ← Back to alerts
        </Link>
        <h1 className="mt-3 font-display text-2xl text-foreground">Scan history</h1>
        <p className="mt-1 text-sm text-muted">
          Past Nimble + Claude scans for your medication profile — manual and scheduled runs.
        </p>
      </div>

      {galat_log ? (
        <PenampilGangguanLayanan
          pesan={galat_log.message}
          saran={['Run supabase/migrations/001_schema_rls.sql if scan_logs is missing.']}
        />
      ) : null}

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="card-surface p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">Profile</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-foreground">
            {jumlah_obat ?? 0}
          </p>
          <p className="text-xs text-muted">medications on file</p>
        </div>
        <div className="card-surface p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">Recent scans</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-foreground">
            {total_scan ?? riwayat.length}
          </p>
          <p className="text-xs text-muted">
            showing last {BATAS_LOG} · {scan_manual} manual in view
          </p>
        </div>
        <div className="card-surface p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">New alerts (view)</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-foreground">
            {total_alert_dari_log}
          </p>
          <p className="text-xs text-muted">from scans listed below</p>
        </div>
      </div>

      <div className="card-surface p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-foreground">Scan log</h2>
          <Link href="/dashboard" className="btn-primary text-sm">
            Scan now
          </Link>
        </div>
        <div className="mt-4">
          <TabelRiwayatScan riwayat={riwayat} varian="penuh" />
        </div>
      </div>
    </div>
  );
}
