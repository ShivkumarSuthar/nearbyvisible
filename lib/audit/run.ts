import { getPlace, runPageSpeed, searchPlaces } from "./google";
import { errorMessage } from "./http";
import { analyzeSite } from "./site";
import { TESTS } from "./tests";
import { CATEGORIES, type AuditContext, type CategoryId, type CategoryScore, type Report, type TestResult } from "./types";

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
  const localResults = ctx.local.ok ? ctx.local.results : [];
  const rank = localResults.findIndex((p) => p.id === place.id);

  // Determine benchmark competitor (user-specified or top ranker in the city)
  const topCompetitors = localResults.filter((p) => p.id !== place.id);
  const specifiedCompList = specificComp.status === "fulfilled" ? specificComp.value : [];
  const targetCompetitor =
    specifiedCompList.find((p) => p.id !== place.id) ||
    topCompetitors[0] ||
    null;

  let benchmark = undefined;
  if (targetCompetitor) {
    const reviewsDiff = (targetCompetitor.reviews ?? 0) - (place.reviews ?? 0);
    const ratingDiff = Math.round(((targetCompetitor.rating ?? 0) - (place.rating ?? 0)) * 10) / 10;
    const photosDiff = (targetCompetitor.photosCount ?? 15) - (place.photos ?? 0);

    const keyGaps: string[] = [];
    if (rank !== 0) {
      keyGaps.push(`${targetCompetitor.name} holds rank #1 for "${localQuery}", capturing ~60% of clicks.`);
    }
    if (reviewsDiff > 0) {
      keyGaps.push(`Review Deficit: Competitor has ${reviewsDiff} more reviews, giving Google higher confidence.`);
    } else if (reviewsDiff < 0) {
      keyGaps.push(`Review Advantage: You have ${Math.abs(reviewsDiff)} more reviews than competitor.`);
    }
    if (ratingDiff > 0) {
      keyGaps.push(`Rating Gap: Competitor is rated +${ratingDiff}★ higher, attracting more trust.`);
    }
    if (photosDiff > 5) {
      keyGaps.push(`Visual Engagement: Competitor profile has significantly more photos and media.`);
    }
    if (!siteUrl && targetCompetitor.website) {
      keyGaps.push(`Web Authority: Competitor has a connected website powering their local SEO signals.`);
    }

    benchmark = {
      competitor: targetCompetitor,
      rank: rank >= 0 ? rank + 1 : null,
      reviewsDiff,
      ratingDiff,
      photosDiff,
      keyGaps: keyGaps.length > 0 ? keyGaps : ["Competitor maintains active Google Maps presence and fresh updates."],
    };
  }

  return {
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
          target: targetCompetitor ?? undefined,
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
