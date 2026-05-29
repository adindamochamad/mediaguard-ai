import { Resend } from 'resend';

let klien_resend: Resend | null = null;

export function kunci_resend_terisi(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim());
}

export function ambil_klien_resend(): Resend {
  const kunci = process.env.RESEND_API_KEY?.trim();
  if (!kunci) {
    throw new Error('RESEND_API_KEY belum diatur.');
  }
  if (!klien_resend) {
    klien_resend = new Resend(kunci);
  }
  return klien_resend;
}
