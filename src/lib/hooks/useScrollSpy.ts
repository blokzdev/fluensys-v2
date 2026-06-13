"use client";

import { useEffect, useState } from "react";

/**
 * Tracks which of the given section ids is in view. IntersectionObserver
 * reads true viewport geometry, so it stays accurate while Lenis glides —
 * never set the active state imperatively on link clicks.
 */
export function useScrollSpy(
  ids: readonly string[],
  { rootMargin = "-45% 0px -50% 0px", enabled = true }: { rootMargin?: string; enabled?: boolean } = {},
) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      setActive(null);
      return;
    }
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids, rootMargin, enabled]);

  return active;
}
