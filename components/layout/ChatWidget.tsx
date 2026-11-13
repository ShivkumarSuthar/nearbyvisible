"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { whatsappLink } from "@/lib/site";

const options = [
  { label: "Get a free Google audit", message: "Hi NearbyVisible, I want a free Google audit for my business." },
  { label: "I need a website", message: "Hi NearbyVisible, I need a website for my business." },
  { label: "Set up my Google profile", message: "Hi NearbyVisible, please help me set up my Google profile." },
  { label: "Something else", message: "Hi NearbyVisible, I have a question." },
];

export function ChatWidget() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-3.5">
      {open && (
        <div id="chat-panel" role="dialog" aria-label="Chat with NearbyVisible" className="flex w-[340px] max-w-[calc(100vw-48px)] flex-col overflow-hidden rounded-3xl bg-white shadow-[0_24px_64px_-16px_rgba(0,0,0,0.35)]">
          <div className="flex items-center gap-3 bg-ink px-5 py-[18px] text-white">
            <Image src="/logo-icon.svg" alt="" width={36} height={36} />
            <div className="flex flex-col gap-0.5">
              <span className="font-display text-base font-semibold">NearbyVisible</span>
              <span className="text-[13px] text-muted-dark">Usually replies on WhatsApp</span>
            </div>
          </div>
          <div className="flex flex-col gap-3.5 bg-mist p-5">
            <p className="max-w-[260px] self-start rounded-[18px_18px_18px_4px] bg-white px-4 py-3 text-[15px] leading-normal">
              Hi! Namaste. How can we help your business today?
            </p>
            <div className="flex flex-col gap-2">
              {options.map((o) => (
                <a
                  key={o.label}
                  href={whatsappLink(o.message)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-gray-300 bg-white px-4 py-2.5 text-[15px] font-medium transition-colors hover:border-brand-dark"
                >
                  {o.label}
                </a>
              ))}
            </div>
          </div>
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="bg-brand py-3.5 text-center text-[15px] font-semibold text-ink">
            Start chat on WhatsApp
          </a>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls="chat-panel"
        aria-label={open ? "Close chat" : "Open chat"}
        className="flex size-[60px] items-center justify-center rounded-full bg-brand text-ink shadow-[0_12px_32px_-8px_rgba(0,0,0,0.35)] transition-transform hover:scale-105"
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          {open ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.8A8 8 0 1 1 21 12z" />}
        </svg>
      </button>
    </div>
  );
}
