import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/lib/site";

type Props = { eyebrow: string; title: string; text: string; cta?: boolean };

export function PageHero({ eyebrow, title, text, cta = false }: Props) {
  return (
    <section className="bg-ink text-white">
      <Reveal className="mx-auto flex max-w-[1240px] flex-col gap-6 px-6 pb-28 pt-24">
        <p className="text-[15px] font-semibold tracking-wide text-brand">{eyebrow}</p>
        <h1 className="max-w-[940px] font-display text-[clamp(40px,5.4vw,72px)] font-bold leading-[1.05] tracking-[-1.5px]">
          {title}
        </h1>
        <p className="max-w-[640px] text-xl leading-relaxed text-muted-dark">{text}</p>
        {cta && (
          <div className="mt-2 flex flex-wrap gap-4">
            <a href={site.whatsapp} className="rounded-full bg-brand px-7 py-4 text-[17px] font-semibold text-ink transition-transform hover:-translate-y-0.5">
              Get a free Google audit
            </a>
            <Link href="/contact" className="rounded-full border border-edge-dark px-7 py-4 text-[17px] font-semibold text-white transition-colors hover:border-white">
              Talk to us
            </Link>
          </div>
        )}
      </Reveal>
    </section>
  );
}
