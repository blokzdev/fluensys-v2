import Image from "next/image";
import Link from "next/link";

import { FlowDroplet } from "@/components/ui/motifs";
import type { ArticleSummary } from "@/lib/content/schema";

export function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function ArticleCard({
  article,
  priority = false,
}: {
  article: ArticleSummary;
  priority?: boolean;
}) {
  return (
    <article className="card-surface group relative flex flex-col overflow-hidden transition-transform duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-1.5">
      <Link
        href={article.url}
        className="absolute inset-0 z-10 rounded-[var(--radius-card)]"
        aria-label={article.title}
      />
      <div className="relative aspect-[16/9] overflow-hidden bg-surface-2">
        <Image
          src={article.featuredImageUrl}
          alt={article.featuredImageAlt}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.05]"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-surface/70 to-transparent"
        />
        <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-line-strong bg-abyss/70 px-3 py-1 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-azure-bright backdrop-blur-sm">
          <FlowDroplet size={8} />
          {article.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-ink-faint">
          {formatDate(article.publishedAt)} · {article.readingTimeMins} min read
        </p>
        <h3 className="text-display mt-3 text-lg font-semibold leading-snug text-ink transition-colors duration-300 group-hover:text-azure-bright">
          {article.title}
        </h3>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-ink-dim">
          {article.excerpt}
        </p>
        <span className="text-display mt-5 inline-flex items-center gap-2 text-sm text-azure-bright transition-all duration-300 group-hover:gap-3">
          Read article <span aria-hidden>→</span>
        </span>
      </div>
    </article>
  );
}
