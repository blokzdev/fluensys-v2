# 07 — Deployment & Operations

## Vercel (hosting)

1. Import `blokzdev/fluensys-v2` into Vercel (framework auto-detected:
   Next.js; build command `npm run build` — includes the content pipeline).
2. Set environment variables from `.env.example` (Production + Preview):
   `NEXT_PUBLIC_SITE_URL` (production: `https://www.fluensys.co.uk`;
   previews can omit → falls back to the production URL for metadata) and
   the `NEXT_PUBLIC_FIREBASE_*` block once Firebase is provisioned.
3. Domains: add `www.fluensys.co.uk` (primary) and `fluensys.co.uk`
   (redirect → www). Update DNS at the registrar (CNAME www →
   cname.vercel-dns.com; A/ALIAS apex per Vercel's instructions).
4. Node version: 22.x (default). No other settings needed — no serverless
   functions beyond Next defaults; everything is static.

## Firebase

Provision per docs/05 §Setup. Rules deploys are manual
(`firebase deploy --only firestore:rules`) and should accompany any PR that
changes `firestore.rules`.

## GitHub repository configuration

| Setting | Value |
| --- | --- |
| Secret `ANTHROPIC_API_KEY` | required for authoring routines |
| Variable `ENABLE_SCHEDULED_ARTICLES` | `true` to activate the weekly routine |
| Branch protection on `main` | require the CI check ("Validate, typecheck & build"); routines and humans both merge via PR |
| `.github/routines/authors.json` | keep the commissioner allowlist current |

## Release flow

```
feature/content branch → PR → CI (validate → typecheck → build) → review →
merge to main → Vercel production deploy (automatic)
```

Content PRs from routines follow the same path — a human review of the PR
is the editorial gate (flip `status: review` → `published` there).

## Operational runbook

- **Add an authorized commissioner**: edit `.github/routines/authors.json`
  (PR). For credited authorship also add `content/authors/<id>.json` and a
  template option in `.github/ISSUE_TEMPLATE/commission-article.yml`.
- **Add a category**: `content/taxonomy/categories.json` (+ optionally the
  newsletter topics list in `NewsletterForm.tsx` and the issue template
  dropdown). Pages/filters/sitemap pick it up automatically.
- **Regenerate a PDF**: `npm run build && npm run start &` then
  `npm run pdf -- <category> <slug>` (Playwright install instructions print
  if missing); commit the new file, bump `revision`/`updatedAt`.
- **Export newsletter subscribers**: Firebase console → Firestore →
  `newsletterSubscribers` (client reads are rules-blocked by design).
- **Emergency unpublish**: set `status: archived` in the article
  frontmatter and merge — it leaves pages, sitemap, feed and search index
  at the next deploy.

## Monitoring

- Vercel Analytics/Speed Insights can be enabled per-project (no code
  change required to start; revisit a `@vercel/analytics` integration in
  the roadmap).
- GitHub Actions tab is the routine audit log; every authored article is a
  PR with full provenance (issue link, prompt, diff).
