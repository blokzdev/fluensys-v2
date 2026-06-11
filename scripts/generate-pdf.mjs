#!/usr/bin/env node
/**
 * Generate the downloadable full-article PDF from the print route.
 *
 *   node scripts/generate-pdf.mjs <category> <slug> [--base-url http://localhost:3000]
 *
 * Output: content/articles/<year>/<slug>/downloads/<slug>.pdf
 *
 * Requirements (installed on demand — Playwright is intentionally NOT a
 * package.json dependency to keep installs light):
 *
 *   npm i -D playwright && npx playwright install --with-deps chromium
 *
 * Typical flow (local or in a routine):
 *   npm run build && npm run start &     # serve the site
 *   node scripts/generate-pdf.mjs troubleshooting my-article-slug
 *
 * See docs/03-routines.md for how authoring routines use this.
 */

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const [category, slug] = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const baseUrlArg = process.argv.find((a) => a.startsWith("--base-url"));
const BASE_URL =
  (baseUrlArg ? baseUrlArg.split("=")[1] : null) ??
  process.env.PDF_BASE_URL ??
  "http://localhost:3000";

if (!category || !slug) {
  console.error("Usage: node scripts/generate-pdf.mjs <category> <slug> [--base-url=URL]");
  process.exit(1);
}

// Locate the article folder (content/articles/<year>/<slug>).
const articlesRoot = path.join(process.cwd(), "content", "articles");
let articleDir = null;
for (const year of fs.readdirSync(articlesRoot)) {
  const candidate = path.join(articlesRoot, year, slug);
  if (fs.existsSync(path.join(candidate, "article.mdx"))) {
    articleDir = candidate;
    break;
  }
}
if (!articleDir) {
  console.error(`✖ No article folder found for slug "${slug}" under content/articles/`);
  process.exit(1);
}

let chromium;
try {
  ({ chromium } = await import("playwright"));
} catch {
  console.error(
    "✖ Playwright is not installed. Run:\n" +
      "    npm i -D playwright && npx playwright install --with-deps chromium",
  );
  process.exit(1);
}

const url = `${BASE_URL}/blog/${category}/${slug}/print`;
const outDir = path.join(articleDir, "downloads");
const outFile = path.join(outDir, `${slug}.pdf`);
fs.mkdirSync(outDir, { recursive: true });

console.log(`→ Rendering ${url}`);
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  const response = await page.goto(url, { waitUntil: "networkidle", timeout: 60_000 });
  if (!response || !response.ok()) {
    throw new Error(`Print route returned ${response ? response.status() : "no response"}`);
  }
  await page.pdf({
    path: outFile,
    format: "A4",
    printBackground: true,
    margin: { top: "14mm", bottom: "16mm", left: "14mm", right: "14mm" },
    displayHeaderFooter: true,
    headerTemplate: "<span></span>",
    footerTemplate: `
      <div style="width:100%;font-size:8px;color:#6b7280;display:flex;justify-content:space-between;padding:0 14mm;">
        <span>© Fluensys Limited — fluensys.co.uk</span>
        <span class="pageNumber"></span>
      </div>`,
  });
  console.log(`✔ PDF written → ${path.relative(process.cwd(), outFile)}`);
  console.log(
    `  Remember to reference it in frontmatter:  pdf: ${slug}.pdf  and re-run npm run content:build`,
  );
} finally {
  await browser.close();
}
