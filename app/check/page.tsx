import type { Metadata } from "next";
import { Suspense } from "react";
import { Checker } from "@/components/check/Checker";
import { ToolDetails } from "@/components/check/ToolDetails";

export const metadata: Metadata = {
  title: "180-Point Free Visibility Score for your business",
  description: "Run our free 180-point digital audit: see how easily customers find your business on Google, Maps, your website, and AI tools like ChatGPT. Powered by Google Places and Lighthouse. Free, in ~30 seconds.",
  alternates: { canonical: "/check" },
};

export default function CheckPage() {
  return (
    <>
      <section className="bg-ink text-white">
        <div className="mx-auto flex max-w-[960px] flex-col items-center gap-5 px-6 pb-40 pt-24 text-center md:pt-28">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-ink-soft px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-brand">
            <span className="size-2 rounded-full bg-brand animate-pulse" />
            Official 180-Point Digital Visibility Audit
          </div>
          <h1 className="font-display text-[clamp(38px,5.6vw,68px)] font-bold leading-[1.04] tracking-[-2px]">
            Can customers <span className="text-brand">find you online?</span>
          </h1>
          <p className="max-w-[640px] text-xl leading-relaxed text-muted-dark">
            We scan 180+ digital checkpoints across your Google Profile, local rankings vs top 20 competitors, Core Web Vitals, and AI visibility. You get a score out of 100 with measured proof for every single point.
          </p>
        </div>
      </section>
      <section className="mx-auto -mt-28 max-w-[1000px] px-4 pb-28 sm:px-6">
        <Suspense fallback={<div className="h-72 rounded-[32px] bg-white p-8 shadow-xl animate-pulse" />}>
          <Checker />
        </Suspense>
        <ToolDetails />
      </section>
    </>
  );
}
