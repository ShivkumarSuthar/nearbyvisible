import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = { title: "Privacy policy", alternates: { canonical: "/privacy" } };

// Review with a legal professional before relying on it.
export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy policy"
      intro="How we handle the information you share with us."
      updated="14 November 2026"
      sections={[
        {
          heading: "What we collect",
          text: "When you fill in a form on this site, we collect your name, phone number and, if you add them, your business name, city, the service you are interested in and your message. If you contact us on WhatsApp or by phone, we see the details you share there.",
        },
        {
          heading: "The free Visibility Score",
          text: "When you use the free Visibility Score, we send the business name, city, category and website you enter to Google’s Places and PageSpeed services to look up public information, and we read the business website’s public pages. We do not need your personal details to run the check.",
        },
        { heading: "How we use it", text: "Only to reply to you, prepare your review or quote, and deliver the services you choose. We do not send marketing messages you did not ask for." },
        {
          heading: "Service providers",
          text: "Form messages reach us by email through our email provider, and the site is hosted by our hosting provider. These providers process data only to deliver that service. We do not sell your information.",
        },
        { heading: "Your accounts", text: "Logins you share with us are used only for your project, kept private and handed back to you when we stop working together." },
        {
          heading: "On your device and advertising",
          text: "The site stores a small setting in your browser so the request form does not pop up again for a few days after you close it. We use the Meta Pixel to measure our Facebook and Instagram ads: it tells Meta when someone visits a page, gets a Visibility Score or taps WhatsApp, so we can show our ads to people likely to find them useful. It does not receive the business details you type into the check. You can control ad tracking in your Facebook or Instagram ad settings and by blocking cookies in your browser.",
        },
        { heading: "How long we keep it", text: "We keep enquiry details while we are in touch and for as long as needed for our records. Ask us and we will delete them." },
        { heading: "Your choices", text: "You can ask us at any time to see, correct or delete the information we hold about you. Write to nearbyvisible@gmail.com or message us on WhatsApp." },
      ]}
    />
  );
}
