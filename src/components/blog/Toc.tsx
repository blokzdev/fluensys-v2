"use client";

import { useEffect, useState } from "react";

import type { ArticleHeading } from "@/lib/content/schema";

interface TocProps {
  headings: ArticleHeading[];
  /**
   * When set (e.g. inside the mobile bottom sheet), link clicks are
   * intercepted and the heading id handed to the caller, which closes the
   * overlay first and scrolls after the lock lifts.
   */
  onNavigate?: (id: string) => void;
}

/** Sticky table of contents with scroll-spy highlighting. */
export function Toc({ headings, onNavigate }: TocProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const targets = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-100px 0px -70% 0px" },
    );
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav aria-label="Table of contents">
      <p className="text-eyebrow mb-4">On this page</p>
      <ul className="grid gap-2.5 border-l border-line">
        {headings.map((heading) => (
          <li key={heading.id} className={heading.depth === 3 ? "pl-4" : ""}>
            <a
              href={`#${heading.id}`}
              onClick={
                onNavigate
                  ? (event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      onNavigate(heading.id);
                    }
                  : undefined
              }
              className={`-ml-px block border-l py-0.5 pl-4 text-[0.82rem] leading-snug transition-colors duration-200 ${
                activeId === heading.id
                  ? "border-azure-bright text-azure-bright"
                  : "border-transparent text-ink-faint hover:text-ink-dim"
              } ${onNavigate ? "min-h-[40px] content-center py-1.5" : ""}`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
