import type { InputObat } from '@/lib/tipe-obat';

type HasilValidasi<T> =
  | { valid: true; data: T }
  | { valid: false; pesan: string };

function normalisasi_teks(teks: unknown): string | null {
  if (teks === null || teks === undefined) return null;
  if (typeof teks !== 'string') return null;
  const trimmed = teks.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function validasi_panjang_teks(
  brand_name: string | null,
  generic_name: string | null,
  dosage: string | null,
  condition_note: string | null,
): string | null {
  if (brand_name && brand_name.length > 200) {
    return 'Medication name must be 200 characters or fewer.';
  }

  if (generic_name && generic_name.length > 200) {
    return 'Generic name must be 200 characters or fewer.';
  }

  if (dosage && dosage.length > 100) {
    return 'Dosage must be 100 characters or fewer.';
  }

  if (condition_note && condition_note.length > 500) {
    return 'Condition note must be 500 characters or fewer.';
  }

  return null;
}

/** Validasi body POST obat — tanpa dependensi eksternal. */
export function validasi_input_obat_buat(body: unknown): HasilValidasi<InputObat> {
  if (!body || typeof body !== 'object') {
    return { valid: false, pesan: 'Request body must be a JSON object.' };
  }

  const data = body as Record<string, unknown>;
  const brand_name = normalisasi_teks(data.brand_name);
  const generic_name = normalisasi_teks(data.generic_name);
  const dosage = normalisasi_teks(data.dosage);
  const condition_note = normalisasi_teks(data.condition_note);

  if (!brand_name) {
    return { valid: false, pesan: 'Medication name is required.' };
  }

  const pesan_panjang = validasi_panjang_teks(brand_name, generic_name, dosage, condition_note);
  if (pesan_panjang) return { valid: false, pesan: pesan_panjang };

  return {
    valid: true,
    data: {
      brand_name,
      generic_name,
      dosage,
      condition_note,
    },
  };
}

/** Validasi body PATCH obat — minimal satu field harus diisi. */
export function validasi_input_obat_ubah(body: unknown): HasilValidasi<Partial<InputObat>> {
  if (!body || typeof body !== 'object') {
    return { valid: false, pesan: 'Request body must be a JSON object.' };
  }

  const data = body as Record<string, unknown>;
  const brand_name = normalisasi_teks(data.brand_name);
  const generic_name = normalisasi_teks(data.generic_name);
  const dosage = normalisasi_teks(data.dosage);
  const condition_note = normalisasi_teks(data.condition_note);

  const pesan_panjang = validasi_panjang_teks(brand_name, generic_name, dosage, condition_note);
  if (pesan_panjang) return { valid: false, pesan: pesan_panjang };

  if (!brand_name && generic_name === null && dosage === null && condition_note === null) {
    return { valid: false, pesan: 'Provide at least one field to update.' };
  }

  const hasil: Partial<InputObat> = {};
  if (brand_name) hasil.brand_name = brand_name;
  if (generic_name !== null) hasil.generic_name = generic_name;
  if (dosage !== null) hasil.dosage = dosage;
  if (condition_note !== null) hasil.condition_note = condition_note;

  return { valid: true, data: hasil };
}

/** Cek format UUID sederhana untuk parameter rute. */
export function id_obat_valid(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
}
