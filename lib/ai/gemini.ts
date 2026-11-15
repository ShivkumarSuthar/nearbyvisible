import { withTimeout } from "@/lib/audit/http";
import type { Source } from "./types";

/** Free key from https://aistudio.google.com/apikey. The "latest" alias keeps working when Google renames models. */
export const geminiModel = () => process.env.GEMINI_MODEL || "gemini-flash-latest";
export const geminiConfigured = () => Boolean(process.env.GEMINI_API_KEY);

export class QuotaError extends Error {}

type Raw = {
  candidates?: {
    content?: { parts?: { text?: string }[] };
    groundingMetadata?: { webSearchQueries?: string[]; groundingChunks?: { web?: { uri?: string; title?: string } }[] };
  }[];
  error?: { message?: string };
};

const SYSTEM = [
  "You are an assistant helping a customer choose a local business.",
  "Search the web before answering.",
  "When you recommend businesses, write them as a numbered list. Start each item with the business name in bold, like: 1. **Business Name** - short reason.",
  "Keep the answer under 180 words.",
].join(" ");

/** One grounded Gemini answer: the text, the websites it used as sources and the searches it ran. */
export async function askGemini(prompt: string): Promise<{ text: string; sources: Source[]; queries: string[] }> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY is not set");
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(geminiModel())}:generateContent`;

  const data = await withTimeout(async (signal) => {
    const res = await fetch(url, {
      method: "POST",
      signal,
      headers: { "content-type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM }] },
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        tools: [{ googleSearch: {} }],
        generationConfig: { temperature: 0.4, maxOutputTokens: 1024 },
      }),
    });
    const json = (await res.json().catch(() => ({}))) as Raw;
    if (res.status === 429) throw new QuotaError("The free AI quota is used up for now. Try again later.");
    if (!res.ok) throw new Error(`Gemini error ${res.status}: ${(json.error?.message ?? "").slice(0, 200)}`);
    return json;
  }, 40_000);

  const c = data.candidates?.[0];
  const text = (c?.content?.parts ?? []).map((p) => p.text ?? "").join("").trim();
  const seen = new Set<string>();
  const sources: Source[] = [];
  for (const chunk of c?.groundingMetadata?.groundingChunks ?? []) {
    const domain = (chunk.web?.title ?? "").toLowerCase().replace(/^www\./, "");
    if (!domain || seen.has(domain)) continue;
    seen.add(domain);
    sources.push({ domain, uri: chunk.web?.uri ?? "" });
  }
  return { text, sources, queries: c?.groundingMetadata?.webSearchQueries ?? [] };
}
