import { render } from '@react-email/components';
import { TemplateSelamatDatang } from '@/emails/template-selamat-datang';
import { alamat_pengirim, url_aplikasi } from '@/lib/email/konstanta';
import { ambil_klien_resend, kunci_resend_terisi } from '@/lib/email/klien-resend';

function nama_tampilan_dari_email(email: string): string {
  const bagian_lokal = email.split('@')[0]?.trim();
  if (!bagian_lokal) return 'there';
  return bagian_lokal.charAt(0).toUpperCase() + bagian_lokal.slice(1);
}

/** Email sambutan setelah pendaftaran — gagal diam-diam agar signup tidak terblokir. */
export async function kirim_email_selamat_datang(
  email_penerima: string,
): Promise<{ terkirim: boolean; pesan?: string }> {
  if (!kunci_resend_terisi()) {
    console.warn('[email] RESEND_API_KEY kosong — email selamat datang dilewati.');
    return { terkirim: false, pesan: 'RESEND_API_KEY belum diatur' };
  }

  const resend = ambil_klien_resend();
  const html = await render(
    TemplateSelamatDatang({
      nama_pengguna: nama_tampilan_dari_email(email_penerima),
      url_aplikasi: url_aplikasi(),
    }),
  );
  const { error } = await resend.emails.send({
    from: alamat_pengirim(),
    to: email_penerima,
    subject: 'Welcome to MediGuard AI',
    html,
  });

  if (error) {
    console.error('[email] gagal mengirim selamat datang:', error.message);
    return { terkirim: false, pesan: error.message };
  }

  return { terkirim: true };
}
