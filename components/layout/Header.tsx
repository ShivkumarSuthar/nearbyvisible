"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { Logo } from "@/components/Logo";
import { services } from "@/lib/content";
import { site } from "@/lib/site";

type Menu = "services" | "company" | null;

const company = [
  { href: "/about", label: "About us", text: "Who we are and why" },
  { href: "/work", label: "Our work", text: "Projects and results" },
  { href: "/faq", label: "FAQ", text: "Common questions" },
];

export function Header() {
  const pathname = usePathname();
  const [menu, setMenu] = useState<Menu>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  // Close menus when the page changes.
  useEffect(() => {
    setMenu(null);
    setMobileOpen(false);
  }, [pathname]);

  // Close on outside click or Escape, only while something is open.
  useEffect(() => {
    if (!menu && !mobileOpen) return;
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setMenu(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenu(null);
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [menu, mobileOpen]);

  const group = pathname === "/"
    ? "home"
    : pathname.startsWith("/services")
      ? "services"
      : ["/about", "/work", "/faq"].some((p) => pathname.startsWith(p))
        ? "company"
        : pathname.startsWith("/contact")
          ? "contact"
          : "";

  const tab = (active: boolean) =>
    clsx(
      "flex items-center gap-1.5 whitespace-nowrap border-b-2 px-0.5 py-2.5 transition-colors",
      active ? "border-brand font-semibold text-white" : "border-transparent text-muted-dark hover:text-white",
    );

  return (
    <header className="sticky top-0 z-50 border-b border-line-dark bg-ink">
      <nav ref={navRef} aria-label="Main" className="mx-auto flex max-w-[1240px] items-center justify-between gap-8 px-6 py-3.5">
        <Link href="/" aria-label={`${site.name} home`} className="flex-none">
          <Logo dark />
        </Link>

        <div className="hidden items-center gap-8 text-[15px] font-medium lg:flex">
          <Link href="/" className={tab(group === "home")}>Home</Link>

          <div className="relative">
            <button
              type="button"
              aria-expanded={menu === "services"}
              aria-controls="menu-services"
              onClick={() => setMenu(menu === "services" ? null : "services")}
              className={tab(group === "services")}
            >
              Services <Chevron open={menu === "services"} />
            </button>
            {menu === "services" && (
              <div id="menu-services" className="absolute left-1/2 top-[calc(100%+12px)] z-30 flex w-[560px] -translate-x-1/2 flex-col gap-3 rounded-[20px] bg-mist p-4 shadow-[0_24px_48px_-16px_rgba(0,0,0,0.35)]">
                <div className="grid grid-cols-2 gap-2">
                  {services.map((s) => (
                    <MenuItem key={s.slug} href={`/services/${s.slug}`} label={s.name} text={s.menu} />
                  ))}
                </div>
                <Link href="/services" className="px-2 py-1 text-sm font-semibold text-brand-dark hover:underline">
                  See all services
                </Link>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              aria-expanded={menu === "company"}
              aria-controls="menu-company"
              onClick={() => setMenu(menu === "company" ? null : "company")}
              className={tab(group === "company")}
            >
              Company <Chevron open={menu === "company"} />
            </button>
            {menu === "company" && (
              <div id="menu-company" className="absolute left-1/2 top-[calc(100%+12px)] z-30 flex w-[280px] -translate-x-1/2 flex-col gap-2 rounded-[20px] bg-mist p-3 shadow-[0_24px_48px_-16px_rgba(0,0,0,0.35)]">
                {company.map((c) => (
                  <MenuItem key={c.href} href={c.href} label={c.label} text={c.text} />
                ))}
              </div>
            )}
          </div>

          <Link href="/contact" className={tab(group === "contact")}>Contact</Link>
        </div>

        <div className="flex items-center gap-3">
          <a href={site.whatsapp} className="hidden whitespace-nowrap rounded-full bg-brand px-5 py-3 text-[15px] font-semibold text-ink transition-transform hover:-translate-y-0.5 sm:inline-block">
            Free Google audit
          </a>
          <button
            type="button"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex size-11 items-center justify-center rounded-full border border-edge-dark text-white lg:hidden"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
              {mobileOpen ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div id="mobile-menu" className="max-h-[calc(100dvh-72px)] overflow-y-auto border-t border-line-dark px-6 pb-8 pt-4 lg:hidden">
          <MobileLink href="/">Home</MobileLink>
          <p className="mt-4 text-sm font-semibold text-muted-dark">Services</p>
          {services.map((s) => (
            <MobileLink key={s.slug} href={`/services/${s.slug}`}>{s.name}</MobileLink>
          ))}
          <p className="mt-4 text-sm font-semibold text-muted-dark">Company</p>
          {company.map((c) => (
            <MobileLink key={c.href} href={c.href}>{c.label}</MobileLink>
          ))}
          <MobileLink href="/contact">Contact</MobileLink>
          <a href={site.whatsapp} className="mt-6 block rounded-full bg-brand px-5 py-4 text-center font-semibold text-ink">
            Free Google audit
          </a>
        </div>
      )}
    </header>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={clsx("transition-transform", open && "rotate-180")}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function MenuItem({ href, label, text }: { href: string; label: string; text: string }) {
  return (
    <Link href={href} className="flex flex-col gap-1 rounded-[14px] border border-[#eef1ef] bg-white px-4 py-3.5 text-[#111111] transition-colors hover:border-brand">
      <span className="text-[15px] font-semibold">{label}</span>
      <span className="text-[13px] text-gray-600">{text}</span>
    </Link>
  );
}

function MobileLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="block border-b border-line-dark py-3 text-base text-white">
      {children}
    </Link>
  );
}
