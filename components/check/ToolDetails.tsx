"use client";

import { useState } from "react";
import Link from "next/link";
import { site } from "@/lib/site";
import type { Pillar } from "@/lib/audit/catalog";

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
    q: "Is the check really free?",
    a: "Yes, completely free. There is no credit card required, no trial period, and no account creation necessary. You get an instant report on your screen in about 30 seconds.",
  },
  {
    q: "Do I need to provide passwords or Google login details?",
    a: "Never. We only inspect publicly available signals — exactly what Google's search crawlers and real customers see when searching for your business online.",
  },
  {
    q: "How is the data collected?",
    a: "The tool asks Google's Places API for your public business profile, runs Google PageSpeed (Lighthouse) on your website for mobile, and reads your website's public pages. The AI part asks Google's Gemini the questions a customer would ask.",
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

export function ToolDetails({ pillars, total }: { pillars: Pillar[]; total: number }) {
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
          <h2 className="font-display text-[clamp(1.75rem,3.8vw,2.75rem)] font-bold leading-tight text-ink">
            What does the free check test?
          </h2>
          <p className="max-w-[42.5rem] text-base leading-relaxed text-gray-600 sm:text-lg">
            {total} checks in {pillars.length} areas, plus an AI visibility check. Every result shows what was measured and where the data came from.
          </p>
        </div>

        {/* Pillars Grid: Even 2x4 (or 4x2 on large screens) - perfectly balanced */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {pillars.map((pillar) => (
            <div
              key={pillar.id}
              className="flex flex-col justify-between rounded-[28px] border border-gray-200 bg-white p-7 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.04)] transition-all hover:-translate-y-1 hover:border-brand/50 hover:shadow-lg sm:p-8"
            >
              <div>
                <div className="flex items-center justify-between gap-3 border-b border-gray-100 pb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-dark">
                    {pillar.checks.length} {pillar.checks.length === 1 ? "check" : "checks"}
                  </span>
                  <span className="rounded-full bg-ink px-3 py-1 text-xs font-bold text-brand">
                    {pillar.weight}% of score
                  </span>
                </div>

                <h3 className="mt-4 font-display text-xl font-bold text-ink sm:text-2xl">
                  {pillar.title}
                </h3>
                <p className="mt-1.5 text-sm text-gray-600">
                  {pillar.desc}
                </p>

                {/* Sub-check list */}
                <ul className="mt-5 flex flex-col gap-2 text-[0.8125rem] text-gray-700 sm:text-[0.875rem]">
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
              Where the data comes from
            </span>
            <h3 className="mt-3 font-display text-2xl font-bold sm:text-3xl">
              Live public data, read at the moment you run the check
            </h3>
            <p className="mt-2 max-w-[45rem] text-sm text-muted-dark sm:text-base">
              Every check makes live requests to Google&apos;s Places and PageSpeed services and reads your website&apos;s public pages. If a source does not answer, that check is marked &ldquo;Not tested&rdquo; instead of being guessed.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 border-t border-line-dark pt-6 sm:grid-cols-4">
            <div>
              <p className="font-display text-lg font-bold text-white">Google Places</p>
              <p className="text-xs text-muted-dark">Live Places API v1</p>
            </div>
            <div>
              <p className="font-display text-lg font-bold text-white">PageSpeed</p>
              <p className="text-xs text-muted-dark">Google Lighthouse, mobile</p>
            </div>
            <div>
              <p className="font-display text-lg font-bold text-white">Top 20 search</p>
              <p className="text-xs text-muted-dark">Local competitor list</p>
            </div>
            <div>
              <p className="font-display text-lg font-bold text-white">No login</p>
              <p className="text-xs text-muted-dark">Public data only</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. How Scoring Works: Even 4-Columns */}
      <div className="rounded-[32px] border border-gray-200 bg-white p-8 shadow-sm sm:p-12">
        <div className="max-w-[43.75rem]">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-dark">
            How scoring works
          </span>
          <h3 className="mt-2 font-display text-2xl font-bold text-ink sm:text-3xl">
            How the 0–100 score is calculated
          </h3>
          <p className="mt-2 text-sm text-gray-600 sm:text-base">
            Each area carries the weight shown above. Inside an area, each check counts by its importance:
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
            Everything you need to know about the free Visibility Score.
          </p>
        </div>

        <div className="mx-auto flex w-full max-w-[52.5rem] flex-col gap-3">
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
                  <span className="font-display text-[1.0625rem] font-semibold text-ink sm:text-[1.125rem]">
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
                  <p className="px-6 pb-6 text-[0.9375rem] leading-relaxed text-gray-700">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* WhatsApp Help Band */}
        <div className="mx-auto mt-6 flex max-w-[43.75rem] flex-col items-center justify-between gap-4 rounded-3xl bg-ink p-6 text-center text-white sm:flex-row sm:text-left sm:p-8">
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
