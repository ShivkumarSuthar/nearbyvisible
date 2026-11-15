import type { Faq } from "@/lib/content";

/** Accordion of question cards. Uses native <details>, so it works without JavaScript. */
export function FaqList({ items, openFirst = false }: { items: Faq[]; openFirst?: boolean }) {
  return (
    <div className="flex flex-col gap-3">
      {items.map((f, i) => (
        <details
          key={f.q}
          open={openFirst && i === 0}
          className="group rounded-[22px] border border-gray-200 bg-white transition-colors open:border-brand/50 open:bg-brand-wash/60 hover:border-gray-300"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 px-6 py-5 [&::-webkit-details-marker]:hidden">
            <span className="font-display text-[18px] font-semibold leading-snug sm:text-[19px]">{f.q}</span>
            <span className="flex size-9 flex-none items-center justify-center rounded-full bg-mist text-[#111111] transition-all group-open:rotate-45 group-open:bg-brand">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden="true">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </span>
          </summary>
          <p className="max-w-[720px] px-6 pb-6 text-[16px] leading-relaxed text-gray-700 sm:text-[17px]">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
