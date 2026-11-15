export type Status = "PASS" | "WARNING" | "FAIL" | "NOT_TESTED";

export type CategoryId = "search" | "maps" | "website" | "tech" | "local" | "social" | "reputation" | "leads";

/** Category weights from the spec. They add up to 100. */
export const CATEGORIES: Record<CategoryId, { name: string; weight: number }> = {
  search: { name: "Google Search visibility", weight: 20 },
  maps: { name: "Google Maps and Business Profile", weight: 15 },
  website: { name: "Website health", weight: 15 },
  tech: { name: "Technical SEO", weight: 15 },
  local: { name: "Local SEO", weight: 10 },
  social: { name: "Social media presence", weight: 10 },
  reputation: { name: "Online reputation", weight: 10 },
  leads: { name: "Lead generation", weight: 5 },
};

export type PlaceSummary = { id: string; name: string; address: string; rating?: number; reviews?: number };

export type PlaceDetails = PlaceSummary & {
  phone?: string;
  website?: string;
  hasHours: boolean;
  typeLabel?: string;
  photos: number;
  status?: string;
  mapsUrl?: string;
  latestReview?: string;
};

export type SiteData = {
  url: string;
  status: number;
  https: boolean;
  title: string;
  metaDescription: string;
  h1Count: number;
  canonical: string;
  viewport: boolean;
  noindex: boolean;
  images: number;
  imagesWithAlt: number;
  ldTypes: string[];
  telLink: boolean;
  whatsappLink: boolean;
  form: boolean;
  ctas: string[];
  mapsLink: boolean;
  socials: Partial<Record<"instagram" | "facebook" | "linkedin" | "youtube", string>>;
  text: string;
  robots: { found: boolean; blocksAll: boolean };
  sitemap: { found: boolean; url?: string };
  links: { checked: number; broken: string[] };
};

export type PageSpeed = { performance: number | null; seo: number | null };

type Ok<T> = { ok: true } & T;
type Err = { ok: false; error: string };

/** Everything collected before tests run. Each source can fail on its own. */
export type AuditContext = {
  input: { name: string; city: string; category?: string };
  place: PlaceDetails;
  brand: Ok<{ ids: string[] }> | Err;
  local: Ok<{ query: string; results: PlaceSummary[] }> | Err;
  site: { state: "none" } | { state: "error"; url: string; error: string } | { state: "ok"; data: SiteData };
  speed: Ok<{ data: PageSpeed }> | Err | null;
};

export type Outcome = { status: Status; actual: string; evidence?: string };

export type TestDef = {
  id: string;
  name: string;
  category: CategoryId;
  description: string;
  source: string;
  weight: number;
  fix: string;
  run: (ctx: AuditContext) => Outcome;
};

export type TestResult = Omit<TestDef, "run"> & Outcome & { timestamp: string };

export type CategoryScore = { id: CategoryId; name: string; weight: number; score: number | null; tested: number; total: number };

export type Report = {
  business: { name: string; address: string; mapsUrl?: string; website?: string; typeLabel?: string };
  score: number | null;
  coverage: number;
  confidence: "high" | "medium" | "low";
  categories: CategoryScore[];
  tests: TestResult[];
  competitors: { query: string; rank: number | null; top: PlaceSummary[] } | null;
  limitations: string[];
  auditedAt: string;
};
