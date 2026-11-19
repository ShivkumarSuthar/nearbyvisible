/**
 * Indian mobile number check shared by every form and the server.
 * Accepts "98765 43210", "+91 98765-43210", "09876543210"; returns the 10 digits, or null when it is not a valid mobile.
 */
export function indianMobile(raw: string | undefined | null): string | null {
  let d = (raw ?? "").replace(/\D/g, "");
  if (d.length === 12 && d.startsWith("91")) d = d.slice(2);
  else if (d.length === 11 && d.startsWith("0")) d = d.slice(1);
  return /^[6-9]\d{9}$/.test(d) ? d : null;
}

/** Hidden anti-spam field. Named so browser autofill and password managers leave it empty. */
export const HONEYPOT = "nv_hp_field";

/** Loose email check, same on browser and server. Returns the cleaned address or "". */
export function validEmail(raw: unknown): string {
  if (typeof raw !== "string") return "";
  const v = raw.trim().toLowerCase();
  return v.length <= 120 && /^[^\s@<>"']{1,64}@[^\s@<>"']{1,190}\.[a-z]{2,}$/.test(v) ? v : "";
}
