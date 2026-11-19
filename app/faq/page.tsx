import { JsonLd } from "@/components/JsonLd";
import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { FaqExplorer } from "@/components/ui/FaqExplorer";
import { CtaBand } from "@/components/ui/CtaBand";
import { faqs } from "@/lib/content";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers to common questions about Google profiles, websites, pricing and how NearbyVisible works.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  return (
    <>
      <JsonLd data={jsonLd} />
      <PageHero eyebrow="FAQ" title="Questions business owners ask us." text="Short, honest answers. Still unsure? Ask us on WhatsApp." />
      <section className="mx-auto max-w-[77.5rem] px-6 py-24">
        <FaqExplorer />
      </section>
      <CtaBand title="Still have a question?" text="Message us on WhatsApp. A real person replies." />
    </>
  );
}
