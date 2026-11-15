import { lookup } from "node:dns/promises";
import net from "node:net";

export const USER_AGENT = "NearbyVisibleAudit/1.0 (+https://nearbyvisible.vercel.app/check)";

function isPrivateIp(ip: string): boolean {
  if (net.isIPv4(ip)) {
    const [a, b] = ip.split(".").map(Number);
    return (
      a === 0 || a === 10 || a === 127 || a >= 224 ||
      (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) || (a === 100 && b >= 64 && b <= 127)
    );
  }
  const v = ip.toLowerCase();
  if (v.startsWith("::ffff:")) return isPrivateIp(v.slice(7));
  return v === "::1" || v === "::" || /^f[cd]/.test(v) || /^fe[89ab]/.test(v);
}

/** Blocks non-http(s) URLs and anything resolving to a private/internal address (SSRF guard). */
export async function assertPublicUrl(raw: string): Promise<URL> {
  const url = new URL(raw);
  if (url.protocol !== "http:" && url.protocol !== "https:") throw new Error("Only http and https addresses can be checked");
  if (url.username || url.password) throw new Error("Addresses with passwords are not allowed");
  const host = url.hostname.replace(/^\[|\]$/g, "");
  const addrs = net.isIP(host) ? [{ address: host }] : await lookup(host, { all: true });
  if (!addrs.length || addrs.some((a) => isPrivateIp(a.address))) throw new Error("This address cannot be checked");
  return url;
}

export async function withTimeout<T>(fn: (signal: AbortSignal) => Promise<T>, ms: number): Promise<T> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(new Error(`Timed out after ${Math.round(ms / 1000)}s`)), ms);
  try {
    return await fn(ctrl.signal);
  } finally {
    clearTimeout(timer);
  }
}

export type FetchedPage = { url: string; status: number; contentType: string; body: string };

/** Fetches a public page. Redirects are followed by hand so every hop passes the SSRF guard. */
export function safeFetch(
  raw: string,
  { timeoutMs = 10_000, maxBytes = 2_000_000, userAgent = USER_AGENT }: { timeoutMs?: number; maxBytes?: number; userAgent?: string } = {},
): Promise<FetchedPage> {
  return withTimeout(async (signal) => {
    let current = raw;
    for (let hop = 0; hop < 6; hop++) {
      const url = await assertPublicUrl(current);
      const res = await fetch(url, {
        redirect: "manual",
        signal,
        headers: { "user-agent": userAgent, accept: "text/html,application/xhtml+xml,text/plain,application/xml;q=0.9,*/*;q=0.8" },
      });
      const location = res.headers.get("location");
      if (res.status >= 300 && res.status < 400 && location) {
        current = new URL(location, url).toString();
        continue;
      }
      return { url: url.toString(), status: res.status, contentType: res.headers.get("content-type") ?? "", body: await readLimited(res, maxBytes) };
    }
    throw new Error("Too many redirects");
  }, timeoutMs);
}

async function readLimited(res: Response, max: number) {
  if (!res.body) return "";
  const reader = res.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.length;
    if (size > max) {
      await reader.cancel();
      break;
    }
    chunks.push(value);
  }
  return new TextDecoder().decode(Buffer.concat(chunks));
}

export const errorMessage = (e: unknown) => (e instanceof Error ? e.message : String(e));
