import * as cheerio from "cheerio";
import { safeFetch } from "@/lib/audit/http";
import type { AiInput, LlmsCheck } from "./types";

type Page = { title: string; url: string };

const SKIP = /^(#|mailto:|tel:|javascript:)|wa\.me|whatsapp|\.(pdf|jpe?g|png|webp|zip)$/i;

/** Reads the home page for a description and the main internal pages to list in llms.txt. */
async function readHome(website: string) {
  const page = await safeFetch(/^https?:\/\//i.test(website) ? website : `https://${website}`, { timeoutMs: 8000, maxBytes: 1_000_000 });
  const base = new URL(page.url);
  const $ = cheerio.load(page.body);
  const seen = new Set<string>([base.origin + "/", base.toString()]);
  const pages: Page[] = [];
  $("nav a[href], header a[href], footer a[href], a[href]").each((_, el) => {
    if (pages.length >= 12) return;
    const href = ($(el).attr("href") ?? "").trim();
    const title = $(el).text().replace(/\s+/g, " ").trim();
    if (!href || SKIP.test(href) || !title || title.length > 60) return;
    try {
      const u = new URL(href, base);
      u.hash = "";
      if (u.origin !== base.origin || seen.has(u.toString())) return;
      seen.add(u.toString());
      pages.push({ title, url: u.toString() });
    } catch {
      // Ignore bad links.
    }
  });
  return {
    origin: base.origin,
    description: ($('meta[name="description"]').attr("content") ?? "").trim(),
    pages,
  };
}

export function buildLlmsTxt(input: AiInput, extra?: { origin?: string; description?: string; pages?: Page[] }) {
  const lines = [`# ${input.name}`, ""];
  const article = /^[aeiou]/i.test(input.category) ? "an" : "a";
  const summary = `${input.name} is ${article} ${input.category} in ${input.city}.`;
  lines.push(`> ${extra?.description ? `${summary} ${extra.description}` : summary}`, "");
  lines.push("## Business details", "");
  lines.push(`- Category: ${input.category}`);
  if (input.address) lines.push(`- Address: ${input.address}`);
  lines.push(`- Service area: ${input.city}`);
  if (extra?.origin ?? input.website) lines.push(`- Website: ${extra?.origin ?? input.website}`);
  if (input.mapsUrl) lines.push(`- Google Maps: ${input.mapsUrl}`);
  lines.push("- Phone: <add your phone number>", "- Opening hours: <add your hours>", "");
  if (extra?.pages?.length) {
    lines.push("## Main pages", "");
    for (const p of extra.pages) lines.push(`- [${p.title}](${p.url})`);
    lines.push("");
  }
  lines.push("## Services", "", "- <list each service you offer, one per line, with a short description>", "");
  lines.push("## Frequently asked questions", "", "- <question customers ask>: <short, factual answer>", "");
  return lines.join("\n");
}

/** Checks for /llms.txt and always returns a ready-to-edit draft. */
export async function checkLlms(input: AiInput): Promise<LlmsCheck> {
  if (!input.website) return { found: false, draft: buildLlmsTxt(input) };
  let home: Awaited<ReturnType<typeof readHome>> | undefined;
  try {
    home = await readHome(input.website);
  } catch {
    return { found: false, draft: buildLlmsTxt(input) };
  }
  const draft = buildLlmsTxt(input, home);
  const url = `${home.origin}/llms.txt`;
  try {
    const r = await safeFetch(url, { timeoutMs: 6000, maxBytes: 200_000 });
    const body = r.body.trim();
    const valid = r.status === 200 && !/<html|<!doctype/i.test(body.slice(0, 300)) && /^#\s+\S/.test(body);
    return valid ? { found: true, url, preview: body.slice(0, 800), draft } : { found: false, url, draft };
  } catch {
    return { found: false, url, draft };
  }
}
