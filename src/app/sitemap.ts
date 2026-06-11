import type { MetadataRoute } from "next";

import { getActiveCategories, getPublishedArticles } from "@/lib/content/articles";
import { absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getPublishedArticles();
  const lastArticle = articles[0]?.frontmatter.updatedAt ?? articles[0]?.frontmatter.publishedAt;

  return [
    {
      url: absoluteUrl("/"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: absoluteUrl("/blog"),
      lastModified: lastArticle ? new Date(lastArticle) : new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...getActiveCategories().map((category) => ({
      url: absoluteUrl(`/blog/${category.id}`),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...articles.map((article) => ({
      url: absoluteUrl(article.url),
      lastModified: new Date(article.frontmatter.updatedAt ?? article.frontmatter.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
