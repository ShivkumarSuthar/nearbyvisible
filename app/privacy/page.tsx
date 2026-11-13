import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = { title: "Privacy policy", alternates: { canonical: "/privacy" } };

// TODO: review this text with a legal professional before going live.
export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy policy"
      intro="How we handle the information you share with us."
      updated="[DATE]"
      sections={[
        { heading: "What we collect", text: "Your name, business name, phone number, area and any message you send us through WhatsApp, calls or our contact form." },
        { heading: "How we use it", text: "Only to reply to you, prepare your review or quote, and deliver the services you choose." },
        { heading: "Sharing", text: "We do not sell your information. We share it only with tools needed to deliver your service, such as hosting or Google, and only when you ask us to." },
        { heading: "Your accounts", text: "Logins you share with us are used only for your project and stored securely." },
        { heading: "Your choices", text: "Ask us any time on WhatsApp to update or delete your information." },
      ]}
    />
  );
}
