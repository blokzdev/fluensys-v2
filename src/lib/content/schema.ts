import { z } from "zod";

/**
 * Canonical article frontmatter contract.
 *
 * Every article folder under content/articles/<year>/<slug>/ must contain an
 * article.mdx whose frontmatter validates against this schema. The same
 * schema is enforced by `npm run content:validate` (scripts/content.mjs) in
 * CI, so authoring routines fail fast on malformed contributions.
 */

const isoDate = z.union([z.string(), z.date()]).transform((value) => {
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) {
    throw new Error(`Invalid date: ${String(value)}`);
  }
  return d.toISOString().slice(0, 10);
});

export const articleStatusSchema = z.enum(["draft", "review", "published", "archived"]);

export const contributorSchema = z.object({
  name: z.string().min(1),
  role: z.string().optional(),
});

export const sourceSchema = z.object({
  title: z.string().min(1),
  url: z.string().url(),
});

export const commissionSchema = z.object({
  issue: z.number().int().positive(),
  commissionedBy: z.string().min(1),
  providedPdf: z.boolean().default(false),
});

export const articleFrontmatterSchema = z.object({
  title: z.string().min(4),
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug must be kebab-case"),
  status: articleStatusSchema.default("draft"),
  category: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "category must be kebab-case"),
  tags: z.array(z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)).min(1).max(8),
  authors: z.array(z.string()).min(1),
  contributors: z.array(contributorSchema).optional(),
  publishedAt: isoDate,
  updatedAt: isoDate.optional(),
  excerpt: z.string().min(40).max(360),
  featuredImage: z.string().min(1),
  featuredImageAlt: z.string().min(1),
  readingTime: z.number().int().positive().optional(),
  pdf: z.string().optional(),
  sources: z.array(sourceSchema).optional(),
  commission: commissionSchema.optional(),
  disclaimer: z.string().optional(),
  featured: z.boolean().default(false),
  revision: z.number().int().positive().default(1),
  legacy: z
    .object({
      v1Path: z.string().optional(),
      v1PdfPath: z.string().optional(),
    })
    .optional(),
});

export type ArticleFrontmatter = z.infer<typeof articleFrontmatterSchema>;

export const authorSchema = z.object({
  id: z.string(),
  name: z.string(),
  displayName: z.string(),
  credentials: z.string().optional().default(""),
  role: z.string(),
  expertise: z.string().optional().default(""),
  bio: z.string(),
  avatar: z.string(),
  email: z.string().optional().default(""),
  linkedin: z.string().optional().default(""),
  isTeamMember: z.boolean().default(false),
  canCommission: z.boolean().default(false),
});

export type Author = z.infer<typeof authorSchema>;

export const categorySchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  accent: z.string().default("azure"),
});

export type Category = z.infer<typeof categorySchema>;

export interface ArticleHeading {
  depth: 2 | 3;
  text: string;
  id: string;
}

/**
 * Lightweight projection of an article for cards, lists and client
 * components — never includes the MDX body, so it stays cheap to serialize
 * even with thousands of articles.
 */
export interface ArticleSummary {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  publishedAt: string;
  url: string;
  featuredImageUrl: string;
  featuredImageAlt: string;
  readingTimeMins: number;
}

/** A fully resolved article, ready for rendering. */
export interface Article {
  frontmatter: ArticleFrontmatter;
  /** Raw MDX body (frontmatter stripped). */
  body: string;
  /** Publication year folder, e.g. "2024". */
  year: string;
  /** Canonical site path, e.g. /blog/troubleshooting/vfds-in-pumping-systems */
  url: string;
  /** Public base URL for this article's synced assets. */
  assetBase: string;
  /** Absolute public URL of the featured image. */
  featuredImageUrl: string;
  /** Public URL of the downloadable PDF, if any. */
  pdfUrl: string | null;
  /** Reading time in minutes (frontmatter override or computed). */
  readingTimeMins: number;
  /** Extracted h2/h3 headings for the table of contents. */
  headings: ArticleHeading[];
}
