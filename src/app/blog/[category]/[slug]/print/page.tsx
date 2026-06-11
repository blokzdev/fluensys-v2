import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote-client/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";

import { formatDate } from "@/components/blog/ArticleCard";
import { getMdxComponents } from "@/components/mdx/components";
import { getArticle, getAuthor, getPublishedArticles } from "@/lib/content/articles";

/**
 * Print-optimised rendering of an article, used by scripts/generate-pdf.mjs
 * (Playwright page.pdf) to produce the downloadable full-article PDF.
 * Not linked from the UI and excluded from indexing.
 */

interface PrintPageProps {
  params: Promise<{ category: string; slug: string }>;
}

export function generateStaticParams() {
  return getPublishedArticles().map((a) => ({
    category: a.frontmatter.category,
    slug: a.frontmatter.slug,
  }));
}

export const dynamicParams = false;

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function PrintPage({ params }: PrintPageProps) {
  const { category, slug } = await params;
  const article = getArticle(category, slug);
  if (!article) notFound();

  const fm = article.frontmatter;
  const authors = fm.authors.map((id) => getAuthor(id)).filter((a) => a !== null);

  return (
    <div className="mx-auto max-w-[46rem] bg-white px-10 py-12 font-body text-[#1f2937]">
      <header className="border-b-2 border-[#2584C5] pb-6">
        <p className="font-mono text-[0.65rem] uppercase tracking-[0.3em] text-[#2584C5]">
          FluenSys · Pumping Systems Consultancy · fluensys.co.uk
        </p>
        <h1 className="mt-4 font-display text-3xl font-bold leading-tight text-[#0a111f]">
          {fm.title}
        </h1>
        <p className="mt-3 text-sm text-[#4b5563]">{fm.excerpt}</p>
        <p className="mt-4 text-xs text-[#6b7280]">
          {authors.map((a) => a.name).join(", ")} · {formatDate(fm.publishedAt)} · Category:{" "}
          {fm.category} · Rev {fm.revision}
        </p>
      </header>

      <article className="prose-print mt-8 text-[0.95rem] leading-relaxed [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-[#0a111f] [&_h3]:mt-6 [&_h3]:font-display [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-[#0a111f] [&_p]:mt-4 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:mt-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mt-1.5 [&_a]:text-[#2584C5] [&_figure]:my-6 [&_figcaption]:mt-2 [&_figcaption]:text-center [&_figcaption]:text-xs [&_figcaption]:text-[#6b7280] [&_img]:mx-auto [&_img]:max-h-[420px] [&_img]:w-auto [&_img]:rounded-lg [&_img]:border [&_img]:border-[#e5e7eb]">
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
      </article>

      {fm.disclaimer ? (
        <p className="mt-10 border-t border-[#e5e7eb] pt-5 text-xs leading-relaxed text-[#6b7280]">
          {fm.disclaimer}
        </p>
      ) : null}

      <footer className="mt-8 border-t-2 border-[#2584C5] pt-5 text-xs text-[#6b7280]">
        <p>
          © {new Date().getFullYear()} Fluensys Limited. All rights reserved. ·
          info@fluensys.co.uk · +44 (0) 207 101 3911
        </p>
      </footer>
    </div>
  );
}
