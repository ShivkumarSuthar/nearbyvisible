import { cleanAiInput, signAiInput } from "@/lib/ai/token";
import { getPlace, runPageSpeed, searchPlaces } from "./google";
import { errorMessage } from "./http";
import { analyzeSite, SiteBlockedError } from "./site";
import { TESTS } from "./tests";
import { CATEGORIES, type AuditContext, type CompetitorBenchmark, type CategoryId, type CategoryScore, type Report, type TestResult } from "./types";

const POINTS = { PASS: 1, WARNING: 0.5, FAIL: 0 } as const;

export type AuditInput = {
  placeId: string;
  name: string;
  city: string;
  category?: string;
  website?: string;
  competitor?: string;
};

/** Collect → test → score. Every data source is independent: one failing never stops the audit. */
export async function runAudit(input: AuditInput): Promise<Report> {
  const place = await getPlace(input.placeId); // the one source we cannot work without
  const siteUrl = input.website?.trim() || place.website;
  const localQuery = `${input.category?.trim() || place.typeLabel || "business"} in ${input.city}`;

  const [brand, local, site, speed, specificComp] = await Promise.allSettled([
    searchPlaces(`${input.name} ${input.city}`, 5),
    searchPlaces(localQuery, 20),
    siteUrl ? analyzeSite(siteUrl) : Promise.resolve(null),
    siteUrl ? runPageSpeed(/^https?:\/\//i.test(siteUrl) ? siteUrl : `https://${siteUrl}`) : Promise.resolve(null),
    input.competitor ? searchPlaces(`${input.competitor} ${input.city}`, 3) : Promise.resolve([]),
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
        : {
            state: "error",
            url: siteUrl,
            error: site.status === "rejected" ? errorMessage(site.reason) : "Unknown error",
            blocked: site.status === "rejected" && site.reason instanceof SiteBlockedError,
          },
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
  const localResults = ctx.local.ok ? ctx.local.results : [];
  const rank = localResults.findIndex((p) => p.id === place.id);

  // Every local result keeps its real position, so the report never relabels rank #3 as #2.
  const ranked = localResults.map((p, i) => ({ ...p, rank: i + 1 }));
  const topCompetitors = ranked.filter((p) => p.id !== place.id);
  const ownRank = rank >= 0 ? rank + 1 : null;

  // A named competitor must actually match the name typed (not just the first search hit), and must not be this business.
  const wanted = simplify(input.competitor ?? "");
  const named = wanted
    ? (specificComp.status === "fulfilled" ? specificComp.value : []).find(
        (p) => p.id !== place.id && simplify(p.name) !== simplify(place.name) && (simplify(p.name).includes(wanted) || wanted.includes(simplify(p.name))),
      )
    : undefined;
  const target = named ? { ...named, rank: ranked.find((p) => p.id === named.id)?.rank } : topCompetitors[0];

  let benchmark: CompetitorBenchmark | undefined;
  if (target) {
    const reviewsDiff = (target.reviews ?? 0) - (place.reviews ?? 0);
    const ratingDiff = target.rating !== undefined && place.rating !== undefined ? Math.round((target.rating - place.rating) * 10) / 10 : 0;
    // Google returns at most 10 photos per business, so this is a sample, not the real total.
    const photosDiff = (target.photosCount ?? 0) - (place.photos ?? 0);

    const q = `"${localQuery}"`;
    const keyGaps: string[] = [];
    if (target.rank && (!ownRank || ownRank > target.rank)) {
      keyGaps.push(
        `${target.name} is at position ${target.rank} for ${q}${ownRank ? `, you are at position ${ownRank}` : `, and you are not in the top ${localResults.length}`}. Most clicks go to the first few results.`,
      );
    } else if (target.rank && ownRank && ownRank < target.rank) {
      keyGaps.push(`You are ahead: position ${ownRank} for ${q}, ${target.name} is at position ${target.rank}.`);
    } else if (!target.rank) {
      keyGaps.push(`${target.name} is not in the top ${localResults.length} for ${q} either.`);
    }
    if (reviewsDiff > 0) keyGaps.push(`Reviews: ${target.name} has ${reviewsDiff} more Google reviews than you.`);
    else if (reviewsDiff < 0) keyGaps.push(`Reviews: you have ${Math.abs(reviewsDiff)} more Google reviews than ${target.name}.`);
    if (ratingDiff > 0) keyGaps.push(`Rating: ${target.name} is rated ${ratingDiff}★ higher than you.`);
    else if (ratingDiff < 0) keyGaps.push(`Rating: you are rated ${Math.abs(ratingDiff)}★ higher than ${target.name}.`);
    if (!siteUrl && target.website) keyGaps.push(`Website: ${target.name} has a website linked to its Google profile, you do not.`);

    benchmark = {
      competitor: target,
      chosen: Boolean(named),
      rank: ownRank,
      reviewsDiff,
      ratingDiff,
      photosDiff,
      keyGaps: keyGaps.length ? keyGaps : [`You and ${target.name} look evenly matched on rank, reviews and rating.`],
    };
  }

  const aiInput = cleanAiInput({
    name: place.name,
    city: input.city,
    category: input.category?.trim() || place.typeLabel || "business",
    address: place.address,
    website: siteUrl,
    mapsUrl: place.mapsUrl,
  });

  return {
    ai: { input: aiInput, token: signAiInput(aiInput) },
    business: {
      name: place.name,
      address: place.address,
      mapsUrl: place.mapsUrl,
      website: siteUrl,
      typeLabel: place.typeLabel,
      phone: place.phone,
      rating: place.rating,
      reviews: place.reviews,
      photos: place.photos,
      status: place.status,
    },
    score,
    coverage,
    confidence: coverage >= 0.85 ? "high" : coverage >= 0.6 ? "medium" : "low",
    categories,
    tests,
    competitors: ctx.local.ok
      ? {
          query: ctx.local.query,
          rank: rank >= 0 ? rank + 1 : null,
          top: topCompetitors.slice(0, 3),
          target,
          benchmark,
        }
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

/** Lower-case letters and digits only, for comparing business names. */
function simplify(s: string) {
  return s.toLowerCase().replace(/\b(pvt|ltd|private|limited|llp|the)\b/g, "").replace(/[^a-z0-9\u0900-\u097f]+/g, "");
}
