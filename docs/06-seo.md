# 06 — SEO & Discoverability

The Journal's growth channel is technical long-tail search. SEO is treated
as a build-time feature of the platform, not an afterthought.

## What's implemented

| Surface | Implementation |
| --- | --- |
| Canonical URLs | `/blog/<category>/<slug>` — inherited from v1, never change. `alternates.canonical` on every page. |
| Metadata | Root template in `src/app/layout.tsx`; per-page `generateMetadata` (title, description=excerpt, OG/Twitter cards with featured image, article OG type with publish/modified times, section, tags). |
| Structured data | JSON-LD: `ProfessionalService` + `WebSite` (home), `TechArticle` + `Person` authors (articles), `BreadcrumbList` (all blog pages). Builders in `src/lib/seo.ts`. |
| Sitemap | `src/app/sitemap.ts` — home, blog index, categories, every published article with lastmod. |
| Robots | `src/app/robots.ts` — allow all, disallow print routes, sitemap pointer. Print pages additionally `noindex` via metadata. |
| RSS | `/feed.xml` (route handler) — full item set with categories and featured-image enclosures. |
| Legacy continuity | 301s for v1 PDF URLs (`next.config.ts`); `?category=` filter param honoured on `/blog`; v1 article paths unchanged. |
| Performance | Full SSG, `next/image` (AVIF/WebP, sized), lazy WebGL chunk, font subsetting via `next/font`. Core Web Vitals are ranking inputs — keep first-load JS lean (budget in CLAUDE.md). |
| i18n signals | `lang="en-GB"`, `og:locale en_GB`, `inLanguage en-GB`. |

## Editorial SEO rules (authors & routines)

1. **Slug = primary query.** Kebab-case, front-load the subject
   (`cryogenic-pump-seal-failures`, not `some-thoughts-on-seals`).
2. **Title ≤ 60 chars**, benefit-or-specificity led; excerpt is the meta
   description — write it for the SERP (40–360 chars enforced; the sweet
   spot is 140–160).
3. **One h1 (rendered from frontmatter); `##` sections phrased as queries**
   where natural ("Why do cryogenic pumps fail?") — they become TOC anchors
   and featured-snippet bait.
4. **Figures**: descriptive filenames and alt text (image search traffic).
5. **Internal links**: link related articles inline where genuinely
   relevant; the related-articles block (category + tag scoring) does the
   rest.
6. **Tags are taxonomy, not hashtags**: reuse existing tags
   (`grep -rh "  - " content/articles/*/*/article.mdx | sort | uniq -c`)
   before minting new ones.

## Verification & monitoring (operator runbook)

- Google Search Console: verify domain property, submit
  `https://www.fluensys.co.uk/sitemap.xml` after launch; watch coverage and
  the Core Web Vitals report.
- Validate structured data on a sample article with the Rich Results test
  after any change to `src/lib/seo.ts`.
- Bing Webmaster Tools: import from GSC.
- After DNS cutover, crawl the old sitemap URLs and confirm 200/301 — no
  404s from v1.

## Roadmap items (see 08)

Dynamic OG image generation (branded title cards via `next/og`), author
pages with `Person` schema, `FAQPage` schema for Q&A-structured articles,
hreflang if non-UK English variants ever ship.
