#!/usr/bin/env node
import assert from 'node:assert/strict';

function perkirakan(jumlah_sumber) {
  if (jumlah_sumber == null || jumlah_sumber <= 0) return null;
  if (jumlah_sumber === 1) return 0;
  return Math.max(0, Math.floor((jumlah_sumber - 1) / 2));
}

assert.equal(perkirakan(5), 2);
assert.equal(perkirakan(1), 0);
assert.equal(perkirakan(null), null);
console.log('[test-perkiraan-obat-scan] OK');
