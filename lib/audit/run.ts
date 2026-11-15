import { getPlace, runPageSpeed, searchPlaces } from "./google";
import { errorMessage } from "./http";
import { analyzeSite } from "./site";
import { TESTS } from "./tests";
import { CATEGORIES, type AuditContext, type CategoryId, type CategoryScore, type Report, type TestResult } from "./types";

const POINTS = { PASS: 1, WARNING: 0.5, FAIL: 0 } as const;

export type AuditInput = { placeId: string; name: string; city: string; category?: string; website?: string };

/** Collect → test → score. Every data source is independent: one failing never stops the audit. */
export async function runAudit(input: AuditInput): Promise<Report> {
  const place = await getPlace(input.placeId); // the one source we cannot work without
  const siteUrl = input.website?.trim() || place.website;
  const localQuery = `${input.category?.trim() || place.typeLabel || "business"} in ${input.city}`;

  const [brand, local, site, speed] = await Promise.allSettled([
    searchPlaces(`${input.name} ${input.city}`, 5),
    searchPlaces(localQuery, 20),
    siteUrl ? analyzeSite(siteUrl) : Promise.resolve(null),
    siteUrl ? runPageSpeed(/^https?:\/\//i.test(siteUrl) ? siteUrl : `https://${siteUrl}`) : Promise.resolve(null),
  ]);

  const ctx: AuditContext = {
    input: { name: input.name, city: input.city, category: input.category },
    place,
    brand: brand.status === "fulfilled" ? { ok: true, ids: brand.value.map((p) => p.id) } : { ok: false, error: errorMessage(brand.reason) },
    local:
      local.status === "fulfilled"
        ? { ok: true, query: localQuery, results: local.value }
        : { ok: false, error: errorMessage(local.reason) },
    site: !siteUrl
      ? { state: "none" }
      : site.status === "fulfilled" && site.value
        ? { state: "ok", data: site.value }
        : { state: "error", url: siteUrl, error: site.status === "rejected" ? errorMessage(site.reason) : "Unknown error" },
    speed: !siteUrl ? null : speed.status === "fulfilled" && speed.value ? { ok: true, data: speed.value } : { ok: false, error: speed.status === "rejected" ? errorMessage(speed.reason) : "Unknown error" },
  };

  const now = new Date().toISOString();
  const tests: TestResult[] = TESTS.map(({ run, ...def }) => {
    try {
      return { ...def, ...run(ctx), timestamp: now };
    } catch (e) {
      return { ...def, status: "NOT_TESTED" as const, actual: `Test error: ${errorMessage(e)}`, timestamp: now };
    }
  });

  const { score, coverage, categories } = scoreTests(tests);
  const rank = ctx.local.ok ? ctx.local.results.findIndex((p) => p.id === place.id) : -1;

  return {
    business: { name: place.name, address: place.address, mapsUrl: place.mapsUrl, website: siteUrl, typeLabel: place.typeLabel },
    score,
    coverage,
    confidence: coverage >= 0.85 ? "high" : coverage >= 0.6 ? "medium" : "low",
    categories,
    tests,
    competitors: ctx.local.ok
      ? { query: ctx.local.query, rank: rank >= 0 ? rank + 1 : null, top: ctx.local.results.filter((p) => p.id !== place.id).slice(0, 3) }
      : null,
    limitations: [
      `Search position is measured with Google Places search for "${localQuery}". Real Google results can differ by device and location.`,
      "Social profiles are only counted when they are linked from the website. We never match accounts by name alone.",
      "Google shares at most 10 photos and 5 reviews per business, so those checks use that sample.",
      "Only the home page and up to 10 internal links are checked.",
    ],
    auditedAt: now,
  };
}

/**
 * Category score = weighted share of points among tests that ran.
 * Overall = category weights over categories with at least one test run.
 * NOT_TESTED never counts as a fail; coverage shows how much was actually measured.
 */
export function scoreTests(tests: TestResult[]) {
  let earned = 0;
  let possible = 0;
  let measuredWeight = 0;
  let totalWeight = 0;

  const categories: CategoryScore[] = (Object.keys(CATEGORIES) as CategoryId[]).map((id) => {
    const inCat = tests.filter((t) => t.category === id);
    const ran = inCat.filter((t) => t.status !== "NOT_TESTED");
    const all = inCat.reduce((s, t) => s + t.weight, 0);
    const w = ran.reduce((s, t) => s + t.weight, 0);
    const got = ran.reduce((s, t) => s + t.weight * POINTS[t.status as keyof typeof POINTS], 0);
    const score = w ? got / w : null;
    const cw = CATEGORIES[id].weight;
    if (score !== null) {
      earned += score * cw;
      possible += cw;
    }
    measuredWeight += all ? (w / all) * cw : 0;
    totalWeight += cw;
    return { id, name: CATEGORIES[id].name, weight: cw, score: score === null ? null : Math.round(score * 100), tested: ran.length, total: inCat.length };
  });

  return {
    score: possible ? Math.round((earned / possible) * 100) : null,
    coverage: totalWeight ? measuredWeight / totalWeight : 0,
    categories,
  };
}
