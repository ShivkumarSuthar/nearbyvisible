import { Reveal } from "@/components/ui/Reveal";
import { CALLBACK_TEXT, site, whatsappLink } from "@/lib/site";

type Props = { title?: string; text?: string };

export function CtaBand({
  title = "Ready to get found nearby?",
  text = "Send us your business name and area on WhatsApp. We will check how you look on Google today, for free.",
}: Props) {
  return (
    <section className="px-6 py-24">
      <Reveal className="mx-auto flex max-w-[77.5rem] flex-col items-center gap-5 rounded-[40px] bg-brand-wash px-8 py-[72px] text-center">
        <h2 className="max-w-[47.5rem] font-display text-[clamp(1.875rem,4vw,3rem)] font-bold leading-[1.1] tracking-[-1px]">{title}</h2>
        <p className="max-w-[35rem] text-[1.1875rem] leading-relaxed text-gray-700">{text}</p>
        <div className="mt-2 flex flex-wrap justify-center gap-4">
          <a href={site.whatsapp} className="rounded-full bg-brand px-7 py-4 text-[1.0625rem] font-semibold text-ink transition-transform hover:-translate-y-0.5">
            Chat on WhatsApp
          </a>
          <a href={whatsappLink(CALLBACK_TEXT)} className="rounded-full border border-[#111111] px-7 py-4 text-[1.0625rem] font-semibold transition-colors hover:bg-[#111111] hover:text-white">
            Get a call back
          </a>
        </div>
      </Reveal>
    </section>
  );
}
