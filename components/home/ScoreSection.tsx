"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Reveal } from "@/components/ui/Reveal";

const PILLARS = [
  {
    points: "30 Points",
    category: "Google Maps & Profile",
    desc: "Google Business verification, accurate map pin, primary & secondary categories, and operating hours.",
    icon: (
      <svg viewBox="0 0 24 24" className="size-5 text-brand" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    points: "25 Points",
    category: "Core Web Vitals & Speed",
    desc: "Official Google Lighthouse speed test: LCP load time, mobile layout shifts (CLS), and touch responsiveness.",
    icon: (
      <svg viewBox="0 0 24 24" className="size-5 text-brand" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    points: "25 Points",
    category: "Technical SEO & Schema",
    desc: "Title tags, meta descriptions, H1 hierarchy, robots.txt, XML sitemap, and Schema.org LocalBusiness data.",
    icon: (
      <svg viewBox="0 0 24 24" className="size-5 text-brand" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    points: "25 Points",
    category: "Search & Competitor Rank",
    desc: "Live rank check against top 20 local competitors in your city for your exact category and service keyword.",
    icon: (
      <svg viewBox="0 0 24 24" className="size-5 text-brand" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
    ),
  },
  {
    points: "20 Points",
    category: "Local SEO & Citations",
    desc: "Name, address, and phone (NAP) consistency across your website, Google Maps, and local directory listings.",
    icon: (
      <svg viewBox="0 0 24 24" className="size-5 text-brand" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    points: "20 Points",
    category: "Reviews & Reputation",
    desc: "Star rating average (4.5+ benchmark), total review volume vs competitors, and freshness of recent feedback.",
    icon: (
      <svg viewBox="0 0 24 24" className="size-5 text-brand" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    points: "15 Points",
    category: "Social Media Presence",
    desc: "Active social links (Instagram, Facebook, LinkedIn, YouTube) connected to your site and verified for trust.",
    icon: (
      <svg viewBox="0 0 24 24" className="size-5 text-brand" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    points: "20 Points",
    category: "Lead Capture & Calls",
    desc: "Direct click-to-call mobile links, WhatsApp instant chat buttons, and functional above-the-fold contact forms.",
    icon: (
      <svg viewBox="0 0 24 24" className="size-5 text-brand" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
  },
];

export function ScoreSection() {
  const router = useRouter();
  const [businessName, setBusinessName] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (businessName.trim()) {
      router.push(`/check?name=${encodeURIComponent(businessName.trim())}`);
    } else {
      router.push("/check");
    }
  }

  return (
    <section id="score-audit" className="relative overflow-hidden bg-mist py-28 md:py-32">
      <div className="mx-auto flex max-w-[1240px] flex-col gap-16 px-6">
        {/* Section Header */}
        <Reveal className="flex flex-col gap-4 text-center md:items-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand-tint px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-brand-dark">
            <span className="size-2 rounded-full bg-brand animate-pulse" />
            180-Point Digital Visibility Audit
          </div>
          <h2 className="max-w-[860px] font-display text-[clamp(34px,4.5vw,56px)] font-bold leading-[1.08] tracking-[-1.2px]">
            Where does your business stand?{" "}
            <span className="text-brand-dark">Scan 180+ checkpoints.</span>
          </h2>
          <p className="max-w-[680px] text-[18px] leading-relaxed text-gray-700">
            Most owners only find out they are invisible when customers say &ldquo;I couldn&rsquo;t find you on Google.&rdquo;
            We run real tests using official <strong>Google Places</strong> and <strong>Google Lighthouse</strong> engines to audit your business across 180 digital checkpoints — free, in 30 seconds.
          </p>
        </Reveal>

        {/* Perfectly Balanced 8-Pillars Grid (4x2 on desktop, 2x4 on tablet) */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p, i) => (
            <Reveal key={p.category} delay={i * 0.04} className="h-full">
              <div className="flex h-full flex-col justify-between rounded-[24px] border border-gray-200/90 bg-white p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] transition-all hover:-translate-y-1 hover:border-brand/50 hover:shadow-lg">
                <div>
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3.5">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-brand-tint/70">
                      {p.icon}
                    </div>
                    <span className="rounded-full bg-ink px-2.5 py-0.5 text-xs font-bold text-brand">
                      {p.points}
                    </span>
                  </div>
                  <h3 className="mt-3.5 font-display text-[17px] font-semibold text-ink">
                    {p.category}
                  </h3>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-gray-600">
                    {p.desc}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Full-Width Trust Guarantee Banner */}
        <Reveal delay={0.2} className="w-full">
          <div className="flex flex-col justify-between gap-6 rounded-[28px] border border-line-dark bg-ink p-7 text-white shadow-xl sm:p-9 lg:flex-row lg:items-center">
            <div className="max-w-[680px]">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-brand" />
                <span className="text-xs font-bold uppercase tracking-wider text-muted-dark">
                  Official Verification Guarantee · 180 Total Points
                </span>
              </div>
              <h4 className="mt-2 font-display text-2xl font-bold sm:text-3xl">
                100% Real Measured Data. Zero Fake Numbers.
              </h4>
              <p className="mt-2 text-sm text-muted-dark sm:text-base">
                Every check is evaluated with live public records and Google APIs. You get a score out of 100 with clear proof, pass/fail indicators, and an itemized fix plan.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-line-dark pt-5 sm:grid-cols-3 sm:gap-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
              <div>
                <p className="font-display text-base font-bold text-white sm:text-lg">Google Places</p>
                <p className="text-xs text-muted-dark">Live API v1</p>
              </div>
              <div>
                <p className="font-display text-base font-bold text-white sm:text-lg">Lighthouse v12</p>
                <p className="text-xs text-muted-dark">Mobile Speed</p>
              </div>
              <div>
                <p className="font-display text-base font-bold text-white sm:text-lg">Competitor Scan</p>
                <p className="text-xs text-muted-dark">Top 20 Radar</p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Lead Capture Box */}
        <Reveal delay={0.25} className="mx-auto w-full max-w-[880px]">
          <div className="rounded-[32px] border-2 border-brand/20 bg-white p-7 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.12)] sm:p-10">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-display text-2xl font-bold text-ink sm:text-3xl">
                  Run your free 180-Point Audit now
                </h3>
                <p className="mt-1 text-sm text-gray-600 sm:text-base">
                  Type your business name to see what Google and customers see.
                </p>
              </div>
              <span className="self-start rounded-full bg-brand-tint px-3.5 py-1.5 text-xs font-bold text-brand-dark sm:self-center">
                Instant ~30 Seconds
              </span>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Enter business name (e.g. Ramesh Plumbing, Jaipur)..."
                  className="w-full rounded-full border border-gray-300 bg-gray-50 px-6 py-4 text-[16px] text-ink outline-none transition-all focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/10"
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-8 py-4 text-[16px] font-semibold text-ink shadow-[0_8px_24px_-6px_rgba(34,197,94,0.6)] transition-transform hover:-translate-y-0.5 active:translate-y-0"
              >
                Scan My Business →
              </button>
            </form>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 pt-5 text-xs text-gray-600 sm:text-sm">
              <span className="flex items-center gap-1.5 font-medium text-gray-800">
                <svg viewBox="0 0 20 20" fill="currentColor" className="size-4 text-brand">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                </svg>
                100% Free Audit
              </span>
              <span className="flex items-center gap-1.5 font-medium text-gray-800">
                <svg viewBox="0 0 20 20" fill="currentColor" className="size-4 text-brand">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                </svg>
                No Password / No Card
              </span>
              <span className="flex items-center gap-1.5 font-medium text-gray-800">
                <svg viewBox="0 0 20 20" fill="currentColor" className="size-4 text-brand">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                </svg>
                Detailed Fix Report
              </span>
              <Link
                href="/check"
                className="font-semibold text-brand-dark underline-offset-4 hover:underline"
              >
                Or open dedicated checker →
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
