"use client";

import { useEffect } from "react";

/**
 * Reports document scroll progress (0–1) on scroll/resize, rAF-throttled.
 * Pass a stable callback (useCallback) that writes straight to the DOM —
 * consumers must not re-render per scroll frame.
 */
export function useReadingProgress(onProgress: (progress: number) => void) {
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const doc = document.documentElement;
      const total = doc.scrollHeight - window.innerHeight;
      onProgress(total > 0 ? Math.min(1, window.scrollY / total) : 0);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [onProgress]);
}
