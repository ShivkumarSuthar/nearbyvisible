import { Hero } from "@/components/home/Hero";
import { Story } from "@/components/home/Story";
import { Services } from "@/components/home/Services";
import { Process } from "@/components/home/Process";
import { WhoWeHelp } from "@/components/home/WhoWeHelp";
import { WhyUs } from "@/components/home/WhyUs";
import { WorkPreview, Testimonials } from "@/components/home/WorkPreview";
import { FaqPreview } from "@/components/home/FaqPreview";
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
      <WorkPreview />
      <Testimonials />
      <FaqPreview />
      <Contact />
    </>
  );
}
