import {
  BATAS_CUPLIKAN_KARAKTER,
  URL_DASAR_NIMBLE_LEGACY,
  URL_DASAR_NIMBLE_SDK,
} from '@/lib/nimble/konstanta';

type ResponsEkstrakSdk = {
  data?: {
    html?: string;
    markdown?: string;
    text?: string;
  };
  html_content?: string;
  text_content?: string;
};

type ResponsPencarianSdk = {
  results?: Array<{
    title?: string;
    url?: string;
    description?: string;
    snippet?: string;
    content?: string;
    metadata?: { published_date?: string };
  }>;
};

/** Cek apakah kredensial Nimble sudah diatur di env server. */
export function kredensial_nimble_terisi(): boolean {
  const kunci_api = process.env.NIMBLE_API_KEY?.trim();
  const nama_pengguna = process.env.NIMBLE_USERNAME?.trim();
  const kata_sandi = process.env.NIMBLE_PASSWORD?.trim();
  return Boolean(kunci_api || (nama_pengguna && kata_sandi));
}

function ambil_header_otentikasi(): Record<string, string> {
  const kunci_api = process.env.NIMBLE_API_KEY?.trim();
  if (kunci_api) {
    return { Authorization: `Bearer ${kunci_api}` };
  }

  const nama_pengguna = process.env.NIMBLE_USERNAME?.trim();
  const kata_sandi = process.env.NIMBLE_PASSWORD?.trim() ?? '';
  if (nama_pengguna) {
    const token = Buffer.from(`${nama_pengguna}:${kata_sandi}`).toString('base64');
    return { Authorization: `Basic ${token}` };
  }

  throw new Error('Nimble credentials missing — set NIMBLE_API_KEY or NIMBLE_USERNAME + NIMBLE_PASSWORD.');
}

function potong_teks(teks: string, batas = BATAS_CUPLIKAN_KARAKTER): string {
  if (teks.length <= batas) return teks;
  return `${teks.slice(0, batas)}…`;
}

function normalisasi_konten_ekstrak(data: ResponsEkstrakSdk): string {
  return (
    data.data?.markdown ??
    data.data?.html ??
    data.data?.text ??
    data.html_content ??
    data.text_content ??
    ''
  );
}

/**
 * Ambil HTML/markdown halaman via Nimble Extract (SDK) dengan fallback legacy realtime.
 */
export async function ekstrak_halaman(url: string, render_js = false): Promise<string> {
  const header = {
    ...ambil_header_otentikasi(),
    'Content-Type': 'application/json',
  };

  const respons_sdk = await fetch(`${URL_DASAR_NIMBLE_SDK}/extract`, {
    method: 'POST',
    headers: header,
    body: JSON.stringify({
      url,
      render: render_js,
      country: 'US',
      locale: 'en-US',
    }),
  });

  if (respons_sdk.ok) {
    const data = (await respons_sdk.json()) as ResponsEkstrakSdk;
    const konten = normalisasi_konten_ekstrak(data);
    if (konten) return konten;
  }

  // Fallback API legacy (Basic Auth) — sesuai kontrak docs/07-API_INTEGRATIONS.md
  const respons_legacy = await fetch(`${URL_DASAR_NIMBLE_LEGACY}/realtime`, {
    method: 'POST',
    headers: header,
    body: JSON.stringify({ url, render_js }),
  });

  if (!respons_legacy.ok) {
    const status = respons_legacy.status;
    const pesan = await respons_legacy.text().catch(() => '');
    throw new Error(`Nimble extract failed (${status}): ${pesan.slice(0, 200)}`);
  }

  const data_legacy = (await respons_legacy.json()) as ResponsEkstrakSdk;
  const konten_legacy = normalisasi_konten_ekstrak(data_legacy);
  if (!konten_legacy) {
    throw new Error('Nimble extract returned empty content.');
  }

  return konten_legacy;
}

/**
 * Pencarian web medis via Nimble Search API.
 */
export async function cari_web_medical(
  kueri: string,
  jumlah_hasil = 5,
): Promise<Array<{ judul: string; url: string; cuplikan: string; tanggal?: string }>> {
  const header = {
    ...ambil_header_otentikasi(),
    'Content-Type': 'application/json',
  };

  const respons = await fetch(`${URL_DASAR_NIMBLE_SDK}/search`, {
    method: 'POST',
    headers: header,
    body: JSON.stringify({
      query: kueri,
      max_results: jumlah_hasil,
    }),
  });

  if (!respons.ok) {
    // Fallback legacy search endpoint
    const respons_legacy = await fetch(`${URL_DASAR_NIMBLE_LEGACY}/search`, {
      method: 'POST',
      headers: header,
      body: JSON.stringify({
        query: kueri,
        num_results: jumlah_hasil,
        freshness: 'last_month',
      }),
    });

    if (!respons_legacy.ok) {
      const status = respons_legacy.status;
      throw new Error(`Nimble search failed (${status}).`);
    }

    const data_legacy = (await respons_legacy.json()) as ResponsPencarianSdk;
    return normalisasi_hasil_pencarian(data_legacy);
  }

  const data = (await respons.json()) as ResponsPencarianSdk;
  return normalisasi_hasil_pencarian(data);
}

function normalisasi_hasil_pencarian(
  data: ResponsPencarianSdk,
): Array<{ judul: string; url: string; cuplikan: string; tanggal?: string }> {
  return (data.results ?? [])
    .filter((item) => item.title && item.url)
    .map((item) => ({
      judul: item.title!.trim(),
      url: item.url!.trim(),
      cuplikan: potong_teks(
        (item.description ?? item.snippet ?? item.content ?? '').trim(),
        500,
      ),
      tanggal: item.metadata?.published_date,
    }));
}

/** Ambil XML RSS FDA tanpa Nimble — cadangan bila crawl utama gagal. */
export async function ambil_rss_fda(): Promise<string> {
  const { URL_FDA_RSS_MEDWATCH } = await import('@/lib/nimble/konstanta');
  const respons = await fetch(URL_FDA_RSS_MEDWATCH, {
    headers: { Accept: 'application/rss+xml, application/xml, text/xml' },
    next: { revalidate: 3600 },
  });

  if (!respons.ok) {
    throw new Error(`FDA RSS fetch failed (${respons.status}).`);
  }

  return respons.text();
}

export { potong_teks };
