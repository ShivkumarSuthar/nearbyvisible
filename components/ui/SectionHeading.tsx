import clsx from "clsx";

type Props = { eyebrow: string; title: string; text?: string; dark?: boolean; className?: string };

export function SectionHeading({ eyebrow, title, text, dark, className }: Props) {
  return (
    <div className={clsx("flex max-w-[42.5rem] flex-col gap-4", className)}>
      <p className={clsx("text-[0.9375rem] font-semibold tracking-wide", dark ? "text-brand" : "text-brand-dark")}>{eyebrow}</p>
      <h2 className="font-display text-[clamp(2rem,4vw,3.25rem)] font-bold leading-[1.1] tracking-[-1px]">{title}</h2>
      {text && <p className={clsx("text-[1.1875rem] leading-relaxed", dark ? "text-muted-dark" : "text-gray-700")}>{text}</p>}
    </div>
  );
}
