export function Checklist({ items }: { items: { title: string; text: string }[] }) {
  return (
    <ul className="grid grid-cols-1 gap-x-12 md:grid-cols-2">
      {items.map((it) => (
        <li key={it.title} className="flex items-start gap-3.5 border-t border-gray-200 py-5">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#15803D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="mt-0.5 flex-none">
            <path d="M20 6 9 17l-5-5" />
          </svg>
          <div className="flex flex-col gap-1">
            <span className="text-lg font-semibold">{it.title}</span>
            <span className="text-base leading-relaxed text-gray-600">{it.text}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
