import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of service",
  description: "How NearbyVisible quotes, bills, delivers and hands over work, plus the rules for using the free Visibility Score.",
  alternates: { canonical: "/terms" },
};

// Default terms chosen for launch. Review with a legal professional, and change the payment
// split, refund rule or notice period here if your business works differently.
export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of service"
      intro="The simple rules for working together."
      updated="18 November 2026"
      sections={[
        {
          heading: "Who you are dealing with",
          text: `These terms are between you and ${site.name}. Contact: ${site.email}, ${site.phoneDisplay}. Your written quote, once you accept it, forms part of these terms.`,
        },
        {
          heading: "Quotes and payment",
          text: "Each project starts with a written quote, item by item. One-time work needs a 50% advance before we start, and the remaining 50% before launch or handover. Monthly plans are paid in advance at the start of each month.",
        },
        {
          heading: "Cancellations and refunds",
          text: "If you cancel before we start work, we refund the full advance. If you cancel after work has started, we keep the part of the advance that covers work already done and any third-party costs already paid on your behalf, and refund the rest within 14 days. Monthly fees already paid for the current month are not refunded.",
        },
        {
          heading: "Third-party costs",
          text: "Paid tools, ad budgets and other third-party services are paid to those providers and renew on their own schedule. Domain and hosting are not part of our fee. You buy them directly from the provider, in your name, and pay the first year and every renewal yourself. We help you choose and set them up, and we list the expected cost in your quote.",
        },
        { heading: "Your responsibilities", text: "Share accurate information, content and approvals on time, and only send us content you have the right to use. Delays on your side can move the timeline." },
        { heading: "Changes", text: "Small changes during a project are included. New pages, features or services outside the quote are quoted separately before we do them." },
        { heading: "Ownership", text: "Your domain, Google profile, website content and brand files belong to you once paid for. If you stop working with us, we hand over every login and file we manage." },
        { heading: "Monthly plans", text: "Monthly services continue until either side gives 15 days’ notice before the next billing date. There is no lock-in period." },
        { heading: "Results", text: "We follow best practice and Google’s rules, but no one can guarantee rankings or a number of customers." },
        {
          heading: "Free Visibility Score",
          text: "The free Visibility Score uses public information and is for guidance only. Results can change as Google and websites change. Use it for businesses you own, manage or are considering working with; do not use it to overload websites or to collect data in bulk. We may limit how often it can be used.",
        },
        {
          heading: "Limit of liability",
          text: "We are not responsible for losses caused by Google, hosting companies or other third parties, or for indirect losses such as lost profit. For anything else, our total liability is limited to the amount you paid us for the service concerned in the 3 months before the claim.",
        },
        {
          heading: "Law and disputes",
          text: "These terms are governed by the laws of India. We will first try to settle any disagreement by talking to you. If that does not work, the dispute will be decided by the courts that have jurisdiction over our registered place of business.",
        },
      ]}
    />
  );
}
