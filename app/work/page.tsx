import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { CtaBand } from "@/components/ui/CtaBand";
import { projects } from "@/lib/content";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Our work",
  description: "Businesses NearbyVisible has helped get found on Google.",
  alternates: { canonical: "/work" },
  // Keep this near-empty page out of Google until real projects are added in lib/content.ts.
  ...(projects.length ? {} : { robots: { index: false, follow: true } }),
};

export default function WorkPage() {
  return (
    <>
      {projects.length ? (
        <PageHero eyebrow="Our work" title="Real businesses. Real results." text="A few of the businesses we have helped get found nearby." />
      ) : (
        <PageHero eyebrow="Our work" title="Our first projects are under way." text="We are a new team. Case studies will appear here as soon as our first clients’ results are in." />
      )}
      <section className="mx-auto max-w-[77.5rem] px-6 py-28">
        {projects.length ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <ProjectCard key={p.client} {...p} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 rounded-[32px] border-2 border-dashed border-gray-300 px-8 py-20 text-center">
            <h2 className="font-display text-3xl font-semibold">Our first case studies are on the way.</h2>
            <p className="max-w-[32.5rem] text-lg text-gray-600">
              Want your business to be one of them? Message us and we will start with a free Google review.
            </p>
            <a href={site.whatsapp} className="mt-2 rounded-full bg-brand px-7 py-4 font-semibold text-ink">
              Chat on WhatsApp
            </a>
          </div>
        )}
      </section>
      <CtaBand title="Want your business here next?" />
    </>
  );
}
