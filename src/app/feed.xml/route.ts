import { getPublishedArticles } from "@/lib/content/articles";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/seo";

export const dynamic = "force-static";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function GET() {
  const articles = getPublishedArticles();
  const items = articles
    .map((article) => {
      const fm = article.frontmatter;
      return `    <item>
      <title>${escapeXml(fm.title)}</title>
      <link>${absoluteUrl(article.url)}</link>
      <guid isPermaLink="true">${absoluteUrl(article.url)}</guid>
      <description>${escapeXml(fm.excerpt)}</description>
      <category>${escapeXml(fm.category)}</category>
      <pubDate>${new Date(`${fm.publishedAt}T09:00:00Z`).toUTCString()}</pubDate>
      <enclosure url="${absoluteUrl(article.featuredImageUrl)}" type="image/${article.featuredImageUrl.endsWith(".jpg") || article.featuredImageUrl.endsWith(".jpeg") ? "jpeg" : "png"}" length="0"/>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(`${SITE_NAME} Journal`)}</title>
    <link>${SITE_URL}/blog</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en-gb</language>
    <atom:link href="${absoluteUrl("/feed.xml")}" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
