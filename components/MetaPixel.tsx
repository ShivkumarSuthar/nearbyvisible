"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect, useRef } from "react";

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

/** Meta (Facebook/Instagram) Pixel. Does nothing until NEXT_PUBLIC_META_PIXEL_ID is set. */
export function MetaPixel() {
  const pathname = usePathname();
  const first = useRef(true);

  // The base code sends the first PageView; this sends one for each later page change.
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    track("PageView");
  }, [pathname]);

  if (!PIXEL_ID || !/^\d{5,20}$/.test(PIXEL_ID)) return null;
  return (
    <Script id="meta-pixel" strategy="afterInteractive">
      {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${PIXEL_ID}');fbq('track','PageView');`}
    </Script>
  );
}

type Fbq = (cmd: "track" | "trackCustom", event: string, params?: Record<string, unknown>) => void;

/** Sends a Meta standard event. Safe to call anywhere; a no-op when the pixel is not loaded. */
export function track(event: "PageView" | "ViewContent" | "Lead" | "Contact" | "Search", params?: Record<string, unknown>) {
  const fbq = (globalThis as { fbq?: Fbq }).fbq;
  if (typeof fbq === "function") fbq("track", event, params);
}
