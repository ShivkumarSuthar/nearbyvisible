"use client";

import { useEffect, useRef, useState } from "react";
import { Honeypot, useLeadForm } from "./useLeadForm";

type Intent = "Get started" | "Exact quote";

/** "Get started" and "Know more" for a plan. Both open a short form that emails the team. */
export function QuoteButtons({ plan, dark }: { plan: string; dark?: boolean }) {
  const [intent, setIntent] = useState<Intent | null>(null);
  return (
    <>
      <div className="flex flex-col gap-2.5">
        <button
          type="button"
          onClick={() => setIntent("Get started")}
          className={`rounded-full px-6 py-3.5 text-center font-semibold transition-transform hover:-translate-y-0.5 ${dark ? "bg-brand text-ink" : "bg-ink text-white"}`}
        >
          Get started
        </button>
        <button
          type="button"
          onClick={() => setIntent("Exact quote")}
          className={`rounded-full border px-6 py-3.5 text-center font-semibold transition-colors ${
            dark ? "border-edge-dark text-white hover:border-brand hover:text-brand" : "border-gray-300 hover:border-[#111111]"
          }`}
        >
          Know more and get exact quote
        </button>
      </div>
      {intent && <QuoteDialog plan={plan} intent={intent} onClose={() => setIntent(null)} />}
    </>
  );
}

function QuoteDialog({ plan, intent, onClose }: { plan: string; intent: Intent; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const { state, error, onSubmit } = useLeadForm("plan-quote", () => ({ plan, intent }));

  useEffect(() => {
    ref.current?.showModal();
  }, []);

  const input =
    "w-full rounded-[14px] border border-gray-300 bg-white px-4 py-3.5 text-base text-[#111111] outline-none focus:border-brand focus:ring-2 focus:ring-brand-tint";

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && ref.current?.close()}
      className="m-auto w-[min(480px,calc(100vw-32px))] rounded-[28px] p-0 text-[#111111] shadow-[0_40px_100px_-30px_rgba(0,0,0,0.6)] backdrop:bg-ink/60 backdrop:backdrop-blur-sm"
    >
      <div className="flex flex-col gap-5 p-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-brand-dark">{plan}</span>
            <h2 className="font-display text-2xl font-bold">
              {state === "sent" ? "Request received." : intent === "Get started" ? "Let’s get you started." : "Get your exact quote."}
            </h2>
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

        {state === "sent" ? (
          <div className="flex flex-col gap-4">
            <p className="text-[17px] text-gray-700">Thank you. We will look at your business and call you with an exact quote soon.</p>
            <button type="button" onClick={() => ref.current?.close()} className="self-start rounded-full bg-ink px-6 py-3 font-semibold text-white">
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate className="relative flex flex-col gap-3">
            <Honeypot />
            <p className="text-[15px] text-gray-600">Share a few details. We check your business first, then send a written quote.</p>
            <input name="name" placeholder="Your name" autoComplete="name" aria-label="Your name" className={input} />
            <input name="phone" type="tel" placeholder="Phone / WhatsApp" autoComplete="tel" aria-label="Phone or WhatsApp" className={input} />
            <div className="grid grid-cols-2 gap-3">
              <input name="business" placeholder="Business name" aria-label="Business name" className={input} />
              <input name="city" placeholder="City" aria-label="City" className={input} />
            </div>
            <textarea name="message" rows={2} placeholder="Anything we should know? (optional)" aria-label="Message" className={`${input} resize-none`} />
            {error && (
              <p role="alert" className="text-sm font-medium text-red-700">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={state === "sending"}
              className="mt-1 rounded-full bg-brand px-6 py-3.5 font-semibold text-ink transition-transform hover:-translate-y-0.5 disabled:opacity-60"
            >
              {state === "sending" ? "Sending…" : intent === "Get started" ? "Request a call back" : "Get my exact quote"}
            </button>
          </form>
        )}
      </div>
    </dialog>
  );
}
