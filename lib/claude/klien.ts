import Anthropic from '@anthropic-ai/sdk';

let klien_singleton: Anthropic | null = null;

/** Cek apakah ANTHROPIC_API_KEY sudah diatur. */
export function kredensial_claude_terisi(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY?.trim());
}

/** Klien Anthropic server-side — singleton agar tidak dibuat ulang tiap request. */
export function ambil_klien_claude(): Anthropic {
  if (!kredensial_claude_terisi()) {
    throw new Error('ANTHROPIC_API_KEY belum diatur di .env.local');
  }

  if (!klien_singleton) {
    klien_singleton = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY!.trim(),
    });
  }

  return klien_singleton;
}
