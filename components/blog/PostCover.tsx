/** Brand illustration per category, so posts look designed without stock photos. */
export function PostCover({ category, className = "" }: { category: string; className?: string }) {
  const kind = /review/i.test(category) ? "reviews" : /growth/i.test(category) ? "growth" : "google";
  return (
    <div className={`relative overflow-hidden bg-ink ${className}`} aria-hidden>
      {/* soft grid */}
      <svg className="absolute inset-0 size-full opacity-[0.18]" preserveAspectRatio="none">
        <defs>
          <pattern id={`g-${kind}`} width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M32 0H0v32" fill="none" stroke="#3a4a3f" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#g-${kind})`} />
      </svg>
      <div className="absolute -right-16 -top-16 size-64 rounded-full bg-brand/25 blur-3xl" />

      <svg viewBox="0 0 400 240" className="absolute inset-0 size-full" preserveAspectRatio="xMidYMid meet">
        {kind === "google" && (
          <g>
            <path d="M40 200 C 120 140, 160 210, 230 150 S 330 110, 370 60" fill="none" stroke="#1e2a22" strokeWidth="22" strokeLinecap="round" />
            <path d="M40 200 C 120 140, 160 210, 230 150 S 330 110, 370 60" fill="none" stroke="#3a4a3f" strokeWidth="2" strokeDasharray="8 10" />
            <circle cx="120" cy="170" r="7" fill="#3a4a3f" />
            <circle cx="300" cy="112" r="7" fill="#3a4a3f" />
            <g transform="translate(206 62)">
              <path d="M24 0C11 0 0 10.5 0 23.5 0 41 24 60 24 60s24-19 24-36.5C48 10.5 37 0 24 0Z" fill="#22c55e" transform="scale(1.5)" />
              <circle cx="36" cy="35" r="12" fill="#0b0f0c" />
            </g>
            <ellipse cx="242" cy="156" rx="22" ry="6" fill="#22c55e" opacity="0.35" />
          </g>
        )}
        {kind === "growth" && (
          <g>
            {[0, 1, 2, 3, 4].map((i) => (
              <rect key={i} x={70 + i * 56} y={190 - (i + 1) * 26} width="34" height={(i + 1) * 26} rx="8" fill={i === 4 ? "#22c55e" : "#1e2a22"} />
            ))}
            <path d="M70 160 L130 140 L190 120 L250 86 L330 44" fill="none" stroke="#22c55e" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M306 40 L332 42 L328 68" fill="none" stroke="#22c55e" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        )}
        {kind === "reviews" && (
          <g>
            <rect x="70" y="70" width="260" height="100" rx="24" fill="#121a15" stroke="#1e2a22" strokeWidth="2" />
            {[0, 1, 2, 3, 4].map((i) => (
              <path
                key={i}
                transform={`translate(${96 + i * 44} 96)`}
                d="M18 0l5.4 11.2 12.2 1.8-8.8 8.6 2 12.2L18 28l-10.8 5.8 2-12.2L.4 13l12.2-1.8Z"
                fill={i < 4 ? "#22c55e" : "#3a4a3f"}
              />
            ))}
            <rect x="96" y="144" width="150" height="8" rx="4" fill="#1e2a22" />
            <circle cx="320" cy="72" r="22" fill="#22c55e" />
            <path d="M310 72l7 7 13-14" fill="none" stroke="#0b0f0c" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        )}
      </svg>
    </div>
  );
}
