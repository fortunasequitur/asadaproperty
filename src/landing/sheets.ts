import type { Attribution } from "./tracking";

/**
 * URL Web App Google Apps Script (berakhiran /exec).
 * Kosong = lead tidak dikirim ke Google Sheet (database tetap jalan).
 * Validasi, anti-dobel & limit kiriman ada di Apps Script-nya.
 */
export const SHEETS_WEBHOOK_URL =
  "https://script.google.com/macros/s/AKfycbx3iodVibJ8-xslZZGKPwy7aafeOsjOgwgFPNyGED1tj3aNuPth6W3Dj4my0c7h8ul5/exec";

/** Penanda sederhana: kiriman tanpa ini ditolak Apps Script. */
const SHEETS_KEY = "vpa-lead-v1";

export type SheetLead = Pick<
  Attribution,
  | "utmSource"
  | "utmMedium"
  | "utmCampaign"
  | "utmContent"
  | "fbclid"
  | "gclid"
  | "landingUrl"
> & {
  name: string;
  phone: string;
  city: string;
  paymentPlan: string;
  unitType: string;
  wantsSurvey: boolean;
  clientId: string;
};

/** Fire-and-forget: never blocks or breaks the thank-you state. */
export function sendLeadToSheet(lead: SheetLead): void {
  if (!SHEETS_WEBHOOK_URL) return;
  try {
    void fetch(SHEETS_WEBHOOK_URL, {
      method: "POST",
      mode: "no-cors",
      keepalive: true,
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ ...lead, key: SHEETS_KEY }),
    }).catch(() => {});
  } catch {
    // ignore
  }
}
