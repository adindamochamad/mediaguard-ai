-- MediGuard AI — Demo Account Seed
-- Jalankan di Supabase SQL Editor sebelum presentasi.
--
-- LANGKAH PERSIAPAN:
--   1. Buat akun di /daftar dengan email demo (mis. demo@mediguard.ai)
--   2. Buka Supabase Dashboard → Authentication → Users
--   3. Salin UUID akun demo tersebut
--   4. Ganti nilai DEMO_USER_ID di bawah dengan UUID tersebut
--   5. Jalankan script ini

DO $$
DECLARE
  demo_user_id UUID := 'GANTI_DENGAN_UUID_AKUN_DEMO';
  met_id UUID;
  lis_id UUID;
  war_id UUID;
BEGIN
  -- Bersihkan data lama agar idempotent
  DELETE FROM alerts       WHERE user_id = demo_user_id;
  DELETE FROM medications  WHERE user_id = demo_user_id;
  DELETE FROM scan_logs    WHERE user_id = demo_user_id;

  -- Insert medications
  INSERT INTO medications (id, user_id, brand_name, generic_name, dosage, condition_note) VALUES
    (gen_random_uuid(), demo_user_id, 'Glucophage', 'Metformin',   '500mg twice daily',  'Type 2 Diabetes'),
    (gen_random_uuid(), demo_user_id, 'Prinivil',   'Lisinopril',  '10mg once daily',    'Hypertension'),
    (gen_random_uuid(), demo_user_id, 'Coumadin',   'Warfarin',    '5mg once daily',     'Atrial Fibrillation');

  SELECT id INTO met_id FROM medications WHERE user_id = demo_user_id AND generic_name = 'Metformin';
  SELECT id INTO lis_id FROM medications WHERE user_id = demo_user_id AND generic_name = 'Lisinopril';
  SELECT id INTO war_id FROM medications WHERE user_id = demo_user_id AND generic_name = 'Warfarin';

  -- Insert pre-seeded alerts (sudah ada saat demo dimulai)
  INSERT INTO alerts (user_id, medication_id, severity, title, summary, source_url, source_type, ai_confidence) VALUES
    (
      demo_user_id, war_id, 'critical',
      'FDA Safety Alert: Warfarin — Increased Bleeding Risk with NSAIDs',
      'The FDA has updated safety labeling for Warfarin to strengthen warnings about concurrent use with NSAIDs (ibuprofen, naproxen). Co-administration can significantly increase the risk of serious bleeding events, including gastrointestinal bleeding.' || chr(10) || chr(10) || 'What you can do: Contact your healthcare provider before taking any over-the-counter pain relievers. Do not stop Warfarin without medical guidance.',
      'https://www.fda.gov/drugs/drug-safety-and-availability/fda-drug-safety-communication-warfarin-nsaid-interactions',
      'fda', 0.94
    ),
    (
      demo_user_id, met_id, 'warning',
      'PubMed Study: Metformin — Vitamin B12 Deficiency Risk with Long-term Use',
      'A meta-analysis (2024) in Diabetes Care confirms that long-term Metformin use is associated with a 20-30% increased risk of Vitamin B12 deficiency. Deficiency can cause peripheral neuropathy and cognitive changes that may be misattributed to diabetes progression.' || chr(10) || chr(10) || 'What you can do: Ask your doctor about annual B12 screening. Supplementation may be appropriate if levels are low.',
      'https://pubmed.ncbi.nlm.nih.gov/search/?term=metformin+vitamin+b12+deficiency',
      'pubmed', 0.88
    ),
    (
      demo_user_id, lis_id, 'info',
      'DailyMed Update: Lisinopril — Dry Cough Reporting Guidance',
      'DailyMed has updated Lisinopril prescribing information to clarify that a dry, persistent cough affects approximately 10-15% of patients and is more common in women. The cough typically resolves within 1-4 weeks of discontinuation.' || chr(10) || chr(10) || 'What you can do: If you experience a persistent dry cough, mention it at your next appointment. An alternative ACE inhibitor or ARB may be considered.',
      'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=lisinopril',
      'pubmed', 0.82
    );

  RAISE NOTICE 'Demo seed selesai untuk user %', demo_user_id;
END $$;
