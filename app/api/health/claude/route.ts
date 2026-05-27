import { NextRequest, NextResponse } from 'next/server';
import {
  analyzeForAlerts,
  filter_alert_relevan,
  kredensial_claude_terisi,
  siapkan_konten_crawl_untuk_analisis,
} from '@/lib/claude';
import { crawlFDAAlerts } from '@/lib/nimble';

/**
 * GET — uji pipeline Claude (Hari 5 checkpoint).
 *
 * Query:
 * - obat=Metformin,Lisinopril (default: Metformin,Lisinopril)
 * - mock=1 — lewati Claude, hanya uji RSS → format konten (dev, tanpa API key)
 */
export async function GET(permintaan: NextRequest) {
  const params = permintaan.nextUrl.searchParams;
  const pakai_mock = params.get('mock') === '1' && process.env.NODE_ENV === 'development';

  const daftar_obat = (params.get('obat') ?? 'Metformin,Lisinopril')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  if (daftar_obat.length === 0) {
    return NextResponse.json({ kesalahan: 'Parameter obat kosong.' }, { status: 400 });
  }

  try {
    const hasil_fda = await crawlFDAAlerts();
    const konten_crawl = siapkan_konten_crawl_untuk_analisis({ fda: hasil_fda });

    if (pakai_mock) {
      return NextResponse.json({
        status_claude: 'mock',
        pesan: 'RSS → konten crawl OK; Claude dilewati (mock=1).',
        obat: daftar_obat,
        sumber_fda: hasil_fda.sumber,
        jumlah_item_fda: hasil_fda.item.length,
        panjang_konten_karakter: konten_crawl.length,
        cuplikan_konten: konten_crawl.slice(0, 400),
      });
    }

    if (!kredensial_claude_terisi()) {
      return NextResponse.json(
        {
          status_claude: 'env_belum_lengkap',
          pesan:
            'Set ANTHROPIC_API_KEY in .env.local, then restart npm run dev. Or use ?mock=1 to test RSS formatting only.',
          hint_dashboard: 'console.anthropic.com → API Keys',
          sumber_fda: hasil_fda.sumber,
          jumlah_item_fda: hasil_fda.item.length,
        },
        { status: 503 },
      );
    }

    const keluaran = await analyzeForAlerts(konten_crawl, daftar_obat);
    const alert_relevan = filter_alert_relevan(keluaran, daftar_obat);

    return NextResponse.json({
      status_claude: 'terhubung',
      obat: daftar_obat,
      sumber_fda: hasil_fda.sumber,
      jumlah_item_fda: hasil_fda.item.length,
      jumlah_alert_mentah: keluaran.alerts.length,
      jumlah_alert_relevan: alert_relevan.length,
      alert: alert_relevan.slice(0, 5),
    });
  } catch (galat) {
    return NextResponse.json(
      {
        status_claude: 'gagal',
        pesan_ringkas: galat instanceof Error ? galat.message : String(galat),
      },
      { status: 502 },
    );
  }
}
