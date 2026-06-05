#!/usr/bin/env node
import assert from 'node:assert/strict';

function validasi(body) {
  if (!body || typeof body !== 'object') return { valid: false };
  if (typeof body.helpful !== 'boolean') return { valid: false };
  return { valid: true, helpful: body.helpful };
}

assert.equal(validasi({ helpful: true }).valid, true);
assert.equal(validasi({ helpful: 'yes' }).valid, false);
assert.equal(validasi(null).valid, false);
console.log('[test-validasi-feedback] OK');
