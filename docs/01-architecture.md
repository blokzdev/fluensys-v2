# 01 — Architecture

## System overview

```
                    GitHub (public repo, source of truth)
                    ├── content/            ← the content lake (git-native CMS)
                    ├── src/                ← Next.js 16 app
                    └── .github/workflows/  ← CI + authoring routines
                              │
        issues / cron ────────┤  (Claude-powered routines author article PRs)
                              ▼
                    Vercel build:  npm run build
                    ├── scripts/content.mjs  validate → sync assets → search index
                    └── next build           SSG of every page
                              │
                              ▼
                    Static site on Vercel Edge
                              │
        Browser ──────────────┤
                              ▼
                    Firebase Auth (guest/Google) + Firestore
                    (bookmarks, comments, newsletter subscribers)
```

## Key decisions & rationale

| Decision | Rationale |
| --- | --- |
| **Git-native content lake** (MDX folders, no CMS/DB) | Routines author via PRs; review = code review; history = git; scales to thousands of articles; survives any vendor. |
| **Everything SSG** | Articles change only via commits → static is correct, fastest, cheapest, and SEO-optimal. Firestore features are client-side islands. |
| **Next.js 16 App Router** | RSC keeps article rendering server-side (zero MDX JS shipped), metadata API, sitemap/robots/OG conventions, first-class Vercel target. |
| **Tailwind v4 tokens** | Single `@theme` block is the design system source of truth; utilities keep components terse. |
| **Firebase over email-provider** | One identity system powers newsletter + bookmarks + comments; anonymous→Google upgrade path; generous free tier; rules-enforced security. |
| **Apache-2.0 + proprietary content split** | Public repo needs a real OSS license for code (Apache adds explicit patent + trademark protection) while articles/brand stay all-rights-reserved. |
| **Playwright print-to-PDF, on demand** | PDFs generated from the same MDX source via `/blog/.../print` — one source of truth, no design drift; Playwright not in deps to keep installs light. |

## Rendering & data flow

1. **Build time** — `scripts/content.mjs build`:
   - validates every article folder against the frontmatter schema,
   - copies `assets/` + `downloads/` → `public/blogfiles/<year>/<slug>/`,
   - emits `public/search-index.json` (MiniSearch).
2. **Build time** — `next build` calls the loaders in
   `src/lib/content/articles.ts` (fs + gray-matter + zod, React-cached):
   `generateStaticParams` enumerates categories/articles; each page renders
   MDX via `next-mdx-remote-client/rsc` with the component map in
   `src/components/mdx/components.tsx`.
3. **Runtime** — pages are static HTML; client islands hydrate for motion
   (GSAP/Lenis/three) and Firebase features (auth, bookmarks, comments,
   newsletter), all of which no-op gracefully when unconfigured.

## Scale posture (1,000s of articles)

- Articles are sharded by year; loaders scan only `article.mdx` files.
- `ArticleSummary` projection keeps client payloads flat regardless of body
  size; blog index ships summaries only.
- Search is a prebuilt MiniSearch index fetched lazily; at ~5 KB/article
  the index stays acceptable into the low thousands, then moves to
  sharded-by-category indexes or a search service (roadmap).
- Build cost grows linearly; Vercel/Next ISR can be introduced per-route if
  builds ever exceed acceptable time (roadmap note, not needed now).

## URL contract

| Path | Meaning |
| --- | --- |
| `/` | Single-page brochure (anchors: #services #expertise #about #team #clients #contact) |
| `/blog` | Journal index (client filter + `?category=` legacy param) |
| `/blog/<category>` | Category page (SSG) |
| `/blog/<category>/<slug>` | Article (canonical, inherited from v1) |
| `/blog/<category>/<slug>/print` | Print layout for PDF generation (noindex) |
| `/blogfiles/<year>/<slug>/<file>` | Published article assets & PDFs |
| `/feed.xml`, `/sitemap.xml`, `/robots.txt` | Discovery |
| Legacy `/blogfiles/<year>/<month>/<file>-rev1.pdf` | 301 → new path (next.config.ts) |
