-- MediGuard MVP — skema awal + RLS (jalankan di SQL Editor Supabase)

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE medications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  brand_name TEXT NOT NULL,
  generic_name TEXT,
  dosage TEXT,
  condition_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON COLUMN medications.condition_note IS 'Konteks konsumen opsional untuk demo';

CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  medication_id UUID REFERENCES medications (id) ON DELETE SET NULL,
  severity TEXT NOT NULL CHECK (severity IN ('critical', 'warning', 'info')),
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  raw_source TEXT,
  source_url TEXT,
  source_type TEXT,
  ai_confidence DOUBLE PRECISION,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE scan_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users (id) ON DELETE CASCADE,
  scan_type TEXT,
  sources_crawled INT DEFAULT 0,
  alerts_generated INT DEFAULT 0,
  duration_ms INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE caregiver_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  caregiver_email TEXT NOT NULL,
  access_level TEXT NOT NULL DEFAULT 'read' CHECK (access_level IN ('read', 'manage')),
  invited_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  accepted_at TIMESTAMPTZ
);

CREATE INDEX idx_medications_user ON medications (user_id);
CREATE INDEX idx_alerts_user_created ON alerts (user_id, created_at DESC);
CREATE INDEX idx_scan_logs_user ON scan_logs (user_id);
CREATE INDEX idx_caregiver_owner ON caregiver_access (owner_id);

ALTER TABLE medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE scan_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE caregiver_access ENABLE ROW LEVEL SECURITY;

CREATE POLICY "pengguna_milik_medications" ON medications FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "pengguna_milik_alerts" ON alerts FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "pengguna_milik_scan_logs" ON scan_logs FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "pemilik_kelola_caregiver" ON caregiver_access FOR ALL USING (auth.uid() = owner_id);
