"use client";

import { useEffect, useRef } from "react";

/**
 * Cloudflare Turnstile widget. Renders nothing unless NEXT_PUBLIC_TURNSTILE_SITE_KEY is set.
 * "interaction-only" keeps it invisible for almost everyone; a small box appears only if Cloudflare
 * needs a click. The widget puts its token in a hidden "cf-turnstile-response" field inside the form.
 */
const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const FIELD = "cf-turnstile-response";

type TurnstileApi = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  reset: (id: string) => void;
  remove: (id: string) => void;
};
declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

let scriptPromise: Promise<void> | null = null;
function loadScript() {
  if (window.turnstile) return Promise.resolve();
  scriptPromise ??= new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => {
      scriptPromise = null;
      reject(new Error("Turnstile failed to load"));
    };
    document.head.appendChild(s);
  });
  return scriptPromise;
}

export function Turnstile() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!SITE_KEY) return;
    let id: string | undefined;
    let cancelled = false;
    loadScript()
      .then(() => {
        if (cancelled || !ref.current || !window.turnstile) return;
        id = window.turnstile.render(ref.current, {
          sitekey: SITE_KEY,
          appearance: "interaction-only",
          "refresh-expired": "auto",
        });
        ref.current.dataset.widgetId = id;
      })
      .catch((e) => console.warn(e));
    return () => {
      cancelled = true;
      if (id) window.turnstile?.remove(id);
    };
  }, []);

  if (!SITE_KEY) return null;
  return <div ref={ref} data-turnstile className="empty:hidden" />;
}

/**
 * The token for a form, waiting briefly if the invisible check is still running.
 * Returns "" when Turnstile is off (the server then skips the check).
 */
export async function turnstileToken(form: HTMLFormElement, waitMs = 8000): Promise<string> {
  if (!SITE_KEY || !form.querySelector("[data-turnstile]")) return "";
  const read = () => (form.querySelector<HTMLInputElement>(`input[name="${FIELD}"]`)?.value ?? "");
  const start = Date.now();
  while (!read() && Date.now() - start < waitMs) await new Promise((r) => setTimeout(r, 200));
  return read();
}

/** Tokens work once: after a submit, get a fresh one for the next try. */
export function resetTurnstile(form: HTMLFormElement | null) {
  const id = form?.querySelector<HTMLElement>("[data-turnstile]")?.dataset.widgetId;
  if (!id) return;
  try {
    window.turnstile?.reset(id);
  } catch {
    // The widget was already removed (the form closed); a new one renders when it opens again.
  }
}
