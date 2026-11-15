import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { FaqList } from "@/components/ui/FaqList";
import { faqs } from "@/lib/content";
import { site } from "@/lib/site";

/* The five questions owners ask before they decide. */
const picks = [
  "How do we start?",
  "When will I see results?",
  "How much does it cost?",
  "Who owns my accounts?",
  "Can you guarantee the top position on Google?",
];

export function FaqPreview() {
  const items = picks.map((q) => faqs.find((f) => f.q === q)).filter((f) => f !== undefined);
  return (
    <section className="mx-auto grid max-w-[1240px] grid-cols-1 gap-12 px-6 py-32 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-20">
      <Reveal className="flex flex-col gap-6 lg:sticky lg:top-28 lg:self-start">
        <p className="text-[15px] font-semibold tracking-wide text-brand-dark">FAQ</p>
        <h2 className="font-display text-[clamp(32px,3.6vw,46px)] font-bold leading-[1.08] tracking-[-1.2px]">
          Your questions,
          <span className="block text-gray-400">answered straight.</span>
        </h2>
        <p className="max-w-[380px] text-[18px] leading-relaxed text-gray-600">What business owners ask us most before they start.</p>
        <div className="mt-2 flex flex-col gap-3 rounded-[24px] bg-ink p-6 text-white">
          <p className="font-display text-lg font-semibold">Still have a question?</p>
          <p className="text-[15px] text-muted-dark">Ask on WhatsApp. A real person replies.</p>
          <div className="mt-1 flex flex-wrap items-center gap-x-5 gap-y-3">
            <a href={site.whatsapp} className="rounded-full bg-brand px-5 py-2.5 text-[15px] font-semibold text-ink transition-transform hover:-translate-y-0.5">
              Ask us
            </a>
            <Link href="/faq" className="text-[15px] font-semibold text-white underline-offset-4 hover:underline">
              See all {faqs.length} questions →
            </Link>
          </div>
        </div>
      </Reveal>
      <Reveal delay={0.1} className="min-w-0">
        <FaqList items={items} openFirst />
      </Reveal>
    </section>
  );
}
