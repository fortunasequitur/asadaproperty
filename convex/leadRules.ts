/** Shared, dependency-free lead validation (also imported by the frontend). */

export function normalizeIndoPhone(raw: string): string | null {
  let d = raw.replace(/[^\d+]/g, "");
  if (d.startsWith("+")) d = d.slice(1);
  d = d.replace(/\D/g, "");
  if (d.startsWith("0062")) d = d.slice(2);
  if (d.startsWith("62")) {
    // already international
  } else if (d.startsWith("0")) {
    d = `62${d.slice(1)}`;
  } else if (d.startsWith("8")) {
    d = `62${d}`;
  } else {
    return null;
  }
  // Indonesian mobile: 62 8xx, 9–12 digits after the country code.
  return /^628[1-9]\d{6,10}$/.test(d) ? d : null;
}

export function cleanName(raw: string): string {
  return raw.replace(/\s+/g, " ").trim();
}

export function validateName(raw: string): string | null {
  const n = cleanName(raw);
  if (n.length < 2) return "Nama minimal 2 huruf";
  if (n.length > 80) return "Nama terlalu panjang";
  if (!/\p{L}/u.test(n)) return "Nama harus berisi huruf";
  if (/https?:|www\.|<|>/i.test(n)) return "Nama tidak valid";
  return null;
}
