# FluenSys — Pumping Systems Consultancy Platform

The marketing site, knowledge hub and lead-generation engine for
[Fluensys Limited](https://www.fluensys.co.uk) — an independent UK
engineering consultancy with 50+ years of pump & fluids expertise.

Immersive Next.js 16 experience (GSAP + Lenis + three.js/R3F), a git-native
MDX **content lake** built to scale to thousands of enriched articles
(figures, interactive charts, downloadable PDFs), AI **authoring routines**
driven by GitHub Issues/cron, and Firebase-powered engagement (guest &
Google sign-in, bookmarks, comments, newsletter).

## Quick start

```bash
npm install
cp .env.example .env.local   # optional — site runs fully without env vars
npm run dev                  # http://localhost:3000
```

| Command | What it does |
| --- | --- |
| `npm run dev` | sync article assets + dev server |
| `npm run build` | validate content → publish assets → search index → static build |
| `npm run typecheck` | TypeScript |
| `npm run content:validate` | schema-check the content lake (CI gate) |
| `npm run pdf -- <category> <slug>` | generate an article PDF (running site + Playwright required) |

## How it fits together

```
content/   ← articles (MDX+assets+PDF per folder), authors, taxonomy, site copy
src/       ← Next.js app: static-first pages, GSAP/three motion, Firebase islands
scripts/   ← content pipeline (validate/sync/index) + PDF generation
.github/   ← CI + authoring routines (commission via issue, weekly scheduled)
docs/      ← the operating manual — start at docs/00-vision.md
```

Read **[CLAUDE.md](CLAUDE.md)** (engineering ground rules) and the
**[docs/](docs)** suite before contributing:

- [00 Vision](docs/00-vision.md) · [01 Architecture](docs/01-architecture.md)
- [02 Content pipeline](docs/02-content-pipeline.md) · [03 Authoring routines](docs/03-routines.md)
- [04 Design system](docs/04-design-system.md) · [05 Firebase](docs/05-firebase.md)
- [06 SEO](docs/06-seo.md) · [07 Deployment](docs/07-deployment.md) · [08 Roadmap](docs/08-roadmap.md)

## Commissioning an article

Open a **"📝 Commission an Article"** issue (template provided). Authorized
authors (`.github/routines/authors.json`) trigger the routine: attach a
pre-authored PDF to have the web article formulated from it, or provide a
brief and the routine researches, writes, illustrates and generates the PDF
— always delivered as a PR for human review.

## License

**Split licensing** (see [NOTICE](NOTICE)):

- **Code** — [Apache License 2.0](LICENSE).
- **Content & brand** (`content/`, imagery, PDFs, the FluenSys name) —
  © Fluensys Limited, all rights reserved ([content/LICENSE.md](content/LICENSE.md)).
