import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { reasons } from "@/lib/content";

export function WhyUs() {
  return (
    <section className="bg-ink text-white">
      <div className="mx-auto flex max-w-[1240px] flex-col gap-12 px-6 py-32">
        <Reveal>
          <SectionHeading dark eyebrow="Why NearbyVisible" title="Fair pricing. Agency-level work." />
        </Reveal>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((r, i) => (
            <Reveal key={r.title} delay={i * 0.06} className="flex h-full flex-col gap-3 rounded-[28px] border border-line-dark bg-ink-soft p-8">
              <h3 className="font-display text-[22px] font-semibold">{r.title}</h3>
              <p className="text-base leading-relaxed text-muted-dark">{r.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
