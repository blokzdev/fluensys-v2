import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="relative flex min-h-[80svh] flex-col items-center justify-center overflow-hidden pt-[72px] text-center">
        <div aria-hidden className="bg-blueprint absolute inset-0 opacity-40" />
        <div className="container-site relative">
          <p className="text-eyebrow">Pressure drop detected</p>
          <h1 className="text-display mt-6 text-7xl font-bold text-ink sm:text-8xl">404</h1>
          <p className="mx-auto mt-6 max-w-md text-ink-dim">
            This page has cavitated — it no longer exists, or never did. Let&apos;s get the flow
            re-established.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <ButtonLink href="/">Back to home</ButtonLink>
            <ButtonLink href="/blog" variant="outline">
              Browse the Journal
            </ButtonLink>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
