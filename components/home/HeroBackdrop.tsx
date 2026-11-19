/**
 * Brand backdrop for the hero, built from the logo's idea: a map pin, the streets around it,
 * and the "nearby" radius spreading out from it. Decorative only.
 */
export function HeroBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Streets: a quiet city map, fading out towards the headline so text stays clean */}
      <svg
        className="absolute inset-0 size-full [mask-image:radial-gradient(ellipse_70%_80%_at_78%_50%,#000_10%,transparent_75%)]"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <g stroke="#1e2a22" strokeLinecap="round">
          <g strokeWidth="14">
            <path d="M-20 260 H1460" />
            <path d="M-20 620 H1460" />
            <path d="M780 -20 V920" />
            <path d="M1220 -20 V920" />
          </g>
          <g strokeWidth="6">
            <path d="M-20 440 H1460" />
            <path d="M-20 790 H1460" />
            <path d="M560 -20 V920" />
            <path d="M1000 -20 V920" />
            <path d="M1380 -20 V920" />
            <path d="M-20 120 H1460" />
          </g>
          <g strokeWidth="10" stroke="#17221b">
            <path d="M600 940 C760 700 880 620 1060 520 S1360 300 1480 140" />
            <path d="M700 -20 C820 160 900 300 1100 380" />
          </g>
        </g>
        {/* Other businesses nearby: dim dots */}
        <g fill="#3a4a3f">
          <circle cx="680" cy="190" r="7" />
          <circle cx="1130" cy="150" r="7" />
          <circle cx="1320" cy="520" r="7" />
          <circle cx="880" cy="720" r="7" />
          <circle cx="1180" cy="760" r="7" />
          <circle cx="640" cy="520" r="7" />
        </g>
      </svg>

      {/* The "nearby" radius: rings centred behind the ranking card on desktop, lower on phones */}
      <svg
        className="absolute left-1/2 top-[78%] size-[900px] -translate-x-1/2 -translate-y-1/2 md:left-[74%] md:top-1/2 md:size-[1100px]"
        viewBox="0 0 1000 1000"
        fill="none"
      >
        <defs>
          <radialGradient id="nv-hero-glow">
            <stop offset="0" stopColor="#22c55e" stopOpacity="0.22" />
            <stop offset="0.6" stopColor="#22c55e" stopOpacity="0.04" />
            <stop offset="1" stopColor="#22c55e" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="500" cy="500" r="420" fill="url(#nv-hero-glow)" />
        {[160, 260, 360, 460].map((r, i) => (
          <circle key={r} cx="500" cy="500" r={r} stroke="#22c55e" strokeOpacity={0.16 - i * 0.03} strokeWidth="1.5" strokeDasharray={i % 2 ? "2 10" : undefined} />
        ))}
        {[0, 2, 4].map((d) => (
          <circle key={d} className="nv-ripple" style={{ animationDelay: `${d}s` }} cx="500" cy="500" r="480" stroke="#22c55e" strokeOpacity="0.35" strokeWidth="2" />
        ))}
      </svg>

    </div>
  );
}
