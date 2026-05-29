import { render } from '@react-email/components';
import { TemplateAlertKritis } from '@/emails/template-alert-kritis';
import { alamat_pengirim, url_aplikasi } from '@/lib/email/konstanta';
import { ambil_klien_resend, kunci_resend_terisi } from '@/lib/email/klien-resend';
import type { ItemAlertAnalisis } from '@/lib/tipe-alert';

export type DataAlertKritisUntukEmail = {
  alert: ItemAlertAnalisis;
  nama_obat_tampilan: string;
};

function nama_tampilan_dari_email(email: string): string {
  const bagian_lokal = email.split('@')[0]?.trim();
  if (!bagian_lokal) return 'there';
  return bagian_lokal.charAt(0).toUpperCase() + bagian_lokal.slice(1);
}

/**
 * Mengirim email Resend untuk setiap alert kritis baru.
 * Scan tetap sukses bila Resend tidak dikonfigurasi — hanya log peringatan.
 */
export async function kirim_email_alert_kritis(
  email_penerima: string,
  daftar_alert: DataAlertKritisUntukEmail[],
): Promise<{ terkirim: number; dilewati: boolean; pesan?: string }> {
  if (daftar_alert.length === 0) {
    return { terkirim: 0, dilewati: true };
  }

  if (!kunci_resend_terisi()) {
    console.warn('[email] RESEND_API_KEY kosong — alert kritis tidak dikirim lewat email.');
    return {
      terkirim: 0,
      dilewati: true,
      pesan: 'RESEND_API_KEY belum diatur',
    };
  }

  const resend = ambil_klien_resend();
  const dari = alamat_pengirim();
  const dasar_url = url_aplikasi();
  const nama_pengguna = nama_tampilan_dari_email(email_penerima);
  let terkirim = 0;

  for (const { alert, nama_obat_tampilan } of daftar_alert) {
    const url_sumber = alert.source_url?.trim() || 'https://www.fda.gov/drugs/drug-safety-and-availability';
    const html = await render(
      TemplateAlertKritis({
        nama_pengguna,
        nama_obat: nama_obat_tampilan,
        judul_alert: alert.title.trim(),
        ringkasan_alert: alert.summary.trim(),
        tindakan: alert.action.trim(),
        url_sumber,
        url_aplikasi: `${dasar_url}/dashboard`,
      }),
    );
    const { error } = await resend.emails.send({
      from: dari,
      to: email_penerima,
      subject: `Critical alert: ${nama_obat_tampilan} — review with your clinician`,
      html,
    });

    if (error) {
      console.error('[email] gagal mengirim alert kritis:', error.message);
      return {
        terkirim,
        dilewati: false,
        pesan: error.message,
      };
    }

    terkirim += 1;
  }

  return { terkirim, dilewati: false };
}
