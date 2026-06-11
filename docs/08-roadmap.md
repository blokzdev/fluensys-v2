# 08 — Roadmap

Tick items off as they ship; add context links to PRs. Phases are
priorities, not strict gates.

## Phase 0 — Foundation ✅ (this repo bootstrap)

- [x] Content lake architecture + schema + validation pipeline
- [x] v1 content migration (5 articles, 18 figures, 5 PDFs, full site copy,
      team/clients/testimonials, certifications)
- [x] Next.js 16 app: home (hero/pillars/expertise/consultancy/about/team/
      clients/testimonials/CTA/journal promo), blog index + category +
      article + print routes
- [x] Design system (tokens, type, motion grammar) + GSAP/Lenis motion +
      WebGL hero flow field
- [x] SEO layer: metadata, JSON-LD, sitemap, robots, RSS, legacy redirects
- [x] Firebase client layer: guest/Google auth, bookmarks, comments,
      newsletter capture + firestore.rules
- [x] Routines: commission issue template + allowlisted workflow, scheduled
      workflow, PDF generation script, authoring contract (docs/03)
- [x] CI (validate → typecheck → build), licensing split, docs suite,
      CLAUDE.md, .env.example

## Phase 1 — Launch readiness

- [ ] Provision Firebase project + deploy rules; set Vercel env vars
- [ ] Vercel project + domain cutover (www.fluensys.co.uk)
- [ ] Google Search Console + Bing verification, sitemap submission
- [ ] Visual QA pass on real devices (360px → 4K); Lighthouse ≥ 95 across
      the board; tune hero particle count on low-end mobile
- [ ] Legal review of privacy/terms drafts
- [ ] Favicon/wordmark refresh (current assets carried from v1)
- [ ] Analytics decision: GTM (`NEXT_PUBLIC_GTM_ID` is plumbed) and/or
      Vercel Analytics — implement consent UI before enabling

## Phase 2 — Engagement & growth

- [ ] Newsletter sending: weekly digest via Resend + Admin SDK, topic
      segmentation, one-click unsubscribe (docs/05 §Phase 2)
- [ ] "My library" page: bookmarks list, reading history
- [ ] Anonymous → Google account linking (`linkWithPopup`)
- [ ] Site-wide search UI (⌘K dialog) on the prebuilt MiniSearch index
- [ ] Comment moderation queue (status field + admin route with
      `FIREBASE_SERVICE_ACCOUNT_KEY`) + Firebase App Check
- [ ] Dynamic OG title cards (`next/og`) for articles
- [ ] Author profile pages (`/authors/<id>`) with Person schema

## Phase 3 — Content platform depth

- [ ] Article series support (`series:` frontmatter + series nav)
- [ ] Interactive 3D article figures (R3F pump cutaways/flow visualisations
      as MDX components)
- [ ] Engineering calculators as MDX components (NPSH margin, affinity
      laws, energy-saving estimator) — strong lead magnets
- [ ] Math rendering (remark-math + KaTeX) when an article first needs it
- [ ] Case-study template + gated "premium PDF" lead capture experiments
- [ ] Routine: revision pass (cron agent reviews oldest `published`
      articles for currency, opens update PRs)
- [ ] Search index sharding by category when index size warrants it

## Phase 4 — Scale & polish

- [ ] ISR/PPR evaluation if build times grow with article count
- [ ] Light theme (tokens are structured to allow it; dark remains default)
- [ ] Localised landing pages if non-UK demand appears
- [ ] A/B testing of CTAs (Vercel Edge Middleware)
