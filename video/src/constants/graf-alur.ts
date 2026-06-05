/** Node pada graf alur — koordinat pusat kartu (1920×1080) */

export interface NodeGraf {
  id: string;
  label: string;
  ikon: string;
  x: number;
  y: number;
  muncul_frame: number;
  /** Pusat trunk vs cabang kiri/kanan */
  tier?: "trunk" | "cabang";
}

export interface TepiGraf {
  dari: string;
  ke: string;
  muncul_frame: number;
  /** Garis vertikal tunggal (trunk) */
  tipe?: "trunk";
}

/** Cabang 1 induk → 3 anak (simetris) */
export interface CabangGraf {
  induk_id: string;
  anak_ids: [string, string, string];
  muncul_frame: number;
  arah: "turun" | "naik";
}

import { DURASI_SCENE_ALUR } from "./durasi-video";
export { DURASI_SCENE_ALUR };

/* ——— Grid simetris ——— */
export const GRAF_LAYOUT = {
  pusat_x: 960,
  spread_x: 392,
  y_awal: 122,
  jarak_baris: 84,
  lebar_node: 232,
  tinggi_node: 68,
} as const;

const { pusat_x: CX, spread_x: SP, y_awal: Y0, jarak_baris: GAP } = GRAF_LAYOUT;

const y = (baris: number) => Y0 + baris * GAP;
const kiri = CX - SP;
const kanan = CX + SP;

export const NODES_GRAF: NodeGraf[] = [
  { id: "med", label: "Medication list", ikon: "💊", x: CX, y: y(0), muncul_frame: 40, tier: "trunk" },
  { id: "scan", label: "Scan / cron", ikon: "⏱", x: CX, y: y(1), muncul_frame: 140, tier: "trunk" },
  { id: "nimble", label: "Nimble live web", ikon: "🌐", x: CX, y: y(2), muncul_frame: 255, tier: "trunk" },
  { id: "fda", label: "FDA alerts", ikon: "🏛", x: kiri, y: y(3), muncul_frame: 400, tier: "cabang" },
  { id: "pubmed", label: "PubMed", ikon: "📄", x: CX, y: y(3), muncul_frame: 455, tier: "cabang" },
  { id: "news", label: "Medical news", ikon: "📰", x: kanan, y: y(3), muncul_frame: 510, tier: "cabang" },
  { id: "claude", label: "Claude match", ikon: "🤖", x: CX, y: y(4), muncul_frame: 655, tier: "trunk" },
  { id: "dedup", label: "Dedup URL", ikon: "🔗", x: CX, y: y(5), muncul_frame: 775, tier: "trunk" },
  { id: "db", label: "Supabase RLS", ikon: "🗄", x: CX, y: y(6), muncul_frame: 895, tier: "trunk" },
  { id: "rt", label: "Realtime", ikon: "⚡", x: kiri, y: y(7), muncul_frame: 1040, tier: "cabang" },
  { id: "email", label: "Critical email", ikon: "📧", x: CX, y: y(7), muncul_frame: 1095, tier: "cabang" },
  { id: "care", label: "Caregiver link", ikon: "👨‍👩‍👧", x: kanan, y: y(7), muncul_frame: 1150, tier: "cabang" },
];

/** Tepi vertikal pada sumbu trunk */
/** Garis muncul sedikit setelah node (lebih natural) */
export const TEPI_GRAF: TepiGraf[] = [
  { dari: "med", ke: "scan", muncul_frame: 108, tipe: "trunk" },
  { dari: "scan", ke: "nimble", muncul_frame: 228, tipe: "trunk" },
  { dari: "claude", ke: "dedup", muncul_frame: 748, tipe: "trunk" },
  { dari: "dedup", ke: "db", muncul_frame: 868, tipe: "trunk" },
];

export const CABANG_GRAF: CabangGraf[] = [
  {
    induk_id: "nimble",
    anak_ids: ["fda", "pubmed", "news"],
    muncul_frame: 368,
    arah: "turun",
  },
  {
    induk_id: "claude",
    anak_ids: ["fda", "pubmed", "news"],
    muncul_frame: 628,
    arah: "naik",
  },
  {
    induk_id: "db",
    anak_ids: ["rt", "email", "care"],
    muncul_frame: 1018,
    arah: "turun",
  },
];

export const FASE_KETERANGAN: { mulai_frame: number; teks: string }[] = [
  { mulai_frame: 0, teks: "One medication profile powers the entire pipeline" },
  { mulai_frame: 270, teks: "Nimble branches into live FDA, PubMed & news sources" },
  { mulai_frame: 690, teks: "Claude merges branches — only drugs on your list pass through" },
  { mulai_frame: 930, teks: "Stored securely, then splits to patient & caregiver channels" },
  { mulai_frame: 1320, teks: "End-to-end in under 60 seconds — no page refresh" },
];
