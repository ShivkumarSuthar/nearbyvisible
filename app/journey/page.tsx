import type { Metadata } from "next";
import { CtaBand } from "@/components/ui/CtaBand";
import { JourneyMap } from "@/components/ui/JourneyMap";
import { journey } from "@/lib/content";

export const metadata: Metadata = {
  title: "Your journey",
  description: "Every step of working with NearbyVisible, from your first message to monthly growth.",
  alternates: { canonical: "/journey" },
};

export default function JourneyPage() {
  return (
    <>
      <section className="overflow-hidden bg-ink text-white">
        <div className="mx-auto flex max-w-[1100px] flex-col gap-20 px-6 pb-32 pt-24 md:pt-28">
          <div className="flex flex-col items-center gap-6 text-center">
            <p className="text-[15px] font-semibold tracking-wide text-brand">Your journey</p>
            <h1 className="max-w-[880px] font-display text-[clamp(40px,6vw,76px)] font-bold leading-[1.02] tracking-[-2px]">
              Know every step <span className="text-brand">before you start.</span>
            </h1>
            <p className="max-w-[600px] text-xl leading-relaxed text-muted-dark">
              No surprises. What we do, what we need from you, and what you get, from hello to growth.
            </p>
          </div>
          <JourneyMap />
          <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {journey.map((s, i) => (
              <li key={s.title} className="flex flex-col gap-3 rounded-[24px] border border-line-dark bg-ink-soft p-6">
                <div className="flex items-center gap-3">
                  <span className="flex size-8 items-center justify-center rounded-full bg-brand font-display text-sm font-bold text-ink">{i + 1}</span>
                  <h3 className="font-display text-[19px] font-semibold">{s.title}</h3>
                </div>
                <p className="text-[15px] leading-relaxed text-muted-dark">
                  <span className="font-semibold text-white">We: </span>
                  {s.we}
                </p>
                <p className="text-[15px] leading-relaxed text-muted-dark">
                  <span className="font-semibold text-white">You: </span>
                  {s.you}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <CtaBand title="Start with stop one. It is free." />
    </>
  );
}
