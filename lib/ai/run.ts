import { errorMessage } from "@/lib/audit/http";
import { analyzeAnswer } from "./answers";
import { checkCrawlers } from "./crawlers";
import { askGemini, geminiConfigured, geminiModel } from "./gemini";
import { checkLlms } from "./llms";
import type { AiInput, AiReport, AnswerResult, CrawlerCheck, LlmsCheck, Suggestion } from "./types";

/** Questions a real customer would ask an AI assistant. Two to find a business, one about this business. */
export function buildPrompts(i: AiInput) {
  return [
    { kind: "discovery" as const, prompt: `What are the best ${i.category} options in ${i.city}? Recommend a few.` },
    { kind: "discovery" as const, prompt: `I need a trusted ${i.category} in ${i.city} with good reviews. Who should I contact?` },
    { kind: "brand" as const, prompt: `What do you know about ${i.name} in ${i.city}? Is it a good ${i.category}?` },
  ];
}

async function runAnswers(input: AiInput): Promise<AiReport["answers"]> {
  if (!geminiConfigured()) return { ok: false, error: "AI answer check is not switched on yet (GEMINI_API_KEY is missing)." };
  const settled = await Promise.allSettled(
    buildPrompts(input).map(async ({ kind, prompt }): Promise<AnswerResult> => {
      const a = await askGemini(prompt);
      return { kind, prompt, text: a.text, sources: a.sources, queries: a.queries, ...analyzeAnswer(a.text, input.name, kind) };
    }),
  );
  const items = settled.flatMap((s) => (s.status === "fulfilled" ? [s.value] : []));
  if (!items.length) {
    const first = settled.find((s): s is PromiseRejectedResult => s.status === "rejected");
    return { ok: false, error: first ? errorMessage(first.reason) : "No AI answers" };
  }
  return { ok: true, items };
}

const hostOf = (w?: string) => {
  if (!w) return "";
  try {
    return new URL(/^https?:\/\//i.test(w) ? w : `https://${w}`).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
};

export async function runAiCheck(input: AiInput): Promise<AiReport> {
  const [answers, crawlers, llms] = await Promise.all([runAnswers(input), checkCrawlers(input.website), checkLlms(input)]);
  const items = answers.ok ? answers.items : [];
  const discovery = items.filter((a) => a.kind === "discovery");
  const brand = items.find((a) => a.kind === "brand");
  const positions = discovery.map((a) => a.position).filter((p): p is number => p !== null);

  const comp = new Map<string, { name: string; count: number; bestPosition: number }>();
  for (const a of discovery) {
    for (const { name, position } of a.recommended) {
      const k = name.toLowerCase();
      const prev = comp.get(k);
      comp.set(k, prev ? { ...prev, count: prev.count + 1, bestPosition: Math.min(prev.bestPosition, position) } : { name, count: 1, bestPosition: position });
    }
  }

  const own = hostOf(input.website);
  const src = new Map<string, number>();
  for (const a of items) for (const s of a.sources) src.set(s.domain, (src.get(s.domain) ?? 0) + 1);
  const sources = [...src.entries()]
    .map(([domain, count]) => ({ domain, count, own: Boolean(own) && (domain === own || domain.endsWith(`.${own}`)) }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const report: Omit<AiReport, "suggestions"> = {
    engine: answers.ok ? `Gemini with Google Search (${geminiModel()})` : null,
    answers,
    summary: {
      discoveryMentioned: discovery.filter((a) => a.mentioned).length,
      discoveryTotal: discovery.length,
      bestPosition: positions.length ? Math.min(...positions) : null,
      brandKnown: brand ? brand.mentioned : null,
    },
    competitors: [...comp.values()].sort((a, b) => b.count - a.count || a.bestPosition - b.bestPosition).slice(0, 6),
    sources,
    crawlers,
    llms,
    checkedAt: new Date().toISOString(),
  };
  return { ...report, suggestions: suggest(input, report, crawlers, llms) };
}

/** Plain-language next steps, built from the measured results. No extra AI calls. */
function suggest(input: AiInput, r: Omit<AiReport, "suggestions">, crawlers: CrawlerCheck, llms: LlmsCheck): Suggestion[] {
  const out: Suggestion[] = [];
  const items = r.answers.ok ? r.answers.items : [];

  if (crawlers.state === "ok") {
    const blockedSearch = crawlers.bots.filter((b) => b.purpose !== "training" && !b.allowed);
    const firewall = crawlers.bots.filter((b) => b.firewall?.blocked);
    if (blockedSearch.length)
      out.push({
        priority: "high",
        title: "Unblock AI search crawlers in robots.txt",
        detail: `${blockedSearch.map((b) => b.token).join(", ")} cannot read your site, so ${blockedSearch.map((b) => b.product).join("; ")} cannot quote or recommend it. Remove the Disallow rule for these bots.`,
      });
    if (firewall.length)
      out.push({
        priority: "high",
        title: "Check your firewall or hosting bot protection",
        detail: `Your site refused requests that identified as ${firewall.map((b) => b.token).join(", ")}. If you use Cloudflare or similar "block AI bots" settings, allow the search bots (OAI-SearchBot, PerplexityBot) at least.`,
      });
  }
  if (crawlers.state === "none")
    out.push({
      priority: "high",
      title: "Get a website",
      detail: "AI assistants trust businesses they can read about. A simple site with your services, area, prices and FAQs gives them something to quote.",
    });

  if (r.summary.discoveryTotal && r.summary.discoveryMentioned === 0)
    out.push({
      priority: "high",
      title: `Build a page for "${input.category} in ${input.city}"`,
      detail: `AI did not recommend you when asked for a ${input.category} in ${input.city}. Create a page that clearly says what you do, where, for whom, your prices and real reviews, so search and AI can match you to these questions.`,
    });
  else if (r.summary.bestPosition && r.summary.bestPosition > 3)
    out.push({
      priority: "medium",
      title: "Move up the AI shortlist",
      detail: `You appear at position ${r.summary.bestPosition}. More recent Google reviews that mention your service and area, and more listings on the sites AI cites, usually help.`,
    });

  if (r.summary.brandKnown === false)
    out.push({
      priority: "high",
      title: "Teach AI who you are",
      detail: "When asked about your business by name, AI could not describe it. Keep the same name, address and phone everywhere (Google profile, website, Justdial, Facebook) and add an About page with facts: founded year, services, team, area served.",
    });

  const thirdParty = r.sources.filter((s) => !s.own).slice(0, 4);
  if (thirdParty.length)
    out.push({
      priority: "medium",
      title: "Be listed where AI looks",
      detail: `AI used these websites as sources: ${thirdParty.map((s) => s.domain).join(", ")}. Make sure you have a complete, up-to-date listing or mention on each.`,
    });

  if (r.competitors.length && r.summary.discoveryMentioned < r.summary.discoveryTotal)
    out.push({
      priority: "medium",
      title: "Study who AI recommends instead",
      detail: `${r.competitors.slice(0, 3).map((c) => c.name).join(", ")} were recommended. Compare their reviews, photos and website pages with yours and close the gaps.`,
    });

  const queries = [...new Set(items.flatMap((a) => a.queries))].slice(0, 5);
  if (queries.length)
    out.push({
      priority: "medium",
      title: "Answer the questions AI searched for",
      detail: `Before answering, AI searched Google for: ${queries.map((q) => `"${q}"`).join(", ")}. Add FAQ answers and page sections that match these searches.`,
    });

  if (!llms.found)
    out.push({
      priority: "low",
      title: "Add an llms.txt file",
      detail: "A short plain-text summary of your business at yoursite.com/llms.txt. It is a new standard and not yet used by every AI tool, but it is free and takes five minutes. A draft is ready below.",
    });

  out.push({
    priority: "low",
    title: "Add FAQ and LocalBusiness schema",
    detail: "Structured data tells search engines and AI your name, address, hours, services and answers in a format they read reliably.",
  });

  const order = { high: 0, medium: 1, low: 2 };
  return out.sort((a, b) => order[a.priority] - order[b.priority]);
}
