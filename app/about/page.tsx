import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CtaBand } from "@/components/ui/CtaBand";
import { Reveal } from "@/components/ui/Reveal";
import { reasons } from "@/lib/content";

export const metadata: Metadata = {
  title: "About us",
  description: "Why we started NearbyVisible and how we work with businesses.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About us"
        title="We started NearbyVisible because good businesses stay invisible."
        text="Every day, skilled people lose customers to whoever shows up first on Google. We fix that."
      />

      <section className="mx-auto flex max-w-[1240px] flex-col gap-16 px-6 py-28 lg:flex-row lg:items-center">
        <Reveal className="flex flex-1 flex-col gap-5">
          <SectionHeading eyebrow="Our story" title="Built by a developer who saw the gap." />
          <p className="text-[19px] leading-[1.75] text-gray-700">
            NearbyVisible was founded by Shivkumar Suthar, a web developer working with React and Next.js since 2022. He
            kept meeting business owners who did great work but had no Google profile, no website and no reviews, while
            their customers searched “near me” every day.
          </p>
          <p className="text-[19px] leading-[1.75] text-gray-700">
            So we built one simple team for everything a business needs online, from a logo to monthly growth.
          </p>
        </Reveal>
        <Reveal delay={0.1} className="flex flex-1 justify-center">
          {/* Replace with: <Image src="/founder.jpg" alt="Shivkumar Suthar, founder" ... /> */}
          <div className="flex aspect-[4/5] w-full max-w-[380px] items-center justify-center rounded-[32px] bg-mist font-display text-6xl font-semibold text-gray-400">
            SS
          </div>
        </Reveal>
      </section>

      <section className="bg-mist">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-12 px-6 py-28">
          <SectionHeading eyebrow="What we believe" title="How we work with every client." />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {reasons.map((r) => (
              <div key={r.title} className="flex flex-col gap-3 rounded-[28px] bg-white p-8">
                <h3 className="font-display text-[22px] font-semibold">{r.title}</h3>
                <p className="text-base leading-relaxed text-gray-600">{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1240px] grid-cols-1 gap-10 px-6 pt-28 md:grid-cols-2">
        <div className="flex flex-col gap-3">
          <p className="text-[15px] font-semibold text-brand-dark">Our mission</p>
          <p className="font-display text-[30px] font-semibold leading-snug">Make every good business easy to find, trust and call.</p>
        </div>
        <div className="flex flex-col gap-3">
          <p className="text-[15px] font-semibold text-brand-dark">Where we work</p>
          <p className="text-[19px] leading-relaxed text-gray-700">We meet you at your shop or office, or on WhatsApp.</p>
        </div>
      </section>

      <CtaBand title="Let’s make your business visible." />
    </>
  );
}
