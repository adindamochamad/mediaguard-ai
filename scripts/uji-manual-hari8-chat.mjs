#!/usr/bin/env node
/**
 * Uji manual Hari 8 — POST /api/chat (SSE + Nimble meta).
 * Jalankan: node --env-file=.env.local scripts/uji-manual-hari8-chat.mjs
 *
 * Opsional: UJI_MANUAL_EMAIL + UJI_MANUAL_PASSWORD di .env.local
 * Bila kosong: buat akun uji sekali pakai SUPABASE_SERVICE_ROLE_KEY.
 */
import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';

/** Dev lokal selalu port 3001 — jangan ikut APP_URL jika salah port. */
const URL_APP = 'http://localhost:3001';
const URL_SUPABASE = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const KUNCI_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
const KUNCI_SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
const EMAIL_UJI = process.env.UJI_MANUAL_EMAIL?.trim();
const SANDI_UJI = process.env.UJI_MANUAL_PASSWORD?.trim();
const SANDI_UJI_OTOMATIS = 'MediGuardUjiHari8!';

function gagal(pesan) {
  console.error(`[hari8] GAGAL — ${pesan}`);
  process.exit(1);
}

function lulus(pesan) {
  console.log(`[hari8] OK — ${pesan}`);
}

if (!URL_SUPABASE || !KUNCI_ANON) {
  gagal('NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY belum diatur.');
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

async function buat_akun_uji_sementara() {
  if (!KUNCI_SERVICE) {
    gagal(
      'Tanpa UJI_MANUAL_EMAIL: butuh SUPABASE_SERVICE_ROLE_KEY untuk membuat akun uji sementara.',
    );
  }

  const email_baru = `uji-hari8-${Date.now()}@mailinator.com`;
  const admin = createClient(URL_SUPABASE, KUNCI_SERVICE, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { error: galat_buat } = await admin.auth.admin.createUser({
    email: email_baru,
    password: SANDI_UJI_OTOMATIS,
    email_confirm: true,
  });
  if (galat_buat) gagal(`Buat akun uji: ${galat_buat.message}`);

  return { email: email_baru, sandi: SANDI_UJI_OTOMATIS };
}

async function pastikan_sesi() {
  let email = EMAIL_UJI;
  let sandi = SANDI_UJI;

  if (!email || !sandi) {
    const akun = await buat_akun_uji_sementara();
    email = akun.email;
    sandi = akun.sandi;
    lulus(`Akun uji sementara dibuat: ${email}`);
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password: sandi });
  if (error) gagal(`Login uji: ${error.message}`);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) gagal('Sesi tidak terbentuk setelah login.');
  lulus(`Login sebagai ${user.email}`);
}

async function pastikan_obat() {
  const respons = await fetch(`${URL_APP}/api/medications`, {
    headers: { Cookie: header_kuki() },
  });
  if (!respons.ok) gagal(`GET /api/medications → ${respons.status}`);
  const body = await respons.json();
  const daftar = body.obat ?? body.medications ?? [];
  if (daftar.length > 0) {
    lulus(`Profil obat ada (${daftar.length} item)`);
    return;
  }

  const tambah = await fetch(`${URL_APP}/api/medications`, {
    method: 'POST',
    headers: { Cookie: header_kuki(), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      brand_name: 'Metformin',
      generic_name: 'Metformin',
      dosage: '500mg',
    }),
  });
  if (!tambah.ok) {
    const err = await tambah.json().catch(() => ({}));
    gagal(`POST obat uji → ${tambah.status} ${err.kesalahan ?? ''}`);
  }
  lulus('Menambah Metformin untuk konteks chat');
}

async function uji_halaman_chat() {
  const respons = await fetch(`${URL_APP}/dashboard/chat`, {
    headers: { Cookie: header_kuki() },
    redirect: 'manual',
  });
  if (respons.status === 307 || respons.status === 302) {
    gagal('/dashboard/chat redirect ke login — sesi cookie tidak diterima Next.js');
  }
  if (!respons.ok) gagal(`/dashboard/chat → ${respons.status}`);
  const html = await respons.text();
  if (!html.includes('Ask about medication safety')) {
    gagal('/dashboard/chat tidak memuat UI chat');
  }
  lulus('/dashboard/chat halaman terbuka (UI chat terdeteksi)');
}

async function uji_sse_chat() {
  const respons = await fetch(`${URL_APP}/api/chat`, {
    method: 'POST',
    headers: { Cookie: header_kuki(), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      pertanyaan: 'Any recent FDA safety communication about Metformin?',
    }),
  });

  const tipe_konten = respons.headers.get('content-type') ?? '';
  if (respons.status !== 200) {
    const err = await respons.text();
    gagal(`POST /api/chat → ${respons.status}: ${err.slice(0, 300)}`);
  }
  if (!tipe_konten.includes('text/event-stream')) {
    gagal(`Content-Type bukan SSE: ${tipe_konten}`);
  }
  lulus('POST /api/chat 200 + text/event-stream');

  const teks = await respons.text();
  const baris = teks.split('\n').filter((b) => b.startsWith('data: '));
  if (baris.length < 2) gagal('SSE terlalu sedikit event');

  let jumlah_token = 0;
  let jumlah_sumber = 0;
  let ada_selesai = false;
  let panjang_jawaban = 0;

  for (const baris_data of baris) {
    try {
      const payload = JSON.parse(baris_data.slice(6));
      if (payload.tipe === 'meta' && Array.isArray(payload.sumber)) {
        jumlah_sumber = payload.sumber.length;
      } else if (payload.tipe === 'token' && typeof payload.token === 'string') {
        jumlah_token += 1;
        panjang_jawaban += payload.token.length;
      } else if (payload.tipe === 'done') {
        ada_selesai = true;
      }
    } catch {
      /* abaikan baris rusak */
    }
  }

  if (!ada_selesai) gagal('Event SSE "done" tidak ditemukan');
  lulus('Event SSE selesai (done)');

  if (jumlah_token < 2) {
    gagal(`Streaming kurang dari 2 chunk token (dapat ${jumlah_token}) — mungkin bukan stream bertahap`);
  }
  lulus(`Respons stream bertahap (${jumlah_token} chunk, ${panjang_jawaban} karakter)`);

  if (jumlah_sumber < 1) {
    gagal('Meta SSE tidak memuat sumber Nimble — panel "Nimble sources fetched" akan kosong');
  }
  lulus(`Nimble meta: ${jumlah_sumber} sumber (FDA/medical search)`);
}

async function main() {
  console.log('=== Uji manual Hari 8 — AI Chat ===\n');
  await pastikan_sesi();
  await pastikan_obat();
  await uji_halaman_chat();
  await uji_sse_chat();
  console.log('\n[hari8] Semua langkah otomatis Day 8 lulus.');
}

main().catch((galat) => {
  console.error(galat);
  process.exit(1);
});
