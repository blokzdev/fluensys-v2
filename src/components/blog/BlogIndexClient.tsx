"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { ArticleCard } from "@/components/blog/ArticleCard";
import { Reveal } from "@/components/motion/Reveal";
import { FlowDroplet } from "@/components/ui/motifs";
import type { ArticleSummary, Category } from "@/lib/content/schema";

interface BlogIndexClientProps {
  articles: ArticleSummary[];
  categories: Array<Category & { count: number }>;
}

export function BlogIndexClient({ articles, categories }: BlogIndexClientProps) {
  const searchParams = useSearchParams();
  // Honour legacy v1 links of the form /blog?category=troubleshooting.
  const initial = searchParams.get("category");
  const [active, setActive] = useState<string | null>(
    initial && categories.some((c) => c.id === initial) ? initial : null,
  );
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return articles.filter((article) => {
      if (active && article.category !== active) return false;
      if (!q) return true;
      const haystack = [article.title, article.excerpt, article.tags.join(" ")]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [articles, active, query]);

  return (
    <div>
      <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-2.5" role="group" aria-label="Filter by category">
          <button
            type="button"
            onClick={() => setActive(null)}
            aria-pressed={active === null}
            className={`rounded-full border px-4 py-2 font-display text-sm transition-colors ${
              active === null
                ? "border-azure-bright bg-azure-deep/25 text-azure-bright"
                : "border-line text-ink-dim hover:border-line-strong hover:text-ink"
            }`}
          >
            All <span className="ml-1 font-mono text-xs opacity-70">{articles.length}</span>
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setActive(active === category.id ? null : category.id)}
              aria-pressed={active === category.id}
              className={`rounded-full border px-4 py-2 font-display text-sm transition-colors ${
                active === category.id
                  ? "border-azure-bright bg-azure-deep/25 text-azure-bright"
                  : "border-line text-ink-dim hover:border-line-strong hover:text-ink"
              }`}
            >
              {category.title}{" "}
              <span className="ml-1 font-mono text-xs opacity-70">{category.count}</span>
            </button>
          ))}
        </div>

        <label className="relative md:w-72">
          <span className="sr-only">Search articles</span>
          <svg
            viewBox="0 0 24 24"
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 stroke-ink-faint"
            fill="none"
            strokeWidth="2"
            aria-hidden
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles…"
            className="card-surface h-11 w-full pl-11 pr-4 text-sm text-ink placeholder:text-ink-faint focus:border-azure-bright focus:outline-none"
          />
          <span className="mt-2 hidden text-xs text-ink-faint md:block">
            Press <kbd>/</kbd> anywhere to search everything
          </span>
        </label>
      </div>

      {filtered.length === 0 ? (
        <div className="py-20 text-center">
          <div aria-hidden className="flex items-center justify-center gap-3 text-ink-faint">
            <FlowDroplet size={10} className="opacity-40" />
            <FlowDroplet size={14} className="opacity-70" />
            <FlowDroplet size={10} className="opacity-40" />
          </div>
          <p className="mt-5 text-ink-faint">
            No articles match your filters yet — try another category or search term.
          </p>
        </div>
      ) : (
        <Reveal stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((article, i) => (
            <ArticleCard key={article.slug} article={article} priority={i < 3} />
          ))}
        </Reveal>
      )}
    </div>
  );
}
