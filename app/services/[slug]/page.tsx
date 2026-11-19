import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Checklist } from "@/components/ui/Checklist";
import { Steps } from "@/components/ui/Steps";
import { CtaBand } from "@/components/ui/CtaBand";
import { BreadcrumbJsonLd, JsonLd } from "@/components/JsonLd";
import { getService, plans, services } from "@/lib/content";
import { site } from "@/lib/site";

export const dynamicParams = false;
export const generateStaticParams = () => services.map((s) => ({ slug: s.slug }));

const lowestPrice = Math.min(...plans.flatMap((p) => (p.startingFrom ? [p.startingFrom] : [])));

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = getService((await params).slug);
  if (!service) return {};
  return {
    title: service.name,
    description: service.intro,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: { title: service.name, description: service.intro, url: `/services/${service.slug}` },
  };
}

export default async function ServicePage({ params }: Props) {
  const service = getService((await params).slug);
  if (!service) notFound();

  const index = services.findIndex((s) => s.slug === service.slug);
  const next = services[(index + 1) % services.length];

  return (
    <>
      <BreadcrumbJsonLd items={[["Services", "/services"], [service.name, `/services/${service.slug}`]]} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: service.name,
          description: service.intro,
          url: `${site.url}/services/${service.slug}`,
          areaServed: { "@type": "Country", name: "India" },
          provider: { "@id": `${site.url}/#organization` },
        }}
      />
      <PageHero eyebrow={`Service ${service.number}`} title={service.title} text={service.intro} cta />

      <section className="mx-auto flex max-w-[77.5rem] flex-col gap-12 px-6 py-28">
        <SectionHeading eyebrow="What you get" title={`${service.name}, done properly.`} />
        <Checklist items={service.gets} />
      </section>

      <section className="bg-mist">
        <div className="mx-auto flex max-w-[77.5rem] flex-col gap-12 px-6 py-28">
          <SectionHeading eyebrow="How it works" title="Simple steps. You approve each one." />
          <Steps items={service.steps} />
        </div>
      </section>

      <section className="mx-auto grid max-w-[77.5rem] grid-cols-1 gap-6 px-6 pt-28 md:grid-cols-2">
        <div className="flex flex-col gap-3.5 rounded-[28px] bg-ink p-10 text-white">
          <p className="text-[0.9375rem] font-semibold text-brand">Good for</p>
          <p className="font-display text-[1.625rem] font-semibold leading-snug">{service.goodFor}</p>
        </div>
        <div className="flex flex-col gap-3.5 rounded-[28px] border border-gray-200 p-10">
          <p className="text-[0.9375rem] font-semibold text-brand-dark">Pricing</p>
          <p className="text-lg leading-relaxed text-gray-700">
            Plans start from ₹{lowestPrice.toLocaleString("en-IN")}. The final price depends on what you need: after a free review we share a clear written quote, with no hidden costs.
          </p>
          <Link href="/pricing" className="font-semibold text-brand-dark hover:underline">
            See plans and starting prices →
          </Link>
          <Link href={`/services/${next.slug}`} className="mt-auto pt-4 font-semibold text-brand-dark hover:underline">
            Next service: {next.name}
          </Link>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
