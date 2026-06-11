#!/usr/bin/env node
/**
 * FluenSys content pipeline.
 *
 *   node scripts/content.mjs validate   schema-check the content lake
 *   node scripts/content.mjs sync       publish article assets to /public/blogfiles
 *   node scripts/content.mjs index      build the client search index
 *   node scripts/content.mjs build      validate + sync + index (used by `npm run build`)
 *
 * This script is the gatekeeper for authoring routines: any PR that adds or
 * edits articles must pass `validate` in CI. Keep the frontmatter schema
 * below in sync with src/lib/content/schema.ts (the app re-validates at
 * build time, so any divergence fails the Next.js build too).
 */

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import matter from "gray-matter";
import MiniSearch from "minisearch";
import { z } from "zod";

const ROOT = process.cwd();
const CONTENT = path.join(ROOT, "content");
const ARTICLES = path.join(CONTENT, "articles");
const PUBLIC_BLOGFILES = path.join(ROOT, "public", "blogfiles");
const SEARCH_INDEX = path.join(ROOT, "public", "search-index.json");

const kebab = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const isoDate = z
  .union([z.string(), z.date()])
  .transform((v) => {
    const d = v instanceof Date ? v : new Date(v);
    if (Number.isNaN(d.getTime())) throw new Error(`Invalid date: ${v}`);
    return d.toISOString().slice(0, 10);
  });

const frontmatterSchema = z.object({
  title: z.string().min(4),
  slug: z.string().regex(kebab),
  status: z.enum(["draft", "review", "published", "archived"]).default("draft"),
  category: z.string().regex(kebab),
  tags: z.array(z.string().regex(kebab)).min(1).max(8),
  authors: z.array(z.string()).min(1),
  contributors: z
    .array(z.object({ name: z.string().min(1), role: z.string().optional() }))
    .optional(),
  publishedAt: isoDate,
  updatedAt: isoDate.optional(),
  excerpt: z.string().min(40).max(360),
  featuredImage: z.string().min(1),
  featuredImageAlt: z.string().min(1),
  readingTime: z.number().int().positive().optional(),
  pdf: z.string().optional(),
  sources: z.array(z.object({ title: z.string().min(1), url: z.string().url() })).optional(),
  commission: z
    .object({
      issue: z.number().int().positive(),
      commissionedBy: z.string().min(1),
      providedPdf: z.boolean().default(false),
    })
    .optional(),
  disclaimer: z.string().optional(),
  featured: z.boolean().default(false),
  revision: z.number().int().positive().default(1),
  legacy: z
    .object({ v1Path: z.string().optional(), v1PdfPath: z.string().optional() })
    .optional(),
});

function listArticleDirs() {
  if (!fs.existsSync(ARTICLES)) return [];
  const dirs = [];
  for (const year of fs.readdirSync(ARTICLES)) {
    const yearDir = path.join(ARTICLES, year);
    if (!fs.statSync(yearDir).isDirectory()) continue;
    for (const slug of fs.readdirSync(yearDir)) {
      const dir = path.join(yearDir, slug);
      if (fs.statSync(dir).isDirectory()) dirs.push({ year, slug, dir });
    }
  }
  return dirs;
}

function loadArticles({ strict }) {
  const errors = [];
  const articles = [];
  const seenSlugs = new Set();

  const authorIds = new Set(
    fs.existsSync(path.join(CONTENT, "authors"))
      ? fs
          .readdirSync(path.join(CONTENT, "authors"))
          .filter((f) => f.endsWith(".json"))
          .map((f) => JSON.parse(fs.readFileSync(path.join(CONTENT, "authors", f), "utf-8")).id)
      : [],
  );
  const categoryIds = new Set(
    JSON.parse(
      fs.readFileSync(path.join(CONTENT, "taxonomy", "categories.json"), "utf-8"),
    ).categories.map((c) => c.id),
  );

  for (const { year, slug, dir } of listArticleDirs()) {
    const rel = path.relative(ROOT, dir);
    const mdxPath = path.join(dir, "article.mdx");
    if (!fs.existsSync(mdxPath)) {
      errors.push(`${rel}: missing article.mdx`);
      continue;
    }
    const { data, content } = matter(fs.readFileSync(mdxPath, "utf-8"));
    const parsed = frontmatterSchema.safeParse(data);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        errors.push(`${rel}: frontmatter ${issue.path.join(".") || "(root)"} — ${issue.message}`);
      }
      continue;
    }
    const fm = parsed.data;

    if (fm.slug !== slug) errors.push(`${rel}: folder name must equal frontmatter slug ("${fm.slug}")`);
    if (seenSlugs.has(fm.slug)) errors.push(`${rel}: duplicate slug "${fm.slug}"`);
    seenSlugs.add(fm.slug);

    if (!categoryIds.has(fm.category)) {
      errors.push(`${rel}: unknown category "${fm.category}" (add it to content/taxonomy/categories.json)`);
    }
    for (const author of fm.authors) {
      if (!authorIds.has(author)) errors.push(`${rel}: unknown author "${author}" (add content/authors/${author}.json)`);
    }

    // Referenced assets must exist inside the article folder.
    const assetRefs = new Set([fm.featuredImage]);
    for (const m of content.matchAll(/(?:src|image)=["']([^"']+)["']/g)) {
      const src = m[1];
      if (!src.startsWith("/") && !src.startsWith("http")) assetRefs.add(src);
    }
    for (const asset of assetRefs) {
      if (!fs.existsSync(path.join(dir, "assets", asset))) {
        errors.push(`${rel}: referenced asset not found: assets/${asset}`);
      }
    }
    if (fm.pdf && !fs.existsSync(path.join(dir, "downloads", fm.pdf))) {
      errors.push(`${rel}: pdf not found: downloads/${fm.pdf}`);
    }

    articles.push({ year, slug, dir, fm, content });
  }

  if (errors.length > 0) {
    console.error(`\n✖ Content validation failed with ${errors.length} error(s):\n`);
    for (const e of errors) console.error(`  - ${e}`);
    console.error("");
    if (strict) process.exit(1);
  }
  return articles;
}

function validate() {
  const articles = loadArticles({ strict: true });
  console.log(`✔ Content OK — ${articles.length} article(s) validated.`);
  return articles;
}

function sync() {
  fs.rmSync(PUBLIC_BLOGFILES, { recursive: true, force: true });
  let files = 0;
  for (const { year, slug, dir } of listArticleDirs()) {
    const dest = path.join(PUBLIC_BLOGFILES, year, slug);
    for (const sub of ["assets", "downloads"]) {
      const src = path.join(dir, sub);
      if (!fs.existsSync(src)) continue;
      fs.mkdirSync(dest, { recursive: true });
      for (const f of fs.readdirSync(src)) {
        fs.copyFileSync(path.join(src, f), path.join(dest, f));
        files += 1;
      }
    }
  }
  console.log(`✔ Synced ${files} article asset(s) → public/blogfiles/`);
}

function buildIndex() {
  const articles = loadArticles({ strict: false }).filter((a) => a.fm.status === "published");
  const mini = new MiniSearch({
    fields: ["title", "excerpt", "tags", "category", "body"],
    storeFields: ["title", "excerpt", "category", "tags", "url", "publishedAt", "readingTime", "image"],
  });
  mini.addAll(
    articles.map((a) => ({
      id: a.slug,
      title: a.fm.title,
      excerpt: a.fm.excerpt,
      tags: a.fm.tags.join(" "),
      category: a.fm.category,
      body: a.content.replace(/<[^>]+>/g, " ").slice(0, 5000),
      url: `/blog/${a.fm.category}/${a.slug}`,
      publishedAt: a.fm.publishedAt,
      readingTime: a.fm.readingTime ?? null,
      image: `/blogfiles/${a.year}/${a.slug}/${a.fm.featuredImage}`,
    })),
  );
  fs.mkdirSync(path.dirname(SEARCH_INDEX), { recursive: true });
  fs.writeFileSync(SEARCH_INDEX, JSON.stringify(mini.toJSON()));
  console.log(`✔ Search index built — ${articles.length} document(s) → public/search-index.json`);
}

const cmd = process.argv[2] ?? "build";
switch (cmd) {
  case "validate":
    validate();
    break;
  case "sync":
    sync();
    break;
  case "index":
    buildIndex();
    break;
  case "build":
    validate();
    sync();
    buildIndex();
    break;
  default:
    console.error(`Unknown command: ${cmd}`);
    process.exit(1);
}
