-- MediGuard AI — Demo Account Seed
-- Jalankan di Supabase SQL Editor sebelum presentasi.
--
-- LANGKAH PERSIAPAN:
--   1. Buat akun di /signup dengan email demo@mediguard.adindamochamad.com
--      Password: MediGuardDemo2026! (lihat scripts/teks-devpost-private-notes.txt)
--   2. Buka Supabase Dashboard → Authentication → Users
--   3. Salin UUID akun demo tersebut (atau pakai UUID di bawah jika sudah cocok)
--   4. Ganti demo_user_id jika UUID berbeda
--   5. Jalankan script ini

DO $$
DECLARE
  demo_user_id UUID := 'b8c5b6da-5346-4c2c-9c09-db22cc540579';
  met_id UUID;
  lis_id UUID;
  war_id UUID;
  ato_id UUID;
  ome_id UUID;
  ser_id UUID;
  par_id UUID;
  aml_id UUID;
  lev_id UUID;
BEGIN
  -- Bersihkan data lama agar idempotent
  DELETE FROM alerts       WHERE user_id = demo_user_id;
  DELETE FROM medications  WHERE user_id = demo_user_id;
  DELETE FROM scan_logs    WHERE user_id = demo_user_id;

  -- Insert medications (9 obat — sesuai BATAS_OBAT_UNTUK_CRAWL, urut alfabet generic_name)
  INSERT INTO medications (id, user_id, brand_name, generic_name, dosage, condition_note) VALUES
    (gen_random_uuid(), demo_user_id, 'Norvasc',    'Amlodipine',     '5mg once daily',     'Hypertension / Angina'),
    (gen_random_uuid(), demo_user_id, 'Lipitor',    'Atorvastatin',   '20mg once daily',    'High Cholesterol'),
    (gen_random_uuid(), demo_user_id, 'Synthroid',  'Levothyroxine',  '50mcg once daily',   'Hypothyroidism'),
    (gen_random_uuid(), demo_user_id, 'Prinivil',   'Lisinopril',     '10mg once daily',    'Hypertension'),
    (gen_random_uuid(), demo_user_id, 'Glucophage', 'Metformin',      '500mg twice daily',  'Type 2 Diabetes'),
    (gen_random_uuid(), demo_user_id, 'Prilosec',   'Omeprazole',     '20mg once daily',    'GERD / Acid Reflux'),
    (gen_random_uuid(), demo_user_id, 'Tylenol',    'Paracetamol',    '500mg as needed',    'Pain / Fever'),
    (gen_random_uuid(), demo_user_id, 'Zoloft',     'Sertraline',     '50mg once daily',    'Depression / Anxiety'),
    (gen_random_uuid(), demo_user_id, 'Coumadin',   'Warfarin',       '5mg once daily',     'Atrial Fibrillation');

  SELECT id INTO met_id FROM medications WHERE user_id = demo_user_id AND generic_name = 'Metformin';
  SELECT id INTO lis_id FROM medications WHERE user_id = demo_user_id AND generic_name = 'Lisinopril';
  SELECT id INTO war_id FROM medications WHERE user_id = demo_user_id AND generic_name = 'Warfarin';
  SELECT id INTO ato_id FROM medications WHERE user_id = demo_user_id AND generic_name = 'Atorvastatin';
  SELECT id INTO ome_id FROM medications WHERE user_id = demo_user_id AND generic_name = 'Omeprazole';
  SELECT id INTO ser_id FROM medications WHERE user_id = demo_user_id AND generic_name = 'Sertraline';
  SELECT id INTO par_id FROM medications WHERE user_id = demo_user_id AND generic_name = 'Paracetamol';
  SELECT id INTO aml_id FROM medications WHERE user_id = demo_user_id AND generic_name = 'Amlodipine';
  SELECT id INTO lev_id FROM medications WHERE user_id = demo_user_id AND generic_name = 'Levothyroxine';

  -- Insert pre-seeded alerts (sudah ada saat demo dimulai)
  INSERT INTO alerts (user_id, medication_id, severity, title, summary, source_url, source_type, ai_confidence) VALUES
    (
      demo_user_id, war_id, 'critical',
      'FDA Safety Alert: Warfarin — Increased Bleeding Risk with NSAIDs',
      'The FDA has updated safety labeling for Warfarin to strengthen warnings about concurrent use with NSAIDs (ibuprofen, naproxen). Co-administration can significantly increase the risk of serious bleeding events, including gastrointestinal bleeding.' || chr(10) || chr(10) || 'What you can do: Contact your healthcare provider before taking any over-the-counter pain relievers. Do not stop Warfarin without medical guidance.',
      'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=warfarin',
      'fda', 0.94
    ),
    (
      demo_user_id, met_id, 'warning',
      'PubMed Study: Metformin — Vitamin B12 Deficiency Risk with Long-term Use',
      'A meta-analysis (2024) in Diabetes Care confirms that long-term Metformin use is associated with a 20-30% increased risk of Vitamin B12 deficiency. Deficiency can cause peripheral neuropathy and cognitive changes that may be misattributed to diabetes progression.' || chr(10) || chr(10) || 'What you can do: Ask your doctor about annual B12 screening. Supplementation may be appropriate if levels are low.',
      'https://pubmed.ncbi.nlm.nih.gov/38100217/',
      'pubmed', 0.88
    ),
    (
      demo_user_id, lis_id, 'info',
      'DailyMed Update: Lisinopril — Dry Cough Reporting Guidance',
      'DailyMed has updated Lisinopril prescribing information to clarify that a dry, persistent cough affects approximately 10-15% of patients and is more common in women. The cough typically resolves within 1-4 weeks of discontinuation.' || chr(10) || chr(10) || 'What you can do: If you experience a persistent dry cough, mention it at your next appointment. An alternative ACE inhibitor or ARB may be considered.',
      'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=lisinopril',
      'pubmed', 0.82
    ),
    (
      demo_user_id, ato_id, 'warning',
      'FDA Safety Communication: Atorvastatin — Muscle Pain and Rhabdomyolysis Risk',
      'The FDA has issued updated guidance on statin-associated myopathy. Patients taking Atorvastatin at higher doses (40–80mg) have an elevated risk of muscle injury, ranging from mild myalgia to rare but serious rhabdomyolysis, especially when combined with certain antibiotics or antifungals.' || chr(10) || chr(10) || 'What you can do: Report unexplained muscle pain, weakness, or dark urine to your doctor immediately. Do not adjust your dose without medical guidance.',
      'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=atorvastatin',
      'fda', 0.91
    ),
    (
      demo_user_id, ome_id, 'warning',
      'PubMed Study: Omeprazole — Long-term Use Linked to Kidney Disease Risk',
      'A large cohort study published in JAMA Internal Medicine found that long-term PPI use (>2 years), including Omeprazole, is associated with a 20-50% increased risk of chronic kidney disease compared to H2 blocker use. The mechanism may involve interstitial nephritis.' || chr(10) || chr(10) || 'What you can do: Discuss with your doctor whether you still need long-term PPI therapy or if a lower dose or alternative is appropriate. Do not stop abruptly — rebound acid hypersecretion may occur.',
      'https://pubmed.ncbi.nlm.nih.gov/26752337/',
      'pubmed', 0.86
    ),
    (
      demo_user_id, ser_id, 'critical',
      'FDA Black Box Warning: Sertraline — Increased Suicidal Thoughts in Young Adults',
      'The FDA requires a black box warning on all SSRIs including Sertraline: antidepressants may increase the risk of suicidal thinking and behavior in children, adolescents, and young adults (18–24) during the first 1–2 months of treatment.' || chr(10) || chr(10) || 'What you can do: Monitor closely for worsening depression, agitation, or unusual behavior changes — especially in the first weeks of starting or changing doses. Contact your healthcare provider or call 988 (Suicide & Crisis Lifeline) if needed.',
      'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=sertraline',
      'fda', 0.95
    ),
    (
      demo_user_id, par_id, 'warning',
      'FDA Safety Reminder: Paracetamol — Overdose Risk from Multiple Sources',
      'The FDA warns that accidental overdose of acetaminophen (Paracetamol) is the leading cause of acute liver failure in the US. Many combination OTC products (cold medicines, sleep aids) also contain acetaminophen — patients may unknowingly exceed the 4g/day maximum safe dose.' || chr(10) || chr(10) || 'What you can do: Always check all medication labels for acetaminophen content. Never exceed 4,000mg (4g) per day across all products. Avoid alcohol while taking Paracetamol.',
      'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=acetaminophen',
      'fda', 0.90
    ),
    (
      demo_user_id, aml_id, 'info',
      'DailyMed Update: Amlodipine — Peripheral Edema Incidence Clarified',
      'Updated prescribing information clarifies that peripheral edema (ankle/leg swelling) occurs in up to 10.8% of patients on Amlodipine 10mg, compared to 2.9% at 5mg. It is dose-dependent and more common in women. It does not indicate worsening heart failure in most cases.' || chr(10) || chr(10) || 'What you can do: If you notice leg swelling, inform your doctor. A dose reduction or switch to another calcium channel blocker may resolve the symptom.',
      'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=amlodipine',
      'pubmed', 0.80
    ),
    (
      demo_user_id, lev_id, 'info',
      'FDA Guidance: Levothyroxine — Drug Interactions Affecting Absorption',
      'The FDA reminds patients that multiple common medications significantly reduce Levothyroxine absorption when taken together, including calcium supplements, iron, antacids (aluminum/magnesium), and PPIs like omeprazole. This can lead to inadequately treated hypothyroidism.' || chr(10) || chr(10) || 'What you can do: Take Levothyroxine on an empty stomach, 30–60 minutes before breakfast. Space it at least 4 hours from calcium, iron, or antacid supplements.',
      'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=levothyroxine',
      'fda', 0.83
    );

  RAISE NOTICE 'Demo seed selesai untuk user %', demo_user_id;
END $$;
