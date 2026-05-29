#!/usr/bin/env node
/**
 * Uji Hari 9 — health email + (opsional) kirim welcome ke akun uji.
 * Jalankan: node --env-file=.env.local scripts/uji-manual-hari9-email.mjs
 * Dev server port 3001.
 */
const DASAR = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') || 'http://localhost:3001';

function lulus(pesan) {
  console.log(`✓ ${pesan}`);
}

function gagal(pesan) {
  console.error(`✗ ${pesan}`);
  process.exit(1);
}

async function jalanankan() {
  const res_health = await fetch(`${DASAR}/api/health/email`);
  const badan_health = await res_health.json();

  if (res_health.status === 503) {
    console.warn('Health email: env belum lengkap (RESEND_API_KEY). Lewati kirim nyata.');
    console.warn(badan_health.pesan ?? badan_health);
    process.exit(0);
  }

  if (!res_health.ok) {
    gagal(`Health email status ${res_health.status}: ${JSON.stringify(badan_health)}`);
  }

  lulus(`Resend siap — pengirim: ${badan_health.pengirim}`);

  const email_uji = process.env.UJI_MANUAL_EMAIL?.trim();
  if (!email_uji) {
    console.log('Tip: set UJI_MANUAL_EMAIL di .env.local untuk uji kirim welcome via API (butuh sesi).');
    process.exit(0);
  }

  console.log(`Akun uji: ${email_uji} — uji welcome lewat UI signup atau POST /api/email/welcome dengan cookie sesi.`);
  lulus('Health check Hari 9 selesai.');
}

jalanankan().catch((e) => {
  gagal(e instanceof Error ? e.message : String(e));
});
