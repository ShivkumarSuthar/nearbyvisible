export function HeroMap() {
  return (
    <svg viewBox="0 0 480 440" className="block h-auto w-full" aria-hidden="true">
      <rect width="480" height="440" rx="36" fill="#121A15" />
      <g stroke="#1E2A22" strokeWidth="10" strokeLinecap="round">
        <path d="M-10 110 H490" /><path d="M-10 250 H490" /><path d="M-10 370 H490" />
        <path d="M120 -10 V450" /><path d="M300 -10 V450" /><path d="M420 -10 V450" />
      </g>
      <g stroke="#18231C" strokeWidth="4">
        <path d="M-10 180 L490 60" /><path d="M40 450 L460 300" />
      </g>
      <g fill="#3A4A3F">
        <circle cx="70" cy="70" r="9" /><circle cx="380" cy="160" r="9" /><circle cx="200" cy="330" r="9" />
        <circle cx="420" cy="400" r="9" /><circle cx="60" cy="310" r="9" />
      </g>
      <circle cx="250" cy="200" r="120" fill="none" stroke="#22C55E" strokeOpacity="0.12" strokeWidth="2" className="motion-safe:animate-pulse" />
      <circle cx="250" cy="200" r="80" fill="none" stroke="#22C55E" strokeOpacity="0.22" strokeWidth="2" />
      <circle cx="250" cy="200" r="44" fill="#22C55E" fillOpacity="0.12" />
      <g transform="translate(205 120) scale(0.75)">
        <path d="M60 8 C31 8 8 31 8 60 C8 97 60 146 60 146 C60 146 112 97 112 60 C112 31 89 8 60 8 Z" fill="#22C55E" />
        <circle cx="60" cy="58" r="27" fill="#FFFFFF" />
        <circle cx="60" cy="58" r="17" fill="#111111" />
        <circle cx="66" cy="52" r="3.5" fill="#FFFFFF" />
      </g>
      <g transform="translate(300 300)">
        <rect width="160" height="60" rx="16" fill="#FFFFFF" />
        <circle cx="30" cy="30" r="14" fill="#22C55E" />
        <rect x="54" y="18" width="84" height="10" rx="5" fill="#111111" />
        <rect x="54" y="34" width="56" height="8" rx="4" fill="#9AA79F" />
      </g>
    </svg>
  );
}
