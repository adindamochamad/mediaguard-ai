#!/usr/bin/env node
/**
 * Uji otomatis Day 1–2 (Polish & Testing) — alur penuh + edge case.
 * Jalankan: node --env-file=.env.local scripts/uji-polish-day1-2.mjs
 * Prasyarat: npm run dev di port 3001.
 */
import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';

const URL_APP = 'http://localhost:3001';
const URL_SUPABASE = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const KUNCI_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
const KUNCI_SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
const SANDI_UJI = 'MediGuardUjiPolish12!';

const PERTANYAAN_MEDIS_KOMPLEKS =
  'I take Metformin 500mg twice daily and Lisinopril 10mg. If I develop mild nausea ' +
  'and my eGFR dropped from 72 to 58, should I adjust anything before my next visit? ' +
  'What FDA or PubMed signals should I watch for this combination?';

const NAMA_OBAT_FIKTIF = 'ZzzymoniumX999NotInDatabase';

const penyimpan_kuki = [];

function gagal(pesan) {
  console.error(`[polish] GAGAL — ${pesan}`);
  process.exit(1);
}

function lulus(pesan) {
  console.log(`[polish] OK — ${pesan}`);
}

function peringatan(pesan) {
  console.warn(`[polish] PERINGATAN — ${pesan}`);
}

if (!URL_SUPABASE || !KUNCI_ANON) {
  gagal('NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY belum diatur.');
}

if (!KUNCI_SERVICE) {
  gagal('SUPABASE_SERVICE_ROLE_KEY diperlukan untuk membuat akun uji.');
}

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

async function pastikan_server_hidup() {
  try {
    const respons = await fetch(`${URL_APP}/api/health/db`, {
      signal: AbortSignal.timeout(8000),
    });
    if (!respons.ok) gagal(`Server tidak sehat: /api/health/db → ${respons.status}`);
    const body = await respons.json();
    if (body.status_database !== 'terhubung') {
      gagal(`Database health: ${JSON.stringify(body)}`);
    }
    lulus('Dev server + DB health di port 3001');
  } catch (galat) {
    gagal(`Tidak bisa menjangkau ${URL_APP} — jalankan: npm run dev (${galat.message})`);
  }
}

async function buat_dan_login_akun() {
  const email_baru = `uji-polish-${Date.now()}@mailinator.com`;
  const admin = createClient(URL_SUPABASE, KUNCI_SERVICE, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { error: galat_buat } = await admin.auth.admin.createUser({
    email: email_baru,
    password: SANDI_UJI,
    email_confirm: true,
  });
  if (galat_buat) gagal(`Buat akun (signup API admin): ${galat_buat.message}`);

  const { error: galat_login } = await supabase.auth.signInWithPassword({
    email: email_baru,
    password: SANDI_UJI,
  });
  if (galat_login) gagal(`Login setelah signup: ${galat_login.message}`);

  lulus(`Alur signup → sesi: ${email_baru}`);
  return email_baru;
}

async function uji_obat_fiktif() {
  const respons = await fetch(`${URL_APP}/api/medications`, {
    method: 'POST',
    headers: { Cookie: header_kuki(), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      brand_name: NAMA_OBAT_FIKTIF,
      dosage: '10mg',
      condition_note: 'Edge case — tidak ada di database obat eksternal',
    }),
  });

  if (respons.status !== 201) {
    const err = await respons.json().catch(() => ({}));
    gagal(`Obat fiktif harus diterima (free-text profil) → ${respons.status} ${err.kesalahan ?? ''}`);
  }

  const body = await respons.json();
  if (!body.obat?.brand_name?.includes(NAMA_OBAT_FIKTIF.slice(0, 8))) {
    gagal('Respons POST obat fiktif tidak memuat brand_name');
  }
  lulus(`Input obat tidak ada di DB eksternal diterima: ${NAMA_OBAT_FIKTIF}`);
}

async function tambah_obat_relevan_scan() {
  const respons = await fetch(`${URL_APP}/api/medications`, {
    method: 'POST',
    headers: { Cookie: header_kuki(), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      brand_name: 'Metformin',
      generic_name: 'Metformin',
      dosage: '500mg',
    }),
  });
  if (!respons.ok) {
    const err = await respons.json().catch(() => ({}));
    gagal(`POST Metformin → ${respons.status} ${err.kesalahan ?? ''}`);
  }
  lulus('Obat Metformin ditambahkan untuk konteks scan');
}

async function uji_scan_dan_alerts() {
  if (process.env.DEMO_FALLBACK === 'true') {
    peringatan('DEMO_FALLBACK=true — scan memakai demo-fallback, bukan Nimble live');
  }

  const respons = await fetch(`${URL_APP}/api/scan`, {
    method: 'POST',
    headers: { Cookie: header_kuki() },
    signal: AbortSignal.timeout(180_000),
  });

  const body = await respons.json().catch(() => ({}));

  if (respons.status === 502) {
    const pesan = body.kesalahan ?? '';
    if (pesan.includes('konten crawl') || pesan.includes('Nimble')) {
      peringatan(
        `Scan 502 (kemungkinan Nimble timeout / tanpa konten): ${pesan.slice(0, 120)} — ` +
          'perilaku server: graceful 502, bukan crash',
      );
      return;
    }
    gagal(`Scan 502 tidak terduga: ${pesan}`);
  }

  if (!respons.ok) {
    gagal(`POST /api/scan → ${respons.status} ${JSON.stringify(body)}`);
  }

  if (body.status !== 'selesai' || !body.scan) {
    gagal('Respons scan tidak memuat status selesai');
  }

  lulus(
    `Scan selesai — alert baru: ${body.scan.jumlah_alert_baru}, duplikat: ${body.scan.jumlah_alert_duplikat}, ` +
      `sumber: ${body.scan.jumlah_sumber}, durasi: ${body.scan.durasi_ms}ms`,
  );

  const respons_alerts = await fetch(`${URL_APP}/api/alerts`, {
    headers: { Cookie: header_kuki() },
  });
  if (!respons_alerts.ok) gagal(`GET /api/alerts → ${respons_alerts.status}`);
  const alerts_body = await respons_alerts.json();
  const jumlah = (alerts_body.alerts ?? []).length;
  lulus(`GET /api/alerts → ${jumlah} alert di profil`);
}

async function uji_chat_medis_kompleks() {
  const respons = await fetch(`${URL_APP}/api/chat`, {
    method: 'POST',
    headers: { Cookie: header_kuki(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ pertanyaan: PERTANYAAN_MEDIS_KOMPLEKS }),
    signal: AbortSignal.timeout(120_000),
  });

  const tipe_konten = respons.headers.get('content-type') ?? '';
  if (respons.status !== 200) {
    const err = await respons.text();
    gagal(`POST /api/chat (kompleks) → ${respons.status}: ${err.slice(0, 400)}`);
  }
  if (!tipe_konten.includes('text/event-stream')) {
    gagal(`Chat kompleks: bukan SSE (${tipe_konten})`);
  }

  const teks = await respons.text();
  const baris = teks.split('\n').filter((b) => b.startsWith('data: '));
  let ada_done = false;
  let panjang_jawaban = 0;
  let jumlah_sumber = 0;

  for (const baris_data of baris) {
    try {
      const payload = JSON.parse(baris_data.slice(6));
      if (payload.tipe === 'meta' && Array.isArray(payload.sumber)) {
        jumlah_sumber = payload.sumber.length;
      } else if (payload.tipe === 'token') {
        panjang_jawaban += String(payload.token ?? '').length;
      } else if (payload.tipe === 'done') {
        ada_done = true;
      }
    } catch {
      /* abaikan */
    }
  }

  if (!ada_done) gagal('Chat medis kompleks: event done tidak ada');
  if (panjang_jawaban < 80) {
    peringatan(`Jawaban chat pendek (${panjang_jawaban} karakter) — cek kunci Claude`);
  } else {
    lulus(`Chat medis kompleks — stream ${panjang_jawaban} karakter`);
  }

  if (jumlah_sumber < 1) {
    peringatan('Chat kompleks tanpa meta sumber Nimble (FDA crawl mungkin gagal/timeout)');
  } else {
    lulus(`Chat kompleks — ${jumlah_sumber} sumber Nimble di meta`);
  }
}

async function uji_health_nimble() {
  try {
    const respons = await fetch(`${URL_APP}/api/health/nimble`, {
      signal: AbortSignal.timeout(45_000),
    });
    const body = await respons.json().catch(() => ({}));
    if (respons.ok && body.status_nimble === 'terhubung') {
      lulus('Nimble health terhubung (baseline sebelum uji timeout manual)');
      return;
    }
    peringatan(
      `Nimble health tidak ideal (${respons.status}) — scan mengandalkan RSS FDA fallback bila per-obat timeout`,
    );
  } catch {
    peringatan('Nimble health timeout — edge case scan harus gagal graceful atau pakai RSS');
  }
}

async function uji_middleware_tanpa_login() {
  const respons = await fetch(`${URL_APP}/dashboard`, { redirect: 'manual' });
  if (respons.status !== 307 && respons.status !== 302) {
    gagal(`/dashboard tanpa login harus redirect, dapat ${respons.status}`);
  }
  lulus('Middleware: /dashboard tanpa sesi → redirect login');
}

async function main() {
  console.log('=== Uji Day 1–2 — Polish & Testing ===\n');
  await pastikan_server_hidup();
  await uji_health_nimble();
  await uji_middleware_tanpa_login();
  await buat_dan_login_akun();
  await uji_obat_fiktif();
  await tambah_obat_relevan_scan();
  await uji_scan_dan_alerts();
  await uji_chat_medis_kompleks();
  console.log('\n[polish] Semua langkah otomatis Day 1–2 selesai (lihat PERINGATAN jika ada).');
}

main().catch((galat) => {
  console.error(galat);
  process.exit(1);
});
