import { errorMessage, safeFetch } from "@/lib/audit/http";
import type { BotPurpose, BotResult, CrawlerCheck } from "./types";

type Bot = { token: string; owner: string; product: string; purpose: BotPurpose; ua?: string };

/** Crawlers that decide whether AI tools can read and cite a site. `ua` = also test the firewall with this user agent. */
export const AI_BOTS: Bot[] = [
  { token: "Googlebot", owner: "Google", product: "Google Search, AI Overviews, AI Mode", purpose: "search" },
  { token: "Bingbot", owner: "Microsoft", product: "Bing, Copilot (and ChatGPT search uses Bing)", purpose: "search" },
  {
    token: "OAI-SearchBot",
    owner: "OpenAI",
    product: "ChatGPT search",
    purpose: "search",
    ua: "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; OAI-SearchBot/1.0; +https://openai.com/searchbot)",
  },
  { token: "ChatGPT-User", owner: "OpenAI", product: "ChatGPT opening a link for a user", purpose: "user" },
  {
    token: "PerplexityBot",
    owner: "Perplexity",
    product: "Perplexity answers",
    purpose: "search",
    ua: "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot)",
  },
  { token: "Claude-SearchBot", owner: "Anthropic", product: "Claude search", purpose: "search" },
  {
    token: "GPTBot",
    owner: "OpenAI",
    product: "Training future ChatGPT models",
    purpose: "training",
    ua: "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.1; +https://openai.com/gptbot)",
  },
  { token: "Google-Extended", owner: "Google", product: "Gemini training and grounding", purpose: "training" },
  { token: "ClaudeBot", owner: "Anthropic", product: "Training Claude models", purpose: "training" },
  { token: "CCBot", owner: "Common Crawl", product: "Open dataset many AI models learn from", purpose: "training" },
];

type Rule = { allow: boolean; path: string };
type Group = { agents: string[]; rules: Rule[] };

/** Splits robots.txt into user-agent groups (RFC 9309). */
export function parseRobots(body: string): Group[] {
  const groups: Group[] = [];
  let current: Group | null = null;
  let lastWasAgent = false;
  for (const raw of body.split(/\r?\n/)) {
    const line = raw.replace(/#.*/, "").trim();
    const i = line.indexOf(":");
    if (i < 0) continue;
    const key = line.slice(0, i).trim().toLowerCase();
    const val = line.slice(i + 1).trim();
    if (key === "user-agent") {
      if (!current || !lastWasAgent) {
        current = { agents: [], rules: [] };
        groups.push(current);
      }
      current.agents.push(val.toLowerCase());
      lastWasAgent = true;
    } else if (key === "allow" || key === "disallow") {
      lastWasAgent = false;
      if (current && val) current.rules.push({ allow: key === "allow", path: val });
    } else {
      lastWasAgent = false;
    }
  }
  return groups;
}

function patternMatches(pattern: string, path: string) {
  const anchored = pattern.endsWith("$");
  const body = (anchored ? pattern.slice(0, -1) : pattern).split("*").map((p) => p.replace(/[.+?^${}()|[\]\\]/g, "\\$&")).join(".*");
  return new RegExp(`^${body}${anchored ? "$" : ""}`).test(path);
}

/** Can this bot fetch `path`? Uses the bot's own group, else "*". Longest matching rule wins; ties go to allow. */
export function robotsAllows(groups: Group[], token: string, path = "/"): { allowed: boolean; rule?: string } {
  const t = token.toLowerCase();
  let rules = groups.filter((g) => g.agents.includes(t)).flatMap((g) => g.rules);
  let scope = token;
  if (!groups.some((g) => g.agents.includes(t))) {
    rules = groups.filter((g) => g.agents.includes("*")).flatMap((g) => g.rules);
    scope = "*";
  }
  let best: Rule | null = null;
  for (const r of rules) {
    if (!patternMatches(r.path, path)) continue;
    if (!best || r.path.length > best.path.length || (r.path.length === best.path.length && r.allow)) best = r;
  }
  if (!best) return { allowed: true };
  return { allowed: best.allow, rule: `User-agent: ${scope} → ${best.allow ? "Allow" : "Disallow"}: ${best.path}` };
}

const BLOCK_STATUSES = new Set([401, 403, 406, 429, 503]);

/** robots.txt rules for every AI bot, plus a firewall test that loads the home page as a few of them. */
export async function checkCrawlers(website: string | undefined): Promise<CrawlerCheck> {
  if (!website) return { state: "none" };
  try {
    const home = await safeFetch(/^https?:\/\//i.test(website) ? website : `https://${website}`, { timeoutMs: 8000, maxBytes: 200_000 });
    const origin = new URL(home.url).origin;

    let robotsBody = "";
    let robotsFound = false;
    try {
      const r = await safeFetch(`${origin}/robots.txt`, { timeoutMs: 6000, maxBytes: 500_000 });
      if (r.status === 200 && !/<html/i.test(r.body.slice(0, 500))) {
        robotsBody = r.body;
        robotsFound = true;
      }
    } catch {
      // No robots.txt means everything is allowed.
    }
    const groups = parseRobots(robotsBody);

    const bots = await Promise.all(
      AI_BOTS.map(async (b): Promise<BotResult> => {
        // Check the home page and a typical inner page: "Allow: /$" + "Disallow: /" lets in only the home page.
        const root = robotsAllows(groups, b.token, "/");
        const inner = robotsAllows(groups, b.token, "/services");
        const { allowed, rule } = !root.allowed ? root : !inner.allowed ? inner : root;
        const result: BotResult = { token: b.token, owner: b.owner, product: b.product, purpose: b.purpose, allowed, rule };
        if (b.ua && home.status < 400) {
          try {
            const r = await safeFetch(home.url, { timeoutMs: 8000, maxBytes: 50_000, userAgent: b.ua });
            result.firewall = { status: r.status, blocked: BLOCK_STATUSES.has(r.status) };
          } catch {
            result.firewall = { status: null, blocked: false };
          }
        }
        return result;
      }),
    );
    return { state: "ok", origin, robotsFound, baselineStatus: home.status, bots };
  } catch (e) {
    return { state: "error", error: errorMessage(e) };
  }
}
