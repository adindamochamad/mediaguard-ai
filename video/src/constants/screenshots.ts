import { staticFile } from "remotion";

/** Path screenshot di `video/public/screenshots/` — nama semantik untuk scene demo */
export const SCREENSHOT = {
  landing: staticFile("screenshots/Screenshot 2026-05-31 at 00.54.14.png"),
  obat: staticFile("screenshots/Screenshot 2026-05-31 at 00.54.44.png"),
  alert_dashboard: staticFile("screenshots/Screenshot 2026-05-31 at 00.54.59.png"),
  alert_detail: staticFile("screenshots/Screenshot 2026-05-31 at 00.56.36.png"),
  chat: staticFile("screenshots/Screenshot 2026-05-31 at 00.57.14.png"),
  email_caregiver: staticFile("screenshots/Screenshot 2026-05-31 at 00.58.28.png"),
  caregiver: staticFile("screenshots/Screenshot 2026-05-31 at 00.58.37.png"),
} as const;

export const URL_DEMO = "mediguard.adindamochamad.com";
