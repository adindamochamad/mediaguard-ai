import { render } from '@react-email/components';
import { TemplateUndanganKaregiver } from '@/emails/template-undangan-karegiver';
import { alamat_pengirim, url_aplikasi } from '@/lib/email/konstanta';
import { ambil_klien_resend, kunci_resend_terisi } from '@/lib/email/klien-resend';

function nama_tampilan_dari_email(email: string): string {
  const bagian_lokal = email.split('@')[0]?.trim();
  if (!bagian_lokal) return 'Your contact';
  return bagian_lokal.charAt(0).toUpperCase() + bagian_lokal.slice(1);
}

export async function kirim_undangan_karegiver(opsi: {
  email_penerima: string;
  email_pemilik: string;
  token: string;
}): Promise<{ terkirim: boolean; pesan?: string }> {
  if (!kunci_resend_terisi()) {
    console.warn('[email] RESEND_API_KEY kosong — undangan karegiver dilewati.');
    return { terkirim: false, pesan: 'RESEND_API_KEY belum diatur' };
  }

  const resend = ambil_klien_resend();
  const nama_pemilik = nama_tampilan_dari_email(opsi.email_pemilik);
  const url_karegiver = `${url_aplikasi()}/caregiver/${opsi.token}`;

  const html = await render(
    TemplateUndanganKaregiver({ nama_pemilik, url_karegiver }),
  );

  const { error } = await resend.emails.send({
    from: alamat_pengirim(),
    to: opsi.email_penerima,
    subject: `${nama_pemilik} shared their medication alerts with you`,
    html,
  });

  if (error) {
    console.error('[email] gagal mengirim undangan karegiver:', error.message);
    return { terkirim: false, pesan: error.message };
  }

  return { terkirim: true };
}
