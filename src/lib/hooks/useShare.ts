"use client";

import { useCallback, useState } from "react";

import { useToast } from "@/components/providers/ToastProvider";

/** Native share with copy-to-clipboard fallback (+ toast). */
export function useShare(title: string, url: string) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast({ message: "Link copied", tone: "success" });
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard unavailable — ignore.
    }
  }, [url, toast]);

  const share = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // Dismissed.
      }
    } else {
      await copy();
    }
  }, [title, url, copy]);

  return { share, copy, copied };
}
