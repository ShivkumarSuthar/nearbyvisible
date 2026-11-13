export function FaqList({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="flex flex-col border-b border-gray-200">
      {items.map((f) => (
        <details key={f.q} className="group border-t border-gray-200 py-6">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-display text-xl font-semibold [&::-webkit-details-marker]:hidden">
            {f.q}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true" className="flex-none transition-transform group-open:rotate-45">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </summary>
          <p className="mt-3 max-w-[760px] text-[17px] leading-relaxed text-gray-600">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
