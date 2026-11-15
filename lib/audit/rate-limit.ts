/**
 * Simple per-IP daily limit, kept in memory. On Vercel each server instance has its own memory,
 * so this slows abuse but is not a hard cap. Move it to the database (Phase 2) for a strict limit.
 */
const hits = new Map<string, { day: string; count: number }>();

export function allow(key: string, limit: number) {
  const day = new Date().toISOString().slice(0, 10);
  const entry = hits.get(key);
  if (!entry || entry.day !== day) {
    hits.set(key, { day, count: 1 });
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count++;
  return true;
}

export function clientIp(req: Request) {
  return req.headers.get("x-forwarded-for")?.split(",")[0].trim() || req.headers.get("x-real-ip") || "unknown";
}
