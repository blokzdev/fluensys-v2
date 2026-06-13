import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote-client/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ArticleCard, formatDate } from "@/components/blog/ArticleCard";
import { BookmarkButton } from "@/components/blog/BookmarkButton";
import { Comments } from "@/components/blog/Comments";
import { MobileToolbar } from "@/components/blog/MobileToolbar";
import { NewsletterForm } from "@/components/blog/NewsletterForm";
import { ReadingProgress } from "@/components/blog/ReadingProgress";
import { ShareBar } from "@/components/blog/ShareBar";
import { Toc } from "@/components/blog/Toc";
import { getMdxComponents } from "@/components/mdx/components";
import { Reveal } from "@/components/motion/Reveal";
import {
  getArticle,
  getAuthor,
  getCategory,
  getPublishedArticles,
  getRelatedArticles,
  toSummary,
} from "@/lib/content/articles";
import { absoluteUrl, articleJsonLd, breadcrumbJsonLd } from "@/lib/seo";

interface ArticlePageProps {
  params: Promise<{ category: string; slug: string }>;
}

export function generateStaticParams() {
  return getPublishedArticles().map((a) => ({
    category: a.frontmatter.category,
    slug: a.frontmatter.slug,
  }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { category, slug } = await params;
  const article = getArticle(category, slug);
  if (!article) return {};
  const fm = article.frontmatter;
  return {
    title: fm.title,
    description: fm.excerpt,
    alternates: { canonical: article.url },
    authors: fm.authors
      .map((id) => getAuthor(id))
      .filter(Boolean)
      .map((a) => ({ name: a!.name })),
    openGraph: {
      type: "article",
      title: fm.title,
      description: fm.excerpt,
      url: article.url,
      publishedTime: fm.publishedAt,
      modifiedTime: fm.updatedAt ?? fm.publishedAt,
      section: fm.category,
      tags: fm.tags,
      images: [
        {
          url: article.featuredImageUrl,
          width: 1200,
          height: 630,
          alt: fm.featuredImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fm.title,
      description: fm.excerpt,
      images: [article.featuredImageUrl],
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { category: categoryId, slug } = await params;
  const article = getArticle(categoryId, slug);
  if (!article) notFound();

  const fm = article.frontmatter;
  const category = getCategory(fm.category);
  const authors = fm.authors.map((id) => getAuthor(id)).filter((a) => a !== null);
  const related = getRelatedArticles(article).map(toSummary);

  const jsonLd = [
    articleJsonLd(article, authors),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Journal", path: "/blog" },
      { name: category?.title ?? fm.category, path: `/blog/${fm.category}` },
      { name: fm.title, path: article.url },
    ]),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <ReadingProgress />
      <MobileToolbar
        headings={article.headings}
        title={fm.title}
        url={absoluteUrl(article.url)}
        article={{
          slug: fm.slug,
          title: fm.title,
          category: fm.category,
          url: article.url,
        }}
      />
      <main id="main-content" className="pb-24 pt-[72px] lg:pb-0">
        {/* ------------------------------------------------ Article header */}
        <section className="relative overflow-hidden border-b border-line">
          <div aria-hidden className="bg-blueprint absolute inset-0 opacity-30" />
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,#15578a45,transparent_72%)]"
          />
          <div className="container-site relative py-14 md:py-20">
            <nav aria-label="Breadcrumb" className="mb-8">
              <ol className="flex flex-wrap items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-ink-faint">
                <li>
                  <Link href="/" className="transition-colors hover:text-azure-bright">
                    Home
                  </Link>
                </li>
                <li aria-hidden>/</li>
                <li>
                  <Link href="/blog" className="transition-colors hover:text-azure-bright">
                    Journal
                  </Link>
                </li>
                <li aria-hidden>/</li>
                <li>
                  <Link
                    href={`/blog/${fm.category}`}
                    className="text-azure-bright transition-colors hover:text-azure"
                  >
                    {category?.title ?? fm.category}
                  </Link>
                </li>
              </ol>
            </nav>

            <h1 className="text-display max-w-4xl text-3xl font-bold leading-[1.12] text-ink sm:text-4xl lg:text-5xl text-balance">
              {fm.title}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-dim">{fm.excerpt}</p>

            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
              <div className="flex items-center gap-3">
                {authors.map((author) => (
                  <div key={author.id} className="flex items-center gap-3">
                    <Image
                      src={author.avatar}
                      alt=""
                      width={40}
                      height={40}
                      className="rounded-full border border-line-strong object-cover"
                    />
                    <div>
                      <p className="text-sm font-medium text-ink">{author.name}</p>
                      <p className="text-xs text-ink-faint">{author.role}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="font-mono text-xs uppercase tracking-[0.15em] text-ink-faint">
                {formatDate(fm.publishedAt)} · {article.readingTimeMins} min read
              </p>
              <div className="flex items-center gap-3">
                <ShareBar title={fm.title} url={absoluteUrl(article.url)} />
                <BookmarkButton
                  article={{
                    slug: fm.slug,
                    title: fm.title,
                    category: fm.category,
                    url: article.url,
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------ Body + sidebar */}
        <div className="container-site grid gap-14 py-14 lg:grid-cols-[1fr_280px] lg:py-20">
          <article className="min-w-0">
            <Reveal>
              <figure className="card-surface mb-12 overflow-hidden">
                <Image
                  src={article.featuredImageUrl}
                  alt={fm.featuredImageAlt}
                  width={1280}
                  height={720}
                  priority
                  sizes="(max-width: 1024px) 100vw, 70vw"
                  className="h-auto w-full object-cover"
                />
              </figure>
            </Reveal>

            <div className="prose-fluensys">
              <MDXRemote
                source={article.body}
                components={getMdxComponents(article)}
                options={{
                  mdxOptions: {
                    remarkPlugins: [remarkGfm],
                    rehypePlugins: [rehypeSlug],
                  },
                }}
              />
            </div>

            {fm.disclaimer ? (
              <aside className="card-surface mt-12 border-l-2 border-amber-400/40 p-6">
                <p className="text-eyebrow mb-3">Disclaimer</p>
                <p className="text-xs leading-relaxed text-ink-faint">{fm.disclaimer}</p>
              </aside>
            ) : null}

            {fm.contributors && fm.contributors.length > 0 ? (
              <div className="mt-10 border-t border-line pt-8">
                <p className="text-eyebrow mb-4">Contributors</p>
                <ul className="grid gap-2">
                  {fm.contributors.map((c) => (
                    <li key={c.name} className="text-sm text-ink-dim">
                      <span className="font-medium text-ink">{c.name}</span>
                      {c.role ? <span className="text-ink-faint"> — {c.role}</span> : null}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {/* Author bios */}
            <div className="mt-12 grid gap-5">
              {authors.map((author) => (
                <div key={author.id} className="card-surface flex flex-col gap-5 p-7 sm:flex-row">
                  <Image
                    src={author.avatar}
                    alt={author.name}
                    width={72}
                    height={72}
                    className="h-[72px] w-[72px] shrink-0 rounded-2xl border border-line-strong object-cover"
                  />
                  <div>
                    <p className="text-display text-lg font-semibold text-ink">
                      {author.name}
                      {author.credentials ? (
                        <span className="ml-2 font-mono text-xs font-normal text-ink-faint">
                          {author.credentials}
                        </span>
                      ) : null}
                    </p>
                    <p className="mt-0.5 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-azure-bright">
                      {author.role}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-ink-dim">{author.bio}</p>
                    {author.linkedin ? (
                      <a
                        href={author.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-display mt-3 inline-flex items-center gap-2 text-sm text-azure-bright transition-all hover:gap-3"
                      >
                        Connect on LinkedIn <span aria-hidden>→</span>
                      </a>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>

            <Comments slug={fm.slug} />
          </article>

          {/* Sidebar */}
          <aside className="order-first lg:order-none">
            <div className="grid gap-8 lg:sticky lg:top-28">
              {article.pdfUrl ? (
                <div className="card-surface p-6">
                  <p className="text-eyebrow mb-3">Full article</p>
                  <p className="text-sm leading-relaxed text-ink-dim">
                    Get the PDF version for offline reading and sharing.
                  </p>
                  <a
                    href={article.pdfUrl}
                    download
                    className="text-display mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-azure px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-azure-bright"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden
                    >
                      <path
                        d="M12 3v12m0 0 4-4m-4 4-4-4M4 21h16"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Download PDF
                  </a>
                </div>
              ) : null}

              <div className="hidden lg:block">
                <Toc headings={article.headings} />
              </div>

              <div className="hidden lg:block">
                <p className="text-eyebrow mb-4">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {fm.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-line px-3 py-1 font-mono text-[0.65rem] text-ink-faint"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* ------------------------------------------------ Related + subscribe */}
        {related.length > 0 ? (
          <section className="border-t border-line bg-surface py-16 md:py-24">
            <div className="container-site">
              <h2 className="text-display mb-10 text-2xl font-semibold text-ink sm:text-3xl">
                Related articles
              </h2>
              <Reveal stagger className="grid gap-6 md:grid-cols-3">
                {related.map((r) => (
                  <ArticleCard key={r.slug} article={r} />
                ))}
              </Reveal>
            </div>
          </section>
        ) : null}

        <section className="border-t border-line">
          <div className="container-site grid items-center gap-10 py-16 md:grid-cols-2">
            <div>
              <h2 className="text-display text-2xl font-semibold text-ink sm:text-3xl">
                Subscribe to the Journal
              </h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-dim">
                Field-tested pumping systems insight, straight to your inbox.
              </p>
            </div>
            <NewsletterForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
