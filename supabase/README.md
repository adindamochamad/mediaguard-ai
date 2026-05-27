# Supabase — MediGuard

Migrasi SQL: `migrations/001_schema_rls.sql`

**Panduan detail (Supabase + `.env.local` + VPS tanpa Vercel):** lihat [`DEPLOY.md`](../DEPLOY.md) di root repo.

## Ringkas

1. Buat proyek di [Supabase Dashboard](https://supabase.com/dashboard).
2. Salin URL + anon + service_role → `.env.local`.
3. SQL Editor → paste migrasi → **Run**.
4. `npm run dev` → buka `/api/health/db` → harus `terhubung`.

### Realtime (Hari 7)

Dashboard → Database → Replication → aktifkan tabel `alerts`.
