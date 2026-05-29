import { DaftarAlertRingkas } from '@/components/daftar-alert-ringkas';
import { GrafikSeverityAlert } from '@/components/grafik-severity-alert';
import { KontrolScanDashboard } from '@/components/kontrol-scan-dashboard';
import { PanelOnboarding } from '@/components/panel-onboarding';
import { PanelRiwayatScan } from '@/components/panel-riwayat-scan';
import { RingkasanAlert } from '@/components/ringkasan-alert';
import { buat_klien_supabase_server } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function HalamanDashboard() {
  const supabase = await buat_klien_supabase_server();
  const {
    data: { user: pengguna },
  } = await supabase.auth.getUser();

  if (!pengguna) {
    redirect('/login');
  }

  const [{ data: alerts }, { data: riwayat_scan }, { count: jumlah_obat }] = await Promise.all([
    supabase
      .from('alerts')
      .select('id, user_id, severity, title, summary, source_url, ai_confidence, read_at, created_at')
      .eq('user_id', pengguna.id)
      .order('created_at', { ascending: false })
      .limit(20),
    supabase
      .from('scan_logs')
      .select('id, created_at, scan_type, sources_crawled, alerts_generated, duration_ms')
      .eq('user_id', pengguna.id)
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('medications')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', pengguna.id),
  ]);

  const daftar_alert = alerts ?? [];
  const daftar_log   = riwayat_scan ?? [];
  const waktu_scan_terakhir = daftar_log[0]?.created_at ?? null;
  const belum_ada_obat = (jumlah_obat ?? 0) === 0;

  if (belum_ada_obat) {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Alerts</h1>
          <p className="mt-1 text-sm text-muted">
            Personalized safety updates for your medication list.
          </p>
        </div>
        <PanelOnboarding />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Alerts</h1>
          <p className="mt-1 text-sm text-muted">
            Personalized safety updates for your medication list.
          </p>
        </div>

        <KontrolScanDashboard
          waktu_scan_terakhir={waktu_scan_terakhir}
          pengguna_id={pengguna.id}
        />
      </div>

      <RingkasanAlert alerts={daftar_alert} />

      <GrafikSeverityAlert alerts={daftar_alert} />

      <DaftarAlertRingkas alerts={daftar_alert} pengguna_id={pengguna.id} />

      <PanelRiwayatScan riwayat={daftar_log} />
    </div>
  );
}
