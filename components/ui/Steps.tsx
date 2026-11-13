import { Reveal } from "@/components/ui/Reveal";

export function Steps({ items }: { items: { title: string; text: string }[] }) {
  return (
    <ol className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(170px,1fr))]">
      {items.map((s, i) => (
        <li key={s.title}>
          <Reveal delay={i * 0.06} className="flex flex-col gap-3 border-t-[3px] border-brand pt-5">
            <span className="font-display text-[15px] font-semibold text-brand-dark">Step {i + 1}</span>
            <h3 className="font-display text-[21px] font-semibold">{s.title}</h3>
            <p className="text-[15px] leading-relaxed text-gray-600">{s.text}</p>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
