import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import matter from "gray-matter";
import readingTime from "reading-time";
import GithubSlugger from "github-slugger";

import {
  articleFrontmatterSchema,
  authorSchema,
  categorySchema,
  type Article,
  type ArticleHeading,
  type ArticleSummary,
  type Author,
  type Category,
} from "./schema";

/** Slim projection safe to pass across the server/client boundary. */
export function toSummary(article: Article): ArticleSummary {
  const fm = article.frontmatter;
  return {
    slug: fm.slug,
    title: fm.title,
    excerpt: fm.excerpt,
    category: fm.category,
    tags: fm.tags,
    publishedAt: fm.publishedAt,
    url: article.url,
    featuredImageUrl: article.featuredImageUrl,
    featuredImageAlt: fm.featuredImageAlt,
    readingTimeMins: article.readingTimeMins,
  };
}

const CONTENT_DIR = path.join(process.cwd(), "content");
const ARTICLES_DIR = path.join(CONTENT_DIR, "articles");

/** Extract h2/h3 headings from raw MDX, mirroring rehype-slug's ids. */
function extractHeadings(body: string): ArticleHeading[] {
  const slugger = new GithubSlugger();
  const headings: ArticleHeading[] = [];
  // Skip fenced code blocks so `## comments` inside code are not headings.
  let inFence = false;
  for (const line of body.split("\n")) {
    if (/^```/.test(line.trim())) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const match = /^(#{2,3})\s+(.+?)\s*$/.exec(line);
    if (!match) continue;
    const text = match[2].replace(/[*_`]/g, "").trim();
    headings.push({
      depth: match[1].length as 2 | 3,
      text,
      id: slugger.slug(text),
    });
  }
  return headings;
}

function loadArticleFromDir(year: string, slug: string): Article | null {
  const filePath = path.join(ARTICLES_DIR, year, slug, "article.mdx");
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const parsed = articleFrontmatterSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(
      `Invalid frontmatter in content/articles/${year}/${slug}/article.mdx:\n` +
        parsed.error.issues.map((i) => `  - ${i.path.join(".")}: ${i.message}`).join("\n"),
    );
  }
  const frontmatter = parsed.data;
  if (frontmatter.slug !== slug) {
    throw new Error(
      `Slug mismatch for content/articles/${year}/${slug}: frontmatter says "${frontmatter.slug}"`,
    );
  }

  const assetBase = `/blogfiles/${year}/${slug}`;
  return {
    frontmatter,
    body: content,
    year,
    url: `/blog/${frontmatter.category}/${slug}`,
    assetBase,
    featuredImageUrl: `${assetBase}/${frontmatter.featuredImage}`,
    pdfUrl: frontmatter.pdf ? `${assetBase}/${frontmatter.pdf}` : null,
    readingTimeMins:
      frontmatter.readingTime ?? Math.max(1, Math.round(readingTime(content).minutes)),
    headings: extractHeadings(content),
  };
}

/**
 * Load every article in the content lake. Cached per request/build via
 * React cache; the underlying fs scan is cheap even at thousands of
 * articles because we only read article.mdx files.
 */
export const getAllArticles = cache((): Article[] => {
  if (!fs.existsSync(ARTICLES_DIR)) return [];
  const articles: Article[] = [];
  for (const year of fs.readdirSync(ARTICLES_DIR)) {
    const yearDir = path.join(ARTICLES_DIR, year);
    if (!fs.statSync(yearDir).isDirectory()) continue;
    for (const slug of fs.readdirSync(yearDir)) {
      const article = loadArticleFromDir(year, slug);
      if (article) articles.push(article);
    }
  }
  return articles.sort((a, b) =>
    b.frontmatter.publishedAt.localeCompare(a.frontmatter.publishedAt),
  );
});

export const getPublishedArticles = cache((): Article[] =>
  getAllArticles().filter((a) => a.frontmatter.status === "published"),
);

export const getArticle = cache((category: string, slug: string): Article | null => {
  return (
    getPublishedArticles().find(
      (a) => a.frontmatter.slug === slug && a.frontmatter.category === category,
    ) ?? null
  );
});

export function getRelatedArticles(article: Article, limit = 3): Article[] {
  const tags = new Set(article.frontmatter.tags);
  return getPublishedArticles()
    .filter((a) => a.frontmatter.slug !== article.frontmatter.slug)
    .map((a) => ({
      article: a,
      score:
        (a.frontmatter.category === article.frontmatter.category ? 2 : 0) +
        a.frontmatter.tags.filter((t) => tags.has(t)).length,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.article);
}

export const getAuthors = cache((): Author[] => {
  const dir = path.join(CONTENT_DIR, "authors");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => authorSchema.parse(JSON.parse(fs.readFileSync(path.join(dir, f), "utf-8"))));
});

export const getAuthor = cache((id: string): Author | null => {
  return getAuthors().find((a) => a.id === id) ?? null;
});

export const getCategories = cache((): Category[] => {
  const file = path.join(CONTENT_DIR, "taxonomy", "categories.json");
  const { categories } = JSON.parse(fs.readFileSync(file, "utf-8")) as {
    categories: unknown[];
  };
  return categories.map((c) => categorySchema.parse(c));
});

export const getCategory = cache((id: string): Category | null => {
  return getCategories().find((c) => c.id === id) ?? null;
});

/** Categories that actually have published articles, with counts. */
export const getActiveCategories = cache((): Array<Category & { count: number }> => {
  const counts = new Map<string, number>();
  for (const a of getPublishedArticles()) {
    counts.set(a.frontmatter.category, (counts.get(a.frontmatter.category) ?? 0) + 1);
  }
  return getCategories()
    .filter((c) => counts.has(c.id))
    .map((c) => ({ ...c, count: counts.get(c.id)! }));
});
