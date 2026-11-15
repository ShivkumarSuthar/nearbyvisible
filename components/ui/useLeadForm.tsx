"use client";

import { useState } from "react";

export type LeadState = "idle" | "sending" | "sent";

/** Shared submit logic for every lead form. Reads named fields from the <form>. */
export function useLeadForm(source: "service-request" | "contact" | "plan-quote", extra: () => Record<string, string> = () => ({})) {
  const [state, setState] = useState<LeadState>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    if (!data.name?.trim() || (data.phone ?? "").replace(/\D/g, "").length < 10) {
      setError("Please add your name and a 10-digit phone number.");
      return;
    }
    setError("");
    setState("sending");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...data, ...extra(), source, page: window.location.pathname }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error ?? "Something went wrong.");
      setState("sent");
    } catch (err) {
      setError((err as Error).message);
      setState("idle");
    }
  }

  return { state, error, onSubmit, reset: () => setState("idle") };
}

/** Hidden field bots fill and people do not. */
export function Honeypot() {
  return (
    <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 opacity-0" />
  );
}
