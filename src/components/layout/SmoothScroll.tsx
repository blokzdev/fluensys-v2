"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

export interface LenisControl {
  /** Pause the smooth-scroll RAF loop (e.g. while an overlay is open). */
  stop: () => void;
  start: () => void;
  scrollTo: (target: HTMLElement | string | number, options?: { offset?: number }) => void;
}

const noop = () => {};

/** No-ops when Lenis is absent (reduced motion / before mount). */
const ScrollContext = createContext<LenisControl>({
  stop: noop,
  start: noop,
  scrollTo: noop,
});

export function useLenisControl(): LenisControl {
  return useContext(ScrollContext);
}

/**
 * Site-wide smooth scrolling (Lenis) kept in lockstep with GSAP
 * ScrollTrigger. Disables itself for users who prefer reduced motion and
 * on touch devices, where native momentum scrolling feels best.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  const control = useMemo<LenisControl>(
    () => ({
      stop: () => lenisRef.current?.stop(),
      start: () => lenisRef.current?.start(),
      scrollTo: (target, options) => {
        const lenis = lenisRef.current;
        if (lenis) {
          lenis.scrollTo(target, options);
        } else if (target instanceof HTMLElement) {
          target.scrollIntoView();
        } else if (typeof target === "string") {
          document.querySelector(target)?.scrollIntoView();
        } else {
          window.scrollTo(0, target);
        }
      },
    }),
    [],
  );

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
    });
    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Anchor navigation should glide through Lenis, not jump. Handles both
    // "#section" and same-page "/#section" links.
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement).closest?.('a[href*="#"]');
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href) return;
      const url = new URL(href, window.location.href);
      if (url.pathname !== window.location.pathname || !url.hash || url.hash === "#") return;
      const target = document.querySelector(url.hash);
      if (!target) return;
      event.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -84 });
      (target as HTMLElement).focus({ preventScroll: true });
      history.replaceState(null, "", url.hash);
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <ScrollContext.Provider value={control}>{children}</ScrollContext.Provider>;
}
