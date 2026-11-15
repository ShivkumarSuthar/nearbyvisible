import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = { title: "Terms of service", alternates: { canonical: "/terms" } };

// Default terms chosen for launch. Review with a legal professional, and change the payment
// split or notice period here if your business works differently.
export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of service"
      intro="The simple rules for working together."
      updated="13 November 2026"
      sections={[
        {
          heading: "Quotes and payment",
          text: "Each project starts with a written quote, item by item. One-time work needs a 50% advance before we start, and the remaining 50% before launch or handover. Monthly plans are paid in advance at the start of each month.",
        },
        {
          heading: "Third-party costs",
          text: "Domain, hosting, paid tools and ad budgets are paid to those providers and renew on their own schedule. We tell you about these costs in your quote.",
        },
        { heading: "Your responsibilities", text: "Share accurate information, content and approvals on time. Delays on your side can move the timeline." },
        { heading: "Changes", text: "Small changes during a project are included. New pages, features or services outside the quote are quoted separately before we do them." },
        { heading: "Ownership", text: "Your domain, Google profile, website content and brand files belong to you once paid for. If you stop working with us, we hand over every login and file we manage." },
        { heading: "Monthly plans", text: "Monthly services continue until either side gives 15 days’ notice before the next billing date. There is no lock-in period." },
        { heading: "Results", text: "We follow best practice and Google’s rules, but no one can guarantee rankings or a number of customers." },
        { heading: "Free Visibility Score", text: "The free Visibility Score uses public information and is for guidance only. Results can change as Google and websites change." },
      ]}
    />
  );
}
