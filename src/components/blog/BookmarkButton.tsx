"use client";

import { useEffect, useState } from "react";

import { useAuth } from "@/components/providers/AuthProvider";
import { listenToBookmark, toggleBookmark } from "@/lib/firebase/db";

interface BookmarkButtonProps {
  article: { slug: string; title: string; category: string; url: string };
}

export function BookmarkButton({ article }: BookmarkButtonProps) {
  const { user, configured, signInGuest } = useAuth();
  const [bookmarked, setBookmarked] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) {
      setBookmarked(false);
      return;
    }
    return listenToBookmark(user.uid, article.slug, setBookmarked);
  }, [user, article.slug]);

  if (!configured) return null;

  const onClick = async () => {
    setBusy(true);
    try {
      // Bookmarking should be one tap — silently provision a guest session.
      let uid = user?.uid;
      if (!uid) {
        const guest = await signInGuest();
        uid = guest?.uid;
      }
      if (uid) await toggleBookmark(uid, article, bookmarked);
    } catch {
      // Network/permission failure — leave state unchanged.
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      aria-pressed={bookmarked}
      aria-label={bookmarked ? "Remove bookmark" : "Bookmark this article"}
      className={`flex h-9 items-center gap-2 rounded-full border px-4 text-xs font-medium transition-colors ${
        bookmarked
          ? "border-green-bright/50 bg-green/10 text-green-bright"
          : "border-line text-ink-dim hover:border-azure-bright hover:text-azure-bright"
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-3.5 w-3.5"
        fill={bookmarked ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden
      >
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" strokeLinejoin="round" />
      </svg>
      {bookmarked ? "Saved" : "Save"}
    </button>
  );
}
