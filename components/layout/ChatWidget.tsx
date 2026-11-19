"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { services } from "@/lib/content";
import { CALLBACK_TEXT, site, whatsappLink } from "@/lib/site";
import { Honeypot, useLeadForm } from "@/components/ui/useLeadForm";

const AUTO_OPEN_AFTER_MS = 25_000;
const SNOOZE_DAYS = 7;
const SNOOZE_KEY = "nv-request-snoozed-until";
const NO_AUTO_OPEN = ["/check", "/contact"];

type View = "menu" | "request" | "sent";

function snoozed() {
  try {
    return Number(localStorage.getItem(SNOOZE_KEY) ?? 0) > Date.now();
  } catch {
    return false;
  }
}

function snooze() {
  try {
    localStorage.setItem(SNOOZE_KEY, String(Date.now() + SNOOZE_DAYS * 86_400_000));
  } catch {
    /* storage blocked: the popup may show again, which is fine */
  }
}

export function ChatWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<View>("menu");
  const [auto, setAuto] = useState(false);
  const interacted = useRef(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLButtonElement>(null);

  // Escape closes the panel, unless a popup (e.g. the WhatsApp form) is open on top: that Escape is for the popup.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !document.querySelector("dialog[open]")) close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  });

  // Move focus into the panel when it opens (not for the automatic popup, which must not steal focus).
  useEffect(() => {
    if (open && !auto) panelRef.current?.focus();
  }, [open, auto]);

  // Never pop up on someone who is busy: typing in any form, or who has already sent one.
  useEffect(() => {
    const onFocus = (e: FocusEvent) => {
      const t = e.target as Element | null;
      if (t?.matches?.("input, textarea, select") && !panelRef.current?.contains(t)) interacted.current = true;
    };
    const onSubmit = () => {
      interacted.current = true;
      snooze();
    };
    document.addEventListener("focusin", onFocus);
    document.addEventListener("submit", onSubmit, true);
    return () => {
      document.removeEventListener("focusin", onFocus);
      document.removeEventListener("submit", onSubmit, true);
    };
  }, []);

  // Gently offer the request form once, after the visitor has spent some time on the page.
  useEffect(() => {
    if (NO_AUTO_OPEN.some((p) => pathname.startsWith(p)) || snoozed()) return;
    const t = setTimeout(() => {
      if (interacted.current || snoozed()) return;
      setView("request");
      setAuto(true);
      setOpen(true);
    }, AUTO_OPEN_AFTER_MS);
    return () => clearTimeout(t);
  }, [pathname]);

  function toggle() {
    interacted.current = true;
    if (open) return close();
    setView("menu");
    setAuto(false);
    setOpen(true);
  }

  function close() {
    if (auto) snooze();
    setOpen(false);
    bubbleRef.current?.focus();
  }

  return (
    <div className="fixed bottom-5 right-5 z-[60] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {open && (
        <div
          id="chat-panel"
          ref={panelRef}
          tabIndex={-1}
          role="dialog"
          aria-label="Contact NearbyVisible"
          className="w-[22.5rem] max-w-[calc(100vw-40px)] origin-bottom-right outline-none animate-[nv-pop_.22s_ease-out] rounded-[28px] bg-white p-5 shadow-[0_30px_80px_-20px_rgba(11,15,12,0.45)] ring-1 ring-black/5"
        >
          <div className="flex items-start justify-between gap-4 px-1">
            <div className="flex flex-col gap-1">
              <span className="font-display text-[1.1875rem] font-semibold text-[#111111]">
                {view === "request" ? "Request a service" : view === "sent" ? "Request received" : site.name}
              </span>
              <span className="text-[0.875rem] text-gray-500">
                {view === "request"
                  ? auto
                    ? "Need help getting more customers? Tell us in 20 seconds."
                    : "Tell us what you need and we will call you back."
                  : view === "sent"
                    ? "Thank you. We will contact you soon."
                    : "Hi! How can we help you today?"}
              </span>
            </div>
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="flex size-9 flex-none items-center justify-center rounded-full border border-gray-200 text-gray-600 transition-colors hover:bg-mist"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden>
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {view === "menu" && <Menu onRequest={() => setView("request")} onNavigate={() => setOpen(false)} />}
          {view === "request" && <RequestForm onBack={auto ? undefined : () => setView("menu")} onSent={() => setView("sent")} />}
          {view === "sent" && (
            <div className="mt-5 flex flex-col gap-3">
              <p className="rounded-2xl bg-brand-wash px-4 py-3 text-[0.9375rem] text-[#0f2e1a]">
                We have your details and will call or message you shortly.
              </p>
              <button type="button" onClick={() => setView("menu")} className="self-start text-[0.875rem] font-semibold text-brand-dark hover:underline">
                ← Back
              </button>
            </div>
          )}
        </div>
      )}

      <button
        ref={bubbleRef}
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-controls="chat-panel"
        aria-label={open ? "Close contact options" : "Contact us"}
        className="relative flex size-[60px] items-center justify-center rounded-full bg-brand text-ink shadow-[0_14px_34px_-10px_rgba(34,197,94,0.75)] transition-transform hover:scale-105"
      >
        {!open && <span aria-hidden className="absolute inset-0 animate-ping rounded-full bg-brand/40 [animation-duration:2.4s]" />}
        <svg className="relative" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          {open ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.8A8 8 0 1 1 21 12z" />}
        </svg>
      </button>
    </div>
  );
}

const row =
  "group flex w-full items-center gap-3.5 rounded-[18px] border border-gray-200 px-4 py-3.5 text-left text-[0.9375rem] font-semibold text-[#111111] transition-colors hover:border-brand hover:bg-brand-wash";

function Menu({ onRequest, onNavigate }: { onRequest: () => void; onNavigate: () => void }) {
  return (
    <div className="mt-5 flex flex-col gap-2.5">
      <a href={whatsappLink("Hi NearbyVisible, I have a question about my business.")} target="_blank" rel="noopener noreferrer" className={row}>
        <Icon className="text-[#25D366]">
          <path fill="currentColor" stroke="none" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.5-3.9-4.7-4.1-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.3.5-.4.4c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.5.1.6-.1l.9-1.1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.2.1.7-.1 1.4Z" />
        </Icon>
        Chat on WhatsApp
      </a>
      <a href={whatsappLink(CALLBACK_TEXT)} className={row}>
        <Icon>
          <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
        </Icon>
        Get a call back
      </a>
      <button type="button" onClick={onRequest} className={row}>
        <Icon>
          <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" />
          <path d="M14 3v5h5M9 13h6M9 17h4" />
        </Icon>
        Request a service
      </button>
      <Link href="/check" onClick={onNavigate} className={row}>
        <Icon>
          <circle cx="11" cy="11" r="6" />
          <path d="m20 20-4.5-4.5" />
        </Icon>
        Get your free Visibility Score
      </Link>
    </div>
  );
}

function RequestForm({ onBack, onSent }: { onBack?: () => void; onSent: () => void }) {
  const [service, setService] = useState("Not sure yet");
  const { state, error, onSubmit } = useLeadForm("service-request", () => ({ service }));

  useEffect(() => {
    if (state === "sent") {
      snooze();
      onSent();
    }
  }, [state, onSent]);

  const input =
    "w-full rounded-[14px] border border-gray-300 bg-white px-3.5 py-3 text-[0.9375rem] text-[#111111] outline-none focus:border-brand focus:ring-2 focus:ring-brand-tint";

  return (
    <form onSubmit={onSubmit} noValidate className="relative mt-5 flex flex-col gap-3">
      <Honeypot />
      <div className="grid grid-cols-2 gap-2.5">
        <input name="name" aria-label="Your name" placeholder="Your name" autoComplete="name" className={input} />
        <input name="phone" aria-label="Phone or WhatsApp" placeholder="Phone / WhatsApp" type="tel" autoComplete="tel" className={input} />
      </div>
      <input name="email" aria-label="Email (optional)" placeholder="Email (optional)" type="email" autoComplete="email" className={input} />
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-[0.8125rem] font-semibold text-gray-500">What do you need?</legend>
        <div className="flex flex-wrap gap-1.5">
          {["Not sure yet", ...services.map((s) => s.name)].map((name) => (
            <button
              key={name}
              type="button"
              aria-pressed={service === name}
              onClick={() => setService(name)}
              className={`rounded-full border px-3 py-1.5 text-[0.8125rem] font-semibold transition-colors ${
                service === name ? "border-ink bg-ink text-white" : "border-gray-200 text-gray-700 hover:border-gray-400"
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      </fieldset>
      <textarea name="message" aria-label="Anything else" placeholder="Anything else? (optional)" rows={2} className={`${input} resize-none`} />
      {error && (
        <p role="alert" className="text-[0.8125rem] font-medium text-red-700">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={state === "sending"}
        className="flex items-center justify-center gap-2 rounded-full bg-brand px-5 py-3.5 text-[0.9375rem] font-semibold text-ink transition-transform hover:-translate-y-0.5 disabled:opacity-60"
      >
        {state === "sending" ? "Sending…" : "Send request"}
      </button>
      {onBack && (
        <button type="button" onClick={onBack} className="self-start text-[0.875rem] font-semibold text-brand-dark hover:underline">
          ← Back
        </button>
      )}
    </form>
  );
}

function Icon({ children, className = "text-brand-dark" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`flex size-9 flex-none items-center justify-center rounded-full bg-mist transition-colors group-hover:bg-white ${className}`}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        {children}
      </svg>
    </span>
  );
}
