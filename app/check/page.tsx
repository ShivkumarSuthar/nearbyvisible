import type { Metadata } from "next";
import { Checker } from "@/components/check/Checker";

export const metadata: Metadata = {
  title: "Free Visibility Score for your business",
  description: "Get your free Visibility Score: see how easily customers find your business on Google, Maps, your website, social media and AI tools like ChatGPT. Free, in about 30 seconds.",
  alternates: { canonical: "/check" },
};

export default function CheckPage() {
  return (
    <>
      <section className="bg-ink text-white">
        <div className="mx-auto flex max-w-[900px] flex-col items-center gap-5 px-6 pb-40 pt-24 text-center md:pt-28">
          <p className="text-[15px] font-semibold tracking-wide text-brand">Free Visibility Score</p>
          <h1 className="font-display text-[clamp(38px,5.6vw,68px)] font-bold leading-[1.04] tracking-[-2px]">
            Can customers <span className="text-brand">find you online?</span>
          </h1>
          <p className="max-w-[600px] text-xl leading-relaxed text-muted-dark">
            We check your Google profile, search position, website, SEO, reviews and contact options, and whether AI tools like ChatGPT and Gemini recommend you. You get a score out of 100 with proof for every point.
          </p>
        </div>
      </section>
      <section className="mx-auto -mt-28 max-w-[1000px] px-4 pb-28 sm:px-6">
        <Checker />
      </section>
    </>
  );
}
