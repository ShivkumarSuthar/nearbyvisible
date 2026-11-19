import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import type { AiInput } from "./types";

/**
 * The AI check only runs for a business that went through a real audit: the audit signs the exact input,
 * and /api/check/ai refuses anything unsigned or changed. This stops the endpoint being used as a free Gemini proxy.
 * Set AUDIT_SIGNING_SECRET in production; otherwise a secret is derived from the server-only API keys.
 */
function secret() {
  const s = process.env.AUDIT_SIGNING_SECRET || `${process.env.GOOGLE_API_KEY ?? ""}|${process.env.GEMINI_API_KEY ?? ""}`;
  return createHash("sha256").update(`nearbyvisible-ai:${s}`).digest();
}

const TTL = 2 * 60 * 60 * 1000; // a signed input is valid for 2 hours

const canonical = (i: AiInput, at: number) =>
  JSON.stringify([i.name, i.city, i.category, i.address ?? "", i.website ?? "", i.mapsUrl ?? "", at]);

export function signAiInput(input: AiInput): string {
  const at = Date.now();
  return `${at}.${createHmac("sha256", secret()).update(canonical(input, at)).digest("base64url")}`;
}

export function verifyAiInput(input: AiInput, token: unknown): boolean {
  if (typeof token !== "string") return false;
  const [atRaw, mac] = token.split(".");
  const at = Number(atRaw);
  if (!Number.isFinite(at) || !mac || Date.now() - at > TTL || at > Date.now() + 60_000) return false;
  const expected = createHmac("sha256", secret()).update(canonical(input, at)).digest();
  const given = Buffer.from(mac, "base64url");
  return given.length === expected.length && timingSafeEqual(given, expected);
}

const clean = (v: unknown, max: number) => (typeof v === "string" ? v.replace(/[\r\n\t]+/g, " ").trim().slice(0, max) : "");
const MAPS = /^https:\/\/(maps\.google\.com|www\.google\.com\/maps|maps\.app\.goo\.gl)\//;

/** Normalises AI input the same way on both sides (audit signs it, the AI route re-checks it). */
export function cleanAiInput(b: Record<string, unknown>): AiInput {
  const mapsUrl = clean(b.mapsUrl, 300);
  return {
    name: clean(b.name, 120),
    city: clean(b.city, 80),
    category: clean(b.category, 80) || "business",
    address: clean(b.address, 200) || undefined,
    website: clean(b.website, 300) || undefined,
    mapsUrl: MAPS.test(mapsUrl) ? mapsUrl : undefined,
  };
}
