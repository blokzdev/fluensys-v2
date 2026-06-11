import type { Article, Author } from "./content/schema";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.fluensys.co.uk"
).replace(/\/$/, "");

export const SITE_NAME = "FluenSys";
export const SITE_TITLE = "FluenSys — Pumping Systems Consultancy";
export const SITE_DESCRIPTION =
  "Independent UK engineering consultancy with 50+ years of pump & fluids expertise. " +
  "Pump design, troubleshooting, system optimization and Net Zero strategies for heavy industry and SMEs.";

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function organizationJsonLd(
  contact: {
    email: string;
    phone: string;
    address: string;
  },
  team?: Array<{ name: string; position: string; linkedin: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}/#organization`,
    name: "Fluensys Limited",
    alternateName: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl("/apple-touch-icon.png"),
    description: SITE_DESCRIPTION,
    email: contact.email,
    telephone: contact.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: "35 Westcliffe House",
      addressLocality: "London",
      postalCode: "N1 3HS",
      addressCountry: "GB",
    },
    areaServed: "GB",
    knowsAbout: [
      "Centrifugal pumps",
      "Pumping systems",
      "Pump troubleshooting",
      "Computational fluid dynamics",
      "Net Zero strategy",
      "Energy efficiency",
    ],
    sameAs: ["https://x.com/fluensys", "https://uk.linkedin.com/company/fluensys-ltd"],
    ...(team && team.length > 0
      ? {
          employee: team.map((member) => ({
            "@type": "Person",
            name: member.name,
            jobTitle: member.position,
            url: member.linkedin || undefined,
            worksFor: { "@id": `${SITE_URL}/#organization` },
          })),
        }
      : {}),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

export function articleJsonLd(article: Article, authors: Author[]) {
  const fm = article.frontmatter;
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: fm.title,
    description: fm.excerpt,
    image: [absoluteUrl(article.featuredImageUrl)],
    datePublished: fm.publishedAt,
    dateModified: fm.updatedAt ?? fm.publishedAt,
    inLanguage: "en-GB",
    mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(article.url) },
    author: authors.map((a) => ({
      "@type": "Person",
      name: a.name,
      jobTitle: a.role,
      url: a.linkedin || undefined,
    })),
    publisher: { "@id": `${SITE_URL}/#organization` },
    keywords: fm.tags.join(", "),
    articleSection: fm.category,
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
