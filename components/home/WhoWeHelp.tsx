"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { site } from "@/lib/site";

/* A conversation: what owners tell us, and how we answer. */
const thread = [
  {
    pain: "Customers keep saying they couldn’t find us on Google.",
    reply: "We’ll set up and complete your Google profile, with the right category and an exact Maps pin.",
    service: { label: "Google Presence", slug: "google-presence" },
  },
  {
    pain: "We barely have any reviews.",
    reply: "You’ll get one simple review link and a habit for asking every happy customer.",
    service: { label: "Business Growth", slug: "business-growth" },
  },
  {
    pain: "Our website is old and slow. Honestly, we don’t even update it.",
    reply: "A fast, mobile-first site with a WhatsApp button, and we keep it updated every month.",
    service: { label: "Website", slug: "website" },
  },
  {
    pain: "People message us, but by the time we reply, they’ve gone elsewhere.",
    reply: "Quick replies, a catalogue and follow-ups on WhatsApp Business, so nobody waits.",
    service: { label: "Business Growth", slug: "business-growth" },
  },
];

export function WhoWeHelp() {
  const reduce = useReducedMotion();
  const appear = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 16, scale: 0.98 },
          whileInView: { opacity: 1, y: 0, scale: 1 },
          viewport: { once: true, margin: "-12% 0px" },
          transition: { duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <section className="bg-mist">
      <div className="mx-auto grid max-w-[1240px] grid-cols-1 gap-14 px-6 py-32 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        {/* Left: the message */}
        <div className="flex flex-col gap-6 lg:sticky lg:top-28 lg:self-start">
          <p className="text-[15px] font-semibold tracking-wide text-brand-dark">Who we help</p>
          <h2 className="font-display text-[clamp(32px,3.6vw,46px)] font-bold leading-[1.08] tracking-[-1.2px]">
            Sound familiar?
            <span className="block text-gray-400">We hear it daily.</span>
          </h2>
          <p className="max-w-[440px] text-[19px] leading-relaxed text-gray-600">
            We work with business owners who do great work but lose customers online. If any of these messages could be
            yours, we can help.
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-3">
            <a
              href={site.whatsapp}
              className="rounded-full bg-brand px-6 py-3.5 font-semibold text-ink transition-transform hover:-translate-y-0.5"
            >
              Send us your problem
            </a>
            <Link
              href="/check"
              className="font-semibold text-brand-dark underline-offset-4 hover:underline"
            >
              or get your free Visibility Score →
            </Link>
          </div>
        </div>

        {/* Right: the chat */}
        <div className="overflow-hidden rounded-[32px] border border-gray-200 bg-white shadow-[0_40px_80px_-40px_rgba(17,17,17,0.25)]">
          <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4">
            <span className="flex size-10 items-center justify-center rounded-full bg-ink font-display text-sm font-bold text-brand">NV</span>
            <div className="flex flex-col">
              <span className="text-[15px] font-semibold">NearbyVisible</span>
              <span className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className="size-1.5 rounded-full bg-brand" /> On WhatsApp
              </span>
            </div>
          </div>

          <ol className="flex flex-col gap-3 bg-[#f4f6f5] bg-[radial-gradient(#e3e8e5_1px,transparent_1px)] px-4 py-8 [background-size:18px_18px] sm:px-8">
            {thread.map((m) => (
              <li key={m.pain} className="flex flex-col gap-3">
                <motion.div {...appear(0)} className="max-w-[82%] self-start">
                  <p className="rounded-[20px] rounded-bl-md bg-white px-4 py-3 text-[16px] leading-snug text-[#111111] shadow-[0_1px_2px_rgba(17,17,17,0.08)]">
                    {m.pain}
                  </p>
                </motion.div>
                <motion.div {...appear(0.25)} className="mb-3 max-w-[82%] self-end">
                  <div className="rounded-[20px] rounded-br-md bg-brand-tint px-4 py-3 text-[16px] leading-snug text-[#0f2e1a] shadow-[0_1px_2px_rgba(17,17,17,0.08)]">
                    <p>{m.reply}</p>
                    <div className="mt-2 flex items-center justify-between gap-4">
                      <Link
                        href={`/services/${m.service.slug}`}
                        className="text-sm font-semibold text-brand-dark underline-offset-4 hover:underline"
                      >
                        {m.service.label} →
                      </Link>
                      <span aria-hidden className="text-[11px] text-brand-dark/60">✓✓</span>
                    </div>
                  </div>
                </motion.div>
              </li>
            ))}
            <li className="flex flex-col gap-3">
              <motion.p {...appear(0)} className="max-w-[82%] self-start rounded-[20px] rounded-bl-md bg-white px-4 py-3 text-[16px] font-medium leading-snug shadow-[0_1px_2px_rgba(17,17,17,0.08)]">
                So where do we start?
              </motion.p>
              <motion.div {...appear(0.25)} className="self-end">
                <Link
                  href="/check"
                  className="flex items-center gap-2 rounded-[20px] rounded-br-md bg-brand px-5 py-3.5 text-[16px] font-semibold text-ink shadow-[0_8px_20px_-8px_rgba(34,197,94,0.6)] transition-transform hover:-translate-y-0.5"
                >
                  With your free Visibility Score →
                </Link>
              </motion.div>
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
}
