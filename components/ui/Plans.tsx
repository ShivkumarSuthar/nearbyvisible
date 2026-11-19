import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { addOns, plans, type Plan } from "@/lib/content";
import { QuoteButtons } from "@/components/ui/QuoteButtons";

const price = (p: Plan) => (p.startingFrom === null ? null : `₹${p.startingFrom.toLocaleString("en-IN")}`);

/** Three plan cards plus add-ons. The popular plan is the dark card in the middle. */
export function Plans() {
  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-3">
        {plans.map((p, i) => {
          const dark = p.popular;
          const amount = price(p);
          return (
            <Reveal key={p.id} delay={i * 0.06} className="h-full">
              <article
                className={`relative flex h-full flex-col gap-7 rounded-[32px] p-8 ${
                  dark ? "bg-ink text-white shadow-[0_40px_80px_-40px_rgba(11,15,12,0.7)] lg:-my-4 lg:py-12" : "border border-gray-200 bg-white"
                }`}
              >
                {dark && (
                  <span className="absolute -top-3.5 left-8 rounded-full bg-brand px-3.5 py-1.5 text-[0.8125rem] font-bold text-ink">Most chosen</span>
                )}
                <div className="flex flex-col gap-2">
                  <h3 className="font-display text-[1.625rem] font-bold">{p.name}</h3>
                  <p className={dark ? "text-muted-dark" : "text-gray-600"}>{p.tagline}</p>
                </div>

                <div className="flex flex-col gap-1">
                  {amount ? (
                    <>
                      <span className={`text-sm font-semibold ${dark ? "text-muted-dark" : "text-gray-500"}`}>Starting from</span>
                      <span className="flex items-baseline gap-2">
                        <span className="font-display text-[2.75rem] font-bold leading-none tracking-[-1px]">{amount}</span>
                        <span className={dark ? "text-muted-dark" : "text-gray-500"}>{p.billing === "per month" ? "/ month" : "one-time"}</span>
                      </span>
                    </>
                  ) : (
                    <>
                      <span className={`text-sm font-semibold ${dark ? "text-muted-dark" : "text-gray-500"}`}>{p.billing === "per month" ? "Monthly plan" : "One-time setup"}</span>
                      <span className="font-display text-[2rem] font-bold leading-tight">Ask for price</span>
                    </>
                  )}
                </div>

                <QuoteButtons plan={p.name} dark={dark} />

                <ul className="flex flex-col gap-3 text-[0.9375rem]">
                  {p.includes.map((item) => (
                    <li key={item} className="flex gap-3">
                      <svg viewBox="0 0 24 24" className={`mt-0.5 size-5 flex-none ${dark ? "text-brand" : "text-brand-dark"}`} fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d="m5 12 4.5 4.5L19 7" />
                      </svg>
                      <span className={item.startsWith("Everything in") ? "font-semibold" : dark ? "text-white/90" : "text-gray-700"}>{item}</span>
                    </li>
                  ))}
                </ul>

                <p className={`mt-auto border-t pt-5 text-sm ${dark ? "border-line-dark text-muted-dark" : "border-gray-100 text-gray-500"}`}>
                  <span className="font-semibold">Best for: </span>
                  {p.bestFor}
                </p>
              </article>
            </Reveal>
          );
        })}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 rounded-[28px] bg-mist p-6 sm:p-8 md:grid-cols-[auto_1fr_1fr] md:items-center md:gap-8">
        <p className="font-display text-xl font-semibold">Add to any plan</p>
        {addOns.map((a) => (
          <Link key={a.slug} href={`/services/${a.slug}`} className="group flex flex-col gap-1 rounded-[20px] bg-white p-5 transition-colors hover:bg-brand-wash">
            <span className="font-semibold">{a.name} →</span>
            <span className="text-[0.9375rem] text-gray-600">{a.text}</span>
          </Link>
        ))}
      </div>

      <p className="text-center text-[0.9375rem] text-gray-500">
        Every quote is written, item by item, before work starts. Domain and hosting are not included: you pay the provider directly, and they renew yearly.
      </p>
    </div>
  );
}
