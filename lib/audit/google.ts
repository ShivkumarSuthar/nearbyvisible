import { withTimeout } from "./http";
import type { PageSpeed, PlaceDetails, PlaceSummary } from "./types";

class FatalError extends Error { }

function apiKey() {
  const key = process.env.GOOGLE_API_KEY;
  if (!key) {
    console.error("GOOGLE_API_KEY is not set");
    throw new FatalError("Google data is not available right now");
  }
  return key;
}

/** Calls a Google API with a timeout and one retry on network errors, 429 and 5xx. */
async function callGoogle<T>(url: string, init: RequestInit, { timeoutMs = 10_000, attempts = 2 } = {}): Promise<T> {
  let last: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await withTimeout(async (signal) => {
        const res = await fetch(url, { ...init, signal });
        if (res.ok) return (await res.json()) as T;
        // Full Google error stays in the server log; customers only see a plain message.
        const text = (await res.text()).slice(0, 300);
        console.error(`Google API error ${res.status}: ${text}`);
        if (res.status !== 429 && res.status < 500) throw new FatalError("Google data is not available right now");
        throw new Error("Google did not respond in time");
      }, timeoutMs);
    } catch (e) {
      if (e instanceof FatalError) throw e;
      last = e;
      if (i < attempts - 1) await new Promise((r) => setTimeout(r, 700));
    }
  }
  throw last instanceof Error ? last : new Error("Google API failed");
}

type RawPlace = {
  id: string;
  displayName?: { text: string };
  formattedAddress?: string;
  rating?: number;
  userRatingCount?: number;
  nationalPhoneNumber?: string;
  internationalPhoneNumber?: string;
  websiteUri?: string;
  regularOpeningHours?: unknown;
  primaryTypeDisplayName?: { text: string };
  photos?: unknown[];
  businessStatus?: string;
  googleMapsUri?: string;
  reviews?: { publishTime?: string }[];
};

const summary = (p: RawPlace): PlaceSummary => ({
  id: p.id,
  name: p.displayName?.text ?? "Unknown",
  address: p.formattedAddress ?? "",
  rating: p.rating,
  reviews: p.userRatingCount,
  phone: p.internationalPhoneNumber ?? p.nationalPhoneNumber,
  website: p.websiteUri,
  typeLabel: p.primaryTypeDisplayName?.text,
  mapsUrl: p.googleMapsUri,
  status: p.businessStatus,
  photosCount: p.photos?.length ?? 0,
});

export async function searchPlaces(query: string, pageSize = 5): Promise<PlaceSummary[]> {
  const data = await callGoogle<{ places?: RawPlace[] }>("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "X-Goog-Api-Key": apiKey(),
      "X-Goog-FieldMask":
        "places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.primaryTypeDisplayName,places.nationalPhoneNumber,places.internationalPhoneNumber,places.googleMapsUri,places.websiteUri,places.businessStatus,places.photos",
    },
    body: JSON.stringify({ textQuery: query, pageSize, regionCode: "IN" }),
  });
  return (data.places ?? []).map(summary);
}

export async function getPlace(id: string): Promise<PlaceDetails> {
  const fields = [
    "id",
    "displayName",
    "formattedAddress",
    "rating",
    "userRatingCount",
    "nationalPhoneNumber",
    "internationalPhoneNumber",
    "websiteUri",
    "regularOpeningHours",
    "primaryTypeDisplayName",
    "photos",
    "businessStatus",
    "googleMapsUri",
    "reviews",
  ].join(",");
  const p = await callGoogle<RawPlace>(`https://places.googleapis.com/v1/places/${encodeURIComponent(id)}`, {
    headers: { "X-Goog-Api-Key": apiKey(), "X-Goog-FieldMask": fields },
  });
  const latest = (p.reviews ?? []).map((r) => r.publishTime).filter(Boolean).sort().at(-1);
  return {
    ...summary(p),
    phone: p.internationalPhoneNumber ?? p.nationalPhoneNumber,
    website: p.websiteUri,
    hasHours: Boolean(p.regularOpeningHours),
    typeLabel: p.primaryTypeDisplayName?.text,
    photos: p.photos?.length ?? 0,
    status: p.businessStatus,
    mapsUrl: p.googleMapsUri,
    latestReview: latest,
  };
}

export async function runPageSpeed(url: string): Promise<PageSpeed> {
  const u = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
  u.searchParams.set("url", url);
  u.searchParams.set("strategy", "mobile");
  u.searchParams.append("category", "PERFORMANCE");
  u.searchParams.append("category", "SEO");
  u.searchParams.set("key", apiKey());
  const d = await callGoogle<{ lighthouseResult?: { categories?: Record<string, { score: number | null }> } }>(
    u.toString(),
    {},
    { timeoutMs: 30_000, attempts: 1 },
  );
  const c = d.lighthouseResult?.categories ?? {};
  return { performance: c.performance?.score ?? null, seo: c.seo?.score ?? null };
}
