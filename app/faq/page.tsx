import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { FaqList } from "@/components/ui/FaqList";
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHero eyebrow="FAQ" title="Questions business owners ask us." text="Short, honest answers. Still unsure? Ask us on WhatsApp." />
      <section className="mx-auto max-w-[1000px] px-6 py-28">
        <FaqList items={faqs} />
      </section>
      <CtaBand title="Still have a question?" text="Message us on WhatsApp. A real person replies." />
    </>
  );
}
