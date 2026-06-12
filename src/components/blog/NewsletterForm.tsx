"use client";

import { useState, type FormEvent } from "react";

import { useAuth } from "@/components/providers/AuthProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { ImpellerSpinner } from "@/components/ui/motifs";
import { subscribeToNewsletter } from "@/lib/firebase/db";

const TOPICS = [
  { id: "troubleshooting", label: "Troubleshooting" },
  { id: "automation", label: "Automation" },
  { id: "net-zero", label: "Net Zero" },
  { id: "design", label: "Design & Selection" },
];

/**
 * Firestore-backed newsletter capture (replaces the v1 email-provider
 * form). Subscribers are provisioned a guest auth session transparently so
 * Firestore security rules can require authentication.
 */
export function NewsletterForm({ compact = false }: { compact?: boolean }) {
  const { user, configured, signInGuest } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [topics, setTopics] = useState<string[]>([]);
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");

  const toggleTopic = (id: string) =>
    setTopics((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]));

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!/.+@.+\..+/.test(email)) return;
    setState("busy");
    try {
      let uid = user?.uid;
      if (!uid) {
        const guest = await signInGuest();
        uid = guest?.uid;
      }
      if (!uid) throw new Error("auth unavailable");
      await subscribeToNewsletter({ uid, email, firstName, topics });
      setState("done");
      toast({ message: "You're on the list", tone: "success" });
    } catch {
      setState("error");
      toast({ message: "Subscription failed — please try again", tone: "error" });
    }
  };

  if (!configured) {
    return (
      <p className="text-sm text-ink-faint">
        Newsletter subscriptions will open shortly — meanwhile, follow us on{" "}
        <a
          href="https://uk.linkedin.com/company/fluensys-ltd"
          className="text-azure-bright underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn
        </a>
        .
      </p>
    );
  }

  if (state === "done") {
    return (
      <div className="card-surface border-green-bright/30 p-6 text-center">
        <p className="text-display text-lg font-semibold text-green-bright">You&apos;re on the list.</p>
        <p className="mt-2 text-sm text-ink-dim">
          Expect field-tested pumping systems insight in your inbox — no noise, unsubscribe anytime.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} aria-label="Subscribe to the FluenSys newsletter">
      <div className={`flex flex-col gap-3 ${compact ? "" : "sm:flex-row"}`}>
        {!compact && (
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First name (optional)"
            autoComplete="given-name"
            className="card-surface h-12 flex-1 px-4 text-sm text-ink placeholder:text-ink-faint focus:border-azure-bright focus:outline-none"
          />
        )}
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Work email"
          autoComplete="email"
          className="card-surface h-12 flex-[1.4] px-4 text-sm text-ink placeholder:text-ink-faint focus:border-azure-bright focus:outline-none"
        />
        <button
          type="submit"
          disabled={state === "busy"}
          className="flex h-12 items-center justify-center gap-2.5 rounded-full bg-azure px-7 font-display text-sm font-medium text-white transition-colors hover:bg-azure-bright disabled:opacity-50"
        >
          {state === "busy" ? (
            <>
              <ImpellerSpinner size={15} className="text-white" />
              Subscribing…
            </>
          ) : (
            "Subscribe"
          )}
        </button>
      </div>

      {!compact && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="mr-1 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ink-faint">
            Topics
          </span>
          {TOPICS.map((topic) => (
            <button
              key={topic.id}
              type="button"
              aria-pressed={topics.includes(topic.id)}
              onClick={() => toggleTopic(topic.id)}
              className={`rounded-full border px-3.5 py-1.5 text-xs transition-colors ${
                topics.includes(topic.id)
                  ? "border-azure-bright/60 bg-azure-deep/25 text-azure-bright"
                  : "border-line text-ink-faint hover:border-line-strong hover:text-ink-dim"
              }`}
            >
              {topic.label}
            </button>
          ))}
        </div>
      )}

      {state === "error" ? (
        <p className="mt-3 text-xs text-red-400">
          Something went wrong — please try again in a moment.
        </p>
      ) : (
        <p className="mt-3 text-xs text-ink-faint">
          By subscribing you agree to receive the FluenSys journal digest. Unsubscribe anytime.
        </p>
      )}
    </form>
  );
}
