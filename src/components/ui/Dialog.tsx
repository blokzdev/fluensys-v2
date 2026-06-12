"use client";

import { useEffect, useRef, type MouseEvent, type ReactNode } from "react";

import { useScrollLock } from "@/lib/hooks/useScrollLock";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  /** Accessible name for the dialog. */
  label: string;
  variant?: "center" | "sheet";
  className?: string;
  children: ReactNode;
}

/**
 * Modal built on the native <dialog> element — top-layer rendering, focus
 * trapping, Esc handling and background inertness come for free. Entrance
 * animations are CSS-only via @starting-style (progressive enhancement:
 * older browsers simply skip them).
 */
export function Dialog({ open, onClose, label, variant = "center", className, children }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const invokerRef = useRef<HTMLElement | null>(null);

  useScrollLock(open);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      invokerRef.current = document.activeElement as HTMLElement | null;
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
      invokerRef.current?.focus?.();
      invokerRef.current = null;
    }
  }, [open]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    // Fired when the platform closes the dialog itself (Esc key).
    const handleClose = () => {
      if (open) onClose();
    };
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [open, onClose]);

  const onBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    const dialog = ref.current;
    if (!dialog || event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    const outside =
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom;
    if (outside) onClose();
  };

  return (
    <dialog
      ref={ref}
      aria-label={label}
      onClick={onBackdropClick}
      className={`fl-dialog ${variant === "sheet" ? "fl-sheet" : "fl-center"} ${className ?? ""}`}
    >
      {variant === "sheet" && (
        <div aria-hidden className="mx-auto mt-3 h-1 w-10 rounded-full bg-steel" />
      )}
      {children}
    </dialog>
  );
}
