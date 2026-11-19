import { TESTS } from "./tests";
import { CATEGORIES, type CategoryId } from "./types";

/** What the free check really tests, built from the test list itself so the marketing page can never drift from the code. */
export type Pillar = { id: CategoryId; title: string; weight: number; desc: string; checks: string[] };

const DESC: Record<CategoryId, string> = {
  search: "Where you appear when people search your name, and when they search your type of business in your city.",
  maps: "How complete and correct your Google Business Profile is.",
  website: "Whether your website opens, is secure, works on phones and loads fast (Google PageSpeed, mobile).",
  tech: "What Google needs to read and list your website: titles, headings, sitemap, robots.txt, structured data and links.",
  local: "Whether your website clearly says where you are and matches your Google profile.",
  social: "Social profiles linked from your website. We never guess accounts by name.",
  reputation: "Your Google rating, number of reviews and how recent they are.",
  leads: "How easily a visitor can call, WhatsApp or send you an enquiry.",
};

export function auditCatalog(): { pillars: Pillar[]; total: number } {
  const pillars = (Object.keys(CATEGORIES) as CategoryId[]).map((id) => ({
    id,
    title: CATEGORIES[id].name,
    weight: CATEGORIES[id].weight,
    desc: DESC[id],
    checks: TESTS.filter((t) => t.category === id).map((t) => t.name),
  }));
  return { pillars, total: TESTS.length };
}
