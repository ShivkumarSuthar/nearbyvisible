import Link from "next/link";
import clsx from "clsx";
import type { Service } from "@/lib/content";

export function ServiceCard({ service }: { service: Service }) {
  const dark = service.featured;
  return (
    <article
      className={clsx(
        "flex h-full min-h-[15rem] flex-col gap-3.5 rounded-[28px] p-8 transition-transform hover:-translate-y-1",
        dark ? "bg-ink text-white" : "border border-gray-200 bg-white",
      )}
    >
      <span className={clsx("font-display text-base font-semibold", dark ? "text-brand" : "text-brand-dark")}>{service.number}</span>
      <h3 className="font-display text-[1.625rem] font-semibold">{service.name}</h3>
      <p className={clsx("text-[1.0625rem] leading-relaxed", dark ? "text-muted-dark" : "text-gray-600")}>{service.short}</p>
      <Link
        href={`/services/${service.slug}`}
        className={clsx("mt-auto text-base font-semibold hover:underline", dark ? "text-brand" : "text-brand-dark")}
      >
        Learn more<span className="sr-only"> about {service.name}</span>
      </Link>
    </article>
  );
}
