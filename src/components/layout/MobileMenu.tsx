"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { usePathname } from "next/navigation";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { AuthButton } from "@/components/auth/AuthButton";
import { useLenisControl } from "@/components/layout/SmoothScroll";
import { Logo } from "@/components/ui/Logo";
import { ImpellerIcon } from "@/components/ui/motifs";
import { useFocusTrap } from "@/lib/hooks/useFocusTrap";
import { useScrollLock } from "@/lib/hooks/useScrollLock";

gsap.registerPlugin(useGSAP);

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  links: ReadonlyArray<{ label: string; href: string }>;
}

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Full-screen navigation overlay. Stays mounted while the close timeline
 * reverses; fully usable with zero animation (links default visible).
 */
export function MobileMenu({ open, onClose, links }: MobileMenuProps) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const pendingHash = useRef<string | null>(null);
  const pathname = usePathname();
  const lenis = useLenisControl();

  useEffect(() => {
    if (open) setVisible(true);
  }, [open]);

  useScrollLock(visible);
  useFocusTrap(ref, visible);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useGSAP(
    () => {
      if (!visible || !ref.current || prefersReducedMotion()) return;
      const items = ref.current.querySelectorAll("[data-menu-item]");
      const bottom = ref.current.querySelector("[data-menu-bottom]");
      timeline.current = gsap
        .timeline()
        .fromTo(ref.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, ease: "power3.out" })
        .fromTo(
          items,
          { y: 48, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.7, ease: "power4.out", stagger: 0.085 },
          0.1,
        )
        .fromTo(
          bottom,
          { y: 24, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.5, ease: "power3.out" },
          "-=0.3",
        );
    },
    { scope: ref, dependencies: [visible] },
  );

  // Close: reverse the entrance timeline, then unmount.
  useEffect(() => {
    if (open || !visible) return;
    const tl = timeline.current;
    if (tl && !prefersReducedMotion()) {
      tl.eventCallback("onReverseComplete", () => setVisible(false));
      tl.timeScale(1.6).reverse();
    } else {
      setVisible(false);
    }
  }, [open, visible]);

  // Once unmounted (scroll lock released, Lenis restarted), run any
  // deferred same-page anchor glide.
  useEffect(() => {
    if (visible || !pendingHash.current) return;
    const hash = pendingHash.current;
    pendingHash.current = null;
    lenis.scrollTo(hash, { offset: -84 });
    history.replaceState(null, "", hash);
  }, [visible, lenis]);

  const handleNav = (event: MouseEvent, href: string) => {
    const hashIndex = href.indexOf("#");
    if (hashIndex !== -1 && pathname === "/" && href.startsWith("/#")) {
      // Same-page anchor: close first, glide after the scroll lock lifts.
      event.preventDefault();
      event.stopPropagation();
      pendingHash.current = href.slice(hashIndex);
    }
    onClose();
  };

  if (!visible) return null;

  return createPortal(
    <div
      ref={ref}
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site navigation"
      className="glass fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-abyss/95 lg:hidden"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-16 -right-16 text-ink opacity-[0.04]"
      >
        <ImpellerIcon size={360} monochrome />
      </div>

      <div className="container-site flex h-[72px] shrink-0 items-center justify-between">
        <Link href="/" aria-label="FluenSys — home" onClick={onClose}>
          <Logo variant="lockup" size="sm" />
        </Link>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="tap-target flex items-center justify-center rounded-full border border-line text-ink"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <nav aria-label="Mobile" className="container-site mt-6 flex flex-col">
        {links.map((link, i) => (
          <Link
            key={link.href}
            href={link.href}
            data-menu-item
            onClick={(event) => handleNav(event, link.href)}
            className="text-display group flex min-h-[56px] items-baseline gap-4 border-b border-line py-3 text-[2.6rem] font-bold leading-[1.15] text-ink transition-colors hover:text-azure-bright sm:text-[3.4rem]"
          >
            <span className="font-mono text-xs font-normal tracking-widest text-ink-faint">
              {String(i + 1).padStart(2, "0")}
            </span>
            {link.label}
          </Link>
        ))}
      </nav>

      <div data-menu-bottom className="container-site pb-safe mt-auto flex items-center justify-between gap-4 py-8">
        <Link
          href="/#contact"
          onClick={(event) => handleNav(event, "/#contact")}
          className="text-display inline-flex items-center gap-2 rounded-full bg-azure px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-azure-bright"
        >
          Get in touch
          <span aria-hidden>→</span>
        </Link>
        <AuthButton />
      </div>
    </div>,
    document.body,
  );
}
