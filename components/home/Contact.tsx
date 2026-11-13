import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/lib/site";

export function Contact() {
  return (
    <section id="contact" className="px-6 pb-24 pt-8">
      <Reveal className="mx-auto flex max-w-[1240px] flex-col items-center gap-6 rounded-[40px] bg-ink px-8 py-24 text-center text-white">
        <Image src="/logo-icon.svg" alt="" width={72} height={72} />
        <h2 className="max-w-[860px] font-display text-[clamp(36px,5vw,64px)] font-bold leading-[1.08] tracking-[-1.5px]">
          Ramesh’s story is done. <span className="text-brand">Yours is next.</span>
        </h2>
        <p className="max-w-[560px] text-xl leading-relaxed text-muted-dark">
          Send us your business name and area on WhatsApp. We will check how you look on Google today, for free.
        </p>
        <div className="mt-2 flex flex-wrap justify-center gap-4">
          <a href={site.whatsapp} className="rounded-full bg-brand px-7 py-4 text-[17px] font-semibold text-ink transition-transform hover:-translate-y-0.5">
            Chat on WhatsApp
          </a>
          <a href={site.phoneTel} className="rounded-full border border-edge-dark px-7 py-4 text-[17px] font-semibold text-white transition-colors hover:border-white">
            Call {site.phoneDisplay}
          </a>
        </div>
      </Reveal>
    </section>
  );
}
