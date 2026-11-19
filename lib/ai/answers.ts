/** Reads an AI answer: is the business mentioned, at what position, and who else is recommended. */

const STOP = new Set(["the", "and", "pvt", "ltd", "private", "limited", "llp", "inc", "co", "company", "&"]);

export function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9ऀ-ॿ]+/g, " ")
    .split(" ")
    .filter((w) => w && !STOP.has(w))
    .join(" ");
}

/** "Clove Dental - Malviya Nagar | Best Dentist" → ["clove dental malviya nagar best dentist", "clove dental"]. */
function nameVariants(name: string) {
  const short = name.split(/\s[-–—|]\s|\||,|\(/)[0];
  return [...new Set([normalize(name), normalize(short)])].filter((n) => n.length >= 3 && (n.includes(" ") || n.length >= 5));
}

/** True when the business name (ignoring "Pvt Ltd", branch suffixes, punctuation and case) appears in the text. */
export function mentions(text: string, name: string) {
  const t = ` ${normalize(text)} `;
  return nameVariants(name).some((n) => t.includes(` ${n} `));
}

/** A list item like "Clove Dental" refers to "Clove Dental - Malviya Nagar" (needs 2+ words to avoid generic hits). */
function itemIsBusiness(item: string, name: string) {
  if (mentions(item, name)) return true;
  const i = normalize(item);
  return i.includes(" ") && i.length >= 8 && ` ${normalize(name)} `.includes(` ${i} `);
}

/** Business names from the numbered or bulleted list in an answer. */
export function listItems(text: string): string[] {
  const items: string[] = [];
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^\s*(?:\d+[.)]|[-*•])\s+(.+)$/);
    if (!m) continue;
    const body = m[1];
    const bold = body.match(/\*\*(.+?)\*\*/)?.[1];
    const name = (bold ?? body.split(/\s[-–—:]\s|:\s|\s\(/)[0]).replace(/[*_`]/g, "").trim();
    if (/[a-zऀ-ॿ]/i.test(name) && name.length <= 80) items.push(name);
  }
  return items;
}

/** The AI saying it does not know the business. Anchored to first-person / "no information" phrasing so praise like "you will not find a better clinic" does not match. */
const UNKNOWN =
  /\b(i|we)\s+(couldn'?t|could not|was unable to|am unable to|wasn'?t able to|can'?t|cannot)\s+(find|locate|verify)\b|\b(i|we)\s+(don'?t|do not)\s+have\s+(any |specific |enough |much |detailed )?(information|details|data)\b|\b(there is|there's|i found)\s+(no|limited|little)\s+(specific |reliable |verified |public )?(information|details|data)\b|\bno (specific |reliable |verified |public )?(information|details|data) (is |was )?(available|found)\b/i;

export function analyzeAnswer(text: string, name: string, kind: "discovery" | "brand") {
  const items = listItems(text);
  const idx = items.findIndex((i) => itemIsBusiness(i, name));
  const mentioned = idx >= 0 || mentions(text, name);
  return {
    mentioned: kind === "brand" ? mentioned && !UNKNOWN.test(text) : mentioned,
    position: idx >= 0 ? idx + 1 : null,
    recommended: items.flatMap((n, i) => (itemIsBusiness(n, name) ? [] : [{ name: n, position: i + 1 }])),
  };
}
