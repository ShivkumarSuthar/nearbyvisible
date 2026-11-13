import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Steps } from "@/components/ui/Steps";
import { processSteps } from "@/lib/content";

export function Process() {
  return (
    <section id="how" className="bg-mist">
      <div className="mx-auto flex max-w-[1240px] flex-col gap-14 px-6 py-32">
        <Reveal>
          <SectionHeading
            eyebrow="How we work"
            title="Honest advice first. Then we build."
            text="For each service we show you where you stand today and what will help. You decide what to do."
          />
        </Reveal>
        <Steps items={processSteps} />
      </div>
    </section>
  );
}
