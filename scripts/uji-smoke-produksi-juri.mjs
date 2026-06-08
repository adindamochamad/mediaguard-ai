#!/usr/bin/env node
/**
 * Smoke test production — alur yang sama juri lakukan (virtual judging).
 * Jalankan: node --env-file=.env.local scripts/uji-smoke-produksi-juri.mjs
 */
import { createServerClient } from '@supabase/ssr';

const URL_APP = (process.env.NEXT_PUBLIC_APP_URL?.trim() || 'https://mediguard.adindamochamad.com').replace(
  /\/$/,
  '',
);
const URL_SUPABASE = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const KUNCI_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
const EMAIL_DEMO = 'demo@mediguard.adindamochamad.com';
const SANDI_DEMO = 'MediGuardDemo2026!';
const PERTANYAAN_CHAT = 'Any FDA warning about Metformin this week?';

const temuan = { lulus: [], gagal: [], peringatan: [] };

function catat(jenis, pesan) {
  temuan[jenis].push(pesan);
  const pref = jenis === 'lulus' ? '✓' : jenis === 'gagal' ? '✗' : '⚠';
  console.log(`[smoke] ${pref} ${pesan}`);
}

if (!URL_SUPABASE || !KUNCI_ANON) {
  console.error('[smoke] Butuh NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const penyimpan_kuki = [];
const supabase = createServerClient(URL_SUPABASE, KUNCI_ANON, {
  cookies: {
    getAll() {
      return penyimpan_kuki;
    },
    setAll(array_baru) {
      array_baru.forEach((kuki) => {
        const indeks = penyimpan_kuki.findIndex((l) => l.name === kuki.name);
        if (indeks >= 0) penyimpan_kuki[indeks] = kuki;
        else penyimpan_kuki.push(kuki);
      });
    },
  },
});

const header_kuki = () => penyimpan_kuki.map((k) => `${k.name}=${k.value}`).join('; ');

async function uji_health() {
  for (const path of ['/api/health/db', '/api/health/nimble', '/api/health/claude', '/api/health/email']) {
    try {
      const respons = await fetch(`${URL_APP}${path}`, { signal: AbortSignal.timeout(60_000) });
      const body = await respons.json().catch(() => ({}));
      if (!respons.ok) {
        catat('gagal', `${path} → HTTP ${respons.status}`);
        continue;
      }
      const kunci_status = Object.keys(body).find((k) => k.startsWith('status_'));
      const nilai = kunci_status ? body[kunci_status] : JSON.stringify(body).slice(0, 80);
      if (['terhubung', 'siap'].includes(nilai)) {
        catat('lulus', `${path} → ${nilai}`);
      } else {
        catat('peringatan', `${path} → ${nilai}`);
      }
    } catch (galat) {
      catat('gagal', `${path} timeout/error: ${galat.message}`);
    }
  }
}

async function uji_login_juri() {
  const respons_hint = await fetch(`${URL_APP}/login`, { signal: AbortSignal.timeout(15_000) });
  const html = await respons_hint.text();
  if (html.includes('Judge demo account') || html.includes('demo@mediguard')) {
    catat('lulus', '/login menampilkan hint akun juri');
  } else if (html.includes('MediGuardDemo2026')) {
    catat('lulus', '/login menampilkan petunjuk demo (password terlihat)');
  } else {
    catat('peringatan', '/login — hint juri tidak terdeteksi di HTML (mungkin client-render)');
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: EMAIL_DEMO,
    password: SANDI_DEMO,
  });
  if (error) {
    catat('gagal', `Login demo gagal: ${error.message}`);
    return false;
  }
  catat('lulus', `Login demo sukses (${data.user?.email})`);
  return true;
}

async function uji_obat() {
  const respons = await fetch(`${URL_APP}/api/medications`, {
    headers: { Cookie: header_kuki() },
    signal: AbortSignal.timeout(15_000),
  });
  if (!respons.ok) {
    catat('gagal', `GET /api/medications → ${respons.status}`);
    return;
  }
  const body = await respons.json();
  const jumlah = (body.obat ?? []).length;
  if (jumlah >= 9) {
    catat('lulus', `${jumlah} obat di profil demo (target ≥9)`);
  } else if (jumlah >= 1) {
    catat('peringatan', `Hanya ${jumlah} obat — seed demo mungkin belum lengkap (harapkan 9)`);
  } else {
    catat('gagal', 'Profil demo tanpa obat — juri akan lihat dashboard kosong');
  }
}

async function uji_alerts() {
  const respons = await fetch(`${URL_APP}/api/alerts`, {
    headers: { Cookie: header_kuki() },
    signal: AbortSignal.timeout(15_000),
  });
  if (!respons.ok) {
    catat('gagal', `GET /api/alerts → ${respons.status}`);
    return;
  }
  const body = await respons.json();
  const alerts = body.alerts ?? [];
  if (alerts.length === 0) {
    catat('gagal', '0 alert — dashboard juri akan terlihat kosong');
    return;
  }

  const kritis = alerts.filter((a) => a.severity === 'critical').length;
  const dengan_url = alerts.filter((a) => a.source_url?.startsWith('http')).length;
  catat('lulus', `${alerts.length} alert (${kritis} critical)`);

  if (dengan_url < alerts.length) {
    catat('peringatan', `${alerts.length - dengan_url} alert tanpa source_url valid`);
  } else {
    catat('lulus', 'Semua alert punya source_url HTTP');
  }

  // Verifikasi URL pertama bisa dijangkau (HEAD)
  const contoh = alerts.find((a) => a.source_url?.includes('fda.gov')) ?? alerts[0];
  if (contoh?.source_url) {
    try {
      const head = await fetch(contoh.source_url, {
        method: 'HEAD',
        redirect: 'follow',
        signal: AbortSignal.timeout(12_000),
      });
      if (head.ok || head.status === 403 || head.status === 405) {
        catat('lulus', `Source URL sample reachable: ${contoh.source_url.slice(0, 60)}… (${head.status})`);
      } else {
        catat('peringatan', `Source URL sample HTTP ${head.status}: ${contoh.source_url}`);
      }
    } catch {
      catat('peringatan', `Source URL tidak bisa di-HEAD (mungkin block bot): ${contoh.source_url}`);
    }
  }
}

async function uji_scan() {
  const mulai = Date.now();
  const respons = await fetch(`${URL_APP}/api/scan`, {
    method: 'POST',
    headers: { Cookie: header_kuki() },
    signal: AbortSignal.timeout(30_000),
  });
  const durasi = Date.now() - mulai;
  const body = await respons.json().catch(() => ({}));

  if (!respons.ok) {
    catat('gagal', `POST /api/scan → ${respons.status}: ${body.kesalahan ?? JSON.stringify(body).slice(0, 120)}`);
    return;
  }

  const scan = body.scan ?? {};
  catat(
    'lulus',
    `Scan Now ${durasi}ms — baru: ${scan.jumlah_alert_baru ?? '?'}, duplikat: ${scan.jumlah_alert_duplikat ?? '?'}, sumber: ${scan.jumlah_sumber ?? '?'}`,
  );

  if (durasi > 5000) {
    catat('peringatan', `Scan lambat (${durasi}ms) — DEMO_FALLBACK mungkin off; juri expect ~1s`);
  } else if (durasi <= 3000) {
    catat('lulus', `Scan cepat (${durasi}ms) — cocok hybrid demo mode`);
  }

  if ((scan.jumlah_sumber ?? 0) >= 3) {
    catat('lulus', 'scan_logs menunjukkan multiple sources (realistic counts)');
  }
}

async function uji_chat() {
  const mulai = Date.now();
  const respons = await fetch(`${URL_APP}/api/chat`, {
    method: 'POST',
    headers: { Cookie: header_kuki(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ pertanyaan: PERTANYAAN_CHAT }),
    signal: AbortSignal.timeout(120_000),
  });
  const durasi = Date.now() - mulai;

  if (respons.status !== 200) {
    const err = await respons.text();
    catat('gagal', `POST /api/chat → ${respons.status}: ${err.slice(0, 200)}`);
    return;
  }

  const tipe = respons.headers.get('content-type') ?? '';
  if (!tipe.includes('text/event-stream')) {
    catat('gagal', `Chat bukan SSE: ${tipe}`);
    return;
  }

  const teks = await respons.text();
  const baris = teks.split('\n').filter((b) => b.startsWith('data: '));
  let ada_done = false;
  let ada_status = false;
  let jumlah_sumber = 0;
  let panjang_token = 0;
  const daftar_sumber = [];

  for (const baris_data of baris) {
    try {
      const payload = JSON.parse(baris_data.slice(6));
      if (payload.tipe === 'status') ada_status = true;
      if (payload.tipe === 'meta' && Array.isArray(payload.sumber)) {
        jumlah_sumber = payload.sumber.length;
        daftar_sumber.push(...payload.sumber.map((s) => s.url).filter(Boolean));
      }
      if (payload.tipe === 'token') panjang_token += String(payload.token ?? '').length;
      if (payload.tipe === 'done') ada_done = true;
    } catch {
      /* abaikan */
    }
  }

  if (!ada_done) catat('gagal', 'Chat SSE tanpa event done');
  else catat('lulus', `Chat selesai ${durasi}ms — ${panjang_token} karakter streamed`);

  if (ada_status) catat('lulus', 'Chat menampilkan status line tool Nimble (SSE status)');
  else catat('peringatan', 'Chat tanpa SSE status — juri tidak lihat "Crawling FDA…" di UI');

  if (jumlah_sumber >= 1) {
    catat('lulus', `Panel Nimble: ${jumlah_sumber} sumber (${daftar_sumber.slice(0, 2).join(', ').slice(0, 80)}…)`);
  } else {
    catat('gagal', 'Chat tanpa meta sumber — highlight Nimble Challenge tidak terbukti');
  }

  if (panjang_token < 50) {
    catat('peringatan', `Jawaban chat sangat pendek (${panjang_token} chars)`);
  }
}

async function uji_konfigurasi_demo() {
  try {
    const respons = await fetch(`${URL_APP}/api/konfigurasi-demo`, { signal: AbortSignal.timeout(10_000) });
    const body = await respons.json().catch(() => ({}));
    if (body.mode_demo_scan === true) {
      catat('lulus', 'DEMO_FALLBACK aktif di production (mode_demo_scan=true)');
    } else {
      catat('peringatan', 'DEMO_FALLBACK tidak terdeteksi — Scan Now bisa 60–120s di demo juri');
    }
  } catch {
    catat('peringatan', '/api/konfigurasi-demo tidak bisa dijangkau');
  }
}

async function main() {
  console.log(`=== Smoke test production (juri) — ${URL_APP} ===\n`);

  await uji_health();
  await uji_konfigurasi_demo();

  const login_ok = await uji_login_juri();
  if (!login_ok) {
    console.log('\n--- RINGKASAN ---');
    console.log(`GAGAL: ${temuan.gagal.length} | PERINGATAN: ${temuan.peringatan.length} | LULUS: ${temuan.lulus.length}`);
    process.exit(1);
  }

  await uji_obat();
  await uji_alerts();
  await uji_scan();
  await uji_chat();

  console.log('\n--- RINGKASAN ---');
  console.log(`LULUS: ${temuan.lulus.length} | PERINGATAN: ${temuan.peringatan.length} | GAGAL: ${temuan.gagal.length}`);

  if (temuan.gagal.length > 0) process.exit(1);
}

main().catch((galat) => {
  console.error(galat);
  process.exit(1);
});
