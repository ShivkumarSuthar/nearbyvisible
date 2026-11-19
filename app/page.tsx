import type { Metadata } from "next";
import { site } from "@/lib/site";
import { Hero } from "@/components/home/Hero";
import { Story } from "@/components/home/Story";
import { ScoreSection } from "@/components/home/ScoreSection";
import { Services } from "@/components/home/Services";
import { Process } from "@/components/home/Process";
import { WhoWeHelp } from "@/components/home/WhoWeHelp";
import { WhyUs } from "@/components/home/WhyUs";
import { PlansPreview } from "@/components/home/PlansPreview";
import { WorkPreview, Testimonials } from "@/components/home/WorkPreview";
import { FaqPreview } from "@/components/home/FaqPreview";
import { BlogPreview } from "@/components/home/BlogPreview";
import { Contact } from "@/components/home/Contact";

// Only the home page gets "/" as canonical; setting it in the layout would leak to pages without their own.
export const metadata: Metadata = {
  alternates: { canonical: "/" },
  // openGraph replaces the layout one as a whole, so repeat siteName and locale.
  openGraph: { url: "/", siteName: site.name, locale: "en_IN", type: "website" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <Story />
      <ScoreSection />
      <Services />
      <Process />
      <WhoWeHelp />
      <WhyUs />
      <PlansPreview />
      <WorkPreview />
      <Testimonials />
      <BlogPreview />
      <FaqPreview />
      <Contact />
    </>
  );
}
