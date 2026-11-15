import type { MetadataRoute } from "next";
import { services } from "@/lib/content";
import { getAllPosts } from "@/lib/blog";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/services", "/about", "/journey", "/check", "/pricing", "/blog", "/work", "/contact", "/faq", "/privacy", "/terms", ...services.map((s) => `/services/${s.slug}`), ...getAllPosts().map((p) => `/blog/${p.slug}`)];
  return paths.map((p) => ({ url: `${site.url}${p}`, lastModified: new Date(), changeFrequency: "monthly", priority: p === "" ? 1 : 0.7 }));
}
