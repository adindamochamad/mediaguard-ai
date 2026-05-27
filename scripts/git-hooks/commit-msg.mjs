#!/usr/bin/env node
import fs from 'node:fs';
import { bersihkanPesanCommit } from './lib-pintasan.mjs';

const jalurPesan = process.argv[2];
if (!jalurPesan) {
  console.error('commit-msg: path pesan commit tidak ada.');
  process.exit(1);
}

const asli = fs.readFileSync(jalurPesan, 'utf8');
const dibersihkan = bersihkanPesanCommit(asli);

if (dibersihkan !== asli) {
  fs.writeFileSync(jalurPesan, dibersihkan, 'utf8');
  console.log(
    'commit-msg: Co-Author / catatan agen dihapus dari pesan commit — histori tetap profil Anda saja.',
  );
}

process.exit(0);
