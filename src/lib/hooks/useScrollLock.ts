"use client";

import { useEffect } from "react";

import { useLenisControl } from "@/components/layout/SmoothScroll";

/**
 * Locks page scroll while an overlay is open: hides overflow, compensates
 * for the scrollbar width and pauses the Lenis RAF loop so smooth-scroll
 * cannot fight the lock.
 */
export function useScrollLock(locked: boolean) {
  const lenis = useLenisControl();

  useEffect(() => {
    if (!locked) return;
    const root = document.documentElement;
    const scrollbarWidth = window.innerWidth - root.clientWidth;
    root.style.overflow = "hidden";
    if (scrollbarWidth > 0) root.style.paddingRight = `${scrollbarWidth}px`;
    lenis.stop();
    return () => {
      root.style.overflow = "";
      root.style.paddingRight = "";
      lenis.start();
    };
  }, [locked, lenis]);
}
