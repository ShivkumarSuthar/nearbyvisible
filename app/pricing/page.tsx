import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Plans } from "@/components/ui/Plans";
import { FaqList } from "@/components/ui/FaqList";
import { CtaBand } from "@/components/ui/CtaBand";
import { faqGroups } from "@/lib/content";

export const metadata: Metadata = {
  title: "Plans and pricing",
  description: "Three simple plans to get found on Google, look trusted online and keep growing every month.",
  alternates: { canonical: "/pricing" },
};

export default function PricingPage() {
  const pricingFaqs = faqGroups.find((g) => g.id === "pricing")?.items ?? [];
  return (
    <>
      <PageHero
        eyebrow="Plans and pricing"
        title="Start where you are. Grow from there."
        text="Pick the plan that fits today. You can add more later, and you only pay for what helps."
      />
      <section className="mx-auto max-w-[77.5rem] px-6 py-28">
        <Plans />
      </section>
      <section className="mx-auto flex max-w-[56.25rem] flex-col gap-6 px-6 pb-12">
        <h2 className="font-display text-[1.875rem] font-bold tracking-[-0.5px]">Questions about pricing</h2>
        <FaqList items={pricingFaqs} />
      </section>
      <CtaBand title="Not sure which plan fits?" text="Get your free Visibility Score or message us. We will tell you honestly where to start." />
    </>
  );
}
