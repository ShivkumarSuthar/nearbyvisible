import { randomBytes, randomInt } from "node:crypto";
import type { Report } from "@/lib/audit/types";
import { redis, redisConfig } from "@/lib/redis";
import { site } from "@/lib/site";

/**
 * Saved reports, so the customer can get a link on WhatsApp or email and open it later.
 * Kept in Upstash Redis for 30 days under an unguessable id, plus a short reference code
 * (e.g. NV-7K2P9Q) that the customer sends us on WhatsApp to get the link. Needs Redis.
 */
const TTL = 30 * 86400;
export type SavedReport = { report: Report; city: string; category: string; savedAt: string };
export type Share = { ref: string; link: string };

export const canSaveReports = () => Boolean(redisConfig());

// No 0/O/1/I/L, so a code read aloud or retyped is not mistaken.
const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
const newRef = () => `NV-${Array.from({ length: 6 }, () => ALPHABET[randomInt(ALPHABET.length)]).join("")}`;

export async function saveReport(data: Omit<SavedReport, "savedAt">): Promise<Share> {
  const id = randomBytes(16).toString("base64url");
  const ref = newRef();
  // The AI token is only for the live session; a saved copy does not need it.
  const saved: SavedReport = { ...data, report: { ...data.report, ai: { ...data.report.ai, token: "" } }, savedAt: new Date().toISOString() };
  const replies = await redis([
    ["SET", `nv:report:${id}`, JSON.stringify(saved), "EX", TTL],
    ["SET", `nv:ref:${ref}`, id, "EX", TTL],
  ]);
  const failed = replies.find((r) => r.error);
  if (failed) throw new Error(failed.error);
  return { ref, link: reportLink(id) };
}

const reportLink = (id: string) => `${site.url}/report/${id}`;

export async function loadReport(id: string): Promise<SavedReport | null> {
  if (!/^[A-Za-z0-9_-]{22}$/.test(id) || !canSaveReports()) return null;
  try {
    const [get] = await redis([["GET", `nv:report:${id}`]]);
    return typeof get?.result === "string" ? (JSON.parse(get.result) as SavedReport) : null;
  } catch (e) {
    console.error("loadReport failed", e);
    return null;
  }
}

/** Finds a saved report by the reference code in a WhatsApp message. */
export async function findByRef(ref: string): Promise<{ link: string; saved: SavedReport } | null> {
  if (!canSaveReports()) return null;
  const [get] = await redis([["GET", `nv:ref:${ref.toUpperCase()}`]]);
  if (typeof get?.result !== "string") return null;
  const saved = await loadReport(get.result);
  return saved ? { link: reportLink(get.result), saved } : null;
}
