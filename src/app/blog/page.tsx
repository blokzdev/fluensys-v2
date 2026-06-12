import type { Metadata } from "next";
import { Suspense } from "react";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BlogIndexClient } from "@/components/blog/BlogIndexClient";
import { NewsletterForm } from "@/components/blog/NewsletterForm";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import {
  getActiveCategories,
  getPublishedArticles,
  toSummary,
} from "@/lib/content/articles";
import { breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "The Journal — Pumping Systems Insight",
  description:
    "Field-tested articles on pump troubleshooting, automation, energy efficiency and Net Zero strategies — written by practising UK pumping systems consultants.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "The FluenSys Journal",
    description:
      "Field-tested articles on pump troubleshooting, automation, energy efficiency and Net Zero strategies.",
    url: "/blog",
  },
};

export default function BlogIndexPage() {
  const articles = getPublishedArticles().map(toSummary);
  const categories = getActiveCategories();
  const jsonLd = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Journal", path: "/blog" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main id="main-content" className="pt-[72px]">
        <section className="relative overflow-hidden border-b border-line py-20 md:py-28">
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_-10%,#15578a4d,transparent_70%)]"
          />
          <div aria-hidden className="bg-blueprint absolute inset-0 opacity-40" />
          <div className="container-site relative">
            <p className="text-eyebrow mb-5">The FluenSys Journal</p>
            <SplitHeading
              as="h1"
              immediate
              text="Engineering insight, from the field"
              className="text-display max-w-3xl text-4xl font-bold text-ink sm:text-5xl lg:text-6xl text-balance"
            />
            <p className="mt-6 max-w-2xl text-lg text-ink-dim">
              Practical knowledge on pumping systems — troubleshooting, automation, design and
              the road to Net Zero — written by consultants who solve these problems for a
              living.
            </p>
          </div>
        </section>

        <section className="container-site py-14 md:py-20">
          <Suspense fallback={null}>
            <BlogIndexClient articles={articles} categories={categories} />
          </Suspense>
        </section>

        <section className="border-t border-line bg-surface">
          <div className="container-site grid items-center gap-10 py-16 md:grid-cols-2 md:py-20">
            <Reveal>
              <div>
                <h2 className="text-display text-2xl font-semibold text-ink sm:text-3xl">
                  Subscribe to the Journal
                </h2>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-dim">
                  A concise digest of new articles and field insights on pumping systems.
                  Choose your topics — no noise, unsubscribe anytime.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <NewsletterForm />
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
