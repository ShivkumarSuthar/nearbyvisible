import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { JourneyMap } from "@/components/ui/JourneyMap";

export function Process() {
  return (
    <section id="how" className="overflow-hidden bg-ink text-white">
      <div className="mx-auto flex max-w-[1100px] flex-col gap-12 px-6 py-24">
        <Reveal className="flex flex-col items-center gap-5 text-center">
          <p className="text-[15px] font-semibold tracking-wide text-brand">Your journey with us</p>
          <h2 className="max-w-[760px] font-display text-[clamp(34px,5vw,56px)] font-bold leading-[1.05] tracking-[-1.5px]">
            From first message to <span className="text-brand">found on Google.</span>
          </h2>
          <p className="max-w-[560px] text-lg leading-relaxed text-muted-dark">
            Six stops. At each one you get something real in your hands, from screenshots to a monthly report.
          </p>
        </Reveal>
        <JourneyMap />
        <div className="flex justify-center">
          <Link href="/journey" className="rounded-full border border-edge-dark px-7 py-4 font-semibold transition-colors hover:border-brand hover:text-brand">
            See the full journey →
          </Link>
        </div>
      </div>
    </section>
  );
}
