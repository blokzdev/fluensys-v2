import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { ButtonLink } from "@/components/ui/Button";
import {
  getActiveCategories,
  getCategory,
  getPublishedArticles,
  toSummary,
} from "@/lib/content/articles";
import { breadcrumbJsonLd } from "@/lib/seo";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export function generateStaticParams() {
  return getActiveCategories().map((c) => ({ category: c.id }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category: categoryId } = await params;
  const category = getCategory(categoryId);
  if (!category) return {};
  return {
    title: `${category.title} — The Journal`,
    description: category.description,
    alternates: { canonical: `/blog/${category.id}` },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: categoryId } = await params;
  const category = getCategory(categoryId);
  if (!category) notFound();

  const articles = getPublishedArticles()
    .filter((a) => a.frontmatter.category === category.id)
    .map(toSummary);

  const jsonLd = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Journal", path: "/blog" },
    { name: category.title, path: `/blog/${category.id}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main id="main-content" className="pt-[72px]">
        <section className="relative overflow-hidden border-b border-line py-20 md:py-24">
          <div aria-hidden className="bg-blueprint absolute inset-0 opacity-40" />
          <div className="container-site relative">
            <p className="text-eyebrow mb-5">Journal · Category</p>
            <SplitHeading
              as="h1"
              immediate
              text={category.title}
              className="text-display text-4xl font-bold text-ink sm:text-5xl"
            />
            <p className="mt-5 max-w-2xl text-lg text-ink-dim">{category.description}</p>
          </div>
        </section>

        <section className="container-site py-14 md:py-20">
          <Reveal stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article, i) => (
              <ArticleCard key={article.slug} article={article} priority={i < 3} />
            ))}
          </Reveal>
          <div className="mt-14 text-center">
            <ButtonLink href="/blog" variant="outline">
              ← All articles
            </ButtonLink>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
