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

Provision per docs/05 §Setup. Rules & index deploys are automated: the
`firestore-deploy` workflow runs whenever `firestore.rules` or
`firestore.indexes.json` change on `main` (manual fallback:
`firebase deploy --only firestore` from any clone, or workflow dispatch).

## GitHub repository configuration

| Setting | Value |
| --- | --- |
| Secret `CLAUDE_ROUTINE_FIRE_URL` | the commission routine's API-trigger URL (docs/03 §Create the routines) |
| Secret `CLAUDE_ROUTINE_TOKEN` | the commission routine's bearer token (shown once — store immediately) |
| Secret `FIREBASE_SERVICE_ACCOUNT_KEY` | single-line service-account JSON; powers the `firestore-deploy` workflow |
| Branch protection on `main` | require the CI check ("Validate, typecheck & build"); routines and humans both merge via PR |
| `.github/routines/authors.json` | keep the commissioner allowlist current |

No model API keys are stored anywhere: authoring runs as Claude Code
Routines (claude.ai/code/routines) on the operator's claude.ai
subscription. The two routines themselves (commission API-triggered,
scheduled weekly) are created once in the Claude app — full steps in
docs/03-routines.md §Create the routines.

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
- **Rotate the routine token**: routine detail page → API trigger modal →
  Regenerate; update the `CLAUDE_ROUTINE_TOKEN` repo secret.
- **Re-trigger a commission**: remove and re-apply the `commission` label
  on the issue (the dispatch fires on the `labeled` event).
- **Pause the scheduled routine**: toggle it off on its detail page at
  claude.ai/code/routines (configuration is retained).
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
- Routine runs are auditable end-to-end: the dispatch run in the GitHub
  Actions tab, the live session transcript at claude.ai/code/routines
  (linked from the workflow's comment on the issue), and the resulting PR
  diff. Note a green run status only means the session completed — read
  the transcript/PR to confirm the task itself succeeded.
