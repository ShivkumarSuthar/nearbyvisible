"use client";

import { useState } from "react";
import Link from "next/link";
import { site } from "@/lib/site";

const AUDIT_PILLARS = [
  {
    points: "30 Points",
    title: "Google Maps & Profile",
    badge: "Local Presence",
    desc: "Evaluates how visible and complete your Google Business Profile is when local customers search nearby.",
    checks: [
      "Operational status & business verification",
      "Correct primary & secondary business categories",
      "Verified address & Google Maps pin accuracy",
      "Working direct phone number with click-to-call",
      "Regular operating hours & special holiday hours",
      "High-resolution photo gallery (10+ image sample)",
      "Official website link verification on Maps profile",
    ],
  },
  {
    points: "25 Points",
    title: "Core Web Vitals & Speed",
    badge: "Speed & Performance",
    desc: "Runs official Google PageSpeed mobile diagnostics to test your real user speed on smartphones.",
    checks: [
      "Largest Contentful Paint (LCP < 2.5s benchmark)",
      "Cumulative Layout Shift (CLS visual stability < 0.1)",
      "First Contentful Paint (FCP initial load speed)",
      "Total Blocking Time (TBT JavaScript interactivity)",
      "Mobile responsive viewport & touch-target spacing",
      "Image optimization & modern next-gen WebP formats",
      "Script minification & render-blocking resource audit",
    ],
  },
  {
    points: "25 Points",
    title: "Technical SEO & Schema",
    badge: "Search Readiness",
    desc: "Scans your website HTML code to ensure Google's crawlers can index and rank your pages effortlessly.",
    checks: [
      "Title tag length, branding & primary keyword focus",
      "Meta description presence & click-through rate strength",
      "H1 heading structure & semantic page hierarchy",
      "Schema.org LocalBusiness JSON-LD structured data",
      "Robots.txt crawl access & blocking rule tests",
      "XML Sitemap detection & indexation accessibility",
      "Canonical URL integrity & Noindex leak detection",
      "Broken link crawler (detects internal 404 dead links)",
    ],
  },
  {
    points: "25 Points",
    title: "Competitor Rank & Search",
    badge: "Market Position",
    desc: "Simulates live customer searches in your city to benchmark your rank against top 20 local competitors.",
    checks: [
      "Live search position for '[Category] in [City]'",
      "Local 3-Pack appearance vs top nearby rivals",
      "Brand name discovery rank (Position #1 check)",
      "Market share gap analysis & competitor review comparison",
    ],
  },
  {
    points: "20 Points",
    title: "Local SEO & Citations",
    badge: "Local Authority",
    desc: "Ensures your business name, address, and phone number (NAP) are identical and trusted across the web.",
    checks: [
      "NAP consistency across website and Google profile",
      "Local city and neighborhood keyword presence",
      "Embedded Google Maps directions link for walk-ins",
      "Local business schema structured address validation",
    ],
  },
  {
    points: "20 Points",
    title: "Reviews, Reputation & Trust",
    badge: "Customer Trust",
    desc: "Measures whether your review profile inspires enough confidence for a customer to call you first.",
    checks: [
      "Average star rating benchmark (4.5+ star goal)",
      "Total review volume compared to market competitors",
      "Review freshness (reviews received in last 30–90 days)",
      "Owner response consistency & sentiment health",
    ],
  },
  {
    points: "15 Points",
    title: "Social Media Presence",
    badge: "Brand Verification",
    desc: "Verifies whether your website connects to active social channels to build brand credibility.",
    checks: [
      "Active links to verified social profiles (Instagram, Facebook, YouTube)",
      "Social preview OpenGraph metadata tags validation",
      "Cross-platform identity consistency for search engines",
    ],
  },
  {
    points: "20 Points",
    title: "Lead Capture & Conversion",
    badge: "Inbound Inquiries",
    desc: "Checks if visitors can easily contact, call, message, or visit your business without friction.",
    checks: [
      "Click-to-call mobile 'tel:' link functioning",
      "Direct WhatsApp chat link & instant pre-fill message",
      "Lead contact form presence & input field readiness",
      "Clear above-the-fold call-to-action (CTA) buttons",
    ],
  },
];

const SCORING_RULES = [
  {
    status: "Pass (100% Points)",
    color: "bg-emerald-500",
    text: "Your business meets or exceeds Google best practices and industry benchmarks.",
  },
  {
    status: "Warning (50% Points)",
    color: "bg-amber-400",
    text: "Partially configured or suboptimal. Competitors with better setups may outrank you.",
  },
  {
    status: "Fail (0% Points)",
    color: "bg-rose-500",
    text: "Missing or broken. This directly hurts your visibility and causes you to lose calls.",
  },
  {
    status: "Not Tested (Neutral)",
    color: "bg-gray-400",
    text: "Data was not publicly available. This does NOT lower or penalize your final score.",
  },
];

const TOOL_FAQS = [
  {
    q: "Is this 180-point audit truly 100% free?",
    a: "Yes, completely free. There is no credit card required, no trial period, and no account creation necessary. You get an instant report on your screen in about 30 seconds.",
  },
  {
    q: "Do I need to provide passwords or Google login details?",
    a: "Never. We only inspect publicly available signals — exactly what Google's search crawlers and real customers see when searching for your business online.",
  },
  {
    q: "How is the data collected?",
    a: "The tool connects live to the official Google Places API, runs Google's official Lighthouse engine for Core Web Vitals, and parses your website HTML in real-time.",
  },
  {
    q: "Can I check my competitors' score?",
    a: "Yes! You can enter any business name and city to see how your competitors are performing, where they are weak, and where you can overtake them.",
  },
  {
    q: "What should I do after getting my score?",
    a: "You can download your report as a PDF, or tap 'Send on WhatsApp' to connect with our growth team. We will review your failed tests with you and provide an itemized action plan to fix them.",
  },
];

export function ToolDetails() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <section className="mt-16 flex flex-col gap-24 border-t border-gray-200 pt-20">
      {/* 1. Architecture Overview */}
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-3 text-center md:items-center">
          <span className="inline-flex items-center gap-2 self-center rounded-full bg-brand-tint px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-brand-dark">
            <span className="size-2 rounded-full bg-brand animate-pulse" />
            Tool Specifications
          </span>
          <h2 className="font-display text-[clamp(28px,3.8vw,44px)] font-bold leading-tight text-ink">
            What does the 180-point audit test?
          </h2>
          <p className="max-w-[680px] text-base leading-relaxed text-gray-600 sm:text-lg">
            Our audit runs across 8 balanced digital pillars to give you an unbiased, measured evaluation of your entire online footprint.
          </p>
        </div>

        {/* Pillars Grid: Even 2x4 (or 4x2 on large screens) - perfectly balanced */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {AUDIT_PILLARS.map((pillar) => (
            <div
              key={pillar.title}
              className="flex flex-col justify-between rounded-[28px] border border-gray-200 bg-white p-7 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.04)] transition-all hover:-translate-y-1 hover:border-brand/50 hover:shadow-lg sm:p-8"
            >
              <div>
                <div className="flex items-center justify-between gap-3 border-b border-gray-100 pb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-dark">
                    {pillar.badge}
                  </span>
                  <span className="rounded-full bg-ink px-3 py-1 text-xs font-bold text-brand">
                    {pillar.points}
                  </span>
                </div>

                <h3 className="mt-4 font-display text-xl font-bold text-ink sm:text-2xl">
                  {pillar.title}
                </h3>
                <p className="mt-1.5 text-sm text-gray-600">
                  {pillar.desc}
                </p>

                {/* Sub-check list */}
                <ul className="mt-5 flex flex-col gap-2 text-[13px] text-gray-700 sm:text-[14px]">
                  {pillar.checks.map((check) => (
                    <li key={check} className="flex items-start gap-2.5">
                      <span className="mt-1 text-brand font-bold">✓</span>
                      <span>{check}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Full-Width Infrastructure Card */}
        <div className="flex flex-col justify-between rounded-[28px] border border-line-dark bg-ink p-7 text-white shadow-xl sm:p-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand">
              Enterprise Infrastructure
            </span>
            <h3 className="mt-3 font-display text-2xl font-bold sm:text-3xl">
              Powered by Official Google APIs & Industry-Standard Diagnostics
            </h3>
            <p className="mt-2 max-w-[720px] text-sm text-muted-dark sm:text-base">
              We don&apos;t use simulated or mock numbers. Every audit makes real-time requests to Google&apos;s Places and PageSpeed servers, providing the exact same diagnostic data used by world-class digital agencies.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 border-t border-line-dark pt-6 sm:grid-cols-4">
            <div>
              <p className="font-display text-lg font-bold text-white">Google Places</p>
              <p className="text-xs text-muted-dark">Live Places API v1</p>
            </div>
            <div>
              <p className="font-display text-lg font-bold text-white">Lighthouse v12</p>
              <p className="text-xs text-muted-dark">Mobile Web Vitals</p>
            </div>
            <div>
              <p className="font-display text-lg font-bold text-white">Top 20 Radar</p>
              <p className="text-xs text-muted-dark">Local Competitor Scan</p>
            </div>
            <div>
              <p className="font-display text-lg font-bold text-white">100% Privacy</p>
              <p className="text-xs text-muted-dark">Zero Stored Credentials</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. How Scoring Works: Even 4-Columns */}
      <div className="rounded-[32px] border border-gray-200 bg-white p-8 shadow-sm sm:p-12">
        <div className="max-w-[700px]">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-dark">
            Transparent Algorithm
          </span>
          <h3 className="mt-2 font-display text-2xl font-bold text-ink sm:text-3xl">
            How the 0–100 score is calculated
          </h3>
          <p className="mt-2 text-sm text-gray-600 sm:text-base">
            Each of the 8 pillars carries a weighted percentage contributing to the overall 100-point total. Points are awarded based on objective measurement:
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SCORING_RULES.map((rule) => (
            <div key={rule.status} className="flex flex-col gap-2 rounded-2xl bg-mist p-5">
              <div className="flex items-center gap-2">
                <span className={`size-3 rounded-full ${rule.color}`} />
                <h4 className="font-display text-sm font-bold text-ink">{rule.status}</h4>
              </div>
              <p className="text-xs leading-relaxed text-gray-600">{rule.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Tool FAQs */}
      <div className="flex flex-col gap-8">
        <div className="text-center">
          <h3 className="font-display text-2xl font-bold text-ink sm:text-3xl">
            Frequently Asked Questions
          </h3>
          <p className="mt-1 text-sm text-gray-600 sm:text-base">
            Everything you need to know about our free 180-point audit tool.
          </p>
        </div>

        <div className="mx-auto flex w-full max-w-[840px] flex-col gap-3">
          {TOOL_FAQS.map((faq, i) => {
            const isOpen = openFaq === i;
            return (
              <div
                key={faq.q}
                className={`rounded-[22px] border transition-colors ${
                  isOpen
                    ? "border-brand/50 bg-brand-wash/60"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full cursor-pointer items-center justify-between gap-6 px-6 py-5 text-left"
                >
                  <span className="font-display text-[17px] font-semibold text-ink sm:text-[18px]">
                    {faq.q}
                  </span>
                  <span
                    className={`flex size-8 flex-none items-center justify-center rounded-full text-ink transition-transform ${
                      isOpen ? "rotate-45 bg-brand" : "bg-mist"
                    }`}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    >
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </span>
                </button>
                {isOpen && (
                  <p className="px-6 pb-6 text-[15px] leading-relaxed text-gray-700">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* WhatsApp Help Band */}
        <div className="mx-auto mt-6 flex max-w-[700px] flex-col items-center justify-between gap-4 rounded-3xl bg-ink p-6 text-center text-white sm:flex-row sm:text-left sm:p-8">
          <div>
            <p className="font-display text-lg font-bold">Need a manual in-depth review?</p>
            <p className="text-xs text-muted-dark sm:text-sm">Talk directly to our SEO and Google Maps specialists on WhatsApp.</p>
          </div>
          <a
            href={site.whatsapp}
            className="whitespace-nowrap rounded-full bg-brand px-6 py-3 text-sm font-semibold text-ink transition-transform hover:-translate-y-0.5"
          >
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
