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
- [ ] Wire the `firestore-deploy` workflow: grant the service account
      `roles/firebase.admin` in IAM, add `FIREBASE_SERVICE_ACCOUNT_KEY`
      as a **repository secret**, then run the workflow once to green
- [ ] Create the two Claude Code routines at claude.ai/code/routines
      (commission: API trigger → repository secrets
      `CLAUDE_ROUTINE_FIRE_URL` + `CLAUDE_ROUTINE_TOKEN`; scheduled:
      weekly) per docs/03 §Create the routines, then dry-run a commission
      issue end-to-end
- [ ] Verify Firebase features on a production deploy (Google sign-in
      popup, bookmark, comment, newsletter subscribe; add the Vercel and
      fluensys.co.uk domains to Firebase Authorized domains if
      `auth/unauthorized-domain` appears)
- [ ] Resend domain verification for journal@fluensys.co.uk
      (DKIM/SPF/DMARC — runbook in docs/05 §Resend domain setup)
- [ ] Domain cutover (www.fluensys.co.uk → Vercel) + production smoke
      test (/sitemap.xml, /feed.xml, legacy PDF redirects)
- [ ] Google Search Console + Bing verification, sitemap submission
- [ ] Visual QA pass on real devices (360px → 4K); Lighthouse ≥ 95 across
      the board; tune hero particle count on low-end mobile
- [ ] Legal review of privacy/terms drafts
- [x] Favicon/wordmark refresh — volute mark + two-tone wordmark
      (`src/components/ui/Logo.tsx`), app-dir icon conventions
      (SVG + ImageResponse; single regenerated favicon.ico binary)
- [ ] Analytics decision: GTM (`NEXT_PUBLIC_GTM_ID` is plumbed) and/or
      Vercel Analytics — implement consent UI before enabling

### Shipped in the UI/UX enhancement sprint

- [x] App-platform chrome: full-screen mobile menu, article bottom
      toolbar (TOC sheet, progress ring, share, bookmark), toast system,
      Dialog/BottomSheet primitives, Lenis-aware scroll locking
- [x] PWA manifest, route loading skeletons, error boundary, skip link,
      custom scrollbar, steel token family, flow motif library
- [x] Deferred from the sprint: maskable 512px manifest icon (add
      `src/app/icon2.tsx` with safe-zone padding when wanted); React
      `viewTransition` flag (double-animation risk with Lenis/GSAP —
      cross-document CSS `@view-transition` shipped instead)

## Phase 2 — Engagement & growth

- [ ] Newsletter sending: weekly digest via Resend + Admin SDK, topic
      segmentation, one-click unsubscribe (docs/05 §Phase 2)
- [ ] "My library" page: bookmarks list, reading history
- [ ] Anonymous → Google account linking (`linkWithPopup`)
- [x] Site-wide search UI (⌘K dialog) on the prebuilt MiniSearch index
      (lazy chunk, recents, category quick links, combobox keyboard
      pattern)
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
