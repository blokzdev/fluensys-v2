import type { Metadata } from "next";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms governing the use of fluensys.co.uk and its content.",
  alternates: { canonical: "/terms" },
};

/*
 * NOTE FOR THE FLUENSYS TEAM: working draft — have it reviewed before
 * launch and update the "Last updated" date on any change.
 */

export default function TermsPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="pt-[72px]">
        <div className="container-site max-w-3xl py-20">
          <p className="text-eyebrow mb-5">Legal</p>
          <h1 className="text-display text-4xl font-bold text-ink">Terms of Use</h1>
          <p className="mt-3 font-mono text-xs text-ink-faint">Last updated: June 2026</p>

          <div className="prose-fluensys mt-10">
            <h2>Content & intellectual property</h2>
            <p>
              All articles, figures, downloadable PDFs, branding and imagery on this site are ©
              Fluensys Limited, all rights reserved, unless otherwise stated. You may download
              and share article PDFs for personal, non-commercial reference with attribution.
              Republishing or commercial reuse requires our written permission. The site&rsquo;s
              source code is separately licensed under Apache 2.0 — see the repository LICENSE.
            </p>

            <h2>Professional advice</h2>
            <p>
              Journal articles share field-tested engineering knowledge in good faith, but they
              are general guidance, not engineering advice for your specific system. Always
              involve a qualified engineer before acting on anything you read here. Individual
              articles may carry their own technical disclaimers.
            </p>

            <h2>Community conduct</h2>
            <p>
              Comments are provided for professional discussion. We may remove content that is
              unlawful, off-topic, promotional or abusive, and suspend accounts that post it.
            </p>

            <h2>Liability</h2>
            <p>
              To the maximum extent permitted by law, Fluensys Limited accepts no liability for
              loss or damage arising from reliance on site content or from interruption of the
              site&rsquo;s availability.
            </p>

            <h2>Contact</h2>
            <p>
              Questions about these terms:{" "}
              <a href="mailto:info@fluensys.co.uk">info@fluensys.co.uk</a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
