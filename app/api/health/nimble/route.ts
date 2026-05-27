import { NextRequest, NextResponse } from 'next/server';
import {
  crawlFDAAlerts,
  crawlPubMed,
  kredensial_nimble_terisi,
  searchMedicalNews,
} from '@/lib/nimble';

type JenisTes = 'fda' | 'berita' | 'pubmed' | 'semua';

/**
 * GET — uji integrasi Nimble (Hari 4 checkpoint).
 *
 * Query opsional:
 * - tes=fda|berita|pubmed|semua (default: fda)
 * - obat=Metformin (wajib untuk berita/pubmed)
 */
export async function GET(permintaan: NextRequest) {
  if (!kredensial_nimble_terisi()) {
    return NextResponse.json(
      {
        status_nimble: 'env_belum_lengkap',
        pesan:
          'Set NIMBLE_API_KEY or NIMBLE_USERNAME + NIMBLE_PASSWORD in .env.local, then restart npm run dev.',
        hint_dashboard: 'Nimble → app.nimbleway.com → API keys or Basic Auth credentials.',
      },
      { status: 503 },
    );
  }

  const params = permintaan.nextUrl.searchParams;
  const jenis_tes = (params.get('tes') ?? 'fda') as JenisTes;
  const nama_obat = params.get('obat')?.trim() || 'Metformin';

  if ((jenis_tes === 'berita' || jenis_tes === 'pubmed') && !params.get('obat')) {
    // Metformin sebagai default demo — tidak perlu error
  }

  try {
    if (jenis_tes === 'fda') {
      const hasil = await crawlFDAAlerts();
      return NextResponse.json({
        status_nimble: 'terhubung',
        tes: 'fda',
        jumlah_item: hasil.item.length,
        sumber: hasil.sumber,
        contoh: hasil.item.slice(0, 3),
        cuplikan_panjang_karakter: hasil.cuplikan_teks.length,
      });
    }

    if (jenis_tes === 'berita') {
      const hasil = await searchMedicalNews(nama_obat);
      return NextResponse.json({
        status_nimble: 'terhubung',
        tes: 'berita',
        obat: nama_obat,
        jumlah_hasil: hasil.length,
        contoh: hasil.slice(0, 3),
      });
    }

    if (jenis_tes === 'pubmed') {
      const hasil = await crawlPubMed(nama_obat);
      return NextResponse.json({
        status_nimble: 'terhubung',
        tes: 'pubmed',
        obat: nama_obat,
        jumlah_artikel: hasil.artikel.length,
        contoh: hasil.artikel.slice(0, 3),
        cuplikan_panjang_karakter: hasil.cuplikan_teks.length,
      });
    }

    if (jenis_tes === 'semua') {
      const [fda, berita, pubmed] = await Promise.allSettled([
        crawlFDAAlerts(),
        searchMedicalNews(nama_obat),
        crawlPubMed(nama_obat),
      ]);

      return NextResponse.json({
        status_nimble: 'terhubung',
        tes: 'semua',
        obat: nama_obat,
        fda:
          fda.status === 'fulfilled'
            ? { ok: true, jumlah_item: fda.value.item.length, sumber: fda.value.sumber }
            : { ok: false, galat: String(fda.reason) },
        berita:
          berita.status === 'fulfilled'
            ? { ok: true, jumlah_hasil: berita.value.length }
            : { ok: false, galat: String(berita.reason) },
        pubmed:
          pubmed.status === 'fulfilled'
            ? { ok: true, jumlah_artikel: pubmed.value.artikel.length }
            : { ok: false, galat: String(pubmed.reason) },
      });
    }

    return NextResponse.json(
      { kesalahan: 'Invalid tes param — use fda, berita, pubmed, or semua.' },
      { status: 400 },
    );
  } catch (galat) {
    return NextResponse.json(
      {
        status_nimble: 'gagal',
        pesan_ringkas: galat instanceof Error ? galat.message : String(galat),
      },
      { status: 502 },
    );
  }
}
