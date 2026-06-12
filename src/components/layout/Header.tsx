"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { AuthButton } from "@/components/auth/AuthButton";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { Logo } from "@/components/ui/Logo";
import { useScrollSpy } from "@/lib/hooks/useScrollSpy";

const NAV_LINKS = [
  { label: "Services", href: "/#services" },
  { label: "Expertise", href: "/#expertise" },
  { label: "About", href: "/#about" },
  { label: "Team", href: "/#team" },
  { label: "Clients", href: "/#clients" },
  { label: "Journal", href: "/blog" },
  { label: "Contact", href: "/#contact" },
];

const SECTION_IDS = NAV_LINKS.filter((link) => link.href.startsWith("/#")).map((link) =>
  link.href.slice(2),
);

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const activeSection = useScrollSpy(SECTION_IDS, { enabled: pathname === "/" });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "glass border-b border-line shadow-[0_1px_0_0_rgb(151_170_196/0.06)]"
          : "bg-transparent"
      }`}
    >
      <div className="container-site flex h-[72px] items-center justify-between">
        <Link
          href="/"
          aria-label="FluenSys — home"
          className={`origin-left transition-transform duration-500 ease-[var(--ease-out-expo)] ${
            scrolled ? "scale-[0.92]" : ""
          }`}
        >
          <Logo variant="lockup" size="sm" />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => {
            const active =
              link.href === "/blog"
                ? pathname?.startsWith("/blog")
                : pathname === "/" && activeSection === link.href.slice(2);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative rounded-full px-4 py-2 text-sm transition-colors duration-200 ${
                  active ? "text-azure-bright" : "text-ink-dim hover:text-ink"
                }`}
              >
                {link.label}
                <span
                  aria-hidden
                  className={`absolute inset-x-4 bottom-0.5 h-0.5 origin-center rounded-full bg-azure-bright transition-transform duration-300 ease-[var(--ease-out-expo)] ${
                    active ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <AuthButton />
          </div>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
            className="tap-target flex flex-col items-center justify-center gap-[5px] rounded-full border border-line lg:hidden"
          >
            <span
              className={`h-px w-4 bg-ink transition-transform duration-300 ${open ? "translate-y-[6px] rotate-45" : ""}`}
            />
            <span
              className={`h-px w-4 bg-ink transition-[opacity,transform] duration-300 ${open ? "scale-x-40 opacity-0" : ""}`}
            />
            <span
              className={`h-px w-4 bg-ink transition-transform duration-300 ${open ? "-translate-y-[6px] -rotate-45" : ""}`}
            />
          </button>
        </div>
      </div>

      <MobileMenu open={open} onClose={() => setOpen(false)} links={NAV_LINKS} />
    </header>
  );
}
