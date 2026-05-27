# Panduan setup & deploy — MediGuard AI

**Vercel tidak wajib.** Proyek ini Next.js standar; Anda bisa menjalankannya di **VPS sendiri**, Vercel, Railway, dll.

Yang **tetap disarankan di cloud** (bukan di VPS Anda): **Supabase** (database + auth). VPS hanya menjalankan aplikasi Next.js.

---

## Bagian A — Supabase (database + auth)

### A1. Buat akun & proyek

1. Buka https://supabase.com/dashboard dan login (GitHub/Google/email).
2. Klik **New project**.
3. Isi:
   - **Name:** `mediaguard` (bebas).
   - **Database password:** buat password kuat → **simpan di password manager** (dipakai akses DB langsung, jarang untuk app).
   - **Region:** pilih yang dekat Anda (mis. `Southeast Asia (Singapore)` jika ada).
4. Klik **Create new project** → tunggu 1–3 menit sampai status **Active**.

### A2. Ambil URL & API keys

1. Di sidebar kiri: **Project Settings** (ikon gear) → **API**.
2. Catat ke notepad sementara (jangan commit ke Git):

| Di dashboard | Masukkan ke `.env.local` |
|--------------|---------------------------|
| **Project URL** | `NEXT_PUBLIC_SUPABASE_URL` |
| **anon public** (API Keys) | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| **service_role** (secret) | `SUPABASE_SERVICE_ROLE_KEY` |

3. **Penting:**
   - `anon` = boleh dipakai di browser (dilindungi RLS).
   - `service_role` = **hanya di server**, bypass RLS — jangan taruh di frontend / jangan commit.

### A3. Jalankan migrasi SQL (tabel + RLS)

1. Sidebar: **SQL Editor**.
2. Klik **New query**.
3. Di laptop Anda, buka file repo:

   `supabase/migrations/001_schema_rls.sql`

4. **Select all** → copy → paste ke editor Supabase (kosongkan query lama jika ada).
5. Klik **Run** (atau Ctrl/Cmd + Enter).
6. Harus muncul pesan sukses (hijau), mis. `Success. No rows returned`.

**Jika error "relation already exists":** tabel sudah pernah dibuat; abaikan atau hapus tabel lalu run lagi (hati-hati di proyek production).

### A4. Cek tabel (opsional)

1. Sidebar: **Table Editor**.
2. Pastikan ada: `medications`, `alerts`, `scan_logs`, `caregiver_access`.

### A5. Auth (untuk Hari 2 — bisa disiapkan sekarang)

1. Sidebar: **Authentication** → **Providers**.
2. **Email** biasanya sudah aktif.
3. Untuk development: **Authentication** → **URL Configuration**:
   - **Site URL:** `http://localhost:3001` (nanti ganti ke domain VPS Anda).
   - **Redirect URLs:** tambahkan `http://localhost:3001/**` dan nanti `https://domain-anda.com/**`.

---

## Bagian B — File `.env.local` di laptop

### B1. Buat file

Di folder proyek `mediaguard-ai`:

```bash
cd /Users/mac/Development/mediguard-ai
cp .env.example .env.local
```

### B2. Isi nilai (contoh format)

Edit `.env.local` dengan editor. **Tanpa tanda kutip** kecuali nilai ada spasi.

```bash
# Supabase (wajib untuk Day 1)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3001

# Cron (buat string acak panjang — untuk VPS cron & nanti pipeline)
CRON_SECRET=buat-string-acak-minimal-32-karakter

# Belum wajib Day 1 (isi nanti Hari 4+)
ANTHROPIC_API_KEY=
NIMBLE_USERNAME=
NIMBLE_PASSWORD=
RESEND_API_KEY=
```

**Membuat `CRON_SECRET` cepat (macOS/Linux):**

```bash
openssl rand -hex 32
```

Salin output ke `CRON_SECRET=...`.

### B3. Pastikan tidak ter-commit

File `.env.local` sudah di `.gitignore`. Jangan pernah `git add .env.local`.

---

## Bagian C — Verifikasi di laptop (Day 1)

### C1. Install & jalankan dev server

```bash
cd /Users/mac/Development/mediguard-ai
npm install
npm run dev
```

Tunggu sampai muncul: `Ready` dan `http://localhost:3001`.

### C2. Cek halaman utama

Browser: http://localhost:3001  
Harus tampil landing **MediGuard AI** (bukan judul "Tessera") + tombol **Cek koneksi DB**.

### C3. Cek API database

**Opsi 1 — browser:** klik tombol atau buka  
http://localhost:3001/api/health/db

**Opsi 2 — terminal (tab baru):**

```bash
curl -s http://localhost:3001/api/health/db | python3 -m json.tool
```

Jika respons HTML berisi "Tessera" → port 3000 masih dipakai proyek lain; gunakan **3001** seperti di atas.

**Hasil yang benar:**

```json
{
  "status_database": "terhubung",
  "pesan": "..."
}
```

**Jika `env_belum_lengkap`:** URL/anon key kosong atau salah di `.env.local` → ulangi Bagian B.

**Jika `gagal` + pesan SQL:** migrasi belum di-run atau salah proyek Supabase → ulangi Bagian A3.

### C4. Cek cron stub (opsional)

```bash
curl -s -H "Authorization: Bearer ISI_CRON_SECRET_ANDA" \
  http://localhost:3001/api/webhooks/cron
```

Harus `{"status":"ok",...}`. Tanpa header → `401`.

---

## Bagian D — Deploy di VPS Anda (tanpa Vercel)

### D0. Prasyarat di VPS

- Ubuntu/Debian (atau sejenis) dengan SSH.
- **Node.js 20 LTS** terpasang (`node -v` ≥ 20).
- Domain (opsional tapi disarankan) mengarah ke IP VPS.
- Port **80/443** terbuka.

### D1. Upload kode ke VPS

**Opsi git (disarankan):**

```bash
# Di VPS
cd /var/www
git clone https://github.com/adindamochamad/mediaguard-ai.git
cd mediaguard-ai
npm install
```

**Opsi rsync/scp:** copy folder tanpa `node_modules` dan `.next`.

### D2. Environment di VPS

```bash
nano /var/www/mediaguard-ai/.env.local
```

Isi **sama** seperti di laptop, kecuali:

```bash
NEXT_PUBLIC_APP_URL=https://domain-anda.com
```

Simpan. Jangan commit file ini.

### D3. Build & jalankan produksi

```bash
cd /var/www/mediaguard-ai
npm run build
npm run start
```

Default listen **port 3000**. Untuk tes dari luar VPS sementara:

```bash
curl -s http://127.0.0.1:3000/api/health/db
```

### D4. Proses tetap jalan (PM2)

```bash
sudo npm install -g pm2
cd /var/www/mediaguard-ai
pm2 start npm --name mediguard -- start
pm2 save
pm2 startup
```

Perintah terakhir mengikuti instruksi yang PM2 cetak (copy-paste `sudo env ...`).

### D5. Reverse proxy + HTTPS (Nginx)

Contoh minimal (ganti `domain-anda.com`):

```nginx
server {
    listen 80;
    server_name domain-anda.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Lalu sertifikat:

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d domain-anda.com
```

### D6. Cron scan setiap 6 jam (pengganti Vercel Cron)

File `vercel.json` **tidak dipakai** di VPS. Gunakan **crontab** sistem:

```bash
crontab -e
```

Tambahkan baris (ganti domain & secret):

```cron
0 */6 * * * curl -fsS -H "Authorization: Bearer ISI_CRON_SECRET" https://domain-anda.com/api/webhooks/cron >/dev/null 2>&1
```

### D7. Supabase redirect untuk production

Dashboard Supabase → **Authentication** → **URL Configuration**:

- **Site URL:** `https://domain-anda.com`
- **Redirect URLs:** tambah `https://domain-anda.com/**`

---

## Bagian E — Jika tetap pakai Vercel (opsional)

1. https://vercel.com → Import Git repo `mediaguard-ai`.
2. Framework: **Next.js** (otomatis).
3. **Environment Variables:** salin semua key dari `.env.local` (per environment: Production).
4. Deploy → dapat URL `https://xxx.vercel.app`.
5. Cron di `vercel.json` aktif otomatis di plan yang mendukung Cron.
6. Update Supabase redirect URLs dengan URL Vercel.

---

## Ringkasan: apa yang di mana?

| Komponen | Di mana? | Wajib? |
|----------|----------|--------|
| Database + Auth | **Supabase cloud** | Ya (untuk MVP ini) |
| Aplikasi Next.js | **Laptop** (`npm run dev`) atau **VPS** (`npm start`) | Ya |
| Vercel | Hanya jika Anda mau hosting managed | **Tidak** |
| Cron 6 jam | Vercel Cron **atau** crontab VPS | Nanti (pipeline Hari 6+) |
| Nimble / Claude / Resend | API eksternal + env | Hari 4+ |

---

## Troubleshooting cepat

| Gejala | Kemungkinan penyebab |
|--------|----------------------|
| `env_belum_lengkap` | `.env.local` kosong / salah nama variabel |
| `relation "medications" does not exist` | SQL migrasi belum di-run |
| `Invalid API key` | Salin ulang anon key dari Supabase API settings |
| Port 3000 sudah dipakai (mis. proyek **Tessera**) | MediGuard dev memakai **3001** (`npm run dev`). Cek: `lsof -i :3000` lalu hentikan proses lain atau jangan pakai port itu. |
| `curl /api/health/db` dapat HTML "Tessera" | Anda mengakses port yang salah — pastikan URL `http://localhost:3001/...` dan terminal `npm run dev` dari folder **mediaguard-ai**. |
| PM2 restart loop | Jalankan `npm run build` dulu, cek log `pm2 logs mediguard` |

Setelah Day 1 lolos (`status_database: terhubung`), lanjut **Day 2**: login/signup + dashboard kosong.
