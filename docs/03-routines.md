# 03 — Authoring Routines (binding contract)

This document is the **contract** for any agent (or human) that authors
Journal articles — the Claude Code Routines' prompts point here as their
instruction set. Follow it exactly; CI enforces most of it.

## How the routines run

Authoring runs as **Claude Code Routines** (claude.ai/code/routines):
saved cloud sessions on Anthropic-managed infrastructure, drawing on the
operator's claude.ai subscription — **no `ANTHROPIC_API_KEY` or other
model credentials live in this repo**. Each run clones the repo from
`main`, works on a `claude/`-prefixed branch (the routine default — leave
"Allow unrestricted branch pushes" off), and opens a PR. Branch protection
+ required CI on `main` remain the merge gate.

| Routine | Trigger | Repo-side piece |
| --- | --- | --- |
| **Commissioned article** | Issue labeled `commission` (template: "📝 Commission an Article") → `.github/workflows/commission-dispatch.yml` checks the author allowlist and POSTs the issue context to the routine's **API trigger** | dispatch workflow + secrets |
| **Scheduled article** | The routine's own **Schedule trigger** (weekly recommended) | none — configured entirely in the Claude app |

Why API-dispatch for commissions rather than the routine's native GitHub
trigger: routine GitHub triggers currently support only `pull_request` and
`release` events (not issues), and the in-repo dispatch keeps the
allowlist gate fail-closed and auditable in version control. The dispatch
fires on the `labeled` event, so re-applying the `commission` label
re-triggers a commission.

The instruction prompts for both routines are **versioned in this repo** —
`.github/routines/commission-routine.md` and
`.github/routines/scheduled-routine.md`. If you change them, update the
live routines to match (and vice versa).

## Create the routines (one-time operator setup)

1. At [claude.ai/code/routines](https://claude.ai/code/routines) create
   **"FluenSys: Commission Article"**: repo `blokzdev/fluensys-v2`, paste
   the prompt from `.github/routines/commission-routine.md`, pick a strong
   model (Opus-class), Default environment.
2. Trigger: **API** → save → copy the fire URL and generate the token
   (shown once). Add both as **repository secrets** —
   `CLAUDE_ROUTINE_FIRE_URL` and `CLAUDE_ROUTINE_TOKEN`
   (Settings → Secrets and variables → Actions → Secrets tab →
   Repository secrets; not environment secrets, not variables).
3. **Connectors**: remove all of them — the routine needs only the repo,
   shell and web access. (Connectors run with write access and no
   approval prompts; least privilege applies.)
4. **Permissions**: leave branch pushes restricted to `claude/` prefixes.
5. Repeat for **"FluenSys: Scheduled Article"** with the prompt from
   `.github/routines/scheduled-routine.md` and a **Schedule** trigger
   (weekly). No repo secrets needed.
6. Environment note: the Default (Trusted) network policy covers GitHub
   and npm. Mode-B PDF generation downloads a Chromium build via
   Playwright — if that download is blocked in a run, either add the
   Playwright CDN domains to the environment's Allowed domains or accept
   the contract's PDF-failure fallback (PR lands without the PDF; a human
   runs `npm run pdf` locally).

Routine runs act under the operator's GitHub identity (commits/PRs appear
as that user) and consume claude.ai subscription usage; daily routine-run
caps apply. Watch any run live via the session URL the dispatch workflow
comments on the issue.

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
8. **PR**: branch `claude/content-<slug>` (routines may only push
   `claude/`-prefixed branches); title `content: <article title> (#<issue>)`
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
