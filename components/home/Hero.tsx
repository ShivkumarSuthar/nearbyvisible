import { Reveal } from "@/components/ui/Reveal";
import { HeroMap } from "@/components/home/HeroMap";
import { site } from "@/lib/site";

export function Hero() {
  return (
    <section id="top" className="overflow-hidden bg-ink text-white">
      <div className="mx-auto flex max-w-[1240px] flex-wrap items-center gap-16 px-6 pb-32 pt-24 md:pt-28">
        <Reveal className="flex min-w-0 flex-[999_1_520px] flex-col gap-7">
          <p className="text-[15px] font-semibold tracking-wide text-brand">
            Digital growth for your business
          </p>
          <h1 className="font-display text-[clamp(44px,6vw,84px)] font-bold leading-[1.02] tracking-[-2px]">
            Good work deserves to be <span className="text-brand">found.</span>
          </h1>
          <p className="max-w-[560px] text-xl leading-relaxed text-muted-dark">
            Your customers are searching nearby right now. We make sure they see you, trust you, and call you first.
          </p>
          <div className="mt-2 flex flex-wrap gap-4">
            <a href="/check" className="rounded-full bg-brand px-7 py-4 text-[17px] font-semibold text-ink transition-transform hover:-translate-y-0.5">
              Get your free Visibility Score →
            </a>
            <a href={site.whatsapp} className="rounded-full border border-edge-dark px-7 py-4 text-[17px] font-semibold text-white transition-colors hover:border-white">
              Talk on WhatsApp
            </a>
          </div>
        </Reveal>
        <Reveal className="min-w-0 flex-[1_1_400px]" delay={0.15}>
          <HeroMap />
        </Reveal>
      </div>
    </section>
  );
}
