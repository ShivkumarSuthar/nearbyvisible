"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const PIXEL_ON = Boolean(PIXEL_ID && /^\d{5,20}$/.test(PIXEL_ID));
const CONSENT_KEY = "nv-ads-consent";
const OPEN_EVENT = "nv:cookie-settings";

type Consent = "granted" | "denied" | null;

function readConsent(): Consent {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

/**
 * Meta (Facebook/Instagram) Pixel, loaded only after the visitor taps "Accept" in the cookie banner.
 * Does nothing (and shows no banner) until NEXT_PUBLIC_META_PIXEL_ID is set.
 */
export function MetaPixel() {
  const pathname = usePathname();
  const first = useRef(true);
  const [consent, setConsent] = useState<Consent>(null);
  const [ready, setReady] = useState(false);
  const [banner, setBanner] = useState(false);

  // Read the saved choice after mount (localStorage is not available during server rendering).
  useEffect(() => {
    const c = readConsent();
    setConsent(c);
    setBanner(c === null);
    setReady(true);
    const open = () => setBanner(true);
    window.addEventListener(OPEN_EVENT, open);
    return () => window.removeEventListener(OPEN_EVENT, open);
  }, []);

  // The base code sends the first PageView; this sends one for each later page change.
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    track("PageView");
  }, [pathname]);

  function choose(c: "granted" | "denied") {
    try {
      localStorage.setItem(CONSENT_KEY, c);
    } catch {
      /* storage blocked: the choice lasts for this visit only */
    }
    if (c === "denied") (globalThis as { fbq?: Fbq }).fbq?.("consent", "revoke");
    if (c === "granted") (globalThis as { fbq?: Fbq }).fbq?.("consent", "grant");
    setConsent(c);
    setBanner(false);
  }

  if (!PIXEL_ON) return null;
  return (
    <>
      {consent === "granted" && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${PIXEL_ID}');fbq('track','PageView');`}
        </Script>
      )}
      {ready && banner && (
        <div
          role="region"
          aria-label="Cookie choice"
          className="fixed inset-x-3 bottom-3 z-[70] mx-auto flex max-w-[45rem] flex-col gap-3 rounded-[22px] bg-ink p-5 text-white shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] sm:flex-row sm:items-center sm:gap-5"
        >
          <p className="text-[0.875rem] leading-relaxed text-muted-dark">
            We would like to use the Meta Pixel to measure our Facebook and Instagram ads. It is off unless you accept.{" "}
            <Link href="/privacy" className="font-semibold text-white underline">
              Privacy policy
            </Link>
          </p>
          <div className="flex flex-none gap-2">
            <button type="button" onClick={() => choose("denied")} className="rounded-full border border-white/30 px-5 py-2.5 text-sm font-semibold hover:bg-white/10">
              Decline
            </button>
            <button type="button" onClick={() => choose("granted")} className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-ink">
              Accept
            </button>
          </div>
        </div>
      )}
    </>
  );
}

/** Footer link that reopens the cookie banner. Hidden when the Pixel is not configured. */
export function CookieSettingsLink({ className }: { className?: string }) {
  if (!PIXEL_ON) return null;
  return (
    <button type="button" onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))} className={className}>
      Cookie settings
    </button>
  );
}

type Fbq = (cmd: "track" | "trackCustom" | "consent", event: string, params?: Record<string, unknown>) => void;

/** Sends a Meta standard event. Safe to call anywhere; a no-op when the pixel is not loaded (or not consented). */
export function track(event: "PageView" | "ViewContent" | "Lead" | "Contact" | "Search", params?: Record<string, unknown>) {
  const fbq = (globalThis as { fbq?: Fbq }).fbq;
  if (typeof fbq === "function") fbq("track", event, params);
}
