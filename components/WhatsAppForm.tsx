"use client";

import { useEffect, useRef, useState } from "react";
import { track } from "@/components/MetaPixel";
import { services } from "@/lib/content";
import { CALLBACK_TEXT, site } from "@/lib/site";

const WA_LINK = /^https:\/\/(wa\.me|api\.whatsapp\.com)\//i;
const SAVED_KEY = "nv-contact";

type Open = { context: string; callback: boolean };

/**
 * Every WhatsApp link on the site opens this short form first.
 * On submit the lead is emailed to the team (so it is never lost), then WhatsApp opens
 * with all the details already typed, so the visitor only has to tap Send.
 * Without JavaScript the links still go straight to WhatsApp.
 */
export function WhatsAppForm() {
  const [open, setOpen] = useState<Open | null>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || a.dataset.direct !== undefined || !WA_LINK.test(a.href)) return;
      e.preventDefault();
      const text = new URL(a.href).searchParams.get("text") ?? "";
      setOpen({ context: text === CALLBACK_TEXT ? "" : text, callback: text === CALLBACK_TEXT });
    }
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return open ? <Dialog {...open} onClose={() => setOpen(null)} /> : null;
}

function load(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(SAVED_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function Dialog({ context, callback, onClose }: Open & { onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [error, setError] = useState("");
  const [waUrl, setWaUrl] = useState("");
  const [saved] = useState(load);

  useEffect(() => {
    ref.current?.showModal();
  }, []);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const name = d.name?.trim() ?? "";
    const phone = d.phone?.trim() ?? "";
    if (!name || phone.replace(/\D/g, "").length < 10) {
      setError("Please add your name and a 10-digit WhatsApp number.");
      return;
    }
    setError("");
    const wantsCall = d.contact === "call";

    const lines = [
      wantsCall ? "Hi NearbyVisible, please call me back on WhatsApp." : "Hi NearbyVisible 👋",
      "",
      `Name: ${name}`,
      d.business?.trim() && `Business: ${d.business.trim()}`,
      d.city?.trim() && `City: ${d.city.trim()}`,
      d.service && `Need help with: ${d.service}`,
      d.message?.trim() && `Message: ${d.message.trim()}`,
      context && `\n${context}`,
    ].filter(Boolean);
    const url = `${site.whatsapp}?text=${encodeURIComponent(lines.join("\n"))}`;

    // Save the lead first. keepalive lets it finish even while WhatsApp takes over the screen.
    if (!d.website) {
      fetch("/api/lead", {
        method: "POST",
        keepalive: true,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          source: "whatsapp",
          name,
          phone,
          business: d.business,
          city: d.city,
          service: d.service,
          intent: wantsCall ? "WhatsApp call back" : "WhatsApp chat",
          message: [d.message?.trim(), context].filter(Boolean).join("\n\n"),
          page: window.location.pathname,
        }),
      }).catch(() => {});
    }
    try {
      localStorage.setItem(SAVED_KEY, JSON.stringify({ name, phone, business: d.business ?? "", city: d.city ?? "" }));
    } catch {
      // Private mode: nothing to remember.
    }
    track("Contact", { content_name: wantsCall ? "whatsapp_callback" : "whatsapp_chat" });

    // Open WhatsApp in the same click so browsers do not block it.
    window.open(url, "_blank", "noopener");
    setWaUrl(url);
  }

  const input =
    "w-full rounded-[14px] border border-gray-300 bg-white px-4 py-3.5 text-base text-[#111111] outline-none focus:border-brand focus:ring-2 focus:ring-brand-tint";

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && ref.current?.close()}
      className="m-auto max-h-[calc(100dvh-32px)] w-[min(480px,calc(100vw-32px))] overflow-y-auto rounded-[28px] p-0 text-[#111111] shadow-[0_40px_100px_-30px_rgba(0,0,0,0.6)] backdrop:bg-ink/60 backdrop:backdrop-blur-sm"
    >
      <div className="flex flex-col gap-5 p-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="flex items-center gap-2 text-sm font-semibold text-[#128C7E]">
              <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
                <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.5-3.9-4.7-4.1-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.3.5-.4.4c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.5.1.6-.1l.9-1.1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.2.1.7-.1 1.4Z" />
              </svg>
              WhatsApp
            </span>
            <h2 className="font-display text-2xl font-bold">{waUrl ? "Almost done!" : callback ? "Get a call back on WhatsApp" : "Chat with us on WhatsApp"}</h2>
          </div>
          <button
            type="button"
            onClick={() => ref.current?.close()}
            aria-label="Close"
            className="flex size-9 flex-none items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:bg-mist"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden>
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {waUrl ? (
          <div className="flex flex-col gap-4">
            <p className="text-[17px] text-gray-700">
              We have your details. WhatsApp is open with your message ready — just tap <b>Send</b>.
            </p>
            <a
              href={waUrl}
              data-direct
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[#25D366] px-6 py-3.5 text-center font-semibold text-ink transition-transform hover:-translate-y-0.5"
            >
              WhatsApp did not open? Tap here
            </a>
            <button type="button" onClick={() => ref.current?.close()} className="self-center text-sm font-semibold text-gray-500 hover:underline">
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="relative flex flex-col gap-3">
            <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 opacity-0" />
            <p className="text-[15px] text-gray-600">A few details so we can help you faster. We reply on WhatsApp.</p>
            <input name="name" defaultValue={saved.name} placeholder="Your name" autoComplete="name" aria-label="Your name" className={input} />
            <input name="phone" defaultValue={saved.phone} type="tel" placeholder="WhatsApp number" autoComplete="tel" aria-label="WhatsApp number" className={input} />
            <div className="grid grid-cols-2 gap-3">
              <input name="business" defaultValue={saved.business} placeholder="Business name" aria-label="Business name" className={input} />
              <input name="city" defaultValue={saved.city} placeholder="City" aria-label="City" className={input} />
            </div>
            <select name="service" defaultValue="" aria-label="What do you need help with?" className={input}>
              <option value="">What do you need help with?</option>
              {services.map((s) => (
                <option key={s.slug} value={s.name}>
                  {s.name}
                </option>
              ))}
              <option value="Not sure yet">Not sure yet, want advice</option>
            </select>
            <textarea name="message" rows={2} placeholder="Anything else? (optional)" aria-label="Message" className={`${input} resize-none`} />
            <fieldset className="flex flex-col gap-2 sm:flex-row sm:gap-3">
              <legend className="sr-only">How should we reach you?</legend>
              <Choice name="contact" value="chat" defaultChecked={!callback} label="Chat on WhatsApp" />
              <Choice name="contact" value="call" defaultChecked={callback} label="Call me on WhatsApp" />
            </fieldset>
            {error && (
              <p role="alert" className="text-sm font-medium text-red-700">
                {error}
              </p>
            )}
            <button type="submit" className="mt-1 rounded-full bg-[#25D366] px-6 py-3.5 font-semibold text-ink transition-transform hover:-translate-y-0.5">
              Continue to WhatsApp →
            </button>
          </form>
        )}
      </div>
    </dialog>
  );
}

function Choice({ name, value, label, defaultChecked }: { name: string; value: string; label: string; defaultChecked: boolean }) {
  return (
    <label className="flex flex-1 cursor-pointer items-center gap-2.5 rounded-[14px] border border-gray-300 px-4 py-3 text-[15px] font-medium has-[:checked]:border-brand has-[:checked]:bg-brand-wash">
      <input type="radio" name={name} value={value} defaultChecked={defaultChecked} className="accent-[#22c55e]" />
      {label}
    </label>
  );
}
