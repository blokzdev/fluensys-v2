import { ArticleCard } from "@/components/blog/ArticleCard";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import type { ArticleSummary } from "@/lib/content/schema";
import type { HomeContent } from "@/lib/content/site";

export function BlogPromo({
  content,
  articles,
}: {
  content: HomeContent["blogPromo"];
  articles: ArticleSummary[];
}) {
  return (
    <section className="relative border-t border-line bg-surface py-24 md:py-32">
      <div aria-hidden className="bg-blueprint absolute inset-0 opacity-25" />
      <div className="container-site relative">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="The Journal"
            title={content.title}
            subtitle={content.subtitle}
          />
          <Reveal className="mb-12 md:mb-16">
            <ButtonLink href="/blog" variant="outline">
              {content.latestPostsButtonText} <span aria-hidden>→</span>
            </ButtonLink>
          </Reveal>
        </div>

        <Reveal stagger className="grid gap-6 md:grid-cols-3">
          {articles.slice(0, 3).map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
