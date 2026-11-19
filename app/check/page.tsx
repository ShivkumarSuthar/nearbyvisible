import type { Metadata } from "next";
import { Suspense } from "react";
import { Checker } from "@/components/check/Checker";
import { ToolDetails } from "@/components/check/ToolDetails";
import { auditCatalog } from "@/lib/audit/catalog";

export const metadata: Metadata = {
  title: "Free Visibility Score for your business",
  description: "Free check with 35+ tests: see how easily customers find your business on Google Search, Google Maps, your website and AI tools like ChatGPT and Gemini. Uses live Google data. About 30 seconds.",
  alternates: { canonical: "/check" },
};

export default function CheckPage() {
  const { pillars, total } = auditCatalog();
  return (
    <>
      <section className="bg-ink text-white">
        <div className="mx-auto flex max-w-[60rem] flex-col items-center gap-5 px-6 pb-40 pt-24 text-center md:pt-28">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-ink-soft px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-brand">
            <span className="size-2 rounded-full bg-brand animate-pulse" />
            Free Digital Visibility Score
          </div>
          <h1 className="font-display text-[clamp(2.375rem,5.6vw,4.25rem)] font-bold leading-[1.04] tracking-[-2px]">
            Can customers <span className="text-brand">find you online?</span>
          </h1>
          <p className="max-w-[40rem] text-xl leading-relaxed text-muted-dark">
            {total} checks across your Google profile, your position against the top 20 local businesses, your website and AI visibility. You get a score out of 100 with the measured result behind every check.
          </p>
        </div>
      </section>
      <section className="mx-auto -mt-28 max-w-[62.5rem] px-4 pb-28 sm:px-6">
        <Suspense fallback={<div className="h-72 rounded-[32px] bg-white p-8 shadow-xl animate-pulse" />}>
          <Checker />
        </Suspense>
        <ToolDetails pillars={pillars} total={total} />
      </section>
    </>
  );
}
