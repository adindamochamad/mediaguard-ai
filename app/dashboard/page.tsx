import { BungkusBatasGalat } from '@/components/bungkus-batas-galat';
import { BannerModeDemoHybrid } from '@/components/banner-mode-demo-hybrid';
import { DaftarAlertRingkas } from '@/components/daftar-alert-ringkas';
import { GrafikSeverityAlert } from '@/components/grafik-severity-alert';
import { KontrolScanDashboard } from '@/components/kontrol-scan-dashboard';
import { PanelOnboarding } from '@/components/panel-onboarding';
import { PanelRiwayatScan } from '@/components/panel-riwayat-scan';
import { PenampilGangguanLayanan } from '@/components/penampil-gangguan-layanan';
import { RingkasanAlert } from '@/components/ringkasan-alert';
import { buat_klien_supabase_server } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

const PETUNJUK_LAYANAN =
  'Nimble, Claude, or Supabase may be slow or unavailable. Try again in a moment.';

export default async function HalamanDashboard() {
  const supabase = await buat_klien_supabase_server();
  const {
    data: { user: pengguna },
  } = await supabase.auth.getUser();

  if (!pengguna) {
    redirect('/login');
  }

  const [
    { data: alerts, error: galat_alerts },
    { data: riwayat_scan, error: galat_log },
    { count: jumlah_obat, error: galat_obat },
  ] = await Promise.all([
    supabase
      .from('alerts')
      .select('id, user_id, severity, title, summary, source_url, ai_confidence, read_at, user_helpful, feedback_at, created_at')
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

  const pesan_galat_db = [galat_alerts, galat_log, galat_obat]
    .filter(Boolean)
    .map((g) => g!.message)
    .join(' ');

  const daftar_alert = alerts ?? [];
  const daftar_log   = riwayat_scan ?? [];
  const waktu_scan_terakhir = daftar_log[0]?.created_at ?? null;
  const belum_ada_obat = (jumlah_obat ?? 0) === 0;

  if (belum_ada_obat) {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="font-display text-2xl text-foreground">Alerts</h1>
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
      <BannerModeDemoHybrid konteks="dashboard" />

      {pesan_galat_db ? (
        <PenampilGangguanLayanan
          pesan={pesan_galat_db}
          saran={[
            'Confirm Supabase project is online and RLS migrations ran.',
            'Scan and AI features need Nimble + Anthropic keys when not in DEMO_FALLBACK mode.',
            'Health: /api/health/db · /api/health/nimble · /api/health/claude',
          ]}
        />
      ) : null}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl text-foreground">Alerts</h1>
          <p className="mt-1 text-sm text-muted">
            Personalized safety updates for your medication list.
          </p>
        </div>

        <BungkusBatasGalat
          nama_bagian="scan"
          judul="Scan unavailable"
          petunjuk={`${PETUNJUK_LAYANAN} You can still read existing alerts below.`}
        >
          <KontrolScanDashboard
            waktu_scan_terakhir={waktu_scan_terakhir}
            pengguna_id={pengguna.id}
            jumlah_obat={jumlah_obat ?? 0}
          />
        </BungkusBatasGalat>
      </div>

      <BungkusBatasGalat
        nama_bagian="ringkasan"
        judul="Summary stats unavailable"
        petunjuk="Alert counts could not be rendered. The list below may still work."
      >
        <RingkasanAlert alerts={daftar_alert} />
      </BungkusBatasGalat>

      <BungkusBatasGalat
        nama_bagian="grafik"
        judul="Chart unavailable"
        petunjuk="Severity chart failed to load. Other sections are unaffected."
      >
        <GrafikSeverityAlert alerts={daftar_alert} />
      </BungkusBatasGalat>

      <BungkusBatasGalat
        nama_bagian="daftar-alert"
        judul="Alert list unavailable"
        petunjuk={`${PETUNJUK_LAYANAN} Reload the page if this persists.`}
      >
        <DaftarAlertRingkas alerts={daftar_alert} pengguna_id={pengguna.id} />
      </BungkusBatasGalat>

      <BungkusBatasGalat
        nama_bagian="riwayat-scan"
        judul="Scan history unavailable"
        petunjuk="Recent scan logs could not be displayed."
      >
        <PanelRiwayatScan riwayat={daftar_log} />
      </BungkusBatasGalat>
    </div>
  );
}
