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
- [x] Routines: commission issue template + allowlisted API-dispatch
      workflow (bridges issues → Claude Code Routine), versioned routine
      prompts, PDF generation script, authoring contract (docs/03)
- [x] CI (validate → typecheck → build), licensing split, docs suite,
      CLAUDE.md, .env.example

## Phase 1 — Launch readiness

- [x] Provision Firebase project (`fluensys-2026`: Google + Anonymous
      auth, Firestore, `.firebaserc` committed) and set Vercel env vars
      (Firebase web config, `FIREBASE_SERVICE_ACCOUNT_KEY`,
      `RESEND_API_KEY`)
- [x] Vercel project connected to the repo (preview deploys on PRs)
- [x] Wire the `firestore-deploy` workflow: grant the service account
      `roles/firebase.admin` in IAM, add `FIREBASE_SERVICE_ACCOUNT_KEY`
      as a **repository secret**, then run the workflow once to green
- [ ] Create the two Claude Code routines at claude.ai/code/routines
      (commission: API trigger → repository secrets
      `CLAUDE_ROUTINE_FIRE_URL` + `CLAUDE_ROUTINE_TOKEN`; scheduled:
      weekly) per docs/03 §Create the routines, then dry-run a commission
      issue end-to-end
- [ ] Verify Firebase features end-to-end on the Vercel deployment
      (Google sign-in popup, bookmark, comment, newsletter subscribe) —
      env vars are set in Production and the Vercel + fluensys.co.uk
      domains are already in Firebase Auth Authorized domains
- [x] Resend domain verification for journal@fluensys.co.uk (DKIM/SPF on
      `send.` subdomain + combined DMARC live in Cloudflare; coexists
      with the Microsoft 365 apex MX — layout in docs/05)
- [ ] Visual QA pass on real devices (360px → 4K); Lighthouse ≥ 95 across
      the board; tune hero particle count on low-end mobile
- [ ] Legal review of privacy/terms drafts
- [ ] Favicon/wordmark refresh (current assets carried from v1)
- [ ] Analytics decision: GTM (`NEXT_PUBLIC_GTM_ID` is plumbed) and/or
      Vercel Analytics — implement consent UI before enabling

## Launch gate — domain cutover (deliberately last)

Development continues on the new stack while www.fluensys.co.uk keeps
serving v1. The DNS side is already done: Cloudflare points the apex
(A 76.76.21.21) and `www` (CNAME cname.vercel-dns.com) at Vercel — the
**v1 Vercel project simply still owns the domain assignment**. Cutover
is therefore a two-minute, instantly-reversible flip, executed only when
Phase 1 is complete and the site is signed off:

1. **Pre-flight**: every Phase 1 box ticked and a fresh Production
   deploy. (Already in place: Production env vars —
   `NEXT_PUBLIC_SITE_URL` + Firebase set — and the Firebase Auth
   Authorized domains for Vercel and fluensys.co.uk.)
2. **Release**: old Vercel project → Settings → Domains → remove
   `fluensys.co.uk` and `www.fluensys.co.uk`.
3. **Claim**: v2 project → Settings → Domains → add
   `www.fluensys.co.uk` (primary) and `fluensys.co.uk` (redirect → www).
   Verification is instant — DNS already points correctly.
4. **Smoke tests**: `/`, `/blog`, one article, `/sitemap.xml`,
   `/feed.xml`, a legacy PDF URL (expect 301 → new path), Google
   sign-in, bookmark, newsletter subscribe.
5. **Search engines**: Google Search Console + Bing — verify the domain
   property, submit `/sitemap.xml`, then crawl the v1 URL list and
   confirm every page answers 200/301 (no 404s from v1).
6. **Rollback** (if ever needed): re-add the domains to the old project —
   takes effect immediately; the v1 site remains deployed at its own
   vercel.app URL indefinitely.

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
