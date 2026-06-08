import { kredensial_claude_terisi } from '@/lib/claude';
import { kredensial_nimble_terisi } from '@/lib/nimble';

/** Scan Now memakai alert cache (DEMO_FALLBACK); chat tetap Nimble live. */
export function apakah_mode_demo_scan(): boolean {
  return process.env.DEMO_FALLBACK === 'true';
}

/** Tampilkan petunjuk login juri di halaman /login. */
export function tampilkan_petunjuk_login_juri(): boolean {
  return process.env.NEXT_PUBLIC_DEMO_JUDGE_HINT === 'true';
}

/** Email akun demo untuk juri. */
export function email_demo_juri(): string | null {
  const email = process.env.NEXT_PUBLIC_DEMO_JUDGE_EMAIL?.trim();
  return email || null;
}

/** Password akun demo — ditampilkan di /login saat petunjuk juri aktif. */
export function sandi_demo_juri(): string | null {
  const sandi = process.env.NEXT_PUBLIC_DEMO_JUDGE_PASSWORD?.trim();
  return sandi || null;
}

export type KonfigurasiModeDemo = {
  mode_demo_scan: boolean;
  nimble_siap: boolean;
  claude_siap: boolean;
  email_demo_juri: string | null;
  tampilkan_petunjuk_login: boolean;
};

export function ambil_konfigurasi_mode_demo(): KonfigurasiModeDemo {
  return {
    mode_demo_scan: apakah_mode_demo_scan(),
    nimble_siap: kredensial_nimble_terisi(),
    claude_siap: kredensial_claude_terisi(),
    email_demo_juri: tampilkan_petunjuk_login_juri() ? email_demo_juri() : null,
    tampilkan_petunjuk_login: tampilkan_petunjuk_login_juri(),
  };
}
