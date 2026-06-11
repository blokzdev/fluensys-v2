# CLAUDE.md — FluenSys v2

You are working on the **FluenSys** platform: the marketing site, knowledge
hub ("the Journal") and lead-generation engine for Fluensys Limited, an
independent UK pumping-systems consultancy (fluensys.co.uk). You act as lead
architect, engineer and designer. Decisions that aren't covered here are
documented in `/docs` — read the relevant doc before changing a subsystem.

## Mission

Establish FluenSys as **the** authoritative voice in pumping systems
consultancy. Everything serves three goals, in order:

1. **Authority** — impeccable technical content, impeccable presentation.
2. **Traffic** — flawless SEO, performance and shareability.
3. **Leads & readership** — newsletter growth, service enquiries, returning
   readers (bookmarks, comments).

## Stack

| Layer       | Choice                                                | Notes |
| ----------- | ----------------------------------------------------- | ----- |
| Framework   | Next.js 16 (App Router, RSC, static-first), TypeScript strict | All blog pages are SSG via `generateStaticParams` |
| Styling     | Tailwind CSS v4 (`@theme` tokens in `src/styles/globals.css`) | Dark-only design system — see docs/04-design-system.md |
| Motion      | GSAP 3 (+ ScrollTrigger, SplitText, `@gsap/react`), Lenis smooth scroll | Always gate behind `prefers-reduced-motion` |
| 3D          | three.js via React Three Fiber + drei                  | Lazy-loaded, shader-driven, DPR-clamped |
| Content     | Git-native MDX "content lake" in `/content`            | THE core architecture — docs/02-content-pipeline.md |
| Data/Auth   | Firebase (anonymous + Google auth) + Firestore         | Bookmarks, comments, newsletter — docs/05-firebase.md |
| Charts      | Recharts via the `<Chart/>` MDX component              | |
| Hosting     | Vercel                                                 | Env vars: `.env.example` |

## Golden rules

1. **The content lake is sacred.** Articles live in
   `content/articles/<year>/<slug>/` (article.mdx + assets/ + downloads/).
   Never bypass the frontmatter schema (`src/lib/content/schema.ts`,
   mirrored in `scripts/content.mjs` — keep both in sync). Validate with
   `npm run content:validate` after touching content.
2. **Static first.** No runtime fs reads, no server data fetching for
   content. Pass `ArticleSummary` (never full `Article` with body) across
   the server→client boundary.
3. **Graceful degradation.** The site must build and run with zero env
   vars. Firebase-dependent UI hides itself when unconfigured. WebGL/motion
   fall back cleanly (reduced-motion, save-data).
4. **Preserve URLs.** Canonical article path is `/blog/<category>/<slug>`
   (inherited from v1 — do not change). Legacy v1 asset URLs are redirected
   in `next.config.ts`.
5. **SEO is a feature.** Every new page gets metadata, canonical, JSON-LD
   where applicable, and joins sitemap.ts. Article OG images come from
   featured images.
6. **Licensing split.** Code = Apache-2.0 (LICENSE). Content =
   all-rights-reserved (content/LICENSE.md, NOTICE). Never relicense
   content; never add code under other licenses without flagging it.
7. **British English** in user-facing copy ("optimisation" in prose is
   fine; existing v1 copy used both — don't churn migrated text).

## Commands

```bash
npm run dev               # content:sync + next dev
npm run build             # content:build (validate+sync+index) + next build
npm run typecheck         # tsc --noEmit
npm run content:validate  # schema-check the content lake (CI gate)
npm run content:build     # validate + publish assets + search index
npm run pdf -- <category> <slug>   # generate article PDF (needs running site + playwright)
```

CI (`.github/workflows/ci.yml`) runs validate → typecheck → build. All three
must pass before any PR is mergeable.

## Repository map

```
content/                  # CONTENT LAKE (see docs/02-content-pipeline.md)
  articles/<year>/<slug>/ #   article.mdx + assets/ + downloads/<slug>.pdf
  authors/*.json          #   author registry (referenced by frontmatter)
  taxonomy/categories.json#   category registry
  site/*.json             #   structured site copy (home, team, clients…)
docs/                     # architecture & operating docs (numbered, start at 00)
scripts/content.mjs       # validate | sync | index | build
scripts/generate-pdf.mjs  # print-route → PDF (Playwright, on-demand install)
src/lib/content/          # schema (zod) + loaders (fs, React cache)
src/lib/firebase/         # lazy client, db helpers
src/lib/seo.ts            # site constants + JSON-LD builders
src/components/           # home/ blog/ mdx/ motion/ three/ layout/ ui/ auth/ providers/
src/app/                  # routes (/, /blog, /blog/[category], /blog/[category]/[slug], print, feed.xml, sitemap, robots)
.github/workflows/        # ci + commission dispatch + firestore auto-deploy
.github/routines/         # commissioner allowlist + versioned routine prompts
firestore.rules           # security rules — review on any Firestore change
```

## Authoring routines

Articles are authored by **Claude Code Routines** (claude.ai/code/routines
— cloud sessions on the operator's claude.ai subscription; no model API
keys in this repo). docs/03-routines.md is the binding contract — folder
layout, frontmatter, PDF rules, validation, PR conventions. Commission
issues are gated by `.github/routines/authors.json` and bridged to the
routine's API trigger by `.github/workflows/commission-dispatch.yml`; the
scheduled routine is configured entirely in the Claude app. The live
routine prompts are versioned in `.github/routines/*-routine.md` — keep
them in sync with the app. If you change the content schema, update:
`src/lib/content/schema.ts`, `scripts/content.mjs`,
docs/02-content-pipeline.md and docs/03-routines.md — in the same PR.

## Design language (summary — full spec in docs/04-design-system.md)

"Precision engineering, dark water": abyss-navy surfaces, azure (#2584C5
brand, #4aa8e8 bright) + green (#72BF44) accents, Space Grotesk display /
Inter body / JetBrains Mono data, blueprint grid textures, masked line-rise
headings (SplitText), restrained scroll reveals, one WebGL statement piece
(the hero flow field) — never gratuitous 3D. Motion must be 60fps
(transform/opacity only) and fully disabled under reduced motion.

## When you finish a change

1. `npm run content:validate && npm run typecheck && npm run build`
2. If you touched content schema/pipeline/routines: update the paired docs.
3. Keep `docs/08-roadmap.md` honest — tick off what you shipped.

## What NOT to do

- Don't add heavy dependencies for marginal wins (bundle budget:
  first-load JS < 200 kB on articles; the three.js chunk only on `/`).
- Don't introduce a CMS, database-stored content, or image CDNs — the git
  content lake + Vercel image optimization is the architecture.
- Don't render Firebase-dependent UI on the server or block paint on auth.
- Don't change `/blog/<category>/<slug>` URL structure or remove legacy
  redirects.
