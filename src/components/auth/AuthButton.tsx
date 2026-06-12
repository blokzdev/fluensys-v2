"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { useAuth } from "@/components/providers/AuthProvider";
import { useToast } from "@/components/providers/ToastProvider";

/**
 * Compact sign-in control. Renders nothing when Firebase isn't configured
 * so the site degrades gracefully in preview environments.
 */
export function AuthButton() {
  const { user, loading, configured, signInGoogle, signInGuest, signOut } = useAuth();
  const { toast } = useToast();
  const [menuOpen, setMenuOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  if (!configured) return null;
  if (loading) {
    return <div className="h-9 w-24 animate-pulse rounded-full bg-surface-2" aria-hidden />;
  }

  const run = async (fn: () => Promise<unknown>, after?: () => void) => {
    setBusy(true);
    try {
      await fn();
      setMenuOpen(false);
      after?.();
    } catch {
      // Pop-up dismissed or network error; leave the UI as-is.
    } finally {
      setBusy(false);
    }
  };

  if (user) {
    return (
      <div ref={rootRef} className="relative">
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-haspopup="menu"
          className="flex min-h-[36px] items-center gap-2 rounded-full border border-line py-1 pl-1 pr-3 text-sm text-ink-dim transition-colors hover:border-line-strong hover:text-ink"
        >
          {user.photoURL ? (
            <Image
              src={user.photoURL}
              alt=""
              width={28}
              height={28}
              className="rounded-full"
              unoptimized
            />
          ) : (
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-azure-deep font-mono text-xs text-white">
              {(user.displayName ?? "G")[0].toUpperCase()}
            </span>
          )}
          <span className="max-w-[8rem] truncate">{user.isAnonymous ? "Guest" : (user.displayName ?? "Account")}</span>
        </button>
        {menuOpen ? (
          <div
            role="menu"
            className="card-surface menu-enter absolute right-0 top-12 z-50 w-44 border-steel-line p-2"
          >
            <button
              type="button"
              role="menuitem"
              disabled={busy}
              onClick={() => run(signOut, () => toast({ message: "Signed out" }))}
              className="min-h-[44px] w-full rounded-lg px-3 py-2 text-left text-sm text-ink-dim transition-colors hover:bg-surface-2 hover:text-ink"
            >
              Sign out
            </button>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setMenuOpen((v) => !v)}
        aria-expanded={menuOpen}
        aria-haspopup="menu"
        className="rounded-full border border-line px-4 py-2 text-sm text-ink-dim transition-colors hover:border-azure-bright hover:text-azure-bright"
      >
        Sign in
      </button>
      {menuOpen ? (
        <div
          role="menu"
          className="card-surface menu-enter absolute right-0 top-12 z-50 w-56 border-steel-line p-2"
        >
          <button
            type="button"
            role="menuitem"
            disabled={busy}
            onClick={() => run(signInGoogle)}
            className="min-h-[44px] w-full rounded-lg px-3 py-2 text-left text-sm text-ink transition-colors hover:bg-surface-2"
          >
            Continue with Google
          </button>
          <button
            type="button"
            role="menuitem"
            disabled={busy}
            onClick={() => run(signInGuest)}
            className="min-h-[44px] w-full rounded-lg px-3 py-2 text-left text-sm text-ink-dim transition-colors hover:bg-surface-2 hover:text-ink"
          >
            Continue as guest
          </button>
        </div>
      ) : null}
    </div>
  );
}
