type HasilValidasi<T> =
  | { valid: true; data: T }
  | { valid: false; pesan: string };

/** Validasi body POST feedback alert. */
export function validasi_body_feedback_alert(body: unknown): HasilValidasi<{ helpful: boolean }> {
  if (!body || typeof body !== 'object') {
    return { valid: false, pesan: 'Request body must be a JSON object.' };
  }

  const data = body as Record<string, unknown>;

  if (typeof data.helpful !== 'boolean') {
    return { valid: false, pesan: 'Field "helpful" must be a boolean (true or false).' };
  }

  return { valid: true, data: { helpful: data.helpful } };
}
