import * as cheerio from "cheerio";
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

/** True when the group for "User-agent: *" contains "Disallow: /". */
function robotsBlocksAll(body: string) {
  let applies = false;
  let inAgents = false;
  for (const raw of body.split(/\r?\n/)) {
    const line = raw.replace(/#.*/, "").trim();
    const i = line.indexOf(":");
    if (i < 0) continue;
    const key = line.slice(0, i).trim().toLowerCase();
    const val = line.slice(i + 1).trim();
    if (key === "user-agent") {
      if (!inAgents) applies = false;
      inAgents = true;
      if (val === "*") applies = true;
    } else {
      inAgents = false;
      if (applies && key === "disallow" && val === "/") return true;
    }
  }
  return false;
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
    page = await safeFetch(hasScheme ? input : `https://${input}`);
  } catch (e) {
    if (hasScheme) throw e;
    page = await safeFetch(`http://${input}`);
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
  const blocksAll = robotsBlocksAll(robotsBody);
  const sitemapFromRobots = robotsBody.match(/^\s*sitemap:\s*(\S+)/im)?.[1];
  const sitemapUrl = sitemapFromRobots ?? `${origin}/sitemap.xml`;
  const sitemapRes = await exists(sitemapUrl, (b) => /<(urlset|sitemapindex)/i.test(b));

  const internal = [...new Set(abs.filter((h) => new URL(h).origin === origin).map((h) => h.split("#")[0]))]
    .filter((h) => h !== final.toString())
    .slice(0, 10);
  const linkResults = await Promise.all(
    internal.map(async (h) => {
      try {
        const r = await safeFetch(h, { timeoutMs: 6000, maxBytes: 50_000 });
        return r.status >= 400 ? h : null;
      } catch {
        return h;
      }
    }),
  );

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
    whatsappLink: abs.some((h) => /wa\.me\/|api\.whatsapp\.com|whatsapp:\/\//i.test(h)),
    form: $("form").length > 0,
    ctas,
    mapsLink: abs.some((h) => /google\.[a-z.]+\/maps|maps\.app\.goo\.gl|goo\.gl\/maps/i.test(h)) || $('iframe[src*="google.com/maps"]').length > 0,
    socials,
    text: $("body").text().replace(/\s+/g, " ").toLowerCase().slice(0, 300_000),
    robots: { found: Boolean(robotsRes), blocksAll },
    sitemap: { found: Boolean(sitemapRes), url: sitemapRes ? sitemapUrl : undefined },
    links: { checked: internal.length, broken: linkResults.filter((x): x is string => Boolean(x)) },
  };
}
