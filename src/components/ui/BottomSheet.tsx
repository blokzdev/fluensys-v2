"use client";

import type { ReactNode } from "react";

import { Dialog } from "@/components/ui/Dialog";

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function BottomSheet({ open, onClose, title, children }: BottomSheetProps) {
  return (
    <Dialog open={open} onClose={onClose} label={title} variant="sheet">
      <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-3">
        <p className="text-display text-sm font-semibold text-ink">{title}</p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="tap-target flex items-center justify-center rounded-full text-ink-dim transition-colors hover:text-ink"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      <div className="pb-safe px-5 py-4">{children}</div>
    </Dialog>
  );
}
