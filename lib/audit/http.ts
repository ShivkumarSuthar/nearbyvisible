import { lookup as dnsLookup, type LookupAddress } from "node:dns";
import http from "node:http";
import https from "node:https";
import net from "node:net";
import zlib from "node:zlib";

export const USER_AGENT = "NearbyVisibleAudit/1.0 (+https://nearbyvisible.vercel.app/check)";

function ipv4Private(ip: string): boolean {
  const [a, b, c] = ip.split(".").map(Number);
  return (
    a === 0 || a === 10 || a === 127 || a >= 224 ||
    (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) || (a === 100 && b >= 64 && b <= 127) ||
    (a === 192 && b === 0 && (c === 0 || c === 2)) || (a === 198 && (b === 18 || b === 19)) ||
    (a === 198 && b === 51 && c === 100) || (a === 203 && b === 0 && c === 113)
  );
}

/** Expands an IPv6 address to 8 numbers (handles "::" and a trailing dotted IPv4 part). */
function ipv6Words(ip: string): number[] | null {
  let v = ip.toLowerCase().split("%")[0];
  const dotted = v.match(/(\d+\.\d+\.\d+\.\d+)$/);
  if (dotted) {
    if (!net.isIPv4(dotted[1])) return null;
    const [a, b, c, d] = dotted[1].split(".").map(Number);
    v = v.slice(0, -dotted[1].length) + `${((a << 8) | b).toString(16)}:${((c << 8) | d).toString(16)}`;
  }
  const halves = v.split("::");
  if (halves.length > 2) return null;
  const head = halves[0] ? halves[0].split(":") : [];
  const tail = halves.length === 2 && halves[1] ? halves[1].split(":") : [];
  const fill = halves.length === 2 ? 8 - head.length - tail.length : 0;
  const words = [...head, ...Array(Math.max(0, fill)).fill("0"), ...tail].map((h) => parseInt(h, 16));
  return words.length === 8 && words.every((w) => w >= 0 && w <= 0xffff) ? words : null;
}

const v4FromWords = (hi: number, lo: number) => `${hi >> 8}.${hi & 255}.${lo >> 8}.${lo & 255}`;

/** True for any address that is not plain public unicast (private, loopback, link-local, mapped/tunnelled private IPv4…). */
export function isPrivateIp(ip: string): boolean {
  if (net.isIPv4(ip)) return ipv4Private(ip);
  const w = ipv6Words(ip);
  if (!w) return true; // unparseable: refuse
  const zeroUntil = (n: number) => w.slice(0, n).every((x) => x === 0);
  if (zeroUntil(5) && w[5] === 0xffff) return ipv4Private(v4FromWords(w[6], w[7])); // ::ffff:a.b.c.d
  if (zeroUntil(6)) return true; // ::, ::1 and deprecated ::a.b.c.d
  if (w[0] === 0x64 && w[1] === 0xff9b) return true; // NAT64
  if (w[0] === 0x2002) return ipv4Private(v4FromWords(w[1], w[2])); // 6to4
  if (w[0] === 0x2001 && w[1] === 0) return true; // Teredo
  if (w[0] === 0x2001 && w[1] === 0xdb8) return true; // documentation
  // Only global unicast (2000::/3) is allowed.
  return (w[0] & 0xe000) !== 0x2000;
}

/** Blocks non-http(s) URLs, passwords in URLs and literal private IPs. Hostnames are checked again at connect time. */
export async function assertPublicUrl(raw: string): Promise<URL> {
  const url = new URL(raw);
  if (url.protocol !== "http:" && url.protocol !== "https:") throw new Error("Only http and https addresses can be checked");
  if (url.username || url.password) throw new Error("Addresses with passwords are not allowed");
  const host = url.hostname.replace(/^\[|\]$/g, "");
  if (net.isIP(host) && isPrivateIp(host)) throw new Error("This address cannot be checked");
  if (host === "localhost" || host.endsWith(".localhost") || host.endsWith(".internal") || host.endsWith(".local")) {
    throw new Error("This address cannot be checked");
  }
  return url;
}

/**
 * DNS lookup used for the actual connection: every resolved address must be public,
 * and the socket connects to exactly the address that was checked (no DNS rebinding gap).
 */
const guardedLookup: net.LookupFunction = (hostname, options, callback) => {
  dnsLookup(hostname, { ...options, all: true }, (err, addresses) => {
    if (err) return (callback as (e: Error) => void)(err);
    const list = addresses as unknown as LookupAddress[];
    if (!list.length || list.some((a) => isPrivateIp(a.address))) {
      return (callback as (e: Error) => void)(new Error("This address cannot be checked"));
    }
    if ((options as { all?: boolean }).all) return (callback as (e: null, a: LookupAddress[]) => void)(null, list);
    (callback as (e: null, a: string, f: number) => void)(null, list[0].address, list[0].family);
  });
};

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

type RawResponse = { status: number; location: string | null; contentType: string; body: string };

/** One HTTP request over a socket whose address passed the SSRF guard. Body is decompressed and capped at maxBytes. */
function requestOnce(url: URL, userAgent: string, maxBytes: number, signal: AbortSignal): Promise<RawResponse> {
  return new Promise((resolve, reject) => {
    const mod = url.protocol === "https:" ? https : http;
    const req = mod.request(
      url,
      {
        method: "GET",
        lookup: guardedLookup,
        signal,
        headers: {
          "user-agent": userAgent,
          accept: "text/html,application/xhtml+xml,text/plain,application/xml;q=0.9,*/*;q=0.8",
          "accept-encoding": "gzip, deflate, br",
        },
      },
      (res) => {
        const status = res.statusCode ?? 0;
        const location = typeof res.headers.location === "string" ? res.headers.location : null;
        const contentType = String(res.headers["content-type"] ?? "");
        if (status >= 300 && status < 400 && location) {
          res.resume();
          return resolve({ status, location, contentType, body: "" });
        }
        const enc = String(res.headers["content-encoding"] ?? "").toLowerCase();
        const stream =
          enc === "gzip" ? res.pipe(zlib.createGunzip()) : enc === "deflate" ? res.pipe(zlib.createInflate()) : enc === "br" ? res.pipe(zlib.createBrotliDecompress()) : res;
        const chunks: Buffer[] = [];
        let size = 0;
        let done = false;
        const finish = () => {
          if (done) return;
          done = true;
          resolve({ status, location, contentType, body: Buffer.concat(chunks).toString("utf8") });
        };
        stream.on("data", (c: Buffer) => {
          if (done) return;
          size += c.length;
          if (size > maxBytes) {
            chunks.push(c.subarray(0, Math.max(0, c.length - (size - maxBytes))));
            finish();
            req.destroy();
            return;
          }
          chunks.push(c);
        });
        stream.on("end", finish);
        stream.on("error", (e) => (done ? undefined : (done = true, reject(e))));
      },
    );
    req.on("error", reject);
    req.end();
  });
}

/** Fetches a public page. Redirects are followed by hand so every hop passes the SSRF guard. */
export function safeFetch(
  raw: string,
  { timeoutMs = 10_000, maxBytes = 2_000_000, userAgent = USER_AGENT }: { timeoutMs?: number; maxBytes?: number; userAgent?: string } = {},
): Promise<FetchedPage> {
  return withTimeout(async (signal) => {
    let current = raw;
    for (let hop = 0; hop < 6; hop++) {
      const url = await assertPublicUrl(current);
      const res = await requestOnce(url, userAgent, maxBytes, signal);
      if (res.status >= 300 && res.status < 400 && res.location) {
        current = new URL(res.location, url).toString();
        continue;
      }
      return { url: url.toString(), status: res.status, contentType: res.contentType, body: res.body };
    }
    throw new Error("Too many redirects");
  }, timeoutMs);
}

export const errorMessage = (e: unknown) => (e instanceof Error ? e.message : String(e));
