-- Aktifkan Supabase Realtime untuk alert baru (dashboard multi-tab, Hari 7).
-- Jalankan sekali di Supabase SQL Editor setelah 001_schema_rls.sql.
-- Alternatif UI: Database → Publications → supabase_realtime → centang tabel alerts.

ALTER PUBLICATION supabase_realtime ADD TABLE alerts;
ALTER PUBLICATION supabase_realtime ADD TABLE scan_logs;
