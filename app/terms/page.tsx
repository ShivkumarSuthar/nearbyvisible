import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = { title: "Terms of service", alternates: { canonical: "/terms" } };

// TODO: fill in the [placeholders] and review with a legal professional before going live.
export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of service"
      intro="The simple rules for working together."
      updated="[DATE]"
      sections={[
        { heading: "Quotes and payment", text: "Each project starts with a written quote. Work begins after the agreed advance. [PAYMENT TERMS]" },
        { heading: "Your responsibilities", text: "Share accurate information, content and approvals on time. Delays on your side can move the timeline." },
        { heading: "Ownership", text: "Your domain, Google profile, website content and brand files belong to you once paid for." },
        { heading: "Monthly plans", text: "Monthly services continue until either side gives [NOTICE PERIOD] notice." },
        { heading: "Results", text: "We follow best practice and Google’s rules, but no one can guarantee rankings or a number of customers." },
      ]}
    />
  );
}
