export const site = {
  name: "NearbyVisible",
  tagline: "Get found nearby.",
  description:
    "NearbyVisible helps businesses get found on Google, look trusted online, and turn searches into calls.",
  phoneDisplay: "63772 90604",
  phoneE164: "+916377290604",
  phoneTel: "tel:+916377290604",
  whatsapp: "https://wa.me/916377290604",
  // Fill these in when ready. Empty values are hidden on the site.
  email: "",
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

/** WhatsApp link with a pre-filled message. */
export function whatsappLink(message?: string) {
  return message ? `${site.whatsapp}?text=${encodeURIComponent(message)}` : site.whatsapp;
}
