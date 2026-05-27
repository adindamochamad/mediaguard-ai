/** Baris obat dari tabel Supabase `medications`. */
export type Obat = {
  id: string;
  user_id: string;
  brand_name: string;
  generic_name: string | null;
  dosage: string | null;
  condition_note: string | null;
  created_at: string;
};

/** Payload untuk menambah atau mengubah obat. */
export type InputObat = {
  brand_name: string;
  generic_name?: string | null;
  dosage?: string | null;
  condition_note?: string | null;
};
