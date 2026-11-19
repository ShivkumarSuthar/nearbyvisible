"use client";

import { motion, useReducedMotion } from "motion/react";
import { journey } from "@/lib/content";

/*
 * Serpentine road: row 1 runs left → right, U-turns, row 2 runs right → left
 * and ends at the map pin. Fixed viewBox so nothing stretches; labels are HTML
 * positioned in % of the same box.
 */
const W = 1000;
const H = 700;
const Y1 = 160;
const Y2 = 370;
const Y3 = 580;
const R = (Y2 - Y1) / 2;
const RIGHT = 850;
const LEFT = 150;
const END = 900;
const BEGIN = 80;
const ROAD = `M ${BEGIN} ${Y1} L ${RIGHT} ${Y1} A ${R} ${R} 0 0 1 ${RIGHT} ${Y2} L ${LEFT} ${Y2} A ${R} ${R} 0 0 0 ${LEFT} ${Y3} L ${END} ${Y3}`;
// Stop 1 sits at the very start of the road, stop 6 at the very end.
const STOPS = [
  { x: BEGIN, y: Y1 },
  { x: 560, y: Y1 },
  { x: 640, y: Y2 },
  { x: 300, y: Y2 },
  { x: 440, y: Y3 },
  { x: END, y: Y3 },
];

const pct = (v: number, of: number) => `${(v / of) * 100}%`;

export function JourneyMap() {
  const reduce = useReducedMotion();

  return (
    <>
      {/* Desktop / tablet: wide serpentine map */}
      <div className="relative mx-auto hidden w-full max-w-[68.75rem] md:block" style={{ aspectRatio: `${W} / ${H}` }}>
        <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" aria-hidden>
          <path d={ROAD} fill="none" stroke="var(--color-line-dark)" strokeWidth={36} strokeLinecap="round" />
          <path d={ROAD} fill="none" stroke="var(--color-edge-dark)" strokeWidth={2} strokeDasharray="12 14" />
          <motion.path
            d={ROAD}
            fill="none"
            stroke="var(--color-brand)"
            strokeWidth={4}
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={reduce ? { duration: 0 } : { duration: 2.4, ease: "easeInOut" }}
          />
        </svg>

        {/* Destination label under the pin */}
        <p
          className="absolute whitespace-nowrap text-right font-display text-[clamp(1.125rem,2.2vw,1.75rem)] font-bold leading-tight text-white"
          style={{ right: pct(W - END - 22, W), top: pct(Y3 + 40, H) }}
        >
          Found. Trusted. <span className="text-brand">Called.</span>
        </p>

        {journey.map((s, i) => {
          const p = STOPS[i];
          const top = true; // every label sits above its stop
          return (
            <div key={s.title}>
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, margin: "-20%" }}
                transition={reduce ? { duration: 0 } : { delay: 0.3 + i * 0.35, type: "spring", stiffness: 300, damping: 18 }}
                className="absolute z-10 -ml-[22px] -mt-[22px] flex size-11 items-center justify-center rounded-full border-4 border-ink bg-brand font-display text-[0.9375rem] font-bold text-ink shadow-[0_0_0_6px_rgba(34,197,94,0.2)]"
                style={{ left: pct(p.x, W), top: pct(p.y, H) }}
              >
                {i + 1}
              </motion.span>
              <motion.div
                initial={{ opacity: 0, y: top ? 12 : -12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20%" }}
                transition={reduce ? { duration: 0 } : { delay: 0.4 + i * 0.35, duration: 0.5 }}
                className={`absolute flex w-[23%] flex-col gap-1 ${
                  p.x < 200 ? "text-left" : p.x > 800 ? "-translate-x-full text-right" : "-translate-x-1/2 text-center"
                }`}
                style={{
                  left: pct(p.x < 200 ? p.x - 22 : p.x > 800 ? p.x + 22 : p.x, W),
                  ...(top ? { bottom: pct(H - p.y + 38, H) } : { top: pct(p.y + 38, H) }),
                }}
              >
                <h3 className="font-display text-[clamp(0.9375rem,1.7vw,1.25rem)] font-semibold leading-tight text-white">{s.title}</h3>
                <p className="text-[clamp(0.75rem,1.25vw,0.9375rem)] leading-snug text-muted-dark">{s.get}</p>
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Mobile: compact vertical road */}
      <ol className="relative flex flex-col gap-6 pl-14 md:hidden">
        <span aria-hidden className="absolute bottom-3 left-[21px] top-3 w-[2px] bg-edge-dark" />
        {journey.map((s, i) => (
          <li key={s.title} className="relative">
            <span className="absolute -left-14 top-0 flex size-11 items-center justify-center rounded-full border-4 border-ink bg-brand font-display text-[0.9375rem] font-bold text-ink">
              {i + 1}
            </span>
            <h3 className="font-display text-[1.1875rem] font-semibold text-white">{s.title}</h3>
            <p className="mt-1 text-[0.9375rem] leading-snug text-muted-dark">{s.get}</p>
          </li>
        ))}
        <li className="relative font-display text-[1.375rem] font-bold text-white">
          <span className="absolute -left-14 top-0 flex size-11 items-center justify-center rounded-full bg-brand text-ink">★</span>
          Found. Trusted. <span className="text-brand">Called.</span>
        </li>
      </ol>
    </>
  );
}
