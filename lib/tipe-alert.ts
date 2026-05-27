/** Tingkat severity alert — selaras skema Supabase `alerts.severity`. */
export type TingkatSeverity = 'critical' | 'warning' | 'info';

/** Satu alert hasil analisis Claude sebelum disimpan ke DB. */
export type ItemAlertAnalisis = {
  relevant: boolean;
  medication: string;
  severity: TingkatSeverity;
  title: string;
  summary: string;
  action: string;
  source_url: string;
  confidence: number;
};

/** Keluaran valid dari `analyzeForAlerts`. */
export type KeluaranAnalisisAlert = {
  alerts: ItemAlertAnalisis[];
};
