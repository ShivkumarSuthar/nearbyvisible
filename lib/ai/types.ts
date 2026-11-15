/** Input for the AI visibility check. Comes from the audit the visitor just ran. */
export type AiInput = {
  name: string;
  city: string;
  category: string;
  address?: string;
  website?: string;
  mapsUrl?: string;
};

export type Source = { domain: string; uri: string };

export type AnswerResult = {
  kind: "discovery" | "brand";
  prompt: string;
  text: string;
  mentioned: boolean;
  /** 1-based position in the AI's recommendation list, when it gave one and the business is in it. */
  position: number | null;
  recommended: { name: string; position: number }[];
  sources: Source[];
  /** What the AI typed into Google before answering. Good content ideas. */
  queries: string[];
};

export type BotPurpose = "search" | "training" | "user";

export type BotResult = {
  token: string;
  owner: string;
  product: string;
  purpose: BotPurpose;
  allowed: boolean;
  /** The robots.txt rule that decided it, if any. */
  rule?: string;
  /** Result of loading the home page with this bot's user agent, when tested. */
  firewall?: { status: number | null; blocked: boolean };
};

export type CrawlerCheck =
  | { state: "none" }
  | { state: "error"; error: string }
  | { state: "ok"; origin: string; robotsFound: boolean; baselineStatus: number; bots: BotResult[] };

export type LlmsCheck = { found: boolean; url?: string; preview?: string; draft: string };

export type Suggestion = { priority: "high" | "medium" | "low"; title: string; detail: string };

export type AiReport = {
  engine: string | null;
  answers: { ok: true; items: AnswerResult[] } | { ok: false; error: string };
  summary: { discoveryMentioned: number; discoveryTotal: number; bestPosition: number | null; brandKnown: boolean | null };
  competitors: { name: string; count: number; bestPosition: number }[];
  sources: { domain: string; count: number; own: boolean }[];
  crawlers: CrawlerCheck;
  llms: LlmsCheck;
  suggestions: Suggestion[];
  checkedAt: string;
};
