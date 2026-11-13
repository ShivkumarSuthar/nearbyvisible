import { Reveal } from "@/components/ui/Reveal";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { services } from "@/lib/content";

export function Services() {
  return (
    <section id="services" className="mx-auto flex max-w-[1240px] flex-col gap-14 px-6 py-32">
      <Reveal className="flex flex-wrap items-end justify-between gap-6">
        <div className="flex max-w-[640px] flex-col gap-4">
          <p className="text-[15px] font-semibold tracking-wide text-brand-dark">What we do</p>
          <h2 className="font-display text-[clamp(34px,4vw,52px)] font-bold leading-[1.1] tracking-[-1px]">
            Everything your business needs online, in one place.
          </h2>
        </div>
        <p className="max-w-[380px] text-lg leading-relaxed text-gray-600">
          Six services, in the order a business needs them. You choose only what helps you.
        </p>
      </Reveal>
      <ol className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s, i) => (
          <li key={s.slug}>
            <Reveal delay={(i % 3) * 0.08} className="h-full">
              <ServiceCard service={s} />
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}
