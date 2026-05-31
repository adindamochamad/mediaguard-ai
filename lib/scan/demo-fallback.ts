import type { SupabaseClient } from '@supabase/supabase-js';

// =============================================================================
// UNTUK DEMO "WHOA MOMENT" — entry pertama sudah diisi real FDA recall:
//
// Atorvastatin (Ascend Laboratories / Alkem) — FDA Class II Recall, Oct 2025
// Dissolution failure: tablets may not absorb, rendering cholesterol treatment
// ineffective. 141,000+ bottles recalled. Lot #s verified dari FDA enforcement.
//
// Kalau ingin update ke alert yang lebih baru sebelum presentasi:
//   1. Buka https://www.accessdata.fda.gov/scripts/ires/index.cfm
//   2. Cari obat relevan dengan tanggal recall terbaru
//   3. Update entry pertama di bawah
// =============================================================================

type AlertDemo = {
  severity: 'critical' | 'warning' | 'info';
  title: string;
  summary: string;
  source_url: string;
  source_type: string;
  ai_confidence: number;
  medication_name: string;
  // Tanggal kapan MediGuard "mendeteksi" alert ini — diisi NOW() saat INSERT
  // tapi bisa di-override ke tanggal spesifik jika diperlukan untuk demo
  detected_at?: string;
};

// Entry pertama = "whoa moment" — real FDA Class II Recall, Oktober 2025
const DEMO_ALERTS: AlertDemo[] = [
  {
    severity: 'warning',
    title: 'FDA Class II Recall: Atorvastatin Calcium — Dissolution Failure, Medication May Not Absorb (Ascend Laboratories)',
    summary:
      'The FDA classified a nationwide voluntary recall of Atorvastatin Calcium tablets (10mg, 20mg, 40mg, 80mg) manufactured by Alkem Laboratories Ltd. and distributed by Ascend Laboratories LLC as Class II on October 10, 2025. ' +
      'Routine quality control testing found the tablets fail dissolution specifications — meaning the pill may not break down at the correct rate for absorption, potentially rendering your cholesterol treatment ineffective.\n\n' +
      'Affected lot numbers include: 25141249, 24144938, 24144868, 24144867, 24144458, 24143994, 24142987, 24143316 (10mg), and additional lots for 20mg, 40mg, 80mg doses. NDC: 67877-511-xx / 67877-512-xx / 67877-513-xx / 67877-514-xx.\n\n' +
      'What you can do: Check the lot number on your Atorvastatin bottle against the recall list. Contact your pharmacy for a replacement if your lot is affected. Keep taking your prescribed dose unless your doctor tells you otherwise — uncontrolled LDL cholesterol poses its own risk.',
    source_url:
      'https://www.accessdata.fda.gov/scripts/ires/index.cfm',
    source_type: 'fda',
    ai_confidence: 0.96,
    medication_name: 'Atorvastatin',
  },
  {
    severity: 'critical',
    title: 'FDA Drug Safety Communication: Warfarin — Increased Bleeding Risk with Concurrent NSAID Use',
    summary:
      'The FDA published updated safety labeling for Warfarin (warfarin sodium) strengthening warnings about concurrent use with NSAIDs including ibuprofen and naproxen. ' +
      'Co-administration significantly increases risk of serious bleeding events — including gastrointestinal and intracranial bleeding.\n\n' +
      'What you can do: Do not take ibuprofen (Advil, Motrin) or naproxen (Aleve) while on Warfarin without consulting your healthcare provider first. ' +
      'Contact your doctor or pharmacist before your next dose if you have taken an NSAID recently.',
    source_url:
      'https://www.fda.gov/drugs/drug-safety-and-availability/fda-drug-safety-communication-warfarin-nsaid-interactions',
    source_type: 'fda',
    ai_confidence: 0.94,
    medication_name: 'Warfarin',
  },
  {
    severity: 'warning',
    title: 'PubMed: Metformin Long-term Use Linked to Vitamin B12 Deficiency — 2024 Meta-analysis',
    summary:
      'A meta-analysis published in Diabetes Care (2024) confirms long-term Metformin use is associated with a 20–30% increased risk of Vitamin B12 deficiency. ' +
      'Deficiency can cause peripheral neuropathy and cognitive changes that are often misattributed to diabetes progression itself.\n\n' +
      'What you can do: Ask your doctor about annual B12 blood level screening. ' +
      'If levels are low, supplementation is straightforward and effective.',
    source_url: 'https://pubmed.ncbi.nlm.nih.gov/search/?term=metformin+vitamin+b12+deficiency+meta-analysis',
    source_type: 'pubmed',
    ai_confidence: 0.88,
    medication_name: 'Metformin',
  },
  {
    severity: 'info',
    title: 'DailyMed: Lisinopril Labeling Updated — Dry Cough Incidence Clarification',
    summary:
      'DailyMed has updated Lisinopril prescribing information to clarify that a dry, persistent cough affects approximately 10–15% of patients and occurs more frequently in women. ' +
      'The cough typically resolves within 1–4 weeks of discontinuation and is not a sign of serious harm.\n\n' +
      'What you can do: If you have developed a persistent dry cough since starting Lisinopril, mention it at your next appointment. ' +
      'An alternative ACE inhibitor or ARB (e.g. losartan) may be considered.',
    source_url: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=lisinopril',
    source_type: 'pubmed',
    ai_confidence: 0.82,
    medication_name: 'Lisinopril',
  },
];

export async function sisipkan_alert_demo(
  supabase: SupabaseClient,
  id_pengguna: string,
): Promise<number> {
  const { data: daftar_obat } = await supabase
    .from('medications')
    .select('id, brand_name, generic_name')
    .eq('user_id', id_pengguna);

  const peta_obat = new Map<string, string>();
  for (const obat of daftar_obat ?? []) {
    if (obat.brand_name) peta_obat.set(obat.brand_name.toLowerCase(), obat.id);
    if (obat.generic_name) peta_obat.set(obat.generic_name.toLowerCase(), obat.id);
  }

  let jumlah_sisip = 0;

  for (const alert of DEMO_ALERTS) {
    const id_obat = peta_obat.get(alert.medication_name.toLowerCase()) ?? null;

    const baris: Record<string, unknown> = {
      user_id: id_pengguna,
      medication_id: id_obat,
      severity: alert.severity,
      title: alert.title,
      summary: alert.summary,
      source_url: alert.source_url,
      source_type: alert.source_type,
      ai_confidence: alert.ai_confidence,
      raw_source: '',
    };

    if (alert.detected_at) {
      baris.created_at = alert.detected_at;
    }

    const { error } = await supabase.from('alerts').insert(baris);

    if (!error) jumlah_sisip++;
  }

  return jumlah_sisip;
}
