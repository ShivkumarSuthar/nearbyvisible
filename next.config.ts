import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Blog posts are read from disk at request time, so ship them with the server functions.
  outputFileTracingIncludes: {
    "/blog": ["./content/blog/**/*"],
    "/blog/[slug]": ["./content/blog/**/*"],
    "/blog/[slug]/opengraph-image": ["./content/blog/**/*", "./lib/fonts/**/*"],
    "/opengraph-image": ["./lib/fonts/**/*"],
    "/twitter-image": ["./lib/fonts/**/*"],
    "/sitemap.xml": ["./content/blog/**/*"],
  },
};

export default nextConfig;
