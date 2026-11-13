import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { ContactForm } from "@/components/ContactForm";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Talk to NearbyVisible on WhatsApp or call 63772 90604. Free Google review for your business.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let’s talk about your business."
        text="The fastest way is WhatsApp. Send your business name and area, and we will check how you look on Google, for free."
      />
      <section className="mx-auto flex max-w-[1240px] flex-col gap-12 px-6 py-28 lg:flex-row lg:items-start">
        <div className="flex flex-col gap-4 lg:w-[380px] lg:flex-none">
          <a href={site.whatsapp} className="flex flex-col gap-1.5 rounded-3xl bg-brand p-7 text-ink">
            <span className="font-display text-[22px] font-semibold">Chat on WhatsApp</span>
            <span>{site.phoneDisplay}</span>
          </a>
          <a href={site.phoneTel} className="flex flex-col gap-1.5 rounded-3xl border border-gray-200 p-7 transition-colors hover:border-[#111111]">
            <span className="font-display text-[22px] font-semibold">Call us</span>
            <span className="text-gray-600">{site.phoneDisplay}</span>
          </a>
          <div className="flex flex-col gap-1.5 rounded-3xl border border-gray-200 p-7">
            <span className="font-display text-[22px] font-semibold">Visit</span>
            <span className="text-gray-600">We come to your shop or office, or talk on WhatsApp.</span>
            {site.hours && <span className="text-gray-600">Hours: {site.hours}</span>}
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <ContactForm />
        </div>
      </section>
    </>
  );
}
