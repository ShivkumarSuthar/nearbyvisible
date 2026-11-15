import { errorMessage } from "@/lib/audit/http";
import { allow, clientIp } from "@/lib/audit/rate-limit";
import { runAiCheck } from "@/lib/ai/run";
import type { AiReport } from "@/lib/ai/types";

export const maxDuration = 60;

/** Same business checked again within 12 hours reuses the result, to save the free AI quota. */
const cache = new Map<string, { at: number; report: AiReport }>();
const TTL = 12 * 60 * 60 * 1000;

const clean = (v: unknown, max: number) => (typeof v === "string" ? v.replace(/[\r\n\t]+/g, " ").trim().slice(0, max) : "");

/** Step 3: AI visibility, run after the main report so it never slows it down. */
export async function POST(req: Request) {
  const b = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const input = {
    name: clean(b.name, 120),
    city: clean(b.city, 80),
    category: clean(b.category, 80) || "business",
    address: clean(b.address, 200) || undefined,
    website: clean(b.website, 300) || undefined,
    mapsUrl: /^https:\/\/(maps\.google\.com|www\.google\.com\/maps|maps\.app\.goo\.gl)\//.test(clean(b.mapsUrl, 300)) ? clean(b.mapsUrl, 300) : undefined,
  };
  if (!input.name || !input.city) return Response.json({ error: "Business name and city are needed." }, { status: 400 });

  const key = [input.name, input.city, input.category, input.website ?? ""].join("|").toLowerCase();
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < TTL) return Response.json(hit.report);

  if (!allow(`ai:${clientIp(req)}`, 5)) {
    return Response.json({ error: "You have used today's free AI checks. Message us on WhatsApp for a full review." }, { status: 429 });
  }

  try {
    const report = await runAiCheck(input);
    if (report.answers.ok) {
      cache.set(key, { at: Date.now(), report });
      if (cache.size > 500) cache.delete(cache.keys().next().value!);
    }
    return Response.json(report);
  } catch (e) {
    console.error("check/ai failed", e);
    return Response.json({ error: "The AI check could not finish. Please try again.", detail: errorMessage(e) }, { status: 502 });
  }
}
