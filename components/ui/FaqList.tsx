"use client";

import { useState } from "react";
import type { Faq } from "@/lib/content";

/** True accordion of question cards: only one question open at a time. */
export function FaqList({ items, openFirst = false }: { items: Faq[]; openFirst?: boolean }) {
  const [openIndex, setOpenIndex] = useState<number | null>(openFirst ? 0 : null);

  return (
    <div className="flex flex-col gap-3">
      {items.map((f, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={f.q}
            className={`rounded-[22px] border transition-colors ${
              isOpen
                ? "border-brand/50 bg-brand-wash/60"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full cursor-pointer items-center justify-between gap-6 px-6 py-5 text-left"
            >
              <span className="font-display text-[1.125rem] font-semibold leading-snug text-ink sm:text-[1.1875rem]">
                {f.q}
              </span>
              <span
                className={`flex size-9 flex-none items-center justify-center rounded-full text-[#111111] transition-transform ${
                  isOpen ? "rotate-45 bg-brand" : "bg-mist"
                }`}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </span>
            </button>
            {isOpen && (
              <p className="max-w-[45rem] px-6 pb-6 text-[1rem] leading-relaxed text-gray-700 sm:text-[1.0625rem]">
                {f.a}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
