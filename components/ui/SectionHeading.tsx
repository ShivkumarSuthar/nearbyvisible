import clsx from "clsx";

type Props = { eyebrow: string; title: string; text?: string; dark?: boolean; className?: string };

export function SectionHeading({ eyebrow, title, text, dark, className }: Props) {
  return (
    <div className={clsx("flex max-w-[680px] flex-col gap-4", className)}>
      <p className={clsx("text-[15px] font-semibold tracking-wide", dark ? "text-brand" : "text-brand-dark")}>{eyebrow}</p>
      <h2 className="font-display text-[clamp(32px,4vw,52px)] font-bold leading-[1.1] tracking-[-1px]">{title}</h2>
      {text && <p className={clsx("text-[19px] leading-relaxed", dark ? "text-muted-dark" : "text-gray-700")}>{text}</p>}
    </div>
  );
}
