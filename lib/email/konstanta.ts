/** Pengirim default — gunakan domain terverifikasi Resend di produksi. */
export const PENGIRIM_DEFAULT = 'MediGuard AI <onboarding@resend.dev>';

export function alamat_pengirim(): string {
  return process.env.RESEND_FROM?.trim() || PENGIRIM_DEFAULT;
}

export function url_aplikasi(): string {
  const dasar = process.env.NEXT_PUBLIC_APP_URL?.trim() || 'http://localhost:3001';
  return dasar.replace(/\/$/, '');
}
