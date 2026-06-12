"use client";

import { useEffect, useRef } from "react";

import { FlowDroplet } from "@/components/ui/motifs";

export type ToastTone = "default" | "success" | "error";

export interface ToastItem {
  id: number;
  message: string;
  tone: ToastTone;
  duration: number;
}

function ToneIcon({ tone }: { tone: ToastTone }) {
  if (tone === "success") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4 text-green-bright" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
        <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (tone === "error") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4 text-red-400" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
        <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
      </svg>
    );
  }
  return <FlowDroplet size={13} className="text-azure-bright" />;
}

export function Toast({ item, onDismiss }: { item: ToastItem; onDismiss: (id: number) => void }) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const remaining = useRef(item.duration);
  const startedAt = useRef(0);

  useEffect(() => {
    const start = () => {
      startedAt.current = Date.now();
      timer.current = setTimeout(() => onDismiss(item.id), remaining.current);
    };
    start();
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [item.id, onDismiss]);

  const pause = () => {
    if (!timer.current) return;
    clearTimeout(timer.current);
    timer.current = null;
    remaining.current -= Date.now() - startedAt.current;
  };

  const resume = () => {
    if (timer.current) return;
    startedAt.current = Date.now();
    timer.current = setTimeout(() => onDismiss(item.id), Math.max(remaining.current, 600));
  };

  return (
    <div
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocus={pause}
      onBlur={resume}
      className="card-surface toast-enter flex w-full max-w-sm items-center gap-3 rounded-full border-steel-line py-2.5 pl-4 pr-2 shadow-lg shadow-abyss/60 sm:w-auto"
    >
      <ToneIcon tone={item.tone} />
      <p className="flex-1 text-sm text-ink">{item.message}</p>
      <button
        type="button"
        onClick={() => onDismiss(item.id)}
        aria-label="Dismiss notification"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink-faint transition-colors hover:text-ink"
      >
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
