# 03 — Authoring Routines (binding contract)

This document is the **contract** for any agent (or human) that authors
Journal articles — the GitHub-triggered routines point here as their
instruction set. Follow it exactly; CI enforces most of it.

## Triggers

| Routine | Trigger | Workflow |
| --- | --- | --- |
| **Commissioned article** | Issue with label `commission` (template: "📝 Commission an Article"), opened by a user listed in `.github/routines/authors.json` | `.github/workflows/commission-article.yml` |
| **Scheduled article** | Weekly cron (opt-in via repo variable `ENABLE_SCHEDULED_ARTICLES=true`) or manual dispatch | `.github/workflows/scheduled-article.yml` |

Secrets required: `ANTHROPIC_API_KEY` (repo secret). Unauthorized
commission issues are ignored (the authorize job fails closed).

## The two commissioning modes

### Mode A — pre-authored PDF provided

The commissioner attached a PDF to the issue (GitHub uploads it and puts a
`https://github.com/user-attachments/files/...` URL in the issue body).

1. Download the PDF.
2. Extract its substance and **formulate the web article from it**: faithful
   to the source's technical content, restructured for the web using the
   house article structure (docs/02). Do not pad or invent claims that
   aren't in the document.
3. Store the original PDF unmodified at `downloads/<slug>.pdf`.
4. Frontmatter: `commission: { issue: <n>, commissionedBy: <login>, providedPdf: true }`.
5. Create the featured image and in-article figures: extract/redraw key
   figures from the PDF where quality allows, or create clean replacements
   (`<Chart/>` for any tabular/curve data — prefer an interactive chart over
   a static plot image).

### Mode B — brief only

1. Research the topic (web search allowed; cite reputable sources —
   standards bodies, DOE, Hydraulic Institute, peer-reviewed material).
2. Author the full article per the house structure and voice
   (docs/00 §Positioning, docs/02 §Body authoring).
3. Create figures/charts where they genuinely aid understanding
   (`<Chart/>` with real, sourced data; never fabricate measurements).
4. **Author the PDF too**: after the article builds, generate it —

   ```bash
   npm run build && (npm run start &) && sleep 5
   npm i -D playwright && npx playwright install --with-deps chromium
   node scripts/generate-pdf.mjs <category> <slug>
   ```

5. Frontmatter: `commission: { issue: <n>, commissionedBy: <login>, providedPdf: false }`
   (omit the block entirely for scheduled articles).

## Authoring checklist (both modes)

1. **Folder**: `content/articles/<current-year>/<slug>/` with `article.mdx`,
   `assets/`, `downloads/`. Slug: kebab-case, descriptive, search-friendly,
   unique (`grep -r "slug: <slug>" content/` must be empty).
2. **Frontmatter**: complete per docs/02 schema. `status: review` (a human
   flips to `published` at PR review). Category from
   `content/taxonomy/categories.json`; author ids from `content/authors/`.
   Excerpt 40–360 chars, written as a meta description (it is one).
3. **Body**: house structure — standfirst, `##` sections, house sections
   (`## Why This Matters`, `## Did You Know?`, `## Further Reading`) where
   they fit. No h1, no manual author/disclaimer/download blocks. British
   English. 1,200–2,500 words unless the brief says otherwise.
4. **Figures**: every `<Figure/>` file exists in `assets/`; numbered
   captions (`Figure 1: …`); meaningful alt text. Featured image is
   mandatory — landscape, ≥1200px wide.
5. **Sources**: list authoritative references in `## Further Reading`
   and/or `sources:` frontmatter. No fabricated citations — verify URLs
   resolve.
6. **Disclaimer**: include a `disclaimer:` tailored to the topic, modelled
   on the existing articles' pattern ("While every effort has been made…").
7. **Validate**: `npm run content:validate` then `npm run build` — both
   must pass locally before pushing.
8. **PR**: branch `content/<slug>`; title `content: <article title> (#<issue>)`
   (or `(scheduled)`); body summarises the brief, editorial decisions,
   sources used and PDF provenance; `Closes #<issue>` for commissions.
   Never commit directly to main.

## Quality bar

Write as a practising consultant, not a content marketer. Concrete numbers,
field anecdotes, operating ranges, standard references (API 610, ISO 9906,
API 682…). If the brief asks for something technically dubious, say so in
the PR rather than writing it. When uncertain about a fact, qualify or omit
— the FluenSys name is on it.

## Failure handling

- Validation failure → fix and re-validate; never bypass the schema.
- PDF generation failure (Mode B) → still open the PR *without* the `pdf:`
  frontmatter key, and note the failure in the PR body so a human can run
  `npm run pdf` locally.
- Ambiguous brief → make the most defensible choice and flag it in the PR
  body; do not stall.
