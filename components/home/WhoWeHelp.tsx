import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { industries } from "@/lib/content";

export function WhoWeHelp() {
  return (
    <section className="mx-auto flex max-w-[1240px] flex-col gap-12 px-6 py-32">
      <Reveal>
        <SectionHeading eyebrow="Who we help" title="Built for the businesses your street depends on." />
      </Reveal>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {industries.map((name, i) => (
          <li key={name}>
            <Reveal delay={(i % 4) * 0.05} className="flex items-center gap-3 rounded-[20px] border border-gray-200 px-6 py-[22px] font-display text-lg font-semibold">
              <span className="size-2.5 flex-none rounded-full bg-brand" aria-hidden="true" />
              {name}
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
