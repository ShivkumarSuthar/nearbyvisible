import fs from "node:fs";
import path from "node:path";
import { marked } from "marked";

/**
 * Blog posts live in content/blog/*.md. Each file starts with a small header:
 *
 * ---
 * title: How to get your business on Google Maps
 * description: One or two sentences for Google and the blog list.
 * date: 2026-11-14
 * category: Google
 * featured: true        (optional, shows the post large at the top)
 * ---
 *
 * The file name becomes the address: get-on-google-maps.md → /blog/get-on-google-maps
 */

const DIR = path.join(process.cwd(), "content", "blog");

export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  featured: boolean;
  readingMinutes: number;
};

export type Post = PostMeta & { html: string; headings: { id: string; text: string }[] };

function parse(file: string): { data: Record<string, string>; body: string } {
  const raw = fs.readFileSync(path.join(DIR, file), "utf8").replace(/\r\n/g, "\n");
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { data: {}, body: raw };
  const data: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const i = line.indexOf(":");
    if (i > 0) data[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^["']|["']$/g, "");
  }
  return { data, body: match[2] };
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

function meta(file: string, data: Record<string, string>, body: string): PostMeta {
  const words = body.split(/\s+/).filter(Boolean).length;
  return {
    slug: file.replace(/\.md$/, ""),
    title: data.title ?? file,
    description: data.description ?? "",
    date: data.date ?? "1970-01-01",
    category: data.category ?? "Guides",
    featured: data.featured === "true",
    readingMinutes: Math.max(1, Math.round(words / 220)),
  };
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(DIR)) return [];
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const { data, body } = parse(f);
      return meta(f, data, body);
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(slug: string): Post | null {
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  const file = `${slug}.md`;
  if (!fs.existsSync(path.join(DIR, file))) return null;
  const { data, body } = parse(file);

  const headings: Post["headings"] = [];
  const renderer = new marked.Renderer();
  renderer.heading = ({ tokens, depth }) => {
    const text = renderer.parser.parseInline(tokens);
    const id = slugify(text);
    if (depth === 2) headings.push({ id, text: text.replace(/<[^>]+>/g, "") });
    return `<h${depth} id="${id}">${text}</h${depth}>`;
  };
  // Raw HTML in a post is shown as text, never run: the page injects this HTML directly, so a script tag or
  // onerror attribute in a .md file (for example from a future CMS or guest author) must not execute.
  renderer.html = ({ text }) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const html = marked.parse(body, { renderer, async: false }) as string;
  return { ...meta(file, data, body), html, headings };
}

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
