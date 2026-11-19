import clsx from "clsx";
import { Reveal } from "@/components/ui/Reveal";

type ChapterProps = {
  number: string;
  title: string;
  children: React.ReactNode;
  visual: React.ReactNode;
  tone?: "light" | "mist" | "dark";
  /** Puts the visual on the left on wide screens. */
  visualFirst?: boolean;
};

export function Chapter({ number, title, children, visual, tone = "light", visualFirst = false }: ChapterProps) {
  const dark = tone === "dark";
  return (
    <section className={clsx(tone === "mist" && "bg-mist", dark && "bg-ink text-white")}>
      <div
        className={clsx(
          "mx-auto flex max-w-[77.5rem] flex-col items-center gap-16 px-6 py-24 md:gap-[72px] md:py-28 lg:flex-row",
          visualFirst && "lg:flex-row-reverse",
        )}
      >
        <Reveal className="flex w-full min-w-0 flex-1 flex-col gap-[18px]">
          <span className={clsx("font-display text-8xl font-bold leading-none", dark ? "text-[#1e3a26]" : "text-brand-tint")}>
            {number}
          </span>
          <h3 className="font-display text-[clamp(1.875rem,3.4vw,2.5rem)] font-bold leading-[1.15]">{title}</h3>
          <div className={clsx("flex flex-col gap-4 text-[1.1875rem] leading-[1.75]", dark ? "text-muted-dark" : "text-gray-700")}>
            {children}
          </div>
        </Reveal>
        <Reveal className="flex w-full min-w-0 flex-1 justify-center" delay={0.12}>
          {visual}
        </Reveal>
      </div>
    </section>
  );
}
