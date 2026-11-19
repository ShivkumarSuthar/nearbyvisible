import { createHash, createHmac, timingSafeEqual } from "node:crypto";

/**
 * Cloudflare Turnstile: a free, mostly invisible "are you human" check.
 * It is on only when BOTH keys are set, so a half-done setup can never block real customers.
 */
export const turnstileEnabled = () => Boolean(process.env.TURNSTILE_SECRET_KEY && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);

/** Field name the Turnstile widget adds to the form. */
export const TURNSTILE_FIELD = "cf-turnstile-response";

/**
 * true = human (or Turnstile is off). A clear "no" from Cloudflare blocks the request; if Cloudflare
 * itself cannot be reached we let it through, because the rate limits still apply and leads matter more.
 */
export async function verifyHuman(token: unknown, ip: string): Promise<boolean> {
  if (!turnstileEnabled()) return true;
  if (typeof token !== "string" || !token || token.length > 2048) return false;
  try {
    const body = new URLSearchParams({ secret: process.env.TURNSTILE_SECRET_KEY!, response: token });
    if (ip !== "unknown") body.set("remoteip", ip);
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body,
      signal: AbortSignal.timeout(5000),
      cache: "no-store",
    });
    const data = (await res.json()) as { success?: boolean; "error-codes"?: string[] };
    if (!data.success) console.warn("turnstile rejected", data["error-codes"]);
    return Boolean(data.success);
  } catch (e) {
    console.error("turnstile: Cloudflare unreachable, allowing", e);
    return true;
  }
}

/*
 * Free-check pass. Turnstile tokens work once, but one free check is two paid calls (search, then audit).
 * So /api/check/search verifies the human once and hands back a signed pass that /api/check/audit requires.
 * This also stops anyone calling the audit endpoint directly with a list of place IDs.
 */
const PASS_TTL = 30 * 60 * 1000;

function secret() {
  const s = process.env.AUDIT_SIGNING_SECRET || `${process.env.GOOGLE_API_KEY ?? ""}|${process.env.GEMINI_API_KEY ?? ""}`;
  return createHash("sha256").update(`nearbyvisible-pass:${s}`).digest();
}

export function issuePass(): string {
  const at = Date.now().toString();
  return `${at}.${createHmac("sha256", secret()).update(at).digest("base64url")}`;
}

export function checkPass(pass: unknown): boolean {
  if (typeof pass !== "string" || pass.length > 200) return false;
  const [at, mac] = pass.split(".");
  const t = Number(at);
  if (!Number.isFinite(t) || !mac || Date.now() - t > PASS_TTL || t > Date.now() + 60_000) return false;
  const expected = createHmac("sha256", secret()).update(at).digest();
  const given = Buffer.from(mac, "base64url");
  return given.length === expected.length && timingSafeEqual(given, expected);
}
