/**
 * Daily request limits.
 *
 * With Upstash Redis configured (UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN, or Vercel KV's
 * KV_REST_API_URL + KV_REST_API_TOKEN) every server instance shares one counter, so limits are exact.
 * Without it, or if Redis is down, each instance counts in its own memory: abuse is slowed, not capped.
 */
import { redis, redisConfig } from "@/lib/redis";

const memory = new Map<string, { day: string; count: number }>();

const today = () => new Date().toISOString().slice(0, 10);

function allowInMemory(key: string, limit: number) {
  const day = today();
  // Drop old days so the map does not grow forever.
  if (memory.size > 5000) for (const [k, v] of memory) if (v.day !== day) memory.delete(k);
  const entry = memory.get(key);
  if (!entry || entry.day !== day) {
    memory.set(key, { day, count: 1 });
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count++;
  return true;
}

/** Counts one request for `key` today and says whether it is within `limit`. */
export async function allow(key: string, limit: number): Promise<boolean> {
  if (!redisConfig()) return allowInMemory(key, limit);

  const k = `nv:rl:${today()}:${key}`;
  try {
    const [incr] = await redis([
      ["INCR", k],
      ["EXPIRE", k, 60 * 60 * 48],
    ]);
    if (typeof incr?.result !== "number") throw new Error(incr?.error ?? "Bad Redis reply");
    return incr.result <= limit;
  } catch (e) {
    console.error("rate limit: Redis unavailable, using memory", e);
    return allowInMemory(key, limit);
  }
}

/** Site-wide daily caps, so a flood from many IPs cannot run up the Google/Gemini bill. Change with env vars. */
const num = (v: string | undefined, d: number) => (v && Number.isFinite(Number(v)) && Number(v) > 0 ? Number(v) : d);
export const DAILY_CAP = {
  audits: num(process.env.FREE_CHECKS_PER_DAY, 300),
  get searches() {
    return this.audits * 5;
  },
  get ai() {
    return this.audits;
  },
  leads: num(process.env.LEADS_PER_DAY, 500),
};

export function clientIp(req: Request) {
  // On Vercel both headers are set by the platform (clients cannot spoof them). Behind another proxy, make sure it overwrites them.
  return req.headers.get("x-real-ip")?.trim() || req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
}
