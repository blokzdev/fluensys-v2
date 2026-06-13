import type { Metadata } from "next";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Fluensys Limited collects, uses and protects your personal data.",
  alternates: { canonical: "/privacy" },
};

/*
 * NOTE FOR THE FLUENSYS TEAM: this is a sensible working draft aligned with
 * what the site actually does (Firebase auth, Firestore-stored newsletter
 * subscriptions, bookmarks and comments). Have it reviewed before launch
 * and update the "Last updated" date on any change.
 */

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="pt-[72px]">
        <div className="container-site max-w-3xl py-20">
          <p className="text-eyebrow mb-5">Legal</p>
          <h1 className="text-display text-4xl font-bold text-ink">Privacy Policy</h1>
          <p className="mt-3 font-mono text-xs text-ink-faint">Last updated: June 2026</p>

          <div className="prose-fluensys mt-10">
            <p>
              Fluensys Limited (&ldquo;FluenSys&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) is an
              independent engineering consultancy registered in England and Wales. We are
              committed to protecting your personal data and respecting your privacy in
              accordance with UK GDPR and the Data Protection Act 2018.
            </p>

            <h2>What we collect</h2>
            <ul>
              <li>
                <strong>Account data</strong> — if you sign in with Google we receive your name,
                email address and profile photo. Guest (anonymous) sessions carry no personal
                details.
              </li>
              <li>
                <strong>Newsletter subscriptions</strong> — your email address, optional first
                name and chosen topics of interest.
              </li>
              <li>
                <strong>Engagement data</strong> — bookmarks you save and comments you post,
                associated with your account.
              </li>
              <li>
                <strong>Enquiries</strong> — anything you send us by email or through contact
                links.
              </li>
            </ul>

            <h2>How we use it</h2>
            <ul>
              <li>To operate site features: sign-in, bookmarks, comments.</li>
              <li>To send the Journal digest you subscribed to. You can unsubscribe anytime.</li>
              <li>To respond to consultancy enquiries.</li>
              <li>To understand aggregate readership and improve our content.</li>
            </ul>

            <h2>Where it lives</h2>
            <p>
              Account and engagement data is stored in Google Firebase (Firestore and Firebase
              Authentication). The site is hosted on Vercel. Both providers process data under
              their respective data processing agreements and standard contractual clauses.
            </p>

            <h2>Your rights</h2>
            <p>
              You may request access to, correction of, or deletion of your personal data at any
              time by emailing{" "}
              <a href="mailto:info@fluensys.co.uk">info@fluensys.co.uk</a>. Deleting your
              account removes your bookmarks, comments authorship and subscription.
            </p>

            <h2>Contact</h2>
            <p>
              Fluensys Limited, 35 Westcliffe House, Central London, N1 3HS ·{" "}
              <a href="mailto:info@fluensys.co.uk">info@fluensys.co.uk</a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
