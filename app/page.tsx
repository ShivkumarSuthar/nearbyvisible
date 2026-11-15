import { Hero } from "@/components/home/Hero";
import { Story } from "@/components/home/Story";
import { Services } from "@/components/home/Services";
import { Process } from "@/components/home/Process";
import { WhoWeHelp } from "@/components/home/WhoWeHelp";
import { WhyUs } from "@/components/home/WhyUs";
import { PlansPreview } from "@/components/home/PlansPreview";
import { WorkPreview, Testimonials } from "@/components/home/WorkPreview";
import { FaqPreview } from "@/components/home/FaqPreview";
import { BlogPreview } from "@/components/home/BlogPreview";
import { Contact } from "@/components/home/Contact";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Story />
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
