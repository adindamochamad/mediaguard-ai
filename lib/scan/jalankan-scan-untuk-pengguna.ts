import type { SupabaseClient } from '@supabase/supabase-js';
import {
  analyzeForAlerts,
  filter_alert_relevan,
  kredensial_claude_terisi,
  siapkan_konten_crawl_untuk_analisis,
} from '@/lib/claude';
import { crawlFDAAlerts, crawlPubMed, kredensial_nimble_terisi, searchMedicalNews } from '@/lib/nimble';
import { cari_id_obat_dari_nama } from '@/lib/scan/cari-id-obat';
import {
  apakah_alert_duplikat,
  muat_indeks_duplikat,
  tandai_alert_di_indeks,
} from '@/lib/scan/deduplikasi-alert';
import { tebak_jenis_sumber } from '@/lib/scan/tebak-jenis-sumber';
import type { Obat } from '@/lib/tipe-obat';
import type { ItemAlertAnalisis } from '@/lib/tipe-alert';
import {
  ambil_email_pengguna,
  kirim_email_alert_kritis,
  type DataAlertKritisUntukEmail,
} from '@/lib/email';

const BATAS_OBAT_UNTUK_CRAWL = 8;

export type JenisScan = 'manual' | 'cron';

export type HasilScanPengguna = {
  id_pengguna: string;
  jenis_scan: JenisScan;
  jumlah_sumber: number;
  jumlah_alert_relevan: number;
  jumlah_alert_baru: number;
  jumlah_alert_duplikat: number;
  jumlah_email_kritis_terkirim: number;
  durasi_ms: number;
  pesan?: string;
};

function gabung_ringkasan_dan_tindakan(alert: ItemAlertAnalisis): string {
  return `${alert.summary.trim()}\n\nWhat you can do: ${alert.action.trim()}`;
}

async function kumpulkan_konten_nimble(daftar_obat: Obat[]): Promise<{
  konten: string;
  jumlah_sumber: number;
}> {
  const nama_untuk_crawl = daftar_obat
    .map((obat) => obat.generic_name?.trim() || obat.brand_name.trim())
    .filter(Boolean)
    .slice(0, BATAS_OBAT_UNTUK_CRAWL);

  let jumlah_sumber = 0;
  let hasil_fda;

  try {
    hasil_fda = await crawlFDAAlerts();
    jumlah_sumber += 1;
  } catch {
    hasil_fda = undefined;
  }

  const berita_per_obat: Array<{ nama_obat: string; hasil: Awaited<ReturnType<typeof searchMedicalNews>> }> =
    [];
  const pubmed_per_obat: Awaited<ReturnType<typeof crawlPubMed>>[] = [];

  if (kredensial_nimble_terisi() && nama_untuk_crawl.length > 0) {
    await Promise.all(
      nama_untuk_crawl.map(async (nama_obat) => {
        try {
          const [berita, pubmed] = await Promise.all([
            searchMedicalNews(nama_obat),
            crawlPubMed(nama_obat),
          ]);
          berita_per_obat.push({ nama_obat, hasil: berita });
          pubmed_per_obat.push(pubmed);
          jumlah_sumber += 2;
        } catch {
          /* satu obat gagal — lanjut obat lain */
        }
      }),
    );
  }

  const konten = siapkan_konten_crawl_untuk_analisis({
    fda: hasil_fda,
    berita_per_obat: berita_per_obat.length ? berita_per_obat : undefined,
    pubmed_per_obat: pubmed_per_obat.length ? pubmed_per_obat : undefined,
  });

  return { konten, jumlah_sumber: jumlah_sumber || (konten.length > 0 ? 1 : 0) };
}

async function simpan_alert_baru(
  supabase: SupabaseClient,
  id_pengguna: string,
  daftar_obat: Obat[],
  alert: ItemAlertAnalisis,
): Promise<boolean> {
  const id_obat = cari_id_obat_dari_nama(daftar_obat, alert.medication);
  const url_sumber = alert.source_url?.trim() || null;

  const { error } = await supabase.from('alerts').insert({
    user_id: id_pengguna,
    medication_id: id_obat,
    severity: alert.severity,
    title: alert.title.trim(),
    summary: gabung_ringkasan_dan_tindakan(alert),
    source_url: url_sumber,
    source_type: url_sumber ? tebak_jenis_sumber(url_sumber) : 'unknown',
    ai_confidence: alert.confidence,
    raw_source: alert.action.trim(),
  });

  if (error) {
    throw new Error(`Gagal menyimpan alert: ${error.message}`);
  }

  return true;
}

async function catat_log_scan(
  supabase: SupabaseClient,
  id_pengguna: string,
  jenis_scan: JenisScan,
  jumlah_sumber: number,
  jumlah_alert_baru: number,
  durasi_ms: number,
): Promise<void> {
  const { error } = await supabase.from('scan_logs').insert({
    user_id: id_pengguna,
    scan_type: jenis_scan,
    sources_crawled: jumlah_sumber,
    alerts_generated: jumlah_alert_baru,
    duration_ms: durasi_ms,
  });

  if (error) {
    console.error('[scan] gagal menulis scan_logs:', error.message);
  }
}

/**
 * Pipeline Hari 6: Nimble → Claude → deduplikasi → Supabase.
 * Alias dokumen: runScanForUser.
 */
export async function jalankan_scan_untuk_pengguna(opsi: {
  supabase: SupabaseClient;
  id_pengguna: string;
  jenis_scan?: JenisScan;
}): Promise<HasilScanPengguna> {
  const waktu_mulai = Date.now();
  const jenis_scan = opsi.jenis_scan ?? 'manual';

  const { data: daftar_obat, error: galat_obat } = await opsi.supabase
    .from('medications')
    .select('id, user_id, brand_name, generic_name, dosage, condition_note, created_at')
    .eq('user_id', opsi.id_pengguna)
    .order('created_at', { ascending: false });

  if (galat_obat) {
    throw new Error(`Gagal memuat obat: ${galat_obat.message}`);
  }

  const obat_pengguna = (daftar_obat ?? []) as Obat[];

  if (obat_pengguna.length === 0) {
    const durasi_ms = Date.now() - waktu_mulai;
    await catat_log_scan(opsi.supabase, opsi.id_pengguna, jenis_scan, 0, 0, durasi_ms);
    return {
      id_pengguna: opsi.id_pengguna,
      jenis_scan,
      jumlah_sumber: 0,
      jumlah_alert_relevan: 0,
      jumlah_alert_baru: 0,
      jumlah_alert_duplikat: 0,
      jumlah_email_kritis_terkirim: 0,
      durasi_ms,
      pesan: 'Add at least one medication before scanning.',
    };
  }

  if (!kredensial_claude_terisi()) {
    throw new Error('ANTHROPIC_API_KEY belum diatur — pipeline analisis tidak dapat dijalankan.');
  }

  const nama_obat_teks = obat_pengguna.map((o) => o.brand_name.trim()).filter(Boolean);
  const { konten, jumlah_sumber } = await kumpulkan_konten_nimble(obat_pengguna);

  if (!konten.trim()) {
    throw new Error(
      'Tidak ada konten crawl — periksa kredensial Nimble atau koneksi jaringan.',
    );
  }

  const keluaran = await analyzeForAlerts(konten, nama_obat_teks);
  const alert_relevan = filter_alert_relevan(keluaran, nama_obat_teks);

  const indeks_duplikat = await muat_indeks_duplikat(opsi.supabase, opsi.id_pengguna);
  let jumlah_alert_baru = 0;
  let jumlah_alert_duplikat = 0;
  const alert_kritis_baru: DataAlertKritisUntukEmail[] = [];

  for (const alert of alert_relevan) {
    const id_obat = cari_id_obat_dari_nama(obat_pengguna, alert.medication);

    if (apakah_alert_duplikat(alert, id_obat, indeks_duplikat)) {
      jumlah_alert_duplikat += 1;
      continue;
    }

    await simpan_alert_baru(opsi.supabase, opsi.id_pengguna, obat_pengguna, alert);
    tandai_alert_di_indeks(alert, id_obat, indeks_duplikat);
    jumlah_alert_baru += 1;

    if (alert.severity === 'critical') {
      const obat_cocok = obat_pengguna.find((o) => o.id === id_obat);
      alert_kritis_baru.push({
        alert,
        nama_obat_tampilan:
          obat_cocok?.brand_name.trim() || alert.medication.trim() || 'Your medication',
      });
    }
  }

  let jumlah_email_kritis_terkirim = 0;
  if (alert_kritis_baru.length > 0) {
    try {
      const email_pengguna = await ambil_email_pengguna(opsi.id_pengguna);
      if (email_pengguna) {
        const hasil_email = await kirim_email_alert_kritis(email_pengguna, alert_kritis_baru);
        jumlah_email_kritis_terkirim = hasil_email.terkirim;
      }
    } catch (galat_email) {
      console.error(
        '[email] pipeline scan — pengiriman alert kritis gagal:',
        galat_email instanceof Error ? galat_email.message : galat_email,
      );
    }
  }

  const durasi_ms = Date.now() - waktu_mulai;
  await catat_log_scan(
    opsi.supabase,
    opsi.id_pengguna,
    jenis_scan,
    jumlah_sumber,
    jumlah_alert_baru,
    durasi_ms,
  );

  return {
    id_pengguna: opsi.id_pengguna,
    jenis_scan,
    jumlah_sumber,
    jumlah_alert_relevan: alert_relevan.length,
    jumlah_alert_baru,
    jumlah_alert_duplikat,
    jumlah_email_kritis_terkirim,
    durasi_ms,
  };
}

/** Alias Inggris untuk dokumentasi arsitektur. */
export const runScanForUser = jalankan_scan_untuk_pengguna;
