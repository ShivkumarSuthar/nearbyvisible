import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CtaBand } from "@/components/ui/CtaBand";
import { Reveal } from "@/components/ui/Reveal";
import Link from "next/link";
import { reasons, services } from "@/lib/content";

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

      <section className="mx-auto flex max-w-[77.5rem] flex-col gap-16 px-6 py-28 lg:flex-row lg:items-center">
        <Reveal className="flex flex-1 flex-col gap-5">
          <SectionHeading eyebrow="Our story" title="Built by a developer who saw the gap." />
          <p className="text-[1.1875rem] leading-[1.75] text-gray-700">
            NearbyVisible was founded by Shivkumar Suthar, a web developer working with React and Next.js since 2022. He
            kept meeting business owners who did great work but had no Google profile, no website and no reviews, while
            their customers searched “near me” every day.
          </p>
          <p className="text-[1.1875rem] leading-[1.75] text-gray-700">
            So we built one simple team for everything a business needs online, from a logo to monthly growth.
          </p>
        </Reveal>
        <Reveal delay={0.1} className="flex flex-1 justify-center">
          <div className="flex w-full max-w-[26.25rem] flex-col gap-5 rounded-[32px] bg-ink p-8 text-white">
            <p className="text-[0.9375rem] font-semibold text-brand">One team, everything online</p>
            <ul className="flex flex-col divide-y divide-line-dark">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`} className="group flex items-baseline gap-4 py-3.5">
                    <span className="font-display text-sm text-muted-dark">{s.number}</span>
                    <span className="flex flex-1 flex-col">
                      <span className="font-semibold group-hover:text-brand">{s.name}</span>
                      <span className="text-sm text-muted-dark">{s.short}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </section>

      <section className="bg-mist">
        <div className="mx-auto flex max-w-[77.5rem] flex-col gap-12 px-6 py-28">
          <SectionHeading eyebrow="What we believe" title="How we work with every client." />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {reasons.map((r) => (
              <div key={r.title} className="flex flex-col gap-3 rounded-[28px] bg-white p-8">
                <h3 className="font-display text-[1.375rem] font-semibold">{r.title}</h3>
                <p className="text-base leading-relaxed text-gray-600">{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[77.5rem] grid-cols-1 gap-10 px-6 pt-28 md:grid-cols-2">
        <div className="flex flex-col gap-3">
          <p className="text-[0.9375rem] font-semibold text-brand-dark">Our mission</p>
          <p className="font-display text-[1.875rem] font-semibold leading-snug">Make every good business easy to find, trust and call.</p>
        </div>
        <div className="flex flex-col gap-3">
          <p className="text-[0.9375rem] font-semibold text-brand-dark">Where we work</p>
          <p className="text-[1.1875rem] leading-relaxed text-gray-700">We work with businesses anywhere in India, on call, video and WhatsApp.</p>
        </div>
      </section>

      <CtaBand title="Let’s make your business visible." />
    </>
  );
}
