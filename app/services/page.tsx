import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Steps } from "@/components/ui/Steps";
import { CtaBand } from "@/components/ui/CtaBand";
import { Reveal } from "@/components/ui/Reveal";
import { services, processSteps } from "@/lib/content";

export const metadata: Metadata = {
  title: "Services",
  description: "Branding, websites, apps, Google presence, business growth and maintenance for your business.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Everything your business needs online, in one place."
        text="Six services, in the order a business needs them. We review each one with you, and you choose only what helps."
        cta
      />
      <section className="mx-auto max-w-[77.5rem] px-6 py-28">
        <ol className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <li key={s.slug}>
              <Reveal delay={(i % 3) * 0.08} className="h-full">
                <ServiceCard service={s} />
              </Reveal>
            </li>
          ))}
        </ol>
      </section>
      <section className="bg-mist">
        <div className="mx-auto flex max-w-[77.5rem] flex-col gap-12 px-6 py-28">
          <SectionHeading
            eyebrow="How we work"
            title="Honest advice first. Then we build."
            text="For each service we show you where you stand today and what will help. You decide what to do."
          />
          <Steps items={processSteps} />
        </div>
      </section>
      <CtaBand />
    </>
  );
}
