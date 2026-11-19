"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

/**
 * Hero visual: a Google Maps style result list where "your business" climbs from the bottom to #1.
 * The search term rotates so every kind of business owner sees themselves. All names are clearly examples.
 */
const SEARCHES = [
  { query: "dentist near me", you: "Your Dental Clinic", others: ["Smile Care Dental", "City Dental Studio", "Bright Teeth Clinic"] },
  { query: "salon near me", you: "Your Salon", others: ["Glow Beauty Lounge", "Style Studio", "The Hair Bar"] },
  { query: "CA near me", you: "Your CA Firm", others: ["Gupta & Associates", "Tax Point", "Ledger Advisors"] },
  { query: "gym near me", you: "Your Gym", others: ["Iron Fitness", "FitZone", "Pulse Gym"] },
];

const STEP_MS = 2600;

type Row = { name: string; you: boolean };

export function HeroRanking() {
  const reduce = useReducedMotion();
  const [search, setSearch] = useState(0);
  const [climbed, setClimbed] = useState(false);

  // Each search: show "you" last, then climb to #1, then move to the next search.
  useEffect(() => {
    // Reduced motion: settle on the final state and stay there. Done in an effect, not during render,
    // so the server HTML and the first client render match.
    if (reduce) {
      setClimbed(true);
      return;
    }
    const t = setTimeout(() => {
      if (!climbed) setClimbed(true);
      else {
        setClimbed(false);
        setSearch((s) => (s + 1) % SEARCHES.length);
      }
    }, climbed ? STEP_MS * 1.6 : STEP_MS);
    return () => clearTimeout(t);
  }, [climbed, reduce]);

  const s = SEARCHES[search];
  const top = climbed;
  const rows: Row[] = top
    ? [{ name: s.you, you: true }, ...s.others.map((name) => ({ name, you: false }))]
    : [...s.others.map((name) => ({ name, you: false })), { name: s.you, you: true }];

  return (
    <div className="relative mx-auto w-full max-w-[27.5rem]">
      {/* Soft glow behind the card */}
      <div aria-hidden="true" className="absolute -inset-6 rounded-[48px] bg-brand/10 blur-3xl" />

      <div
        role="img"
        aria-label={`Example: a Google Maps search for "${s.query}" where your business moves to the top result.`}
        className="relative flex flex-col gap-3 rounded-[32px] border border-line-dark bg-[#121A15] p-4 shadow-2xl sm:p-5"
      >
        <div className="flex items-center gap-3 rounded-full bg-white px-4 py-3 text-[0.9375rem] text-[#111111]">
          <svg viewBox="0 0 24 24" className="size-4 flex-none text-gray-500" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" aria-hidden="true">
            <circle cx="11" cy="11" r="6" />
            <path d="m20 20-4.5-4.5" />
          </svg>
          <span key={s.query} className="truncate motion-safe:animate-[nv-pop_.3s_ease-out]">
            {s.query}
          </span>
        </div>

        <ul className="flex flex-col gap-2">
          {rows.map((r, i) => (
            <motion.li
              key={`${search}-${r.name}`}
              layout={!reduce}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
              className={`flex items-center gap-3 rounded-2xl p-3 ${r.you ? (top ? "bg-white text-[#111111] ring-2 ring-brand" : "bg-white/90 text-[#111111]") : "bg-ink-soft text-white/80"}`}
            >
              <span className={`flex size-8 flex-none items-center justify-center rounded-full font-display text-sm font-bold ${r.you && top ? "bg-brand text-ink" : r.you ? "bg-gray-200 text-gray-600" : "bg-white/10 text-white/60"}`}>
                {i + 1}
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-[0.9375rem] font-semibold">{r.name}</span>
                <span className={`text-xs ${r.you ? "text-gray-500" : "text-white/40"}`}>
                  {r.you ? (top ? "★ 4.8 · Open now · 1.2 km" : "No reviews · No photos") : `★ ${(4.1 + ((r.name.length * 7) % 7) / 10).toFixed(1)} · ${1 + (r.name.length % 4)} km`}
                </span>
              </span>
              {r.you && top && <span className="flex-none rounded-full bg-brand px-3 py-1.5 text-xs font-bold text-ink">Call</span>}
            </motion.li>
          ))}
        </ul>

        <p className="px-1 text-center text-xs text-white/40">Example search. Names are for illustration.</p>
      </div>
    </div>
  );
}
