"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { BookmarkButton } from "@/components/blog/BookmarkButton";
import { Toc } from "@/components/blog/Toc";
import { useLenisControl } from "@/components/layout/SmoothScroll";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { useReadingProgress } from "@/lib/hooks/useReadingProgress";
import { useShare } from "@/lib/hooks/useShare";
import type { ArticleHeading } from "@/lib/content/schema";

interface MobileToolbarProps {
  headings: ArticleHeading[];
  title: string;
  /** Absolute URL for sharing. */
  url: string;
  article: { slug: string; title: string; category: string; url: string };
}

const RING_RADIUS = 11;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

/**
 * App-style bottom toolbar on article pages (under lg): table of contents
 * sheet, reading-progress ring, share and bookmark. Hides on downward
 * scroll, returns on any upward scroll; always visible under reduced
 * motion.
 */
export function MobileToolbar({ headings, title, url, article }: MobileToolbarProps) {
  const [tocOpen, setTocOpen] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  const pendingId = useRef<string | null>(null);
  const lastY = useRef(0);
  const lenis = useLenisControl();
  const { share } = useShare(title, url);

  useReadingProgress(
    useCallback((progress: number) => {
      ringRef.current?.style.setProperty(
        "stroke-dashoffset",
        String(RING_CIRCUMFERENCE * (1 - progress)),
      );
    }, []),
  );

  // Hide on downward scroll, show on upward / at the extremes.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const delta = y - lastY.current;
      lastY.current = y;
      const bar = barRef.current;
      if (!bar) return;
      const atEdge =
        y < 80 || y + window.innerHeight >= document.documentElement.scrollHeight - 80;
      if (delta > 8 && !atEdge) {
        bar.style.transform = "translateY(calc(100% + 1.5rem))";
      } else if (delta < 0 || atEdge) {
        bar.style.transform = "translateY(0)";
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Glide to the chosen heading once the sheet has closed and the scroll
  // lock has lifted.
  useEffect(() => {
    if (tocOpen || !pendingId.current) return;
    const id = pendingId.current;
    pendingId.current = null;
    const target = document.getElementById(id);
    if (target) {
      lenis.scrollTo(target, { offset: -100 });
      history.replaceState(null, "", `#${id}`);
    }
  }, [tocOpen, lenis]);

  const navigate = (id: string) => {
    pendingId.current = id;
    setTocOpen(false);
  };

  return (
    <>
      <div
        ref={barRef}
        className="glass bottom-safe fixed inset-x-4 z-50 mx-auto flex h-14 max-w-md items-center justify-around rounded-full border border-line px-2 shadow-lg shadow-abyss/50 transition-transform duration-300 ease-[var(--ease-out-expo)] lg:hidden"
      >
        <button
          type="button"
          onClick={() => setTocOpen(true)}
          disabled={headings.length === 0}
          aria-label="Table of contents"
          className="tap-target flex items-center justify-center rounded-full text-ink-dim transition-colors hover:text-ink disabled:opacity-35"
        >
          <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
            <path d="M4 6h16M4 12h12M4 18h8" strokeLinecap="round" />
          </svg>
        </button>

        <span aria-hidden className="flex h-11 w-11 items-center justify-center">
          <svg viewBox="0 0 28 28" className="h-7 w-7 -rotate-90">
            <defs>
              <linearGradient id="toolbar-progress" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="var(--color-azure)" />
                <stop offset="100%" stopColor="var(--color-green)" />
              </linearGradient>
            </defs>
            <circle cx="14" cy="14" r={RING_RADIUS} fill="none" stroke="var(--color-steel-deep)" strokeWidth="2.5" />
            <circle
              ref={ringRef}
              cx="14"
              cy="14"
              r={RING_RADIUS}
              fill="none"
              stroke="url(#toolbar-progress)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray={RING_CIRCUMFERENCE}
              strokeDashoffset={RING_CIRCUMFERENCE}
            />
          </svg>
        </span>

        <button
          type="button"
          onClick={share}
          aria-label="Share this article"
          className="tap-target flex items-center justify-center rounded-full text-ink-dim transition-colors hover:text-ink"
        >
          <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
            <path
              d="M12 3v12m0-12L8 7m4-4 4 4M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <BookmarkButton article={article} compact />
      </div>

      <BottomSheet open={tocOpen} onClose={() => setTocOpen(false)} title="On this page">
        <Toc headings={headings} onNavigate={navigate} />
      </BottomSheet>
    </>
  );
}
