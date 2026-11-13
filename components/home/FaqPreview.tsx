import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FaqList } from "@/components/ui/FaqList";
import { faqs } from "@/lib/content";

export function FaqPreview() {
  return (
    <section className="mx-auto flex max-w-[1240px] flex-col gap-12 px-6 py-32 lg:flex-row">
      <Reveal className="flex flex-col gap-5 lg:w-[380px] lg:flex-none">
        <SectionHeading eyebrow="FAQ" title="Quick answers." />
        <Link href="/faq" className="text-[17px] font-semibold text-brand-dark hover:underline">See all questions</Link>
      </Reveal>
      <div className="min-w-0 flex-1">
        <FaqList items={[faqs[1], faqs[2], faqs[6], faqs[7]]} />
      </div>
    </section>
  );
}
