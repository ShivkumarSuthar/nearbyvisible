import * as cheerio from "cheerio";
import { parseRobots, robotsAllows } from "@/lib/ai/crawlers";
import { safeFetch } from "./http";
import type { SiteData } from "./types";

const CTA = /\b(call|contact|book|whatsapp|enquir|inquir|get (a )?quote|order|appointment|message us|chat)\b/i;
const SOCIAL: [keyof SiteData["socials"], RegExp][] = [
  ["instagram", /^https?:\/\/(www\.)?instagram\.com\/(?!p\/|reel\/|explore\/)[^/?#]+/i],
  ["facebook", /^https?:\/\/(www\.|m\.)?(facebook|fb)\.com\/(?!sharer|share|dialog|plugins)[^?#]+/i],
  ["linkedin", /^https?:\/\/([a-z]+\.)?linkedin\.com\/(company|in|school)\/[^/?#]+/i],
  ["youtube", /^https?:\/\/(www\.)?(youtube\.com\/(@|c\/|channel\/|user\/)|youtu\.be\/)/i],
];

function collectTypes(node: unknown): string[] {
  if (Array.isArray(node)) return node.flatMap(collectTypes);
  if (!node || typeof node !== "object") return [];
  const o = node as Record<string, unknown>;
  const own = typeof o["@type"] === "string" ? [o["@type"]] : Array.isArray(o["@type"]) ? (o["@type"] as string[]) : [];
  return [...own, ...collectTypes(o["@graph"])];
}

/**
 * The website refused our automated request (bot protection, rate limit, maintenance) or did not answer in time.
 * This is "not tested", not "broken": real visitors may see the site fine.
 */
export class SiteBlockedError extends Error {}

const BLOCKED_STATUS = new Set([401, 403, 406, 429, 503]);
const isTimeout = (e: unknown) => e instanceof Error && (e.name === "AbortError" || /timed out/i.test(e.message));
const isUnreachable = (e: unknown) => /ENOTFOUND|EAI_AGAIN|ECONNREFUSED|ECONNRESET|EHOSTUNREACH|certificate|SSL/i.test(String((e as { code?: string })?.code ?? "") + " " + String((e as Error)?.message ?? ""));

/** Runs tasks with at most `limit` at a time, so we do not hammer small websites. */
async function pool<T, R>(items: T[], limit: number, fn: (x: T) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (next < items.length) {
        const i = next++;
        out[i] = await fn(items[i]);
      }
    }),
  );
  return out;
}

async function exists(url: string, check: (body: string) => boolean) {
  try {
    const r = await safeFetch(url, { timeoutMs: 6000, maxBytes: 500_000 });
    return r.status === 200 && check(r.body) ? r : null;
  } catch {
    return null;
  }
}

/** Fetches the home page plus robots.txt, sitemap and up to 10 internal links. */
export async function analyzeSite(input: string): Promise<SiteData> {
  const hasScheme = /^https?:\/\//i.test(input);
  let page;
  try {
    try {
      page = await safeFetch(hasScheme ? input : `https://${input}`);
    } catch (e) {
      if (hasScheme) throw e;
      page = await safeFetch(`http://${input}`);
    }
  } catch (e) {
    if (isTimeout(e)) throw new SiteBlockedError("The website did not answer our check in time");
    if (isUnreachable(e)) throw new Error("The website could not be reached (domain or server problem)");
    if (/cannot be checked/i.test((e as Error).message)) throw new SiteBlockedError("This address cannot be checked");
    throw e;
  }
  if (BLOCKED_STATUS.has(page.status)) {
    throw new SiteBlockedError(`The website blocked our automated check (status ${page.status}). It may still open for visitors.`);
  }
  if (page.status >= 400) throw new Error(`The website answered with error ${page.status}`);

  const final = new URL(page.url);
  const $ = cheerio.load(page.body);
  const hrefs = $("a[href]")
    .map((_, el) => ($(el).attr("href") ?? "").trim())
    .get();
  const abs = hrefs.flatMap((h) => {
    try {
      return [new URL(h, final).toString()];
    } catch {
      return [];
    }
  });

  const socials: SiteData["socials"] = {};
  for (const [key, re] of SOCIAL) {
    const hit = abs.find((h) => re.test(h));
    if (hit) socials[key] = hit;
  }

  const ldTypes = $('script[type="application/ld+json"]')
    .map((_, el) => $(el).text())
    .get()
    .flatMap((t) => {
      try {
        return collectTypes(JSON.parse(t));
      } catch {
        return [];
      }
    });

  const imgs = $("img");
  const ctas = [...new Set($("a, button").map((_, el) => $(el).text().replace(/\s+/g, " ").trim()).get())]
    .filter((t) => t.length < 40 && CTA.test(t))
    .slice(0, 8);

  const origin = final.origin;
  const robotsRes = await exists(`${origin}/robots.txt`, (b) => /user-agent/i.test(b));
  const robotsBody = robotsRes?.body ?? "";
  const googlebot = robotsAllows(parseRobots(robotsBody), "Googlebot", "/");
  const blocksAll = !googlebot.allowed;
  const sitemapFromRobots = robotsBody.match(/^\s*sitemap:\s*(\S+)/im)?.[1];
  const sitemapUrl = sitemapFromRobots ?? `${origin}/sitemap.xml`;
  const sitemapRes = await exists(sitemapUrl, (b) => /<(urlset|sitemapindex)/i.test(b));

  const internal = [...new Set(abs.filter((h) => new URL(h).origin === origin).map((h) => h.split("#")[0]))]
    .filter((h) => h !== final.toString())
    .slice(0, 10);
  // Only clear failures count as broken: missing pages (404/410) or a dead server. Timeouts, rate limits and
  // bot protection (401/403/429/5xx) are unknown, not broken.
  const linkResults = await pool(internal, 3, async (h) => {
    try {
      const r = await safeFetch(h, { timeoutMs: 6000, maxBytes: 50_000 });
      return r.status === 404 || r.status === 410 ? h : null;
    } catch (e) {
      return isUnreachable(e) ? h : null;
    }
  });

  $("script, style, noscript").remove();
  return {
    url: final.toString(),
    status: page.status,
    https: final.protocol === "https:",
    title: $("title").first().text().trim(),
    metaDescription: ($('meta[name="description"]').attr("content") ?? "").trim(),
    h1Count: $("h1").length,
    canonical: $('link[rel="canonical"]').attr("href") ?? "",
    viewport: $('meta[name="viewport"]').length > 0,
    noindex: /noindex/i.test($('meta[name="robots"]').attr("content") ?? ""),
    images: imgs.length,
    imagesWithAlt: imgs.filter((_, el) => ($(el).attr("alt") ?? "").trim().length > 0).length,
    ldTypes,
    telLink: hrefs.some((h) => h.toLowerCase().startsWith("tel:")),
    linkDigits: hrefs
      .filter((h) => /^tel:|wa\.me\/|api\.whatsapp\.com|whatsapp:\/\//i.test(h))
      .map((h) => h.replace(/\D/g, ""))
      .join(" "),
    whatsappLink: abs.some((h) => /wa\.me\/|api\.whatsapp\.com|whatsapp:\/\//i.test(h)),
    form: $("form").length > 0,
    ctas,
    mapsLink: abs.some((h) => /google\.[a-z.]+\/maps|maps\.app\.goo\.gl|goo\.gl\/maps/i.test(h)) || $('iframe[src*="google.com/maps"]').length > 0,
    socials,
    text: $("body").text().replace(/\s+/g, " ").toLowerCase().slice(0, 300_000),
    robots: { found: Boolean(robotsRes), blocksAll, rule: googlebot.rule },
    sitemap: { found: Boolean(sitemapRes), url: sitemapRes ? sitemapUrl : undefined },
    links: { checked: internal.length, broken: linkResults.filter((x): x is string => Boolean(x)) },
  };
}
