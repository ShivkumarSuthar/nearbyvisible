import { Reveal } from "@/components/ui/Reveal";
import { HeroRanking } from "@/components/home/HeroRanking";
import { site } from "@/lib/site";
import { HeroBackdrop } from "@/components/home/HeroBackdrop";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-ink text-white">
      <HeroBackdrop />

      <div className="relative mx-auto flex w-full max-w-[77.5rem] flex-wrap items-center gap-14 px-6 pb-24 pt-16 md:pb-28 md:pt-24">
        <Reveal className="flex min-w-0 flex-[999_1_32.5rem] flex-col gap-7">
          <p className="text-[0.9375rem] font-semibold tracking-wide text-brand">Digital growth for businesses across India</p>
          <h1 className="font-display text-[clamp(2.75rem,6vw,5.25rem)] font-bold leading-[1.02] tracking-[-2px]">
            Good work deserves to be <span className="text-brand">found.</span>
          </h1>
          <p className="max-w-[35rem] text-xl leading-relaxed text-muted-dark">
            Your customers are searching nearby right now. We make sure they see you, trust you, and call you first.
          </p>

          {/* Plain GET form: works without JavaScript and lands on /check with the name filled in. */}
          <form action="/check" method="get" className="mt-1 flex w-full max-w-[36.25rem] flex-col gap-2 rounded-[28px] bg-white p-2 sm:flex-row sm:rounded-full">
            <label htmlFor="hero-business" className="sr-only">
              Your business name
            </label>
            <input
              id="hero-business"
              name="name"
              type="text"
              autoComplete="organization"
              placeholder="Your business name"
              className="min-w-0 flex-1 rounded-full bg-transparent px-5 py-3.5 text-[1.0625rem] text-[#111111] outline-none placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-brand"
            />
            <button type="submit" className="whitespace-nowrap rounded-full bg-brand px-6 py-3.5 text-[1.0625rem] font-semibold text-ink transition-transform hover:-translate-y-0.5">
              Get free score →
            </button>
          </form>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-[0.9375rem] text-muted-dark">
            <span>Free · About a minute · No signup</span>
            <a href={site.whatsapp} className="inline-flex items-center gap-2 font-semibold text-white underline-offset-4 hover:text-brand hover:underline">
              <svg viewBox="0 0 24 24" className="size-[18px] text-brand" fill="currentColor" aria-hidden="true">
                <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.5-3.9-4.7-4.1-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.3.5-.4.4c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.5.1.6-.1l.9-1.1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.2.1.7-.1 1.4Z" />
              </svg>
              Or talk to us on WhatsApp
            </a>
          </div>
        </Reveal>

        <Reveal className="min-w-0 flex-[1_1_23.75rem]" delay={0.15}>
          <HeroRanking />
        </Reveal>
      </div>

    </section>
  );
}
