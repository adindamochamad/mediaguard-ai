import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

export type PropsTemplateAlertKritis = {
  nama_pengguna: string;
  nama_obat: string;
  judul_alert: string;
  ringkasan_alert: string;
  tindakan: string;
  url_sumber: string;
  url_aplikasi: string;
};

export function TemplateAlertKritis({
  nama_pengguna,
  nama_obat,
  judul_alert,
  ringkasan_alert,
  tindakan,
  url_sumber,
  url_aplikasi,
}: PropsTemplateAlertKritis) {
  return (
    <Html>
      <Head />
      <Preview>Critical medication alert — {nama_obat}</Preview>
      <Body style={gaya_badan}>
        <Container style={gaya_kontainer}>
          <Section style={gaya_lencana_kritis}>
            <Text style={gaya_teks_lencana}>Critical medication alert</Text>
          </Section>

          <Text style={gaya_teks}>Hi {nama_pengguna},</Text>
          <Text style={gaya_teks}>
            MediGuard AI found a critical safety signal related to one of your medications.
            This is informational only — please discuss with your doctor or pharmacist.
          </Text>

          <Heading as="h2" style={gaya_judul_obat}>
            {nama_obat}
          </Heading>
          <Heading as="h3" style={gaya_judul_alert}>
            {judul_alert}
          </Heading>
          <Text style={gaya_teks}>{ringkasan_alert}</Text>

          <Hr style={gaya_garis} />

          <Text style={gaya_label_bagian}>What you can do</Text>
          <Text style={gaya_teks}>{tindakan}</Text>

          <Section style={{ marginTop: '24px', marginBottom: '24px' }}>
            <Button href={url_aplikasi} style={gaya_tombol}>
              View alert in MediGuard
            </Button>
          </Section>

          <Hr style={gaya_garis} />

          <Text style={gaya_teks_kecil}>
            Source:{' '}
            <Link href={url_sumber} style={gaya_tautan}>
              {url_sumber}
            </Link>
          </Text>
          <Text style={gaya_teks_kecil}>
            MediGuard AI is not a substitute for professional medical advice. Always consult your
            doctor or pharmacist for clinical decisions.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const gaya_badan = {
  backgroundColor: '#f8fafc',
  fontFamily:
    'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
};

const gaya_kontainer = {
  maxWidth: '600px',
  margin: '0 auto',
  backgroundColor: '#ffffff',
  padding: '32px',
  borderRadius: '16px',
  border: '1px solid #e2e8f0',
};

const gaya_lencana_kritis = {
  backgroundColor: '#fee2e2',
  border: '1px solid #fca5a5',
  borderRadius: '12px',
  padding: '12px 16px',
  marginBottom: '20px',
};

const gaya_teks_lencana = {
  color: '#dc2626',
  fontWeight: '700' as const,
  fontSize: '14px',
  margin: '0',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.04em',
};

const gaya_teks = {
  color: '#0f172a',
  fontSize: '15px',
  lineHeight: '24px',
};

const gaya_judul_obat = {
  color: '#0f172a',
  fontSize: '20px',
  fontWeight: '700' as const,
  margin: '16px 0 8px',
};

const gaya_judul_alert = {
  color: '#0f172a',
  fontSize: '18px',
  fontWeight: '600' as const,
  margin: '0 0 12px',
};

const gaya_label_bagian = {
  color: '#0f172a',
  fontSize: '15px',
  fontWeight: '700' as const,
  margin: '0 0 8px',
};

const gaya_garis = {
  borderColor: '#e2e8f0',
  margin: '20px 0',
};

const gaya_tombol = {
  backgroundColor: '#dc2626',
  color: '#ffffff',
  padding: '12px 24px',
  borderRadius: '12px',
  fontWeight: '600' as const,
  textDecoration: 'none',
};

const gaya_teks_kecil = {
  color: '#64748b',
  fontSize: '12px',
  lineHeight: '20px',
};

const gaya_tautan = {
  color: '#0d9488',
};
