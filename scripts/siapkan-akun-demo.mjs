#!/usr/bin/env node
/**
 * Siapkan akun demo juri: buat/update user Supabase + seed obat & alert.
 * Jalankan: node --env-file=.env.local scripts/siapkan-akun-demo.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const EMAIL_DEMO = 'demo@mediguard.adindamochamad.com';
const SANDI_DEMO = 'MediGuardDemo2026!';
const URL_APP = process.env.NEXT_PUBLIC_APP_URL?.trim() || 'http://localhost:3001';

const URL_SUPABASE = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const KUNCI_SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
const KUNCI_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

const __dir = dirname(fileURLToPath(import.meta.url));

function gagal(pesan) {
  console.error(`[demo] GAGAL — ${pesan}`);
  process.exit(1);
}

function lulus(pesan) {
  console.log(`[demo] OK — ${pesan}`);
}

function peringatan(pesan) {
  console.warn(`[demo] PERINGATAN — ${pesan}`);
}

if (!URL_SUPABASE || !KUNCI_SERVICE || !KUNCI_ANON) {
  gagal('NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, dan NEXT_PUBLIC_SUPABASE_ANON_KEY wajib di .env.local');
}

const header_admin = {
  Authorization: `Bearer ${KUNCI_SERVICE}`,
  apikey: KUNCI_SERVICE,
  'Content-Type': 'application/json',
};

const header_rest = {
  Authorization: `Bearer ${KUNCI_SERVICE}`,
  apikey: KUNCI_SERVICE,
  'Content-Type': 'application/json',
  Prefer: 'return=representation',
};

async function auth_admin(metode, path, body) {
  const respons = await fetch(`${URL_SUPABASE}/auth/v1/admin${path}`, {
    method: metode,
    headers: header_admin,
    body: body ? JSON.stringify(body) : undefined,
  });
  const teks = await respons.text();
  let json = null;
  try {
    json = teks ? JSON.parse(teks) : null;
  } catch {
    /* abaikan */
  }
  if (!respons.ok) {
    gagal(`Auth admin ${metode} ${path}: ${json?.msg ?? json?.message ?? teks ?? respons.status}`);
  }
  return json;
}

async function rest_db(metode, path, body) {
  const respons = await fetch(`${URL_SUPABASE}/rest/v1/${path}`, {
    method: metode,
    headers: header_rest,
    body: body ? JSON.stringify(body) : undefined,
  });
  const teks = await respons.text();
  let json = null;
  try {
    json = teks ? JSON.parse(teks) : null;
  } catch {
    json = teks;
  }
  if (!respons.ok) {
    gagal(`REST ${metode} ${path}: ${typeof json === 'object' ? JSON.stringify(json) : teks}`);
  }
  return json;
}

async function cari_pengguna_demo() {
  let halaman = 1;
  while (halaman <= 20) {
    const data = await auth_admin('GET', `/users?page=${halaman}&per_page=200`);
    const daftar = data?.users ?? [];
    const ketemu = daftar.find((u) => u.email?.toLowerCase() === EMAIL_DEMO.toLowerCase());
    if (ketemu) return ketemu;
    if (daftar.length < 200) break;
    halaman += 1;
  }
  return null;
}

async function pastikan_akun_demo() {
  const yang_ada = await cari_pengguna_demo();

  if (yang_ada) {
    await auth_admin('PUT', `/users/${yang_ada.id}`, {
      password: SANDI_DEMO,
      email_confirm: true,
    });
    lulus(`Akun demo sudah ada — password diset ulang (${yang_ada.id})`);
    return yang_ada.id;
  }

  const data = await auth_admin('POST', '/users', {
    email: EMAIL_DEMO,
    password: SANDI_DEMO,
    email_confirm: true,
  });
  lulus(`Akun demo baru dibuat (${data.id})`);
  return data.id;
}

function sinkronkan_uuid_di_seed_sql(id_pengguna) {
  const path_sql = join(__dir, 'seed-demo.sql');
  const isi = readFileSync(path_sql, 'utf8');
  const pola = /demo_user_id UUID := '[0-9a-f-]{36}'/;
  if (!pola.test(isi)) return;

  const isi_baru = isi.replace(pola, `demo_user_id UUID := '${id_pengguna}'`);
  if (isi_baru !== isi) {
    writeFileSync(path_sql, isi_baru);
    lulus(`seed-demo.sql UUID diselaraskan → ${id_pengguna}`);
  }
}

async function jalankan_seed(id_pengguna) {
  await rest_db('DELETE', `alerts?user_id=eq.${id_pengguna}`);
  await rest_db('DELETE', `medications?user_id=eq.${id_pengguna}`);
  await rest_db('DELETE', `scan_logs?user_id=eq.${id_pengguna}`);

  const daftar_obat = [
    { brand_name: 'Norvasc', generic_name: 'Amlodipine', dosage: '5mg once daily', condition_note: 'Hypertension / Angina' },
    { brand_name: 'Lipitor', generic_name: 'Atorvastatin', dosage: '20mg once daily', condition_note: 'High Cholesterol' },
    { brand_name: 'Synthroid', generic_name: 'Levothyroxine', dosage: '50mcg once daily', condition_note: 'Hypothyroidism' },
    { brand_name: 'Prinivil', generic_name: 'Lisinopril', dosage: '10mg once daily', condition_note: 'Hypertension' },
    { brand_name: 'Glucophage', generic_name: 'Metformin', dosage: '500mg twice daily', condition_note: 'Type 2 Diabetes' },
    { brand_name: 'Prilosec', generic_name: 'Omeprazole', dosage: '20mg once daily', condition_note: 'GERD / Acid Reflux' },
    { brand_name: 'Tylenol', generic_name: 'Paracetamol', dosage: '500mg as needed', condition_note: 'Pain / Fever' },
    { brand_name: 'Zoloft', generic_name: 'Sertraline', dosage: '50mg once daily', condition_note: 'Depression / Anxiety' },
    { brand_name: 'Coumadin', generic_name: 'Warfarin', dosage: '5mg once daily', condition_note: 'Atrial Fibrillation' },
  ];

  const obat_terinsert = await rest_db(
    'POST',
    'medications',
    daftar_obat.map((o) => ({ ...o, user_id: id_pengguna })),
  );

  const peta = new Map(obat_terinsert.map((o) => [o.generic_name, o.id]));

  const daftar_alert = [
    {
      medication_id: peta.get('Warfarin'),
      severity: 'critical',
      title: 'FDA Safety Alert: Warfarin — Increased Bleeding Risk with NSAIDs',
      summary:
        'The FDA has updated safety labeling for Warfarin to strengthen warnings about concurrent use with NSAIDs (ibuprofen, naproxen). Co-administration can significantly increase the risk of serious bleeding events, including gastrointestinal bleeding.\n\nWhat you can do: Contact your healthcare provider before taking any over-the-counter pain relievers. Do not stop Warfarin without medical guidance.',
      source_url: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=warfarin',
      source_type: 'fda',
      ai_confidence: 0.94,
    },
    {
      medication_id: peta.get('Metformin'),
      severity: 'warning',
      title: 'PubMed Study: Metformin — Vitamin B12 Deficiency Risk with Long-term Use',
      summary:
        'A meta-analysis (2024) in Diabetes Care confirms that long-term Metformin use is associated with a 20-30% increased risk of Vitamin B12 deficiency.\n\nWhat you can do: Ask your doctor about annual B12 screening.',
      source_url: 'https://pubmed.ncbi.nlm.nih.gov/38100217/',
      source_type: 'pubmed',
      ai_confidence: 0.88,
    },
    {
      medication_id: peta.get('Lisinopril'),
      severity: 'info',
      title: 'DailyMed Update: Lisinopril — Dry Cough Reporting Guidance',
      summary:
        'DailyMed has updated Lisinopril prescribing information to clarify that a dry, persistent cough affects approximately 10-15% of patients.\n\nWhat you can do: If you experience a persistent dry cough, mention it at your next appointment.',
      source_url: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=lisinopril',
      source_type: 'pubmed',
      ai_confidence: 0.82,
    },
    {
      medication_id: peta.get('Atorvastatin'),
      severity: 'warning',
      title: 'FDA Safety Communication: Atorvastatin — Muscle Pain and Rhabdomyolysis Risk',
      summary:
        'The FDA has issued updated guidance on statin-associated myopathy for Atorvastatin at higher doses.\n\nWhat you can do: Report unexplained muscle pain to your doctor immediately.',
      source_url: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=atorvastatin',
      source_type: 'fda',
      ai_confidence: 0.91,
    },
    {
      medication_id: peta.get('Omeprazole'),
      severity: 'warning',
      title: 'PubMed Study: Omeprazole — Long-term Use Linked to Kidney Disease Risk',
      summary:
        'Long-term PPI use (>2 years) is associated with increased chronic kidney disease risk.\n\nWhat you can do: Discuss with your doctor whether you still need long-term PPI therapy.',
      source_url: 'https://pubmed.ncbi.nlm.nih.gov/26752337/',
      source_type: 'pubmed',
      ai_confidence: 0.86,
    },
    {
      medication_id: peta.get('Sertraline'),
      severity: 'critical',
      title: 'FDA Black Box Warning: Sertraline — Increased Suicidal Thoughts in Young Adults',
      summary:
        'SSRIs including Sertraline carry a black box warning for increased suicidal thinking in young adults during the first 1–2 months of treatment.\n\nWhat you can do: Monitor closely and contact your healthcare provider if needed.',
      source_url: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=sertraline',
      source_type: 'fda',
      ai_confidence: 0.95,
    },
    {
      medication_id: peta.get('Paracetamol'),
      severity: 'warning',
      title: 'FDA Safety Reminder: Paracetamol — Overdose Risk from Multiple Sources',
      summary:
        'Accidental acetaminophen overdose is a leading cause of acute liver failure in the US.\n\nWhat you can do: Never exceed 4,000mg per day across all products.',
      source_url: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=acetaminophen',
      source_type: 'fda',
      ai_confidence: 0.9,
    },
    {
      medication_id: peta.get('Amlodipine'),
      severity: 'info',
      title: 'DailyMed Update: Amlodipine — Peripheral Edema Incidence Clarified',
      summary:
        'Peripheral edema occurs in up to 10.8% of patients on Amlodipine 10mg.\n\nWhat you can do: If you notice leg swelling, inform your doctor.',
      source_url: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=amlodipine',
      source_type: 'pubmed',
      ai_confidence: 0.8,
    },
    {
      medication_id: peta.get('Levothyroxine'),
      severity: 'info',
      title: 'FDA Guidance: Levothyroxine — Drug Interactions Affecting Absorption',
      summary:
        'Calcium, iron, and antacids reduce Levothyroxine absorption.\n\nWhat you can do: Take on an empty stomach, 30–60 minutes before breakfast.',
      source_url: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=levothyroxine',
      source_type: 'fda',
      ai_confidence: 0.83,
    },
  ];

  await rest_db(
    'POST',
    'alerts',
    daftar_alert.map((a) => ({ ...a, user_id: id_pengguna })),
  );

  lulus(`Seed: ${obat_terinsert.length} obat + ${daftar_alert.length} alert`);
}

async function verifikasi_login(id_pengguna) {
  const respons = await fetch(`${URL_SUPABASE}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: {
      apikey: KUNCI_ANON,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email: EMAIL_DEMO, password: SANDI_DEMO }),
  });
  const body = await respons.json();
  if (!respons.ok) {
    gagal(`Login verifikasi gagal: ${body.error_description ?? body.msg ?? respons.status}`);
  }
  lulus(`Login verifikasi berhasil (${body.user?.id ?? id_pengguna})`);

  const obat = await rest_db('GET', `medications?user_id=eq.${id_pengguna}&select=id`);
  const alert = await rest_db('GET', `alerts?user_id=eq.${id_pengguna}&select=id`);

  if (obat.length !== 9 || alert.length !== 9) {
    gagal(`Data demo tidak lengkap: obat=${obat.length}, alert=${alert.length}`);
  }
  lulus('Dashboard siap: 9 obat + 9 alert');

  try {
    const respons_config = await fetch(`${URL_APP}/api/konfigurasi-demo`, {
      signal: AbortSignal.timeout(10000),
    });
    if (respons_config.ok) {
      const cfg = await respons_config.json();
      lulus(`Production config: mode_demo_scan=${cfg.mode_demo_scan}, nimble=${cfg.nimble_siap}`);
    }
  } catch {
    peringatan(`Tidak bisa cek ${URL_APP}/api/konfigurasi-demo`);
  }
}

async function main() {
  const id_pengguna = await pastikan_akun_demo();
  sinkronkan_uuid_di_seed_sql(id_pengguna);
  await jalankan_seed(id_pengguna);
  await verifikasi_login(id_pengguna);
  console.log('\n[demo] Selesai — juri bisa login di /login dengan kredensial di scripts/teks-devpost-private-notes.txt');
}

main().catch((galat) => gagal(galat instanceof Error ? galat.message : String(galat)));
