import type { MetadataRoute } from "next";
import { projects } from "@/lib/content";
import { services } from "@/lib/content";
import { getAllPosts } from "@/lib/blog";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  // Bump this when page content changes. Blog posts use their own date.
  const SITE_UPDATED = "2026-11-18";
  const pages = [
    "",
    "/services",
    "/about",
    "/journey",
    "/check",
    "/pricing",
    "/blog",
    // /work stays out of the sitemap (and is noindex) until there are real projects to show.
    ...(projects.length ? ["/work"] : []),
    "/contact",
    "/faq",
    "/privacy",
    "/terms",
    ...services.map((s) => `/services/${s.slug}`),
  ];
  return [
    ...pages.map((p) => ({ url: `${site.url}${p}`, lastModified: SITE_UPDATED, changeFrequency: "monthly" as const, priority: p === "" ? 1 : 0.7 })),
    ...getAllPosts().map((p) => ({ url: `${site.url}/blog/${p.slug}`, lastModified: p.date, changeFrequency: "yearly" as const, priority: 0.6 })),
  ];
}
