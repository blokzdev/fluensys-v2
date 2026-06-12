"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { AuthButton } from "@/components/auth/AuthButton";
import { Logo } from "@/components/ui/Logo";

const NAV_LINKS = [
  { label: "Services", href: "/#services" },
  { label: "Expertise", href: "/#expertise" },
  { label: "About", href: "/#about" },
  { label: "Team", href: "/#team" },
  { label: "Clients", href: "/#clients" },
  { label: "Journal", href: "/blog" },
  { label: "Contact", href: "/#contact" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled || open ? "glass border-b border-line" : "bg-transparent"
      }`}
    >
      <div className="container-site flex h-[72px] items-center justify-between">
        <Link href="/" aria-label="FluenSys — home">
          <Logo variant="lockup" size="sm" />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => {
            const active = link.href === "/blog" && pathname?.startsWith("/blog");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-2 text-sm transition-colors duration-200 ${
                  active ? "text-azure-bright" : "text-ink-dim hover:text-ink"
                }`}
              >
                {link.label}
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
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] rounded-full border border-line lg:hidden"
          >
            <span
              className={`h-px w-4 bg-ink transition-transform duration-300 ${open ? "translate-y-[3px] rotate-45" : ""}`}
            />
            <span
              className={`h-px w-4 bg-ink transition-transform duration-300 ${open ? "-translate-y-[3px] -rotate-45" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`glass overflow-hidden border-b border-line transition-[max-height,opacity] duration-500 ease-[var(--ease-out-expo)] lg:hidden ${
          open ? "max-h-[480px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav aria-label="Mobile" className="container-site flex flex-col gap-1 py-6">
          {NAV_LINKS.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              style={{ transitionDelay: open ? `${i * 40}ms` : "0ms" }}
              className={`text-display rounded-lg px-3 py-3 text-lg text-ink-dim transition-all duration-300 hover:bg-surface-2 hover:text-ink ${
                open ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-4 px-3 sm:hidden">
            <AuthButton />
          </div>
        </nav>
      </div>
    </header>
  );
}
