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
  // Standard security headers on every response. HSTS is added by Vercel for HTTPS.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Nobody may show this site inside a frame (stops clickjacking). Both forms for old and new browsers.
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // The site never uses these device features.
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
