import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';

export type PropsTemplateSelamatDatang = {
  nama_pengguna: string;
  url_aplikasi: string;
};

export function TemplateSelamatDatang({ nama_pengguna, url_aplikasi }: PropsTemplateSelamatDatang) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to MediGuard AI — your medication safety monitor</Preview>
      <Body style={gaya_badan}>
        <Container style={gaya_kontainer}>
          <Heading style={gaya_judul}>Welcome to MediGuard AI</Heading>
          <Text style={gaya_teks}>Hi {nama_pengguna},</Text>
          <Text style={gaya_teks}>
            Thanks for signing up. MediGuard watches FDA alerts, medical news, and research sources
            for signals related to the medications in your profile.
          </Text>

          <Section style={{ margin: '24px 0' }}>
            <Text style={gaya_teks_bold}>Get started in three steps</Text>
            <Text style={gaya_teks}>1. Add your medications on the Medications page.</Text>
            <Text style={gaya_teks}>2. Tap Scan now on your dashboard to run your first check.</Text>
            <Text style={gaya_teks}>
              3. Ask MediGuard in Chat when you want a plain-language answer with live sources.
            </Text>
          </Section>

          <Button href={`${url_aplikasi}/dashboard/medications`} style={gaya_tombol}>
            Add medications
          </Button>

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

const gaya_judul = {
  color: '#0f172a',
  fontSize: '24px',
  fontWeight: '700' as const,
};

const gaya_teks = {
  color: '#334155',
  fontSize: '15px',
  lineHeight: '24px',
};

const gaya_teks_bold = {
  color: '#0f172a',
  fontSize: '15px',
  fontWeight: '600' as const,
  marginBottom: '8px',
};

const gaya_tombol = {
  backgroundColor: '#0d9488',
  color: '#ffffff',
  padding: '12px 24px',
  borderRadius: '12px',
  fontWeight: '600' as const,
  textDecoration: 'none',
  marginBottom: '24px',
};

const gaya_teks_kecil = {
  color: '#64748b',
  fontSize: '12px',
  lineHeight: '20px',
  marginTop: '24px',
};
