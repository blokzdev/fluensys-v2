"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

import { Toast, type ToastItem, type ToastTone } from "@/components/ui/Toast";

interface ToastOptions {
  message: string;
  tone?: ToastTone;
  duration?: number;
}

const ToastContext = createContext<{ toast: (options: ToastOptions) => void }>({
  toast: () => {},
});

export function useToast() {
  return useContext(ToastContext);
}

const MAX_VISIBLE = 3;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const nextId = useRef(0);

  useEffect(() => setMounted(true), []);

  const toast = useCallback(({ message, tone = "default", duration = 4000 }: ToastOptions) => {
    setItems((current) => {
      const item: ToastItem = { id: nextId.current++, message, tone, duration };
      return [...current, item].slice(-MAX_VISIBLE);
    });
  }, []);

  const dismiss = useCallback((id: number) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {mounted &&
        createPortal(
          <div
            role="status"
            aria-live="polite"
            className="bottom-safe fixed inset-x-4 z-[70] flex flex-col items-center gap-2 sm:inset-x-auto sm:right-6 sm:items-end"
          >
            {items.map((item) => (
              <Toast key={item.id} item={item} onDismiss={dismiss} />
            ))}
          </div>,
          document.body,
        )}
    </ToastContext.Provider>
  );
}
