import Link from "next/link";
import { Logo } from "@/components/Logo";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { services } from "@/lib/content";
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto flex max-w-[1240px] flex-col gap-12 px-6 pb-8 pt-[72px]">
        <div className="flex flex-wrap items-center justify-between gap-6 rounded-[28px] border border-line-dark bg-ink-soft p-8">
          <div className="flex flex-col gap-1.5">
            <p className="font-display text-2xl font-semibold">Want more customers from Google?</p>
            <p className="text-base text-muted-dark">Get a free review of your business on WhatsApp.</p>
          </div>
          <a href={site.whatsapp} className="whitespace-nowrap rounded-full bg-brand px-6 py-4 font-semibold text-ink transition-transform hover:-translate-y-0.5">
            Get a free Google audit
          </a>
        </div>

        <div className="flex flex-wrap justify-between gap-10">
          <div className="flex max-w-[320px] flex-col gap-[18px]">
            <Logo dark size={32} />
            <p className="text-[15px] leading-relaxed text-muted-dark">
              {site.tagline} Branding, websites, apps, Google presence and growth for your business.
            </p>
            <SocialLinks />
          </div>

          <div className="flex flex-wrap gap-12">
            <FooterCol title="Services">
              {services.map((s) => (
                <FooterLink key={s.slug} href={`/services/${s.slug}`}>{s.name}</FooterLink>
              ))}
              <FooterLink href="/services">All services</FooterLink>
            </FooterCol>
            <FooterCol title="Company">
              <FooterLink href="/">Home</FooterLink>
              <FooterLink href="/about">About us</FooterLink>
              <FooterLink href="/work">Our work</FooterLink>
              <FooterLink href="/faq">FAQ</FooterLink>
              <FooterLink href="/contact">Contact</FooterLink>
            </FooterCol>
            <FooterCol title="Get in touch">
              <a href={site.whatsapp} className="text-[15px] hover:text-brand">WhatsApp: {site.phoneDisplay}</a>
              <a href={site.phoneTel} className="text-[15px] hover:text-brand">Call: {site.phoneDisplay}</a>
              {site.email && <a href={`mailto:${site.email}`} className="text-[15px] hover:text-brand">{site.email}</a>}
              {site.hours && <span className="text-[15px] text-muted-dark">Hours: {site.hours}</span>}
            </FooterCol>
          </div>
        </div>

        <div className="flex flex-wrap justify-between gap-4 border-t border-line-dark pt-6 text-sm text-muted-dark">
          <span>© {new Date().getFullYear()} {site.name}. All rights reserved.</span>
          <div className="flex flex-wrap gap-6">
            <Link href="/privacy" className="hover:text-white">Privacy policy</Link>
            <Link href="/terms" className="hover:text-white">Terms of service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex min-w-[160px] flex-col gap-3">
      <p className="text-sm font-semibold text-muted-dark">{title}</p>
      {children}
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-[15px] transition-colors hover:text-brand">
      {children}
    </Link>
  );
}
