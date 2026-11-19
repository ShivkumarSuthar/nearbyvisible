import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { projects, testimonials } from "@/lib/content";

/** Hidden until real projects are added in lib/content.ts. */
export function WorkPreview() {
  if (!projects.length) return null;
  return (
    <section className="mx-auto flex max-w-[77.5rem] flex-col gap-12 px-6 py-32">
      <Reveal className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading eyebrow="Our work" title="Businesses we have made visible." />
        <Link href="/work" className="text-[1.0625rem] font-semibold text-brand-dark hover:underline">See all work</Link>
      </Reveal>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {projects.slice(0, 3).map((p) => (
          <ProjectCard key={p.client} {...p} />
        ))}
      </div>
    </section>
  );
}

/** Hidden until real client quotes are added in lib/content.ts. */
export function Testimonials() {
  if (!testimonials.length) return null;
  return (
    <section className="bg-brand-wash">
      <div className="mx-auto flex max-w-[77.5rem] flex-col gap-12 px-6 py-32">
        <Reveal>
          <SectionHeading eyebrow="What clients say" title="In their own words." />
        </Reveal>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.name} className="flex flex-col gap-5 rounded-[28px] bg-white p-8">
              <blockquote className="text-[1.1875rem] leading-relaxed">“{t.quote}”</blockquote>
              <figcaption className="flex flex-col gap-0.5">
                <span className="font-semibold">{t.name}</span>
                <span className="text-[0.9375rem] text-gray-600">{t.business}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
