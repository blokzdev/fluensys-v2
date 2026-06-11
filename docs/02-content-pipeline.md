# 02 — Content Pipeline (the Content Lake)

The content lake is the heart of the platform: a git-native, schema-enforced
library designed to stay **highly structured, indexed and actionable** at
thousands of articles, for both humans and authoring routines.

## Anatomy of an article

```
content/articles/<year>/<slug>/
├── article.mdx          # frontmatter + body — single source of truth
├── assets/              # every image/data file the article references
│   ├── <figure files>.png|jpg|svg|webp
│   └── *.chart.json     # (optional) datasets for <Chart/> if externalised
└── downloads/
    └── <slug>.pdf       # the downloadable full article
```

Rules:

- `<year>` = publication year (sharding keeps directories listable).
- `<slug>` = kebab-case, globally unique, equals `frontmatter.slug` —
  validation fails otherwise.
- Everything an article needs lives inside its folder. No cross-article
  asset references. Deleting the folder removes the article cleanly.
- At build, `assets/` + `downloads/` are published flat to
  `/blogfiles/<year>/<slug>/` (script: `scripts/content.mjs sync`).

## Frontmatter schema

Authoritative definitions: `src/lib/content/schema.ts` (app) and
`scripts/content.mjs` (CI gate) — **keep in sync**.

```yaml
---
title: "Troubleshooting Centrifugal Pumps: A Comprehensive Guide"   # 4+ chars
slug: troubleshooting-centrifugal-pumps     # kebab-case, = folder name
status: published          # draft | review | published | archived
category: troubleshooting  # must exist in content/taxonomy/categories.json
tags:                      # 1–8, kebab-case
  - centrifugal-pumps
  - troubleshooting
authors:                   # 1+, ids from content/authors/*.json
  - jean-noel-bajeet
contributors:              # optional display credits
  - name: "Sabbir Mahmood"
    role: "Lead Process Consultant"
publishedAt: 2024-09-13
updatedAt: 2024-09-13      # optional; bump on revisions
excerpt: "40–360 chars. Doubles as meta description and card text."
featuredImage: hero.png    # filename inside assets/
featuredImageAlt: "Flow instabilities in a centrifugal impeller"
readingTime: 7             # optional minutes; computed from body if absent
pdf: troubleshooting-centrifugal-pumps.pdf  # optional, inside downloads/
sources:                   # optional further-reading registry
  - title: "Hydraulic Institute — Pump Systems Matter"
    url: "https://www.pumps.org/pump-systems-matter/"
commission:                # present only on commissioned articles
  issue: 123
  commissionedBy: blokzdev
  providedPdf: true        # true = author supplied the PDF
disclaimer: "Per-article technical disclaimer, rendered after the body."
featured: false            # pin to highlights (future use)
revision: 1                # bump on substantive edits
legacy:                    # only on migrated v1 articles
  v1Path: /blog/troubleshooting/troubleshooting-centrifugal-pumps
  v1PdfPath: /blogfiles/2024/09/troubleshooting-centrifugal-pumps-rev1.pdf
---
```

## Body authoring (MDX)

Markdown (GFM) plus these components — the complete authoring surface:

| Component | Use |
| --- | --- |
| `<Figure src="file.png" alt="…" caption="Figure 1: …" />` | Images from `assets/` (bare filename — resolution to `/blogfiles/...` is automatic). Always numbered captions: `Figure N: description`. |
| `<Chart type="line|area|bar" title="…" x="key" xLabel="…" yLabel="…" data={[…]} series={[{key, label}]} />` | Interactive charts (Recharts). Inline data for ≤ ~40 rows; cite the data source in the caption or surrounding text. |
| `<Callout kind="note|tip|warning|insight" title="…">…</Callout>` | Asides; use sparingly. |
| Standard MD tables | Comparison/spec tables (GFM). |

Structure conventions (established by the migrated corpus — follow them):

- Open with a 1–2 sentence standfirst paragraph (no heading).
- `##` sections for the substance; `###` sparingly.
- House sections, in order, where applicable: `## Why This Matters`,
  `## Did You Know?`, `## Further Reading`, `## Summary` / `## Conclusions`.
- No `#` h1 in the body (the page renders the title), no manual author/
  contact/disclaimer blocks (frontmatter handles them), no "Download PDF"
  blocks (the layout renders the download card from `pdf:`).

## Registries

- **Authors** — `content/authors/<id>.json`: id, name, displayName,
  credentials, role, expertise, bio, avatar, email, linkedin, isTeamMember,
  canCommission. Referenced by frontmatter `authors:`; unknown ids fail
  validation.
- **Categories** — `content/taxonomy/categories.json`: id, title,
  description, accent. Adding a category here is all that's needed — pages,
  filters and sitemap pick it up automatically.
- **Site copy** — `content/site/*.json` (company, home, team, clients,
  testimonials): structured copy for the brochure pages, migrated verbatim
  from v1 and edited in place.

## Pipeline commands

```bash
npm run content:validate  # schema + referential integrity + asset existence
npm run content:sync      # publish assets → public/blogfiles/
npm run content:index     # rebuild public/search-index.json
npm run content:build     # all three (runs automatically in npm run build)
```

Validation enforces: schema-valid frontmatter, slug=folder, unique slugs,
known category & authors, every referenced asset present (featuredImage,
`src=` references, pdf). CI runs it on every PR — a malformed routine
contribution cannot merge.

## Lifecycle

`draft` → `review` → `published` → (`archived`). Only `published` articles
render, index, and feed. Routines open PRs with `status: review`; a human
flips to `published` during PR review (or asks the routine to).

## Updating an existing article

Edit `article.mdx`, bump `revision`, set `updatedAt`, regenerate the PDF if
the body changed (`npm run pdf -- <category> <slug>`), and PR. Git history
is the audit trail.
