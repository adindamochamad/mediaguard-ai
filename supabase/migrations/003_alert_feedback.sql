-- Feedback pengguna pada alert (relevan / tidak relevan)

ALTER TABLE alerts
  ADD COLUMN IF NOT EXISTS user_helpful BOOLEAN,
  ADD COLUMN IF NOT EXISTS feedback_at TIMESTAMPTZ;

COMMENT ON COLUMN alerts.user_helpful IS 'true = relevan, false = tidak relevan; NULL = belum ada feedback';
COMMENT ON COLUMN alerts.feedback_at IS 'Waktu pengguna mengirim feedback';
