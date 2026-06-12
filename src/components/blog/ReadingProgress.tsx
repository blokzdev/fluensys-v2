"use client";

import { useCallback, useRef } from "react";

import { useReadingProgress } from "@/lib/hooks/useReadingProgress";

/** Thin progress bar pinned under the header while reading an article. */
export function ReadingProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useReadingProgress(
    useCallback((progress: number) => {
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${progress})`;
      }
    }, []),
  );

  return (
    <div aria-hidden className="fixed inset-x-0 top-[72px] z-40 h-[2px] bg-transparent">
      <div
        ref={barRef}
        className="h-full origin-left scale-x-0 bg-gradient-to-r from-azure to-green"
      />
    </div>
  );
}
