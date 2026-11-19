export const site = {
  name: "NearbyVisible",
  tagline: "Get found nearby.",
  description:
    "NearbyVisible helps local businesses across India get found on Google, look trusted online, and turn searches into calls.",
  phoneDisplay: "63772 90604",
  phoneE164: "+916377290604",
  phoneTel: "tel:+916377290604",
  whatsapp: "https://wa.me/916377290604",
  // Fill these in when ready. Empty values are hidden on the site.
  email: "nearbyvisible@gmail.com",
  hours: "",
  social: {
    instagram: "https://www.instagram.com/nearbyvisible",
    facebook: "https://www.facebook.com/nearbyvisible",
    youtube: "",
    linkedin: "https://www.linkedin.com/company/nearbyvisible",
    googleProfile: "",
  },
  // Change this to your real domain once you buy it (or set NEXT_PUBLIC_SITE_URL).
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://nearbyvisible.vercel.app",
} as const;

/** Message used by "Get a call back" links. The WhatsApp form sees it and pre-selects a call back. */
export const CALLBACK_TEXT = "I would like a call back on WhatsApp.";

/** WhatsApp link with a pre-filled message. On the site, clicks open the WhatsApp form first (components/WhatsAppForm). */
export function whatsappLink(message?: string) {
  return message ? `${site.whatsapp}?text=${encodeURIComponent(message)}` : site.whatsapp;
}
