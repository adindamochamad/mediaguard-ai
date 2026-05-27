#!/usr/bin/env node
/**
 * Tes validasi Zod + parse JSON model — tanpa panggilan API.
 */
import assert from 'node:assert/strict';
import { z } from 'zod';

const skema_item_alert = z.object({
  relevant: z.boolean(),
  medication: z.string().min(1),
  severity: z.enum(['critical', 'warning', 'info']),
  title: z.string().min(1),
  summary: z.string().min(1),
  action: z.string().min(1),
  source_url: z.string().url().or(z.literal('')),
  confidence: z.number().min(0).max(1),
});

const skema_keluaran = z.object({
  alerts: z.array(skema_item_alert),
});

const contoh_valid = {
  alerts: [
    {
      relevant: true,
      medication: 'Metformin',
      severity: 'warning',
      title: 'FDA update may affect Metformin users',
      summary: 'A recent FDA communication mentions kidney monitoring for Metformin.',
      action: 'Ask your doctor whether your kidney function should be checked.',
      source_url: 'https://www.fda.gov/drugs/example',
      confidence: 0.82,
    },
  ],
};

skema_keluaran.parse(contoh_valid);

assert.throws(() => {
  skema_keluaran.parse({ alerts: [{ relevant: true, medication: 'X' }] });
}, z.ZodError);

function parse_json_dari_teks(teks) {
  const trimmed = teks.trim();
  const match = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const kandidat = match ? match[1].trim() : trimmed;
  const awal = kandidat.indexOf('{');
  const akhir = kandidat.lastIndexOf('}');
  return JSON.parse(kandidat.slice(awal, akhir + 1));
}

const dari_fence = parse_json_dari_teks(
  'Here is the result:\n```json\n{"alerts":[]}\n```\n',
);
assert.deepEqual(dari_fence, { alerts: [] });

console.log('[test-validasi-alert] OK — Zod + JSON parse passed.');
