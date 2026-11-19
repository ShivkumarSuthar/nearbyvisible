import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { Plans } from "@/components/ui/Plans";

export function PlansPreview() {
  return (
    <section className="mx-auto flex max-w-[77.5rem] flex-col gap-14 px-6 py-32">
      <Reveal className="flex flex-col items-center gap-4 text-center">
        <p className="text-[0.9375rem] font-semibold tracking-wide text-brand-dark">Plans</p>
        <h2 className="max-w-[47.5rem] font-display text-[clamp(2.125rem,4.4vw,3.375rem)] font-bold leading-[1.05] tracking-[-1.5px]">
          Start where you are. <span className="text-gray-400">Grow from there.</span>
        </h2>
        <p className="max-w-[35rem] text-lg text-gray-600">
          Three simple plans. Add more any time.{" "}
          <Link href="/pricing" className="font-semibold text-brand-dark underline-offset-4 hover:underline">
            Compare plans →
          </Link>
        </p>
      </Reveal>
      <Plans />
    </section>
  );
}
