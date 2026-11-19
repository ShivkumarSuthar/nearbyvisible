"use client";

import { useState } from "react";
import { track } from "@/components/MetaPixel";
import { HONEYPOT, indianMobile, validEmail } from "@/lib/phone";
import { Turnstile, resetTurnstile, turnstileToken } from "./Turnstile";

export type LeadState = "idle" | "sending" | "sent";

/** Shared submit logic for every lead form. Reads named fields from the <form>. */
export function useLeadForm(source: "service-request" | "contact" | "plan-quote", extra: () => Record<string, string> = () => ({})) {
  const [state, setState] = useState<LeadState>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    if (!data.name?.trim() || !indianMobile(data.phone)) {
      setError("Please add your name and a 10-digit phone number.");
      return;
    }
    if (data.email?.trim() && !validEmail(data.email)) {
      setError("Please check your email address, or leave it empty.");
      return;
    }
    setError("");
    setState("sending");
    try {
      data["cf-turnstile-response"] = await turnstileToken(form);
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...data, ...extra(), source, page: window.location.pathname }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error ?? "Something went wrong.");
      setState("sent");
      track("Lead", { content_name: source });
    } catch (err) {
      // fetch() throws a TypeError ("Failed to fetch") when the phone is offline.
      setError(err instanceof TypeError ? "No internet connection. Please try again, or message us on WhatsApp." : (err as Error).message);
      setState("idle");
    } finally {
      resetTurnstile(form);
    }
  }

  return { state, error, onSubmit, reset: () => setState("idle") };
}

/** Bot protection for a form: a hidden field bots fill and people do not, plus Cloudflare Turnstile when it is set up. */
export function Honeypot() {
  return (
    <>
      <input type="text" name={HONEYPOT} tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 opacity-0" />
      <Turnstile />
    </>
  );
}
