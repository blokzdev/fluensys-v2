"use client";

import Image from "next/image";
import { useEffect, useState, type FormEvent } from "react";

import { useAuth } from "@/components/providers/AuthProvider";
import { addComment, listenToComments, type CommentDoc } from "@/lib/firebase/db";

export function Comments({ slug }: { slug: string }) {
  const { user, configured, signInGoogle, signInGuest } = useAuth();
  const [comments, setComments] = useState<CommentDoc[]>([]);
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!configured) return;
    return listenToComments(slug, setComments);
  }, [configured, slug]);

  if (!configured) return null;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!user || body.trim().length < 2) return;
    setBusy(true);
    setError(null);
    try {
      await addComment(slug, user, body);
      setBody("");
    } catch {
      setError("Could not post your comment. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section aria-label="Discussion" className="mt-16 border-t border-line pt-12">
      <h2 className="text-display text-2xl font-semibold text-ink">
        Discussion{" "}
        <span className="font-mono text-sm text-ink-faint">({comments.length})</span>
      </h2>

      {user ? (
        <form onSubmit={submit} className="mt-6">
          <label htmlFor="comment-body" className="sr-only">
            Add to the discussion
          </label>
          <textarea
            id="comment-body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={3}
            maxLength={2000}
            placeholder="Share your perspective…"
            className="card-surface w-full resize-y p-4 text-sm text-ink placeholder:text-ink-faint focus:border-azure-bright focus:outline-none"
          />
          <div className="mt-3 flex items-center justify-between gap-4">
            <p className="text-xs text-ink-faint">
              Posting as{" "}
              <span className="text-ink-dim">
                {user.isAnonymous ? "Guest" : (user.displayName ?? "you")}
              </span>
            </p>
            <button
              type="submit"
              disabled={busy || body.trim().length < 2}
              className="rounded-full bg-azure px-6 py-2 font-display text-sm text-white transition-colors hover:bg-azure-bright disabled:opacity-50"
            >
              {busy ? "Posting…" : "Post comment"}
            </button>
          </div>
          {error ? <p className="mt-2 text-xs text-red-400">{error}</p> : null}
        </form>
      ) : (
        <div className="card-surface mt-6 flex flex-wrap items-center justify-between gap-4 p-6">
          <p className="text-sm text-ink-dim">Join the discussion — sign in to comment.</p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => signInGoogle().catch(() => undefined)}
              className="rounded-full bg-azure px-5 py-2 font-display text-sm text-white transition-colors hover:bg-azure-bright"
            >
              Continue with Google
            </button>
            <button
              type="button"
              onClick={() => signInGuest().catch(() => undefined)}
              className="rounded-full border border-line px-5 py-2 font-display text-sm text-ink-dim transition-colors hover:border-line-strong hover:text-ink"
            >
              Guest
            </button>
          </div>
        </div>
      )}

      <ul className="mt-8 grid gap-5">
        {comments.map((comment) => (
          <li key={comment.id} className="flex gap-4">
            {comment.photoURL ? (
              <Image
                src={comment.photoURL}
                alt=""
                width={36}
                height={36}
                className="h-9 w-9 rounded-full"
                unoptimized
              />
            ) : (
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-3 font-mono text-xs text-ink-dim">
                {comment.displayName[0]?.toUpperCase() ?? "G"}
              </span>
            )}
            <div className="min-w-0">
              <p className="text-sm font-medium text-ink">
                {comment.displayName}
                <span className="ml-3 font-mono text-[0.65rem] text-ink-faint">
                  {comment.createdAt
                    ? new Date(comment.createdAt.seconds * 1000).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "just now"}
                </span>
              </p>
              <p className="mt-1.5 whitespace-pre-wrap text-sm leading-relaxed text-ink-dim">
                {comment.body}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
