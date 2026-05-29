import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';

export type PropsTemplateUndanganKaregiver = {
  nama_pemilik: string;
  url_karegiver: string;
};

export function TemplateUndanganKaregiver({
  nama_pemilik,
  url_karegiver,
}: PropsTemplateUndanganKaregiver) {
  return (
    <Html>
      <Head />
      <Preview>{nama_pemilik} invited you to view their medication alerts on MediGuard AI</Preview>
      <Body style={gaya_badan}>
        <Container style={gaya_kontainer}>
          <Heading style={gaya_judul}>You've been invited to MediGuard AI</Heading>

          <Text style={gaya_teks}>
            <strong>{nama_pemilik}</strong> wants to share their medication safety alerts with you.
            As a caregiver, you'll have read-only access to their alerts — no account needed.
          </Text>

          <Section style={{ margin: '28px 0' }}>
            <Button href={url_karegiver} style={gaya_tombol}>
              View shared alerts
            </Button>
          </Section>

          <Hr style={gaya_garis} />

          <Text style={gaya_teks_kecil}>
            This link gives read-only access to {nama_pemilik}'s medication alerts. You cannot make
            changes to their profile. If you received this by mistake, you can safely ignore it.
          </Text>
          <Text style={gaya_teks_kecil}>
            MediGuard AI is not a substitute for professional medical advice. Always consult a
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

const gaya_judul = {
  color: '#0f172a',
  fontSize: '22px',
  fontWeight: '700' as const,
  marginBottom: '16px',
};

const gaya_teks = {
  color: '#334155',
  fontSize: '15px',
  lineHeight: '24px',
};

const gaya_tombol = {
  backgroundColor: '#0d9488',
  color: '#ffffff',
  padding: '12px 24px',
  borderRadius: '12px',
  fontWeight: '600' as const,
  textDecoration: 'none',
};

const gaya_garis = {
  borderColor: '#e2e8f0',
  margin: '24px 0',
};

const gaya_teks_kecil = {
  color: '#64748b',
  fontSize: '12px',
  lineHeight: '20px',
};
