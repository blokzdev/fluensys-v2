"use client";

import { useEffect } from "react";

import { Button, ButtonLink } from "@/components/ui/Button";
import { VoluteContour } from "@/components/ui/motifs";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="relative flex min-h-[80svh] flex-col items-center justify-center overflow-hidden pt-[72px] text-center">
      <div aria-hidden className="bg-blueprint absolute inset-0 opacity-40" />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-ink opacity-[0.06]"
      >
        <VoluteContour size={480} className="animate-drift" />
      </div>
      <div className="container-site relative">
        <p className="text-eyebrow">Flow interrupted</p>
        <h1 className="text-display mt-6 text-4xl font-bold text-ink sm:text-5xl">
          Something seized up
        </h1>
        <p className="mx-auto mt-6 max-w-md text-ink-dim">
          An unexpected fault stopped this page. It is usually transient — restart the flow, or
          head back to a safe operating point.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <Button onClick={reset}>Try again</Button>
          <ButtonLink href="/" variant="outline">
            Back to home
          </ButtonLink>
        </div>
      </div>
    </main>
  );
}
