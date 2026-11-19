"use client";

import { useMemo, useState } from "react";
import { faqGroups } from "@/lib/content";
import { site } from "@/lib/site";
import { FaqList } from "./FaqList";

/** Full FAQ: search box, topic tabs, and grouped questions. */
export function FaqExplorer() {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("all");

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    return faqGroups
      .filter((g) => topic === "all" || g.id === topic)
      .map((g) => ({ ...g, items: q ? g.items.filter((f) => `${f.q} ${f.a}`.toLowerCase().includes(q)) : g.items }))
      .filter((g) => g.items.length);
  }, [query, topic]);

  const tabs = [{ id: "all", title: "All" }, ...faqGroups.map(({ id, title }) => ({ id, title }))];

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[16.25rem_minmax(0,1fr)] lg:gap-16">
      <aside className="flex flex-col gap-6 lg:sticky lg:top-28 lg:self-start">
        <label className="relative block">
          <span className="sr-only">Search questions</span>
          <svg viewBox="0 0 24 24" className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
            <circle cx="11" cy="11" r="6" />
            <path d="m20 20-4.5-4.5" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search questions"
            className="w-full rounded-full border border-gray-300 bg-white py-3.5 pl-12 pr-4 text-base outline-none focus:border-brand focus:ring-2 focus:ring-brand-tint"
          />
        </label>
        <nav aria-label="FAQ topics" className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-1 lg:mx-0 lg:flex-col lg:gap-1 lg:overflow-visible lg:px-0">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTopic(t.id)}
              aria-pressed={topic === t.id}
              className={`whitespace-nowrap rounded-full px-4 py-2.5 text-left text-[0.9375rem] font-semibold transition-colors lg:rounded-xl ${
                topic === t.id ? "bg-ink text-white" : "bg-mist text-gray-700 hover:bg-gray-200 lg:bg-transparent"
              }`}
            >
              {t.title}
            </button>
          ))}
        </nav>
        <div className="hidden flex-col gap-3 rounded-[22px] bg-ink p-6 text-white lg:flex">
          <p className="font-display text-lg font-semibold">Can’t find your answer?</p>
          <p className="text-[0.9375rem] text-muted-dark">Ask on WhatsApp. A real person replies.</p>
          <a href={site.whatsapp} className="self-start rounded-full bg-brand px-5 py-2.5 text-[0.9375rem] font-semibold text-ink">
            Ask us
          </a>
        </div>
      </aside>

      <div className="flex min-w-0 flex-col gap-12">
        {groups.length ? (
          groups.map((g) => (
            <section key={g.id} className="flex flex-col gap-5">
              <h2 className="font-display text-[1.625rem] font-bold tracking-[-0.5px]">{g.title}</h2>
              <FaqList items={g.items} />
            </section>
          ))
        ) : (
          <div className="flex flex-col items-start gap-4 rounded-[24px] bg-mist p-8">
            <p className="font-display text-xl font-semibold">No question matches “{query}”.</p>
            <a href={site.whatsapp} className="rounded-full bg-brand px-5 py-3 font-semibold text-ink">
              Ask us on WhatsApp
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
